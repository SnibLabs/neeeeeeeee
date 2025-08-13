class InputHandler {
    constructor() {
        this.pressed = {};
        this.justPressed = {};
        this.justReleased = {};
        this.lastFrame = {};
        this._setupListeners();
    }

    _setupListeners() {
        window.addEventListener('keydown', e => {
            if (!e.repeat) {
                this.pressed[e.code] = true;
                this.justPressed[e.code] = true;
            }
        });
        window.addEventListener('keyup', e => {
            this.pressed[e.code] = false;
            this.justReleased[e.code] = true;
        });
        // For mouse/focus support
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.tabIndex = 0;
            canvas.addEventListener('mousedown', () => canvas.focus());
        }
    }

    preUpdate() {
        // Reset justPressed/justReleased each frame
        this.justPressed = {};
        this.justReleased = {};
    }

    isDown(code) {
        return !!this.pressed[code];
    }

    wasPressed(code) {
        return !!this.justPressed[code];
    }

    wasReleased(code) {
        return !!this.justReleased[code];
    }
}

window.InputHandler = InputHandler;