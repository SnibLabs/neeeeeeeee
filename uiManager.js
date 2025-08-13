class UIManager {
    constructor() {
        this.overlay = document.getElementById('ui-overlay');
    }

    showPanel(innerHTML) {
        if (this.overlay) {
            this.overlay.innerHTML = `<div class="ui-panel">${innerHTML}</div>`;
        }
    }

    hidePanel() {
        if (this.overlay) {
            this.overlay.innerHTML = '';
        }
    }

    updateHUD(gameScene) {
        if (!this.overlay) return;
        const player = gameScene.player;
        let livesIcons = "";
        for (let i = 0; i < player.maxLives; ++i) {
            if (i < player.lives) {
                livesIcons += `<span style="color:#fff; text-shadow:0 1px 2px #0cf;">&#10084;&#65039;</span> `;
            } else {
                livesIcons += `<span style="color:#555;">&#10084;&#65039;</span> `;
            }
        }
        let powerupStr = "";
        if (player.poweredUp) {
            powerupStr = `<span style="color:#0ff; text-shadow:0 0 6px #0ff;">Spread!</span>`;
        }
        this.overlay.innerHTML = `
            <div style="position:absolute;top:6px;left:14px;font-size:1.1rem;z-index:4;">Score: <b>${player.score}</b></div>
            <div style="position:absolute;top:6px;right:14px;font-size:1.1rem;z-index:4;">Lives: ${livesIcons} ${powerupStr}</div>
        `;
    }
}
window.UIManager = UIManager;