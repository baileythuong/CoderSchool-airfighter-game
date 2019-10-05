// reset the game
function reset() {
  location.reload();
}

// let user submit username
function submitName() {
  let userInputName = document.getElementById("nameInput").value;

  let player = document.getElementById("playerName");
  player.innerHTML = `G'day, ${userInputName || "Obi Wan Kenobi"}!`
  closeForm("myForm");
}

// close form after submission
function closeForm(element) {
  document.getElementById(element).style.display = "none";
}

// submit button
let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", submitName);

// initialization
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

canvas.width = 512;
canvas.height = 480;
document.getElementById('canvas').appendChild(canvas);

let bgReady, aimReady, craftReady;
let bgImage, aimImage, craftImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

// crafts
let lst = [
  "images/Ship01.png",
  "images/Ship02.png",
  "images/Ship03.png",
  "images/Ship04.png",
  "images/Ship05.png",
  "images/Ship06.png"
];

// randomnize crafts
let item = lst[Math.floor(Math.random() * lst.length)];


// load images
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show background image
    bgReady = true;
  };
  bgImage.src = "images/backgroundsky.png";
  aimImage = new Image();
  aimImage.onload = function() {
    // show the gun aim image
    aimReady = true;
  };
  aimImage.src = "images/aim_V3.png";

  craftImage = new Image();
  craftImage.onload = function() {
    // show the craft image
    craftReady = true;
  };

  craftImage.src = item;

  fxImage = new Image();
  fxImage.onload = function() {
    fxReady = true;
  };

  fxImage.src = "images/FX.png";

  gameOverImage = new Image();
  gameOverImage.onload = function() {
    gameOverImageReady = true;
  };

  gameOverImage.src = "images/message_gameover.png";
}

// represent the X and Y positions of gun aim
let aimX = canvas.width / 2;
let aimY = canvas.height / 2;

let craftX = 100;
let craftY = 100;

let score = 0;
let isGameOver = false;

// store user's score, name and hostory on local storage
function getAppState() {
  return (
    JSON.parse(localStorage.getItem("appState")) || {
      gameHistory: [],
      currentHighScore: 0,
      currentUser: document.getElementById("currentUser")
    }
  );
}

function save(appState) {
  return localStorage.setItem("appState", JSON.stringify(appState));
}

// show username and highest scores on browser
document.getElementById("highScore").innerHTML = `Highest Score: ${
  getAppState().currentHighScore}`;

document.getElementById("currentUser").innerHTML = `Captain: ${getAppState().userInputName || "Obi Wan Kenobi"}`

// keyboard listeners
let keysDown = {};
function setupKeyboardListeners() {
  // check for keys pressed where key represents the keycode captured
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

function updateMonterPos() {
  craftX = Math.floor(Math.random() * 400 - 10 + 1) + 10;
  craftY = Math.floor(Math.random() * 400 - 10 + 1) + 10;
}

// update game objects - change player position based on key pressed
let update = function() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  isGameOver = elapsedTime > SECONDS_PER_ROUND;
  // if (score === 5) {
  //   console.log("run");
  //   return;
  // }

  if (38 in keysDown) {
    // player is holding up key
    aimY -= 5;
  }
  if (40 in keysDown) {
    // player is holding down key
    aimY += 5;
  }
  if (37 in keysDown) {
    // player is holding left key
    aimX -= 5;
  }
  if (39 in keysDown) {
    // player is holding right key
    aimX += 5;
  }

  // prevent gun aim from going left off screen
  if (aimX <= 0) {
    aimX = canvas.width - 10;
  }

  // prevent gun aim from going right off screen
  if (aimX >= canvas.width) {
    aimX = 0;
  }

  // prevent gun aim from going up off screen
  if (aimY <= 0) {
    aimY = canvas.height - 10;
  }

  // prevent gun aim from going down off screen
  if (aimY >= canvas.height) {
    aimY = 0;
  }

  // check if gun aim and craft collided
  // console.log('keysDown', keysDown)
  const aimedAtCraft =
    aimX <= craftX + 32 &&
    craftX <= aimX + 32 &&
    aimY <= craftY + 32 &&
    craftY <= aimY + 32;
  if (aimedAtCraft) {
      score += 1;
      craftX = Math.floor(Math.random() * canvas.width - 10);
      craftY = Math.floor(Math.random() * canvas.height - 10);
      craftImage.src = lst[Math.floor(Math.random() * lst.length)];
    }

    // console.log('score', score, )
    document.getElementById("score").innerHTML = `Scores: ${score}`;
    const appState = getAppState();
    console.log("getAppState", getAppState);

    if (appState.currentHighScore < score) {
      appState.currentHighScore = score;
      save(appState);
      document.getElementById("highScore").innerHTML = `Highest Score: ${score}`;
    }

    let userInputName = document.getElementById("nameInput").value;
    let currentUser = appState.currentUser = userInputName;
    save(appState);
    document.getElementById("currentUser").innerHTML = `Captain: ${currentUser || "Obi Wan Kenobi"}`;
  };

// this function, render, runs as often as possible.
let render = function() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px 'Turret Road'";
  
  if (!isGameOver) {
    //   if (score >= 20) {
    //     ctx.fillText(`YOU WIN`, 200, 250);
    //     isGameOver = true;
    //   } else {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (aimReady) {
      ctx.drawImage(aimImage, aimX, aimY);
    }
    if (craftReady) {
      ctx.drawImage(craftImage, craftX, craftY);
    }
    
    document.getElementById("seconds").innerHTML = `Timer: ${SECONDS_PER_ROUND -
      elapsedTime}`
    // }
    // set game over
  } else {
    ctx.drawImage(gameOverImage, 200, 200);
    isGameOver = true;
  }
};
 // the main game loop. Most every game will have two distinct parts: update (updates the state of the game, in this case our gun aim and craft) and render (based on the state of our game, draw the right things
let main = function() {
  update();
  render();
  // request to do this again ASAP. this is a special method for web browsers
  if (!isGameOver) {
    requestAnimationFrame(main);
  }
};

// cross-browser support for requestAnimationFrame
// safely ignore this line. It's mostly here for people with old web browsers
let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// let's play this game!
// setInterval(updateMonterPos, 2000);
loadImages();
setupKeyboardListeners();
