document.addEventListener('DOMContentLoaded', function () {
    fetchDashboardStats();
});

function fetchDashboardStats() {
    console.log("Fetching dashboard statistics...");

    fetch('get-stats')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error("Backend error occurred while fetching stats");
                return;
            }

            document.getElementById('dashboard-total-reports').innerText = data.totalReports || 0;
            document.getElementById('dashboard-total-sos').innerText = data.totalSOS || 0;
            document.getElementById('dashboard-active-emergencies').innerText = data.activeEmergency || 0;
            document.getElementById('dashboard-all-members').innerText = data.allMembers || 0;

            console.log("Stats updated successfully!");
        })
        .catch(error => {
            console.error('Error fetching dashboard stats:', error);
        });
}