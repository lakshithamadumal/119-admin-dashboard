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
            document.getElementById('dashboard-today-reports').innerText = data.todayReports || 0;
            document.getElementById('dashboard-all-members').innerText = data.allMembers || 0;

            if (data.weeklyTrend && Array.isArray(data.weeklyTrend)) {
                updateWeeklyTrendChart(data.weeklyTrend);
            }

            console.log("Stats updated successfully!");
        })
        .catch(error => {
            console.error('Error fetching dashboard stats:', error);
        });
}

function updateWeeklyTrendChart(trendData) {
    const chartElement = document.querySelector("#weeklyOverviewChart");
    
    chartElement.innerHTML = "";

    const options = {
        series: [{
            name: 'Total Incidents',
            data: trendData
        }],
        chart: {
            type: 'bar',
            height: 200,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                columnWidth: '40%',
                borderRadius: 4,
                colors: {
                    backgroundBarColors: ['#f2f2f2'],
                    backgroundBarRadius: 4,
                }
            }
        },
        dataLabels: { enabled: false },
        colors: ['#696cff'],
        xaxis: {
            categories: getPastSevenDays(),
            axisTicks: { show: false },
            axisBorder: { show: false }
        },
        grid: { show: false },
        yaxis: { show: false }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
}

function getPastSevenDays() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push(days[d.getDay()]);
    }
    return result;
}