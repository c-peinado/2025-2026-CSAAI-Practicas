const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================= PLAYER =================
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 70,
  height: 70,
  speed: 6,
  lives: 3,
  energy: 5,
  maxEnergy: 5
};

// ================= ARRAYS =================
let bullets = [];
let enemyBullets = [];
let aliens = [];

// ================= CONFIG =================
let alienSpeed = 1;
let direction = 1;

// ================= IMAGES =================
const playerImg = new Image();
playerImg.src = "cabra2.png";

const alienImg = new Image();
alienImg.src = "alien2.png";

const bulletImg = new Image();
bulletImg.src = "bala2.png";

const enemyBulletImg = new Image();
enemyBulletImg.src = "laser2.png";

// ================= SOUNDS =================
const laserSound = new Audio("assets/laser.wav");
const explosionSound = new Audio("assets/explosion.wav");
const winSound = new Audio("assets/win.wav");
const gameOverSound = new Audio("assets/gameover.wav");

// ================= INPUT =================
let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// ================= CREAR ALIENS =================
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    aliens.push({
      x: 80 + c * 80,
      y: 50 + r * 60,
      width: 36,
      height: 32,
      alive: true
    });
  }
}

// ================= GAME =================
let score = 0;
let gameOver = false;
let win = false;

// ================= SHOOT =================
function shoot() {
  if (player.energy > 0) {
    bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 20,
      height: 30
    });

    player.energy--;
    laserSound.currentTime = 0;
    laserSound.play();
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") shoot();
});

// ================= ENERGY =================
setInterval(() => {
  if (player.energy < player.maxEnergy) {
    player.energy++;
  }
}, 500);

// ================= ENEMY SHOOT =================
setInterval(() => {
  let aliveAliens = aliens.filter(a => a.alive);
  if (aliveAliens.length > 0) {
    let shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
    enemyBullets.push({
      x: shooter.x + shooter.width / 2,
      y: shooter.y,
      width: 20,
      height: 35
    });
  }
}, 1000);

// ================= UPDATE =================
function update() {
  if (gameOver || win) return;

  // mover jugador
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

  // balas
  bullets.forEach(b => b.y -= 7);
  enemyBullets.forEach(b => b.y += 4);

  // aliens
  let edge = false;
  aliens.forEach(a => {
    if (!a.alive) return;
    a.x += alienSpeed * direction;
    if (a.x <= 0 || a.x + a.width >= canvas.width) edge = true;
  });

  if (edge) {
    direction *= -1;
    aliens.forEach(a => a.y += 20);
  }

  // colisiones jugador -> aliens
  bullets.forEach((b, bi) => {
    aliens.forEach(a => {
      if (
        a.alive &&
        b.x < a.x + a.width &&
        b.x + b.width > a.x &&
        b.y < a.y + a.height &&
        b.y + b.height > a.y
      ) {
        a.alive = false;
        bullets.splice(bi, 1);
        score += 10;

        explosionSound.currentTime = 0;
        explosionSound.play();
      }
    });
  });

  // colisiones enemigos -> jugador
  enemyBullets.forEach((b, bi) => {
    if (
      b.x < player.x + player.width &&
      b.x + b.width > player.x &&
      b.y < player.y + player.height &&
      b.y + b.height > player.y
    ) {
      enemyBullets.splice(bi, 1);
      player.lives--;

      if (player.lives <= 0) {
        gameOver = true;
        gameOverSound.play();
      }
    }
  });

  // dificultad
  let alive = aliens.filter(a => a.alive).length;
  alienSpeed = 1 + (18 - alive) * 0.1;

  // victoria
  if (alive === 0) {
    win = true;
    winSound.play();
  }
}

// ================= DRAW =================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  aliens.forEach(a => {
    if (a.alive) {
      ctx.drawImage(alienImg, a.x, a.y, a.width, a.height);
    }
  });

  bullets.forEach(b => {
    ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
  });

  enemyBullets.forEach(b => {
    ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);
  });

  ctx.fillStyle = "black";
  ctx.fillText("Puntos: " + score, 10, 20);
  ctx.fillText("Vidas: " + player.lives, 10, 40);
  ctx.fillText("Energía: " + player.energy, 10, 60);

  if (gameOver) {
    ctx.fillText("GAME OVER", canvas.width / 2 - 50, canvas.height / 2);
  }

  if (win) {
    ctx.fillText("VICTORIA", canvas.width / 2 - 50, canvas.height / 2);
  }
}

// ================= LOOP =================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();