// public/home/online-users.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "/firebaseConfig.js";

// Firebase servisleri
const db = getFirestore(app);
const auth = getAuth(app);

// Hedef divler
const listContainer = document.getElementById("online-user-list");
const onlineCountText = document.querySelector(".online-count");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // Firestore'a online olarak bildir
    await setDoc(doc(db, "onlineUsers", uid), {
      uid: uid,
      timestamp: Date.now()
    });

    // Sekme kapanınca çevrimdışına al
    window.addEventListener("beforeunload", () => {
      deleteDoc(doc(db, "onlineUsers", uid));
    });

    // Online kullanıcıları dinle
    const onlineUsersRef = collection(db, "onlineUsers");
    onSnapshot(onlineUsersRef, async (snapshot) => {
      const usersOnline = [];
      snapshot.forEach((docu) => {
        usersOnline.push(docu.id);
      });

      // Online sayısını güncelle
      if (onlineCountText) {
        onlineCountText.textContent = `🟢 Şu an aktif olan kullanıcı sayısı: ${usersOnline.length}`;
      }

      // Listeyi temizle
      listContainer.innerHTML = "";

      for (let uid of usersOnline) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();

          const card = document.createElement("div");
          card.style.cursor = "pointer";
          card.style.textAlign = "center";
          card.style.width = "90px";
          card.style.fontSize = "12px";
          card.style.display = "inline-block";
          card.style.margin = "5px";

          const img = document.createElement("img");
          let imageSrc = "/images/default-avatar.png";
          if (data.profileImage && data.profileImage.trim() !== "") {
            imageSrc = data.profileImage;
          } else if (data.gender === "erkek") {
            imageSrc = "/images/erkek.png";
          } else if (data.gender === "kadın") {
            imageSrc = "/images/kadın.png";
          }
          img.src = imageSrc;

          img.alt = "avatar";
          img.style.width = "60px";
          img.style.height = "60px";
          img.style.borderRadius = "50%";
          img.style.border = "2px solid green";
          img.style.objectFit = "cover";

          const name = document.createElement("div");
          name.textContent = data.displayName || "Bilinmeyen";
          name.style.fontWeight = "bold";
          name.style.fontSize = "13px";

          const age = document.createElement("div");
          age.textContent = data.age ? `${data.age} yaş` : "";
          age.style.fontSize = "12px";

          const city = document.createElement("div");
          city.textContent = data.city || "";
          city.style.fontSize = "12px";
          city.style.color = "gray";

          card.appendChild(img);
          card.appendChild(name);
          card.appendChild(age);
          card.appendChild(city);

          card.addEventListener("click", () => {
            window.location.href = `/profile/profile-view.html?uid=${uid}`;
          });

          listContainer.appendChild(card);
        }
      }
    });
  }
});
