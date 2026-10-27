import React, { useState } from 'react';
import { verdadRetoManager, INTENSITY_LEVELS } from '../utils/verdadRetoData';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

export default function VerdadRetoGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  const [currentLevel, setCurrentLevel] = useState('clasico');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [consecutiveVerdades, setConsecutiveVerdades] = useState(0);
  const [previewCard, setPreviewCard] = useState(null);

  // Jugador activo
  const activePlayer =
    players.length > 0
      ? players[currentPlayerIndex % players.length]
      : { name: 'Jugador 1', gender: 'hombre', animal: 'perro' };
  const nextPlayer =
    players.length > 1
      ? players[(currentPlayerIndex + 1) % players.length]
      : null;
  const avatar = getAnimalAvatar(activePlayer.animal);

  // Nivel de intensidad activo
  const activeLevelObj =
    INTENSITY_LEVELS.find((lvl) => lvl.id === currentLevel) || INTENSITY_LEVELS[0];

  // Selección de Verdad, Reto o Azar
  const handleSelectOption = (tipo) => {
    soundManager.playTick(tipo === 'verdad' ? 700 : tipo === 'reto' ? 450 : 600);

    // Control de racha anti-arrugue (máximo 2 verdades seguidas)
    if (tipo === 'verdad' && consecutiveVerdades >= 2) {
      alert(`⚠️ ¡${activePlayer.name}, ya elegiste Verdad 2 veces seguidas! Por regla de la casa, debes elegir RETO obligatoriamente.`);
      return;
    }

    const card = verdadRetoManager.drawCard(tipo, currentLevel, activePlayer, players);
    setPreviewCard(card);

    if (tipo === 'verdad') {
      setConsecutiveVerdades((prev) => prev + 1);
    } else {
      setConsecutiveVerdades(0);
    }
  };

  // Pasar al siguiente turno
  const handleNextTurn = () => {
    soundManager.playTick(600);
    setPreviewCard(null);
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center px-4 pt-safe pb-safe max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden w-full animate-in fade-in duration-200">
      {/* 1. Header Superior */}
      <header className="w-full flex items-center justify-between py-2 border-b border-stone-800/80 shrink-0 gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-200 font-bold px-3 py-1.5 rounded-xl border border-stone-700/80 transition shadow cursor-pointer"
          title="Volver"
        >
          <span>←</span>
          <span>Volver</span>
        </button>

        <div className="text-center min-w-0">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-lg">🌶️</span>
            <h2 className="font-display font-black text-sm sm:text-base text-amber-400 tracking-wide truncate">
              Verdad o Reto
            </h2>
          </div>
          <span className="text-[10px] text-stone-400 block truncate">
            La Mesa Caliente • {activeLevelObj.name}
          </span>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-sm bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-300 font-bold p-1.5 rounded-xl border border-stone-700/80 transition cursor-pointer"
            title="Ajustes"
          >
            ⚙️
          </button>
        )}
      </header>

      {/* 2. Selector de Intensidad / Filtros */}
      <div className="w-full py-1.5 flex items-center justify-center gap-1.5 shrink-0">
        {INTENSITY_LEVELS.map((lvl) => {
          const isActive = currentLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                soundManager.playTick(750);
                setCurrentLevel(lvl.id);
                setPreviewCard(null);
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 border ${
                isActive
                  ? `${lvl.badgeColor} shadow-md scale-105 font-black ring-1 ring-white/20`
                  : 'bg-[#161214] text-stone-400 border-stone-800/80 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <span>{lvl.icon}</span>
              <span>{lvl.tag}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Banner del Jugador en Turno */}
      <div className="w-full bg-[#161214]/90 border border-amber-900/40 rounded-2xl px-3 py-2 flex items-center justify-between gap-3 shadow-md shrink-0 my-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-10 h-10 object-contain rounded-xl bg-black/60 p-0.5 border border-amber-400/60 drop-shadow shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/80 block">
              ES EL TURNO DE
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm sm:text-base text-white truncate">
                {activePlayer.name}
              </span>
              <span className="text-xs">
                {activePlayer.gender === 'mujer' ? '👩' : activePlayer.gender === 'hombre' ? '👨' : '🧑'}
              </span>
            </div>
          </div>
        </div>

        {nextPlayer && (
          <span className="text-[11px] text-stone-400 shrink-0 text-right">
            Siguiente: <strong className="text-stone-300">{nextPlayer.name}</strong>
          </span>
        )}
      </div>

      {/* 4. Área Central: Los Portales Duales (Verdad vs Reto) */}
      <main className="w-full flex-1 min-h-0 flex flex-col justify-center items-center py-2 overflow-hidden">
        {/* Si no se ha elegido opción, mostrar los 2 portales */}
        {!previewCard ? (
          <div className="w-full max-w-md flex flex-col items-center gap-3 my-auto animate-in fade-in zoom-in-95 duration-200">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider text-center">
              ¿Qué eliges para tu turno, <strong className="text-amber-300">{activePlayer.name}</strong>?
            </span>

            {/* Grid de los 2 Grandes Portales */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Portal de VERDAD (Azul / Cian) */}
              <button
                onClick={() => handleSelectOption('verdad')}
                className="group relative flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-sky-950/70 via-[#101b24] to-cyan-950/80 border-2 border-cyan-500/50 hover:border-cyan-300 active:scale-95 transition-all duration-200 shadow-xl shadow-cyan-950/40 cursor-pointer overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-radial from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-125 transition-transform drop-shadow">
                  😇
                </span>
                <span className="font-display font-black text-lg sm:text-xl text-cyan-300 tracking-wider uppercase drop-shadow">
                  VERDAD
                </span>
                <span className="text-[10px] sm:text-xs text-cyan-200/60 mt-1 leading-snug">
                  Confesión sin filtro
                </span>
              </button>

              {/* Portal de RETO (Rojo / Carmesí) */}
              <button
                onClick={() => handleSelectOption('reto')}
                className="group relative flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-b from-rose-950/70 via-[#221014] to-red-950/80 border-2 border-rose-500/50 hover:border-rose-300 active:scale-95 transition-all duration-200 shadow-xl shadow-rose-950/40 cursor-pointer overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-radial from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-125 transition-transform drop-shadow">
                  😈
                </span>
                <span className="font-display font-black text-lg sm:text-xl text-rose-300 tracking-wider uppercase drop-shadow">
                  RETO
                </span>
                <span className="text-[10px] sm:text-xs text-rose-200/60 mt-1 leading-snug">
                  Desafío o penitencia
                </span>
              </button>
            </div>

            {/* Botón Comodín: Al Azar */}
            <button
              onClick={() => handleSelectOption('azar')}
              className="w-full py-3 px-4 rounded-2xl bg-[#1c161a] hover:bg-[#251d22] active:scale-95 border border-amber-500/40 text-amber-300 font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
            >
              <span className="text-base group-hover:rotate-45 transition-transform">🎲</span>
              <span>¿Indeciso? ¡Dejar al Azar!</span>
            </button>

            {/* Aviso de castigo por arrugar */}
            <div className="text-[11px] text-stone-400 text-center flex items-center gap-1.5 mt-1">
              <span>🐔 Castigo si arrugas:</span>
              <strong className="text-amber-400 font-black">
                {activeLevelObj.penaltySips} sorbos de trago
              </strong>
            </div>
          </div>
        ) : (
          /* Demo Preview de la tarjeta seleccionada (Paso 2) */
          <div className="w-full max-w-sm bg-[#161214] border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl flex flex-col justify-between my-auto animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    previewCard.tipo === 'verdad'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {previewCard.tipo === 'verdad' ? '😇 VERDAD' : '😈 RETO'}
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase">
                  {previewCard.nivelInfo.name}
                </span>
              </div>

              <div className="text-center my-4">
                <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                  "{previewCard.texto}"
                </p>
                {previewCard.targetPlayer && (
                  <span className="text-xs text-amber-300 font-bold mt-2 block">
                    👥 Involucra a: {previewCard.targetPlayer.name}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3 flex flex-col gap-2">
              <div className="text-xs text-stone-400 text-center">
                Castigo por arrugar: <strong className="text-amber-400">{previewCard.castigoSorbos} sorbos</strong>
              </div>
              <button
                onClick={handleNextTurn}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer"
              >
                Pasar al Siguiente Turno →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 5. Footer con información del mazo */}
      <footer className="w-full py-1.5 flex items-center justify-between border-t border-stone-800/80 shrink-0 text-xs text-stone-400">
        <span>Nivel: <strong className="text-stone-200">{activeLevelObj.name}</strong></span>
        <span>🐔 Arrugar: <strong className="text-amber-400">{activeLevelObj.penaltySips} sorbos</strong></span>
      </footer>
    </div>
  );
}
