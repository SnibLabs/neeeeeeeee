class Enemy {
    constructor(x, y, type = "basic", speed = 70, hp = 1, scoreValue = 100) {
        this.type = "enemy";
        this.enemyType = type; // for drawing
        this.x = x;
        this.y = y;
        this.radius = 22;
        this.width = 38;
        this.height = 42;
        this.speed = speed;
        this.hp = hp;
        this.scoreValue = scoreValue;
        this.alive = true;
        this._t = Math.random() * 1000;
        this.shootCooldown = 0;
        // For fairy dust explosion effect
        this.exploding = false;
        this.explosionTime = 0;
        this.explosionParticles = null;
    }

    update(dt, gameScene) {
        if (this.exploding) {
            this.explosionTime += dt;
            // Update particles
            if (this.explosionParticles) {
                for (let p of this.explosionParticles) {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.life -= dt;
                    // Fade out
                    p.alpha = Math.max(0, p.alpha - dt * 1.6);
                }
            }
            // Remove after explosion animation
            if (this.explosionTime > 0.8) {
                gameScene.entityManager.remove(this);
            }
            return;
        }

        this._t += dt;
        if (this.enemyType === "basic") {
            this.y += this.speed * dt;
            this.x += Math.sin(this._t * 1.2) * 18 * dt;
        } else if (this.enemyType === "zigzag") {
            this.y += this.speed * dt;
            this.x += Math.sin(this._t * 3.0) * 44 * dt;
        } else if (this.enemyType === "fast") {
            this.y += (this.speed + 70) * dt;
            this.x += Math.sin(this._t * 2.2) * 24 * dt;
        } else if (this.enemyType === "tank") {
            this.y += (this.speed * 0.7) * dt;
            this.x += Math.sin(this._t * 1.2) * 14 * dt;
        }
        // Enemy shooting (now for ALL enemy types)
        this.shootCooldown -= dt;
        let shootChance = 0;
        let shootInterval = 0;
        if (this.enemyType === "tank") {
            shootChance = 0.35 * 0.5; // 50% as often
            shootInterval = (1.4 + Math.random()) * 1.5; // less often
        } else if (this.enemyType === "basic") {
            shootChance = 0.09 * 0.5; // 50% as often
            shootInterval = (2.0 + Math.random() * 1.2) * 1.5; // less often
        } else if (this.enemyType === "zigzag") {
            shootChance = 0.13 * 0.5; // 50% as often
            shootInterval = (1.6 + Math.random()) * 1.5; // less often
        } else if (this.enemyType === "fast") {
            shootChance = 0.16 * 0.5; // 50% as often
            shootInterval = (1.2 + Math.random() * 0.7) * 1.5; // less often
        }
        if (this.shootCooldown <= 0 && Math.random() < shootChance) {
            this.shootCooldown = shootInterval;
            // Aim at player (shoot towards player position)
            let player = gameScene.player;
            if (player && player.alive) {
                let dx = player.x - this.x;
                let dy = player.y - (this.y + this.radius + 10);
                let dist = Math.sqrt(dx * dx + dy * dy);
                let speed = 260;
                // Fast enemies shoot a bit faster
                if (this.enemyType === "fast") speed = 340;
                let vx = dx / dist * speed;
                let vy = dy / dist * speed;
                gameScene.entityManager.add(new window.Projectile(this.x, this.y + this.radius + 10, vx, vy, "enemy"));
            } else {
                // fallback: straight down
                gameScene.entityManager.add(new window.Projectile(this.x, this.y + this.radius + 10, 0, 260, "enemy"));
            }
        }
        // Remove if off screen
        if (this.y - this.radius > gameScene.height + 80) {
            gameScene.entityManager.remove(this);
        }
    }

    render(ctx) {
        if (this.exploding) {
            // Draw fairy dust explosion particles
            if (this.explosionParticles) {
                for (let p of this.explosionParticles) {
                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(this.x + p.x, this.y + p.y, p.size, 0, 2 * Math.PI);
                    let grad = ctx.createRadialGradient(this.x + p.x, this.y + p.y, 0, this.x + p.x, this.y + p.y, p.size);
                    grad.addColorStop(0, p.color);
                    grad.addColorStop(1, "rgba(255,255,255,0)");
                    ctx.fillStyle = grad;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.restore();
                }
            }
            return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);

        // === Fairy Body ===
        ctx.save();

        // Fairy color by type
        let fairyColor = "#ffb7fa";
        let wingColor = "#e0f8ff";
        let dressColor = "#fff";
        let hairColor = "#f9e06c";
        let sparkleColor = "#fff";
        if (this.enemyType === "zigzag") {
            fairyColor = "#b7e3ff";
            wingColor = "#e0f8ff";
            dressColor = "#d0f7ff";
            hairColor = "#b6e0ff";
        } else if (this.enemyType === "fast") {
            fairyColor = "#caffb7";
            wingColor = "#f7ffe0";
            dressColor = "#eaffd0";
            hairColor = "#f6ffb7";
        } else if (this.enemyType === "tank") {
            fairyColor = "#e2b7ff";
            wingColor = "#f0e0ff";
            dressColor = "#f3e0ff";
            hairColor = "#d7b7ff";
        }

        // Wings (behind body)
        ctx.save();
        ctx.globalAlpha = 0.54;
        ctx.shadowColor = wingColor;
        ctx.shadowBlur = 18;
        // Left wing
        ctx.save();
        ctx.rotate(-0.28 + Math.sin(performance.now() * 0.002 + this.x) * 0.07);
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.bezierCurveTo(-38, -28, -14, -34, -4, -2);
        ctx.bezierCurveTo(-18, 8, -32, 18, -14, 18);
        ctx.closePath();
        ctx.fillStyle = wingColor;
        ctx.fill();
        ctx.restore();
        // Right wing
        ctx.save();
        ctx.rotate(0.28 + Math.sin(performance.now() * 0.002 + this.x + 1) * 0.07);
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.bezierCurveTo(38, -28, 14, -34, 4, -2);
        ctx.bezierCurveTo(18, 8, 32, 18, 14, 18);
        ctx.closePath();
        ctx.fillStyle = wingColor;
        ctx.fill();
        ctx.restore();
        ctx.restore();

        // Body
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 8, 10, 18, 0, 0, 2 * Math.PI);
        let bodyGrad = ctx.createLinearGradient(0, -10, 0, 26);
        bodyGrad.addColorStop(0, fairyColor);
        bodyGrad.addColorStop(1, dressColor);
        ctx.fillStyle = bodyGrad;
        ctx.shadowColor = fairyColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Dress frill
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 24, 10, 5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = dressColor;
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();

        // Head
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, -10, 8, 8.5, 0, 0, 2 * Math.PI);
        let headGrad = ctx.createRadialGradient(0, -12, 2, 0, -10, 9);
        headGrad.addColorStop(0, "#fffbe0");
        headGrad.addColorStop(0.6, fairyColor);
        headGrad.addColorStop(1, "#fff");
        ctx.fillStyle = headGrad;
        ctx.shadowColor = fairyColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Hair
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, -14, 7, 5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = hairColor;
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 2;
        ctx.fill();
        ctx.restore();

        // Eyes
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(-2.5, -10, 1.2, 1.7, 0, 0, 2 * Math.PI);
        ctx.ellipse(2.5, -10, 1.2, 1.7, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "#222";
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();

        // Smile
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, -7.5, 2.2, Math.PI * 0.18, Math.PI * 0.82, false);
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = "#b77";
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.restore();

        // Arms
        ctx.save();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = fairyColor;
        ctx.globalAlpha = 0.82;
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.lineTo(-16, 12 + Math.sin(performance.now() * 0.002 + this.x) * 2);
        ctx.moveTo(7, 2);
        ctx.lineTo(16, 12 + Math.cos(performance.now() * 0.002 + this.x) * 2);
        ctx.stroke();
        ctx.restore();

        // Wand (right hand)
        ctx.save();
        ctx.rotate(0.18);
        ctx.beginPath();
        ctx.moveTo(16, 12);
        ctx.lineTo(23, 18);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ffe066";
        ctx.shadowColor = "#ffe066";
        ctx.shadowBlur = 4;
        ctx.stroke();
        // Wand star
        ctx.save();
        ctx.translate(23, 18);
        ctx.rotate(performance.now() * 0.004 % (Math.PI * 2));
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < 5; ++i) {
            ctx.save();
            ctx.rotate((Math.PI * 2 / 5) * i);
            ctx.beginPath();
            ctx.moveTo(0, -2.5);
            ctx.lineTo(0.8, -0.8);
            ctx.lineTo(-0.8, -0.8);
            ctx.closePath();
            ctx.fillStyle = "#fffbe0";
            ctx.shadowColor = "#ffe066";
            ctx.shadowBlur = 2;
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
        ctx.restore();

        // Legs
        ctx.save();
        ctx.lineWidth = 2.1;
        ctx.strokeStyle = fairyColor;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(-3, 23);
        ctx.lineTo(-5, 32 + Math.sin(performance.now() * 0.003 + this.x) * 2);
        ctx.moveTo(3, 23);
        ctx.lineTo(5, 32 + Math.cos(performance.now() * 0.003 + this.x) * 2);
        ctx.stroke();
        ctx.restore();

        // Sparkles around fairy
        for (let i = 0; i < 5; ++i) {
            ctx.save();
            let angle = (performance.now() * 0.0008 + i * 1.25) % (Math.PI * 2);
            let r = 24 + Math.sin(performance.now() * 0.0012 + i) * 2;
            let sx = Math.cos(angle) * r;
            let sy = Math.sin(angle) * r;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.2 + Math.abs(Math.sin(performance.now() * 0.002 + i)), 0, 2 * Math.PI);
            ctx.fillStyle = sparkleColor;
            ctx.globalAlpha = 0.7 + 0.3 * Math.abs(Math.sin(performance.now() * 0.001 + i));
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
        }

        ctx.restore(); // fairy body

        ctx.restore();
    }

    damage(gameScene) {
        if (this.exploding) return; // Prevent double explosion
        --this.hp;
        if (this.hp <= 0) {
            // Fairy dust explosion!
            this.exploding = true;
            this.explosionTime = 0;
            this.alive = true; // Keep alive for explosion animation
            // Generate fairy dust particles
            let colors;
            if (this.enemyType === "zigzag") {
                colors = ["#b7e3ff", "#e0f8ff", "#d0f7ff", "#b6e0ff", "#fff"];
            } else if (this.enemyType === "fast") {
                colors = ["#caffb7", "#f7ffe0", "#eaffd0", "#f6ffb7", "#fff"];
            } else if (this.enemyType === "tank") {
                colors = ["#e2b7ff", "#f0e0ff", "#f3e0ff", "#d7b7ff", "#fff"];
            } else {
                colors = ["#ffb7fa", "#e0f8ff", "#fff", "#f9e06c"];
            }
            const particleCount = 24 + Math.floor(Math.random() * 10);
            this.explosionParticles = [];
            for (let i = 0; i < particleCount; ++i) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 80 + Math.random() * 120;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const size = 2.5 + Math.random() * 3.5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.explosionParticles.push({
                    x: 0,
                    y: 0,
                    vx: vx,
                    vy: vy,
                    size: size,
                    color: color,
                    life: 0.5 + Math.random() * 0.5,
                    alpha: 0.85 + Math.random() * 0.25
                });
            }
            // Play explosion sound
            if (gameScene.audio) gameScene.audio.playExplosion();
            // Add score and call onEnemyDestroyed
            gameScene.player.score += this.scoreValue;
            gameScene.onEnemyDestroyed(this);
            // Remove from entity manager after animation (handled in update)
        }
    }
}
window.Enemy = Enemy;