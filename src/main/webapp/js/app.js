/**
 * Emergency Operations System - Core Application
 * Handles navigation, dashboard widgets, and emergency alerts.
 * Depends on: js/utils.js, js/data.js, and all js/pages/*.js modules
 */

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
    notification: 'Notifications',
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
      initializeCategoriesModule();
      break;
    case 'notification':
      initializeNotificationModule();
      break;
    case 'settings':
      initializeSettingsModule();
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

function renderDashboardWidgets() {
  setTextById('dashboard-total-reports', reportsData.length);
  setTextById('dashboard-total-sos', sosData.length);
  setTextById('dashboard-active-emergencies', reportsData.filter(item => item.status !== 'Completed').length);
  setTextById('dashboard-all-members', usersData.length);

  renderReportsTable('dashboard-reports-table', reportsData.slice(0, 5), true);
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
