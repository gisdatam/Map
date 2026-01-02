// ========== DRAW CHARTS ==========
function drawCharts(teamPivot, totalPivot) {
  console.log("رسم المخططات...");
  
  // ===== TEAM CHART =====
  const teamChartCanvas = document.getElementById('teamChart');
  if (teamChartCanvas) {
    // تدمير المخطط القديم إذا كان موجوداً
    if (window.teamChartInstance) {
      window.teamChartInstance.destroy();
    }
    
    const dates = Object.keys(totalPivot).sort();
    const teams = {};
    
    // تجميع بيانات الفرق
    dates.forEach(date => {
      if (teamPivot[date]) {
        Object.keys(teamPivot[date]).forEach(team => {
          if (!teams[team]) {
            teams[team] = [];
          }
        });
      }
    });
    
    // تعبئة البيانات
    dates.forEach(date => {
      Object.keys(teams).forEach(team => {
        teams[team].push(teamPivot[date] ? (teamPivot[date][team] || 0) : 0);
      });
    });
    
    // إعداد ألوان الفرق
    const teamColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(14, 165, 233, 0.8)'
    ];
    
    const datasets = Object.keys(teams).map((team, index) => ({
      label: team,
      data: teams[team],
      backgroundColor: teamColors[index % teamColors.length],
      borderColor: teamColors[index % teamColors.length].replace('0.8', '1'),
      borderWidth: 2,
      borderRadius: 4
    }));
    
    // إضافة خط الهدف إذا كان هناك بيانات
    const dailyTarget = +(localStorage.getItem("dailyTarget") || 50000);
    if (dates.length > 0) {
      datasets.push({
        label: 'Daily Target',
        data: dates.map(() => dailyTarget),
        type: 'line',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      });
    }
    
    window.teamChartInstance = new Chart(teamChartCanvas, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e5e7eb'
            }
          },
          title: {
            display: true,
            text: 'Daily Performance by Team',
            color: '#e5e7eb'
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9ca3af',
              callback: function(value) {
                return value.toLocaleString() + ' m²';
              }
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        }
      }
    });
  }
  
  // ===== TOTAL CHART =====
  const totalChartCanvas = document.getElementById('totalChart');
  if (totalChartCanvas) {
    // تدمير المخطط القديم إذا كان موجوداً
    if (window.totalChartInstance) {
      window.totalChartInstance.destroy();
    }
    
    const dates = Object.keys(totalPivot).sort();
    const totals = dates.map(date => totalPivot[date]);
    
    // حساب التراكمي
    const cumulative = [];
    let runningTotal = 0;
    totals.forEach(total => {
      runningTotal += total;
      cumulative.push(runningTotal);
    });
    
    window.totalChartInstance = new Chart(totalChartCanvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Daily Total',
            data: totals,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Cumulative Total',
            data: cumulative,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e5e7eb'
            }
          },
          title: {
            display: true,
            text: 'Total Progress',
            color: '#e5e7eb'
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9ca3af',
              callback: function(value) {
                return value.toLocaleString() + ' m²';
              }
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        }
      }
    });
  }
}