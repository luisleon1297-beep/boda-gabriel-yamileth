import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fechaBoda = new Date("July 17, 2026 12:00:00").getTime();

function actualizarContador() {
  const ahora = new Date().getTime();
  const diferencia = fechaBoda - ahora;

  if (diferencia <= 0) {
    document.querySelector(".countdown").innerHTML = "<h3>¡Llegó el gran día!</h3>";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();

window.copiarDatos = function () {
  const datos = `YAMILETH ROMERO MORALES
19.954.099-8
BANCO DE CHILE
CUENTA VISTA
00-012-56251-50`;

  navigator.clipboard.writeText(datos);
  alert("Datos copiados correctamente");
};

const form = document.getElementById("formAsistencia");
const respuesta = document.getElementById("respuesta");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value,
    acompanantes: document.getElementById("acompanantes").value,
    asiste: document.getElementById("asiste").value,
    mensaje: document.getElementById("mensaje").value,
    fechaRegistro: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "confirmaciones_boda"), datos);
    respuesta.textContent = "Confirmación enviada correctamente ♡";
    form.reset();
  } catch (error) {
    console.error(error);
    respuesta.textContent = "Error al enviar la confirmación.";
  }
});