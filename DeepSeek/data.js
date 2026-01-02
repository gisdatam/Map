let masterData = [];
let excelData = [];

// ========== LOAD EXCEL DATA ==========
function loadExcel() {
  console.log("جاري تحميل البيانات...");
  
  // رابط احتياطي للبيانات
  const excelUrl = "https://onedrive.live.com/download?resid=7ba5320a-658b-474b-8188-448b5f6f2e1b";
  const backupData = [
    { Date: "2025-12-23", Team: "Team A", "TS AREA IN (M2)": 1500, "Activty Type": "TS Activity" },
    { Date: "2025-12-23", Team: "Team B", "TS AREA IN (M2)": 2000, "Activty Type": "TS Activity" },
    { Date: "2025-12-24", Team: "Team A", "TS AREA IN (M2)": 1800, "Activty Type": "TS Activity" },
    { Date: "2025-12-24", Team: "Team C", "TS AREA IN (M2)": 1200, "Activty Type": "TS Activity" },
    { Date: "2025-12-25", Team: "Team B", "TS AREA IN (M2)": 2200, "Activty Type": "TS Activity" }
  ];
  
  fetch(excelUrl)
    .then(response => {
      if (!response.ok) throw new Error("فشل تحميل الملف");
      return response.arrayBuffer();
    })
    .then(data => {
      const wb = XLSX.read(data, { type: "array" });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      masterData = XLSX.utils.sheet_to_json(firstSheet);
      excelData = [...masterData];
      console.log("تم تحميل البيانات بنجاح:", masterData.length, "صف");
      buildAll();
    })
    .catch(error => {
      console.error("خطأ في تحميل الملف، استخدام بيانات تجريبية:", error);
      masterData = backupData;
      excelData = [...backupData];
      buildAll();
      alert("تم تحميل بيانات تجريبية. الرابط الرئيسي غير متوفر.");
    });
}

// ========== BUILD ALL COMPONENTS ==========
function buildAll() {
  console.log("بناء المكونات...");
  
  buildStatsBox();
  
  if (typeof window.pivotTeams === 'function' && typeof window.pivotTotal === 'function') {
    const teamPivot = window.pivotTeams();
    const totalPivot = window.pivotTotal();
    
    if (typeof window.renderTeamTable === 'function') {
      window.renderTeamTable(teamPivot);
    }
    
    if (typeof window.renderTotalTable === 'function') {
      window.renderTotalTable(totalPivot);
    }
    
    if (typeof window.drawCharts === 'function') {
      window.drawCharts(teamPivot, totalPivot);
    }
    
    if (typeof window.buildStats === 'function') {
      window.buildStats(totalPivot);
    }
  }
}

// ========== BUILD STATS BOX ==========
function buildStatsBox() {
  const statsBox = document.getElementById('statsBox');
  if (!statsBox) return;
  
  statsBox.innerHTML = `
    <div class="card">
      Total Records<br>
      <b>${masterData.length}</b>
    </div>
    <div class="card">
      Teams<br>
      <b>${[...new Set(masterData.map(d => d.Team))].length}</b>
    </div>
    <div class="card">
      Days<br>
      <b>${[...new Set(masterData.map(d => d.Date))].length}</b>
    </div>
    <div class="card">
      Last Update<br>
      <b>${new Date().toLocaleDateString()}</b>
    </div>
  `;
}

// ========== INITIALIZE ON LOAD ==========
// تحميل الإعدادات عند بدء التشغيل
window.addEventListener('load', function() {
  console.log("الصفحة جاهزة");
  
  // إذا كان المستخدم مسجل بالفعل
  if (sessionStorage.getItem("role")) {
    document.getElementById('loginBox').style.display = "none";
    document.getElementById('app').style.display = "block";
    
    if (sessionStorage.getItem("role") !== "admin") {
      const settingsTab = document.getElementById('settingsTab');
      if (settingsTab) settingsTab.style.display = "none";
    }
    
    loadSettings();
    loadExcel();
    openTab("dashboard");
  }
});