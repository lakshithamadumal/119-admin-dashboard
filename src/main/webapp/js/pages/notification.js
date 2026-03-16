/**
 * Notification page module.
 * Depends on: js/utils.js, js/firebase-config.js
 */

let allNotificationsData = [];

function parseTimestampLabel(value) {
  if (value === undefined || value === null) return '-';
  const ms = typeof value === 'number'
    ? value
    : (typeof value.toMillis === 'function' ? value.toMillis() : Number(value));
  const d = new Date(ms);
  return isNaN(d.getTime()) ? '-' : d.toLocaleString();
}

async function loadNotificationsFromFirestore() {
  const tableBody = document.getElementById('notifications-table-body');
  if (tableBody) {
    tableBody.innerHTML = buildEmptyTableRow(6, 'Loading notifications...');
  }

  if (typeof db === 'undefined') {
    console.error('Firestore is not initialized.');
    if (tableBody) tableBody.innerHTML = buildEmptyTableRow(6, 'Unable to connect to database.');
    return;
  }

  try {
    const snapshot = await db.collection('notifications').orderBy('timestamp', 'desc').get();
    const rawNotifications = [];
    const uniqueUserIds = new Set();

    snapshot.forEach(doc => {
      const data = doc.data() || {};
      rawNotifications.push({ docId: doc.id, data });
      if (data.userId && data.userId !== 'ALL') {
        uniqueUserIds.add(data.userId);
      }
    });

    // Fetch user uid labels in parallel
    const uidMap = {};
    await Promise.all([...uniqueUserIds].map(async authUid => {
      try {
        const userDoc = await db.collection('users').doc(authUid).get();
        if (userDoc.exists) {
          const ud = userDoc.data() || {};
          uidMap[authUid] = ud.uid || authUid;
        }
      } catch (_) { /* keep raw authUid on error */ }
    }));

    allNotificationsData = rawNotifications.map(({ docId, data }) => ({
      id: data.id || docId,
      userId: data.userId ? (uidMap[data.userId] || data.userId) : '-',
      title: data.title || '-',
      type: data.type || '-',
      description: data.description || '-',
      timestamp: parseTimestampLabel(data.timestamp)
    }));

    applyNotificationFilters();
  } catch (err) {
    console.error('Failed to load notifications:', err);
    if (tableBody) tableBody.innerHTML = buildEmptyTableRow(6, 'Failed to load notifications.');
  }
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

  tableBody.innerHTML = data.map(notification => {
    const safeDesc = escapeHtml(notification.description || '-');
    const safeTitle = escapeHtml(notification.title);
    return `
    <tr>
      <td>${escapeHtml(notification.id)}</td>
      <td>${escapeHtml(notification.userId)}</td>
      <td>${safeTitle}</td>
      <td>${buildBadge(escapeHtml(notification.type), badgeFromNotificationType(notification.type))}</td>
      <td>${escapeHtml(notification.timestamp)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary"
          onclick="showNotificationDesc('${safeTitle}', '${safeDesc}')">
          View
        </button>
      </td>
    </tr>
  `;
  }).join('');
}

async function handleNotificationSend() {
  const titleInput = document.getElementById('notification-title');
  const descriptionInput = document.getElementById('notification-description');
  const feedback = document.getElementById('notification-feedback');
  const sendBtn = document.getElementById('notification-send-btn');

  if (!titleInput || !descriptionInput) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) {
    alert('Please enter both title and description.');
    return;
  }

  if (typeof db === 'undefined') {
    alert('Database not available.');
    return;
  }

  if (sendBtn) sendBtn.disabled = true;

  try {
    await db.collection('notifications').add({
      title,
      description,
      type: 'PROMO',
      userId: 'ALL',
      timestamp: Date.now()
    });

    titleInput.value = '';
    descriptionInput.value = '';

    if (feedback) {
      feedback.classList.remove('d-none');
      setTimeout(() => feedback.classList.add('d-none'), 2500);
    }

    loadNotificationsFromFirestore();
  } catch (err) {
    console.error('Failed to send notification:', err);
    alert('Failed to send notification. Please try again.');
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function showNotificationDesc(title, description) {
  const modalTitle = document.getElementById('notificationDescModalTitle');
  const modalBody = document.getElementById('notificationDescModalBody');
  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.textContent = description;
  const modal = document.getElementById('notificationDescModal');
  if (modal && window.bootstrap) {
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }
}

function applyNotificationFilters() {
  const typeFilter = document.getElementById('notification-user-filter');
  const selectedType = typeFilter ? typeFilter.value : '';

  const filtered = allNotificationsData.filter(notification =>
    !selectedType || notification.type === selectedType
  );

  renderNotificationsTable('notifications-table-body', filtered);
}

function initializeNotificationModule() {
  loadNotificationsFromFirestore();

  const sendButton = document.getElementById('notification-send-btn');
  const typeFilter = document.getElementById('notification-user-filter');

  if (sendButton) {
    sendButton.addEventListener('click', handleNotificationSend);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyNotificationFilters);
  }
}
