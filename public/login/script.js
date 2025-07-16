import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "/firebaseConfig.js";

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
window.togglePassword = function(id) {
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
    await sendEmailVerification(userCredential.user);
    alert("Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama bağlantısını onaylayın.");
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
    await signInWithPopup(auth, provider);
    alert("Giriş başarılı!");
    location.href = "home.html";
  } catch (error) {
    alert("Google ile giriş başarısız: " + error.message);
  }
};
