class GameScene {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.width = 800;
        this.height = 600;
        this.entityManager = new window.EntityManager();
        this.player = null;
        this.input = null;
        this.audio = null;
        this.ui = new window.UIManager();
        this.wave = 0;
        this.waveTimer = 2.2;
        this.waveInProgress = false;
        this.enemiesToSpawn = 0;
        this.spawnInterval = 0.3;
        this.timeSinceLastSpawn = 0;
        this.difficulty = 1;
        this._gameOver = false;
    }

    enter() {
        this.entityManager.clearAll();
        this.player = new window.Player(this.width / 2, this.height - 70);
        this.input = this.stateManager.input;
        this.audio = this.stateManager.audio;
        this.ui = new window.UIManager();
        this.wave = 1;
        this.waveTimer = 1.0;
        this.waveInProgress = false;
        this.enemiesToSpawn = 0;
        this.timeSinceLastSpawn = 0;
        this.difficulty = 1;
        this._gameOver = false;
    }

    leave() {
        // Clean up
        this.entityManager.clearAll();
    }

    update(dt) {
        if (!this.player.alive && !this._gameOver) {
            this._gameOver = true;
            setTimeout(() => this.stateManager.changeState("gameover", {score: this.player.score}), 1300);
            return;
        }
        this.input.preUpdate();
        this.player.update(dt, this);

        this.entityManager.update(dt, this);

        // Collisions: Player/projectiles/enemies/powerups
        this.handleCollisions();

        // Wave management
        this.waveLogic(dt);

        // Clean up dead entities
        this.entityManager.entities = this.entityManager.entities.filter(e => e.alive !== false);
    }

    render(ctx) {
        // background handled in renderer.js
        this.player.render(ctx);
        this.entityManager.render(ctx);
    }

    handleCollisions() {
        const em = this.entityManager;
        // Player projectiles vs enemies
        for (const proj of em.getEntitiesByType("projectile").filter(p => p.owner === "player")) {
            for (const enemy of em.getEntitiesByType("enemy")) {
                if (window.CollisionSystem.circleRect(
                    {x: proj.x, y: proj.y, radius: proj.radius},
                    {x: enemy.x - enemy.width / 2, y: enemy.y - enemy.height / 2, width: enemy.width, height: enemy.height}
                )) {
                    enemy.damage(this);
                    em.remove(proj);
                    break;
                }
            }
        }
        // Enemy projectiles vs player
        for (const proj of em.getEntitiesByType("projectile").filter(p => p.owner === "enemy")) {
            if (!this.player.alive) continue;
            if (window.CollisionSystem.circleRect(
                {x: proj.x, y: proj.y, radius: proj.radius},
                {x: this.player.x - this.player.width / 2, y: this.player.y - this.player.height / 2, width: this.player.width, height: this.player.height}
            )) {
                this.player.damage(this);
                em.remove(proj);
            }
        }
        // Enemies vs player
        for (const enemy of em.getEntitiesByType("enemy")) {
            if (!this.player.alive) continue;
            if (window.CollisionSystem.rectRect(
                {x: this.player.x - this.player.width / 2, y: this.player.y - this.player.height / 2, width: this.player.width, height: this.player.height},
                {x: enemy.x - enemy.width / 2, y: enemy.y - enemy.height / 2, width: enemy.width, height: enemy.height}
            )) {
                this.player.damage(this);
                enemy.damage(this);
            }
        }
        // Powerups
        for (const powerup of em.getEntitiesByType("powerup")) {
            if (window.CollisionSystem.circleRect(
                {x: powerup.x, y: powerup.y, radius: powerup.radius},
                {x: this.player.x - this.player.width / 2, y: this.player.y - this.player.height / 2, width: this.player.width, height: this.player.height}
            )) {
                this.player.collectPowerUp(powerup.kind);
                if (this.audio) this.audio.playPowerUp();
                em.remove(powerup);
            }
        }
    }

    waveLogic(dt) {
        // Spawn enemies in waves
        if (!this.waveInProgress) {
            this.waveTimer -= dt;
            if (this.waveTimer <= 0) {
                this.waveInProgress = true;
                this.enemiesToSpawn = Math.min(7 + this.wave * 2, 34);
                this.timeSinceLastSpawn = 0;
                this.spawnInterval = Math.max(0.16, 0.35 - this.wave * 0.014);
            }
        } else {
            if (this.enemiesToSpawn > 0) {
                this.timeSinceLastSpawn += dt;
                if (this.timeSinceLastSpawn >= this.spawnInterval) {
                    this.timeSinceLastSpawn = 0;
                    let et = "basic";
                    let speed = 80 + Math.random() * 40 + this.wave * 2;
                    let hp = 1;
                    let scoreValue = 100 + this.wave * 3;
                    if (this.wave > 3 && Math.random() < 0.33) et = "zigzag";
                    if (this.wave > 6 && Math.random() < 0.20) et = "fast";
                    if (this.wave > 9 && Math.random() < 0.13) et = "tank";
                    if (et === "tank") { speed = 34 + Math.random() * 22 + this.wave; hp = 4 + Math.floor(this.wave / 3); scoreValue = 300 + this.wave * 8; }
                    if (et === "fast") { speed *= 1.45; hp = 1; }
                    const x = Math.max(38, Math.min(this.width - 38, Math.random() * (this.width - 76) + 38));
                    this.entityManager.add(new window.Enemy(x, -42, et, speed, hp, scoreValue));
                    --this.enemiesToSpawn;
                }
            }
            // Check if all enemies are dead to end wave
            if (this.enemiesToSpawn <= 0 && this.entityManager.getEntitiesByType("enemy").length === 0) {
                this.waveInProgress = false;
                this.waveTimer = 1.3 + Math.random() * 1.3;
                this.wave++;
                this.difficulty += 0.22;
                // Occasionally spawn a powerup
                if (Math.random() < 0.63) {
                    let kind = Math.random() < 0.7 ? "spread" : "heal";
                    const x = Math.max(28, Math.min(this.width - 28, Math.random() * (this.width - 56) + 28));
                    this.entityManager.add(new window.PowerUp(x, -22, kind));
                }
            }
        }
    }

    onEnemyDestroyed(enemy) {
        // Could spawn explosion/particles here
    }
}
window.GameScene = GameScene;