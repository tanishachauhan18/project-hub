/**
 * ProjectHub - Chart.js Initializers for Dashboards & Analytics
 */

function initAdminCharts(domainLabels, domainData, statusData) {
  // 1. Domain Distribution Doughnut Chart
  const domainCtx = document.getElementById('adminDomainChart');
  if (domainCtx && domainLabels && domainLabels.length > 0) {
    new Chart(domainCtx, {
      type: 'doughnut',
      data: {
        labels: domainLabels,
        datasets: [{
          data: domainData,
          backgroundColor: ['#3a86ff', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#4cc9f0'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }, padding: 15 }
          }
        },
        cutout: '70%'
      }
    });
  }

  // 2. Project Status Distribution Bar Chart
  const statusCtx = document.getElementById('adminStatusChart');
  if (statusCtx && statusData) {
    const labels = Object.keys(statusData).map(k => k.replace('_', ' ').toUpperCase());
    const counts = Object.values(statusData);

    new Chart(statusCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Projects Count',
          data: counts,
          backgroundColor: '#3a86ff',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

function initReportsChart(gradesData) {
  const gradeCtx = document.getElementById('reportsGradeChart');
  if (gradeCtx && gradesData) {
    new Chart(gradeCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(gradesData),
        datasets: [{
          label: 'Student Projects Evaluated',
          data: Object.values(gradesData),
          backgroundColor: ['#10b981', '#3a86ff', '#8b5cf6', '#f59e0b', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}
