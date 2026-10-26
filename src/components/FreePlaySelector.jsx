import React from 'react';
import { GAME_TYPES } from '../utils/deckManager';
import { soundManager } from '../utils/soundEffects';

export default function FreePlaySelector({ onSelectGameType }) {
  const handleSelect = (id) => {
    soundManager.playTick(750);
    onSelectGameType(id);
  };

  return (
    <div className="w-full max-w-md md:max-w-4xl mx-auto flex-1 min-h-0 flex flex-col py-1 animate-in fade-in duration-200">
      <div className="text-center mb-2 shrink-0">
        <h3 className="text-lg md:text-xl font-black text-amber-400 tracking-wide uppercase">
          🎴 Modo a la Carta
        </h3>
        <p className="text-xs md:text-sm text-stone-400">
          Elige la dinámica que quieres jugar en tu turno:
        </p>
      </div>

      {/* Grid adaptativo: 1 columna en móvil, 2 columnas en tablet/desktop */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3 content-start">
        {GAME_TYPES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => handleSelect(game.id)}
            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border ${game.borderColor} bg-gradient-to-r ${game.color} bg-opacity-25 hover:brightness-110 active:scale-98 transition-all shadow-lg group relative overflow-hidden`}
          >
            {/* Efecto de iluminación en hover */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3.5 relative z-10">
              <span className="text-3xl sm:text-4xl p-2.5 bg-black/45 rounded-2xl border border-white/10 shrink-0 shadow-inner">
                {game.icon}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <h4 className="font-black text-base sm:text-lg text-white tracking-wide">
                    {game.name}
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/30 shrink-0 shadow-sm">
                    {game.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
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
