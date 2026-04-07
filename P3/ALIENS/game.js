const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================= PLAYER =================
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 20,
  speed: 6,
  lives: 3,
  energy: 5,
  maxEnergy: 5
};

// ================= Image =================
const playerImg = new Image();
playerImg.src = "cabra.png";

const alienImg = new Image();
alienImg.src = "alien.png";

const bulletImg = new Image();
bulletImg.src = "bala.png";

const enemyBulletImg = new Image();
enemyBulletImg.src = "laser .png";

// ================= SOUNDS =================
const laserSound = new Audio("assets/laser.wav");
const explosionSound = new Audio("assets/explosion.wav");
const winSound = new Audio("assets/win.wav");
const gameOverSound = new Audio("assets/gameover.wav");


// ================= INPUT =================
let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// ================= BULLETS =================
bullets.push({
  x: player.x + player.width / 2 - 5,
  y: player.y,
  width: 10,
  height: 20
});

// ================= ALIENS =================
aliens.push({
  x: 80 + c * 80,
  y: 50 + r * 60,
  width: 40,
  height: 40,
  alive: true
});

// ================= GAME =================
let score = 0;
let gameOver = false;
let win = false;


// ================= SHOOT =================
function shoot() {
  if (player.energy > 0) {
    bullets.push({
      x: player.x + player.width / 2,
      y: player.y
    });
    player.energy--;
    laserSound.currentTime = 0;
    laserSound.play();
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") shoot();
});

// ================= ENERGY RECHARGE =================
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
      y: shooter.y
    });
  }
}, 1000);

// ================= UPDATE =================
function update() {
  if (gameOver || win) return;

  // movimiento player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

  // mover balas
  bullets.forEach(b => b.y -= 7);
  enemyBullets.forEach(b => b.y += 4);

  // mover aliens
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

  // colisiones balas jugador
  bullets.forEach((b, bi) => {
    aliens.forEach(a => {
      if (a.alive &&
        b.x < a.x + a.width &&
        b.x > a.x &&
        b.y < a.y + a.height &&
        b.y > a.y) {
        
        a.alive = false;
        bullets.splice(bi, 1);
        score += 10;

        explosionSound.currentTime = 0;
        explosionSound.play();
      }
    });
  });

  // colisiones balas enemigas
  enemyBullets.forEach((b, bi) => {
    if (
      b.x < player.x + player.width &&
      b.x > player.x &&
      b.y < player.y + player.height &&
      b.y > player.y
    ) {
      enemyBullets.splice(bi, 1);
      player.lives--;

      if (player.lives <= 0) {
        gameOver = true;
        gameOverSound.play();
      }
    }
  });

  // dificultad dinámica
  let alive = aliens.filter(a => a.alive).length;
  alienSpeed = 1 + (24 - alive) * 0.1;

  // victoria
  if (alive === 0) {
    win = true;
    winSound.play();
  }
}

// ================= DRAW =================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // PLAYER
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // ALIENS
  aliens.forEach(a => {
    if (a.alive) {
      ctx.drawImage(alienImg, a.x, a.y, a.width, a.height);
    }
  });

  // BALAS JUGADOR
  bullets.forEach(b => {
    ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
  });

  // BALAS ENEMIGAS
  enemyBullets.forEach(b => {
    ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);
  });

  // UI
  ctx.fillStyle = "white";
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