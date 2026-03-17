
const STATUS_FLOW = ['Received', 'Assigned', 'In Progress', 'Completed'];
const STATUS_TIMESTAMP_FIELD_MAP = {
    Assigned: 'assignedTimestamp',
    'In Progress': 'inProgressTimestamp',
    Completed: 'completedTimestamp'
};

let activeReportDocId = null;
let activeReportStatus = 'Received';
let activeReportPublicId = null;
let activeReportSeverity = 'Low';
let activeReportLatitude = null;
let activeReportLongitude = null;
let activeReportUserId = null;
let activeReportDescription = '-';
let activeStatusHistory = {
    Received: '-',
    Assigned: '-',
    'In Progress': '-',
    Completed: '-'
};

async function renderReportDetailsPage(docId) {
    if (!docId) return;

    try {
        console.log("Fetching data for Report:", docId);
        const resolved = await resolveReportDocument(docId);
        if (!resolved) {
            showLocationAlert('error', 'Report Not Found', 'Unable to load this report details record.');
            return;
        }

        activeReportDocId = resolved.docId;
        const report = resolved.data;
        activeReportStatus = report.status || 'Received';
        activeReportUserId = report.uid || report.userId || report.authUid || null;

        const userDoc = await db.collection('users').doc(report.uid).get();
        const user = userDoc.exists ? userDoc.data() : {};

        setTextById('modal-user-name', user.name || '-');
        setTextById('modal-user-email', user.email || '-');
        setTextById('modal-user-phone', user.phoneNumber || '-');
        setTextById('modal-user-registered', "Verified User");
        setTextById('modal-user-address', user.address || '-');
        setTextById('modal-user-nic', user.nicNumber || '-');

        setTextById('modal-medical-blood', user.bloodGroup || '-');
        setTextById('modal-medical-allergies', user.allergies || '-');
        setTextById('modal-medical-conditions', user.medicalConditions || '-');
        setTextById('modal-medical-contact', user.emergencyContact1 ? `${user.emergencyNick1 || 'Contact'}: ${user.emergencyContact1}` : '-');

        setTextById('modal-membership-plan', user.paymentStatus === 'Active' ? 'Premium Plan' : 'Basic');
        setTextById('modal-membership-status', user.paymentStatus || 'Inactive');
        
        if (user.expiryDate) {
            const expDate = new Date(user.expiryDate).toLocaleDateString();
            setTextById('modal-membership-expire', expDate);
            setTextById('detail-subscription-expiry', expDate); 
        }

        const coordinates = getReportCoordinates(report);
        activeReportPublicId = report.reportId || resolved.docId;
        activeReportSeverity = report.severity || report.priority || 'Low';
        activeReportLatitude = coordinates.latitude;
        activeReportLongitude = coordinates.longitude;
        activeReportDescription = String(report.message || report.description || '').trim() || '-';

        setTextById('detail-report-id', activeReportPublicId);
        setTextById('detail-report-category', report.categoryName || '-');
        setTextById('detail-report-status', report.status || 'Received');
        setTextById('detail-report-latitude', coordinates.latitude !== null ? coordinates.latitude : '-');
        setTextById('detail-report-longitude', coordinates.longitude !== null ? coordinates.longitude : '-');
        setTextById('detail-report-description', activeReportDescription || '-');
        setTextById('detail-report-created', report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : '-');
        setTextById('detail-report-address', report.address || '-');

        setTextById('detail-user-name', user.name || '-');
        setTextById('detail-user-email', user.email || '-');
        setTextById('detail-user-phone', user.phoneNumber || '-');
        setTextById('detail-user-registered', 'Verified');
        setTextById('detail-user-address', user.address || '-');
        setTextById('detail-user-nic', user.nicNumber || '-');
        setTextById('detail-user-total-reports', user.totalReports || '0');
        
        setTextById('detail-medical-blood', user.bloodGroup || '-');
        setTextById('detail-medical-allergies', user.allergies || '-');
        setTextById('detail-medical-conditions', user.medicalConditions || '-');
        setTextById('detail-medical-medications', user.currentMedications || '-');
        setTextById('detail-subscription-status', user.paymentStatus || '-');
        
        setTextById('detail-ec1-name', user.emergencyNick1 || '-');
        setTextById('detail-ec1-phone', user.emergencyContact1 || '-');
        setTextById('detail-ec2-name', user.emergencyNick2 || '-');
        setTextById('detail-ec2-phone', user.emergencyContact2 || '-');

        const priorityBadge = document.getElementById('detail-report-priority');
        if (priorityBadge) {
            const severity = report.severity || report.priority || 'Low';
            priorityBadge.textContent = severity;
            priorityBadge.className = `badge bg-label-${badgeFromPriority(severity)}`;
        }

        const mediaImage = document.getElementById('detail-media-image');
        if (mediaImage && report.imageUrls && report.imageUrls.length > 0) {
            mediaImage.innerHTML = `<img src="${report.imageUrls[0]}" class="img-fluid rounded border shadow-sm" style="max-height: 250px;">`;
        }

        const history = {
            Received: report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : "-",
            Assigned: report.assignedTimestamp?.toDate ? report.assignedTimestamp.toDate().toLocaleString() : "-",
            "In Progress": report.inProgressTimestamp?.toDate ? report.inProgressTimestamp.toDate().toLocaleString() : "-",
            Completed: report.completedTimestamp?.toDate ? report.completedTimestamp.toDate().toLocaleString() : "-"
        };
        activeStatusHistory = history;
        
        updateStatusTimelineUI(activeReportStatus, history);
        updateStatusActionButtons(activeReportStatus);

    } catch (e) {
        console.error("Data Load Error:", e);
        showLocationAlert('error', 'Data Load Error', 'Failed to load report data. Please refresh and try again.');
    }
}

async function resolveReportDocument(identifier) {
    const normalized = String(identifier || '').trim();
    if (!normalized) {
        return null;
    }

    const byDoc = await db.collection('reports').doc(normalized).get();
    if (byDoc.exists) {
        return { docId: byDoc.id, data: byDoc.data() };
    }

    const byReportId = await db.collection('reports')
        .where('reportId', '==', normalized)
        .limit(1)
        .get();

    if (!byReportId.empty) {
        const matchedDoc = byReportId.docs[0];
        return { docId: matchedDoc.id, data: matchedDoc.data() };
    }

    return null;
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

function getReportCoordinates(report) {
    const locationGeo = readGeoPointLike(report.location) || readGeoPointLike(report.coordinates) || readGeoPointLike(report.geoPoint);
    const latitudeValue = report.latitude ?? report.lat ?? report.geoLat ?? (locationGeo ? locationGeo.latitude : null);
    const longitudeValue = report.longitude ?? report.lng ?? report.geoLng ?? (locationGeo ? locationGeo.longitude : null);

    return {
        latitude: parseCoordinate(latitudeValue, -90, 90),
        longitude: parseCoordinate(longitudeValue, -180, 180)
    };
}

function showLocationAlert(icon, title, text) {
    if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: 'OK'
        });
        return;
    }

    alert(`${title}\n${text}`);
}

function detailViewMap() {
    if (activeReportLatitude === null || activeReportLongitude === null) {
        showLocationAlert('warning', 'Location Missing', 'No latitude/longitude found for this report.');
        return;
    }

    const params = new URLSearchParams();
    params.set('lat', activeReportLatitude);
    params.set('lng', activeReportLongitude);
    params.set('priority', activeReportSeverity || 'Low');

    if (activeReportDocId) {
        params.set('reportId', activeReportDocId);
    } else if (activeReportPublicId) {
        params.set('reportId', activeReportPublicId);
    }

    window.open(`map.html?${params.toString()}`, '_blank', 'noopener');
}

function detailCopyLocation() {
    if (activeReportLatitude === null || activeReportLongitude === null) {
        showLocationAlert('warning', 'Location Missing', 'No latitude/longitude found for this report.');
        return;
    }

    const googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(`${activeReportLatitude},${activeReportLongitude}`)}`;
    copyTextToClipboard(googleMapsLink);
}

function updateStatusTimelineUI(currentStatus, history) {
    const steps = STATUS_FLOW;
    const currentIdx = steps.indexOf(currentStatus);
    const stepColors = {
        Received: '#7367f0',
        Assigned: '#facc15',
        'In Progress': '#f97316',
        Completed: '#22c55e'
    };

    steps.forEach((step, idx) => {
        const stepKey = step.toLowerCase().replace(/\s/g, '');
        const dot = document.getElementById(`sdot-${stepKey}`);
        const line = document.getElementById(`sline-${stepKey}`);
        const timeEl = document.getElementById(`stime-${stepKey}`);
        const activeColor = stepColors[step] || '#7367f0';

        if (dot) {
            if (idx <= currentIdx) {
                dot.style.background = activeColor;
                dot.style.color = "#fff";
                dot.style.borderColor = activeColor;
            } else {
                dot.style.background = "#f0f0f0";
                dot.style.color = "#adb5bd";
                dot.style.borderColor = "#dee2e6";
            }
        }
        if (line) {
            const nextStep = steps[idx + 1];
            const nextColor = stepColors[nextStep] || '#7367f0';
            line.style.background = idx < currentIdx ? nextColor : "#dee2e6";
        }
        if (timeEl) timeEl.textContent = history[step] || '-';
    });

    const statusBadge = document.getElementById('detail-status-badge');
    if (statusBadge) {
        statusBadge.textContent = currentStatus || 'Received';
        statusBadge.className = `badge bg-label-${badgeFromReportStatus(currentStatus || 'Received')}`;
    }

    setTextById('detail-report-status', currentStatus || 'Received');
}

function getNextAllowedStatus(currentStatus) {
    const currentIdx = STATUS_FLOW.indexOf(currentStatus);
    if (currentIdx < 0 || currentIdx >= STATUS_FLOW.length - 1) {
        return null;
    }
    return STATUS_FLOW[currentIdx + 1];
}

function updateStatusActionButtons(currentStatus) {
    const buttonByStatus = {
        Assigned: 'status-btn-assigned',
        'In Progress': 'status-btn-inprogress',
        Completed: 'status-btn-completed'
    };

    const nextStatus = getNextAllowedStatus(currentStatus);
    Object.keys(buttonByStatus).forEach((status) => {
        const button = document.getElementById(buttonByStatus[status]);
        if (!button) return;
        button.disabled = status !== nextStatus;
    });
}

function setStatusButtonsBusy(isBusy) {
    const buttonIds = ['status-btn-assigned', 'status-btn-inprogress', 'status-btn-completed'];
    buttonIds.forEach((id) => {
        const button = document.getElementById(id);
        if (!button) return;
        button.disabled = isBusy ? true : button.disabled;
    });
}

async function showStatusAlert(icon, title, text) {
    if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
        await Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: 'OK'
        });
        return;
    }

    alert(`${title}\n${text}`);
}

async function confirmStatusChange(currentStatus, targetStatus) {
    if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Change Report Status?',
            text: `${currentStatus} -> ${targetStatus}`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Change',
            cancelButtonText: 'Cancel'
        });
        return result.isConfirmed;
    }

    return window.confirm(`Change status from ${currentStatus} to ${targetStatus}?`);
}

async function setReportStatus(targetStatus) {
    if (!activeReportDocId) {
        await showStatusAlert('error', 'Status Update Failed', 'Report ID not found.');
        return;
    }

    const currentStatus = activeReportStatus || 'Received';
    const currentIdx = STATUS_FLOW.indexOf(currentStatus);
    const targetIdx = STATUS_FLOW.indexOf(targetStatus);

    if (targetIdx === -1) {
        await showStatusAlert('error', 'Invalid Status', 'Selected status is not valid.');
        return;
    }

    if (targetIdx === currentIdx) {
        await showStatusAlert('info', 'No Change Needed', `Report is already marked as ${targetStatus}.`);
        return;
    }

    if (targetIdx !== currentIdx + 1) {
        const nextStatus = getNextAllowedStatus(currentStatus) || 'Completed';
        await showStatusAlert('warning', 'Invalid Status Flow', `Please change status to ${nextStatus} next.`);
        return;
    }

    const confirmed = await confirmStatusChange(currentStatus, targetStatus);
    if (!confirmed) {
        return;
    }

    try {
        setStatusButtonsBusy(true);

        const now = firebase.firestore.Timestamp.now();
        const payload = { status: targetStatus };
        const timestampField = STATUS_TIMESTAMP_FIELD_MAP[targetStatus];
        if (timestampField) {
            payload[timestampField] = now;
        }

        await db.collection('reports').doc(activeReportDocId).update(payload);

        activeReportStatus = targetStatus;
        if (timestampField) {
            activeStatusHistory[targetStatus] = now.toDate().toLocaleString();
        }

        // Send notification to the report owner
        try {
            await sendStatusNotification(targetStatus);
        } catch (notifErr) {
            console.error('Notification send failed:', notifErr);
        }

        updateStatusTimelineUI(activeReportStatus, activeStatusHistory);
        updateStatusActionButtons(activeReportStatus);

        await showStatusAlert('success', 'Status Updated', `Report status changed to ${targetStatus}.`);
    } catch (error) {
        console.error('Status update failed:', error);
        await showStatusAlert('error', 'Update Failed', 'Unable to update report status. Please try again.');
    } finally {
        updateStatusActionButtons(activeReportStatus);
    }
}

async function sendStatusNotification(status) {
    console.log('[Notification] sendStatusNotification called. status:', status, 'userId:', activeReportUserId);

    if (typeof db === 'undefined') {
        console.error('[Notification] Firestore db is not defined.');
        return;
    }

    if (!activeReportUserId) {
        console.error('[Notification] activeReportUserId is null — report.uid / report.userId field missing.');
        return;
    }

    const reportRef = activeReportPublicId || activeReportDocId || '';

    const notificationConfig = {
        Assigned: {
            title: 'Report Assigned',
            description: `Your report ${reportRef} has been assigned to an emergency response officer.`
        },
        'In Progress': {
            title: 'Response In Progress',
            description: `Emergency responders are currently handling your report ${reportRef}.`
        },
        Completed: {
            title: 'Response Completed',
            description: `Your report ${reportRef} has been successfully resolved. Thank you for reporting.`
        }
    };

    const config = notificationConfig[status];
    if (!config) return;

    const descriptionToSend = config.description;

    // Get next sequence number
    const snapshot = await db.collection('notifications').get();
    let maxSequence = 0;
    snapshot.forEach(doc => {
        const data = doc.data() || {};
        const numericPart = Number(String(data.id || doc.id).replace(/\D/g, ''));
        if (!isNaN(numericPart)) maxSequence = Math.max(maxSequence, numericPart);
    });

    const notificationId = `#NTF-${String(maxSequence + 1).padStart(4, '0')}`;

    await db.collection('notifications').doc(notificationId).set({
        id: notificationId,
        title: config.title,
        description: descriptionToSend,
        type: 'REPORT',
        userId: activeReportUserId,
        timestamp: Date.now()
    });

    const pushResult = await dispatchStatusPushNotification(config.title, descriptionToSend, activeReportUserId);
    if (!pushResult.success) {
        console.warn('[Notification] push delivery failed:', pushResult.message);
    }
}

async function dispatchStatusPushNotification(title, description, userId) {
    try {
        const response = await fetch('send-notification-campaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                type: 'REPORT',
                userId
            })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.success === false) {
            return {
                success: false,
                message: payload.message || 'Push request failed.'
            };
        }

        return {
            success: true,
            sentCount: Number(payload.sentCount || 0),
            totalTokens: Number(payload.totalTokens || 0)
        };
    } catch (err) {
        console.error('Push delivery error:', err);
        return {
            success: false,
            message: 'Push service is not reachable.'
        };
    }
}
