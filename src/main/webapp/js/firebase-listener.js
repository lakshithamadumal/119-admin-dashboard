function initRealtimeUpdates() {
    console.log("Global Listener Active...");

    const collections = ['emergency_reports', 'reports', 'users', 'operators', 'admins', 'categories', 'notifications', 'app_settings'];

    collections.forEach(colName => {
        db.collection(colName).onSnapshot((snapshot) => {
            if (typeof fetchDashboardStats === "function") {
                fetchDashboardStats(); 
            }

            if (colName === 'emergency_reports' || colName === 'reports') {
                handleNewAlerts(snapshot, colName);
            }
        });
    });
}

function handleNewAlerts(snapshot, type) {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            const reportTime = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            if (Math.abs(new Date() - reportTime) < 30000) {
                triggerSweetEmergencyAlert(data, type);
            }
        }
    });
}

function triggerSweetEmergencyAlert(data, type) {
    const audio = document.getElementById('sos-audio');
    if (audio) audio.play().catch(e => console.log("Sound blocked"));

    const isSOS = (type === 'emergency_reports');
    
    Swal.fire({
        title: isSOS ? '🚨 SOS ALERT DETECTED!' : '📝 NEW EMERGENCY REPORT',
        html: `<b>Category:</b> ${data.categoryName || 'General'}<br>
               <b>Severity:</b> ${data.severity || 'High'}<br>
               ${data.message ? `<b>Message:</b> ${data.message}<br>` : ''}
               <b>Location:</b> ${data.address || 'Checking...'}`,
        icon: isSOS ? 'warning' : 'info',
        showCancelButton: true,
        confirmButtonText: 'View on Map',
        confirmButtonColor: '#d33',
        backdrop: `rgba(255, 0, 0, 0.2)`,
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `map.html?lat=${data.latitude}&lng=${data.longitude}`;
        }
    });
}