// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC155NEtYw5sh3n7I65Qc-SXpOutOlzoIk",
  authDomain: "break-tracker---1.firebaseapp.com",
  projectId: "break-tracker---1",
  storageBucket: "break-tracker---1.firebasestorage.app",
  messagingSenderId: "212859798774",
  appId: "1:212859798774:web:0e4e4fc87f42edc93698d7",
  measurementId: "G-N456D373FP"
};
// --- Magical Team Break Tracker JS ---
// Prefilled employees
const employeeList = [
  {name: "Asha AS", email: "asha.as@opendoor.com", empid: "010293", shift: "5 pm - 2 am IST"},
  {name: "Revathi Kumar", email: "revathi.kumar@opendoor.com", empid: "010113", shift: "8 pm - 5 am IST"},
  {name: "Pranesh Krishnamoorthy", email: "pranesh.krishnamoorthy@opendoor.com", empid: "009771", shift: "5 pm - 2 am IST"},
  {name: "Sheeba Rani D", email: "sheeba.rani.d@opendoor.com", empid: "009741", shift: "5 pm - 2 am IST"},
  {name: "Subham E", email: "subham.e@opendoor.com", empid: "010290", shift: "8 pm - 5 am IST"},
  {name: "Sunmathy Wilson", email: "sunmathy.wilson@opendoor.com", empid: "009753", shift: "5 pm - 2 am IST"},
  {name: "Trilokes Sahu", email: "trilokes.sahu@opendoor.com", empid: "009734", shift: "8 pm - 5 am IST"},
  {name: "Udhaya Kumari", email: "udhaya.kumari@opendoor.com", empid: "010242", shift: "8 pm - 5 am IST"},
  {name: "Afredi", email: "afredi.a@opendoor.com", empid: "009426", shift: "8 pm - 5 am IST"},
  {name: "Akshaya Narayanan", email: "akshaya.narayanan@opendoor.com", empid: "009495", shift: "5 pm - 2 am IST"},
  {name: "Gopal M", email: "gopal.m@opendoor.com", empid: "009443", shift: "8 pm - 5 am IST"},
  {name: "Kamesh D", email: "d.kamesh@opendoor.com", empid: "010193", shift: "8 pm - 5 am IST"},
  {name: "Manikandan M", email: "manikandan.m@opendoor.com", empid: "009516", shift: "8 pm - 5 am IST"},
  {name: "Nirosha Banu", email: "nirosha.banu@opendoor.com", empid: "009810", shift: "8 pm - 5 am IST"},
  {name: "Savitha E", email: "savitha.e@opendoor.com", empid: "009464", shift: "8 pm - 5 am IST"},
  {name: "Ramya Bharathi. R", email: "ramya.bharathir@opendoor.com", empid: "009818", shift: "5 pm - 2 am IST"},
  {name: "Muzammil Ahamed Hussain", email: "muzammil.ahamedhussain@opendoor.com", empid: "010264", shift: "8 pm - 5 am IST"},
  {name: "Srinivasan N", email: "srinivasan.n@opendoor.com", empid: "010266", shift: "8 pm - 5 am IST"},
  {name: "Vinod Kumar", email: "vinod.kumar@opendoor.com", empid: "008459", shift: "8 pm - 5 am IST"},
  {name: "Sreenath", email: "sreenath.ab@opendoor.com", empid: "008526", shift: "8 pm - 5 am IST"}
];

// Avatar images (avatar1.jpg to avatar15.jpg in assets folder)
const avatarCount = 15;
const avatarFiles = Array.from({length: avatarCount}, (_, i) => `avatar${i+1}.jpg`);

let users = JSON.parse(localStorage.getItem('magical_users') || "[]");
let currentUser = JSON.parse(localStorage.getItem('magical_currentUser') || "null");
let breakStartTime = null;
let breakTimerInterval = null;

// ---- Utility functions ----
function showSection(sectionId) {
  document.getElementById('register-section').classList.add('hidden');
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById(sectionId).classList.remove('hidden');
}

// ---- Registration Page Setup ----
function populateEmployeeDropdown() {
  const select = document.getElementById('employee-select');
  employeeList.forEach((emp, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${emp.name} (${emp.empid})`;
    select.appendChild(option);
  });
}

// Render avatar image options from assets/avatar1.jpg ... avatar15.jpg
function renderAvatarOptions(selectedFile) {
  const container = document.querySelector('.avatar-options');
  container.innerHTML = "";
  avatarFiles.forEach(file => {
    const img = document.createElement('img');
    img.className = "avatar-choice" + (selectedFile === file ? " selected" : "");
    img.src = `assets/${file}`;
    img.alt = file;
    img.title = file.replace('.jpg', '').replace('_', ' ');
    img.onclick = () => selectAvatar(file);
    container.appendChild(img);
  });
}
function selectAvatar(file) {
  document.getElementById('reg-avatar').value = file;
  renderAvatarOptions(file);
}
function prefillEmployee() {
  const idx = document.getElementById('employee-select').value;
  if (idx === "") {
    document.getElementById('reg-name').value = "";
    document.getElementById('reg-email').value = "";
    document.getElementById('reg-empid').value = "";
    document.getElementById('reg-shift').value = "";
    return;
  }
  const emp = employeeList[idx];
  document.getElementById('reg-name').value = emp.name;
  document.getElementById('reg-email').value = emp.email;
  document.getElementById('reg-empid').value = emp.empid;
  document.getElementById('reg-shift').value = emp.shift;
}

// ---- Registration & Login ----
function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const empid = document.getElementById('reg-empid').value.trim();
  const shift = document.getElementById('reg-shift').value.trim();
  const password = document.getElementById('reg-password').value;
  const avatar = document.getElementById('reg-avatar').value;

  if(!name || !email || !empid || !shift || !password || !avatar) {
    alert("Please fill all fields!");
    return;
  }
  if(users.some(u => u.email === email || u.empid === empid)) {
    alert("User with this email or Emp ID already exists!");
    return;
  }
  const user = {
    name, email, empid, shift, password, avatar,
    breaks: [],
    loginHistory: []
  };
  users.push(user);
  localStorage.setItem('magical_users', JSON.stringify(users));
  alert("Registered! Please log in.");
  showSection('login-section');
}

function login() {
  const usernameOrEmail = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const user = users.find(u => 
    (u.name === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );
  if(!user) {
    alert("Invalid credentials!");
    return;
  }
  user.loginHistory.push(new Date().toISOString());
  users = users.map(u => u.email === user.email ? user : u);
  localStorage.setItem('magical_users', JSON.stringify(users));
  currentUser = user;
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
  showSection('dashboard-section');
  renderDashboard();
}

function logout() {
  currentUser = null;
  localStorage.setItem('magical_currentUser', "null");
  showSection('login-section');
}

// ---- Break Timer ----
function startBreak() {
  breakStartTime = new Date();
  document.getElementById('start-break').classList.add('hidden');
  document.getElementById('end-break').classList.remove('hidden');
  document.getElementById('break-timer').textContent = "Break started!";
  breakTimerInterval = setInterval(updateBreakTimer, 1000);
}
function updateBreakTimer() {
  if(breakStartTime) {
    const now = new Date();
    const diff = Math.floor((now - breakStartTime) / 1000);
    const min = Math.floor(diff / 60), sec = diff % 60;
    document.getElementById('break-timer').textContent = `Break duration: ${min} min ${sec} sec`;
  }
}
function endBreak() {
  if(!breakStartTime) return;
  const endTime = new Date();
  const duration = Math.floor((endTime - breakStartTime) / 1000); // in seconds
  currentUser.breaks.push({
    start: breakStartTime.toISOString(),
    end: endTime.toISOString(),
    duration
  });
  users = users.map(u => u.email === currentUser.email ? currentUser : u);
  localStorage.setItem('magical_users', JSON.stringify(users));
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
  breakStartTime = null;
  clearInterval(breakTimerInterval);
  document.getElementById('start-break').classList.remove('hidden');
  document.getElementById('end-break').classList.add('hidden');
  document.getElementById('break-timer').textContent = "";
  renderDashboard();
  alert("Break ended and recorded!");
}

// ---- Dashboard ----
function renderDashboard() {
  // Set default filter values
  document.getElementById('filter-user').value = currentUser ? currentUser.name : "";
  document.getElementById('filter-date').value = new Date().toISOString().slice(0,10);

  // Render user breaks and login history table for filtered user/date
  const filterUser = document.getElementById('filter-user').value.trim().toLowerCase();
  const filterDate = document.getElementById('filter-date').value;
  let filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filterUser) ||
    u.email.toLowerCase().includes(filterUser) ||
    u.empid.toLowerCase().includes(filterUser)
  );
  if(filteredUsers.length === 0) filteredUsers = [currentUser];

  let html = "";
  filteredUsers.forEach(u => {
    // Breaks for filtered date
    let breaksToday = u.breaks;
    if(filterDate) {
      breaksToday = u.breaks.filter(b => b.start.slice(0,10) === filterDate);
    }
    let loginToday = u.loginHistory.filter(dt => dt.slice(0,10) === filterDate);

    html += `<div class="dashboard-user">
      <img class="dashboard-avatar" src="assets/${u.avatar}" alt="${u.avatar}">
      <b>${u.name}</b> <small>(${u.empid})</small><br>
      <span style="font-size:0.97em;">Shift: ${u.shift}</span><br>
      <span style="font-size:0.97em;">Logins: ${loginToday.length}</span>
      <div>
        <table class="break-table">
          <tr>
            <th>#</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration (min)</th>
          </tr>
          ${
            breaksToday.length === 0 ? 
            `<tr><td colspan="4">No breaks</td></tr>` :
            breaksToday.map((b,i) =>
              `<tr>
                <td>${i+1}</td>
                <td>${new Date(b.start).toLocaleTimeString()}</td>
                <td>${new Date(b.end).toLocaleTimeString()}</td>
                <td>${(b.duration/60).toFixed(2)}</td>
              </tr>`
            ).join("")
          }
        </table>
        <span style="font-size:0.97em;">Total break: ${(breaksToday.reduce((sum,b)=>sum+b.duration,0)/60).toFixed(2)} min</span>
      </div>
    </div>`;
  });

  document.getElementById('dashboard-content').innerHTML = html;
}

// ---- CSV Download ----
function downloadCSV() {
  const filterUser = document.getElementById('filter-user').value.trim().toLowerCase();
  const filterDate = document.getElementById('filter-date').value;
  let csv = "Name,EmpID,Shift,Date,Start,End,Duration(min)\n";
  users.forEach(u => {
    if (
      u.name.toLowerCase().includes(filterUser) ||
      u.email.toLowerCase().includes(filterUser) ||
      u.empid.toLowerCase().includes(filterUser)
    ) {
      let breaksToday = u.breaks;
      if(filterDate) {
        breaksToday = u.breaks.filter(b => b.start.slice(0,10) === filterDate);
      }
      breaksToday.forEach(b => {
        csv += `"${u.name}","${u.empid}","${u.shift}","${b.start.slice(0,10)}","${new Date(b.start).toLocaleTimeString()}","${new Date(b.end).toLocaleTimeString()}",${(b.duration/60).toFixed(2)}\n`;
      });
      if(breaksToday.length === 0) {
        csv += `"${u.name}","${u.empid}","${u.shift}","${filterDate}","","",0\n`;
      }
    }
  });
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "breaks.csv";
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);}, 100);
}

// ---- On Load ----
window.onload = function() {
  populateEmployeeDropdown();
  renderAvatarOptions("avatar1.jpg");
  if(currentUser) {
    showSection('dashboard-section');
    renderDashboard();
  } else {
    showSection('login-section');
  }
};
// ... (rest of your code above stays the same)

// ---- Break Timer ----
function startBreak() {
  breakStartTime = new Date();
  currentUser.currentBreakStart = breakStartTime.toISOString();
  saveUsers();
  renderDashboard();
  document.getElementById('start-break').classList.add('hidden');
  document.getElementById('end-break').classList.remove('hidden');
  breakTimerInterval = setInterval(updateBreakTimer, 1000);
}

function updateBreakTimer() {
  if (breakStartTime) {
    const now = new Date();
    const diff = Math.floor((now - breakStartTime) / 1000);
    const min = Math.floor(diff / 60), sec = diff % 60;
    document.getElementById('break-timer').textContent = `Break duration: ${min} min ${sec} sec`;
    renderDashboard(); // live update for team
  }
}

function endBreak() {
  if (!breakStartTime && !currentUser.currentBreakStart) return;
  const endTime = new Date();
  let startTime = breakStartTime ? breakStartTime : new Date(currentUser.currentBreakStart);
  const duration = Math.floor((endTime - startTime) / 1000);
  currentUser.breaks.push({
    start: startTime.toISOString(),
    end: endTime.toISOString(),
    duration
  });
  delete currentUser.currentBreakStart;
  saveUsers();
  breakStartTime = null;
  clearInterval(breakTimerInterval);
  document.getElementById('start-break').classList.remove('hidden');
  document.getElementById('end-break').classList.add('hidden');
  document.getElementById('break-timer').textContent = "";
  renderDashboard();
  alert("Break ended and recorded!");
}

// --- Utility to save users everywhere ---
function saveUsers() {
  users = users.map(u => u.email === currentUser.email ? currentUser : u);
  localStorage.setItem('magical_users', JSON.stringify(users));
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
}

// ---- Dashboard: show all users, live status ----
function renderDashboard() {
  // Filters
  const filterUser = document.getElementById('filter-user').value.trim().toLowerCase();
  const filterDate = document.getElementById('filter-date').value;
  let filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(filterUser) ||
    u.email.toLowerCase().includes(filterUser) ||
    u.empid.toLowerCase().includes(filterUser)
  );
  if (filteredUsers.length === 0) filteredUsers = [currentUser];

  let html = "";
  filteredUsers.forEach(u => {
    // Status
    let status = "Working";
    let statusColor = "#7ed957";
    let breakDuration = "";
    if (u.currentBreakStart) {
      status = "On Break";
      statusColor = "#fbc2eb";
      const start = new Date(u.currentBreakStart);
      const now = new Date();
      const diff = Math.floor((now - start) / 1000);
      breakDuration = ` (${Math.floor(diff / 60)} min ${diff % 60} sec)`;
    }

    // Breaks for filtered date
    let breaksToday = u.breaks;
    if (filterDate) {
      breaksToday = u.breaks.filter(b => b.start.slice(0, 10) === filterDate);
    }
    let loginToday = u.loginHistory.filter(dt => dt.slice(0, 10) === filterDate);

    html += `<div class="dashboard-user">
      <img class="dashboard-avatar" src="assets/${u.avatar}" alt="${u.avatar}">
      <b>${u.name}</b> <small>(${u.empid})</small>
      <span style="font-size:0.97em;">Shift: ${u.shift}</span>
      <span style="margin-left:8px;color:${statusColor};font-weight:bold;">
        ${status}${breakDuration}
      </span><br>
      <span style="font-size:0.97em;">Logins: ${loginToday.length}</span>
      <div>
        <table class="break-table">
          <tr>
            <th>#</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration (min)</th>
          </tr>
          ${
            breaksToday.length === 0 ?
              `<tr><td colspan="4">No breaks</td></tr>` :
              breaksToday.map((b, i) =>
                `<tr>
                  <td>${i + 1}</td>
                  <td>${new Date(b.start).toLocaleTimeString()}</td>
                  <td>${new Date(b.end).toLocaleTimeString()}</td>
                  <td>${(b.duration / 60).toFixed(2)}</td>
                </tr>`
              ).join("")
          }
        </table>
        <span style="font-size:0.97em;">Total break: ${(breaksToday.reduce((sum, b) => sum + b.duration, 0) / 60).toFixed(2)} min</span>
      </div>
    </div>`;
  });

  document.getElementById('dashboard-content').innerHTML = html;

  // Show break buttons only for current user
  if (currentUser.currentBreakStart) {
    document.getElementById('start-break').classList.add('hidden');
    document.getElementById('end-break').classList.remove('hidden');
    document.getElementById('break-timer').textContent = "";
  } else {
    document.getElementById('start-break').classList.remove('hidden');
    document.getElementById('end-break').classList.add('hidden');
    document.getElementById('break-timer').textContent = "";
  }
}

// ---- On Load: restore active break if needed ----
window.onload = function () {
  populateEmployeeDropdown();
  renderAvatarOptions("avatar1.jpg");
  if (currentUser) {
    // Resume break if was active
    if (currentUser.currentBreakStart) {
      breakStartTime = new Date(currentUser.currentBreakStart);
      document.getElementById('start-break').classList.add('hidden');
      document.getElementById('end-break').classList.remove('hidden');
      breakTimerInterval = setInterval(updateBreakTimer, 1000);
    }
    showSection('dashboard-section');
    renderDashboard();
  } else {
    showSection('login-section');
  }
};
