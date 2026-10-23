import React from 'react';
import { GAME_TYPES } from '../utils/deckManager';
import { soundManager } from '../utils/soundEffects';

export default function FreePlaySelector({ onSelectGameType }) {
  const handleSelect = (id) => {
    soundManager.playTick(750);
    onSelectGameType(id);
  };

  return (
    <div className="w-full flex-1 flex flex-col py-2 animate-in fade-in duration-200">
      <div className="text-center mb-3">
        <h3 className="text-lg font-black text-amber-400 tracking-wide uppercase">
          🎴 Modo a la Carta
        </h3>
        <p className="text-xs text-stone-400">
          Toca el tipo de dinámica que quieres jugar en este turno:
        </p>
      </div>

      {/* Grid de opciones de juego */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[60vh] pr-0.5 pb-2">
        {GAME_TYPES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => handleSelect(game.id)}
            className={`w-full text-left p-3 rounded-2xl border ${game.borderColor} bg-gradient-to-r ${game.color} bg-opacity-20 hover:brightness-110 active:scale-98 transition-all shadow-md group relative overflow-hidden`}
          >
            {/* Efecto de brillo sutil en hover */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start gap-3 relative z-10">
              <span className="text-3xl p-1 bg-black/40 rounded-xl border border-white/10 shrink-0">
                {game.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="font-black text-sm sm:text-base text-white tracking-wide truncate">
                    {game.name}
                  </h4>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/50 text-amber-300 border border-amber-400/30 shrink-0">
                    {game.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-200/90 leading-snug line-clamp-2">
                  {game.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
