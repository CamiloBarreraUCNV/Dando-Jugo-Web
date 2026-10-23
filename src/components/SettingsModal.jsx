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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#161214] border border-amber-900/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-xl font-black text-amber-400">
              Opciones
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 1. Tema Visual (Modo Oscuro / Claro) */}
          <div className="p-3.5 rounded-2xl bg-[#0c0a0b] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-amber-50 block">
                Tema de Pantalla
              </span>
              <span className="text-xs text-stone-400">
                {isDarkMode ? 'Modo Oscuro (Speakeasy)' : 'Modo Claro'}
              </span>
            </div>

            <button
              onClick={onToggleTheme}
              className="py-1.5 px-3.5 rounded-xl border border-stone-700 bg-[#1c171a] hover:bg-[#251e22] active:scale-95 text-xs font-bold text-amber-200 flex items-center gap-1.5 transition"
            >
              <span>{isDarkMode ? '🌙 Oscuro' : '☀️ Claro'}</span>
            </button>
          </div>

          {/* 2. Volumen General */}
          <div className="p-3.5 rounded-2xl bg-[#0c0a0b] border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-amber-50">
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
          <div className="p-3.5 rounded-2xl bg-[#0c0a0b] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-amber-50 block">
                Sonido de la Ruleta
              </span>
              <span className="text-xs text-stone-400">
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
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {wheelSound ? '✅ Activado' : '❌ Silenciado'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-98 text-stone-950 rounded-xl font-black text-sm uppercase tracking-wide transition shadow-lg border border-amber-300"
        >
          Guardar y Volver
        </button>
      </div>
    </div>
  );
}
