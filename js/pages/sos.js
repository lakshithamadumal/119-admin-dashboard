/**
 * SOS alerts page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderSosTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) return;

  tableBody.innerHTML = data.map(sos => {
    const priorityBadge = buildBadge(sos.priority, badgeFromPriority(sos.priority));
    const statusBadge = sos.status === 'Active'
      ? `<span class="badge bg-danger">${sos.status}</span>`
      : `<span class="badge bg-success">${sos.status}</span>`;
    return `
      <tr>
        <td>${sos.sosId}</td>
        <td>${sos.userId}</td>
        <td>${sos.createdDate}</td>
        <td>
          <a class="btn btn-sm btn-info" target="_blank" href="sos-details.html?sosId=${sos.id}">
            <i class="ri ri-alarm-warning-fill me-1"></i>View Report
          </a>
        </td>
      </tr>`;
  }).join('');
}

function initializeSosModule() {
  const searchInput = document.getElementById('sos-search');
  const statusFilter = document.getElementById('sos-status-filter');

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : '';
    const filtered = sosData.filter(sos => {
      const matchesSearch = !query ||
        sos.sosId.toLowerCase().includes(query) ||
        sos.userId.toLowerCase().includes(query) ||
        sos.category.toLowerCase().includes(query);
      const matchesStatus = !status || sos.status === status;
      return matchesSearch && matchesStatus;
    });
    renderSosTable('sos-table-body', filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
}
