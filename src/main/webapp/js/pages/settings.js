// js/pages/settings.js

async function loadSettings() {
  const priceInput = document.getElementById('settings-subscription-price');
  const operatorInput = document.getElementById('settings-operator-contact');

  if (!priceInput || !operatorInput) return;

  try {
    console.log('Fetching settings from Firestore...');
    const [subDoc, opDoc] = await Promise.all([
      db.collection('app_settings').doc('subscription_config').get(),
      db.collection('operators').doc('1').get()
    ]);

    if (subDoc.exists) priceInput.value = subDoc.data().price || 0;
    if (opDoc.exists) operatorInput.value = opDoc.data().number || '';
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function saveSubscriptionPrice() {
  const amount = Number(document.getElementById('settings-subscription-price').value);
  try {
    await db.collection('app_settings').doc('subscription_config').update({ price: amount });
    Swal.fire({ icon: 'success', title: 'Saved!', text: 'Subscription price updated.', backdrop: 'rgba(105, 108, 255, 0.1)' });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update price.', backdrop: 'rgba(105, 108, 255, 0.1)' });
  }
}

async function saveOperatorContactNumber() {
  const num = document.getElementById('settings-operator-contact').value;
  try {
    await db.collection('operators').doc('1').update({ number: num });
    Swal.fire({ icon: 'success', title: 'Saved!', text: 'Operator contact updated.', backdrop: 'rgba(105, 108, 255, 0.1)' });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update number.', backdrop: 'rgba(105, 108, 255, 0.1)' });
  }
}

function initializeSettingsModule() {
  console.log("Settings module initialized!");
  const btnPrice = document.getElementById('settings-save-subscription');
  const btnContact = document.getElementById('settings-save-contact');

  if (btnPrice) btnPrice.onclick = saveSubscriptionPrice;
  if (btnContact) btnContact.onclick = saveOperatorContactNumber;

  loadSettings();
}