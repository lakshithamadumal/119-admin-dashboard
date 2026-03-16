
async function fetchSosAlerts() {
    const tbody = document.getElementById('sos-table-body');
    if (!tbody) return;

    try {
        console.log("Fetching SOS alerts from Firestore...");
        const snapshot = await db.collection('emergency_reports').orderBy('timestamp', 'desc').get();
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No SOS records found.</td></tr>';
            return;
        }

        const userSnap = await db.collection('users').get();
        const userMap = {};
        userSnap.forEach(u => userMap[u.id] = u.data());

        const detailsPagePath = window.location.pathname.replace(/\\/g, '/').includes('/pages/')
            ? '../sos-details.html'
            : 'sos-details.html';

        snapshot.forEach(doc => {
            const sos = doc.data();
            const docId = doc.id;
            const user = userMap[sos.userId] || {};

            const createdDate = sos.timestamp?.toDate ? sos.timestamp.toDate().toLocaleString() : new Date(sos.timestamp).toLocaleString();

            tbody.innerHTML += `
                <tr>
                    <td>${sos.reportId || docId.substring(0, 8)}</td>
                    <td>${user.name || 'Unknown User'}</td>
                    <td>${user.phoneNumber || '-'}</td>
                    <td>${createdDate}</td>
                    <td>
                        <a class="btn btn-sm btn-info" href="${detailsPagePath}?sosId=${encodeURIComponent(docId)}">
                            <i class="ri ri-alarm-warning-fill me-1"></i>View Details
                        </a>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("Error loading SOS:", error);
    }
}

function initializeSosModule() {
    fetchSosAlerts();
}