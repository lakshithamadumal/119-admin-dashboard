
const STATUS_FLOW = ['Received', 'Assigned', 'In Progress', 'Completed'];
const STATUS_TIMESTAMP_FIELD_MAP = {
    Assigned: 'assignedTimestamp',
    'In Progress': 'inProgressTimestamp',
    Completed: 'completedTimestamp'
};

let activeReportDocId = null;
let activeReportStatus = 'Received';
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
        activeReportDocId = docId;
        
        const reportDoc = await db.collection('reports').doc(docId).get();
        if (!reportDoc.exists) return;
        const report = reportDoc.data();
        activeReportStatus = report.status || 'Received';

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

        setTextById('detail-report-id', report.reportId || docId);
        setTextById('detail-report-category', report.categoryName || '-');
        setTextById('detail-report-status', report.status || 'Received');
        setTextById('detail-report-latitude', report.latitude || '-');
        setTextById('detail-report-longitude', report.longitude || '-');
        setTextById('detail-report-description', report.message || '-');
        setTextById('detail-report-created', report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : '-');
        
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
            const severity = report.severity || 'Low';
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
    }
}

function updateStatusTimelineUI(currentStatus, history) {
    const steps = STATUS_FLOW;
    const currentIdx = steps.indexOf(currentStatus);

    steps.forEach((step, idx) => {
        const stepKey = step.toLowerCase().replace(/\s/g, '');
        const dot = document.getElementById(`sdot-${stepKey}`);
        const line = document.getElementById(`sline-${stepKey}`);
        const timeEl = document.getElementById(`stime-${stepKey}`);

        if (dot) {
            if (idx <= currentIdx) {
                dot.style.background = "#7367f0";
                dot.style.color = "#fff";
                dot.style.borderColor = "#7367f0";
            } else {
                dot.style.background = "#f0f0f0";
                dot.style.color = "#adb5bd";
            }
        }
        if (line) {
            line.style.background = idx < currentIdx ? "#7367f0" : "#dee2e6";
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