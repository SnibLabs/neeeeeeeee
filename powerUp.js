class PowerUp {
    constructor(x, y, kind = "spread") {
        this.type = "powerup";
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.kind = kind;
        this.alive = true;
        this._t = Math.random() * 1000;
    }

    update(dt, gameScene) {
        this._t += dt;
        this.y += 110 * dt;
        this.x += Math.sin(this._t * 2.2) * 24 * dt;
        if (this.y - this.radius > gameScene.height + 40) {
            gameScene.entityManager.remove(this);
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(performance.now() * 0.0016);
        ctx.globalAlpha = 0.90;
        // Draw a star or cross for "spread", heart for "heal"
        if (this.kind === "spread") {
            for (let i = 0; i < 7; ++i) {
                ctx.save();
                ctx.rotate((Math.PI * 2 / 7) * i);
                let grad = ctx.createLinearGradient(0, -this.radius, 0, 0);
                grad.addColorStop(0, "#0ff");
                grad.addColorStop(1, "#fff");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(0, -this.radius);
                ctx.lineTo(5, -this.radius / 1.7);
                ctx.lineTo(-5, -this.radius / 1.7);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.globalAlpha = 0.75;
            ctx.fill();
        } else if (this.kind === "heal") {
            // Draw heart
            ctx.save();
            ctx.scale(1.1, 1.1);
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(12, -10, 22, 12, 0, 20);
            ctx.bezierCurveTo(-22, 12, -12, -10, 0, 5);
            let grad = ctx.createLinearGradient(0, -10, 0, 20);
            grad.addColorStop(0, "#f44");
            grad.addColorStop(1, "#fff");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }
}
window.PowerUp = PowerUp;