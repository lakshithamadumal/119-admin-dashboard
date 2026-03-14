/**
 * Notification page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderNotificationsList(targetId, data) {
  const list = document.getElementById(targetId);
  if (!list) {
    return;
  }

  list.innerHTML = data.map(notification => `
    <li class="d-flex align-items-start mb-4">
      <span class="badge bg-label-${badgeFromPriority(notification.level)} me-3">${escapeHtml(notification.level)}</span>
      <div>
        <h6 class="mb-1">${escapeHtml(notification.title)}</h6>
        <p class="mb-0 text-body-secondary">${escapeHtml(notification.description || notification.detail || '-')}</p>
        <small class="text-body-secondary">${escapeHtml(notification.timestamp || notification.time || '-')}</small>
      </div>
    </li>
  `).join('');
}

function renderNotificationsTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-body-secondary py-4">No notifications found for the selected user ID.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = data.map(notification => `
    <tr>
      <td>${escapeHtml(notification.id)}</td>
      <td>${escapeHtml(notification.userId)}</td>
      <td>${escapeHtml(notification.title)}</td>
      <td>${buildBadge(escapeHtml(notification.type), badgeFromNotificationType(notification.type))}</td>
      <td class="text-wrap" style="min-width: 260px;">${escapeHtml(notification.description || '-')}</td>
      <td>${escapeHtml(notification.timestamp)}</td>
    </tr>
  `).join('');
}

function populateNotificationUserOptions() {
  const notificationUserSelect = document.getElementById('notification-user-id');
  const notificationUserFilter = document.getElementById('notification-user-filter');
  const userOptions = usersData.map(user => `<option value="${user.id}">${user.id} - ${escapeHtml(user.name)}</option>`).join('');

  if (notificationUserSelect) {
    notificationUserSelect.innerHTML = `
      <option value="ALL">All Users (ALL)</option>
      ${userOptions}
    `;
  }

  if (notificationUserFilter) {
    notificationUserFilter.innerHTML = `
      <option value="">All User IDs</option>
      <option value="ALL">ALL</option>
      ${userOptions}
    `;
  }
}

function getSelectedNotificationType() {
  const checkedType = document.querySelector('input[name="notification-type"]:checked');
  return checkedType ? checkedType.value : 'SYSTEM';
}

function createNotificationLevel(type) {
  const map = {
    SYSTEM: 'High',
    PROMO: 'Info',
    SOS: 'High',
    REPORT: 'Medium'
  };
  return map[type] || 'Info';
}

function handleNotificationSend() {
  const titleInput = document.getElementById('notification-title');
  const descriptionInput = document.getElementById('notification-description');
  const userSelect = document.getElementById('notification-user-id');
  const feedback = document.getElementById('notification-feedback');

  if (!titleInput || !descriptionInput || !userSelect) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const userId = userSelect.value || 'ALL';
  const type = getSelectedNotificationType();

  if (!title || !description) {
    alert('Please enter both title and description.');
    return;
  }

  notificationSequence += 1;
  const timestamp = getCurrentTimestamp();
  const notification = {
    id: `NTF-${notificationSequence}`,
    userId,
    title,
    description,
    detail: description,
    timestamp,
    time: timestamp,
    type,
    level: createNotificationLevel(type)
  };

  notificationsData.unshift(notification);
  applyNotificationFilters();

  titleInput.value = '';
  descriptionInput.value = '';
  userSelect.value = 'ALL';
  const defaultType = document.getElementById('notification-type-system');
  if (defaultType) {
    defaultType.checked = true;
  }

  if (feedback) {
    feedback.classList.remove('d-none');
    setTimeout(() => feedback.classList.add('d-none'), 2500);
  }
}

function applyNotificationFilters() {
  const searchInput = document.getElementById('notification-user-search');
  const userFilter = document.getElementById('notification-user-filter');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedUserId = userFilter ? userFilter.value : '';

  const filteredNotifications = notificationsData.filter(notification => {
    const normalizedUserId = String(notification.userId || '').toLowerCase();
    const matchesQuery = !query || normalizedUserId.includes(query);
    const matchesFilter = !selectedUserId || notification.userId === selectedUserId;
    return matchesQuery && matchesFilter;
  });

  renderNotificationsTable('notifications-table-body', filteredNotifications);
}

function initializeNotificationModule() {
  populateNotificationUserOptions();
  applyNotificationFilters();

  const sendButton = document.getElementById('notification-send-btn');
  const userSearch = document.getElementById('notification-user-search');
  const userFilter = document.getElementById('notification-user-filter');

  if (sendButton) {
    sendButton.addEventListener('click', handleNotificationSend);
  }

  if (userSearch) {
    userSearch.addEventListener('input', applyNotificationFilters);
  }

  if (userFilter) {
    userFilter.addEventListener('change', applyNotificationFilters);
  }
}
