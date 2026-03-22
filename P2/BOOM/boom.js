//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset"),
    numeros: document.getElementsByClassName("numero"),
    intentos: document.getElementById("intentos"),
    o1: document.getElementById("o1"),
    o2: document.getElementById("o2"),
    o3: document.getElementById("o3"),
    o4: document.getElementById("o4")
}
let iniciado = false;

console.log("Ejecutando JS...");

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

function generarPIN(longitud=4) {
    let pin = "";
    for (let i = 0; i < longitud; i++) {
        pin += Math.floor(Math.random() * 10); // Genera un dígito del 0 al 9
    }
    return pin;
} 

const pin = generarPIN();

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
    iniciado = true;
}

gui.numeros.onclick = () =>{
    console.log("Start!!");
    if(!iniciado){
        crono.start();
        iniciado=true;
    }
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

for (let element of numeros) {
    console.log(element);
    gui.elemnt.onclick = () =>{

    }
}

if(aciertos==4){
    ganar()
}

if(intentos==0){
    perder()
}


function ganar(){
    crono.stop();
    document.getElementById("mensaje").textContent =
    "¡Has ganado! Tiempo: "+
    document.getElementById("cronometro").textContent +
    " | Intentos usados: "+(7-intentos)+
    " | Intentos restantes: "+intentos
    bloquearBotones()
}

function perder(){
    crono.stop();
    for(let i=0;i<4;i++){
        document.getElementById("d"+i).textContent=clave[i]
    }
    document.getElementById("mensaje").textContent =
    "Has perdido. La clave era: "+clave.join("")
    bloquearBotones()
}

function bloquearBotones(){
    document.querySelectorAll(".numbers button")
    .forEach(b=>b.disabled=true)
}


//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    crono.reset();
    const pin = generarPIN();
}

function resetGame(){
    crono.reset();
    intentos=7
    aciertos=0
    iniciado=false
    document.getElementById("intentos").textContent=7
    document.getElementById("mensaje").textContent="Nueva partida preparada. Pulsa start o un número para comenzar."
    for(let i=0;i<4;i++){
    let o = document.getElementById("o"+i)
    o.textContent="*"
    o.classList.remove("acierto")
    }
    document.querySelectorAll(".numbers button")
    .forEach(b=>b.disabled=false)
    generarPIN()
}

generarPIN()