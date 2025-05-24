export default class Modal {
  constructor() {
    // Initial game state
    this.gameLifeBar = 100;
    this.gameTotalHit = 0;
    this.gameCurrentLevel = 1;
    this.gameScore = 0;
    this.gameIntervalSpeed = 1000;
    this.MAX_INTERVAL_SPEED = 150;

    // Game flags
    this.isGameStarted = false;
    this.isGamePaused = false;
    this.isBonkPressed = false;
    this.isMaxSpeed = false;

    // Mouse position tracking
    this.mouseX = 0;
    this.mouseY = 0;

    // Interval and timeout placeholders
    this.gameInterval = null;
    this.bonkResetTimeout = null;
    this.bonkRestartTimeout = null;
  }

  // Returns current game stats
  getGameStats() {
    return {
      hit: this.gameTotalHit,
      score: this.gameScore,
      level: this.gameCurrentLevel,
      lifebar: this.gameLifeBar,
      speed: this.gameIntervalSpeed,
    };
  }

  // Resets game to initial state
  resetGameState() {
    this.gameLifeBar = 100;
    this.gameTotalHit = 0;
    this.gameCurrentLevel = 1;
    this.gameScore = 0;
    this.gameIntervalSpeed = 1000;
    this.isGameStarted = false;
    this.isGamePaused = false;
    this.isGameOver = false;
    this.isBonkPressed = false;
    this.isMaxSpeed = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.gameInterval = null;
    this.bonkResetTimeout = null;
    this.bonkRestartTimeout = null;
  }

  // Checks if the game is over
  checkGameOver() {
    return this.gameLifeBar <= 0;
  }

  // Checks if player reached the next level
  checkNextLevel() {
    const nextLevel = Math.floor(this.gameTotalHit / 10) + 1;
    return nextLevel > this.gameCurrentLevel;
  }

  // Updates game state after bonk or fumo event
  updateGameStats(actionType, callback) {
    if (actionType === "bonked") {
      this.gameTotalHit += 1;
      this.gameScore += 100;
      this.gameLifeBar += 5;
      if (this.gameLifeBar > 100) this.gameLifeBar = 100;
    }

    if (actionType === "fumo-generated") {
      this.gameLifeBar -= 5;
      if (this.gameLifeBar < 0) this.gameLifeBar = 0;
    }

    // Level up check
    const doMoveToNextLevel = this.checkNextLevel();
    if (doMoveToNextLevel) {
      this.gameCurrentLevel += 1;
      this.gameIntervalSpeed = Math.max(150, this.gameIntervalSpeed - 50);
    }

    callback({
      hit: this.gameTotalHit,
      score: this.gameScore,
      level: this.gameCurrentLevel,
      lifebar: this.gameLifeBar,
      speed: this.gameIntervalSpeed,
      doMoveToNextLevel,
    });
  }

  // Checks if pointer is on a fumo element
  hasPointerOnFumo(el) {
    const rect = el.getBoundingClientRect();
    const isInsideX = this.mouseX >= rect.left && this.mouseX <= rect.right;
    const isInsideY = this.mouseY >= rect.top && this.mouseY <= rect.bottom;
    return isInsideX && isInsideY;
  }
}
