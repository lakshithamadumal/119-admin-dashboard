
async function renderReportDetailsPage(docId) {
    if (!docId) return;

    try {
        console.log("Fetching data for Report:", docId);
        
        const reportDoc = await db.collection('reports').doc(docId).get();
        if (!reportDoc.exists) return;
        const report = reportDoc.data();

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
        
        updateStatusTimelineUI(report.status, history);

    } catch (e) {
        console.error("Data Load Error:", e);
    }
}

function updateStatusTimelineUI(currentStatus, history) {
    const steps = ['Received', 'Assigned', 'In Progress', 'Completed'];
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
        if (line && idx < currentIdx) {
            line.style.background = "#7367f0";
        }
        if (timeEl) timeEl.textContent = history[step] || '-';
    });
}