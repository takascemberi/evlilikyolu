function goHome() {
  location.href = "home.html";
}
function toggleSearch() {
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.style.display = (searchBox.style.display === "none" || !searchBox.style.display) ? "block" : "none";
  }
}
function openMessages() {
  alert("Mesajlar sayfası açılacak.");
}
function openNotifications() {
  alert("Bildirimler gösterilecek.");
}
function goProfile() {
  location.href = "profile.html"; // varsa profil sayfasına yönlendirir
}
function logout() {
  location.href = "index.html"; // çıkış sonrası login ekranına döner
}
