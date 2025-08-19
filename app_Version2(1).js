// Magical Team Break Tracker - Enhanced Features

const quotes = [
  "Take a break, recharge your magic! ✨",
  "Great wizards rest often. 🧙‍♂️",
  "Even dragons need downtime. 🐉",
  "Let your spirit fly free for a moment! 🧚",
  "Elves meditate for their next adventure. 🧝",
  "Creativity blooms when you pause. 🌸"
];

const avatars = {
  wizard: "🧙",
  elf: "🧝",
  dragon: "🐉",
  fairy: "🧚"
};

// Prefilled employees
const employeeList = [
  {name: "Asha AS", email: "asha.as@opendoor.com", empid: "010293", shift: "8 pm - 5 am IST"},
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
  {name: "Sreenath", email: "sreenath.ab@opendoor.com", empid: "008526", shift: "8 pm - 5 am IST"},
];

// Local data
let users = JSON.parse(localStorage.getItem('magical_users') || "[]");
let currentUser = JSON.parse(localStorage.getItem('magical_currentUser') || "null");

// Break timer state
let breakStartTime = null;
let breakTimerInterval = null;

function showMotivation() {
  document.getElementById('motivation').textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Prefill employee data on registration
function populateEmployeeDropdown() {
  const select = document.getElementById('employee-select');
  employeeList.forEach((emp, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${emp.name} (${emp.empid})`;
    select.appendChild(option);
  });
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

// Registration
function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const empid = document.getElementById('reg-empid').value.trim();
  const shift = document.getElementById('reg-shift').value.trim();
  const password = document.getElementById('reg-password').value;
  const avatar = document.getElementById('reg-avatar').value;

  if(!name || !email || !empid || !shift || !password) {
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
  document.getElementById('reg-name').value = "";
  document.getElementById('reg-email').value = "";
  document.getElementById('reg-empid').value = "";
  document.getElementById('reg-shift').value = "";
  document.getElementById('reg-password').value = "";
  document.getElementById('employee-select').value = "";
}

// Login
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
  // Add login time to user history
  user.loginHistory.push(new Date().toISOString());
  users = users.map(u => u.email === user.email ? user : u);
  localStorage.setItem('magical_users', JSON.stringify(users));
  currentUser = user;
  localStorage.setItem('magical_currentUser', JSON.stringify(currentUser));
  showDashboard();
}

// Logout
function logout() {
  currentUser = null;
  localStorage.setItem('magical_currentUser', "null");
  showAuth();
}

// Break timer
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
  // Save break record
  currentUser.breaks.push({
    start: breakStartTime.toISOString(),
    end: endTime.toISOString(),
    duration
  });
  // Update users array and local storage
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

// Show authentication section
function showAuth() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  showMotivation();
}

// Show dashboard section
function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('break-controls').style.display = "block";
  document.getElementById('start-break').classList.remove('hidden');
  document.getElementById('end-break').classList.add('hidden');
  document.getElementById('break-timer').textContent = "";
  renderDashboard();
  showMotivation();
}

// Calculate allotted break time (simple: 1 hour if shift >=9 hours)
function getAllowedBreakMins(shiftStr) {
  const match = shiftStr.match(/(\d{1,2})\s*(am|pm).*(\d{1,2})\s*(am|pm)/i);
  if (!match) return 60; // default 1 hour
  let [_, startHour, startPeriod, endHour, endPeriod] = match;
  startHour = parseInt(startHour);
  endHour = parseInt(endHour);
  if(startPeriod.toLowerCase() === "pm" && startHour !== 12) startHour += 12;
  if(endPeriod.toLowerCase() === "pm" && endHour !== 12) endHour += 12;
  // Overnight shifts
  let duration = endHour - startHour;
  if(duration <= 0) duration += 24;
  return duration >= 9 ? 60 : 45; // 1 hr for >=9hr, else 45min
}

// Render team dashboard grid
function renderDashboard() {
  const grid = document.getElementById('team-grid');
  grid.innerHTML = "";
  const filterUser = document.getElementById('filter-user').value.trim().toLowerCase();
  const filterDate = document.getElementById('filter-date').value;
  
  users
    .filter(u => 
      u.name.toLowerCase().includes(filterUser) ||
      u.email.toLowerCase().includes(filterUser) ||
      u.empid.toLowerCase().includes(filterUser)
    )
    .forEach(u => {
      // Get breaks for filtered date
      let breaksToday = u.breaks;
      let totalBreakSecs = 0;
      let breakListHTML = "";
      if(filterDate) {
        breaksToday = u.breaks.filter(b => b.start.slice(0,10) === filterDate);
      }
      totalBreakSecs = breaksToday.reduce((sum, b) => sum + b.duration, 0);
      breakListHTML = breaksToday.map((b, idx) => {
        const start = new Date(b.start), end = new Date(b.end);
        return `<li>Break ${idx+1}: ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()} (${Math.floor(b.duration/60)} min ${b.duration%60} sec)</li>`;
      }).join("");
      // Shift and allowed break info
      const allowedBreakMin = getAllowedBreakMins(u.shift);
      // Login history for filtered date
      let loginListHTML = "";
      let loginsForDay = u.loginHistory;
      if(filterDate) {
        loginsForDay = u.loginHistory.filter(dt => dt.slice(0,10) === filterDate);
      }
      loginListHTML = loginsForDay.map((dt, idx) => `<li>Login ${idx+1}: ${new Date(dt).toLocaleString()}</li>`).join("");
      grid.innerHTML += `
        <div class="team-member">
          <div class="avatar-img">${avatars[u.avatar] || "🧙"}</div>
          <div><strong>${u.name}</strong> <small>(${u.empid})</small></div>
          <div>${u.email}</div>
          <div class="shift-info">
            Shift: ${u.shift} <br>
            Allowed Break: ${allowedBreakMin} min
          </div>
          <div>
            <strong>Breaks on ${filterDate || "all days"}:</strong>
            <ul class="break-list">
              ${breakListHTML || "<li>No breaks recorded</li>"}
            </ul>
            <div>Total break: ${Math.floor(totalBreakSecs/60)} min ${totalBreakSecs%60} sec</div>
            <div>${totalBreakSecs/60 >= allowedBreakMin ? "✅ Full break quota availed!" : "🕒 Break quota remaining"}</div>
          </div>
          <div>
            <strong>Logins on ${filterDate || "all days"}:</strong>
            <ul class="login-list">
              ${loginListHTML || "<li>No login recorded</li>"}
            </ul>
          </div>
        </div>
      `;
    });
}

// On load, show correct section and populate dropdown
window.onload = function() {
  populateEmployeeDropdown();
  if(currentUser) showDashboard();
  else showAuth();
  showMotivation();
};