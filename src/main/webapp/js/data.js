/**
 * Shared application data and state variables.
 * Depends on: js/utils.js (createCategoryIconPlaceholder must be defined first)
 */

const reportsData = [
  // Add report records here after loading them from your backend or Firestore.
  // Expected shape: { id, categoryId, reportId, userId, category, priority, latitude, longitude, status, description, createdDate, statusHistory }
];

const sosData = [
  // Add SOS records here after loading them from your backend or Firestore.
  // Expected shape: { id, sosId, userId, category, priority, latitude, longitude, status, createdDate }
];

const usersData = [
  // Add user records here after loading them from your backend or Firestore.
  // Expected shape: { id, name, email, phone, membershipStatus, nic, address, createdDate }
];

const membershipsData = [
  // Add membership records here after loading them from your backend or Firestore.
  // Expected shape: { membershipId, userId, planName, amount, startDate, expireDate, status }
];

const paymentsData = [
  // Add payment records here after loading them from your backend or Firestore.
  // Expected shape: { orderId, userId, paymentId, status, statusCode, transactionId, amount, currency, createdDate }
];

const medicalInfoData = [
  // Add medical profile records here after loading them from your backend or Firestore.
  // Expected shape: { userId, bloodGroup, allergies, conditions, currentMedications, emergencyContact, emergencyContact1Name, emergencyContact1Phone, emergencyContact2Name, emergencyContact2Phone }
];

const reportMediaData = [
  // Add media metadata here after loading it from your backend or storage service.
  // Expected shape: { reportId, image, audio, video }
];

const categoriesData = [
  // Add category records here after loading them from your backend or Firestore.
  // Expected shape: { id, name, icon, status, createdDate }
  // If no icon URL is available, you can use createCategoryIconPlaceholder(name, '#64748b').
];

const notificationsData = [
  // Add notification records here after loading them from your backend or Firestore.
  // Expected shape: { id, userId, title, description, detail, timestamp, time, type, level }
];

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------

let currentPage = 'dashboard';
let activeReportId = null;
let activeCategoryId = null;
let activeCategoryIcon = '';
let pendingReportId = null;
let currentStatusHistory = {};

let notificationSequence = notificationsData.reduce((max, notification) => {
  const numericPart = Number(String(notification.id || '').replace(/\D/g, ''));
  return Number.isNaN(numericPart) ? max : Math.max(max, numericPart);
}, 5000);

// ---------------------------------------------------------------------------
// Settings storage (initialised here so data arrays can be patched on load)
// ---------------------------------------------------------------------------

const SETTINGS_STORAGE_KEY = 'dashboard_settings_v1';
const defaultAppSettings = {
  subscriptionPriceLkr: 0,
  operatorContactNumber: ''
};

function loadAppSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return Object.assign({}, defaultAppSettings);
    }

    const parsed = JSON.parse(raw);
    return {
      subscriptionPriceLkr: Number(parsed.subscriptionPriceLkr) > 0 ? Number(parsed.subscriptionPriceLkr) : defaultAppSettings.subscriptionPriceLkr,
      operatorContactNumber: String(parsed.operatorContactNumber || '').trim() || defaultAppSettings.operatorContactNumber
    };
  } catch (error) {
    console.warn('Unable to load settings from storage:', error);
    return Object.assign({}, defaultAppSettings);
  }
}

function saveAppSettings() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(appSettings));
}

function applySubscriptionPriceAcrossData(amount) {
  membershipsData.forEach(membership => {
    membership.amount = amount;
  });

  paymentsData.forEach(payment => {
    payment.amount = amount;
  });
}

let appSettings = loadAppSettings();
applySubscriptionPriceAcrossData(appSettings.subscriptionPriceLkr);
