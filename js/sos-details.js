/**
 * SOS Details standalone page module.
 * Used by: sos-details.html
 * Depends on: js/utils.js, js/data.js
 */

function sosDetailViewMap() {
  const lat = (document.getElementById('sos-detail-latitude') || {}).value || '';
  const lng = (document.getElementById('sos-detail-longitude') || {}).value || '';
  const id  = (document.getElementById('sos-detail-id') || {}).value || '';
  const pri = (document.getElementById('sos-detail-priority') || {}).textContent || '';
  if (!lat || !lng) { alert('Location data not available.'); return; }
  window.open(
    `map.html?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&sosId=${encodeURIComponent(id)}&priority=${encodeURIComponent(pri)}`,
    '_blank', 'noopener'
  );
}

function sosDetailCopyLocation() {
  const lat = (document.getElementById('sos-detail-latitude') || {}).value || '';
  const lng = (document.getElementById('sos-detail-longitude') || {}).value || '';
  if (!lat || !lng) { alert('Location data not available.'); return; }
  copyTextToClipboard(`https://www.google.com/maps?q=${lat},${lng}`);
}

function renderSosDetailsPage(sosId) {
  const sos = sosData.find(item => item.id === sosId);
  if (!sos) return;

  const user = usersData.find(item => item.id === sos.userId);
  const membership = membershipsData.find(item => item.userId === sos.userId);
  const payment = getLatestPaymentForUser(sos.userId);
  const medical = medicalInfoData.find(item => item.userId === sos.userId);

  // SOS incident fields
  const idEl = document.getElementById('sos-detail-id');
  if (idEl) idEl.value = sos.sosId;
  const catEl = document.getElementById('sos-detail-category');
  if (catEl) catEl.value = sos.category;
  const latEl = document.getElementById('sos-detail-latitude');
  if (latEl) latEl.value = sos.latitude;
  const lngEl = document.getElementById('sos-detail-longitude');
  if (lngEl) lngEl.value = sos.longitude;
  const createdEl = document.getElementById('sos-detail-created');
  if (createdEl) createdEl.value = sos.createdDate;

  const priorityBadge = document.getElementById('sos-detail-priority');
  if (priorityBadge) {
    priorityBadge.textContent = sos.priority;
    priorityBadge.className = 'badge fs-6 px-3 py-2 bg-label-' + badgeFromPriority(sos.priority);
  }
  const statusBadge = document.getElementById('sos-detail-status-badge');
  if (statusBadge) {
    statusBadge.textContent = sos.status;
    statusBadge.className = 'badge fs-6 px-3 py-2 ' + (sos.status === 'Active' ? 'bg-danger' : 'bg-success');
  }
  const statusSelect = document.getElementById('sos-status-select');
  if (statusSelect) statusSelect.value = sos.status;

  // Map buttons
  const mapBtn = document.getElementById('sos-detail-view-map');
  if (mapBtn) mapBtn.onclick = () => openReportMap(sos.latitude, sos.longitude);
  const copyBtn = document.getElementById('sos-detail-copy-location');
  if (copyBtn) copyBtn.onclick = () => {
    navigator.clipboard.writeText(`${sos.latitude}, ${sos.longitude}`);
  };

  // Status save
  const saveBtn = document.getElementById('sos-save-status');
  if (saveBtn) saveBtn.onclick = () => {
    const newStatus = statusSelect ? statusSelect.value : sos.status;
    sos.status = newStatus;
    if (statusBadge) {
      statusBadge.textContent = newStatus;
      statusBadge.className = 'badge fs-6 px-3 py-2 ' + (newStatus === 'Active' ? 'bg-danger' : 'bg-success');
    }
    const feedback = document.getElementById('sos-status-feedback');
    if (feedback) { feedback.classList.remove('d-none'); setTimeout(() => feedback.classList.add('d-none'), 3000); }
  };

  // User fields
  const userIdEl = document.getElementById('sos-detail-user-id');
  if (userIdEl) userIdEl.value = sos.userId;
  const nameEl = document.getElementById('sos-detail-user-name');
  if (nameEl) nameEl.value = user ? user.name : '-';
  const emailEl = document.getElementById('sos-detail-user-email');
  if (emailEl) emailEl.value = user ? user.email : '-';
  const phoneEl = document.getElementById('sos-detail-user-phone');
  if (phoneEl) phoneEl.value = user ? user.phone : '-';
  const regEl = document.getElementById('sos-detail-user-registered');
  if (regEl) regEl.value = user ? user.createdDate : '-';

  // Medical fields
  const bloodEl = document.getElementById('sos-detail-medical-blood');
  if (bloodEl) bloodEl.value = medical ? medical.bloodGroup : '-';
  const allerEl = document.getElementById('sos-detail-medical-allergies');
  if (allerEl) allerEl.value = medical ? medical.allergies : '-';
  const condEl = document.getElementById('sos-detail-medical-conditions');
  if (condEl) condEl.value = medical ? medical.conditions : '-';
  const contactEl = document.getElementById('sos-detail-medical-contact');
  if (contactEl) contactEl.value = medical ? medical.emergencyContact : '-';
  const ec1NameEl = document.getElementById('sos-detail-ec1-name');
  if (ec1NameEl) ec1NameEl.value = medical ? (medical.emergencyContact1Name || '-') : '-';
  const ec1PhoneEl = document.getElementById('sos-detail-ec1-phone');
  if (ec1PhoneEl) ec1PhoneEl.value = medical ? (medical.emergencyContact1Phone || '-') : '-';
  const ec2NameEl = document.getElementById('sos-detail-ec2-name');
  if (ec2NameEl) ec2NameEl.value = medical ? (medical.emergencyContact2Name || '-') : '-';
  const ec2PhoneEl = document.getElementById('sos-detail-ec2-phone');
  if (ec2PhoneEl) ec2PhoneEl.value = medical ? (medical.emergencyContact2Phone || '-') : '-';

  // Membership fields
  const planEl = document.getElementById('sos-detail-membership-plan');
  if (planEl) planEl.value = membership ? membership.planName : '-';
  const memStatusEl = document.getElementById('sos-detail-membership-status');
  if (memStatusEl) memStatusEl.value = membership ? membership.status : '-';
  const startEl = document.getElementById('sos-detail-membership-start');
  if (startEl) startEl.value = membership ? membership.startDate : '-';
  const expireEl = document.getElementById('sos-detail-membership-expire');
  if (expireEl) expireEl.value = membership ? membership.expireDate : '-';

  // Payment fields
  const payIdEl = document.getElementById('sos-detail-payment-id');
  if (payIdEl) payIdEl.value = payment ? payment.paymentId : '-';
  const txEl = document.getElementById('sos-detail-payment-transaction');
  if (txEl) txEl.value = payment ? payment.transactionId : '-';
  const amtEl = document.getElementById('sos-detail-payment-amount');
  if (amtEl) amtEl.value = payment ? formatAmount(payment.amount, payment.currency) : '-';
  const curEl = document.getElementById('sos-detail-payment-currency');
  if (curEl) curEl.value = payment ? payment.currency : '-';
  const payStatusEl = document.getElementById('sos-detail-payment-status');
  if (payStatusEl) payStatusEl.value = payment ? payment.status : '-';
}
