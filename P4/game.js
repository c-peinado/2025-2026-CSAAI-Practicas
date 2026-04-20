const grid = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const levelDisplay = document.getElementById("level");
const timeDisplay = document.getElementById("time");
const statusDisplay = document.getElementById("status");
const mainWord = document.getElementById("mainWord");
const music = document.getElementById("music");

let gameRunning = false;
let currentLevel = 1;
let timer = 0;
let interval;
let stepTimeout;

const pairs = [
  ["☀️", "🌙"],
  ["🛏️", "🏠"]
];

let currentGrid = [];

// Crear grid
function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    grid.appendChild(div);
  }
}

// Generar distribución por nivel
function generateLevel(level, pair) {
  let arr = [];

  switch (level) {
    case 1:
      arr = Array(4).fill(pair[0]).concat(Array(4).fill(pair[1]));
      break;
    case 2:
      arr = [pair[0], pair[1], pair[0], pair[1], pair[0], pair[1], pair[0], pair[1]];
      break;
    default:
      arr = Array(8).fill().map(() => Math.random() > 0.5 ? pair[0] : pair[1]);
  }

  return arr;
}

// Render grid
function renderGrid(arr) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, i) => {
    cell.textContent = arr[i];
    cell.classList.remove("active");
  });
}

// Secuencia
function playSequence(speed) {
  const cells = document.querySelectorAll(".cell");
  let index = 0;

  function step() {
    if (!gameRunning) return;

    cells.forEach(c => c.classList.remove("active"));

    cells[index].classList.add("active");
  
    if (currentGrid[index] == "☀️")
      mainWord.textContent = "Sol";
    if (currentGrid[index] == "🌙")
      mainWord.textContent = "Luna";
    if (currentGrid[index] == "🛏️")
      mainWord.textContent = "Cama";
    if (currentGrid[index] == "🏠")
      mainWord.textContent = "Casa";

    index++;

    if (index < 8) {
      stepTimeout = setTimeout(step, speed);
    }
  }

  step();
}

// Juego principal
async function startGame() {
  gameRunning = true;
  statusDisplay.textContent = "Jugando";

  const pair = pairs[document.getElementById("pairSelect").value];
  currentLevel = parseInt(document.getElementById("levelSelect").value);

  document.querySelectorAll("select").forEach(el => el.disabled = true);

  if (document.getElementById("musicToggle").checked) {
    music.play();
  }

  interval = setInterval(() => {
    timer++;
    timeDisplay.textContent = timer;
  }, 1000);

  while (currentLevel <= 5 && gameRunning) {
    levelDisplay.textContent = currentLevel;

    statusDisplay.textContent = "En marcha...";
    await wait(1000);
    
    currentGrid = generateLevel(currentLevel, pair);
    renderGrid(currentGrid);
    
    let speed = 800 - (currentLevel * 120);
    playSequence(speed);

    await wait(speed * 8 + 500);

    currentLevel++;
  }

  endGame();
}

function stopGame() {
  gameRunning = false;
  clearInterval(interval);
  clearTimeout(stepTimeout);
  music.pause();

  document.querySelectorAll("select").forEach(el => el.disabled = false);

  statusDisplay.textContent = "Detenido";
}

function endGame() {
  stopGame();
  statusDisplay.textContent = "Finalizado";
  mainWord.textContent = "🎉 FIN 🎉";
}

// Utilidad
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// Eventos
startBtn.onclick = startGame;
stopBtn.onclick = stopGame;

// Init
createGrid();