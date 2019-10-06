// reset game
function reset() {
  location.reload();
}

// initialization
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

canvas.width = 512;
canvas.height = 480;
canvas.style = "position:absolute; top: 0%; left: 20%; margin-left: -250px;";
document.body.appendChild(canvas);
let currentName = "";
let score = 0;
let craftX = 100;
let craftY = 100;
let keysDown = {};
let elapsedTime = 0;
let isGameOver = false;
let startTime = Date.now();
let aimX = canvas.width / 2;
let aimY = canvas.height / 2;
const SECONDS_PER_ROUND = 30;
let fxReady, fxImage, shouldShowFX;
let bgReady, aimReady, craftReady;
let bgImage, aimImage, craftImage;
let fxSound = new Audio("sounds/explosion.wav")
let bgMusic = new Audio("sounds/Self-Destruct-Sequence.mp3")

// mute sound
function muteSound() {
fxSound.muted = true;
bgMusic.muted = true;
}

// play sound
function playSound() {
fxSound.muted = false;
bgMusic.muted = false;
}

// random aircrafts
let lst = [
  "images/Ship01.png",
  "images/Ship02.png",
  "images/Ship03.png",
  "images/Ship04.png",
  "images/Ship05.png",
  "images/Ship06.png"
];
let item = lst[Math.floor(Math.random() * lst.length)];

function setupGame() {
  startTime = Date.now(); // setup this variable again on start
  loadImages();
  setupKeyboardListeners();
  update();
  main(); //main should be in here
}

// close form after submission
function closeForm(element) {
  document.getElementById(element).style.display = "none";
}

// submit name
function submitName() {
  let userInputName = document.getElementById("nameInput").value;

  let player = document.getElementById("playerName");
  if (userInputName === "") {
    currentName = "Obi Wan Kenobi";
  } else currentName = userInputName

  player.innerHTML = `G'day, ${currentName}!`
  closeForm("myForm");
}

// submit name button
let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", submitName);

// render scores on navbar
document.getElementById("score").innerHTML = `Scores: ${getAppState().score}`;

// load images
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // background image
    bgReady = true;
  };
  bgImage.src = "images/backgroundsky.png";
  aimImage = new Image();
  aimImage.onload = function () {
    // gun aim image
    aimReady = true;
  };
  aimImage.src = "images/aim_V3.png";

  craftImage = new Image();
  craftImage.onload = function () {
    // load random aircrafts
    craftReady = true;
  };

  craftImage.src = item;

  fxImage = new Image();
  fxImage.onload = function () {
    // shooting effect
    fxReady = true;
  };

  fxImage.src = "images/FX.png";

  gameOverImage = new Image();
  gameOverImage.onload = function () {
    // game over image
    gameOverImageReady = true;
  };

  gameOverImage.src = "images/message_gameover.png";
}

// set local storage
function getAppState() {
  return (
    JSON.parse(localStorage.getItem("appState")) || {
      currentHighScore: 0,
      currentUser: "Obi Wan Kenobi"
    }
  );
}

// get local storage
function save(appState) {
  return localStorage.setItem("appState", JSON.stringify(appState));
}

// set up arrow keys
function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function (key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function (key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

// update aircraft after shooting
function updateCraft() {
  craftX = Math.floor(Math.random() * 400 - 10 + 1) + 10;
  craftY = Math.floor(Math.random() * 400 - 10 + 1) + 10;
}

function move() {
  if (38 in keysDown) {
    aimY -= 5;
  }
  if (40 in keysDown) {
    aimY += 5;
  }
  if (37 in keysDown) {
    aimX -= 5;
  }
  if (39 in keysDown) {
    aimX += 5;
  }
}

function wrapAround() {
  if (aimX <= 0) {
    aimX = canvas.width - 10;
  }

  if (aimX >= canvas.width) {
    aimX = 0;
  }

  if (aimY <= 0) {
    aimY = canvas.height - 10;
  }

  if (aimY >= canvas.height) {
    aimY = 0;
  }
}

function checkIfTargetedCraft() {
  const spacecraftTargeted =
    aimX <= craftX + 32 &&
    craftX <= aimX + 32 &&
    aimY <= craftY + 32 &&
    craftY <= aimY + 32;
  if (spacecraftTargeted) {
    score += 1;
    shootFX();
    fxSound.play();
    fxSound.volume= 0.1;

    craftImage.src = lst[Math.floor(Math.random() * lst.length)];

    const appState = getAppState();
    const newHighScore = appState.currentHighScore < score;

    if (newHighScore) {
      appState.currentHighScore = score;
      appState.currentUser = currentName;
      save(appState);
      // set highest scores on achivement tab
      document.getElementById("highScore").innerHTML = `${getAppState().currentHighScore} <i class="fas fa-fighter-jet"></i>`
    }
    document.getElementById("score").innerHTML = `Scores: ${score}`;
    document.getElementById("userName").innerHTML = `Captain: ${getAppState().currentUser}`
  }
}

let update = function () {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  isGameOver = elapsedTime > SECONDS_PER_ROUND;
  move();
  wrapAround();
  checkIfTargetedCraft();
};

function shootFX() {
  showExplosion()
  moveSpaceCraft()
}

function showExplosion() {
  explosionXY = {
    x: craftX,
    y: craftY
  }
  shouldShowFX = true
  setTimeout(() => shouldShowFX = false, 100)
}

function moveSpaceCraft() {
  craftX = Math.floor(Math.random() * (canvas.width - 60)); //Images have 32 pixel height and width, so -60 will help them alway inside the screen
  craftY = Math.floor(Math.random() * (canvas.height - 60));
}

function hitCraft() {
  craftImage = fxImage;
}

let render = function () {

  if (!isGameOver) {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (aimReady) {
      ctx.drawImage(aimImage, aimX, aimY);
    }
    if (craftReady) {
      ctx.drawImage(craftImage, craftX, craftY);
    }

    if (shouldShowFX) {
      console.log('shouldShowFX', shouldShowFX)
      ctx.drawImage(fxImage, explosionXY.x, explosionXY.y);
    }

    document.getElementById("seconds").innerHTML = `Timer: ${SECONDS_PER_ROUND -
      elapsedTime}`;
  } else {
    ctx.drawImage(gameOverImage, 200, 200);
    isGameOver = true;
  }
};

let main = function () {
  bgMusic.play();
  update();
  render();

  if (!isGameOver) {
    requestAnimationFrame(main);
  }
};

let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;
