import React from 'react';
import { soundManager } from '../utils/soundEffects';

export default function SettingsModal({
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
  volume,
  onChangeVolume,
  wheelSound,
  onToggleWheelSound,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-xl font-black text-amber-400">
              Opciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 1. Tema Visual (Modo Oscuro / Claro) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-200 block">
                Tema de Pantalla
              </span>
              <span className="text-xs text-slate-400">
                {isDarkMode ? 'Modo Oscuro (Fiesta)' : 'Modo Claro'}
              </span>
            </div>

            <button
              onClick={onToggleTheme}
              className="py-1.5 px-3.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-100 flex items-center gap-1.5 transition"
            >
              <span>{isDarkMode ? '🌙 Oscuro' : '☀️ Claro'}</span>
            </button>
          </div>

          {/* 2. Volumen General */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-200">
                Volumen de Audio
              </span>
              <span className="text-xs font-black text-amber-400">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeVolume(val);
                soundManager.setVolume(val);
                if (val > 0) soundManager.playTick(700);
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* 3. Sonido de la Ruleta (Tick) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-200 block">
                Sonido de la Ruleta
              </span>
              <span className="text-xs text-slate-400">
                Efecto de clics mientras gira
              </span>
            </div>

            <button
              onClick={() => {
                const next = !wheelSound;
                onToggleWheelSound(next);
                soundManager.setWheelSound(next);
                if (next) soundManager.playTick(600);
              }}
              className={`py-1.5 px-3.5 rounded-xl border text-xs font-bold transition ${
                wheelSound
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {wheelSound ? '✅ Activado' : '❌ Silenciado'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 rounded-xl font-black text-sm uppercase tracking-wide transition shadow-lg"
        >
          Guardar y Volver
        </button>
      </div>
    </div>
  );
}
