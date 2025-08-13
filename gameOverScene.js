class GameOverScene {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.ui = new window.UIManager();
        this._boundRestart = () => this.onRestart();
        this.visible = false;
        this.finalScore = 0;
    }

    enter(data) {
        this.visible = true;
        this.finalScore = data && typeof data.score === "number" ? data.score : 0;
        this.ui.showPanel(`
            <h1>GAME OVER</h1>
            <p>Your Score:<br><span style="font-size:2.2rem;color:#fff;text-shadow:0 0 8px #0cf;">${this.finalScore}</span></p>
            <button class="ui-btn" id="btn-restart">Restart</button>
        `);
        setTimeout(() => {
            const btn = document.getElementById('btn-restart');
            if (btn) btn.addEventListener('click', this._boundRestart);
        }, 30);
    }

    leave() {
        this.visible = false;
        this.ui.hidePanel();
        const btn = document.getElementById('btn-restart');
        if (btn) btn.removeEventListener('click', this._boundRestart);
    }

    update() {}

    render() {}

    onRestart() {
        this.stateManager.changeState("game");
    }
}
window.GameOverScene = GameOverScene;