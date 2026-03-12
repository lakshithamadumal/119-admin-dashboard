/**
 * Emergency Operations System - Dynamic Page Loader
 * Loads pages dynamically without full page reload
 */

const reportsData = [
  {
    id: 1,
    categoryId: 1,
    reportId: 'RPT-1001',
    userId: 'USR-204',
    category: 'Fire',
    priority: 'High',
    latitude: '6.9934',
    longitude: '81.0550',
    status: 'Assigned',
    description: 'Fire reported near Badulla market area with heavy smoke.',
    createdDate: '2026-02-15 09:24',
    statusHistory: { Received: '2026-02-15 09:24', Assigned: '2026-02-15 10:15' }
  },
  {
    id: 2,
    categoryId: 2,
    reportId: 'RPT-1002',
    userId: 'USR-188',
    category: 'Vehicle Accident',
    priority: 'Medium',
    latitude: '6.9271',
    longitude: '79.8612',
    status: 'In Progress',
    description: 'Two-vehicle collision reported near Colombo 07 junction.',
    createdDate: '2026-02-15 08:42',
    statusHistory: { Received: '2026-02-15 08:42', Assigned: '2026-02-15 09:30', 'In Progress': '2026-02-15 10:45' }
  },
  {
    id: 3,
    categoryId: 3,
    reportId: 'RPT-1003',
    userId: 'USR-221',
    category: 'Women Safety',
    priority: 'Low',
    latitude: '5.9496',
    longitude: '80.5353',
    status: 'Received',
    description: 'Safety concern reported near Matara bus stand.',
    createdDate: '2026-02-15 08:05',
    statusHistory: { Received: '2026-02-15 08:05' }
  },
  {
    id: 4,
    categoryId: 4,
    reportId: 'RPT-1004',
    userId: 'USR-204',
    category: 'Landslide',
    priority: 'Medium',
    latitude: '6.9497',
    longitude: '80.7891',
    status: 'Completed',
    description: 'Landslide cleared near Nuwara Eliya pass.',
    createdDate: '2026-02-14 19:40',
    statusHistory: { Received: '2026-02-14 19:40', Assigned: '2026-02-14 20:15', 'In Progress': '2026-02-14 21:30', Completed: '2026-02-14 22:45' }
  }
];

const sosData = [
  {
    id: 1,
    sosId: 'SOS-3001',
    userId: 'USR-204',
    category: 'Fire',
    priority: 'Critical',
    latitude: '6.9934',
    longitude: '81.0550',
    status: 'Active',
    createdDate: '2026-02-15 09:20'
  },
  {
    id: 2,
    sosId: 'SOS-3002',
    userId: 'USR-188',
    category: 'Vehicle Accident',
    priority: 'Critical',
    latitude: '6.9271',
    longitude: '79.8612',
    status: 'Active',
    createdDate: '2026-02-15 08:38'
  },
  {
    id: 3,
    sosId: 'SOS-3003',
    userId: 'USR-221',
    category: 'Women Safety',
    priority: 'High',
    latitude: '5.9496',
    longitude: '80.5353',
    status: 'Resolved',
    createdDate: '2026-02-14 22:15'
  }
];

const usersData = [
  {
    id: 'USR-204',
    name: 'Lakshitha Madumal',
    email: 'lakshitha@example.com',
    phone: '+94 77 123 4567',
    membershipStatus: 'Active',
    nic: '199712345678V',
    address: 'No. 45, Badulla Road, Ella, Badulla',
    createdDate: '2025-11-08'
  },
  {
    id: 'USR-188',
    name: 'Nimal Perera',
    email: 'nimal.perera@example.com',
    phone: '+94 71 678 2211',
    membershipStatus: 'Active',
    nic: '198834567891V',
    address: 'No. 12, Flower Road, Colombo 07',
    createdDate: '2025-10-21'
  },
  {
    id: 'USR-221',
    name: 'Shalini Jayasuriya',
    email: 'shalini.j@example.com',
    phone: '+94 76 889 4455',
    membershipStatus: 'Active',
    nic: '200123456789V',
    address: 'No. 78, Matara Road, Matara',
    createdDate: '2025-09-02'
  },
  {
    id: 'USR-151',
    name: 'Hiruni Abeyratne',
    email: 'hiruni.a@example.com',
    phone: '+94 75 223 9011',
    membershipStatus: 'Pending',
    nic: '199956789012V',
    address: 'No. 22, Kandy Road, Kandy',
    createdDate: '2025-08-18'
  }
];

const membershipsData = [
  {
    membershipId: 'MEM-8801',
    userId: 'USR-204',
    planName: 'Pro',
    amount: 5000,
    startDate: '2026-01-01',
    expireDate: '2026-12-31',
    status: 'Active'
  },
  {
    membershipId: 'MEM-8802',
    userId: 'USR-188',
    planName: 'Pro',
    amount: 5000,
    startDate: '2026-01-01',
    expireDate: '2026-12-31',
    status: 'Active'
  },
  {
    membershipId: 'MEM-8803',
    userId: 'USR-221',
    planName: 'Pro',
    amount: 5000,
    startDate: '2026-01-01',
    expireDate: '2026-12-31',
    status: 'Active'
  },
  {
    membershipId: 'MEM-8804',
    userId: 'USR-151',
    planName: 'Pro',
    amount: 5000,
    startDate: '2026-01-01',
    expireDate: '2026-12-31',
    status: 'Pending'
  }
];

const paymentsData = [
  {
    orderId: 'ORD-9901',
    userId: 'USR-204',
    paymentId: 'PAY-4201',
    status: 'Paid',
    statusCode: '200',
    transactionId: 'TRX-901233',
    amount: 5000,
    currency: 'LKR',
    createdDate: '2026-01-03 10:20'
  },
  {
    orderId: 'ORD-9902',
    userId: 'USR-188',
    paymentId: 'PAY-4202',
    status: 'Paid',
    statusCode: '200',
    transactionId: 'TRX-901244',
    amount: 5000,
    currency: 'LKR',
    createdDate: '2026-01-05 14:12'
  },
  {
    orderId: 'ORD-9903',
    userId: 'USR-221',
    paymentId: 'PAY-4203',
    status: 'Paid',
    statusCode: '200',
    transactionId: 'TRX-901255',
    amount: 5000,
    currency: 'LKR',
    createdDate: '2026-01-07 09:48'
  },
  {
    orderId: 'ORD-9904',
    userId: 'USR-151',
    paymentId: 'PAY-4204',
    status: 'Pending',
    statusCode: '102',
    transactionId: 'TRX-901266',
    amount: 5000,
    currency: 'LKR',
    createdDate: '2026-01-10 08:35'
  }
];

const medicalInfoData = [
  {
    userId: 'USR-204',
    bloodGroup: 'A+',
    allergies: 'Penicillin',
    conditions: 'Hypertension',
    currentMedications: 'Amlodipine 5mg',
    emergencyContact: 'Kavindu Madumal - +94 77 345 8899',
    emergencyContact1Name: 'Kavindu Madumal',
    emergencyContact1Phone: '+94 77 345 8899',
    emergencyContact2Name: 'Priya Madumal',
    emergencyContact2Phone: '+94 71 567 1234'
  },
  {
    userId: 'USR-188',
    bloodGroup: 'B-',
    allergies: 'None',
    conditions: 'Asthma',
    currentMedications: 'Salbutamol Inhaler',
    emergencyContact: 'Nimali Perera - +94 71 333 2200',
    emergencyContact1Name: 'Nimali Perera',
    emergencyContact1Phone: '+94 71 333 2200',
    emergencyContact2Name: 'Roshan Perera',
    emergencyContact2Phone: '+94 77 444 5566'
  },
  {
    userId: 'USR-221',
    bloodGroup: 'O+',
    allergies: 'Seafood',
    conditions: 'Diabetes',
    currentMedications: 'Metformin 500mg',
    emergencyContact: 'Saman Jayasuriya - +94 76 555 9090',
    emergencyContact1Name: 'Saman Jayasuriya',
    emergencyContact1Phone: '+94 76 555 9090',
    emergencyContact2Name: 'Kumari Jayasuriya',
    emergencyContact2Phone: '+94 71 789 4321'
  },
  {
    userId: 'USR-151',
    bloodGroup: 'AB+',
    allergies: 'None',
    conditions: 'None',
    currentMedications: 'None',
    emergencyContact: 'Harini Abeyratne - +94 75 821 4455',
    emergencyContact1Name: 'Harini Abeyratne',
    emergencyContact1Phone: '+94 75 821 4455',
    emergencyContact2Name: 'Danuka Abeyratne',
    emergencyContact2Phone: '+94 76 234 5678'
  }
];

const reportMediaData = [
  {
    reportId: 'RPT-1001',
    image: 'assets/img/illustrations/image.jpeg',
    audio: true,
    video: false
  },
  {
    reportId: 'RPT-1002',
    image: '',
    audio: true,
    video: true
  },
  {
    reportId: 'RPT-1003',
    image: '',
    audio: false,
    video: false
  },
  {
    reportId: 'RPT-1004',
    image: 'assets/img/illustrations/image.jpeg',
    audio: false,
    video: true
  }
];

const categoriesData = [
  {
    id: 1,
    name: 'Fire',
    description: 'Fire outbreaks and smoke incidents',
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 2,
    name: 'Vehicle Accident',
    description: 'Road collisions and vehicle accidents',
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 3,
    name: 'Women Safety',
    description: 'Women safety concerns and urgent assistance',
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 4,
    name: 'Landslide',
    description: 'Landslides and road block hazards',
    status: 'Active',
    createdDate: '2024-06-10'
  }
];

const notificationsData = [
  {
    title: 'High priority medical report assigned',
    detail: 'RPT-1001 assigned to Alpha Team',
    time: '5 min ago',
    level: 'High'
  },
  {
    title: 'Membership renewal completed',
    detail: 'MEM-8802 payment confirmed',
    time: '30 min ago',
    level: 'Info'
  },
  {
    title: 'Fire alert dispatch pending',
    detail: 'RPT-1002 awaiting unit assignment',
    time: '1 hour ago',
    level: 'Medium'
  }
];

// Store current page state
let currentPage = 'dashboard';
let activeReportId = null;
let activeCategoryId = null;
let emergencyAlertTimer = null;
let sosSoundTimer = null;
let pendingReportId = null;
let currentStatusHistory = {};

function openLiveMap() {
  window.open('map.html', '_blank', 'noopener');
}

function handleLogout() {
  alert('You have been logged out.');
}

/**
 * Load page content dynamically into #main-content
 * @param {string} pageName - Name of the page to load
 */
function loadPage(pageName) {
  if (pageName === 'dashboard') {
    stopSosAlertSound();
    clearEmergencyHighlight();
    const modalElement = document.getElementById('sosAlertModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    window.location.href = 'index.html';
    return;
  }

  const mainContent = document.getElementById('main-content');
  if (!mainContent) {
    console.error('Main content container not found');
    return;
  }

  mainContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

  fetch(`pages/${pageName}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      mainContent.innerHTML = html;
      currentPage = pageName;
      updateActiveMenu(pageName);
      updatePageTitle(pageName);
      initializePageScripts(pageName);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      mainContent.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error Loading Page</h4>
          <p>Failed to load ${pageName}.html. Please make sure the file exists in the pages/ folder.</p>
          <hr>
          <p class="mb-0">Error: ${error.message}</p>
        </div>
      `;
    });
}

function updateActiveMenu(pageName) {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeMenuItem = document.querySelector(`[onclick="loadPage('${pageName}')"]`);
  if (activeMenuItem) {
    activeMenuItem.closest('.menu-item').classList.add('active');
  }
}

function updatePageTitle(pageName) {
  const titles = {
    dashboard: 'Dashboard',
    reports: 'Emergency Reports',
    sos: 'SOS Requests',
    users: 'Users',
    memberships: 'Memberships',
    payments: 'Payments',
    categories: 'Categories',
    notifications: 'Notifications',
    settings: 'Settings'
  };

  document.title = titles[pageName] || '119 Emergency Admin Dashboard';
}

function initializePageScripts(pageName) {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  switch (pageName) {
    case 'reports':
      renderReportsTable('reports-table-body', reportsData);
      initializeReportsModule();
      break;
    case 'users':
      renderUsersTable('users-table-body', usersData);
      break;
    case 'categories':
      renderCategoriesTable('categories-table-body', categoriesData);
      break;
    case 'memberships':
      renderMembershipsTable('memberships-table-body', membershipsData);
      break;
    case 'payments':
      renderPaymentsTable('payments-table-body', paymentsData);
      break;
    case 'sos':
      renderSosTable('sos-table-body', sosData);
      initializeSosModule();
      break;
    default:
      break;
  }
}

function renderSosTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) return;

  tableBody.innerHTML = data.map(sos => {
    const priorityBadge = buildBadge(sos.priority, badgeFromPriority(sos.priority));
    const statusBadge = sos.status === 'Active'
      ? `<span class="badge bg-danger">${sos.status}</span>`
      : `<span class="badge bg-success">${sos.status}</span>`;
    return `
      <tr>
        <td>${sos.sosId}</td>
        <td>${sos.userId}</td>
        <td>${sos.category}</td>
        <td>${priorityBadge}</td>
        <td>${sos.latitude}</td>
        <td>${sos.longitude}</td>
        <td>${statusBadge}</td>
        <td>${sos.createdDate}</td>
        <td>
          <a class="btn btn-sm btn-danger" target="_blank" href="sos-details.html?sosId=${sos.id}">
            <i class="ri ri-alarm-warning-fill me-1"></i>View Report
          </a>
        </td>
      </tr>`;
  }).join('');
}

function initializeSosModule() {
  const searchInput = document.getElementById('sos-search');
  const statusFilter = document.getElementById('sos-status-filter');

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : '';
    const filtered = sosData.filter(sos => {
      const matchesSearch = !query ||
        sos.sosId.toLowerCase().includes(query) ||
        sos.userId.toLowerCase().includes(query) ||
        sos.category.toLowerCase().includes(query);
      const matchesStatus = !status || sos.status === status;
      return matchesSearch && matchesStatus;
    });
    renderSosTable('sos-table-body', filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
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

function renderDashboardWidgets() {
  setTextById('dashboard-total-reports', reportsData.length);
  setTextById('dashboard-total-sos', sosData.length);
  setTextById('dashboard-active-emergencies', reportsData.filter(item => item.status !== 'Completed').length);
  setTextById('dashboard-all-members', usersData.length);

  renderReportsTable('dashboard-reports-table', reportsData.slice(0, 5), true);
}

function renderReportsTable(targetId, data, compact) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
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

function renderPaymentsTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
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

function renderCategoriesTable(targetId, data) {
  const tableBody = document.getElementById(targetId);
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.map(category => {
    const reportCount = reportsData.filter(r => r.categoryId === category.id).length;
    
    return `
      <tr>
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>${category.description}</td>
        <td><span class="badge bg-label-info">${reportCount}</span></td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="openEditCategoryModal(${category.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${category.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderNotificationsList(targetId, data) {
  const list = document.getElementById(targetId);
  if (!list) {
    return;
  }

  list.innerHTML = data.map(notification => `
    <li class="d-flex align-items-start mb-4">
      <span class="badge bg-label-${badgeFromPriority(notification.level)} me-3">${notification.level}</span>
      <div>
        <h6 class="mb-1">${notification.title}</h6>
        <p class="mb-0 text-body-secondary">${notification.detail}</p>
        <small class="text-body-secondary">${notification.time}</small>
      </div>
    </li>
  `).join('');
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
    setTextById('modal-membership-renewal', membership.expireDate); // Same as expireDate for renewal
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

function openReportMap(latitude, longitude, reportId, priority) {
  const lat = encodeURIComponent(latitude);
  const lng = encodeURIComponent(longitude);
  const id = reportId ? `&reportId=${encodeURIComponent(reportId)}` : '';
  const pr = priority ? `&priority=${encodeURIComponent(priority)}` : '';
  window.open(`map.html?lat=${lat}&lng=${lng}${id}${pr}`, '_blank', 'noopener');
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

function triggerEmergencyAlert() {
  const highPriorityReport = reportsData.find(item => item.priority === 'High') || reportsData[0];
  const highPriorityUser = usersData.find(item => item.id === highPriorityReport.userId);
  const simulatedReport = {
    id: highPriorityReport.id,
    user: highPriorityUser ? highPriorityUser.name : 'Unknown User',
    category: highPriorityReport.category,
    priority: highPriorityReport.priority
  };

  highlightEmergencyMenu();
  showEmergencyAlert(simulatedReport);

  if (!emergencyAlertTimer) {
    emergencyAlertTimer = setTimeout(() => {
      showEmergencyAlert(simulatedReport);
      emergencyAlertTimer = null;
    }, 5000);
  }
}

function highlightEmergencyMenu() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  const alertMenu = document.getElementById('menu-emergency-alerts');
  if (alertMenu) {
    alertMenu.classList.add('active');
    alertMenu.classList.add('sos-alert-active');
  }
}

function clearEmergencyHighlight() {
  const alertMenu = document.getElementById('menu-emergency-alerts');
  if (alertMenu) {
    alertMenu.classList.remove('sos-alert-active');
  }
}

function showEmergencyAlert(report) {
  setTextById('sos-user', report.user);
  setTextById('sos-category', report.category);
  setTextById('sos-priority', report.priority);

  const viewLink = document.getElementById('sos-view-report');
  if (viewLink) {
    viewLink.href = `index.html?reportId=${report.id}`;
    viewLink.onclick = () => {
      stopSosAlertSound();
      clearEmergencyHighlight();
    };
  }

  const modalElement = document.getElementById('sosAlertModal');
  if (modalElement) {
    if (!modalElement.dataset.sosBound) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        stopSosAlertSound();
        clearEmergencyHighlight();
      });
      modalElement.dataset.sosBound = 'true';
    }
    const modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    modalInstance.show();
  }

  startSosAlertSound();
}

function startSosAlertSound() {
  const audio = document.getElementById('sos-audio');
  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  audio.play().catch(() => {});

  if (sosSoundTimer) {
    clearInterval(sosSoundTimer);
  }

  sosSoundTimer = setInterval(() => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, 2500);
}

function stopSosAlertSound() {
  if (sosSoundTimer) {
    clearInterval(sosSoundTimer);
    sosSoundTimer = null;
  }

  const audio = document.getElementById('sos-audio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
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

function openAddCategoryModal() {
  activeCategoryId = null;
  document.getElementById('categoryModalTitle').textContent = 'Add Category';
  document.getElementById('modal-category-name').value = '';
  document.getElementById('modal-category-description').value = '';
  
  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function openEditCategoryModal(categoryId) {
  const category = categoriesData.find(item => item.id === categoryId);
  if (!category) {
    return;
  }

  activeCategoryId = categoryId;
  document.getElementById('categoryModalTitle').textContent = 'Edit Category';
  document.getElementById('modal-category-name').value = category.name;
  document.getElementById('modal-category-description').value = category.description;
  
  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function saveCategoryModal() {
  const name = document.getElementById('modal-category-name').value.trim();
  const description = document.getElementById('modal-category-description').value.trim();
  
  if (!name) {
    alert('Please enter a category name');
    return;
  }
  
  if (!description) {
    alert('Please enter a category description');
    return;
  }

  if (activeCategoryId) {
    // Edit mode
    const category = categoriesData.find(item => item.id === activeCategoryId);
    if (category) {
      category.name = name;
      category.description = description;
    }
  } else {
    // Add mode - create new category
    const newId = categoriesData.length
      ? Math.max(...categoriesData.map(item => item.id)) + 1
      : 1;
    const today = new Date().toISOString().split('T')[0];
    
    categoriesData.push({
      id: newId,
      name: name,
      description: description,
      status: 'Active',
      createdDate: today
    });
  }

  renderCategoriesTable('categories-table-body', categoriesData);
  
  // Close modal
  const modalElement = document.getElementById('categoryModal');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

function openDeleteCategoryModal(categoryId) {
  const category = categoriesData.find(item => item.id === categoryId);
  if (!category) {
    return;
  }

  activeCategoryId = categoryId;
  document.getElementById('delete-confirm-message').textContent = `Are you sure you want to delete the "${category.name}" category?`;
  
  const modalElement = document.getElementById('deleteConfirmModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}

function confirmDeleteCategory() {
  if (!activeCategoryId) {
    return;
  }

  const categoryIndex = categoriesData.findIndex(item => item.id === activeCategoryId);
  if (categoryIndex !== -1) {
    categoriesData.splice(categoryIndex, 1);
  }

  renderCategoriesTable('categories-table-body', categoriesData);
  
  // Close modal
  const modalElement = document.getElementById('deleteConfirmModal');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  activeCategoryId = null;
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

document.addEventListener('DOMContentLoaded', function() {
  console.log('Emergency Operations Dashboard loaded');
  renderDashboardWidgets();

  const reportIdParam = getQueryParam('reportId');
  const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
  if (reportIdParam && isIndexPage) {
    window.location.href = `report-details.html?reportId=${encodeURIComponent(reportIdParam)}`;
    return;
  }

  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
      loadPage(event.state.page);
    }
  });

  history.replaceState({ page: 'dashboard' }, '', window.location.href);
});
