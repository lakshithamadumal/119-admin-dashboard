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
  setTextById('modal-user-created', user.createdDate);

  // Populate medical information
  setTextById('modal-medical-blood', medical ? medical.bloodGroup : '-');
  setTextById('modal-medical-allergies', medical ? medical.allergies : '-');
  setTextById('modal-medical-contact', medical ? medical.emergencyContact : '-');
  setTextById('modal-medical-phone', medical ? medical.emergencyPhone : '-');

  // Populate membership information
  if (membership) {
    setTextById('modal-membership-id', membership.id);
    setTextById('modal-membership-plan', membership.planName);
    setTextById('modal-membership-start', membership.startDate);
    setTextById('modal-membership-expire', membership.expireDate);
    setTextById('modal-membership-renewal', membership.expireDate);
    setTextById('modal-membership-status', membership.status);
  } else {
    setTextById('modal-membership-id', '-');
    setTextById('modal-membership-plan', '-');
    setTextById('modal-membership-start', '-');
    setTextById('modal-membership-expire', '-');
    setTextById('modal-membership-renewal', '-');
    setTextById('modal-membership-status', 'No Active Membership');
  }

  // Populate payment information
  if (payment) {
    setTextById('modal-payment-id', payment.paymentId);
    setTextById('modal-payment-amount', formatAmount(payment.amount, payment.currency));
    setTextById('modal-payment-date', payment.paymentDate);
    setTextById('modal-payment-status', payment.status);
  } else {
    setTextById('modal-payment-id', '-');
    setTextById('modal-payment-amount', '-');
    setTextById('modal-payment-date', '-');
    setTextById('modal-payment-status', 'No Payment Records');
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
