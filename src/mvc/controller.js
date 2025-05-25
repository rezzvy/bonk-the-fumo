export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  // Initializes event listeners
  init() {
    this.view.mainMenuModal.show();

    // Bonk with key press
    document.addEventListener("keydown", (e) => {
      if (!this.model.isGameStarted || this.model.isGamePaused) return;
      if ((e.key.toLowerCase() === "z") & !this.model.isBonkPressed) {
        this.model.isBonkPressed = true;
        this.bonk();
      }
    });

    // Reset bonk flag on key release
    document.addEventListener("keyup", (e) => {
      if (!this.model.isGameStarted || this.model.isGamePaused) return;
      if ((e.key.toLowerCase() === "z") & this.model.isBonkPressed) {
        this.model.isBonkPressed = false;
      }
    });

    // Click to bonk
    document.addEventListener("click", () => {
      if (this.model.isGameStarted && !this.model.isGamePaused && !this.model.isBonkPressed) {
        this.bonk();
      }
    });

    // Track mouse and move background/pointer
    document.addEventListener("mousemove", (e) => {
      if (this.model.isGameStarted && !this.model.isGamePaused) {
        this.model.mouseX = e.clientX;
        this.model.mouseY = e.clientY;
        const bgX = (e.clientX / window.innerWidth - 0.5) * 20;
        const bgY = (e.clientY / window.innerHeight - 0.5) * 20;

        this.view.updateGameplayBackgroundPosition(bgX, bgY);
        this.view.updateDogePointerCordinates(e.clientX, e.clientY, this.model.pointerWeapon);
      }
    });

    // Start or stop game
    this.view.startGameButton.addEventListener("click", () => {
      if (!this.model.isGameStarted) {
        this.initialClick = true;

        this.view.mainMenuModal.hide();
        this.start();
      } else {
        this.stop();
      }
    });

    // Retry button
    this.view.retryButton.addEventListener("click", () => {
      this.view.resultModal.hide();
      this.start();
    });

    // Return to main menu from result modal
    this.view.resultMainMenuButton.addEventListener("click", () => {
      this.view.resultModal.hide();
      this.view.mainMenuModal.show();
    });

    // Pause game and open main menu
    this.view.gameplayMainMenuButton.addEventListener("click", () => {
      clearInterval(this.model.gameInterval);
      this.model.isGamePaused = true;
      this.view.mainMenuModal.show();
    });

    // Resume game if modal is closed
    this.view.mainMenuModal._element.addEventListener("hidden.bs.modal", () => {
      if (this.model.isGamePaused) {
        this.gameLoop();
        this.model.isGamePaused = false;
      }
    });

    this.view.weaponSelectElement.addEventListener("change", (e) => {
      this.model.pointerWeapon = e.target.value;
      this.view.dogePointer.dataset.weapon = e.target.value;
    });
  }

  // Start game loop
  start() {
    this.model.isGameStarted = true;
    this.gameLoop();
    this.view.start(true);
  }

  // Stop game and reset
  stop() {
    clearInterval(this.model.gameInterval);
    this.model.resetGameState();
    this.view.setGameStats(this.model.getGameStats());
    this.view.start(false);
  }

  // Handle bonk logic
  bonk() {
    if (this.initialClick) {
      this.initialClick = false;
      return;
    }

    this.playBonkAnimation();

    this.view.getFumos().forEach((fumo) => {
      if (this.model.hasPointerOnFumo(fumo)) {
        this.view.removeFumo(fumo);

        this.model.updateGameStats("bonked", (stats) => {
          this.view.setGameStats(stats);
          if (stats.doMoveToNextLevel && !this.model.isMaxSpeed) {
            this.gameLoop();
          }
        });
      }
    });
  }

  // Main game loop for generating fumos
  gameLoop() {
    if (this.model.gameInterval) {
      clearInterval(this.model.gameInterval);
    }

    this.model.gameInterval = setInterval(() => {
      this.view.generateFumo();

      this.model.updateGameStats("fumo-generated", (stats) => {
        this.view.setLifeBar(stats.lifebar);
      });

      if (this.model.checkGameOver()) {
        const stats = this.model.getGameStats();
        this.stop();
        this.view.resultModal.show();
        this.view.setGameResult(stats);
      }
    }, this.model.gameIntervalSpeed);

    this.model.isMaxSpeed = this.model.gameIntervalSpeed === this.model.MAX_INTERVAL_SPEED;
  }

  // Bonk animation using timeouts
  playBonkAnimation() {
    clearTimeout(this.model.bonkResetTimeout);
    clearTimeout(this.model.bonkRestartTimeout);
    this.view.bonkDogePointer(false, this.model.pointerWeapon);

    this.model.bonkRestartTimeout = setTimeout(() => {
      this.view.bonkDogePointer(true, this.model.pointerWeapon);

      this.model.bonkResetTimeout = setTimeout(() => {
        this.view.bonkDogePointer(false, this.model.pointerWeapon);
      }, 150);
    }, 50);
  }
}
