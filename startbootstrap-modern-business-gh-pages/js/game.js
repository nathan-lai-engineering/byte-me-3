const CANVAS_NAME = "canvas";

console.log("yeah game is loaded");

var gameCanvas = document.getElementById(CANVAS_NAME);
var gameCtx = gameCanvas.getContext("2d");

var koalaImg = new Image();
koalaImg.src = "js/assets/koala1.png";

var koalaImg2 = new Image();
koalaImg2.src = "js/assets/koala2.png";

var basketImg = new Image();
basketImg.src = "js/assets/basket.png";

var heart1 = new Image();
heart1.src = "js/assets/heart.png";

var leftPressed = false;
var rightPressed = false;

var koalaSaved = 0;
var lives = 3;

var koalas = [];

var basket = {
  height: basketImg.height,
  width: basketImg.width,
  x: gameCanvas.width / 5,
  y: gameCanvas.height - 100,
  dx: 6
};

var hearts = {
  x: 10,
  y: 10,
  dX: 25
};

/**
 * Creates koalas at random places
 */
function createBaseKoala() {
  increaseDifficulty();
  koalas[koalas.length] = {
    x: Math.random() * (gameCanvas.width - koalaImg.width),
    y: -koalaImg.height,
    dy: Math.random() * 3 + 1, //randomizing speed
    version: Math.random()
  };
}

/**
 * Draws a koala and checks collisions
 */
function drawKoala() {
  for (let i = 0; i < koalas.length; i++) {
    if (koalas[i].version > 0.5) {
      gameCtx.drawImage(koalaImg, koalas[i].x, koalas[i].y);
    } else {
      gameCtx.drawImage(koalaImg2, koalas[i].x, koalas[i].y);
    }

    if (
      koalas[i].y > basket.y - koalaImg.height &&
      ((koalas[i].x > basket.x && koalas[i].x < basket.x + basketImg.width) ||
        (koalas[i].x + koalaImg.width > basket.x &&
          koalas[i].x + koalaImg.width < basket.x + basketImg.width))
    ) {
      koalas.splice(i, 1);
      koalaSaved++;
    } else if (koalas[i].y + koalas[i].dy > gameCanvas.height) {
      koalas.splice(i, 1); //removes koala once it reaches the ground
      lives--;
    } else {
      koalas[i].y += koalas[i].dy;
    }
  }
}

/**
 * Draws basket and moves it with key presses
 */
function drawBasket() {
  gameCtx.drawImage(basketImg, basket.x, basket.y);
  if (rightPressed && basket.x + basketImg.width < gameCanvas.width) {
    basket.x += basket.dx;
  }
  if (leftPressed && basket.x > 0) {
    basket.x -= basket.dx;
  }
}

/**
 * Draws hearts
 */
function drawHearts() {
  var lastX = hearts.x;
  for (i = 0; i < lives; i++) {
    gameCtx.drawImage(
      heart1,
      lastX + i * hearts.dX,
      hearts.y,
      heart1.width / 60,
      heart1.height / 60
    );
    lastX = lastX + hearts.dX;
  }
}

/**
 * Draws score text
 */
function drawScore() {
  gameCtx.font = "20px Tomorrow";
  gameCtx.fillStyle = "white";
  var scoreMessage = "Koalas Saved: " + String(koalaSaved);
  gameCtx.fillText(scoreMessage, gameCanvas.width - 300, 35);
}

/**
 * Main draw function, draws all the elements in the canvas
 */
function draw() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawKoala();
  drawBasket();
  drawScore();
  drawHearts();
  if (lives <= 0) {
    gameOver();
  }
}

/**
 * Increases the spawning rate as you play
 */
function increaseDifficulty() {
  if (2000 - 15 * koalaSaved > 500) {
    clearInterval(koalaInterval);
    koalaInterval = setInterval(createBaseKoala, 2000 - 15 * koalaSaved);
  }
}

//Adding event listeners for keys
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/**
 * Key handlers for movement
 */
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function gameOver() {
  clearInterval(drawInterval);
  clearInterval(koalaInterval);
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  gameCtx.fillStyle = "#000000";
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  window.open(window.location.href.replace("game.html", "donation.html"));
}
var drawInterval = setInterval(draw, 10);
var koalaInterval = setInterval(createBaseKoala, 2000);
