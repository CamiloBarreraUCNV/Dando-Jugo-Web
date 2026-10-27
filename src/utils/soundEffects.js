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

  // Sonido realista de naipe deslizándose / volteo de carta
  playCardFlip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const targetGain = 0.28 * this.volume;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio playCardFlip error:', e);
    }
  }

  // Sonido de líquido vertiéndose y burbujas al salir un Rey en Cuarto Rey
  playPourDrink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bubbleFreqs = [240, 320, 420, 560, 720];
      bubbleFreqs.forEach((freq, idx) => {
        const timeOffset = idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.45, this.ctx.currentTime + timeOffset + 0.06);

        const targetGain = 0.22 * this.volume;
        gain.gain.setValueAtTime(targetGain, this.ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + timeOffset + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + timeOffset);
        osc.stop(this.ctx.currentTime + timeOffset + 0.07);
      });
    } catch (e) {
      console.warn('Audio playPourDrink error:', e);
    }
  }

  // Clímax dramático del 4to Rey (Alarma, estruendo y fanfarria fatídica)
  playFourthKingClimax() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([250, 100, 250, 100, 500]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;

      // 1. Golpe de bajo profundo / retumbe
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

      const targetSubGain = 0.45 * this.volume;
      subGain.gain.setValueAtTime(targetSubGain, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.6);

      // 2. Acorde dramático y sirena de alerta
      const alertTones = [
        { f: 440, time: 0.1, duration: 0.2 },
        { f: 554.37, time: 0.25, duration: 0.2 },
        { f: 659.25, time: 0.4, duration: 0.25 },
        { f: 880, time: 0.6, duration: 0.5 },
      ];

      alertTones.forEach((tone) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(tone.f, now + tone.time);
        osc.frequency.exponentialRampToValueAtTime(tone.f * 1.05, now + tone.time + tone.duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now + tone.time);

        const targetGain = 0.3 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + tone.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tone.time + tone.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + tone.time);
        osc.stop(now + tone.time + tone.duration);
      });
    } catch (e) {
      console.warn('Audio playFourthKingClimax error:', e);
    }
  }

  // Sonido místico/revelador al destapar una VERDAD
  playTruthReveal() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0 },      // C5
        { f: 659.25, time: 0.08 },   // E5
        { f: 783.99, time: 0.16 },   // G5
        { f: 1046.50, time: 0.24 },  // C6
      ];

      notes.forEach((note) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.f * 1.02, now + note.time + 0.35);

        const targetGain = 0.2 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + 0.4);
      });
    } catch (e) {
      console.warn('Audio playTruthReveal error:', e);
    }
  }

  // Sonido de fuego y tensión al destapar un RETO
  playDareReveal() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Golpe dramático
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.25);
      filter.Q.setValueAtTime(3, now);

      const targetGain = 0.35 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio playDareReveal error:', e);
    }
  }
}

export const soundManager = new SoundManager();
