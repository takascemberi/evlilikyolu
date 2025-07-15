document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const userCards = document.querySelectorAll(".card");

  searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    userCards.forEach((card) => {
      const name = card.getAttribute("data-name").toLowerCase();
      if (name.includes(searchText)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".card");
      if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
        card.remove();
        // Buraya veritabanından da silme işlemi eklenecek
      }
    });
  });

  const soundNotification = document.getElementById("notification-sound");
  if (soundNotification) {
    soundNotification.play().catch(() => {});
  }
});
