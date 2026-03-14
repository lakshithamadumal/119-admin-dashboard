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

function initRealtimeUpdates() {
    console.log("Global Listener Active...");

    const collections = ['emergency_reports', 'reports', 'users', 'operators', 'admins', 'categories', 'notifications', 'app_settings'];

    collections.forEach(colName => {
        db.collection(colName).onSnapshot((snapshot) => {
            debouncedFetchStats();

            if (colName === 'emergency_reports' || colName === 'reports') {
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
                triggerSweetEmergencyAlert(data, type);
            }
        }
    });
}

function triggerSweetEmergencyAlert(data, type) {
    const isSOS = (type === 'emergency_reports');

    // Sound play
    const audio = document.getElementById('sos-audio');
    if (audio) audio.play().catch(e => console.warn("Sound blocked"));

    // Coordinates check
    let latitude = data.latitude ?? data.lat ?? (data.location ? data.location.latitude : null);
    let longitude = data.longitude ?? data.lng ?? (data.location ? data.location.longitude : null);
    const hasCoordinates = latitude != null && longitude != null;

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

    if (data.address) {
        tableHtml += `<tr><td style="padding:10px 5px;"><b>Location</b></td><td style="padding:10px 5px; font-style: italic; color: #666;">${data.address}</td></tr>`;
    } else if (hasCoordinates) {
        tableHtml += `<tr><td style="padding:10px 5px;"><b>Coordinates</b></td><td style="padding:10px 5px; color: #666;">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</td></tr>`;
    }

    tableHtml += '</table>';

    Swal.fire({
        title: isSOS ? '🚨 SOS ALERT DETECTED!' : '📝 NEW EMERGENCY REPORT',
        html: tableHtml,
        icon: isSOS ? 'warning' : 'info',
        target: 'body',
        showConfirmButton: hasCoordinates,
        confirmButtonText: 'View on Map',
        confirmButtonColor: '#d33',
        showDenyButton: true,
        denyButtonText: 'Go to Reports',
        denyButtonColor: '#696cff',
        showCancelButton: true,
        cancelButtonText: 'Close',
        backdrop: isSOS ? 'rgba(255, 0, 0, 0.4)' : 'rgba(105, 108, 255, 0.1)',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed && hasCoordinates) {
            window.location.href = `map.html?lat=${latitude}&lng=${longitude}`;
        } else if (result.isDenied) {
            if (typeof loadPage === 'function') loadPage(isSOS ? 'sos' : 'reports');
            else window.location.href = isSOS ? 'sos.html' : 'reports.html';
        }
    });
}