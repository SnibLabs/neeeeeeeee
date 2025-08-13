class MenuScene {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.ui = new window.UIManager();
        this._boundStart = () => this.onStart();
        this.visible = false;
    }

    enter() {
        this.visible = true;
        this.ui.showPanel(`
            <h1>SPACE SHOOTER</h1>
            <p>Arrow keys or WASD to move.<br>Space to shoot.<br><b>Survive waves, score big!</b></p>
            <button class="ui-btn" id="btn-start">Start</button>
        `);
        setTimeout(() => {
            const btn = document.getElementById('btn-start');
            if (btn) btn.addEventListener('click', this._boundStart);
        }, 30);
    }

    leave() {
        this.visible = false;
        this.ui.hidePanel();
        const btn = document.getElementById('btn-start');
        if (btn) btn.removeEventListener('click', this._boundStart);
    }

    update() {}

    render() {}

    onStart() {
        this.stateManager.changeState("game");
    }
}
window.MenuScene = MenuScene;