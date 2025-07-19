// public/login/script.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "/firebaseConfig.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

// Form geçişleri
document.getElementById("loginTab").addEventListener("click", () => {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
});

document.getElementById("registerTab").addEventListener("click", () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginTab").classList.remove("active");
  document.getElementById("registerTab").classList.add("active");
});

// Şifre göster/gizle
window.togglePassword = function (id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
};

// Kayıt işlemi
window.register = async function () {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;
  const age = document.getElementById("registerAge").value;
  const city = document.getElementById("registerCity").value;
  const gender = document.getElementById("registerGender").value;
  const looking = document.getElementById("registerLookingFor").value;
  const privacyCheck = document.getElementById("privacyCheck").checked;

  if (!name || !email || !password || !confirm || !age || !city || !gender || !looking || !privacyCheck) {
    return alert("Lütfen tüm alanları eksiksiz doldurun.");
  }

  if (password !== confirm) {
    return alert("Şifreler eşleşmiyor.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const profileImage = gender === "kadın" ? "/images/kadın.png" : "/images/erkek.png";

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      displayName: name,
      age: age,
      gender: gender,
      looking: looking,
      city: city,
      profileImage: profileImage,
      membership: "Standart Üye",
      bio: "Merhaba ben buradayım",
      timestamp: serverTimestamp()
    });

    alert("Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama bağlantısını onaylayın.");
    await auth.signOut();
    location.href = "/login/login.html";

  } catch (error) {
    alert("Hata: " + error.message);
  }
};

// Giriş işlemi
window.login = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    return alert("Lütfen e-posta ve şifre girin.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      alert("Lütfen önce e-posta adresinizi doğrulayın.");
      return;
    }
    alert("Giriş başarılı!");
    location.href = "home.html";
  } catch (error) {
    alert("Giriş hatası: " + error.message);
  }
};

// Şifre sıfırlama
window.resetPassword = async function () {
  const email = prompt("Şifre sıfırlama bağlantısı için e-posta adresinizi girin:");
  if (!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Şifre sıfırlama bağlantısı gönderildi.");
  } catch (error) {
    alert("Hata: " + error.message);
  }
};

// Google ile giriş
window.googleSignIn = async function () {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        displayName: user.displayName || "Bilinmeyen",
        profileImage: user.photoURL || "/images/default-avatar.png",
        age: 25,
        city: "Bilinmiyor",
        gender: "belirsiz",
        membership: "Standart Üye",
        bio: "Merhaba ben buradayım",
        timestamp: serverTimestamp()
      });
    }
    location.href = "home.html";
  } catch (error) {
    alert("Google ile giriş başarısız: " + error.message);
  }
};

// Eksik kullanıcı bilgilerini tamamla
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const updates = {};

      if (!data.displayName) updates.displayName = user.displayName || "Bilinmeyen";
      if (!data.profileImage) updates.profileImage = user.photoURL || "/images/default-avatar.png";
      if (!data.age) updates.age = 25;
      if (!data.city) updates.city = "Bilinmiyor";
      if (!data.gender) updates.gender = "belirsiz";
      if (!data.membership) updates.membership = "Standart Üye";
      if (!data.bio) updates.bio = "Merhaba ben buradayım";

      if (Object.keys(updates).length > 0) {
        await updateDoc(ref, updates);
      }
    }
  }
});
