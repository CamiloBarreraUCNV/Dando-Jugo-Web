// Motor de Efectos de Sonido usando Web Audio API con control de volumen y canales

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 1.0; // 0.0 a 1.0
    this.wheelSoundEnabled = true; // Silenciar solo el tick de la ruleta si el usuario lo desea
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
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

  // Sonido de inicio de cronómetro / cuenta regresiva
  playTimerStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.12); // G5

      const targetGain = 0.25 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {
      console.warn('Audio playTimerStart error:', e);
    }
  }

  // Tick de cronómetro (normal u urgente para los últimos 5 segundos)
  playTimerTick(isUrgent = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'sawtooth' : 'triangle';
      const freq = isUrgent ? 980 : 640;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.04);

      const targetGain = (isUrgent ? 0.32 : 0.18) * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {
      console.warn('Audio playTimerTick error:', e);
    }
  }

  // Chicharra / Buzzer dramático de tiempo agotado
  playTimerBuzzer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([180, 80, 260]);
        } catch (_) {}
      }

      // Dos ráfagas de chicharra de concurso
      const bursts = [0, 0.22];
      bursts.forEach((timeOffset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(175, this.ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(115, this.ctx.currentTime + timeOffset + 0.18);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, this.ctx.currentTime + timeOffset);

        const targetGain = 0.35 * this.volume;
        gain.gain.setValueAtTime(targetGain, this.ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + timeOffset + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + timeOffset);
        osc.stop(this.ctx.currentTime + timeOffset + 0.2);
      });
    } catch (e) {
      console.warn('Audio playTimerBuzzer error:', e);
    }
  }
}

export const soundManager = new SoundManager();
