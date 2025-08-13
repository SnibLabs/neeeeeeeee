class Player {
    constructor(x, y) {
        this.type = "player";
        this.x = x;
        this.y = y;
        this.radius = 26;
        this.width = 42;
        this.height = 52;
        this.speed = 360;
        this.color = "cyan";
        this.cooldown = 0;
        this.shootInterval = 0.20;
        this.alive = true;
        this.invincible = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.score = 0;
        this.poweredUp = false;
        this.powerupTimer = 0;
        this.shootSpread = 0; // can be increased by powerup
    }

    update(dt, gameScene) {
        if (!this.alive) return;
        const input = gameScene.input;
        let dx = 0, dy = 0;
        if (input.isDown("ArrowLeft") || input.isDown("KeyA")) dx -= 1;
        if (input.isDown("ArrowRight") || input.isDown("KeyD")) dx += 1;
        if (input.isDown("ArrowUp") || input.isDown("KeyW")) dy -= 1;
        if (input.isDown("ArrowDown") || input.isDown("KeyS")) dy += 1;
        if (dx || dy) {
            const len = Math.sqrt(dx * dx + dy * dy);
            this.x += (dx / (len || 1)) * this.speed * dt;
            this.y += (dy / (len || 1)) * this.speed * dt;
        }
        // Boundaries
        this.x = Math.max(this.radius, Math.min(gameScene.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(gameScene.height - this.radius, this.y));
        this.cooldown -= dt;
        if (this.poweredUp) {
            this.powerupTimer -= dt;
            if (this.powerupTimer <= 0) {
                this.poweredUp = false;
                this.shootSpread = 0;
            }
        }
        if (this.invincible > 0) this.invincible -= dt;

        if ((input.isDown("Space") || input.isDown("KeyJ")) && this.cooldown <= 0) {
            this.shoot(gameScene);
            this.cooldown = this.shootInterval * (this.poweredUp ? 0.70 : 1.0);
        }
    }

    shoot(gameScene) {
        const em = gameScene.entityManager;
        const ySpeed = -620;
        em.add(new window.Projectile(this.x, this.y - this.radius - 10, 0, ySpeed, "player"));
        if (this.shootSpread > 0) {
            for (let i = 1; i <= this.shootSpread; ++i) {
                const angle = i * 10 * Math.PI / 180;
                em.add(new window.Projectile(this.x - 12 * i, this.y - this.radius - 10, -40 * i, ySpeed * 0.98, "player"));
                em.add(new window.Projectile(this.x + 12 * i, this.y - this.radius - 10, 40 * i, ySpeed * 0.98, "player"));
            }
        }
        if (gameScene.audio) gameScene.audio.playShoot();
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.invincible > 0 && Math.floor(performance.now() / 75) % 2 === 0) {
            ctx.globalAlpha = 0.33;
        }

        // === Gargoyle Body ===
        ctx.save();
        // Body
        ctx.beginPath();
        ctx.ellipse(0, 8, this.width / 2.8, this.height / 2.2, 0, 0, 2 * Math.PI);
        let bodyGrad = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        bodyGrad.addColorStop(0, "#bfc4c6");
        bodyGrad.addColorStop(1, "#6a7a7d");
        ctx.fillStyle = bodyGrad;
        ctx.shadowColor = "#444";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Belly
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 18, this.width / 4.2, this.height / 4.5, 0, 0, 2 * Math.PI);
        let bellyGrad = ctx.createLinearGradient(0, 10, 0, 30);
        bellyGrad.addColorStop(0, "#e8e8e8");
        bellyGrad.addColorStop(1, "#bfc4c6");
        ctx.fillStyle = bellyGrad;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.restore();

        // Head
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, -this.height / 3.2, this.width / 4, this.height / 6, 0, 0, 2 * Math.PI);
        let headGrad = ctx.createLinearGradient(0, -this.height / 2, 0, 0);
        headGrad.addColorStop(0, "#e8e8e8");
        headGrad.addColorStop(1, "#8e9a9d");
        ctx.fillStyle = headGrad;
        ctx.shadowColor = "#222";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Eyes
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(-6, -this.height / 3.2, 3, 3, 0, 0, 2 * Math.PI);
        ctx.ellipse(6, -this.height / 3.2, 3, 3, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#0cf";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-6, -this.height / 3.2, 1.2, 1.2, 0, 0, 2 * Math.PI);
        ctx.ellipse(6, -this.height / 3.2, 1.2, 1.2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "#0cf";
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();

        // Horns
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-8, -this.height / 3.2 - 4);
        ctx.lineTo(-14, -this.height / 2.1);
        ctx.lineTo(-10, -this.height / 3.2 + 2);
        ctx.closePath();
        ctx.moveTo(8, -this.height / 3.2 - 4);
        ctx.lineTo(14, -this.height / 2.1);
        ctx.lineTo(10, -this.height / 3.2 + 2);
        ctx.closePath();
        ctx.fillStyle = "#e8e8e8";
        ctx.shadowColor = "#aaa";
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.restore();

        // Mouth
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -this.height / 3.2 + 8, 6, Math.PI * 0.13, Math.PI * 0.87, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#444";
        ctx.stroke();
        ctx.restore();

        // Fangs
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-3, -this.height / 3.2 + 11);
        ctx.lineTo(-2, -this.height / 3.2 + 15);
        ctx.lineTo(-1, -this.height / 3.2 + 11);
        ctx.closePath();
        ctx.moveTo(3, -this.height / 3.2 + 11);
        ctx.lineTo(2, -this.height / 3.2 + 15);
        ctx.lineTo(1, -this.height / 3.2 + 11);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.restore();

        // Arms
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, 0);
        ctx.lineTo(-this.width / 2.1, this.height / 6);
        ctx.lineTo(-this.width / 3.5, this.height / 4.2);
        ctx.lineTo(-this.width / 6, this.height / 7);
        ctx.closePath();
        ctx.moveTo(this.width / 3, 0);
        ctx.lineTo(this.width / 2.1, this.height / 6);
        ctx.lineTo(this.width / 3.5, this.height / 4.2);
        ctx.lineTo(this.width / 6, this.height / 7);
        ctx.closePath();
        ctx.fillStyle = "#bfc4c6";
        ctx.shadowColor = "#888";
        ctx.shadowBlur = 4;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.restore();

        // Claws
        ctx.save();
        ctx.beginPath();
        // Left
        ctx.moveTo(-this.width / 3.5, this.height / 4.2);
        ctx.lineTo(-this.width / 3.5 - 3, this.height / 4.2 + 8);
        ctx.lineTo(-this.width / 3.5 + 3, this.height / 4.2 + 8);
        ctx.closePath();
        // Right
        ctx.moveTo(this.width / 3.5, this.height / 4.2);
        ctx.lineTo(this.width / 3.5 - 3, this.height / 4.2 + 8);
        ctx.lineTo(this.width / 3.5 + 3, this.height / 4.2 + 8);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.restore();

        // Legs
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-this.width / 6, this.height / 2.5);
        ctx.lineTo(-this.width / 8, this.height / 2);
        ctx.lineTo(0, this.height / 2.1);
        ctx.lineTo(this.width / 8, this.height / 2);
        ctx.lineTo(this.width / 6, this.height / 2.5);
        ctx.lineTo(0, this.height / 2.7);
        ctx.closePath();
        ctx.fillStyle = "#8e9a9d";
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.restore();

        // === Gargoyle Wings ===
        ctx.save();
        // Left wing
        ctx.save();
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2.1, -this.height / 6);
        ctx.bezierCurveTo(-this.width * 1.1, -this.height / 2.2, -this.width * 0.8, this.height / 2.1, -this.width / 2.2, this.height / 2.5);
        ctx.lineTo(-this.width / 3, 0);
        ctx.closePath();
        let wingGrad = ctx.createLinearGradient(-this.width, 0, 0, 0);
        wingGrad.addColorStop(0, "#bfc4c6cc");
        wingGrad.addColorStop(1, "#6a7a7dcc");
        ctx.fillStyle = wingGrad;
        ctx.shadowColor = "#444";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        // Right wing
        ctx.save();
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.moveTo(this.width / 2.1, -this.height / 6);
        ctx.bezierCurveTo(this.width * 1.1, -this.height / 2.2, this.width * 0.8, this.height / 2.1, this.width / 2.2, this.height / 2.5);
        ctx.lineTo(this.width / 3, 0);
        ctx.closePath();
        ctx.fillStyle = wingGrad;
        ctx.shadowColor = "#444";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
        ctx.restore();

        // Powerup wing glow
        if (this.poweredUp) {
            ctx.save();
            ctx.globalAlpha = 0.30;
            ctx.shadowColor = "#0ff";
            ctx.shadowBlur = 18 + Math.sin(performance.now() * 0.008) * 4;
            ctx.fillStyle = "#0ff";
            ctx.beginPath();
            ctx.arc(0, this.height / 2 - 5, this.width / 2.2, Math.PI * 0.15, Math.PI * 0.85, false);
            ctx.fill();
            ctx.restore();
        }

        // Tail
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, this.height / 2.3);
        ctx.bezierCurveTo(0, this.height / 1.8, 10, this.height / 1.7, 0, this.height / 1.5);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#6a7a7d";
        ctx.shadowColor = "#222";
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.restore();

        // === Gargoyle "Thrust" (magical aura) ===
        ctx.save();
        ctx.rotate(Math.PI);
        ctx.globalAlpha = 0.19 + Math.sin(performance.now() * 0.032) * 0.10;
        let grad3 = ctx.createRadialGradient(0, 0, 0, 0, 0, 24);
        grad3.addColorStop(0, "#bfffcf");
        grad3.addColorStop(1, "#1cf0");
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.sin(performance.now() * 0.016) * 5, 0, 2 * Math.PI);
        ctx.fillStyle = grad3;
        ctx.shadowColor = "#0ff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }

    damage(gameScene) {
        if (this.invincible > 0) return;
        --this.lives;
        this.invincible = 2.1;
        if (this.lives <= 0) {
            this.alive = false;
            if (gameScene.audio) gameScene.audio.playExplosion();
        }
    }

    collectPowerUp(type) {
        if (type === "spread") {
            this.poweredUp = true;
            this.powerupTimer = 10;
            this.shootSpread = 1;
        } else if (type === "heal" && this.lives < this.maxLives) {
            this.lives++;
        }
    }
}

window.Player = Player;