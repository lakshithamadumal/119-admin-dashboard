/**
 * Memberships page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderMembershipsTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.map(membership => `
    <tr>
      <td>${membership.membershipId}</td>
      <td>${membership.userId}</td>
      <td>${membership.planName}</td>
      <td>${formatAmount(membership.amount, 'LKR')}</td>
      <td>${membership.startDate}</td>
      <td>${membership.expireDate}</td>
      <td>${buildBadge(membership.status, badgeFromStatus(membership.status))}</td>
    </tr>
  `).join('');
}
