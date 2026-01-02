// ========== PIVOT TEAMS DATA ==========
function pivotTeams() {
  console.log("معالجة بيانات الفرق...");
  
  const out = {};
  
  if (!window.masterData || window.masterData.length === 0) {
    console.warn("لا توجد بيانات متاحة");
    return out;
  }
  
  window.masterData.forEach(r => {
    // تحقق من صحة البيانات
    if (!r || r["Activty Type"] !== "TS Activity") return;
    
    const d = r.Date;
    const t = r.Team || "Unknown";
    const a = +r["TS AREA IN (M2)"] || 0;
    
    if (!d) return;
    
    out[d] = out[d] || {};
    out[d][t] = (out[d][t] || 0) + a;
  });
  
  console.log("بيانات الفرق المعالجة:", out);
  return out;
}

// ========== PIVOT TOTAL DATA ==========
function pivotTotal() {
  console.log("حساب الإجماليات...");
  
  const out = {};
  
  if (!window.masterData || window.masterData.length === 0) {
    return out;
  }
  
  window.masterData.forEach(r => {
    if (!r || r["Activty Type"] !== "TS Activity") return;
    
    const d = r.Date;
    const a = +r["TS AREA IN (M2)"] || 0;
    
    if (!d) return;
    
    out[d] = (out[d] || 0) + a;
  });
  
  // ترتيب التواريخ
  const sorted = {};
  Object.keys(out).sort().forEach(key => {
    sorted[key] = out[key];
  });
  
  console.log("الإجماليات المحسوبة:", sorted);
  return sorted;
}

// ========== RENDER TEAM TABLE ==========
function renderTeamTable(pivotData) {
  const teamTable = document.getElementById('teamTable');
  if (!teamTable) return;
  
  if (Object.keys(pivotData).length === 0) {
    teamTable.innerHTML = `
      <div style="background:#1f2937; padding:20px; border-radius:8px; text-align:center;">
        <p>لا توجد بيانات متاحة</p>
        <p style="color:#9ca3af; font-size:14px;">جاري تحميل البيانات...</p>
      </div>
    `;
    return;
  }
  
  // استخراج الفرق الفريدة
  const allTeams = new Set();
  Object.values(pivotData).forEach(dayData => {
    Object.keys(dayData).forEach(team => {
      if (team && team !== "undefined") {
        allTeams.add(team);
      }
    });
  });
  
  const teams = Array.from(allTeams).sort();
  const dates = Object.keys(pivotData).sort();
  
  let html = `<table>
    <thead>
      <tr>
        <th>Date</th>`;
  
  teams.forEach(t => {
    html += `<th>${t}</th>`;
  });
  
  html += `<th>Total</th></tr></thead><tbody>`;
  
  dates.forEach(date => {
    html += `<tr><td>${date}</td>`;
    
    let dayTotal = 0;
    teams.forEach(team => {
      const value = pivotData[date][team] || 0;
      dayTotal += value;
      html += `<td>${value.toLocaleString()}</td>`;
    });
    
    html += `<td><strong>${dayTotal.toLocaleString()}</strong></td></tr>`;
  });
  
  // إضافة المجموع النهائي
  html += `<tr style="background:#374151;"><td><strong>Total</strong></td>`;
  
  let grandTotal = 0;
  teams.forEach(team => {
    let teamTotal = 0;
    dates.forEach(date => {
      teamTotal += pivotData[date][team] || 0;
    });
    grandTotal += teamTotal;
    html += `<td><strong>${teamTotal.toLocaleString()}</strong></td>`;
  });
  
  html += `<td><strong style="color:#60a5fa;">${grandTotal.toLocaleString()}</strong></td></tr>`;
  
  html += `</tbody></table>`;
  
  teamTable.innerHTML = html;
}

// ========== RENDER TOTAL TABLE ==========
function renderTotalTable(pivotData) {
  const totalTable = document.getElementById('totalTable');
  if (!totalTable) return;
  
  if (Object.keys(pivotData).length === 0) {
    totalTable.innerHTML = `
      <div style="background:#1f2937; padding:20px; border-radius:8px; text-align:center;">
        <p>لا توجد بيانات متاحة</p>
      </div>
    `;
    return;
  }
  
  const dates = Object.keys(pivotData).sort();
  
  let html = `<table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Total Area (m²)</th>
        <th>Cumulative</th>
        <th>Daily Target</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>`;
  
  const dailyTarget = +(localStorage.getItem("dailyTarget") || 50000);
  let cumulative = 0;
  
  dates.forEach(date => {
    const dailyValue = pivotData[date] || 0;
    cumulative += dailyValue;
    const targetAchieved = dailyValue >= dailyTarget;
    
    html += `
      <tr>
        <td>${date}</td>
        <td>${dailyValue.toLocaleString()}</td>
        <td>${cumulative.toLocaleString()}</td>
        <td>${dailyTarget.toLocaleString()}</td>
        <td style="color: ${targetAchieved ? '#10b981' : '#ef4444'}">
          ${targetAchieved ? '✓ Achieved' : '✗ Not Achieved'}
        </td>
      </tr>
    `;
  });
  
  html += `
    <tr style="background:#374151;">
      <td><strong>GRAND TOTAL</strong></td>
      <td><strong>${Object.values(pivotData).reduce((a, b) => a + b, 0).toLocaleString()}</strong></td>
      <td><strong>${cumulative.toLocaleString()}</strong></td>
      <td colspan="2"></td>
    </tr>
  </tbody></table>`;
  
  totalTable.innerHTML = html;
}