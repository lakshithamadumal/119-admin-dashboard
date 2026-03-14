/**
 * SOS alerts page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderSosTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) return;

  tableBody.innerHTML = data.map(sos => {
    const user = usersData.find(item => item.id === sos.userId);
    const userName = user ? user.name : sos.userId;
    const userContact = user ? user.phone : '-';

    return `
      <tr>
        <td>${sos.sosId}</td>
        <td>${userName}</td>
        <td>${userContact}</td>
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
      const user = usersData.find(item => item.id === sos.userId);
      const userName = user ? user.name.toLowerCase() : '';
      const userPhone = user ? user.phone.toLowerCase() : '';

      const matchesSearch = !query ||
        sos.sosId.toLowerCase().includes(query) ||
        sos.userId.toLowerCase().includes(query) ||
        sos.category.toLowerCase().includes(query) ||
        userName.includes(query) ||
        userPhone.includes(query);

      const matchesStatus = !status || sos.status === status;
      return matchesSearch && matchesStatus;
    });

    renderSosTable('sos-table-body', filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
}
