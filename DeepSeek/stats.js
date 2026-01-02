// ========== CALCULATE WORKING DAYS ==========
function workingDays(startDate, endDate, holidays) {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  
  // تأكد من أن التواريخ صالحة
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().slice(0, 10);
    
    // تحقق إذا لم يكن الجمعة (5) وليس في العطلات
    if (dayOfWeek !== 5 && !holidays.includes(dateStr)) {
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// ========== BUILD STATISTICS ==========
function buildStats(totalPivot) {
  console.log("بناء الإحصائيات...");
  
  const TOTAL_AREA = 11282184; // المساحة الكلية المستهدفة
  const completed = Object.values(totalPivot).reduce((a, b) => a + b, 0);
  
  // التواريخ المهمة
  const startDate = new Date("2025-12-23");
  const endDate = new Date("2026-03-10");
  const today = new Date();
  
  // تحميل العطلات
  const holidaysStr = localStorage.getItem("holidays") || "";
  const holidays = holidaysStr.split(",").map(h => h.trim()).filter(h => h);
  
  // الحسابات
  const totalDays = workingDays(startDate, endDate, holidays);
  const passedDays = workingDays(startDate, today, holidays);
  const remainingDays = totalDays - passedDays;
  
  const progressPercent = totalDays > 0 ? (passedDays / totalDays) * 100 : 0;
  const workPercent = TOTAL_AREA > 0 ? (completed / TOTAL_AREA) * 100 : 0;
  
  // تحديث KPIs
  const kpis = document.getElementById('kpis');
  if (kpis) {
    kpis.innerHTML = `
      <div class="card">
        Total Area<br>
        <b>${TOTAL_AREA.toLocaleString()} m²</b>
      </div>
      <div class="card">
        Completed<br>
        <b>${completed.toLocaleString()} m²</b>
      </div>
      <div class="card">
        Progress<br>
        <b>${workPercent.toFixed(1)}%</b>
      </div>
      <div class="card">
        Days Left<br>
        <b>${remainingDays}</b>
      </div>
    `;
  }
  
  // تحديث شريط التقدم
  const progressWork = document.querySelector('.progress-work');
  const progressTime = document.querySelector('.progress-time');
  
  if (progressWork) {
    progressWork.style.width = `${workPercent}%`;
    progressWork.parentElement.setAttribute('data-percent', `${workPercent.toFixed(1)}%`);
  }
  
  if (progressTime) {
    progressTime.style.width = `${progressPercent}%`;
    progressTime.parentElement.setAttribute('data-percent', `${progressPercent.toFixed(1)}%`);
  }
  
  // تحديث محتوى الإحصائيات
  const statsContent = document.getElementById('statisticsContent');
  if (statsContent) {
    statsContent.innerHTML = `
      <div style="background:#1f2937; padding:20px; border-radius:8px; margin-top:20px;">
        <h3>Project Summary</h3>
        <table>
          <tr>
            <td>Start Date</td>
            <td><strong>${startDate.toLocaleDateString()}</strong></td>
          </tr>
          <tr>
            <td>End Date</td>
            <td><strong>${endDate.toLocaleDateString()}</strong></td>
          </tr>
          <tr>
            <td>Total Working Days</td>
            <td><strong>${totalDays} days</strong></td>
          </tr>
          <tr>
            <td>Days Passed</td>
            <td><strong>${passedDays} days</strong></td>
          </tr>
          <tr>
            <td>Days Remaining</td>
            <td><strong>${remainingDays} days</strong></td>
          </tr>
          <tr>
            <td>Daily Target</td>
            <td><strong>${(localStorage.getItem("dailyTarget") || 50000).toLocaleString()} m²/day</strong></td>
          </tr>
          <tr>
            <td>Required Daily Rate</td>
            <td><strong>${remainingDays > 0 ? Math.ceil((TOTAL_AREA - completed) / remainingDays).toLocaleString() : 0} m²/day</strong></td>
          </tr>
        </table>
        
        <div style="margin-top:20px; padding:15px; background:#374151; border-radius:6px;">
          <h4>Performance Analysis</h4>
          <p>Work Progress: <strong>${workPercent.toFixed(1)}%</strong></p>
          <p>Time Elapsed: <strong>${progressPercent.toFixed(1)}%</strong></p>
          <p>Status: <strong style="color:${workPercent >= progressPercent ? '#10b981' : '#ef4444'}">
            ${workPercent >= progressPercent ? 'Ahead of Schedule' : 'Behind Schedule'}
          </strong></p>
        </div>
      </div>
    `;
  }
  
  console.log("الإحصائيات المحسوبة:", {
    completed,
    workPercent,
    progressPercent,
    remainingDays
  });
}