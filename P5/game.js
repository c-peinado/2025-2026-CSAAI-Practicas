const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
  player.x = Math.max(0, Math.min(canvas.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height, player.y));

  // disparo
  if (keys[" "]) {
    kickBall(player);
  }
}

// --- Bot (IA básica) ---
function moveBot() {
  if (ball.y < bot.y) bot.y -= bot.speed;
  if (ball.y > bot.y) bot.y += bot.speed;

  if (ball.x < bot.x) bot.x -= bot.speed;
  if (ball.x > bot.x) bot.x += bot.speed;

  kickBall(bot);
}

// --- Pelota ---
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.98;
  ball.vy *= 0.98;

  // rebotes verticales
  if (ball.y <= 0 || ball.y >= canvas.height) ball.vy *= -1;
}

// --- Gol ---
function checkGoal() {
  if (ball.x <= 0) {
    score.bot++;
    goal("¡Gol rival!");
  }
  if (ball.x >= canvas.width) {
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
    ball.vx = dx * 0.3;
    ball.vy = dy * 0.3;
  }
}

// ================= UI =================

function updateScore() {
  document.getElementById("score").textContent =
    `${score.player} - ${score.bot}`;
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  setTimeout(() => msg.textContent = "", 2000);
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

  let text = score.player > score.bot ? "¡Has ganado!" : "Has perdido";
  showMessage(text);
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
}