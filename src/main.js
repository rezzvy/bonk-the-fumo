const dogePointer = document.getElementById("doge-pointer");
const fumoWrapper = document.getElementById("fumo-wrapper");
const bonkAudio = new Audio("../assets/bonk.mp3");
bonkAudio.currentTime = 0.5;

let lifebar = 100;
let totalHit = 0;
let currentLevel = 1;
let score = 0;
let gameIntervalSpeed = 1000;
let gameInterval = null;

const lifeBarElement = document.getElementById("lifebar");
const totalHitElement = document.getElementById("total-hit");
const currentLevelElement = document.getElementById("current-level");
const scoreElement = document.getElementById("score");
const gameSpeedElement = document.getElementById("game-speed");

gameSpeedElement.textContent = gameIntervalSpeed + "ms";

function generateFumoItem(container) {
  const randomNum = Math.floor(Math.random() * 3) + 1;
  const div = document.createElement("div");
  div.classList.add("fumo-container");
  div.style.position = "absolute";

  const maxTop = container.clientHeight - 150;
  const maxLeft = container.clientWidth - 150;
  const top = Math.random() * maxTop;
  const left = Math.random() * maxLeft;

  div.style.top = `${top}px`;
  div.style.left = `${left}px`;

  div.innerHTML = `<img class="fumo-item" src="./assets/fumos/fumo_${randomNum}.png" />`;

  return div;
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelector(".gameplay-bg").style.transform = `translate(${-x}px, ${-y}px)`;

  dogePointer.style.top = `${e.clientY - dogePointer.clientHeight + 30}px`;
  dogePointer.style.left = `${e.clientX - dogePointer.clientWidth - 200}px`;
});

let bonkResetTimeout;
let bonkRestartTimeout;

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "z") {
    clearTimeout(bonkResetTimeout);
    clearTimeout(bonkRestartTimeout);

    dogePointer.classList.remove("bonked");
    if (!bonkAudio.paused) {
      bonkAudio.pause();
      bonkAudio.currentTime = 0.5;
    }

    bonkRestartTimeout = setTimeout(() => {
      bonkAudio.play();
      dogePointer.classList.add("bonked");

      bonkResetTimeout = setTimeout(() => {
        dogePointer.classList.remove("bonked");
      }, 150);
    }, 50);

    const fumoItems = document.querySelectorAll(".fumo-container");

    fumoItems.forEach((fumo) => {
      const rect = fumo.getBoundingClientRect();
      if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
        totalHit += 1;
        score += 100;

        let nextLevel = Math.floor(totalHit / 10) + 1;
        if (nextLevel > currentLevel) {
          currentLevel = nextLevel;
          gameIntervalSpeed = Math.max(150, gameIntervalSpeed - 50);
          gameSpeedElement.textContent = gameIntervalSpeed + "ms";
          startGameLoop();
        }

        totalHitElement.textContent = totalHit;
        scoreElement.textContent = score;
        currentLevelElement.textContent = currentLevel;

        lifebar += 5;
        if (lifebar > 100) lifebar = 100;
        lifeBarElement.style.width = lifebar + "%";

        fumo.style.left = "100%";
        setTimeout(() => {
          if (fumo.parentNode === fumoWrapper) {
            fumoWrapper.removeChild(fumo);
          }
        }, 500);
      }
    });
  }
});

function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    lifebar -= 5;
    if (lifebar < 0) lifebar = 0;
    lifeBarElement.style.width = lifebar + "%";

    const item = generateFumoItem(fumoWrapper);
    fumoWrapper.appendChild(item);

    if (lifebar <= 0) {
      clearInterval(gameInterval);
      setTimeout(() => {
        alert("Game is over!");
      }, 150);
    }
  }, gameIntervalSpeed);
}

startGameLoop();
