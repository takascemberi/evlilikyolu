onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // Kullanıcı bilgilerini al
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();

      await setDoc(doc(db, "onlineUsers", uid), {
        uid: uid,
        displayName: data.displayName || "Bilinmeyen",
        age: data.age || 25,
        profileImage: data.profileImage || "",
        gender: data.gender || "",
        city: data.city || "",
        timestamp: Date.now()
      });
    }

    // Sekme kapanınca çevrimdışı yap
    window.addEventListener("beforeunload", () => {
      deleteDoc(doc(db, "onlineUsers", uid));
    });

    // Online kullanıcıları dinle
    const onlineUsersRef = collection(db, "onlineUsers");
    onSnapshot(onlineUsersRef, async (snapshot) => {
      const usersOnline = [];
      snapshot.forEach((docu) => {
        usersOnline.push(docu.id);
      });

      // Listeyi temizle
      listContainer.innerHTML = "";

      for (let uid of usersOnline) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();

          const card = document.createElement("div");
          card.style.cursor = "pointer";
          card.style.textAlign = "center";
          card.style.width = "90px";
          card.style.fontSize = "12px";
          card.style.display = "inline-block";
          card.style.margin = "5px";

          const img = document.createElement("img");
          let imageSrc = "/images/default-avatar.png";
          if (data.profileImage && data.profileImage.trim() !== "") {
            imageSrc = data.profileImage;
          } else if (data.gender === "erkek") {
            imageSrc = "/images/erkek.png";
          } else if (data.gender === "kadın") {
            imageSrc = "/images/kadın.png";
          }
          img.src = imageSrc;
          img.alt = "avatar";
          img.style.width = "60px";
          img.style.height = "60px";
          img.style.borderRadius = "50%";
          img.style.border = "2px solid green";
          img.style.objectFit = "cover";

          const name = document.createElement("div");
          name.textContent = data.displayName || "Bilinmeyen";
          name.style.fontWeight = "bold";
          name.style.fontSize = "13px";

          const age = document.createElement("div");
          age.textContent = data.age ? `${data.age} yaş` : "";
          age.style.fontSize = "12px";

          const city = document.createElement("div");
          city.textContent = data.city || "";
          city.style.fontSize = "12px";
          city.style.color = "gray";

          card.appendChild(img);
          card.appendChild(name);
          card.appendChild(age);
          card.appendChild(city);

          card.addEventListener("click", () => {
            window.location.href = `/profile/profile-view.html?uid=${uid}`;
          });

          listContainer.appendChild(card);
        }
      }
    });
  }
});
