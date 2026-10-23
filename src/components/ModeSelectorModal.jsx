import React from 'react';
import { GAME_MODES } from '../utils/deckManager';

export default function ModeSelectorModal({ isOpen, onClose, currentMode, onSelectMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-amber-400">
            🧃 Modo de Juego
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
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
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl mt-0.5">{mode.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100">
                      {mode.name}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${mode.badgeColor}`}>
                      {mode.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
