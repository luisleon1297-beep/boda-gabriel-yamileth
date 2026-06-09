import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLctZ-7hPLLJ7nMqp5U4FMDbvAPRxu1_w",
  authDomain: "datos-boda-ce3d2.firebaseapp.com",
  projectId: "datos-boda-ce3d2",
  storageBucket: "datos-boda-ce3d2.firebasestorage.app",
  messagingSenderId: "802804747058",
  appId: "1:802804747058:web:434fad98815db6513ce52b"
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
    cargarMensajesNovios();
  } catch (error) {
    console.error(error);
    respuesta.textContent = "Error al enviar la confirmación.";
  }
});


let mensajesNovios = [];
let indiceMensaje = 0;
let intervaloMensajes = null;

function limpiarTexto(texto) {
  return String(texto || "").replace(/[&<>'"]/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  }[caracter]));
}

function mostrarMensajeActual() {
  const contenedor = document.getElementById("mensajeActual");

  if (!contenedor) return;

  if (!mensajesNovios.length) {
    contenedor.innerHTML = "Aún no hay mensajes para mostrar.";
    return;
  }

  const item = mensajesNovios[indiceMensaje];

  contenedor.style.opacity = 0;

  setTimeout(() => {
    contenedor.innerHTML = `
      “${limpiarTexto(item.mensaje)}”
      <strong>— ${limpiarTexto(item.nombre)}</strong>
    `;

    contenedor.style.opacity = 1;
    indiceMensaje = (indiceMensaje + 1) % mensajesNovios.length;
  }, 400);
}

async function cargarMensajesNovios() {
  const contenedor = document.getElementById("mensajeActual");
  if (!contenedor) return;

  try {
    const q = query(
      collection(db, "confirmaciones_boda"),
      orderBy("fechaRegistro", "desc")
    );

    const consulta = await getDocs(q);

    mensajesNovios = [];

    consulta.forEach((documento) => {
      const data = documento.data();

      if (
        data.asiste &&
        data.asiste.includes("Sí") &&
        data.mensaje &&
        data.mensaje.trim() !== ""
      ) {
        mensajesNovios.push({
          nombre: data.nombre || "Invitado",
          mensaje: data.mensaje
        });
      }
    });

    indiceMensaje = 0;
    mostrarMensajeActual();

    if (intervaloMensajes) {
      clearInterval(intervaloMensajes);
    }

    intervaloMensajes = setInterval(mostrarMensajeActual, 15000);
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "No se pudieron cargar los mensajes.";
  }
}

cargarMensajesNovios();
