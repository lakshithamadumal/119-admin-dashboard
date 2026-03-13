/**
 * Report Details standalone page module.
 * Used by: report-details.html
 * Depends on: js/utils.js, js/data.js
 */

function detailViewMap() {
  const lat = (document.getElementById('detail-report-latitude') || {}).value || '';
  const lng = (document.getElementById('detail-report-longitude') || {}).value || '';
  const id  = (document.getElementById('detail-report-id') || {}).value || '';
  const pri = (document.getElementById('detail-report-priority') || {}).textContent || '';
  if (!lat || !lng) { alert('Location data not available.'); return; }
  window.open(
    `map.html?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&reportId=${encodeURIComponent(id)}&priority=${encodeURIComponent(pri)}`,
    '_blank', 'noopener'
  );
}

function detailCopyLocation() {
  const lat = (document.getElementById('detail-report-latitude') || {}).value || '';
  const lng = (document.getElementById('detail-report-longitude') || {}).value || '';
  if (!lat || !lng) { alert('Location data not available.'); return; }
  copyTextToClipboard(`https://www.google.com/maps?q=${lat},${lng}`);
}

function renderReportDetailsPage(reportId) {
  const report = findReportByIdentifier(reportId);
  if (!report) {
    const container = document.getElementById('report-details-content');
    if (container) {
      container.innerHTML = '<div class="alert alert-danger">Report not found.</div>';
    }
    return;
  }

  const user = usersData.find(item => item.id === report.userId);
  const membership = membershipsData.find(item => item.userId === report.userId);
  const payment = getLatestPaymentForUser(report.userId);
  const medical = medicalInfoData.find(item => item.userId === report.userId);
  const media = reportMediaData.find(item => item.reportId === report.reportId);

  setTextById('detail-report-id', report.reportId);
  setTextById('detail-report-category', report.category);
  const priorityBadge = document.getElementById('detail-report-priority');
  if (priorityBadge) {
    const tone = badgeFromPriority(report.priority);
    priorityBadge.textContent = report.priority;
    priorityBadge.className = `badge bg-label-${tone}`;
  }
  setTextById('detail-report-status', report.status);
  setTextById('detail-report-latitude', report.latitude);
  setTextById('detail-report-longitude', report.longitude);
  setTextById('detail-report-created', report.createdDate);
  setTextById('detail-report-description', report.description || '-');

  setTextById('detail-user-total-reports', userTotalReports);
  setTextById('detail-user-name', user ? user.name : '-');
  setTextById('detail-user-email', user ? user.email : '-');
  setTextById('detail-user-phone', user ? user.phone : '-');
  setTextById('detail-user-registered', user ? user.createdDate : '-');
  setTextById('detail-user-address', user ? (user.address || '-') : '-');
  setTextById('detail-user-nic', user ? (user.nic || '-') : '-');

  setTextById('detail-medical-blood', medical ? medical.bloodGroup : '-');
  setTextById('detail-medical-allergies', medical ? medical.allergies : '-');
  setTextById('detail-medical-conditions', medical ? medical.conditions : '-');
  setTextById('detail-medical-medications', medical ? (medical.currentMedications || '-') : '-');

  const subStatusEl = document.getElementById('detail-subscription-status');
  if (subStatusEl) {
    const st = membership ? membership.status : '-';
    const tone = st === 'Active' ? 'success' : st === 'Pending' ? 'warning' : st === 'Expired' ? 'danger' : 'secondary';
    subStatusEl.textContent = st;
    subStatusEl.className = `badge bg-label-${tone}`;
  }
  setTextById('detail-subscription-expiry', membership ? membership.expireDate : '-');
  setTextById('detail-ec1-name', medical ? (medical.emergencyContact1Name || '-') : '-');
  setTextById('detail-ec1-phone', medical ? (medical.emergencyContact1Phone || '-') : '-');
  setTextById('detail-ec2-name', medical ? (medical.emergencyContact2Name || '-') : '-');
  setTextById('detail-ec2-phone', medical ? (medical.emergencyContact2Phone || '-') : '-');

  const mediaImage = document.getElementById('detail-media-image');
  if (mediaImage) {
    if (media && media.image) {
      mediaImage.innerHTML = `<img src="${media.image}" alt="Report image" class="img-fluid rounded">`;
    } else {
      mediaImage.textContent = 'No image attached';
    }
  }
  const mediaAudio = document.getElementById('detail-media-audio');
  if (mediaAudio) {
    mediaAudio.textContent = media && media.audio ? 'Audio recording attached' : 'No audio attached';
  }
  const mediaVideo = document.getElementById('detail-media-video');
  if (mediaVideo) {
    mediaVideo.textContent = media && media.video ? 'Video clip attached' : 'No video attached';
  }

  const mapButton = document.getElementById('detail-view-map');
  if (mapButton) {
    mapButton.onclick = () => openReportMap(report.latitude, report.longitude, report.id, report.priority);
  }

  const locationButton = document.getElementById('detail-copy-location');
  if (locationButton) {
    const mapUrl = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
    locationButton.onclick = () => copyTextToClipboard(mapUrl);
  }

  currentStatusHistory = Object.assign({ Received: report.createdDate }, report.statusHistory || {});
  renderStatusTimeline(report.status || 'Received');
}

function setReportStatus(newStatus) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  currentStatusHistory[newStatus] = formatted;
  renderStatusTimeline(newStatus);
}

function renderStatusTimeline(currentStatus) {
  const steps = [
    { key: 'Received',    dotId: 'sdot-received',   timeId: 'stime-received',   lineId: 'sline-received' },
    { key: 'Assigned',    dotId: 'sdot-assigned',   timeId: 'stime-assigned',   lineId: 'sline-assigned' },
    { key: 'In Progress', dotId: 'sdot-inprogress', timeId: 'stime-inprogress', lineId: 'sline-inprogress' },
    { key: 'Completed',   dotId: 'sdot-completed',  timeId: 'stime-completed',  lineId: null }
  ];
  const currentIdx = steps.findIndex(s => s.key === currentStatus);
  const doneColor = '#28c76f';
  const activeColor = '#7367f0';
  const baseStyle = 'width:28px;height:28px;font-size:11px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;';

  steps.forEach(({ key, dotId, timeId, lineId }, idx) => {
    const dot = document.getElementById(dotId);
    const timeEl = document.getElementById(timeId);
    const lineEl = lineId ? document.getElementById(lineId) : null;
    if (!dot) return;
    if (timeEl) timeEl.textContent = currentStatusHistory[key] || '-';
    if (idx < currentIdx) {
      dot.style.cssText = baseStyle + `background:${doneColor};color:#fff;border:none;`;
      dot.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      if (lineEl) lineEl.style.background = doneColor;
    } else if (idx === currentIdx) {
      dot.style.cssText = baseStyle + `background:${activeColor};color:#fff;border:none;`;
      dot.innerHTML = String(idx + 1);
      if (lineEl) lineEl.style.background = '#dee2e6';
    } else {
      dot.style.cssText = baseStyle + 'background:#f0f0f0;color:#adb5bd;border:2px solid #dee2e6;';
      dot.innerHTML = String(idx + 1);
      if (lineEl) lineEl.style.background = '#dee2e6';
    }
  });

  setTextById('detail-report-status', currentStatus);

  const badge = document.getElementById('detail-status-badge');
  if (badge) {
    const tones = { Received: 'secondary', Assigned: 'info', 'In Progress': 'warning', Completed: 'success' };
    badge.textContent = currentStatus;
    badge.className = `badge bg-label-${tones[currentStatus] || 'secondary'}`;
  }

  const btnAssigned   = document.getElementById('status-btn-assigned');
  const btnInProgress = document.getElementById('status-btn-inprogress');
  const btnCompleted  = document.getElementById('status-btn-completed');
  if (btnAssigned)   btnAssigned.className   = `btn btn-sm ${currentStatus === 'Assigned'    ? 'btn-info'    : 'btn-outline-info'}`;
  if (btnInProgress) btnInProgress.className = `btn btn-sm ${currentStatus === 'In Progress' ? 'btn-warning' : 'btn-outline-warning'}`;
  if (btnCompleted)  btnCompleted.className  = `btn btn-sm ${currentStatus === 'Completed'   ? 'btn-success' : 'btn-outline-success'}`;
}
