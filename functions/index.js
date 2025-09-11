const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configurar seu email e App Password do Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devpablocarvalho@gmail.com',      // seu email
    pass: 'WHPR-AXIW-YSPG-NKLV'              // sua App Password
  }
});

// Função disparada ao criar um documento em 'submissions'
exports.sendSubmissionEmail = functions.firestore
  .document('submissions/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    
    const emailBody = `
Nome: ${data.nome}
Email: ${data.email}

Perguntas:
Q1: ${data.pergunta1}
Q2: ${data.pergunta2}
Q3: ${data.pergunta3}
Q4: ${data.pergunta4}
Q5: ${data.pergunta5}
Q6: ${data.pergunta6}
Q7: ${data.pergunta7}
Q8: ${data.pergunta8}
Q9: ${data.pergunta9}
Q10: ${data.pergunta10}
    `;

    try {
      await transporter.sendMail({
        from: 'devpablocarvalho@gmail.com',
        to: data.email,
        subject: 'Cópia das suas respostas - Quiz Educação Digital',
        text: emailBody
      });

      console.log(`Email enviado para ${data.email}`);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }
  });
