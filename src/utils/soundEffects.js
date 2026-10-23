// Motor de Efectos de Sonido usando Web Audio API con control de volumen y canales

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 1.0; // 0.0 a 1.0
    this.wheelSoundEnabled = true; // Silenciar solo el tick de la ruleta si el usuario lo desea
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  setWheelSound(enabled) {
    this.wheelSoundEnabled = enabled;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Sonido de "Tick" mecánico de la ruleta
  playTick(frequency = 600) {
    if (this.isMuted || !this.wheelSoundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      const targetGain = 0.3 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio playTick error:', e);
    }
  }

  // Sonido de fanfarria / victoria cuando la ruleta se detiene
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, time: 0 },
      { f: 659.25, time: 0.1 },
      { f: 783.99, time: 0.2 },
      { f: 1046.50, time: 0.35 },
    ];

    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + note.time);

      const targetGain = 0.25 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.time + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + note.time);
      osc.stop(this.ctx.currentTime + note.time + 0.3);
    });
  }

  // Sonido de éxito al cumplir un reto o acertar trivia
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

    const targetGain = 0.25 * this.volume;
    gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Sonido sutil al saltar el reto
  playSkip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);

    const targetGain = 0.15 * this.volume;
    gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Sonido de fallo / respuesta incorrecta (Buzzer de concurso)
  playFail() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [
        { f1: 220, f2: 170, time: 0, duration: 0.18 },
        { f1: 170, f2: 120, time: 0.2, duration: 0.3 },
      ];

      notes.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.f1, this.ctx.currentTime + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.f2, this.ctx.currentTime + note.time + note.duration);

        // Filtro pasa-bajos para redondear el tono y evitar estridencias
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, this.ctx.currentTime + note.time);

        const targetGain = 0.22 * this.volume;
        gain.gain.setValueAtTime(targetGain, this.ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.time + note.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + note.time);
        osc.stop(this.ctx.currentTime + note.time + note.duration);
      });
    } catch (e) {
      console.warn('Audio playFail error:', e);
    }
  }
}

export const soundManager = new SoundManager();
