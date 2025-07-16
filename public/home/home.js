function goHome() {
  location.href = "home.html"; // Ana sayfaya yönlendir
}

function toggleSearch() {
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.style.display = (searchBox.style.display === "none" || !searchBox.style.display) ? "block" : "none";
  }
}

function openMessages() {
  location.href = "messages/messages.html"; // Mesajlar sayfası
}

function openNotifications() {
  location.href = "notifications/notifications.html"; // Bildirimler sayfası
}

function goProfile() {
  location.href = "profile/profile.html"; // Profil sayfası
}

function logout() {
  localStorage.clear();
  location.href = "/login/login.html"; // Başında mutlaka "/" olmalı!
}

function toggleSupport() {
  const panel = document.getElementById("supportPanel");
  if (panel) {
    panel.classList.toggle("hidden");
  }
}

function sendSupportMessage() {
  const input = document.getElementById("supportInput");
  const messages = document.getElementById("supportMessages");
  if (input && messages && input.value.trim() !== "") {
    const msg = document.createElement("div");
    msg.className = "message user";
    msg.textContent = input.value.trim();
    messages.appendChild(msg);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
}

function submitPost() {
  const input = document.getElementById("postInput");
  if (input && input.value.trim() !== "") {
    alert("Paylaştınız: " + input.value.trim());
    input.value = "";
  }
}

function searchUser() {
  const input = document.getElementById("searchInput");
  const resultBox = document.getElementById("searchResult");
  const username = input.value.trim().toLowerCase();

  if (username === "") {
    resultBox.innerHTML = "Lütfen kullanıcı adı girin.";
    return;
  }

  const dummyUsers = ["ayşe", "mehmet", "veli", "sena", "ali"];
  if (dummyUsers.includes(username)) {
    resultBox.innerHTML = `<span style="color:green">✅ ${username} bulundu.</span>`;
  } else {
    resultBox.innerHTML = `<span style="color:red">❌ ${username} bulunamadı.</span>`;
  }
}
