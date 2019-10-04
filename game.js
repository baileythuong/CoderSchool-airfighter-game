/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/
function reset() {
  location.reload();
}

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, aimReady, craftReady, craft1Ready;
let bgImage, aimImage, craftImage, craft1Image;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let lst = [
  "images/Ship01.png",
  "images/Ship02.png",
  "images/Ship03.png",
  "images/Ship04.png",
  "images/Ship05.png",
  "images/Ship06.png"
];
let item = lst[Math.floor(Math.random() * lst.length)];

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/backgroundsky.png";
  aimImage = new Image();
  aimImage.onload = function() {
    // show the hero image
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

/**
 * Setting up our characters.
 *
 * Note that aimX represents the X position of our hero.
 * aimY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let aimX = canvas.width / 2;
let aimY = canvas.height / 2;

let craftX = 100;
let craftY = 100;

let score = 0;
let isGameOver = false;

function getAppState() {
  return (
    JSON.parse(localStorage.getItem("appState")) || {
      gameHistory: [],
      currentHighScore: 0,
      currentUser: document.getElementById("username") || "Anonymous"
    }
  );
}

function save(appState) {
  return localStorage.setItem("appState", JSON.stringify(appState));
}

document.getElementById("highScore").innerHTML = `Highest Score: ${
  getAppState().currentHighScore
}`;

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
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

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */

//
let update = function() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  isGameOver = elapsedTime > SECONDS_PER_ROUND;
  // if (score === 5) {
  //   console.log("run");
  //   return;
  // }

  if (38 in keysDown) {
    // Player is holding up key
    aimY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    aimY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    aimX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    aimX += 5;
  }

  // Hero going left off screen
  if (aimX <= 0) {
    aimX = canvas.width - 10;
  }

  // Hero going right off screen
  if (aimX >= canvas.width) {
    aimX = 0;
  }

  // Hero going up off screen
  if (aimY <= 0) {
    aimY = canvas.height - 10;
  }

  // Hero going down off screen
  if (aimY >= canvas.height) {
    aimY = 0;
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  // console.log('keysDown', keysDown)
  const aimedAtCraft =
    aimX <= craftX + 32 &&
    craftX <= aimX + 32 &&
    aimY <= craftY + 32 &&
    craftY <= aimY + 32;
  if (aimedAtCraft) {
    score += 1;
    if (shootFX()) {
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
      document.getElementById("highScore").innerHTML = score;
    }
  }
};

function shootFX() {
  setTimeout(hitCraft, 500);

  return true;
}

function hitCraft() {
  craftImage = fxImage;
}

/**
 * This function, render, runs as often as possible.
 */
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
    // ctx.fillText(
    //   `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    //   20,
    //   100
    // );

    document.getElementById("seconds").innerHTML = `Timer: ${SECONDS_PER_ROUND -
      elapsedTime}`;

    // }
    // set game over
  } else {
    ctx.drawImage(gameOverImage, 300, 300);
    isGameOver = true;
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
let main = function() {
  update();
  render();

  // Request to do this again ASAP. This is a special method
  // for web browsers.
  if (!isGameOver) {
    requestAnimationFrame(main);
  }
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
// setInterval(updateMonterPos, 2000);
loadImages();
setupKeyboardListeners();
main();
