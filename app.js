import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

  const form = document.getElementById("quizForm");
  const submitBtn = document.getElementById("submitBtn");
  const consentCheckbox = document.getElementById("consentCheckbox");
  const successScreen = document.getElementById("successScreen");
  const statusMessage = document.getElementById("statusMessage");

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
});
