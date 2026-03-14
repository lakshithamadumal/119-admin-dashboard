/**
 * Reports page module.
 * Depends on: js/utils.js, js/data.js
 */

function renderReportsTable(targetId, data, compact) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  if (!data.length) {
    tableBody.innerHTML = buildEmptyTableRow(compact ? 5 : 9, 'No reports available. Load report data into js/data.js or your API response first.');
    return;
  }

  const rows = data.map(report => {
    const priorityBadge = buildBadge(report.priority, badgeFromPriority(report.priority));
    const statusBadge = buildBadge(report.status, badgeFromReportStatus(report.status));

    if (compact) {
      return `
        <tr>
          <td>${report.reportId}</td>
          <td>${report.category}</td>
          <td>${priorityBadge}</td>
          <td>${statusBadge}</td>
          <td>${report.createdDate}</td>
        </tr>
      `;
    }

    return `
      <tr>
        <td>${report.reportId}</td>
        <td>${report.userId}</td>
        <td>${report.category}</td>
        <td>${priorityBadge}</td>
        <td>${report.latitude}</td>
        <td>${report.longitude}</td>
        <td>${statusBadge}</td>
        <td>${report.createdDate}</td>
        <td>
          <a class="btn btn-sm btn-info" target="_blank" href="report-details.html?reportId=${report.id}">View Report</a>
        </td>
      </tr>
    `;
  }).join('');

  tableBody.innerHTML = rows;
}

function initializeReportsModule() {
  const saveButton = document.getElementById('modal-save-status');
  if (saveButton) {
    saveButton.addEventListener('click', handleReportStatusSave);
  }

  if (pendingReportId) {
    const reportId = pendingReportId;
    pendingReportId = null;
    openReportModal(reportId);
  }
}

function openReportModal(reportId) {
  const report = findReportByIdentifier(reportId);
  if (!report) {
    return;
  }

  activeReportId = report.reportId;

  const user = usersData.find(item => item.id === report.userId);
  const membership = membershipsData.find(item => item.userId === report.userId);
  const payment = getLatestPaymentForUser(report.userId);
  const medical = medicalInfoData.find(item => item.userId === report.userId);
  const media = reportMediaData.find(item => item.reportId === report.reportId);

  setTextById('modal-user-name', user ? user.name : '-');
  setTextById('modal-user-email', user ? user.email : '-');
  setTextById('modal-user-phone', user ? user.phone : '-');
  setTextById('modal-user-registered', user ? user.createdDate : '-');

  setTextById('modal-medical-blood', medical ? medical.bloodGroup : '-');
  setTextById('modal-medical-allergies', medical ? medical.allergies : '-');
  setTextById('modal-medical-conditions', medical ? medical.conditions : '-');
  setTextById('modal-medical-contact', medical ? medical.emergencyContact : '-');

  setTextById('modal-membership-plan', membership ? membership.planName : '-');
  setTextById('modal-membership-status', membership ? membership.status : '-');
  setTextById('modal-membership-start', membership ? membership.startDate : '-');
  setTextById('modal-membership-expire', membership ? membership.expireDate : '-');

  setTextById('modal-payment-id', payment ? payment.paymentId : '-');
  setTextById('modal-payment-transaction', payment ? payment.transactionId : '-');
  setTextById('modal-payment-amount', payment ? formatAmount(payment.amount, payment.currency) : '-');
  setTextById('modal-payment-currency', payment ? payment.currency : '-');
  setTextById('modal-payment-status', payment ? payment.status : '-');

  setTextById('modal-report-id', report.reportId);
  setTextById('modal-report-category', report.category);
  setTextById('modal-report-priority', report.priority);
  setTextById('modal-report-status', report.status);
  setTextById('modal-report-latitude', report.latitude);
  setTextById('modal-report-longitude', report.longitude);
  setTextById('modal-report-created', report.createdDate);
  setTextById('modal-report-description', report.description || '-');

  const statusSelect = document.getElementById('modal-status-select');
  if (statusSelect) {
    statusSelect.value = report.status;
  }

  const mapButton = document.getElementById('modal-view-map');
  if (mapButton) {
    mapButton.onclick = () => openReportMap(report.latitude, report.longitude);
  }

  updateMediaSection(media);
  setTextById('modal-status-feedback', '');

  const modalElement = document.getElementById('reportDetailsModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function handleReportStatusSave() {
  if (!activeReportId) {
    return;
  }

  const statusSelect = document.getElementById('modal-status-select');
  if (!statusSelect) {
    return;
  }

  const report = reportsData.find(item => item.reportId === activeReportId);
  if (!report) {
    return;
  }

  report.status = statusSelect.value;
  setTextById('modal-report-status', report.status);
  setTextById('modal-status-feedback', 'Status updated successfully.');
  renderReportsTable('reports-table-body', reportsData);
}

function updateMediaSection(media) {
  const imageContainer = document.getElementById('modal-media-image');
  const audioContainer = document.getElementById('modal-media-audio');
  const videoContainer = document.getElementById('modal-media-video');

  if (imageContainer) {
    if (media && media.image) {
      imageContainer.innerHTML = `<img src="${media.image}" alt="Report image" class="img-fluid rounded">`;
    } else {
      imageContainer.textContent = 'No image attached';
    }
  }

  if (audioContainer) {
    audioContainer.textContent = media && media.audio ? 'Audio recording attached' : 'No audio attached';
  }

  if (videoContainer) {
    videoContainer.textContent = media && media.video ? 'Video clip attached' : 'No video attached';
  }
}
