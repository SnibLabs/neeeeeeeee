class ScoreManager {
    constructor() {
        this.score = 0;
        this.lastKillTime = 0;
        this.comboMultiplier = 1;
    }

    addScore(amount, now) {
        if (now - this.lastKillTime < 1.0) {
            this.comboMultiplier += 0.1;
        } else {
            this.comboMultiplier = 1;
        }
        this.lastKillTime = now;
        this.score += Math.floor(amount * this.comboMultiplier);
    }

    reset() {
        this.score = 0;
        this.comboMultiplier = 1;
        this.lastKillTime = 0;
    }
}
window.ScoreManager = ScoreManager;