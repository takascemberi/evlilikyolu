import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getFirestore,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcBbfYUNmzCUJ9woKsQeC4b7U4L3Td42w",
  authDomain: "vipbulusma.firebaseapp.com",
  projectId: "vipbulusma",
  storageBucket: "vipbulusma.appspot.com",
  messagingSenderId: "552096712424",
  appId: "1:552096712424:web:2c5afb59f00dcd24092b5d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Profil bilgilerini göster
const username = localStorage.getItem("username") || "Kullanıcı";
const age = localStorage.getItem("age") || "00";
const membership = localStorage.getItem("membership") || "Standart Üye";
const profilePic = localStorage.getItem("profilePic");
const bioText = localStorage.getItem("userBio");

if (document.getElementById("username"))
  document.getElementById("username").innerText = `${username}, ${age}`;

if (document.getElementById("membershipStatus"))
  document.getElementById("membershipStatus").innerText = membership;

if (profilePic && document.getElementById("profileImage")) {
  document.getElementById("profileImage").src = profilePic;
}

// Bio yazısı düzenleme
window.openBioEdit = function () {
  const bioArea = document.getElementById("bioEdit");
  const textarea = document.getElementById("bioText");
  if (bioArea && textarea) {
    bioArea.style.display = "block";
    textarea.value = bioText || "";
  }
};

window.saveBio = function () {
  const text = document.getElementById("bioText").value;
  const badWords = ["amk", "aq", "orospu", "piç", "siktir", "salak"];
  for (let word of badWords) {
    if (text.toLowerCase().includes(word)) {
      alert("Lütfen küfür veya argo kelime kullanmayınız.");
      return;
    }
  }
  localStorage.setItem("userBio", text);
  alert("Profil yazısı kaydedildi.");
};

// IBAN göster/kopyala işlemleri
window.showIban = function (option) {
  const box = document.getElementById("ibanBox");
  const label = document.getElementById("selectionText");
  if (box && label) {
    box.style.display = "block";
    label.innerText = `Seçim: ${option}`;
  }
};

window.hideIban = function () {
  const box = document.getElementById("ibanBox");
  if (box) box.style.display = "none";
};

window.copyIban = function () {
  navigator.clipboard.writeText("TR910001004004522812155007").then(() => {
    alert("IBAN kopyalandı!");
  });
};

// Satın alım seçeneklerini aç/kapat
window.toggleButtons = function (id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === "flex" ? "none" : "flex";
};

// Fotoğraf yükleme
window.previewImage = async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        localStorage.setItem("profilePic", downloadURL);

        if (document.getElementById("profileImage")) {
          document.getElementById("profileImage").src = downloadURL;
        }

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { profileImage: downloadURL });

        alert("Profil fotoğrafı güncellendi.");
      } catch (error) {
        console.error("Fotoğraf yüklenirken hata oluştu:", error);
        alert("Fotoğraf yüklenirken bir hata oluştu.");
      }
    } else {
      alert("Oturum açmış bir kullanıcı bulunamadı.");
    }
  });
};
