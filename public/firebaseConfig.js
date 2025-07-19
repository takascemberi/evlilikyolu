// public/firebaseConfig.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcBbfYUNmzCUJ9woKsQeC4b7U4L3Td42w",
  authDomain: "vipbulusma.firebaseapp.com",
  projectId: "vipbulusma",
  storageBucket: "vipbulusma.appspot.com", // ← doğru
  messagingSenderId: "552096712424",
  appId: "1:552096712424:web:2c5afb59f00dcd24092b5d",
  measurementId: "G-CNQEJEV51C"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
