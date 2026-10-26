import React from 'react';
import { GAME_TYPES } from '../utils/deckManager';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

export default function CategoryDeckView({
  gameTypeId,
  activePlayer,
  nextPlayer,
  onDrawCard,
  onChangeCategory,
}) {
  const game = GAME_TYPES.find((g) => g.id === gameTypeId) || {
    id: 'random',
    name: 'Al Azar (Sorpresa)',
    icon: '🎲',
    color: 'from-amber-950/60 via-stone-900/90 to-amber-950/60',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    badge: 'Todo el mazo',
    description: 'Saca una tarjeta al azar entre todas las categorías sin girar ruleta.',
  };

  const avatar = getAnimalAvatar(activePlayer?.animal);

  const handleDraw = () => {
    soundManager.playTick(800);
    onDrawCard();
  };

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto flex-1 min-h-0 flex flex-col justify-between py-2 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Barra de la Dinámica Activa con botón para cambiar */}
      <div className="w-full bg-[#161214]/90 border border-amber-900/40 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl sm:text-3xl p-1.5 bg-black/50 rounded-xl border border-white/10 shrink-0">
            {game.icon}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-black text-sm sm:text-base text-white truncate">
                {game.name}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                {game.badge}
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate">
              Modo continuo • Cada turno saca tarjeta de este mazo
            </p>
          </div>
        </div>

        <button
          onClick={onChangeCategory}
          className="shrink-0 text-xs text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition active:scale-95 flex items-center gap-1"
          title="Elegir otra categoría"
        >
          <span>🔄</span>
          <span>Cambiar</span>
        </button>
      </div>

      {/* 2. Tarjeta Central del Jugador en Turno & Mazo Interactivo */}
      <div className="my-auto flex flex-col items-center justify-center gap-5 w-full py-2">
        {/* Jugador en Turno */}
        <div className="w-full bg-[#161214]/95 border-2 border-amber-400/70 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
          
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400/90 block mb-2">
            🏆 ES EL TURNO DE
          </span>

          <div className="flex items-center justify-center gap-3.5 mb-2">
            <img
              src={avatar.image}
              alt={avatar.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl bg-[#0c0a0b] p-1 border-2 border-amber-400 drop-shadow-md"
            />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-black text-amber-400 tracking-wide">
                  {activePlayer.name}
                </span>
                <span className="text-base">
                  {activePlayer.gender === 'mujer' ? '👩' : activePlayer.gender === 'hombre' ? '👨' : '🧑'}
                </span>
              </div>
              <span className="text-xs text-amber-300 font-bold block">
                {avatar.name} • <span className="text-stone-400 italic font-normal">"{avatar.phrase}"</span>
              </span>
            </div>
          </div>

          {nextPlayer && (
            <p className="text-xs text-stone-400 border-t border-stone-800/80 pt-2 mt-2">
              👉 Siguiente en la mesa: <strong className="text-stone-200">{nextPlayer.name}</strong>
            </p>
          )}
        </div>

        {/* 3. Gran Botón Táctil de Sacar Tarjeta */}
        <button
          onClick={handleDraw}
          className={`w-full max-w-sm py-4 sm:py-5 px-6 rounded-3xl font-display font-black text-lg sm:text-xl uppercase tracking-wider shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 border-2 ${game.borderColor} bg-gradient-to-r ${game.color} text-white hover:brightness-110 hover:scale-[1.02] shadow-amber-500/15 group cursor-pointer`}
        >
          <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">
            {game.icon}
          </span>
          <span className="drop-shadow">¡Sacar Tarjeta!</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 border border-white/30 font-sans font-bold">
            {game.name}
          </span>
        </button>

        <p className="text-xs text-stone-400 text-center">
          Pásale el teléfono a <strong className="text-amber-300">{activePlayer.name}</strong> para ver el reto
        </p>
      </div>

      {/* 4. Barra Inferior con cambio rápido */}
      <div className="w-full flex items-center justify-center gap-2 pt-1 shrink-0">
        <button
          onClick={onChangeCategory}
          className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1.5 transition underline font-medium cursor-pointer"
        >
          <span>← Volver al selector de categorías</span>
        </button>
      </div>
    </div>
  );
}
