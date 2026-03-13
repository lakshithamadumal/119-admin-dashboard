/**
 * Users page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderUsersTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${buildBadge(user.membershipStatus, badgeFromStatus(user.membershipStatus))}</td>
      <td>${user.createdDate}</td>
      <td><button class="btn btn-sm btn-info" onclick="openUserModal('${user.id}')">More Details</button></td>
    </tr>
  `).join('');
}

function openUserModal(userId) {
  const user = usersData.find(item => item.id === userId);
  if (!user) {
    return;
  }

  const membership = membershipsData.find(item => item.userId === userId);
  const payment = getLatestPaymentForUser(userId);
  const medical = medicalInfoData.find(item => item.userId === userId);
  const userReports = reportsData.filter(item => item.userId === userId);

  // Populate user account information
  setTextById('modal-user-id', user.id);
  setTextById('modal-user-name', user.name);
  setTextById('modal-user-email', user.email);
  setTextById('modal-user-phone', user.phone);
  setTextById('modal-user-nic', user.nic || '-');
  setTextById('modal-user-registered', user.createdDate || '-');
  setTextById('modal-user-address', user.address || '-');

  // Populate medical information
  setTextById('modal-medical-blood', medical ? medical.bloodGroup : '-');
  setTextById('modal-medical-allergies', medical ? medical.allergies : '-');
  setTextById('modal-medical-conditions', medical ? medical.conditions : '-');
  setTextById('modal-medical-medications', medical ? (medical.currentMedications || '-') : '-');

  // Populate membership information
  const subscriptionStatus = membership ? membership.status : (payment ? payment.status : 'No Active Membership');
  const subscriptionExpiry = membership ? membership.expireDate : '-';
  setTextById('modal-subscription-status', subscriptionStatus);
  setTextById('modal-subscription-expiry', subscriptionExpiry);

  // Populate emergency contacts
  setTextById('modal-ec1-name', medical ? (medical.emergencyContact1Name || '-') : '-');
  setTextById('modal-ec1-phone', medical ? (medical.emergencyContact1Phone || '-') : '-');
  setTextById('modal-ec2-name', medical ? (medical.emergencyContact2Name || '-') : '-');
  setTextById('modal-ec2-phone', medical ? (medical.emergencyContact2Phone || '-') : '-');

  // Populate media section with first available report image for this user
  const mediaImageContainer = document.getElementById('modal-media-image');
  if (mediaImageContainer) {
    const userReportIds = userReports.map(item => item.reportId);
    const userMedia = reportMediaData.find(item => userReportIds.includes(item.reportId) && item.image);
    if (userMedia && userMedia.image) {
      mediaImageContainer.innerHTML = `<img src="${userMedia.image}" alt="User report image" class="img-fluid rounded">`;
    } else {
      mediaImageContainer.textContent = 'No image uploaded';
    }
  }

  // Populate user's reports
  const reportList = document.getElementById('modal-user-reports-list');
  const reportCount = document.getElementById('modal-user-report-count');

  if (reportList) {
    if (userReports.length === 0) {
      reportList.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No reports created by this user</td></tr>';
    } else {
      reportList.innerHTML = userReports.map(report => `
        <tr>
          <td>${report.reportId}</td>
          <td>${report.category}</td>
          <td>${buildBadge(report.priority, badgeFromPriority(report.priority))}</td>
          <td>${buildBadge(report.status, badgeFromReportStatus(report.status))}</td>
          <td>${report.createdDate}</td>
        </tr>
      `).join('');
    }
  }

  if (reportCount) {
    reportCount.textContent = userReports.length;
  }

  const modalElement = document.getElementById('userDetailsModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}
