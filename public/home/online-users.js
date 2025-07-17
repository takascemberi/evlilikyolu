import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcBbfYUNmzCUJ9woKsQeC4b7U4L3Td42w",
  authDomain: "vipbulusma.firebaseapp.com",
  projectId: "vipbulusma",
  storageBucket: "vipbulusma.firebasestorage.app",
  messagingSenderId: "552096712424",
  appId: "1:552096712424:web:2c5afb59f00dcd24092b5d"
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

    // Sayfa kapanınca kullanıcıyı çıkar
    window.addEventListener("beforeunload", async () => {
      if (onlineDocRef) {
        await deleteDoc(onlineDocRef);
      }
    });
  }
});

// Online kullanıcıları göster
const q = collection(db, "onlineUsers");

onSnapshot(q, (snapshot) => {
  const users = snapshot.docs.map(doc => doc.data());

  const listDiv = document.createElement("div");
  listDiv.style.display = "flex";
  listDiv.style.justifyContent = "center";
  listDiv.style.gap = "15px";
  listDiv.style.margin = "10px 0";
  listDiv.style.flexWrap = "wrap";

  users.forEach(user => {
    if (user.uid !== auth.currentUser?.uid) {
      const userBox = document.createElement("div");
      userBox.style.display = "flex";
      userBox.style.flexDirection = "column";
      userBox.style.alignItems = "center";
      userBox.innerHTML = `
        <div style="width: 50px; height: 50px; border-radius: 50%; background: #ccc;"></div>
        <span style="font-size: 13px; color: #333;">${user.name || "Üye"}</span>
      `;
      listDiv.appendChild(userBox);
    }
  });

  let existing = document.getElementById("onlineUserList");
  if (existing) existing.remove();

  listDiv.id = "onlineUserList";
  const target = document.querySelector(".top-bar");
  if (target) {
    target.insertAdjacentElement("afterend", listDiv);
  }
});
