let clave = [];
let intentos = 7;
let iniciado = false;

// Elementos
const digitos = document.querySelectorAll(".digito");
const botones = document.querySelectorAll(".numero");
const displayIntentos = document.getElementById("intentos");
const mensaje = document.getElementById("mensaje");

// Controles
const btnStart = document.getElementById("start");
const btnStop = document.getElementById("stop");
const btnReset = document.getElementById("reset");

// Definir un objeto cronómetro
const crono = new Crono(gui.display);

// =====================
// GENERAR CLAVE
// =====================
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

// =====================
// OCULTAR CLAVE
// =====================
function ocultarClave() {
    digitos.forEach(d => {
        d.textContent = "*";
        d.style.background = "black";
        d.style.color = "white";
    });
}

// =====================
// CRONO
// =====================
function iniciarCrono() {
    if (!iniciado) {
        crono.start();
        iniciado = true;
    }
}

btnStart.onclick = () => crono.start();
btnStop.onclick = () => crono.stop();

// =====================
// RESET
// =====================
function resetGame() {
    clave = generarClave();
    intentos = 7;
    iniciado = false;

    displayIntentos.textContent = "Intentos restantes: " + intentos;
    mensaje.textContent = "Nueva partida preparada. Pulsa start o un número para comenzar.";

    ocultarClave();

    crono.stop();
    crono.reset();

    botones.forEach(b => b.disabled = false);

    console.log("Clave:", clave); // debug
}

btnReset.onclick = resetGame;

// =====================
// CLICK EN NÚMEROS
// =====================
botones.forEach(boton => {
    boton.addEventListener("click", () => {

        const num = parseInt(boton.textContent);

        iniciarCrono();

        intentos--;
        displayIntentos.textContent = "Intentos restantes: " + intentos;

        boton.disabled = true;

        if (clave.includes(num)) {
            clave.forEach((valor, i) => {
                if (valor === num) {
                    digitos[i].textContent = num;
                    digitos[i].style.background = "green";
                }
            });
        }

        comprobarVictoria();

        if (intentos === 0) {
            perder();
        }
    });
});

// =====================
// VICTORIA
// =====================
function comprobarVictoria() {
    let aciertos = 0;

    digitos.forEach(d => {
        if (d.textContent !== "*") {
            aciertos++;
        }
    });

    if (aciertos === 4) {
        crono.stop();

        const tiempo = document.getElementById("display").textContent;

        mensaje.textContent =
            `🎉 Ganaste | Tiempo: ${tiempo} | Intentos usados: ${7 - intentos} | Restantes: ${intentos}`;

        desactivarBotones();
    }
}

// =====================
// DERROTA
// =====================
function perder() {
    crono.stop();

    mensaje.textContent =
        `💥 BOOM! Has perdido. La clave era: ${clave.join("")}`;

    clave.forEach((n, i) => {
        digitos[i].textContent = n;
        digitos[i].style.background = "red";
    });

    desactivarBotones();
}

// =====================
// BLOQUEAR BOTONES
// =====================
function desactivarBotones() {
    botones.forEach(b => b.disabled = true);
}

// =====================
// INICIO
// =====================
resetGame();