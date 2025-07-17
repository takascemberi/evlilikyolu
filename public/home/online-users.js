import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcBbfYUNmzCUJ9woKsQeC4b7U4L3Td42w",
  authDomain: "vipbulusma.firebaseapp.com",
  projectId: "vipbulusma",
  storageBucket: "vipbulusma.firebasestorage.app",
  messagingSenderId: "552096712424",
  appId: "1:552096712424:web:2c5afb59f00dcd24092b5d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let onlineDocRef = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userInfo = {
      uid: user.uid,
      name: user.displayName || "Üye",
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "onlineUsers"), userInfo);
    onlineDocRef = docRef;

    window.addEventListener("beforeunload", async () => {
      if (onlineDocRef) {
        await deleteDoc(onlineDocRef);
      }
    });
  }
});

// DOM yüklendikten sonra online kullanıcıları ekle
window.addEventListener("load", () => {
  const q = query(collection(db, "onlineUsers"));

  onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data());
    
    // Online sayaç güncelle
    const onlineCountDiv = document.querySelector(".online-count");
    if (onlineCountDiv) {
      onlineCountDiv.innerText = `🟢 Şu an aktif olan kullanıcı sayısı: ${users.length}`;
    }

    // Kullanıcı profilleri gösterilecek alan
    let html = '';
    users.forEach(user => {
      html += `
        <div style="display: flex; flex-direction: column; align-items: center; margin: 0 5px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #ccc;"></div>
          <span style="font-size: 12px; color: #333;">${user.name || "Üye"}</span>
        </div>`;
    });

    // Eski listeyi sil, yenisini ekle
    let existingDiv = document.getElementById("onlineUserList");
    if (existingDiv) existingDiv.remove();

    const listDiv = document.createElement("div");
    listDiv.id = "onlineUserList";
    listDiv.style.display = "flex";
    listDiv.style.justifyContent = "center";
    listDiv.style.flexWrap = "wrap";
    listDiv.style.gap = "10px";
    listDiv.style.padding = "10px 0";
    listDiv.style.background = "#fff0f5";
    listDiv.innerHTML = html;

    const topBar = document.querySelector(".top-bar");
    if (topBar) {
      topBar.insertAdjacentElement("afterend", listDiv);
    }
  });
});
