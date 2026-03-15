async function fetchUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    try {
        console.log("Fetching users from Firestore...");
        const snapshot = await db.collection('users').get();
        tbody.innerHTML = '';

        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No users found.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const user = doc.data();
            const docId = doc.id;

            const statusBadge = user.paymentStatus === 'Active' ? 'success' : 'danger';

            tbody.innerHTML += `
                <tr>
                    <td>${user.uid}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phoneNumber}</td>
                    <td><span class="badge bg-label-${statusBadge}">${user.paymentStatus || 'Inactive'}</span></td>
                    <td>${user.totalReports || 0} Reports</td>
                    <td><button class="btn btn-sm btn-info" onclick="openUserModal('${docId}')">More Details</button></td>
                </tr>`;
        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

async function openUserModal(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (!doc.exists) return;

        const user = doc.data();

        document.getElementById('modal-user-id').value = user.uid || uid;
        document.getElementById('modal-user-name').value = user.name || '-';
        document.getElementById('modal-user-email').value = user.email || '-';
        document.getElementById('modal-user-phone').value = user.phoneNumber || '-';
        document.getElementById('modal-user-nic').value = user.nicNumber || '-';
        document.getElementById('modal-user-address').value = user.address || '-';
        document.getElementById('modal-user-registered').value = "Registered User"; 

        document.getElementById('modal-medical-blood').value = user.bloodGroup || '-';
        document.getElementById('modal-medical-allergies').value = user.allergies || '-';
        document.getElementById('modal-medical-conditions').value = user.medicalConditions || '-';
        document.getElementById('modal-medical-medications').value = user.currentMedications || '-';

        document.getElementById('modal-subscription-status').value = user.paymentStatus || 'Inactive';
        
        if (user.expiryDate) {
            const date = new Date(user.expiryDate);
            document.getElementById('modal-subscription-expiry').value = date.toLocaleDateString();
        } else {
            document.getElementById('modal-subscription-expiry').value = '-';
        }

        document.getElementById('modal-ec1-name').value = user.emergencyNick1 || 'Contact 1';
        document.getElementById('modal-ec1-phone').value = user.emergencyContact1 || '-';
        document.getElementById('modal-ec2-name').value = user.emergencyNick2 || 'Contact 2';
        document.getElementById('modal-ec2-phone').value = user.emergencyContact2 || '-';

        const mediaContainer = document.getElementById('modal-media-image');
        if (user.profilePicUrl) {
            mediaContainer.innerHTML = `<img src="${user.profilePicUrl}" alt="Profile Pic" class="img-fluid rounded border" style="max-width: 150px;">`;
        } else {
            mediaContainer.textContent = 'No image uploaded';
        }

        const userModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
        userModal.show();

    } catch (error) {
        console.error("Error fetching user details:", error);
        Swal.fire('Error', 'Could not load user details', 'error');
    }
}

function initializeUsersModule() {
    fetchUsers();
}