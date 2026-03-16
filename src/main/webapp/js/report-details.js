async function renderReportDetailsPage(docId) {
    if (!docId) return;
    try {
        // 1. Report දත්ත Firestore එකෙන් (docId = report එකේ ID එක)
        const reportDoc = await db.collection('reports').doc(docId).get();
        if (!reportDoc.exists) return;
        const report = reportDoc.data();

        // 2. User දත්ත (report එකේ 'uid' field එකේ තියෙන rUyXX... පාවිච්චි කරලා)
        const userDoc = await db.collection('users').doc(report.uid).get();
        const user = userDoc.exists ? userDoc.data() : {};

        // --- Report Fields මැප් කිරීම ---
        setTextById('detail-report-id', report.reportId || docId);
        setTextById('detail-report-category', report.categoryName || '-');
        setTextById('detail-report-status', report.status || 'Received');
        setTextById('detail-report-latitude', report.latitude || '-');
        setTextById('detail-report-longitude', report.longitude || '-');
        setTextById('detail-report-description', report.message || '-'); // message -> description

        const priorityBadge = document.getElementById('detail-report-priority');
        if (priorityBadge) {
            priorityBadge.textContent = report.severity || 'Low';
            priorityBadge.className = `badge bg-label-${badgeFromPriority(report.severity)}`;
        }

        // --- User Fields ---
        setTextById('detail-user-name', user.name || '-');
        setTextById('detail-user-email', user.email || '-');
        setTextById('detail-user-phone', user.phoneNumber || '-');
        setTextById('detail-user-nic', user.nicNumber || '-');
        setTextById('detail-user-address', user.address || '-');
        setTextById('detail-user-total-reports', user.totalReports || '0');

        // --- Media (Image 0 එක ගමු) ---
        const mediaImage = document.getElementById('detail-media-image');
        if (mediaImage && report.imageUrls && report.imageUrls.length > 0) {
            mediaImage.innerHTML = `<img src="${report.imageUrls[0]}" class="img-fluid rounded border">`;
        }

        // --- Timeline Logic ---
        // Firestore එකේ තියෙන timestamps වලින් Timeline එක පුරවමු
        const history = {
            Received: report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : "-",
            Assigned: report.assignedTimestamp?.toDate ? report.assignedTimestamp.toDate().toLocaleString() : "-",
            "In Progress": report.inProgressTimestamp?.toDate ? report.inProgressTimestamp.toDate().toLocaleString() : "-",
            Completed: report.completedTimestamp?.toDate ? report.completedTimestamp.toDate().toLocaleString() : "-"
        };
        
        updateStatusTimelineUI(report.status, history);

    } catch (e) { console.error(e); }
}

function updateStatusTimelineUI(currentStatus, history) {
    const steps = ['Received', 'Assigned', 'In Progress', 'Completed'];
    const currentIdx = steps.indexOf(currentStatus);

    steps.forEach((step, idx) => {
        const stepKey = step.toLowerCase().replace(/\s/g, '');
        const dot = document.getElementById(`sdot-${stepKey}`);
        const timeEl = document.getElementById(`stime-${stepKey}`);

        if (dot) {
            if (idx <= currentIdx) {
                dot.style.background = "#7367f0";
                dot.style.color = "#fff";
            }
        }
        if (timeEl) timeEl.textContent = history[step] || '-';
    });
}