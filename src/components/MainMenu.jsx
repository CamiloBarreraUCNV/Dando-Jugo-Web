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
      <div className="text-center pt-4">
        <div className="relative inline-block mb-3">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
          <img
            src={logoImg}
            alt="Dando Jugo Logo"
            className="w-28 h-28 mx-auto object-contain drop-shadow-2xl relative z-10 transform hover:scale-105 transition-transform"
          />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 drop-shadow">
          DANDO JUGO
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
          Drinking Game Web
        </p>

        {/* Pill del Modo de Juego */}
        <div className="mt-4 flex justify-center">
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
