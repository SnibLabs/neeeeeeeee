class Projectile {
    constructor(x, y, vx, vy, owner) {
        this.type = "projectile";
        this.owner = owner; // "player" or "enemy"
        this.x = x;
        this.y = y;
        // Make Coke bottles bigger
        if (owner === "enemy") {
            this.radius = 16; // was 8
        } else {
            this.radius = 8;
        }
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.color = owner === "player" ? "#fffb96" : "#ff3a60";
        this.gradient = null;
        this.life = 2.5;
    }

    update(dt, gameScene) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
        if (
            this.x < -40 || this.x > gameScene.width + 40 ||
            this.y < -40 || this.y > gameScene.height + 40 ||
            this.life <= 0
        ) {
            gameScene.entityManager.remove(this);
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.owner === "player") {
            // Draw a little green alien man
            ctx.save();
            ctx.scale(0.85, 0.85); // Slightly smaller than projectile radius
            // Head
            ctx.beginPath();
            ctx.ellipse(0, -7, 7, 8, 0, 0, 2 * Math.PI);
            let headGrad = ctx.createRadialGradient(0, -9, 2, 0, -7, 8);
            headGrad.addColorStop(0, "#eaffd0");
            headGrad.addColorStop(0.5, "#7cff4a");
            headGrad.addColorStop(1, "#21b81a");
            ctx.fillStyle = headGrad;
            ctx.shadowColor = "#0f0";
            ctx.shadowBlur = 8;
            ctx.fill();

            // Eyes
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(-2.6, -8, 1.2, 2.2, 0, 0, 2 * Math.PI);
            ctx.ellipse(2.6, -8, 1.2, 2.2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#222";
            ctx.globalAlpha = 0.88;
            ctx.fill();
            ctx.restore();

            // Body
            ctx.beginPath();
            ctx.ellipse(0, 1, 4.3, 7, 0, 0, 2 * Math.PI);
            let bodyGrad = ctx.createLinearGradient(0, -7, 0, 10);
            bodyGrad.addColorStop(0, "#aaff8a");
            bodyGrad.addColorStop(1, "#269c1a");
            ctx.fillStyle = bodyGrad;
            ctx.globalAlpha = 0.98;
            ctx.fill();

            // Arms
            ctx.save();
            ctx.lineWidth = 2.1;
            ctx.strokeStyle = "#3cbf2a";
            ctx.beginPath();
            ctx.moveTo(-4, -2);
            ctx.lineTo(-8, 4);
            ctx.moveTo(4, -2);
            ctx.lineTo(8, 4);
            ctx.stroke();
            ctx.restore();

            // Legs
            ctx.save();
            ctx.lineWidth = 2.1;
            ctx.strokeStyle = "#3cbf2a";
            ctx.beginPath();
            ctx.moveTo(-2, 8);
            ctx.lineTo(-3.5, 13);
            ctx.moveTo(2, 8);
            ctx.lineTo(3.5, 13);
            ctx.stroke();
            ctx.restore();

            // Antennae
            ctx.save();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = "#baffb0";
            ctx.beginPath();
            ctx.moveTo(-3, -13);
            ctx.lineTo(-2, -9);
            ctx.moveTo(3, -13);
            ctx.lineTo(2, -9);
            ctx.stroke();
            // Antenna balls
            ctx.beginPath();
            ctx.arc(-3, -13, 1.1, 0, 2 * Math.PI);
            ctx.arc(3, -13, 1.1, 0, 2 * Math.PI);
            ctx.fillStyle = "#eaffd0";
            ctx.globalAlpha = 0.88;
            ctx.fill();
            ctx.restore();

            ctx.restore();
        } else {
            // Enemy projectile: Draw a Coca-Cola bottle
            ctx.save();
            ctx.rotate(Math.PI / 16 * Math.sin(performance.now() * 0.003 + this.x * 0.02)); // slight wiggle

            // Make the bottle bigger
            let scale = 1.8; // was 0.9, double the size

            ctx.save();
            ctx.scale(scale, scale);
            // Draw bottle outline
            ctx.beginPath();
            ctx.moveTo(-4, 10);
            ctx.bezierCurveTo(-6, 6, -4, -7, -2, -13);
            ctx.lineTo(2, -13);
            ctx.bezierCurveTo(4, -7, 6, 6, 4, 10);
            ctx.closePath();
            ctx.fillStyle = "#e0e0e0";
            ctx.shadowColor = "#222";
            ctx.shadowBlur = 4;
            ctx.fill();

            // Draw Coke liquid
            ctx.beginPath();
            ctx.moveTo(-3.2, 7);
            ctx.bezierCurveTo(-4.5, 4, -2.7, -4, -1.2, -10);
            ctx.lineTo(1.2, -10);
            ctx.bezierCurveTo(2.7, -4, 4.5, 4, 3.2, 7);
            ctx.closePath();
            let cokeGrad = ctx.createLinearGradient(0, -10, 0, 8);
            cokeGrad.addColorStop(0, "#6b1a00");
            cokeGrad.addColorStop(0.6, "#a52a13");
            cokeGrad.addColorStop(1, "#3a1200");
            ctx.fillStyle = cokeGrad;
            ctx.globalAlpha = 0.93;
            ctx.fill();

            // White label
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.ellipse(0, -3, 4.2, 2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.fill();

            // Red label band
            ctx.beginPath();
            ctx.ellipse(0, -3, 4.2, 1.1, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#e41c23";
            ctx.globalAlpha = 0.95;
            ctx.fill();

            // "Coca-Cola" squiggle (just a white wave)
            ctx.save();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.1;
            ctx.globalAlpha = 0.82;
            ctx.beginPath();
            ctx.moveTo(-2.2, -3);
            ctx.bezierCurveTo(-1.5, -2.2, 1.5, -3.8, 2.2, -3);
            ctx.stroke();
            ctx.restore();

            // Bottle cap
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.ellipse(0, -13, 2.2, 1.2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = "#e41c23";
            ctx.shadowColor = "#e41c23";
            ctx.shadowBlur = 2;
            ctx.fill();

            ctx.restore();

            // Fizz bubbles
            for (let i = 0; i < 3; ++i) {
                ctx.save();
                let bx = -1 + Math.sin(performance.now() * 0.002 + i * 1.7) * 1.5 + i * 1.2;
                let by = -8 + Math.cos(performance.now() * 0.002 + i * 2.2) * 1.3 - i * 2.2;
                ctx.beginPath();
                ctx.arc(bx * scale, by * scale, (0.6 + Math.abs(Math.sin(performance.now() * 0.001 + i))) * scale, 0, 2 * Math.PI);
                ctx.fillStyle = "#fff";
                ctx.globalAlpha = 0.7;
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();
        }

        ctx.restore();
    }
}
window.Projectile = Projectile;