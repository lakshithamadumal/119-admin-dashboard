let usersRows = [];
let activeUserSearch = '';

function escapeUserText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (usersRows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-body-secondary py-4">No users found.</td></tr>';
        return;
    }

    const term = activeUserSearch.trim().toLowerCase();
    const filteredRows = term
        ? usersRows.filter((item) => item.name.toLowerCase().includes(term))
        : usersRows;

    if (filteredRows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-body-secondary py-4">No users found for the entered name.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRows.map((item) => `
        <tr>
            <td>${escapeUserText(item.uid)}</td>
            <td>${escapeUserText(item.name)}</td>
            <td>${escapeUserText(item.email)}</td>
            <td>${escapeUserText(item.phoneNumber)}</td>
            <td><span class="badge bg-label-${item.statusBadge}">${escapeUserText(item.paymentStatus)}</span></td>
            <td>${escapeUserText(item.totalReportsLabel)}</td>
            <td><button class="btn btn-sm btn-info" onclick="openUserModal('${escapeUserText(item.docId)}')">More Details</button></td>
        </tr>
    `).join('');
}

function attachUserSearchHandler() {
    const searchInput = document.getElementById('search-users');
    if (!searchInput) return;

    searchInput.oninput = () => {
        activeUserSearch = String(searchInput.value || '');
        renderUsersTable();
    };
}

async function fetchUsers() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    try {
        if (typeof db === 'undefined') {
            console.error('Firestore db is not initialized yet.');
            return;
        }

        console.log('Fetching users from Firestore...');
        const snapshot = await db.collection('users').get();

        usersRows = snapshot.docs.map((doc) => {
            const user = doc.data();
            const docId = doc.id;
            const paymentStatus = user.paymentStatus || 'Inactive';

            return {
                docId,
                uid: user.uid || '-',
                name: user.name || '-',
                email: user.email || '-',
                phoneNumber: user.phoneNumber || '-',
                paymentStatus,
                statusBadge: paymentStatus === 'Active' ? 'success' : 'danger',
                totalReportsLabel: `${user.totalReports || 0} Reports`
            };
        });

        renderUsersTable();
    } catch (error) {
        console.error('Error loading users:', error);
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
    attachUserSearchHandler();
    fetchUsers();
}