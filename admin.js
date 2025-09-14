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

const btnSignIn = document.getElementById("btnSignIn");
const btnSignOut = document.getElementById("btnSignOut");
const userEmailSpan = document.getElementById("userEmail");
const adminContent = document.getElementById("adminContent");
const accessHint = document.getElementById("accessHint");
const tableBody = document.querySelector("#tableRaw tbody");

const allowedEmails = ["devpablocarvalho@gmail.com"];

btnSignIn.addEventListener("click", async () => {
  try { await signInWithPopup(auth, provider); }
  catch(err){ alert("Erro no login: " + err.message); }
});

btnSignOut.addEventListener("click", async () => { await signOut(auth); });

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmailSpan.textContent = user.email;
    btnSignIn.style.display = "none";
    btnSignOut.style.display = "inline-block";

    if (allowedEmails.includes(user.email.toLowerCase())) {
      accessHint.textContent = "";
      adminContent.style.display = "block";
      await carregarRespostas();
    } else {
      adminContent.style.display = "none";
      accessHint.textContent = "Acesso negado — conta não autorizada.";
      signOut(auth);
    }
  } else {
    userEmailSpan.textContent = "";
    btnSignIn.style.display = "inline-block";
    btnSignOut.style.display = "none";
    adminContent.style.display = "none";
    accessHint.textContent = "Faça login com uma conta autorizada para ver o painel.";
  }
});

async function carregarRespostas() {
  const snapshot = await getDocs(collection(db, "submissions"));
  tableBody.innerHTML = "";
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
    tableBody.appendChild(tr);
  });
}
