import React from 'react';
import { GAME_MODES } from '../utils/deckManager';

export default function ModeSelectorModal({ isOpen, onClose, currentMode, onSelectMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-[#161214] border border-amber-900/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧃</span>
            <h3 className="text-xl font-black text-amber-400">
              Modo de Juego
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-800/60 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white text-base font-bold transition"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-400 mb-4">
          Ajusta la intensidad de los sorbos y retos según el ritmo de la junta:
        </p>

        <div className="space-y-3">
          {GAME_MODES.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                    : 'bg-[#0c0a0b] border-stone-800 hover:bg-[#1a1417] hover:border-amber-700/50'
                }`}
              >
                <span className="text-2xl mt-0.5">{mode.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">
                      {mode.name}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${mode.badgeColor}`}>
                      {mode.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-snug">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#1a1417] hover:bg-[#251d21] text-amber-100 border border-amber-900/40 rounded-xl font-bold text-sm transition active:scale-98"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
