const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const goalHeight = 100;
const goalTop = canvas.height / 2 - goalHeight / 2;
const goalBottom = canvas.height / 2 + goalHeight / 2;

let gameMode = null;
let gameRunning = false;

let player, bot, ball;
let keys = {};

let score = { player: 0, bot: 0 };
let maxGoals = 3;

// ================= MENU =================

function startGame(mode) {
  gameMode = mode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("gameUI").classList.remove("hidden");

  if (mode === "golden") maxGoals = 1;
  else maxGoals = 3;

  resetGame();
  countdown(startLoop);
}

function goToMenu() {
  gameRunning = false;
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("gameUI").classList.add("hidden");

  document.getElementById("message").textContent = ""; // limpiar
}

// ================= OBJETOS =================

function resetGame() {
  player = { x: 100, y: 200, size: 15, speed: 3 };
  bot = { x: 700, y: 200, size: 15, speed: 2 };
  ball = { x: 400, y: 200, vx: 0, vy: 0, size: 10 };

  score.player = 0;
  score.bot = 0;
  updateScore();
}

function resetPositions() {
  player.x = 100; player.y = 200;
  bot.x = 700; bot.y = 200;
  ball.x = 400; ball.y = 200;
  ball.vx = 0; ball.vy = 0;
}

// ================= INPUT =================

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ================= LOOP =================

function startLoop() {
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// ================= UPDATE =================

function update() {
  movePlayer();
  moveBot();
  moveBall();
  checkGoal();
}

// --- Jugador ---
function movePlayer() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // límites
  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

  // disparo
  if (keys[" "]) {
    kickBall(player);
  }
}

// --- Bot (IA básica) ---
function moveBot() {
  let targetX = ball.x;
  let targetY = ball.y;

  if (ball.x < canvas.width / 2) {
    targetX = canvas.width - 100;
    targetY = canvas.height / 2;
  }

  if (targetY < bot.y) bot.y -= bot.speed;
  if (targetY > bot.y) bot.y += bot.speed;

  if (targetX < bot.x) bot.x -= bot.speed;
  if (targetX > bot.x) bot.x += bot.speed;

  // límites
  bot.x = Math.max(bot.size, Math.min(canvas.width - bot.size, bot.x));
  bot.y = Math.max(bot.size, Math.min(canvas.height - bot.size, bot.y));

  kickBall(bot);
}

// --- Pelota ---
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.98;
  ball.vy *= 0.98;

  // rebote arriba/abajo
  if (ball.y <= ball.size || ball.y >= canvas.height - ball.size) {
    ball.vy *= -1;
  }

  // rebote izquierda/derecha (solo si NO es gol)
  if (ball.x <= ball.size) {
  if (ball.y < goalTop || ball.y > goalBottom) {
    ball.vx *= -1;
  }
  }
}

// --- Gol ---
function checkGoal() {
  // portería izquierda (bot marca)
  if (ball.x <= 0 && ball.y > goalTop && ball.y < goalBottom) {
    score.bot++;
    goal("¡Gol rival!");
  }

  // portería derecha (jugador marca)
  if (ball.x >= canvas.width && ball.y > goalTop && ball.y < goalBottom) {
    score.player++;
    goal("¡GOOOL!");
  }
}

function goal(text) {
  updateScore();
  showMessage(text);

  if (score.player >= maxGoals || score.bot >= maxGoals) {
    endGame();
    return;
  }

  gameRunning = false;
  resetPositions();
  countdown(startLoop);
}

// ================= ACCIONES =================

function kickBall(p) {
  let dx = ball.x - p.x;
  let dy = ball.y - p.y;
  let dist = Math.hypot(dx, dy);

  if (dist < 20) {
    ball.vx = dx * 0.4;
    ball.vy = dy * 0.4;
  }
}

// ================= UI =================

function updateScore() {
  document.getElementById("score").textContent =
    `${score.player} - ${score.bot}`;
}

function showMessage(text, persist = false) {
  const msg = document.getElementById("message");
  msg.textContent = text;

  if (!persist) {
    setTimeout(() => msg.textContent = "", 2000);
  }
}

function drawDirection() {
  let dx = 0, dy = 0;

  if (keys["ArrowUp"]) dy = -1;
  if (keys["ArrowDown"]) dy = 1;
  if (keys["ArrowLeft"]) dx = -1;
  if (keys["ArrowRight"]) dx = 1;

  if (dx !== 0 || dy !== 0) {
    ctx.strokeStyle = "cyan";
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + dx * 30, player.y + dy * 30);
    ctx.stroke();
  }
}

// ================= CUENTA ATRÁS =================

function countdown(callback) {
  let count = 3;
  const msg = document.getElementById("message");

  const interval = setInterval(() => {
    msg.textContent = count;
    count--;

    if (count < 0) {
      clearInterval(interval);
      msg.textContent = "";
      callback();
    }
  }, 1000);
}

// ================= FIN =================

function endGame() {
  gameRunning = false;

  let text = score.player > score.bot ? "¡Has ganado! Vueleve al menú" : "Has perdido Vueleve al menú";

  showMessage(text, true);
}

// ================= DRAW =================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // campo
  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // jugador
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // bot
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(bot.x, bot.y, bot.size, 0, Math.PI * 2);
  ctx.fill();

  // pelota
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();

  // porterías
  ctx.fillStyle = "yellow";

  // izquierda
  ctx.fillRect(0, goalTop, 10, goalHeight);

  // derecha
  ctx.fillRect(canvas.width - 10, goalTop, 10, goalHeight);

  drawDirection()
}