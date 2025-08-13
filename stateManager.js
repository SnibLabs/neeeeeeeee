class StateManager {
    constructor() {
        this.states = {};
        this.currentState = null;
        this.currentStateName = "";
        this.input = null;
        this.audio = null;
    }

    register(name, state) {
        this.states[name] = state;
    }

    changeState(name, data) {
        if (this.currentState && this.currentState.leave) {
            this.currentState.leave();
        }
        this.currentStateName = name;
        this.currentState = this.states[name];
        if (this.currentState && this.currentState.enter) {
            this.currentState.enter(data);
        }
    }

    update(dt) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(dt);
        }
    }

    render(ctx) {
        if (this.currentState && this.currentState.render) {
            this.currentState.render(ctx);
        }
    }
}
window.StateManager = StateManager;