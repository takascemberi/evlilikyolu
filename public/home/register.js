// public/login/register.js
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "/firebaseConfig.js";

const db = getFirestore(app);
const auth = getAuth(app);

// Giriş yapan kullanıcı Firestore'da kayıtlı değilse yaz
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const displayName = user.displayName || "Bilinmeyen";

      // Formdan alabileceğin verileri hazır tutalım (boş olanlar sonradan güncellenebilir)
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName,
        age: "",             // yaş bilgisi boş başlatılır
        gender: "",          // cinsiyet boş
        city: "",            // şehir boş
        profileImage: "",
        bio: "",
        membership: "Standart Üye",
        tokens: 0,
        createdAt: new Date()
      });

      console.log("Yeni kullanıcı Firestore'a eklendi:", user.uid);
    } else {
      console.log("Kullanıcı zaten kayıtlı:", user.uid);
    }
  }
});
