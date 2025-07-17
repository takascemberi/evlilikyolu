import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase yapılandırması
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
      name: user.displayName || "Kullanıcı",
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "onlineUsers"), userInfo);
    onlineDocRef = docRef;

    // Sayfa kapanınca kullanıcıyı sil
    window.addEventListener("beforeunload", async () => {
      if (onlineDocRef) {
        await deleteDoc(onlineDocRef);
      }
    });
  }
});

// Online kullanıcıları göster
const bar = document.querySelector(".top-bar");
const q = query(collection(db, "onlineUsers"));

onSnapshot(q, (snapshot) => {
  const users = snapshot.docs.map(doc => doc.data());
  let html = `<div class="online-count">🟢 Şu an aktif olan kullanıcı sayısı: ${users.length}</div>`;
  html += `<div class="user-list" style="margin-top: 10px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">`;

  users.forEach(user => {
    html += `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: #ccc;"></div>
        <span style="font-size: 12px; color: white;">${user.name || "Üye"}</span>
      </div>`;
  });

  html += `</div>`;
  bar.innerHTML = html;
});

