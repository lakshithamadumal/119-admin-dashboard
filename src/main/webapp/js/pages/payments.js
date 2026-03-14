/**
 * Payments page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderPaymentsTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  if (!data.length) {
    tableBody.innerHTML = buildEmptyTableRow(8, 'No payments available. Load payment data into js/data.js or your API response first.');
    return;
  }

  tableBody.innerHTML = data.map(payment => `
    <tr>
      <td>${payment.orderId}</td>
      <td>${payment.paymentId}</td>
      <td>${buildBadge(payment.status, badgeFromStatus(payment.status))}</td>
      <td>${payment.statusCode}</td>
      <td>${payment.transactionId}</td>
      <td>${formatAmount(payment.amount, payment.currency)}</td>
      <td>${payment.currency}</td>
      <td>${payment.createdDate}</td>
    </tr>
  `).join('');
}
