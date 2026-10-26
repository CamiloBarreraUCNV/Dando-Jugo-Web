import React from 'react';
import { GAME_MODES } from '../utils/deckManager';
import { getAnimalAvatar } from '../utils/animalAvatars';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

export default function MainMenu({
  players,
  currentMode,
  onPlay,
  onFreePlay,
  onOptions,
  onChangePlayers,
  onOpenRules,
  onOpenModeSelector,
}) {
  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-safe pb-safe flex flex-col justify-between min-h-dvh animate-in fade-in duration-200">
      {/* Sección Superior: Branding Hero */}
      <div className="text-center pt-1">
        <div className="relative inline-flex items-center justify-center my-2">
          {/* Capas de Iluminación Destacada (Glow cálido y vibrante) */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-amber-600/45 via-orange-500/40 to-yellow-500/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/35 to-orange-600/30 rounded-full blur-xl" />
          <div className="absolute inset-2 bg-amber-400/25 rounded-full blur-md" />
          
          <img
            src={logoImg}
            alt="Dando Jugo Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto object-contain drop-shadow-[0_12px_28px_rgba(245,158,11,0.45)] relative z-10 transform hover:scale-105 transition-transform"
          />
        </div>

        {/* Pill del Modo de Juego */}
        <div className="mt-2 flex justify-center">
          <button
            onClick={onOpenModeSelector}
            className={`text-xs md:text-sm px-4 py-1.5 rounded-full border flex items-center gap-1.5 shadow-md active:scale-95 transition ${activeModeObj.badgeColor}`}
          >
            <span>{activeModeObj.icon}</span>
            <span className="font-bold">{activeModeObj.name}</span>
            <span className="text-[10px] md:text-xs underline ml-1 text-slate-400">cambiar</span>
          </button>
        </div>
      </div>

      {/* Sección Central: Resumen de Jugadores Listos */}
      <div className="my-4 p-4 md:p-5 rounded-3xl bg-[#161214]/90 border border-amber-900/40 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs md:text-sm font-black uppercase tracking-wider text-amber-200/70">
            👥 Jugadores en Mesa ({players.length})
          </span>
          <button
            onClick={onChangePlayers}
            className="text-xs md:text-sm text-amber-400 hover:text-amber-300 font-bold underline"
          >
            Editar
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
          {players.map((p) => {
            const animalObj = getAnimalAvatar(p.animal);
            return (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 bg-[#0f0c0e] border border-stone-800 px-2.5 py-1.5 rounded-xl text-xs md:text-sm font-bold text-stone-200 shadow-sm"
              >
                <img
                  src={animalObj.image}
                  alt={animalObj.name}
                  className="w-5 h-5 md:w-6 md:h-6 object-contain rounded-md drop-shadow"
                />
                <span>{p.name}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Sección Inferior: Botones Principales del Menú */}
      <div className="flex flex-col gap-2.5 max-w-md md:max-w-xl mx-auto w-full">
        {/* En móvil: 1 columna, en tablet/desktop: 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* 1. Jugar con Ruleta */}
          <button
            onClick={onPlay}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-98 text-stone-950 rounded-2xl font-black text-lg sm:text-xl shadow-xl shadow-amber-500/25 border border-amber-300 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>🎯</span>
            <span>¡Girar Ruleta!</span>
          </button>

          {/* 2. Modo a la Carta */}
          <button
            onClick={onFreePlay}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:brightness-110 active:scale-98 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-purple-900/30 border border-purple-400/40 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>🎴</span>
            <span>A la Carta</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-0.5">
          {/* 3. Opciones */}
          <button
            onClick={onOptions}
            className="w-full py-3 px-4 bg-[#1a1417] hover:bg-[#251d21] active:scale-98 text-amber-100 border border-amber-900/40 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>⚙️</span>
            <span>Opciones</span>
          </button>

          {/* 4. Cambiar Jugadores */}
          <button
            onClick={onChangePlayers}
            className="w-full py-3 px-4 bg-[#1a1417] hover:bg-[#251d21] active:scale-98 text-amber-100 border border-amber-900/40 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>👥</span>
            <span>Jugadores</span>
          </button>
        </div>

        {/* Botón sutil de reglas */}
        <button
          onClick={onOpenRules}
          className="w-full py-1.5 text-xs text-stone-500 hover:text-amber-300/80 font-semibold transition"
        >
          ℹ️ Ver Reglas de la Casa
        </button>
      </div>
    </div>
  );
}
