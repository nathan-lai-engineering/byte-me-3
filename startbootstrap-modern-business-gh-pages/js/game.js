const CANVAS_NAME = "canvas";
const DONATE_BTN = "donateBtn";

console.log("yeah game is loaded");

var gameCanvas = document.getElementById(CANVAS_NAME);
var donate_btn = document.getElementById(DONATE_BTN);
var gameCtx = gameCanvas.getContext("2d");
gameCtx.canvas.width  = window.innerWidth;
gameCtx.canvas.height = window.innerHeight;

var buttonX = gameCanvas.width / 10;
var buttonY = gameCanvas.height / 10;
var buttonW = 200;
var buttonH = 100;

var koalaImg = new Image();
koalaImg.src = "js/assets/koala1.png";

var basketImg = new Image();
basketImg.src = "js/assets/basket.png";

var heart1 = new Image();
heart1.src = "js/assets/heart.png";

var leftPressed = false;
var rightPressed = false;

var seconds = 0;
var koalaSaved = 0;
var lives=3;



var koalas = [];

/**
 * Creates koalas at random places
 */
function createBaseKoala() {
  seconds++;
  koalas[koalas.length] = {
    x: Math.random() * (gameCanvas.width - koalaImg.width),
    y: -koalaImg.height,
    dy: Math.random() * 3 + 1 //randomizing speed
  };
}

/**
 * Draws a koala and checks collisions
 */
function drawKoala() {
  for (let i = 0; i < koalas.length; i++) {
    gameCtx.drawImage(koalaImg, koalas[i].x, koalas[i].y);
    if (
      koalas[i].y > basket.y - koalaImg.height &&
      ((koalas[i].x > basket.x && koalas[i].x < basket.x + basketImg.width) ||
        (koalas[i].x + koalaImg.width > basket.x &&
          koalas[i].x + koalaImg.width < basket.x + basketImg.width))
    ) {
      koalas.splice(i, 1);
      koalaSaved++;
      console.log(koalaSaved);
    } else if (koalas[i].y + koalas[i].dy > gameCanvas.height) {
      koalas.splice(i, 1); //removes koala once it reaches the ground
      lives--;
    } else {
      koalas[i].y += koalas[i].dy;
    }
  }
}

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
 * Draws basket and moves it with key presses
 */
function drawBasket() {
  basket.height = basketImg.height;
  gameCtx.drawImage(basketImg, basket.x, basket.y, basketImg.width / 1.5, basketImg.height /2);
  console.log(basket.x + " " + basket.y);
  if (rightPressed && basket.x + basketImg.width < gameCanvas.width) {
    basket.x += basket.dx;
  }
  if (leftPressed && basket.x > 0) {
    basket.x -= basket.dx;
  }
}

function drawHearts() {
  hearts.height = heart1.height;
  var lastX = hearts.x;
  for(i=0; i < lives; i++){
    gameCtx.drawImage(heart1, lastX + (i*hearts.dX), hearts.y, heart1.width/60, heart1.height/60);
    lastX = lastX + hearts.dX;
  }
  console.log(hearts.x + " and " + hearts.y);
}

function drawScore(){
  gameCtx.font = "20px Tomorrow";
  gameCtx.fillStyle = "white";
  var scoreMessage = "Koalas Saved: " + String(koalaSaved);
  gameCtx.fillText(scoreMessage, gameCanvas.width-300, 35);
}

/**
 * Main draw function, draws all the elements in the canvas
 */
function draw() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawScore();
    drawHearts();
    drawKoala();
    drawBasket();
 if(lives <= 0){
   drawDonationBtn();
   endGame();
 }
}

function drawDonationBtn(){
  // Render button
  gameCtx.font = "20px Tomorrow";


  gameCtx.fillStyle = "white";
  gameCtx.fillRect(buttonX, buttonY, buttonW, buttonH);


  var msg = "Get extra life";
  gameCtx.fillStyle = 'black';
  gameCtx.fillText(msg, buttonX, buttonY);


  // Add event listener to canvas element
  gameCanvas.addEventListener('click', function(event) {
    // Control that click event occurred within position of button
    // NOTE: This assumes canvas is positioned at top left corner
    if (
      event.x > buttonX &&
      event.x < buttonX + buttonW &&
      event.y > buttonY &&
      event.y < buttonY + buttonH
    ) {
      // Executes if button was clicked!
      alert('Button was clicked!');
      console.log("clicked");
    }
  });
}

function donateBtnClicked(){
  lives++;
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

function endGame(){
  clearInterval(drawInterval);
  clearInterval(koalaInterval);
}

var drawInterval = setInterval(draw, 10);
var koalaInterval = setInterval(createBaseKoala, 1000);
