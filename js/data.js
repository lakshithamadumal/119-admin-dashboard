/**
 * Shared application data and state variables.
 * Depends on: js/utils.js (createCategoryIconPlaceholder must be defined first)
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
    icon: createCategoryIconPlaceholder('Fire', '#ef4444'),
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 2,
    name: 'Vehicle Accident',
    icon: createCategoryIconPlaceholder('Vehicle Accident', '#f59e0b'),
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 3,
    name: 'Women Safety',
    icon: createCategoryIconPlaceholder('Women Safety', '#6366f1'),
    status: 'Active',
    createdDate: '2024-05-01'
  },
  {
    id: 4,
    name: 'Landslide',
    icon: createCategoryIconPlaceholder('Landslide', '#16a34a'),
    status: 'Active',
    createdDate: '2024-06-10'
  }
];

const notificationsData = [
  {
    id: 'NTF-5001',
    userId: 'ALL',
    title: 'System maintenance update',
    description: 'Scheduled platform maintenance will start at 23:00 tonight.',
    detail: 'Scheduled platform maintenance will start at 23:00 tonight.',
    timestamp: '2026-03-12 23:00',
    time: '2026-03-12 23:00',
    type: 'SYSTEM',
    level: 'High'
  },
  {
    id: 'NTF-5002',
    userId: 'USR-188',
    title: 'Premium plan renewal confirmed',
    description: 'Your membership payment for MEM-8802 has been confirmed successfully.',
    detail: 'Your membership payment for MEM-8802 has been confirmed successfully.',
    timestamp: '2026-03-12 18:45',
    time: '2026-03-12 18:45',
    type: 'PROMO',
    level: 'Info'
  },
  {
    id: 'NTF-5003',
    userId: 'USR-204',
    title: 'SOS team dispatched',
    description: 'Emergency team has been dispatched for your active SOS request.',
    detail: 'Emergency team has been dispatched for your active SOS request.',
    timestamp: '2026-03-12 17:30',
    time: '2026-03-12 17:30',
    type: 'SOS',
    level: 'Medium'
  },
  {
    id: 'NTF-5004',
    userId: 'USR-221',
    title: 'Report status updated',
    description: 'Your emergency report RPT-1003 status has been updated to Received.',
    detail: 'Your emergency report RPT-1003 status has been updated to Received.',
    timestamp: '2026-03-11 09:10',
    time: '2026-03-11 09:10',
    type: 'REPORT',
    level: 'Info'
  }
];

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------

let currentPage = 'dashboard';
let activeReportId = null;
let activeCategoryId = null;
let activeCategoryIcon = '';
let emergencyAlertTimer = null;
let sosSoundTimer = null;
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
  subscriptionPriceLkr: membershipsData[0] ? membershipsData[0].amount : 5000,
  operatorContactNumber: '+94 11 900 0119'
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
