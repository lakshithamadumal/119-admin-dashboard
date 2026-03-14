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
  const userReports = reportsData.filter(item => item.userId === sos.userId);

  // SOS summary fields
  setTextById('sos-detail-id', sos.sosId);
  setTextById('sos-detail-created', sos.createdDate || '-');

  // User fields
  setTextById('detail-user-name', user ? user.name : '-');
  setTextById('detail-user-email', user ? user.email : '-');
  setTextById('detail-user-phone', user ? user.phone : '-');
  setTextById('detail-user-registered', user ? user.createdDate : '-');
  setTextById('detail-user-address', user ? (user.address || '-') : '-');
  setTextById('detail-user-nic', user ? (user.nic || '-') : '-');

  // Medical fields
  setTextById('detail-medical-blood', medical ? medical.bloodGroup : '-');
  setTextById('detail-medical-allergies', medical ? medical.allergies : '-');
  setTextById('detail-medical-conditions', medical ? medical.conditions : '-');
  setTextById('detail-medical-medications', medical ? (medical.currentMedications || '-') : '-');

  // Subscription fields
  setTextById('detail-subscription-status', membership ? membership.status : (payment ? payment.status : '-'));
  setTextById('detail-subscription-expiry', membership ? membership.expireDate : '-');

  // Contact fields
  setTextById('detail-ec1-name', medical ? (medical.emergencyContact1Name || '-') : '-');
  setTextById('detail-ec1-phone', medical ? (medical.emergencyContact1Phone || '-') : '-');
  setTextById('detail-ec2-name', medical ? (medical.emergencyContact2Name || '-') : '-');
  setTextById('detail-ec2-phone', medical ? (medical.emergencyContact2Phone || '-') : '-');

  // Media fields
  const mediaImageContainer = document.getElementById('detail-media-image');
  if (mediaImageContainer) {
    const userReportIds = userReports.map(item => item.reportId);
    const userMedia = reportMediaData.find(item => userReportIds.includes(item.reportId) && item.image);
    if (userMedia && userMedia.image) {
      mediaImageContainer.innerHTML = `<img src="${userMedia.image}" alt="SOS related image" class="img-fluid rounded">`;
    } else {
      mediaImageContainer.textContent = 'No image attached';
    }
  }
}
