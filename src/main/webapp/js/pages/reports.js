async function fetchReports() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    try {
        if (typeof db === 'undefined') {
            console.error('Firestore db is not initialized yet.');
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Database connection is not ready.</td></tr>';
            return;
        }

        console.log('Fetching Emergency Reports...');
        const snapshot = await db.collection('reports').orderBy('timestamp', 'desc').get();
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No reports found.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const report = doc.data();
            const docId = String(doc.id || '');

            const safeReportId = report.reportId || docId.substring(0, 8) || '-';
            const safeUserId = report.uid || report.userId || '-';
            const safeCategory = report.categoryName || report.category || '-';
            const safeSeverity = report.severity || report.priority || 'Low';
            const safeStatus = report.status || 'Received';

            const statusTone = safeStatus === 'Completed' ? 'success' : (safeStatus === 'In Progress' ? 'warning' : 'info');
            const severityTone = safeSeverity === 'High' ? 'danger' : (safeSeverity === 'Medium' ? 'warning' : 'info');

            const safeLatitude = Number.isFinite(Number(report.latitude)) ? Number(report.latitude).toFixed(4) : '-';
            const safeLongitude = Number.isFinite(Number(report.longitude)) ? Number(report.longitude).toFixed(4) : '-';
            const createdDate = report.timestamp?.toDate
                ? report.timestamp.toDate().toLocaleString()
                : (report.createdDate || '-');

            tbody.innerHTML += `
                <tr>
                    <td>${safeReportId}</td>
                    <td>${safeUserId}</td>
                    <td>${safeCategory}</td>
                    <td><span class="badge bg-label-${severityTone}">${safeSeverity}</span></td>
                    <td>${safeLatitude}</td>
                    <td>${safeLongitude}</td>
                    <td><span class="badge bg-label-${statusTone}">${safeStatus}</span></td>
                    <td>${createdDate}</td>
                    <td>
                        <button class="btn btn-sm btn-info" target="_blank" onclick="openReportDetails('${docId}')">Inspect</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error('Error loading reports:', error);
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Failed to load reports.</td></tr>';
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