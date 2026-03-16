// Debounce: multiple rapid snapshot fires (e.g. page load) →  one single stats refresh
let _statsDebounceTimer = null;
function debouncedFetchStats() {
    clearTimeout(_statsDebounceTimer);
    _statsDebounceTimer = setTimeout(function () {
        if (typeof fetchDashboardStats === "function") {
            fetchDashboardStats();
        }
    }, 400);
}

let isInitialLoad = true;

function initRealtimeUpdates() {
    console.log("Global Listener Active...");

    const collections = ['emergency_reports', 'reports'];

    collections.forEach(colName => {
        db.collection(colName).onSnapshot((snapshot) => {
            
            if (isInitialLoad) {
                isInitialLoad = false;
                return;
            }

            let hasNewDoc = snapshot.docChanges().some(change => change.type === "added");

            if (hasNewDoc) {
                debouncedFetchStats();
                handleNewAlerts(snapshot, colName);
            }
        });
    });
}

function handleNewAlerts(snapshot, type) {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            const reportTime = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            if (Math.abs(new Date() - reportTime) < 30000) {
                triggerSweetEmergencyAlert(data, type, change.doc.id);
            }
        }
    });
}

function readGeoPointLike(value) {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const latCandidate = value.latitude ?? value.lat ?? value._lat;
    const lngCandidate = value.longitude ?? value.lng ?? value.lon ?? value._long ?? value._lng;
    if (latCandidate === undefined || lngCandidate === undefined) {
        return null;
    }

    return { latitude: latCandidate, longitude: lngCandidate };
}

function parseCoordinate(value, min, max) {
    if (typeof value === 'object') {
        const geo = readGeoPointLike(value);
        if (geo) {
            return parseCoordinate(min === -90 ? geo.latitude : geo.longitude, min, max);
        }
        return null;
    }

    if (value === null || value === undefined) {
        return null;
    }

    const numeric = Number.parseFloat(String(value).trim());
    if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
        return null;
    }

    return numeric;
}

function getAlertCoordinates(data) {
    const locationGeo = readGeoPointLike(data.location) || readGeoPointLike(data.coordinates) || readGeoPointLike(data.geoPoint);
    const latitudeValue = data.latitude ?? data.lat ?? data.geoLat ?? (locationGeo ? locationGeo.latitude : null);
    const longitudeValue = data.longitude ?? data.lng ?? data.geoLng ?? (locationGeo ? locationGeo.longitude : null);

    return {
        latitude: parseCoordinate(latitudeValue, -90, 90),
        longitude: parseCoordinate(longitudeValue, -180, 180)
    };
}

function getAlertAddress(data) {
    const candidates = [
        data.address,
        data.Address,
        data.location && data.location.address,
        data.locationAddress,
        data.addressText
    ];

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
            return candidate.trim();
        }
    }

    return '';
}

function buildMapUrl(data, type, docId, coordinates) {
    if (coordinates.latitude === null || coordinates.longitude === null) {
        return null;
    }

    const params = new URLSearchParams();
    params.set('lat', coordinates.latitude);
    params.set('lng', coordinates.longitude);

    const severity = data.severity || data.priority;
    if (severity) {
        params.set('priority', severity);
    }

    if (type === 'emergency_reports') {
        const sosRef = docId || data.reportId;
        if (sosRef) {
            params.set('sosId', String(sosRef));
        }
    } else {
        const reportRef = docId || data.reportId;
        if (reportRef) {
            params.set('reportId', String(reportRef));
        }
    }

    return `map.html?${params.toString()}`;
}

function buildDetailsUrl(type, docId, data) {
    if (type === 'emergency_reports') {
        const sosRef = docId || data.reportId;
        return sosRef ? `sos-details.html?sosId=${encodeURIComponent(String(sosRef))}` : null;
    }

    const reportRef = docId || data.reportId;
    return reportRef ? `report-details.html?reportId=${encodeURIComponent(String(reportRef))}` : null;
}

function triggerSweetEmergencyAlert(data, type, docId) {
    const isSOS = (type === 'emergency_reports');

    // Sound play
    const audio = document.getElementById('sos-audio');
    if (audio) audio.play().catch(e => console.warn("Sound blocked"));

    // Coordinates check
    const coordinates = getAlertCoordinates(data);
    const hasCoordinates = coordinates.latitude !== null && coordinates.longitude !== null;
    const mapUrl = buildMapUrl(data, type, docId, coordinates);
    const detailsUrl = buildDetailsUrl(type, docId, data);
    const addressText = getAlertAddress(data);

    let tableHtml = '<table style="width:100%; text-align:left; border-collapse:collapse; font-size:15px; margin-top:10px;">';

    if (data.categoryName || data.category) {
        tableHtml += `<tr style="border-bottom: 1px solid #eee;"><td style="padding:10px 5px;"><b>Category</b></td><td style="padding:10px 5px;">${data.categoryName || data.category}</td></tr>`;
    }

    if (data.severity || data.priority) {
        tableHtml += `<tr style="border-bottom: 1px solid #eee;"><td style="padding:10px 5px;"><b>Severity</b></td><td style="padding:10px 5px;"><span class="badge bg-danger">${data.severity || data.priority}</span></td></tr>`;
    }

    if (!isSOS && data.message && data.message !== "-") {
        tableHtml += `<tr style="border-bottom: 1px solid #eee;"><td style="padding:10px 5px;"><b>Message</b></td><td style="padding:10px 5px;">${data.message}</td></tr>`;
    }

    if (addressText) {
        tableHtml += `<tr><td style="padding:10px 5px;"><b>Location</b></td><td style="padding:10px 5px; font-style: italic; color: #666;">${addressText}</td></tr>`;
    } else if (hasCoordinates) {
        tableHtml += `<tr><td style="padding:10px 5px;"><b>Coordinates</b></td><td style="padding:10px 5px; color: #666;">${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}</td></tr>`;
    }

    tableHtml += '</table>';

    Swal.fire({
        title: isSOS ? '🚨 SOS ALERT DETECTED!' : '📝 NEW EMERGENCY REPORT',
        html: tableHtml,
        icon: isSOS ? 'warning' : 'info',
        target: 'body',
        showConfirmButton: Boolean(mapUrl),
        confirmButtonText: 'View on Map',
        confirmButtonColor: '#d33',
        showDenyButton: true,
        denyButtonText: detailsUrl ? 'View Details' : 'Go to List',
        denyButtonColor: '#696cff',
        showCancelButton: true,
        cancelButtonText: 'Close',
        backdrop: isSOS ? 'rgba(255, 0, 0, 0.4)' : 'rgba(105, 108, 255, 0.1)',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed && mapUrl) {
            window.location.href = mapUrl;
        } else if (result.isDenied) {
            if (detailsUrl) {
                window.location.href = detailsUrl;
                return;
            }

            if (typeof loadPage === 'function') loadPage(isSOS ? 'sos' : 'reports');
            else window.location.href = isSOS ? 'sos.html' : 'reports.html';
        }
    });
}