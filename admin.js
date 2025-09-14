import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

const allowedEmails = ["devpablocarvalho@gmail.com"];

const btnSignIn = document.getElementById("btnSignIn");
const btnSignOut = document.getElementById("btnSignOut");
const userEmailSpan = document.getElementById("userEmail");
const adminContent = document.getElementById("adminContent");
const accessHint = document.getElementById("accessHint");
const tableRaw = document.getElementById("tableRaw").querySelector("tbody");

btnSignIn.addEventListener("click", async () => {
  try { await signInWithPopup(auth, provider); }
  catch(err) { alert("Erro no login: " + err.message); }
});

btnSignOut.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmailSpan.textContent = user.email;
    btnSignIn.style.display = "none";
    btnSignOut.style.display = "inline-block";

    if (!allowedEmails.includes(user.email.toLowerCase())) {
      adminContent.style.display = "none";
      accessHint.textContent = "Acesso negado — conta não autorizada.";
      signOut(auth);
      return;
    }

    accessHint.textContent = "";
    adminContent.style.display = "block";
    await carregarRespostas();
    gerarGraficos();

  } else {
    userEmailSpan.textContent = "";
    btnSignIn.style.display = "inline-block";
    btnSignOut.style.display = "none";
    adminContent.style.display = "none";
    accessHint.textContent = "Faça login com uma conta autorizada para acessar o painel.";
  }
});


async function carregarRespostas() {
  const snapshot = await getDocs(collection(db, "submissions"));
  tableRaw.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.timestamp ? new Date(d.timestamp).toLocaleString() : "-"}</td>
      <td>${d.name || ""}</td>
      <td>${d.email || ""}</td>
      <td>${d.pergunta1 || ""}</td>
      <td>${d.pergunta2 || ""}</td>
      <td>${d.pergunta3 || ""}</td>
      <td>${d.pergunta4 || ""}</td>
      <td>${d.pergunta5 || ""}</td>
      <td>${d.pergunta6 || ""}</td>
      <td>${d.pergunta7 || ""}</td>
      <td>${d.pergunta8 || ""}</td>
      <td>${d.pergunta9 || ""}</td>
      <td>${d.pergunta10 || ""}</td>
    `;
    tableRaw.appendChild(tr);
  });
}


async function gerarGraficos() {
  const snapshot = await getDocs(collection(db, "submissions"));
  const respostasQ1 = {}, respostasQ2 = {};

  snapshot.forEach(doc => {
    const d = doc.data();
    respostasQ1[d.pergunta1] = (respostasQ1[d.pergunta1] || 0) + 1;
    respostasQ2[d.pergunta2] = (respostasQ2[d.pergunta2] || 0) + 1;
  });

  const ctx1 = document.getElementById("chartQ1").getContext("2d");
  const ctx2 = document.getElementById("chartQ2").getContext("2d");

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(respostasQ1),
      datasets: [{ label: 'P1', data: Object.values(respostasQ1), backgroundColor: '#4364f7' }]
    }
  });

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(respostasQ2),
      datasets: [{ label: 'P2', data: Object.values(respostasQ2), backgroundColor: '#6fb1fc' }]
    }
  });
}
