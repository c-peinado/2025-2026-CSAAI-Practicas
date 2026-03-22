let clave = [];
let intentos = 7;
let tiempo = 0;
let intervalo = null;
let iniciado = false;

// Generar botones 0-9
const contenedor = document.getElementById("botones");

for (let i = 0; i <= 9; i++) {
  let btn = document.createElement("button");
  btn.textContent = i;
  btn.onclick = () => comprobarNumero(i, btn);
  contenedor.appendChild(btn);
}

// Generar clave secreta
function generarClave() {
  let numeros = [];

  while (numeros.length < 4) {
    let n = Math.floor(Math.random() * 10);
    if (!numeros.includes(n)) {
      numeros.push(n);
    }
  }

  return numeros;
}

// Mostrar clave (oculta)
function mostrarClave() {
  const spans = document.querySelectorAll(".digit");
  spans.forEach(span => span.textContent = "*");
}

// Cronómetro
function startCrono() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tiempo++;
      document.getElementById("tiempo").textContent = tiempo;
    }, 1000);
  }
}

function stopCrono() {
  clearInterval(intervalo);
  intervalo = null;
}

// Reset
function resetGame() {
  clave = generarClave();
  intentos = 7;
  tiempo = 0;
  iniciado = false;

  document.getElementById("intentos").textContent = intentos;
  document.getElementById("tiempo").textContent = tiempo;
  document.getElementById("mensaje").textContent = "";

  mostrarClave();
  stopCrono();

  document.querySelectorAll("#botones button").forEach(btn => {
    btn.disabled = false;
  });

  console.log("Clave secreta:", clave); // para probar
}

// Lógica del juego
function comprobarNumero(num, boton) {

  if (!iniciado) {
    startCrono();
    iniciado = true;
  }

  intentos--;
  document.getElementById("intentos").textContent = intentos;

  boton.disabled = true;

  const spans = document.querySelectorAll(".digit");

  if (clave.includes(num)) {
    clave.forEach((valor, index) => {
      if (valor === num) {
        spans[index].textContent = num;
        spans[index].classList.add("acierto");
      }
    });
  }

  comprobarVictoria();

  if (intentos === 0) {
    perder();
  }
}

// Comprobar victoria
function comprobarVictoria() {
  const spans = document.querySelectorAll(".digit");

  let ganados = 0;

  spans.forEach(span => {
    if (span.textContent !== "*") {
      ganados++;
    }
  });

  if (ganados === 4) {
    stopCrono();

    document.getElementById("mensaje").textContent =
      `🎉 Ganaste en ${tiempo}s con ${7 - intentos} intentos (te quedaban ${intentos})`;

    desactivarBotones();
  }
}

// Perder
function perder() {
  stopCrono();

  document.getElementById("mensaje").textContent =
    `❌ Perdiste. La clave era: ${clave.join("")}`;

  desactivarBotones();
}

// Desactivar botones
function desactivarBotones() {
  document.querySelectorAll("#botones button").forEach(btn => {
    btn.disabled = true;
  });
}

// Iniciar juego al cargar
resetGame();