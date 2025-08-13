class GameLoop {
    constructor(stateManager, renderer) {
        this.stateManager = stateManager;
        this.renderer = renderer;
        this.running = false;
        this.lastTime = null;
        this._boundLoop = (timestamp) => this.loop(timestamp);
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this._boundLoop);
        }
    }

    stop() {
        this.running = false;
    }

    loop(now) {
        if (!this.running) return;
        const dt = Math.min((now - this.lastTime) / 1000, 0.045);
        this.lastTime = now;
        this.stateManager.update(dt);
        this.renderer.renderScene(this.stateManager, dt);
        requestAnimationFrame(this._boundLoop);
    }
}
window.GameLoop = GameLoop;