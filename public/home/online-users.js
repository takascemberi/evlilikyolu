import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  onSnapshot,
  serverTimestamp,
  setDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

let currentUserUID = null;
let onlineDocRef = null;

const container = document.getElementById("online-user-list");
if (container) {
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center";
  container.style.gap = "10px";
  container.style.padding = "10px";
  container.style.marginTop = "20px";
  container.style.zIndex = "999";
  container.style.position = "relative";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserUID = user.uid;

    const docRef = doc(db, "onlineUsers", user.uid);
    await setDoc(docRef, {
      uid: user.uid,
      timestamp: serverTimestamp()
    });
    onlineDocRef = docRef;

    window.addEventListener("beforeunload", async () => {
      if (onlineDocRef) {
        await deleteDoc(onlineDocRef);
      }
    });

    const onlineQuery = query(collection(db, "onlineUsers"));
    onSnapshot(onlineQuery, async (snapshot) => {
      const onlineUIDs = snapshot.docs.map(doc => doc.data().uid);
      container.innerHTML = "";

      const usersSnapshot = await getDocs(collection(db, "users"));
      usersSnapshot.forEach(doc => {
        const user = doc.data();
        if (onlineUIDs.includes(user.uid) && user.uid !== currentUserUID) {
          const card = document.createElement("div");
          card.style.display = "flex";
          card.style.flexDirection = "column";
          card.style.alignItems = "center";
          card.style.position = "relative";
          card.style.width = "60px";
          card.style.zIndex = "1000";

          const photo = document.createElement("img");
          photo.src = user.profileImage || "/images/default.png";
          photo.alt = user.displayName || "Kullanıcı";
          photo.style.width = "50px";
          photo.style.height = "50px";
          photo.style.borderRadius = "50%";
          photo.style.objectFit = "cover";
          card.appendChild(photo);

          const greenDot = document.createElement("div");
          greenDot.style.position = "absolute";
          greenDot.style.top = "0px";
          greenDot.style.right = "5px";
          greenDot.style.width = "10px";
          greenDot.style.height = "10px";
          greenDot.style.background = "limegreen";
          greenDot.style.borderRadius = "50%";
          greenDot.style.border = "1px solid white";
          card.appendChild(greenDot);

          const name = document.createElement("div");
          name.textContent = user.displayName || "Kullanıcı";
          name.style.fontSize = "12px";
          name.style.color = "black";
          name.style.marginTop = "3px";
          card.appendChild(name);

          const age = document.createElement("div");
          age.textContent = user.age ? `${user.age} yaş` : "";
          age.style.fontSize = "11px";
          age.style.color = "#444";
          card.appendChild(age);

          container.appendChild(card);
        }
      });
    });
  }
});
