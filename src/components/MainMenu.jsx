import React from 'react';
import { GAME_MODES } from '../utils/deckManager';
import { getAnimalAvatar } from '../utils/animalAvatars';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

export default function MainMenu({
  players,
  currentMode,
  onPlay,
  onOptions,
  onChangePlayers,
  onOpenRules,
  onOpenModeSelector,
}) {
  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-screen py-8 animate-in fade-in duration-200">
      {/* Sección Superior: Branding Hero */}
      <div className="text-center pt-2">
        <div className="relative inline-flex items-center justify-center my-2">
          {/* Capas de Iluminación Destacada (Glow cálido y vibrante) */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-amber-600/45 via-orange-500/40 to-yellow-500/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/35 to-orange-600/30 rounded-full blur-xl" />
          <div className="absolute inset-2 bg-amber-400/25 rounded-full blur-md" />
          
          <img
            src={logoImg}
            alt="Dando Jugo Logo"
            className="w-36 h-36 sm:w-44 sm:h-44 mx-auto object-contain drop-shadow-[0_12px_28px_rgba(245,158,11,0.45)] relative z-10 transform hover:scale-105 transition-transform"
          />
        </div>

        {/* Pill del Modo de Juego */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={onOpenModeSelector}
            className={`text-xs px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 shadow-md active:scale-95 transition ${activeModeObj.badgeColor}`}
          >
            <span>{activeModeObj.icon}</span>
            <span className="font-bold">{activeModeObj.name}</span>
            <span className="text-[10px] underline ml-1 text-slate-400">cambiar</span>
          </button>
        </div>
      </div>

      {/* Sección Central: Resumen de Jugadores Listos */}
      <div className="my-6 p-4 rounded-3xl bg-[#161214]/90 border border-amber-900/40 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-amber-200/70">
            👥 Jugadores en Mesa ({players.length})
          </span>
          <button
            onClick={onChangePlayers}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
          >
            Editar
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {players.map((p) => {
            const animalObj = getAnimalAvatar(p.animal);
            return (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 bg-[#0f0c0e] border border-stone-800 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-200 shadow-sm"
              >
                <img
                  src={animalObj.image}
                  alt={animalObj.name}
                  className="w-5 h-5 object-contain rounded-md drop-shadow"
                />
                <span>{p.name}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Sección Inferior: Botones Principales del Menú */}
      <div className="flex flex-col gap-3">
        {/* 1. Jugar */}
        <button
          onClick={onPlay}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-98 text-stone-950 rounded-2xl font-black text-xl shadow-xl shadow-amber-500/25 border border-amber-300 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <span>🎯</span>
          <span>¡JUGAR!</span>
        </button>

        {/* 2. Opciones */}
        <button
          onClick={onOptions}
          className="w-full py-3.5 px-6 bg-[#1a1417] hover:bg-[#251d21] active:scale-98 text-amber-100 border border-amber-900/40 rounded-2xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>⚙️</span>
          <span>Opciones</span>
        </button>

        {/* 3. Cambiar Jugadores */}
        <button
          onClick={onChangePlayers}
          className="w-full py-3.5 px-6 bg-[#1a1417] hover:bg-[#251d21] active:scale-98 text-amber-100 border border-amber-900/40 rounded-2xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>👥</span>
          <span>Cambiar Jugadores</span>
        </button>

        {/* Botón sutil de reglas */}
        <button
          onClick={onOpenRules}
          className="w-full py-2 text-xs text-stone-500 hover:text-amber-300/80 font-semibold transition"
        >
          ℹ️ Ver Reglas de la Casa
        </button>
      </div>
    </div>
  );
}
