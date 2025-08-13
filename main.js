window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game-canvas");
    const width = canvas.width;
    const height = canvas.height;

    // Audio, Input, State
    const audio = new window.AudioManager();
    const input = new window.InputHandler();
    const stateManager = new window.StateManager();
    stateManager.input = input;
    stateManager.audio = audio;

    // Scenes
    const menuScene = new window.MenuScene(stateManager);
    const gameScene = new window.GameScene(stateManager);
    const gameOverScene = new window.GameOverScene(stateManager);

    stateManager.register("menu", menuScene);
    stateManager.register("game", gameScene);
    stateManager.register("gameover", gameOverScene);

    // Renderer
    const renderer = new window.Renderer(canvas, width, height);

    // Game Loop
    const gameLoop = new window.GameLoop(stateManager, renderer);

    // Start at menu
    stateManager.changeState("menu");

    // Focus canvas for keyboard by default
    setTimeout(() => { canvas.focus(); }, 100);

    // Start main loop
    gameLoop.start();

    // Keyboard shortcuts for quick restart
    window.addEventListener("keydown", e => {
        if (stateManager.currentStateName === "gameover" && (e.code === "Enter" || e.code === "Space")) {
            stateManager.changeState("game");
        }
        if (stateManager.currentStateName === "menu" && (e.code === "Enter" || e.code === "Space")) {
            stateManager.changeState("game");
        }
    });

    // Hide overlay when in gameplay
    function updateUIOverlay() {
        if (stateManager.currentStateName === "game") {
            gameScene.ui.updateHUD(gameScene);
        }
    }
    setInterval(updateUIOverlay, 100);

    window.game = {
        stateManager,
        gameLoop,
        renderer,
        input,
        audio
    };
});