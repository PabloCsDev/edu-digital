import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBJcnbXCF5bQt8-BGjQw1NpIR-gXuAoCYM",
    authDomain: "edu-digital-28610.firebaseapp.com",
    projectId: "edu-digital-28610",
    storageBucket: "edu-digital-28610.firebasestorage.app",
    messagingSenderId: "552837670984",
    appId: "1:552837670984:web:848ade625e7afbffc0507d"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const form = document.getElementById("quizForm");
  const submitBtn = document.getElementById("submitBtn");
  const consentCheckbox = document.getElementById("consentCheckbox");
  const successScreen = document.getElementById("successScreen");
  const statusMessage = document.getElementById("statusMessage");

  const adminTable = document.getElementById("adminTable");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let isSending = false;

 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSending) return;
    if (!consentCheckbox.checked) {
      alert("Você deve concordar com a LGPD para enviar suas respostas.");
      return;
    }
    isSending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const respostas = {
      name: form.nome.value,
      email: form.email.value
    };

    for (let i = 1; i <= 10; i++) {
      const select = form.querySelector(`select[name="pergunta${i}"]`);
      if (select) respostas[`pergunta${i}`] = select.value;
    }

    respostas.timestamp = new Date().toISOString();

    try {
      await addDoc(collection(db, "submissions"), respostas);
      await emailjs.send('service_x2vgm6m', 'template_y6kf1un', respostas);

      form.style.display = "none";
      successScreen.style.display = "block";
      statusMessage.textContent = "✅ Respostas enviadas com sucesso! Uma cópia foi enviada para seu email.";
      statusMessage.className = "status-message status-success";
      statusMessage.style.display = "block";
      setTimeout(() => { statusMessage.style.display = "none"; }, 5000);

    } catch (error) {
      console.error(error);
      statusMessage.textContent = "❌ Erro ao enviar respostas! Tente novamente.";
      statusMessage.className = "status-message status-error";
      statusMessage.style.display = "block";
      setTimeout(() => { statusMessage.style.display = "none"; }, 5000);

      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar";
      isSending = false;
    }
  });

  const allowedEmails = [
  "devpablocarvalho@gmail.com",
];

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        alert("Erro no login: " + err.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => signOut(auth));
  }

 cação
  onAuthStateChanged(auth, async (user) => {
    if (user && adminTable) {
 
      const adminEmails = ["devpablocarvalho@gmail.com"];
      if (!adminEmails.includes(user.email)) {
        alert("Acesso negado: você não é administrador.");
        signOut(auth);
        return;
      }

      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      adminTable.style.display = "block";

     
      const snapshot = await getDocs(collection(db, "submissions"));
      adminTable.innerHTML = "<tr><th>Nome</th><th>Email</th><th>Respostas</th><th>Data</th></tr>";
      snapshot.forEach(doc => {
        const data = doc.data();
        adminTable.innerHTML += `<tr>
          <td>${data.name}</td>
          <td>${data.email}</td>
          <td>${JSON.stringify(data)}</td>
          <td>${data.timestamp}</td>
        </tr>`;
      });

    } else if (adminTable) {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      adminTable.style.display = "none";
    }
  });
});
