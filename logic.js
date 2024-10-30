// this file is in charge of the game logic



document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
    case "ArrowLeft":
      player.direction = "left";
      break;
    case "d":
    case "ArrowRight":
      player.direction = "right";
      break;
    case "s":
    case "ArrowDown":
      player.direction = "down";
      break;
    case "w":
    case "ArrowUp" :
      player.direction = "up"
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
    case "ArrowLeft":
    case "d":
    case "ArrowRight":
    case "s":
    case "ArrowDown":
    case "w":
    case "ArrowUp":
      player.direction = null;
  }
});


let lastShotTime = 0;
// cooldowntime from shooting
const shotCooldown = 900;

function shoot() {
  const currentTime = Date.now();
  if (currentTime - lastShotTime >= shotCooldown) {
    shootingAudio.play();
    new Bullet();
    lastShotTime = currentTime;
  }
}

// sound for shooting
const shootingAudio = document.querySelector("#shooting-audio")
// shooting mechanics
document.addEventListener('keydown', (e) => {
  if (e.code === "Space") {
    shoot();
  }
})


let frames = 0;


// the game loop function that runs the game
function gameLoop() {
  if (!game.isGameOver) {
    themeMusic.play();
    themeMusic.loop = true;
    frames++;
    player.move();

    
    // every 400 frames a new martini
    if (frames % 500 === 0) {
      new Martini();
    }
    
    game.martinis.forEach((martini) => {
      // check the collision with the martinis
      collisionTest(martini);
      
      // remove martini after a set number of frames
      if (frames % 900 === 0) {
        martini.destroy();
        
      };
    })
    
    // bullets array move and checking if the bullets hit the villain
    game.bullets.forEach((bullet) => {
      bullet.move();
      game.villains.forEach((villain) => {
        shootTest(bullet, villain);
      })
    })
    
    // looping through villains array and colissiontest
    game.villains.forEach((villain) => {
      villain.move();
      collisionTest(villain);
    })
    
    if (frames % 100 === 0) {
      new Villain();
    }
    const jamesBondSound = document.querySelector("#james-bond-sound");
    // every 900 frames a new level
    if (frames % 900 === 0) {
      jamesBondSound.play();
      new Villain() * 3;
      game.level++;
      game.updateLevel();
    }
    
    requestAnimationFrame(gameLoop)
  }
}

const themeMusic = document.querySelector("#theme-music");


const startAreaElement = document.querySelector("#start-area");
const startButtonElement = document.querySelector(".start-button");
const bodyElement = document.querySelector('body');
startButtonElement.addEventListener('click', () => {
  startAreaElement.style.display = 'none'
  startButtonElement.style.display = 'none'
  requestAnimationFrame(gameLoop);
  
  
})



function collisionTest(object) {
  const playerLeftEdge = player.left;
  const playerRightEdge = player.left + player.width;
  const playerTopEdge = player.top;
  const playerBottomEdge = player.top + player.width;
  
  const objectLeftEdge = object.left;
  const objectRightEdge = object.left + object.width;
  const objectTopEdge = object.top;
  const objectBottomEdge = object.top + object.height;
  
  if (
    playerLeftEdge < objectRightEdge &&
    playerRightEdge > objectLeftEdge &&
    playerTopEdge < objectBottomEdge &&
    playerBottomEdge > objectTopEdge
  ) {

    // martini sound
    const martiniSound = document.querySelector("#martini-sound");
    // collect the martini and get one life
    if (object instanceof Martini) {
      martiniSound.play();
      game.lives += 1;
      game.updateLives();
      object.destroy();
    }
    
    // function to show blood-effect after the player gets hit
    function showBloodEffect() {
      const bloodElement = document.querySelector("#blood");
      bloodElement.style.display = 'flex';
      gotHitAudio.play();
      setTimeout(() => {
        bloodElement.style.display = 'none';
      }, 200);
    }
    
    // sound after player gets hit
    const gotHitAudio = document.querySelector("#got-hit-audio");

    // sound after dying
    const agentFallAudio = document.querySelector("#agent-fall-audio");
    // destroy villain and remove lives
    if (object instanceof Villain) {
      showBloodEffect();
      game.lives--;
      game.updateLives();
      object.destroy();
      if (game.lives <= 0) {
        function endGame() {
          agentFallAudio.play();
          themeMusic.pause();
          const currentScore = document.querySelector("#score-display").textContent;
          document.querySelector('#final-score').textContent = currentScore;
          showBloodEffect();
        }
        game.isGameOver = true;
        endGame();
        game.gameOverScreen.style.display = "flex";
      }
    }
  }
}



function shootTest(bullet, villain) {
  const bulletLeftEdge = bullet.left;
  const bulletRightEdge = bullet.left + bullet.width;
  const bulletTopEdge = bullet.top;
  const bulletBottomEdge = bullet.top + bullet.height;

  const villainLeftEdge = villain.left;
  const villainRightEdge = villain.left + villain.width;
  const villainTopEdge = villain.top;
  const villainBottomEdge = villain.top + villain.height;
  
  if (
    bulletLeftEdge < villainRightEdge &&
    bulletRightEdge > villainLeftEdge &&
    bulletTopEdge < villainBottomEdge &&
    bulletBottomEdge > villainTopEdge
    ) {
    game.score += 100;
    game.updateScore();
    villain.destroy();
    bullet.destroy();
  }
}

function restartGame() {
  game.isGameOver = false;
  game.lives = 5;
  game.gameOverScreen.style.display = 'none';
  game.updateLives();
  player.top = 300;
  player.left = 0;
  themeMusic.currentTime = 0;

  game = new Game();
  player = new Player();
  requestAnimationFrame(gameLoop);

}

const restartButtonElement = document.querySelector('#restart-game');
restartButtonElement.addEventListener("click", () => {
  restartGame();
});





