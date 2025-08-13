class Renderer {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this._backgroundStars = [];
        this._bgStarCount = 64;
        this._initBackground();
    }

    _initBackground() {
        this._backgroundStars = [];
        for (let i = 0; i < this._bgStarCount; ++i) {
            this._backgroundStars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.7,
                speed: 22 + Math.random() * 38,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    renderBackground(dt) {
        const ctx = this.ctx;
        // Deep space gradient
        let grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, "#16203A");
        grad.addColorStop(1, "#060817");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Animated parallax stars
        for (let s of this._backgroundStars) {
            ctx.save();
            ctx.globalAlpha = 0.46 + 0.39 * Math.abs(Math.sin(performance.now() * 0.0006 + s.twinkle));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 5 + Math.sin(performance.now() * 0.0009 + s.twinkle) * 1.5;
            ctx.fill();
            ctx.restore();
            s.y += s.speed * dt;
            if (s.y > this.height + 10) {
                s.y = -10;
                s.x = Math.random() * this.width;
            }
        }

        // Nebula layer (procedural)
        ctx.save();
        ctx.globalAlpha = 0.18;
        for (let i = 0; i < 5; ++i) {
            let x = this.width * (0.1 + 0.2 * i) + Math.sin(performance.now() * 0.0004 + i) * 50;
            let y = this.height * (0.3 + 0.1 * Math.sin(i));
            let r = 100 + 60 * Math.sin(performance.now() * 0.00013 + i);
            let grad2 = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad2.addColorStop(0, i % 2 === 0 ? "#3ff8" : "#0cfb");
            grad2.addColorStop(1, "#0000");
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = grad2;
            ctx.fill();
        }
        ctx.restore();
    }

    renderScene(stateManager, dt) {
        this.renderBackground(dt);
        if (stateManager.currentState &&
            stateManager.currentState.render) {
            stateManager.currentState.render(this.ctx);
        }
    }
}
window.Renderer = Renderer;