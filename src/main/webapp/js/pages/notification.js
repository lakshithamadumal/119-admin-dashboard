/**
 * Notification page module.
 * Depends on: js/utils.js, js/firebase-config.js
 */

let allNotificationsData = [];

function showNotificationAlert(options) {
  if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
    return Swal.fire(options);
  }

  if (options && options.text) {
    alert(options.text);
  }

  return Promise.resolve();
}

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
        <td colspan="6" class="text-center text-body-secondary py-4">No notifications found for the selected type.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = data.map(notification => {
    const safeTitle = escapeHtml(notification.title);
    const encodedTitle = encodeURIComponent(notification.title || 'Notification');
    const encodedDesc = encodeURIComponent(notification.description || '-');
    return `
    <tr>
      <td>${escapeHtml(notification.id)}</td>
      <td>${escapeHtml(notification.userId)}</td>
      <td>${safeTitle}</td>
      <td>${buildBadge(escapeHtml(notification.type), badgeFromNotificationType(notification.type))}</td>
      <td>${escapeHtml(notification.timestamp)}</td>
      <td>
        <span class="badge bg-label-primary" style="cursor:pointer;" onclick="showNotificationDesc('${encodedTitle}', '${encodedDesc}')">
          <i class="bx bx-show me-1"></i>View
        </span>
      </td>
    </tr>
  `;
  }).join('');
}

function buildNotificationId(sequenceNumber) {
  return `#NTF-${String(sequenceNumber).padStart(4, '0')}`;
}

function extractNotificationSequence(value) {
  const numericPart = Number(String(value || '').replace(/\D/g, ''));
  return Number.isNaN(numericPart) ? 0 : numericPart;
}

async function getNextNotificationSequence() {
  const snapshot = await db.collection('notifications').get();
  let maxSequence = 0;

  snapshot.forEach(doc => {
    const data = doc.data() || {};
    maxSequence = Math.max(maxSequence, extractNotificationSequence(data.id || doc.id));
  });

  return maxSequence + 1;
}

function chunkArray(items, chunkSize) {
  const chunks = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

async function handleNotificationSend() {
  const titleInput = document.getElementById('notification-title');
  const descriptionInput = document.getElementById('notification-description');
  const sendBtn = document.getElementById('notification-send-btn');

  if (!titleInput || !descriptionInput) {
    return;
  }

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) {
    await showNotificationAlert({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please enter both title and description.',
      backdrop: 'rgba(105, 108, 255, 0.1)'
    });
    return;
  }

  if (typeof db === 'undefined') {
    await showNotificationAlert({
      icon: 'error',
      title: 'Database Error',
      text: 'Database not available.',
      backdrop: 'rgba(105, 108, 255, 0.1)'
    });
    return;
  }

  if (sendBtn) sendBtn.disabled = true;

  try {
    if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
      Swal.fire({
        title: 'Sending Notifications',
        text: 'SYSTEM notification is being sent to all users.',
        allowOutsideClick: false,
        backdrop: 'rgba(105, 108, 255, 0.1)',
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }

    const usersSnapshot = await db.collection('users').get();
    const userDocumentIds = usersSnapshot.docs.map(doc => doc.id).filter(Boolean);

    if (!userDocumentIds.length) {
      if (typeof Swal !== 'undefined' && typeof Swal.close === 'function') {
        Swal.close();
      }

      await showNotificationAlert({
        icon: 'info',
        title: 'No Users Found',
        text: 'There are no users in the users collection.',
        backdrop: 'rgba(105, 108, 255, 0.1)'
      });
      return;
    }

    let nextSequence = await getNextNotificationSequence();
    let createdCount = 0;
    const userChunks = chunkArray(userDocumentIds, 400);

    for (const chunk of userChunks) {
      const batch = db.batch();

      chunk.forEach(userDocumentId => {
        const notificationId = buildNotificationId(nextSequence);
        const notificationRef = db.collection('notifications').doc(notificationId);

        batch.set(notificationRef, {
          id: notificationId,
          title,
          description,
          type: 'SYSTEM',
          userId: userDocumentId,
          timestamp: Date.now() + createdCount
        });

        nextSequence += 1;
        createdCount += 1;
      });

      await batch.commit();
    }

    titleInput.value = '';
    descriptionInput.value = '';

    if (typeof Swal !== 'undefined' && typeof Swal.close === 'function') {
      Swal.close();
    }

    await loadNotificationsFromFirestore();
    await showNotificationAlert({
      icon: 'success',
      title: 'Notifications Sent',
      text: `SYSTEM notification sent to ${createdCount} users.`,
      backdrop: 'rgba(105, 108, 255, 0.1)'
    });
  } catch (err) {
    console.error('Failed to send notification:', err);

    if (typeof Swal !== 'undefined' && typeof Swal.close === 'function') {
      Swal.close();
    }

    await showNotificationAlert({
      icon: 'error',
      title: 'Send Failed',
      text: 'Failed to send notification. Please try again.',
      backdrop: 'rgba(105, 108, 255, 0.1)'
    });
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function showNotificationDesc(title, description) {
  const modalTitle = document.getElementById('notificationDescModalTitle');
  const modalBody = document.getElementById('notificationDescModalBody');
  const decodedTitle = decodeURIComponent(title || 'Notification');
  const decodedDescription = decodeURIComponent(description || '-');
  if (modalTitle) modalTitle.textContent = decodedTitle;
  if (modalBody) modalBody.textContent = decodedDescription;
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
