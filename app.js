import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ---------- Config Firebase ----------
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
// ------------------------------------

// Elementos do formulário
const form = document.getElementById("quizForm");
const successScreen = document.getElementById("successScreen");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Pegando valores do formulário
  const respostas = {
    name: form.nome.value,
    email: form.email.value
  };

  for (let i = 1; i <= 10; i++) {
    const select = form.querySelector(`select[name="pergunta${i}"]`);
    respostas[`pergunta${i}`] = select.value;
  }

  respostas.timestamp = new Date().toISOString();

  try {
    // 1️⃣ Salvar no Firebase
    await addDoc(collection(db, "submissions"), respostas);

    // 2️⃣ Enviar cópia por EmailJS
    await emailjs.send(
      'service_x2vgm6m',   // Service ID
      'template_y6kf1un',  // Template ID
      respostas
    );

    // 3️⃣ Mostrar tela de sucesso
    form.style.display = "none";
    successScreen.style.display = "block";

    statusMessage.textContent = "✅ Respostas enviadas com sucesso! Uma cópia foi enviada para seu email.";
    statusMessage.className = "status-message status-success";
    statusMessage.style.display = "block";

    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 5000);

  } catch (error) {
    console.error("Erro ao enviar:", error);
    statusMessage.textContent = "❌ Erro ao enviar respostas! Tente novamente.";
    statusMessage.className = "status-message status-error";
    statusMessage.style.display = "block";

    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 5000);
  }
});
