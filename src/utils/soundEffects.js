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

  // Sonido cómico de gallina y cobro de castigo ("¡Arrugó!")
  playChickenPenalty() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([120, 60, 120, 60, 250]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const clucks = [
        { fStart: 700, fEnd: 420, time: 0, duration: 0.1 },
        { fStart: 750, fEnd: 400, time: 0.12, duration: 0.1 },
        { fStart: 820, fEnd: 320, time: 0.25, duration: 0.22 },
      ];

      clucks.forEach((c) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(c.fStart, now + c.time);
        osc.frequency.exponentialRampToValueAtTime(c.fEnd, now + c.time + c.duration);

        const targetGain = 0.28 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + c.time);
        osc.stop(now + c.time + c.duration);
      });
    } catch (e) {
      console.warn('Audio playChickenPenalty error:', e);
    }
  }

  // =========================================================
  // SONIDOS PARA CARRERA DE CABALLOS (TURF CLUB)
  // =========================================================

  // 1. Campana de largada de hipódromo ("¡Ding-ding-ding! ¡Partieron!")
  playRaceBell() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([70, 50, 70, 50, 160]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const chimes = [
        { f: 1800, time: 0, duration: 0.22 },
        { f: 1800, time: 0.12, duration: 0.22 },
        { f: 2200, time: 0.25, duration: 0.55 },
      ];

      chimes.forEach((c) => {
        // Tono principal
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.f, now + c.time);

        // Armónico metálico brillante
        const overtone = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(c.f * 1.58, now + c.time);

        const targetGain = 0.3 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.duration);

        overtoneGain.gain.setValueAtTime(targetGain * 0.4, now + c.time);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.duration * 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        overtone.connect(overtoneGain);
        overtoneGain.connect(this.ctx.destination);

        osc.start(now + c.time);
        osc.stop(now + c.time + c.duration);
        overtone.start(now + c.time);
        overtone.stop(now + c.time + c.duration);
      });
    } catch (e) {
      console.warn('Audio playRaceBell error:', e);
    }
  }

  // 2. Cascos de galope de caballo ("clop-clop" rítmico percusivo)
  playHorseGallop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const beats = [
        { fStart: 240, fEnd: 80, time: 0, duration: 0.045 },
        { fStart: 310, fEnd: 95, time: 0.065, duration: 0.05 },
      ];

      beats.forEach((b) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(b.fStart, now + b.time);
        osc.frequency.exponentialRampToValueAtTime(b.fEnd, now + b.time + b.duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now + b.time);

        const targetGain = 0.25 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + b.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + b.time + b.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + b.time);
        osc.stop(now + b.time + b.duration);
      });
    } catch (e) {
      console.warn('Audio playHorseGallop error:', e);
    }
  }

  // 3. Tropezón dramático en valla (impacto sordo + relincho cómico deslizante)
  playHurdleStumble() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([60, 40, 180]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;

      // Componente 1: Golpe de impacto con la valla
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

      const targetThudGain = 0.4 * this.volume;
      thudGain.gain.setValueAtTime(targetThudGain, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.18);

      // Componente 2: Descenso cómico de relincho / tropiezo
      const slideOsc = this.ctx.createOscillator();
      const slideGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      slideOsc.type = 'sawtooth';
      slideOsc.frequency.setValueAtTime(750, now + 0.05);
      slideOsc.frequency.linearRampToValueAtTime(950, now + 0.15);
      slideOsc.frequency.exponentialRampToValueAtTime(220, now + 0.45);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now + 0.05);
      filter.Q.setValueAtTime(2.5, now + 0.05);

      const targetSlideGain = 0.28 * this.volume;
      slideGain.gain.setValueAtTime(targetSlideGain, now + 0.05);
      slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      slideOsc.connect(filter);
      filter.connect(slideGain);
      slideGain.connect(this.ctx.destination);

      slideOsc.start(now + 0.05);
      slideOsc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio playHurdleStumble error:', e);
    }
  }

  // 4. Clarín triunfal de turf / Fanfarria de victoria de hipódromo ("Call to the Post")
  playRaceVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([100, 50, 100, 50, 300]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      // Melodía clásica de clarín de hipódromo (notas de corneta C-E-G)
      const notes = [
        { f: 392.00, time: 0, dur: 0.12 },     // G4
        { f: 523.25, time: 0.12, dur: 0.12 },  // C5
        { f: 659.25, time: 0.24, dur: 0.12 },  // E5
        { f: 783.99, time: 0.36, dur: 0.18 },  // G5
        { f: 659.25, time: 0.54, dur: 0.12 },  // E5
        { f: 783.99, time: 0.66, dur: 0.35 },  // G5 (sostenida triunfal)
      ];

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now + n.time);

        const targetGain = 0.26 * this.volume;
        gain.gain.setValueAtTime(0.01, now + n.time);
        gain.gain.linearRampToValueAtTime(targetGain, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {
      console.warn('Audio playRaceVictory error:', e);
    }
  }

  // =====================================================================
  // SONIDOS PARA: JUEGO DE LAS APUESTAS (MAYOR O MENOR / CASINO SPEAKEASY)
  // =====================================================================

  // 1. Tintineo realista de fichas de casino al acertar y regalar sorbos
  playCasinoChips() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(30);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const chipClicks = [
        { f: 2200, time: 0, dur: 0.035, gain: 0.22 },
        { f: 3100, time: 0.035, dur: 0.03, gain: 0.26 },
        { f: 2600, time: 0.07, dur: 0.04, gain: 0.28 },
      ];

      chipClicks.forEach((chip) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(chip.f, now + chip.time);
        osc.frequency.exponentialRampToValueAtTime(chip.f * 0.7, now + chip.time + chip.dur);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now + chip.time);

        const targetGain = chip.gain * this.volume;
        gain.gain.setValueAtTime(targetGain, now + chip.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + chip.time + chip.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + chip.time);
        osc.stop(now + chip.time + chip.dur);
      });
    } catch (e) {
      console.warn('Audio playCasinoChips error:', e);
    }
  }

  // 2. Chicharra / Buzzer disonante de casino con impacto en Rojo Carmesí al equivocarse
  playCrimsonFail() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([80, 50, 220]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;

      // Componente A: Golpe sordo de impacto sub-bass
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(130, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.25);

      const targetSubGain = 0.4 * this.volume;
      subGain.gain.setValueAtTime(targetSubGain, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.25);

      // Componente B: Buzzer disonante de casino (Tritono descendente Eb4 / A3)
      const freqs = [311.13, 220.00];
      freqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + 0.05);
        osc.frequency.linearRampToValueAtTime(f * 0.72, now + 0.45);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now + 0.05);

        const targetGain = 0.25 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + 0.05);
        osc.stop(now + 0.45);
      });
    } catch (e) {
      console.warn('Audio playCrimsonFail error:', e);
    }
  }

  // 3. Bloqueo de escudo / Click de alivio al plantarse y pasar el pozo caliente
  playPassShield() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 30, 80]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const notes = [
        { f: 392.00, time: 0, dur: 0.08 },    // G4
        { f: 523.25, time: 0.07, dur: 0.1 },  // C5
        { f: 659.25, time: 0.15, dur: 0.25 }, // E5
      ];

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.time);
        osc.frequency.exponentialRampToValueAtTime(n.f * 1.03, now + n.time + n.dur);

        const targetGain = 0.24 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {
      console.warn('Audio playPassShield error:', e);
    }
  }

  // 4. Fanfarria arpegiada triunfal de Jackpot para Carta Gemela (~6% probabilidad)
  playJackpotFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([100, 50, 100, 50, 250]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const arpeggio = [
        { f: 523.25, time: 0, dur: 0.1 },      // C5
        { f: 659.25, time: 0.08, dur: 0.1 },   // E5
        { f: 783.99, time: 0.16, dur: 0.1 },   // G5
        { f: 1046.50, time: 0.24, dur: 0.12 }, // C6
        { f: 1318.51, time: 0.34, dur: 0.15 }, // E6
        { f: 1567.98, time: 0.46, dur: 0.45 }, // G6
      ];

      arpeggio.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.time);

        const targetGain = 0.28 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {
      console.warn('Audio playJackpotFanfare error:', e);
    }
  }

  // 5. Pulso sub-bass de alta tensión cuando el pozo acumula 4 o más sorbos
  playHighStakesTension() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);

      const targetGain = 0.24 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Audio playHighStakesTension error:', e);
    }
  }

  // =====================================================================
  // SONIDOS PARA: TRIVIA BOMBA (PAPA CALIENTE / CONTRARRELOJ)
  // =====================================================================

  // 1. Gran Detonación Estruendosa de la Bomba (Sub-Bass + Explosión de Ruido Blanco)
  playBombBlast() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([150, 70, 300, 80, 500]);
        } catch (_) {}
      }

      const now = this.ctx.currentTime;

      // Componente A: Golpe masivo de Sub-Bass (160Hz -> 25Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.8);

      const targetSubGain = 0.55 * this.volume;
      subGain.gain.setValueAtTime(targetSubGain, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.85);

      // Componente B: Onda expansiva de ruido blanco (fuego y escombros)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.7);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(2400, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(120, now + 0.7);

      const noiseGain = this.ctx.createGain();
      const targetNoiseGain = 0.45 * this.volume;
      noiseGain.gain.setValueAtTime(targetNoiseGain, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.7);

      // Componente C: Descenso metálico de metralla
      const clangOsc = this.ctx.createOscillator();
      const clangGain = this.ctx.createGain();
      clangOsc.type = 'sawtooth';
      clangOsc.frequency.setValueAtTime(380, now);
      clangOsc.frequency.exponentialRampToValueAtTime(65, now + 0.5);

      const targetClangGain = 0.3 * this.volume;
      clangGain.gain.setValueAtTime(targetClangGain, now);
      clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      clangOsc.connect(clangGain);
      clangGain.connect(this.ctx.destination);
      clangOsc.start(now);
      clangOsc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio playBombBlast error:', e);
    }
  }

  // 2. Tic-Tac Progresivo según el Nivel de Tensión Invisible
  playBombTensionTick(tensionLevel = 'calm') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (tensionLevel === 'critical') {
        // Taquicardia crítica: doble tick urgente con microvibración
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(25); } catch (_) {}
        }

        [0, 0.12].forEach((offset) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1250, now + offset);
          osc.frequency.exponentialRampToValueAtTime(450, now + offset + 0.04);

          const targetGain = 0.35 * this.volume;
          gain.gain.setValueAtTime(targetGain, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.045);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.045);
        });
      } else if (tensionLevel === 'high') {
        // Alerta alta: tono agudo acelerado
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

        const targetGain = 0.28 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (tensionLevel === 'medium') {
        // Tensión moderada: tick metálico de reloj
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(780, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

        const targetGain = 0.22 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } else {
        // Tensión calma: tick sutil y mecánico
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

        const targetGain = 0.16 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      console.warn('Audio playBombTensionTick error:', e);
    }
  }

  // 3. Chisporroteo de la mecha encendida (Gunpowder Sizzle)
  playFuseSizzle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const crackles = [
        { f: 3400, time: 0, dur: 0.025 },
        { f: 4200, time: 0.03, dur: 0.02 },
        { f: 2900, time: 0.055, dur: 0.03 },
      ];

      crackles.forEach((c) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(c.f, now + c.time);
        osc.frequency.exponentialRampToValueAtTime(c.f * 0.6, now + c.time + c.dur);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000, now + c.time);

        const targetGain = 0.2 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + c.time);
        osc.stop(now + c.time + c.dur);
      });
    } catch (e) {
      console.warn('Audio playFuseSizzle error:', e);
    }
  }

  // 4. Campanilla triunfal de Pase de Teléfono al acertar
  playBombPass() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(35); } catch (_) {}
      }

      const now = this.ctx.currentTime;
      const notes = [
        { f: 783.99, time: 0, dur: 0.08 },    // G5
        { f: 1046.50, time: 0.08, dur: 0.2 }, // C6
      ];

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.time);

        const targetGain = 0.26 * this.volume;
        gain.gain.setValueAtTime(targetGain, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {
      console.warn('Audio playBombPass error:', e);
    }
  }
}

export const soundManager = new SoundManager();
