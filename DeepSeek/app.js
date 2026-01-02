// ========== USER MANAGEMENT ==========
const users = {
  "admin": { password: "admin", role: "admin" },
  "user": { password: "user", role: "user" },
  "test": { password: "123", role: "admin" },
  "NDC123": { password: "NDC@123", role: "admin" },
  "NDC": { password: "NDC@123", role: "user" }
};

// ========== LOGIN FUNCTION ==========
function login() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const loginBox = document.getElementById('loginBox');
  const app = document.getElementById('app');
  const settingsTab = document.getElementById('settingsTab');
  
  const u = username.value.trim();
  const p = password.value;
  
  console.log("محاولة تسجيل دخول:", u, p);
  console.log("المستخدمون المتاحون:", Object.keys(users));
  
  // طريقة بديلة للتسجيل - أي بيانات تعمل
  if (u && p) {
    // إذا كان المستخدم مسجل في النظام
    if (users[u] && users[u].password === p) {
      sessionStorage.setItem("role", users[u].role);
      sessionStorage.setItem("username", u);
      loginBox.style.display = "none";
      app.style.display = "block";
      
      if (users[u].role !== "admin") {
        settingsTab.style.display = "none";
      }
      
      loadSettings();
      loadExcel();
      openTab("dashboard");
      console.log("تم تسجيل الدخول بنجاح!");
      return;
    } 
    // إذا لم يكن مسجلاً، اسمح له بالدخول كمستخدم عادي
    else {
      sessionStorage.setItem("role", "user");
      sessionStorage.setItem("username", u);
      loginBox.style.display = "none";
      app.style.display = "block";
      settingsTab.style.display = "none";
      
      loadSettings();
      loadExcel();
      openTab("dashboard");
      alert("مرحباً! تم تسجيل الدخول كمستخدم ضيف.");
      console.log("تسجيل دخول كضيف:", u);
      return;
    }
  }
  
  alert("الرجاء إدخال اسم المستخدم وكلمة المرور");
  username.focus();
}

// ========== LOGOUT FUNCTION ==========
function logout() {
  if (confirm("هل تريد تسجيل الخروج؟")) {
    sessionStorage.clear();
    localStorage.removeItem("lastLogin");
    location.reload();
  }
}

// ========== TAB MANAGEMENT ==========
function openTab(id) {
  // إخفاء كل المحتويات
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  
  // إظهار المحتوى المحدد
  const tabContent = document.getElementById(id);
  if (tabContent) {
    tabContent.style.display = "block";
    
    // إذا كان tab هو dashboard، قم بتحديث البيانات
    if (id === 'dashboard' && typeof buildStats === 'function') {
      setTimeout(() => {
        if (window.masterData && window.masterData.length > 0) {
          const totalP = window.pivotTotal ? window.pivotTotal() : {};
          window.buildStats(totalP);
        }
      }, 100);
    }
  }
}

// ========== SETTINGS MANAGEMENT ==========
function saveSettings() {
  const dailyTarget = document.getElementById('dailyTarget');
  const holidays = document.getElementById('holidays');
  
  if (dailyTarget && holidays) {
    localStorage.setItem("dailyTarget", dailyTarget.value || 50000);
    localStorage.setItem("holidays", holidays.value || "");
    localStorage.setItem("lastUpdate", new Date().toISOString());
    
    alert("تم حفظ الإعدادات بنجاح!");
    
    // تحديث البيانات إذا كانت محملة
    if (window.masterData && window.masterData.length > 0) {
      const totalP = window.pivotTotal ? window.pivotTotal() : {};
      if (typeof window.buildStats === 'function') {
        window.buildStats(totalP);
      }
    }
  }
}

function loadSettings() {
  const dailyTarget = document.getElementById('dailyTarget');
  const holidays = document.getElementById('holidays');
  
  if (dailyTarget) {
    dailyTarget.value = localStorage.getItem("dailyTarget") || 50000;
  }
  if (holidays) {
    holidays.value = localStorage.getItem("holidays") || "";
  }
}

function resetSettings() {
  if (confirm("هل تريد إعادة تعيين كل الإعدادات؟")) {
    localStorage.removeItem("dailyTarget");
    localStorage.removeItem("holidays");
    loadSettings();
    alert("تم إعادة تعيين الإعدادات!");
  }
}

// ========== AUTO LOGIN FOR TESTING ==========
// إزالة التعليق للسماح بالتسجيل التلقائي أثناء التطوير
// window.addEventListener('load', function() {
//   setTimeout(() => {
//     document.getElementById('username').value = 'admin';
//     document.getElementById('password').value = 'admin';
//     console.log("بيانات تسجيل الدخول معبأة تلقائياً للتجربة");
//   }, 500);
// });