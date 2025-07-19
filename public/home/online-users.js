// public/home/online-users.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "/firebaseConfig.js";

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Online kullanıcıları göster
const topBar = document.querySelector(".top-bar");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    // Online olduğunu Firestore'a yaz
    await setDoc(doc(db, "onlineUsers", uid), {
      uid: uid,
      timestamp: Date.now()
    });

    // Çıkış veya sekme kapanınca onlineUsers'tan sil
    window.addEventListener("beforeunload", () => {
      deleteDoc(doc(db, "onlineUsers", uid));
    });

    // Online kullanıcıları dinle
    const onlineUsersRef = collection(db, "onlineUsers");
    onSnapshot(onlineUsersRef, async (snapshot) => {
      const usersOnline = [];
      snapshot.forEach((docu) => {
        usersOnline.push(docu.data().uid);
      });

      // Temizle
      const existing = document.querySelector(".online-users-list");
      if (existing) existing.remove();

      const list = document.createElement("div");
      list.className = "online-users-list";
      list.style.display = "flex";
      list.style.overflowX = "scroll";
      list.style.gap = "10px";
      list.style.padding = "10px";

      for (let uid of usersOnline) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();

          const card = document.createElement("div");
          card.style.cursor = "pointer";
          card.style.textAlign = "center";
          card.style.width = "80px";
          card.style.fontSize = "12px";

          const img = document.createElement("img");
          img.src = data.profileImage || "/images/default-avatar.png";
          img.alt = "avatar";
          img.style.width = "50px";
          img.style.height = "50px";
          img.style.borderRadius = "50%";
          img.style.border = "2px solid green";

          const name = document.createElement("div");
          name.textContent = data.displayName || "Üye";

          const age = document.createElement("div");
          age.textContent = data.age ? `${data.age} yaş` : "";

          card.appendChild(img);
          card.appendChild(name);
          card.appendChild(age);

          card.addEventListener("click", () => {
            window.location.href = `/profile/profile-view.html?uid=${uid}`;
          });

          list.appendChild(card);
        }
      }

      topBar.appendChild(list);
    });
  }
});
