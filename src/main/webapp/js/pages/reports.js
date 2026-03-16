const REPORT_STATUS_FLOW = ['Received', 'Assigned', 'In Progress', 'Completed'];

let reportRows = [];
let activeStatusFilter = '';

function escapeStatusText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeReportStatus(rawStatus, defaultWhenEmpty = 'Received') {
    const safe = String(rawStatus ?? '').trim();
    if (!safe) {
        return defaultWhenEmpty;
    }

    const normalized = safe
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (normalized === 'received') return 'Received';
    if (normalized === 'assigned') return 'Assigned';
    if (normalized === 'in progress' || normalized === 'inprogress') return 'In Progress';
    if (normalized === 'completed') return 'Completed';

    return safe;
}

function getSeverityTone(severity) {
    if (typeof badgeFromPriority === 'function') {
        return badgeFromPriority(severity);
    }

    if (severity === 'High') return 'danger';
    if (severity === 'Medium') return 'warning';
    if (severity === 'Low') return 'success';
    return 'secondary';
}

function getReportStatusTone(status) {
    if (typeof badgeFromReportStatus === 'function') {
        return badgeFromReportStatus(status);
    }

    if (status === 'Completed') return 'success';
    if (status === 'In Progress' || status === 'Assigned') return 'warning';
    if (status === 'Received') return 'info';
    return 'secondary';
}

function buildOrderedStatusList(statusSet) {
    const knownOrdered = REPORT_STATUS_FLOW.filter(status => statusSet.has(status));
    const custom = Array.from(statusSet)
        .filter(status => !REPORT_STATUS_FLOW.includes(status))
        .sort((a, b) => a.localeCompare(b));

    return [...knownOrdered, ...custom];
}

function populateStatusFilterOptions() {
    const statusSelect = document.getElementById('filter-status');
    if (!statusSelect) return;

    const statusSet = new Set(reportRows.map(item => item.status));
    const orderedStatuses = buildOrderedStatusList(statusSet);

    const previousValue = normalizeReportStatus(statusSelect.value, '');
    const nextFilterValue = statusSet.has(previousValue) ? previousValue : '';

    statusSelect.innerHTML = '<option value="">All Statuses</option>';
    orderedStatuses.forEach((status) => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusSelect.appendChild(option);
    });

    statusSelect.value = nextFilterValue;
    activeStatusFilter = nextFilterValue;
}

function renderReportsTable() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    const rowsToRender = activeStatusFilter
        ? reportRows.filter(item => item.status === activeStatusFilter)
        : reportRows;

    if (rowsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-body-secondary py-4">No reports found for the selected status.</td></tr>';
        return;
    }

    tbody.innerHTML = rowsToRender.map((item) => {
        const severityTone = getSeverityTone(item.severity);
        const statusTone = getReportStatusTone(item.status);

        return `
            <tr>
                <td>${escapeStatusText(item.reportId)}</td>
                <td><span class="fw-bold">${escapeStatusText(item.prettyUserId)}</span></td>
                <td>${escapeStatusText(item.category)}</td>
                <td><span class="badge bg-label-${severityTone}">${escapeStatusText(item.severity)}</span></td>
                <td>${escapeStatusText(item.latitude)}</td>
                <td>${escapeStatusText(item.longitude)}</td>
                <td><span class="badge bg-label-${statusTone}">${escapeStatusText(item.status)}</span></td>
                <td>${escapeStatusText(item.createdDate)}</td>
                <td>
                    <button class="btn btn-sm btn-info" target="_blank" onclick="openReportDetails('${escapeStatusText(item.docId)}')">Inspect</button>
                </td>
            </tr>`;
    }).join('');
}

function attachStatusFilterHandler() {
    const statusSelect = document.getElementById('filter-status');
    if (!statusSelect) return;

    statusSelect.onchange = () => {
        activeStatusFilter = normalizeReportStatus(statusSelect.value, '');
        renderReportsTable();
    };
}

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

        if (snapshot.empty) {
            reportRows = [];
            populateStatusFilterOptions();
            renderReportsTable();
            return;
        }

        const userSnap = await db.collection('users').get();
        const userMap = {};
        userSnap.forEach((uDoc) => {
            userMap[uDoc.id] = uDoc.data().uid;
        });

        reportRows = snapshot.docs.map((doc) => {
            const report = doc.data();
            const docId = String(doc.id || '');
            const reportCreatorDocId = report.uid;

            const prettyUserId = userMap[reportCreatorDocId] || reportCreatorDocId || '-';
            const safeReportId = report.reportId || docId.substring(0, 8) || '-';
            const safeCategory = report.categoryName || report.category || '-';
            const safeSeverity = report.severity || 'Low';
            const safeStatus = normalizeReportStatus(report.status);

            const safeLatitude = Number.isFinite(Number(report.latitude)) ? Number(report.latitude).toFixed(4) : '-';
            const safeLongitude = Number.isFinite(Number(report.longitude)) ? Number(report.longitude).toFixed(4) : '-';
            const createdDate = report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : '-';

            return {
                docId,
                reportId: safeReportId,
                prettyUserId,
                category: safeCategory,
                severity: safeSeverity,
                latitude: safeLatitude,
                longitude: safeLongitude,
                status: safeStatus,
                createdDate
            };
        });

        populateStatusFilterOptions();
        renderReportsTable();
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function openReportDetails(docId) {
    if (!docId) return;

    const detailsPagePath = window.location.pathname.replace(/\\/g, '/').includes('/pages/')
        ? '../report-details.html'
        : 'report-details.html';

    window.open(`${detailsPagePath}?reportId=${encodeURIComponent(String(docId))}`, '_blank', 'noopener');
}

function initializeReportsModule() {
    attachStatusFilterHandler();
    fetchReports();
}