/**
 * Settings page module.
 * Depends on: js/utils.js, js/data.js, js/pages/memberships.js, js/pages/payments.js
 */

function showSettingsFeedback(elementId) {
  const feedback = document.getElementById(elementId);
  if (!feedback) {
    return;
  }

  feedback.classList.remove('d-none');
  setTimeout(() => feedback.classList.add('d-none'), 2500);
}

function saveSubscriptionPrice() {
  const input = document.getElementById('settings-subscription-price');
  if (!input) {
    return;
  }

  const amount = Number(input.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('Please enter a valid subscription price in LKR.');
    return;
  }

  appSettings.subscriptionPriceLkr = amount;
  applySubscriptionPriceAcrossData(amount);
  saveAppSettings();

  renderMembershipsTable('memberships-table-body', membershipsData);
  renderPaymentsTable('payments-table-body', paymentsData);
  showSettingsFeedback('settings-subscription-feedback');
}

function saveOperatorContactNumber() {
  const input = document.getElementById('settings-operator-contact');
  if (!input) {
    return;
  }

  const operatorContactNumber = input.value.trim();
  if (!operatorContactNumber) {
    alert('Please enter an operator contact number.');
    return;
  }

  appSettings.operatorContactNumber = operatorContactNumber;
  saveAppSettings();
  showSettingsFeedback('settings-contact-feedback');
}

function initializeSettingsModule() {
  const priceInput = document.getElementById('settings-subscription-price');
  const operatorInput = document.getElementById('settings-operator-contact');
  const saveSubscriptionButton = document.getElementById('settings-save-subscription');
  const saveContactButton = document.getElementById('settings-save-contact');

  if (priceInput) {
    priceInput.value = String(appSettings.subscriptionPriceLkr);
  }

  if (operatorInput) {
    operatorInput.value = appSettings.operatorContactNumber;
  }

  if (saveSubscriptionButton) {
    saveSubscriptionButton.addEventListener('click', saveSubscriptionPrice);
  }

  if (saveContactButton) {
    saveContactButton.addEventListener('click', saveOperatorContactNumber);
  }
}
