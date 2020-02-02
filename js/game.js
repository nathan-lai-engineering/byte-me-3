const CANVAS_NAME = "canvas";
const DONATE_BTN = "donateBtn";

console.log("yeah game is loaded");

var gameCanvas = document.getElementById(CANVAS_NAME);
var donate_btn = document.getElementById(DONATE_BTN);
var gameCtx = gameCanvas.getContext("2d");
// gameCtx.canvas.width  = window.innerWidth;
// gameCtx.canvas.height = window.innerHeight;
gameCanvas.setAttribute("width", window.innerWidth);
gameCanvas.setAttribute("height", window.innerHeight);

var buttonW = 200;
var buttonH = 100;
var buttonX = gameCanvas.width / 2 - buttonW / 2;
var buttonY = gameCanvas.height / 2 - buttonH / 2 - 50;

// var msgCanvas = document.createElement('msg_canvas');
let msgData = new FormData();
var msgX = 70;
var msgY = 80;
var msgW = 60;
var msgH = 30;
// var msgCtx = gameCanvas.getContext('2d');
// msgCtx.fillStyle = 'blue';
// msgCtx.fillRect(50,50,150,150);

var koalaImg = new Image();
koalaImg.src = "js/assets/koala1.png";

var koalaImg2 = new Image();
koalaImg2.src = "js/assets/koala2.png";

var learnMoreImg = new Image();
learnMoreImg.src = "js/assets/readmore.png";

var basketImg = new Image();
basketImg.src = "js/assets/newbasket.png";

var heart1 = new Image();
heart1.src = "js/assets/heart.png";

var leftPressed = false;
var rightPressed = false;

var koalaSaved = 0;
var lives = 3;

var koalas = [];

var basket = {
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
  koalas[koalas.length] = {
    x: Math.random() * (gameCanvas.width - koalaImg.width),
    y: -koalaImg.height,
    dy: Math.random() * 3 + 1, //randomizing speed
    version: Math.random() //randomizing the texture
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
      gameCtx.drawImage(koalaImg2, koalas[i].x, koalas[i].y); //!!!! line 49 + 58-62 for randomized textures !!!!!
    }

    if (
      koalas[i].y > basket.y - koalaImg.height &&
      ((koalas[i].x > basket.x && koalas[i].x < basket.x + basketImg.width) ||
        (koalas[i].x + koalaImg.width > basket.x &&
          koalas[i].x + koalaImg.width < basket.x + basketImg.width))
    ) {
      koalas.splice(i, 1);
      koalaSaved++;
      increaseDifficulty();
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
  x: 50,
  y: 10,
  dX: 30
};

/**
 * Draws basket and moves it with key presses
 */
function drawBasket() {
  // basketImg.width = basketImg.width /1.5;
  basket.height = basketImg.height;
  gameCtx.drawImage(
    basketImg,
    basket.x,
    basket.y,
    basketImg.width / 1.5,
    basketImg.height / 2
  );
  console.log(basket.x + " " + basket.y);
  if (rightPressed && basket.x + basketImg.width / 1.5 <= gameCanvas.width) {
    basket.x += basket.dx;
  }
  if (leftPressed && basket.x >= 0) {
    basket.x -= basket.dx;
  }
}

/**
 * Draws hearts
 */
function drawHearts() {
  hearts.height = heart1.height;
  var lastX = hearts.x;
  for (i = 0; i < lives; i++) {
    gameCtx.drawImage(
      heart1,
      lastX + i * hearts.dX,
      hearts.y,
      heart1.width / 50,
      heart1.height / 50
    );
    lastX = lastX + hearts.dX;
  }
}

function drawScore() {
  gameCtx.font = "30px Tomorrow";
  gameCtx.fillStyle = "white";
  var scoreMessage = "Koalas Saved: " + String(koalaSaved);
  gameCtx.fillText(scoreMessage, gameCanvas.width - gameCanvas.width / 4, 50);
}
/**
 * Main draw function, draws all the elements in the canvas
 */
function draw() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawKoala();
  drawScore();
  drawHearts();
  drawBasket();
  if (lives <= 0) {
    drawDonationBtn();
    drawHearts();
    endGame();
  }
}

function presentFact() {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = "https://some-random-api.ml/facts/koala"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
    .then(response => response.formData())
    .then(form_data => msgData.append("key1", "value1"))
    .catch(() =>
      console.log("Can’t access " + url + " response. Blocked by browser?")
    );

  //factStr = await response.text();
  //console.log(factStr);
  //console.log(msgData.values);
  var values = msgData.values;
  for (value in values) {
    console.log(value);
  }
  //factStr.push(response);
}

function drawDonationBtn() {
  // Render button

  // ctx.fillStyle = 'white';
  // ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
  gameCtx.font = "20px Tomorrow";
  gameCtx.fillStyle = "white";
  //var msg = "Click RESET for another life";
  var msg = randomFact();
  var msgWidth = gameCtx.measureText(msg).width;
  gameCtx.fillText(msg, (gameCanvas.width - msgWidth) / 2, buttonY);

  gameCtx.drawImage(learnMoreImg, buttonX, buttonY, buttonW, buttonH);

  // Add event listener to canvas element
  gameCanvas.addEventListener("click", function(event) {
    // Control that click event occurred within position of button
    // NOTE: This assumes canvas is positioned at top left corner
    if (
      event.x > buttonX &&
      event.x < buttonX + buttonW &&
      event.y > buttonY &&
      event.y < buttonY + buttonH
    ) {
      // Executes if button was clicked!
      console.log("clicked");
      window.open(window.location.href.replace("game.html", "donation.html")); //!!!! opens the donation change in a new tab !!!!
    }
  });
}

function donateBtnClicked() {
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

function endGame() {
  clearInterval(drawInterval);
  clearInterval(koalaInterval);
}

function increaseDifficulty() {
  if (2000 - 10 * koalaSaved > 500) {
    clearInterval(koalaInterval);
    koalaInterval = setInterval(createBaseKoala, 2000 - 10 * koalaSaved);
  }
}

var drawInterval = setInterval(draw, 10);
var koalaInterval = setInterval(createBaseKoala, 2000);

var koalaFacts = [];
koalaFacts.push(
  "Koalas are nocturnal marsupials famous for spending most of their lives asleep in trees."
);
koalaFacts.push(
  "They live and sleep in the eucalyptus trees. It's hot, light and dry here."
);
koalaFacts.push(
  "A joey grows and develops in the pouch for about six months. Once strong enough, the youngster rides around on its mother’s back."
);
koalaFacts.push(
  "The koalas have white on the underside and gray on the rest of its body."
);
koalaFacts.push("Koalas live on the East coast of Australia.");
koalaFacts.push("Koalas live for 20 or more years.");
koalaFacts.push("After 1 month the cub is 1 cm. long.");
koalaFacts.push("Koalas drink milk from the mother.");
koalaFacts.push("Koalas breed in the summer.");
koalaFacts.push("Koalas sleep for up to 19 hours.");

function randomFact() {
  return koalaFacts[Math.floor(Math.random() * 10)];
}
