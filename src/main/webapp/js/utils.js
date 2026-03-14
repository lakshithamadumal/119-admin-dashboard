/**
 * Shared utility functions used across all pages.
 * Must be loaded before data.js (createCategoryIconPlaceholder is used in data initialization).
 */

function createCategoryIconPlaceholder(name, backgroundColor) {
  const firstLetter = (name || '?').trim().charAt(0).toUpperCase() || '?';
  const safeColor = backgroundColor || '#64748b';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='20' fill='${safeColor}'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='42' fill='#ffffff'>${firstLetter}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function openReportMap(latitude, longitude, reportId, priority) {
  const lat = encodeURIComponent(latitude);
  const lng = encodeURIComponent(longitude);
  const id = reportId ? `&reportId=${encodeURIComponent(reportId)}` : '';
  const pr = priority ? `&priority=${encodeURIComponent(priority)}` : '';
  window.open(`map.html?lat=${lat}&lng=${lng}${id}${pr}`, '_blank', 'noopener');
}

function getCurrentTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function setTextById(id, value) {
  const element = document.getElementById(id);
  if (element) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Location link copied.');
    }).catch(() => {
      alert('Unable to copy. Please copy the link manually.');
    });
    return;
  }

  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, text.length);
  const success = document.execCommand('copy');
  document.body.removeChild(tempInput);

  alert(success ? 'Location link copied.' : 'Unable to copy. Please copy the link manually.');
}

function formatAmount(amount, currency) {
  return `${currency} ${Number(amount).toLocaleString('en-US')}`;
}

function buildBadge(label, tone) {
  return `<span class="badge bg-label-${tone}">${label}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmptyTableRow(colspan, message) {
  return `<tr><td colspan="${colspan}" class="text-center text-body-secondary py-4">${escapeHtml(message)}</td></tr>`;
}

function badgeFromPriority(priority) {
  const map = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info',
    Info: 'info'
  };
  return map[priority] || 'secondary';
}

function badgeFromStatus(status) {
  const map = {
    Paid: 'success',
    Pending: 'warning',
    Failed: 'danger',
    Active: 'success',
    Inactive: 'secondary',
    Expiring: 'warning',
    Review: 'info'
  };
  return map[status] || 'secondary';
}

function badgeFromNotificationType(type) {
  const map = {
    SYSTEM: 'primary',
    PROMO: 'success',
    SOS: 'danger',
    REPORT: 'warning'
  };
  return map[type] || 'secondary';
}

function badgeFromReportStatus(status) {
  const map = {
    Received: 'info',
    Assigned: 'warning',
    'In Progress': 'warning',
    Completed: 'success'
  };
  return map[status] || 'secondary';
}

function getLatestPaymentForUser(userId) {
  const userPayments = paymentsData.filter(item => item.userId === userId);
  if (userPayments.length === 0) {
    return null;
  }
  return userPayments[0];
}

function findReportByIdentifier(identifier) {
  if (!identifier) {
    return null;
  }

  const idValue = Number(identifier);
  if (!Number.isNaN(idValue)) {
    const byId = reportsData.find(item => item.id === idValue);
    if (byId) {
      return byId;
    }
  }

  return reportsData.find(item => item.reportId === identifier);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
