async function fetchReports() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    try {
        if (typeof db === 'undefined') {
            console.error('Firestore db is not initialized yet.');
            return;
        }

        console.log('Fetching Emergency Reports...');
        const snapshot = await db.collection('reports').orderBy('timestamp', 'desc').get();
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No reports found.</td></tr>';
            return;
        }

        const userSnap = await db.collection('users').get();
        const userMap = {};
        userSnap.forEach(uDoc => {
            userMap[uDoc.id] = uDoc.data().uid;
        });

        snapshot.forEach(doc => {
            const report = doc.data();
            const docId = String(doc.id || '');
            const reportCreatorDocId = report.uid;

            const prettyUserId = userMap[reportCreatorDocId] || reportCreatorDocId || '-';

            const safeReportId = report.reportId || docId.substring(0, 8) || '-';
            const safeCategory = report.categoryName || report.category || '-';
            const safeSeverity = report.severity || 'Low';
            const safeStatus = report.status || 'Received';

            const statusTone = safeStatus === 'Completed' ? 'success' : (safeStatus === 'In Progress' ? 'warning' : 'info');
            const severityTone = safeSeverity === 'High' ? 'danger' : (safeSeverity === 'Medium' ? 'warning' : 'info');

            const safeLatitude = Number.isFinite(Number(report.latitude)) ? Number(report.latitude).toFixed(4) : '-';
            const safeLongitude = Number.isFinite(Number(report.longitude)) ? Number(report.longitude).toFixed(4) : '-';
            
            const createdDate = report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : '-';

            tbody.innerHTML += `
                <tr>
                    <td>${safeReportId}</td>
                    <td><span class="fw-bold">${prettyUserId}</span></td> 
                    <td>${safeCategory}</td>
                    <td><span class="badge bg-label-${severityTone}">${safeSeverity}</span></td>
                    <td>${safeLatitude}</td>
                    <td>${safeLongitude}</td>
                    <td><span class="badge bg-label-${statusTone}">${safeStatus}</span></td>
                    <td>${createdDate}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="openReportDetails('${docId}')">Inspect</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function openReportDetails(docId) {
    if (!docId) return;

    const detailsPagePath = window.location.pathname.replace(/\\/g, '/').includes('/pages/')
        ? '../report-details.html'
        : 'report-details.html';

    window.location.href = `${detailsPagePath}?reportId=${encodeURIComponent(String(docId))}`;
}

function initializeReportsModule() {
    fetchReports();
}