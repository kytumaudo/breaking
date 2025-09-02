// Danh sách nhân viên mẫu
const employees = [
  { id: "E1", name: "Nhân viên 1" },
  { id: "E2", name: "Nhân viên 2" }
];

let registeredDevices = JSON.parse(localStorage.getItem("devices")) || [];
let savedLocation = JSON.parse(localStorage.getItem("location")) || null;

// Render nhân viên
function renderEmployees() {
  const list = document.getElementById("employeeList");
  list.innerHTML = "";
  employees.forEach(emp => {
    const card = document.createElement("div");
    card.className = "p-4 bg-white rounded shadow";
    card.id = `emp-${emp.id}`;

    card.innerHTML = `
      <p class="font-semibold">${emp.name} (${emp.id})</p>
      <div class="mt-2 flex space-x-2">
        <button onclick="checkIn('${emp.id}')" class="px-3 py-1 bg-blue-500 text-white rounded">Check In</button>
        <button onclick="checkOut('${emp.id}')" class="px-3 py-1 bg-red-500 text-white rounded">Check Out</button>
      </div>
    `;

    list.appendChild(card);
  });
}

// Chuyển trang
function showPage(page) {
  document.getElementById("employeePage").classList.add("hidden");
  document.getElementById("adminPage").classList.add("hidden");
  document.getElementById(page + "Page").classList.remove("hidden");

  if (page === "employee") renderEmployees();
  if (page === "admin") renderAdmin();
}

// Lấy Device ID
function getDeviceId() {
  return navigator.userAgent;
}

// Kiểm tra thiết bị
function checkDevice() {
  const deviceId = getDeviceId();
  return registeredDevices.includes(deviceId);
}

// Kiểm tra vị trí
function checkLocation(callback) {
  if (!savedLocation) {
    alert("Chưa cài đặt vị trí!");
    return false;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const dist = getDistance(latitude, longitude, savedLocation.lat, savedLocation.lng);
    if (dist <= 100) { // 100m
      callback(true);
    } else {
      alert("Sai vị trí! Bạn không ở trong khu vực cho phép.");
      callback(false);
    }
  }, () => {
    alert("Không lấy được vị trí!");
    callback(false);
  });
}

// Công thức tính khoảng cách
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Cập nhật hiển thị
function updateEmployeeCard(employeeId) {
  const emp = employees.find(e => e.id === employeeId);
  const card = document.getElementById(`emp-${employeeId}`);
  if (!emp || !card) return;

  let timerDiv = card.querySelector(".timer-bar");
  if (!timerDiv) {
    timerDiv = document.createElement("div");
    timerDiv.className = "timer-bar mt-2 p-2 bg-gray-100 rounded text-sm text-center font-semibold";
    card.appendChild(timerDiv);
  }

  if (emp.interval) clearInterval(emp.interval);

  function renderTimer() {
    const now = new Date();
    let diffMs, label;
    if (emp.status === "in" && emp.lastCheckIn) {
      diffMs = now - emp.lastCheckIn;
      label = "Đang làm việc: ";
    } else if (emp.status === "out" && emp.lastCheckOut) {
      diffMs = now - emp.lastCheckOut;
      label = "Đang nghỉ: ";
    }

    if (diffMs) {
      const sec = Math.floor((diffMs / 1000) % 60);
      const min = Math.floor((diffMs / (1000 * 60)) % 60);
      const hr = Math.floor(diffMs / (1000 * 60 * 60));
      timerDiv.textContent = `${label}${hr}h ${min}m ${sec}s`;
    }
  }

  emp.interval = setInterval(renderTimer, 1000);
  renderTimer();
}

// Check In
function checkIn(id) {
  if (!checkDevice()) return alert("Thiết bị không hợp lệ!");
  checkLocation(ok => {
    if (!ok) return;
    const emp = employees.find(e => e.id === id);
    emp.status = "in";
    emp.lastCheckIn = new Date();
    updateEmployeeCard(id);
  });
}

// Check Out
function checkOut(id) {
  if (!checkDevice()) return alert("Thiết bị không hợp lệ!");
  checkLocation(ok => {
    if (!ok) return;
    const emp = employees.find(e => e.id === id);
    emp.status = "out";
    emp.lastCheckOut = new Date();
    updateEmployeeCard(id);
  });
}

// Admin
function registerDevice() {
  const val = document.getElementById("deviceInput").value.trim();
  if (!val) return;
  if (!registeredDevices.includes(val)) {
    registeredDevices.push(val);
    localStorage.setItem("devices", JSON.stringify(registeredDevices));
  }
  renderAdmin();
}

function setLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    savedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    localStorage.setItem("location", JSON.stringify(savedLocation));
    renderAdmin();
  }, () => alert("Không lấy được vị trí!"));
}

function renderAdmin() {
  document.getElementById("deviceList").innerHTML =
    registeredDevices.map(d => `<p>- ${d}</p>`).join("");
  document.getElementById("locationInfo").innerHTML =
    savedLocation ? `Lat: ${savedLocation.lat}, Lng: ${savedLocation.lng}` : "Chưa cài";
}

// Mặc định mở Employee
showPage("employee");
