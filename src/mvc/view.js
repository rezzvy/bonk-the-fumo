export default class View {
  constructor() {
    // Initialize modals and UI elements
    this.mainMenuModal = new bootstrap.Modal("#main-menu-modal");
    this.resultModal = new bootstrap.Modal("#result-modal");
    this.fumoWrapperElement = document.getElementById("fumo-wrapper");
    this.startGameButton = document.getElementById("main-menu-start-game-btn");
    this.dogePointer = document.getElementById("doge-pointer");
    this.weaponSelectElement = document.getElementById("weapon-select");

    // Load audio
    this.bonkAudio = new Audio("./assets/bonk.mp3");
    this.shotAudio = new Audio("./assets/shot.mp3");
    this.shotAudio.volume = 0.5;
    this.bonkAudio.currentTime = 0.5;

    // Game stat elements
    this.lifeBarElement = document.getElementById("lifebar");
    this.totalHitElement = document.getElementById("total-hit");
    this.currentLevelElement = document.getElementById("current-level");
    this.scoreElement = document.getElementById("score");
    this.gameSpeedElement = document.getElementById("game-speed");

    // Result modal elements
    this.resultScoreElement = document.getElementById("result-score");
    this.resultTotalHitElement = document.getElementById("result-hit");
    this.resultLevelElement = document.getElementById("result-level");
    this.resultSpeedElement = document.getElementById("result-speed");

    // Buttons
    this.retryButton = document.getElementById("retry-btn");
    this.resultMainMenuButton = document.getElementById("go-to-main-menu-btn");
    this.gameplayMainMenuButton = document.getElementById("open-main-menu-btn");

    // Background
    this.gameplayBackgroundImage = document.querySelector(".gameplay-bg");
  }

  // Toggle game start/stop state
  start(bool) {
    if (bool) {
      this.startGameButton.textContent = "Stop Game";
      document.body.classList.toggle("game-starting", true);
      return;
    }

    this.startGameButton.textContent = "Start Game";
    document.body.classList.toggle("game-starting", false);
    document.querySelectorAll(".fumo-container").forEach((el) => el.remove());
  }

  // Return all fumo elements
  getFumos() {
    return document.querySelectorAll(".fumo-container");
  }

  // Create a fumo at random position
  generateFumo() {
    const randomNum = Math.floor(Math.random() * 3) + 1;
    const div = document.createElement("div");
    div.classList.add("fumo-container");
    div.style.position = "absolute";

    // Random position
    const maxTop = this.fumoWrapperElement.clientHeight - 150;
    const maxLeft = this.fumoWrapperElement.clientWidth - 150;
    const top = Math.random() * maxTop;
    const left = Math.random() * maxLeft;

    div.style.top = `${top}px`;
    div.style.left = `${left}px`;
    div.innerHTML = `<img class="fumo-item" src="./assets/fumos/fumo_${randomNum}.png" />`;

    this.fumoWrapperElement.appendChild(div);
  }

  // Play bonk sound if enabled
  playBonkSoundEffect(bool, weapon) {
    const audio = weapon === "stick" ? this.bonkAudio : this.shotAudio;
    const time = weapon === "stick" ? 0.5 : 0;

    audio.pause();
    audio.currentTime = time;
    if (bool) audio.play();
  }

  // Toggle bonk animation on doge pointer
  bonkDogePointer(bool, weapon) {
    if (bool) this.playBonkSoundEffect(true, weapon);
    this.dogePointer.classList.toggle("bonked", bool);
  }

  // Update doge pointer position
  updateDogePointerCordinates(x, y, weapon) {
    if (weapon === "stick") {
      this.dogePointer.style.top = `${y - this.dogePointer.clientHeight + 30}px`;
      this.dogePointer.style.left = `${x - this.dogePointer.clientWidth - 200}px`;
    }

    if (weapon === "gun") {
      this.dogePointer.style.top = `${y - this.dogePointer.clientHeight + 90}px`;
      this.dogePointer.style.left = `${x - this.dogePointer.clientWidth - 120}px`;
    }
  }

  // Move background based on pointer
  updateGameplayBackgroundPosition(x, y) {
    this.gameplayBackgroundImage.style.transform = `translate(${-x}px, ${-y}px)`;
  }

  // Update gameplay stats on screen
  setGameStats(stats) {
    this.lifeBarElement.style.width = stats.lifebar + "%";
    this.totalHitElement.textContent = stats.hit;
    this.currentLevelElement.textContent = stats.level;
    this.scoreElement.textContent = stats.score;
    this.gameSpeedElement.textContent = stats.speed + "ms";
  }

  // Update result modal with final stats
  setGameResult(stats) {
    this.resultScoreElement.textContent = stats.score;
    this.resultTotalHitElement.textContent = stats.hit;
    this.resultLevelElement.textContent = stats.level;
    this.resultSpeedElement.textContent = stats.speed + "ms";
  }

  // Set lifebar width
  setLifeBar(width) {
    this.lifeBarElement.style.width = width + "%";
  }

  // Animate and remove fumo from screen
  removeFumo(fumo) {
    fumo.style.left = "100%";
    setTimeout(() => {
      if (fumo.parentNode === this.fumoWrapperElement) {
        this.fumoWrapperElement.removeChild(fumo);
      }
    }, 500);
  }
}
