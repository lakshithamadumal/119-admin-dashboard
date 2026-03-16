
async function renderSosDetailsPage(docId) {
    if (!docId) return;

    try {
        const sosDoc = await db.collection('emergency_reports').doc(docId).get();
        if (!sosDoc.exists) return alert("SOS record not found!");
        const sos = sosDoc.data();

        const userDoc = await db.collection('users').doc(sos.userId).get();
        const user = userDoc.exists ? userDoc.data() : {};

        setTextById('sos-detail-id', sos.reportId || docId);
        const createdDate = sos.timestamp?.toDate ? sos.timestamp.toDate().toLocaleString() : new Date(sos.timestamp).toLocaleString();
        setTextById('sos-detail-created', createdDate);

        setTextById('detail-user-name', user.name || '-');
        setTextById('detail-user-email', user.email || '-');
        setTextById('detail-user-phone', user.phoneNumber || '-');
        setTextById('detail-user-address', user.address || '-');
        setTextById('detail-user-nic', user.nicNumber || '-');

        setTextById('detail-medical-blood', user.bloodGroup || '-');
        setTextById('detail-medical-allergies', user.allergies || '-');
        setTextById('detail-medical-conditions', user.medicalConditions || '-');
        setTextById('detail-medical-medications', user.currentMedications || '-');

        setTextById('detail-subscription-status', user.paymentStatus || 'Inactive');
        if (user.expiryDate) {
            setTextById('detail-subscription-expiry', new Date(user.expiryDate).toLocaleDateString());
        }

        setTextById('detail-ec1-name', user.emergencyNick1 || 'Contact 1');
        setTextById('detail-ec1-phone', user.emergencyContact1 || '-');
        setTextById('detail-ec2-name', user.emergencyNick2 || 'Contact 2');
        setTextById('detail-ec2-phone', user.emergencyContact2 || '-');

        const mediaContainer = document.getElementById('detail-media-image');
        if (sos.imageUrl || user.profilePicUrl) {
            mediaContainer.innerHTML = `<img src="${sos.imageUrl || user.profilePicUrl}" class="img-fluid rounded border shadow-sm">`;
        } else {
            mediaContainer.textContent = 'No image attached';
        }

    } catch (error) {
        console.error("Error loading SOS details:", error);
    }
}