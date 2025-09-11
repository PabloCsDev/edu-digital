import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const successScreen = document.getElementById("successScreen");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const respostas = {};
    respostas.nome = form.nome.value;
    respostas.email = form.email.value;

    for (let i = 1; i <= 10; i++) {
        respostas[`pergunta${i}`] = form[`pergunta${i}`].value;
    }
    respostas.timestamp = new Date().toISOString();

    try {
        await addDoc(collection(db, "submissions"), respostas);

        form.style.display = "none";
        successScreen.style.display = "block";

        statusMessage.textContent = "✅ Respostas enviadas com sucesso!";
        statusMessage.className = "status-message status-success";
        statusMessage.style.display = "block";

        setTimeout(() => {
            statusMessage.style.display = "none";
        }, 5000);

    } catch (error) {
        console.error(error);

        statusMessage.textContent = "❌ Erro ao enviar respostas!";
        statusMessage.className = "status-message status-error";
        statusMessage.style.display = "block";

        setTimeout(() => {
            statusMessage.style.display = "none";
        }, 5000);
    }
});
