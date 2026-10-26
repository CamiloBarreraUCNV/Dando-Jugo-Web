import React from 'react';
import { GAME_TYPES } from '../utils/deckManager';
import { soundManager } from '../utils/soundEffects';
import { getAnimalAvatar } from '../utils/animalAvatars';

export default function FreePlaySelector({ onSelectGameType, activePlayer }) {
  const handleSelect = (id) => {
    soundManager.playTick(750);
    onSelectGameType(id);
  };

  const avatar = activePlayer ? getAnimalAvatar(activePlayer.animal) : null;

  return (
    <div className="w-full max-w-md md:max-w-4xl mx-auto flex-1 min-h-0 flex flex-col py-1 animate-in fade-in duration-200">
      {/* Banner de Turno Activo y Modo */}
      {activePlayer ? (
        <div className="w-full bg-[#161214]/90 border border-amber-900/50 rounded-2xl p-2.5 sm:p-3 mb-2.5 shrink-0 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-xl bg-[#0c0a0b] p-0.5 border-2 border-amber-400/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">
                {activePlayer.gender === 'mujer' ? '👩' : activePlayer.gender === 'hombre' ? '👨' : '🧑'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400/90">
                  Turno de
                </span>
                <span className="text-base sm:text-lg font-display font-black text-amber-300 truncate">
                  {activePlayer.name}
                </span>
              </div>
              <p className="text-xs text-stone-300 truncate">
                {avatar.name} • <span className="text-stone-400 italic">"{avatar.phrase}"</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right hidden sm:block">
            <span className="text-xs sm:text-sm font-display font-black text-amber-400 tracking-wide block">
              🎴 A LA CARTA
            </span>
            <span className="text-[10px] text-stone-400 font-medium">
              Elige qué dinámica jugar
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center mb-2 shrink-0">
          <h3 className="text-lg md:text-xl font-display font-black text-amber-400 tracking-wide uppercase">
            🎴 Modo a la Carta
          </h3>
          <p className="text-xs md:text-sm text-stone-400">
            Elige la dinámica que quieres jugar en tu turno:
          </p>
        </div>
      )}

      {/* Grid adaptativo: 1 columna en móvil, 2 columnas en tablet/desktop */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-2 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 content-start">
        {GAME_TYPES.map((game) => {
          const isRandom = game.id === 'random';

          if (isRandom) {
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleSelect(game.id)}
                className="w-full md:col-span-2 text-left p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400/60 hover:border-amber-300 bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-amber-950/70 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-amber-950/30 group relative overflow-hidden"
              >
                {/* Efecto de iluminación en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="text-3xl sm:text-4xl p-2.5 bg-amber-500/15 rounded-2xl border border-amber-400/50 shrink-0 shadow-inner text-amber-300 flex items-center justify-center">
                    🎲
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-base sm:text-lg text-amber-300 tracking-wide">
                          {game.name}
                        </h4>
                        <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30">
                          Comodín
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 shrink-0 shadow-sm">
                        {game.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                      {game.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => handleSelect(game.id)}
              className={`w-full h-full text-left p-3 sm:p-3.5 rounded-2xl border ${game.borderColor} bg-gradient-to-br ${game.color} hover:brightness-110 active:scale-[0.98] transition-all shadow-md group relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Efecto de iluminación en hover */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start gap-3 relative z-10 w-full">
                <span className="text-2xl sm:text-3xl p-2 sm:p-2.5 bg-black/50 rounded-xl border border-white/10 shrink-0 shadow-inner">
                  {game.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display font-black text-sm sm:text-base text-white tracking-wide leading-tight">
                      {game.name}
                    </h4>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/70 text-amber-300 border border-amber-400/30 shrink-0 shadow-sm whitespace-nowrap self-start mt-0.5">
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-normal">
                    {game.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
