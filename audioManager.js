class AudioManager {
    constructor() {
        this.ctx = null;
        this.sounds = {};
        this.musicSource = null;
        this.musicPlaying = false;
        // Simple procedural sfx, no external files
        this.sfxEnabled = true;
        this.musicEnabled = false; // Set to true if implementing background music
    }

    ensureContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playShoot() {
        if (!this.sfxEnabled) return;
        this.ensureContext();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.04);
        osc.frequency.linearRampToValueAtTime(500, now + 0.10);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.10);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playExplosion() {
        if (!this.sfxEnabled) return;
        this.ensureContext();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(700, now);
        filter.frequency.linearRampToValueAtTime(130, now + 0.17);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.17);
        whiteNoise.connect(filter).connect(gain).connect(ctx.destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + 0.18);

        // Add a quick sub osc for punch
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.13);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.13, now);
        oscGain.gain.linearRampToValueAtTime(0, now + 0.13);
        osc.connect(oscGain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playPowerUp() {
        if (!this.sfxEnabled) return;
        this.ensureContext();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.13);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }
}

window.AudioManager = AudioManager;