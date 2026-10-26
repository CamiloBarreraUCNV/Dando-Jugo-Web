// Administrador de Screen Wake Lock API para mantener la pantalla encendida durante el juego
class WakeLockManager {
  constructor() {
    this.wakeLock = null;
    this.isEnabled = true;
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      // Re-adquirir el bloqueo de pantalla automáticamente cuando el usuario vuelve a la pestaña
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isEnabled) {
          this.request();
        }
      });
    }
  }

  isSupported() {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  async request() {
    if (!this.isSupported() || !this.isEnabled) return false;
    if (this.wakeLock && !this.wakeLock.released) return true;

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.notify();
      });
      this.notify();
      return true;
    } catch (err) {
      console.warn('Wake Lock no pudo ser adquirido:', err);
      return false;
    }
  }

  async release() {
    if (this.wakeLock && !this.wakeLock.released) {
      try {
        await this.wakeLock.release();
      } catch (err) {
        console.warn('Error al liberar Wake Lock:', err);
      }
      this.wakeLock = null;
      this.notify();
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.request();
    } else {
      this.release();
    }
  }

  isActive() {
    return !!(this.wakeLock && !this.wakeLock.released);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.isActive());
    }
  }
}

export const wakeLockManager = new WakeLockManager();
