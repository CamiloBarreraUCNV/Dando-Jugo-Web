import React, { useState, useEffect, useRef } from 'react';
import {
  CaballosRaceManager,
  HORSES,
  DEFAULT_TRACK_LENGTH,
  DEFAULT_HURDLES_COUNT,
} from '../utils/caballosData';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

/**
 * Componente Principal: Carrera de Caballos (Turf Club)
 * Paso 2: Interfaz Visual, 4 Colores Distintos, Casa de Apuestas y Pista de Carreras
 */
export default function CarreraCaballosGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  // Asegurar lista mínima de jugadores para jugar
  const effectivePlayers =
    players && players.length > 0
      ? players
      : [
          { id: '1', name: 'Jugador 1', gender: 'hombre', animal: 'perro' },
          { id: '2', name: 'Jugador 2', gender: 'mujer', animal: 'gato' },
        ];

  // Instancia del motor de carrera
  const [manager] = useState(
    () => new CaballosRaceManager({ trackLength: DEFAULT_TRACK_LENGTH, hurdlesCount: DEFAULT_HURDLES_COUNT })
  );

  // Estados del juego
  const [phase, setPhase] = useState('betting'); // 'betting' | 'racing' | 'finished'
  const [positions, setPositions] = useState({ corazones: 0, diamantes: 0, treboles: 0, picas: 0 });
  const [hurdles, setHurdles] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const [autoRun, setAutoRun] = useState(false);
  const [autoRunSpeed, setAutoRunSpeed] = useState(1300); // ms entre cartas
  const autoRunTimerRef = useRef(null);

  // Apuestas en borrador durante la fase de apuestas
  // { [playerId]: { horseId: 'corazones', sips: 3, isAlSeco: false } }
  const [draftBets, setDraftBets] = useState(() => {
    const initial = {};
    effectivePlayers.forEach((p, idx) => {
      // Repartir caballos por defecto inicialmente para comodidad
      const defaultHorse = HORSES[idx % HORSES.length].id;
      initial[p.id] = {
        horseId: defaultHorse,
        sips: 2,
        isAlSeco: false,
      };
    });
    return initial;
  });

  // Jugador seleccionado en vista de apuestas móvil
  const [activeBetPlayerId, setActiveBetPlayerId] = useState(effectivePlayers[0]?.id || '1');

  // Sincronizar estado inicial desde el motor
  useEffect(() => {
    const snap = manager.getSnapshot();
    setPositions(snap.positions);
    setHurdles(snap.hurdles);
    setPhase(snap.phase);
  }, [manager]);

  // Manejador del Auto-Run
  useEffect(() => {
    if (autoRun && phase === 'racing') {
      autoRunTimerRef.current = setInterval(() => {
        handleDrawCard();
      }, autoRunSpeed);
    } else {
      if (autoRunTimerRef.current) {
        clearInterval(autoRunTimerRef.current);
        autoRunTimerRef.current = null;
      }
    }

    return () => {
      if (autoRunTimerRef.current) {
        clearInterval(autoRunTimerRef.current);
      }
    };
  }, [autoRun, phase, autoRunSpeed]);

  // Detener autorun si la carrera termina
  useEffect(() => {
    if (phase === 'finished' && autoRun) {
      setAutoRun(false);
    }
  }, [phase, autoRun]);

  // Actualizar selección de caballo para un jugador
  const handleSelectHorse = (playerId, horseId) => {
    soundManager.playTick(600);
    setDraftBets((prev) => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || { sips: 2, isAlSeco: false }),
        horseId,
      },
    }));
  };

  // Modificar sorbos apostados
  const handleSetSips = (playerId, sips) => {
    soundManager.playTick(700);
    const clean = Math.max(1, Math.min(20, sips));
    setDraftBets((prev) => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || { horseId: 'corazones', isAlSeco: false }),
        sips: clean,
        isAlSeco: false,
      },
    }));
  };

  // Alternar apuesta "Al Seco"
  const handleToggleAlSeco = (playerId) => {
    soundManager.playTick(900);
    setDraftBets((prev) => {
      const current = prev[playerId] || { horseId: 'corazones', sips: 2, isAlSeco: false };
      return {
        ...prev,
        [playerId]: {
          ...current,
          isAlSeco: !current.isAlSeco,
        },
      };
    });
  };

  // Confirmar todas las apuestas y largar la carrera
  const handleStartRace = () => {
    soundManager.playSuccess();
    // Registrar todas las apuestas en el motor
    effectivePlayers.forEach((p) => {
      const b = draftBets[p.id] || { horseId: 'corazones', sips: 2, isAlSeco: false };
      manager.setBet(p.id, p.name, b.horseId, b.isAlSeco ? 'al_seco' : b.sips, b.isAlSeco);
    });

    manager.startRace();
    const snap = manager.getSnapshot();
    setPhase('racing');
    setPositions(snap.positions);
    setHurdles(snap.hurdles);
  };

  // Destapar la siguiente carta
  const handleDrawCard = () => {
    if (phase !== 'racing') return;

    soundManager.playCardFlip();
    const event = manager.drawNextCard();
    setLastEvent(event);

    const snap = manager.getSnapshot();
    setPositions({ ...snap.positions });
    setHurdles([...snap.hurdles]);

    if (event.isFinished) {
      soundManager.playSuccess();
      setPhase('finished');
      setAutoRun(false);
    }
  };

  // Reiniciar carrera completa
  const handleResetRace = () => {
    soundManager.playTick(500);
    setAutoRun(false);
    manager.reset();
    const snap = manager.getSnapshot();
    setPhase('betting');
    setPositions(snap.positions);
    setHurdles(snap.hurdles);
    setLastEvent(null);
  };

  const sipsPerAdvance = manager.getSipsPerAdvance();
  const activeBetPlayer = effectivePlayers.find((p) => p.id === activeBetPlayerId) || effectivePlayers[0];

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center px-3 sm:px-4 pt-safe pb-safe max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden w-full animate-in fade-in duration-200 text-stone-100">
      {/* 1. Header Superior del Hipódromo */}
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
            <span className="text-lg">🏇</span>
            <h2 className="font-display font-black text-sm sm:text-base text-amber-400 tracking-wide truncate">
              Carrera de Caballos
            </h2>
          </div>
          <span className="text-[10px] text-stone-400 block truncate">
            Turf Club Speakeasy • {phase === 'betting' ? 'Ronda de Apuestas' : phase === 'racing' ? '¡En Carrera!' : '¡Meta Final!'}
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

      {/* ========================================================= */}
      {/* 2. FASE 1: RONDA DE APUESTAS PREVIA                       */}
      {/* ========================================================= */}
      {phase === 'betting' && (
        <main className="w-full flex-1 flex flex-col justify-between py-2 overflow-y-auto min-h-0">
          <div className="text-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-block">
              💰 Fase 1: Casa de Apuestas
            </span>
            <p className="text-xs text-stone-300 mt-1">
              Cada jugador debe elegir su caballo y definir sus sorbos (o arriesgar el <strong>Vaso al Seco</strong>).
            </p>
          </div>

          {/* Selector de Jugador para apostar (en móviles/tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none justify-start sm:justify-center">
            {effectivePlayers.map((player) => {
              const isSelected = player.id === activeBetPlayerId;
              const playerAvatar = getAnimalAvatar(player.animal);
              const playerBet = draftBets[player.id];
              const betHorse = HORSES.find((h) => h.id === playerBet?.horseId) || HORSES[0];

              return (
                <button
                  key={player.id}
                  onClick={() => {
                    soundManager.playTick(600);
                    setActiveBetPlayerId(player.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <img src={playerAvatar.image} alt={player.name} className="w-4 h-4 rounded-sm object-contain" />
                  <span className="truncate max-w-[80px]">{player.name}</span>
                  <span className="text-[11px]">{betHorse.symbol}</span>
                </button>
              );
            })}
          </div>

          {/* Ficha de Apuesta del Jugador Activo */}
          {activeBetPlayer && (
            <div className="bg-[#191416] border border-amber-500/30 rounded-2xl p-4 shadow-xl mb-3 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getAnimalAvatar(activeBetPlayer.animal).image}
                    alt={activeBetPlayer.name}
                    className="w-8 h-8 rounded-lg object-contain border border-amber-400/50"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-stone-100">{activeBetPlayer.name}</h3>
                    <span className="text-[10px] text-stone-400">Elige tu caballo y tus sorbos</span>
                  </div>
                </div>

                {draftBets[activeBetPlayer.id]?.isAlSeco ? (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
                    🔥 ¡AL SECO!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    {draftBets[activeBetPlayer.id]?.sips || 2} Sorbos
                  </span>
                )}
              </div>

              {/* Selector de los 4 Caballos (4 Colores Distintos) */}
              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  1. Selecciona tu Caballo:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HORSES.map((horse) => {
                    const isSelected = draftBets[activeBetPlayer.id]?.horseId === horse.id;
                    return (
                      <button
                        key={horse.id}
                        onClick={() => handleSelectHorse(activeBetPlayer.id, horse.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? `${horse.badgeClass} ring-2 ring-white/30 shadow-lg scale-[1.02]`
                            : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <span className="text-2xl">{horse.symbol}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-black block truncate leading-tight text-stone-100">
                            {horse.name}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${horse.textClass}`}>
                            Seda #{horse.silkNumber} • {horse.colorKey}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Sorbos y Botón Al Seco */}
              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  2. Define tu Apuesta:
                </label>

                <div className="flex items-center gap-2">
                  {/* Stepper numérico de sorbos */}
                  <div
                    className={`flex items-center gap-1 bg-stone-900 border border-stone-700/80 rounded-xl p-1 flex-1 ${
                      draftBets[activeBetPlayer.id]?.isAlSeco ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleSetSips(
                          activeBetPlayer.id,
                          (draftBets[activeBetPlayer.id]?.sips || 2) - 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-black text-sm flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-amber-400 text-sm">
                      {draftBets[activeBetPlayer.id]?.sips || 2} sorbos
                    </span>
                    <button
                      onClick={() =>
                        handleSetSips(
                          activeBetPlayer.id,
                          (draftBets[activeBetPlayer.id]?.sips || 2) + 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-black text-sm flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  {/* Botón Legendario ¡AL SECO! */}
                  <button
                    onClick={() => handleToggleAlSeco(activeBetPlayer.id)}
                    className={`px-3 py-2 rounded-xl font-black text-xs border transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0 ${
                      draftBets[activeBetPlayer.id]?.isAlSeco
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-2 ring-white/30'
                        : 'bg-stone-900 hover:bg-stone-800 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    <span>🍺</span>
                    <span>¡Al Seco!</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de la Mesa de Apuestas */}
          <div className="bg-stone-950/60 rounded-xl p-2.5 border border-stone-800/80 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              📋 Resumen de Apuestas de la Mesa:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {effectivePlayers.map((p) => {
                const b = draftBets[p.id];
                const h = HORSES.find((item) => item.id === b?.horseId) || HORSES[0];
                return (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900 border border-stone-700/60 text-stone-300"
                  >
                    <strong>{p.name}:</strong>
                    <span>{h.symbol}</span>
                    <span className={b?.isAlSeco ? 'text-rose-400 font-black' : 'text-amber-400 font-bold'}>
                      {b?.isAlSeco ? 'Al Seco 🍺' : `${b?.sips || 2}s`}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Botón de Largada de la Carrera */}
          <button
            onClick={handleStartRace}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:brightness-110 active:scale-98 text-stone-950 font-black text-sm sm:text-base border border-emerald-300 shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🏁</span>
            <span>¡CERRAR APUESTAS Y LARGAR CARRERA!</span>
          </button>
        </main>
      )}

      {/* ========================================================= */}
      {/* 3. FASE 2 & 3: PISTA DE CARRERAS (HIPÓDROMO EN VIVO)      */}
      {/* ========================================================= */}
      {(phase === 'racing' || phase === 'finished') && (
        <main className="w-full flex-1 flex flex-col justify-between py-1.5 min-h-0 overflow-y-auto">
          {/* Barra de Información de Carrera */}
          <div className="flex items-center justify-between bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-xl mb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">Avance actual:</span>
              <span className="font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Regala {sipsPerAdvance} {sipsPerAdvance === 1 ? 'sorbo' : 'sorbos'} 🥂
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-stone-400 text-[11px]">Cartas mazo:</span>
              <span className="font-bold text-stone-200">{manager.raceDeck?.length || 0}</span>
            </div>
          </div>

          {/* LA PISTA: 4 CARRILES DE COLORES DISTINTOS */}
          <div className="w-full bg-[#120e10] border-2 border-amber-500/30 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col gap-2.5 my-auto">
            {/* Cabecera de Casillas / Marcador de Pista */}
            <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase px-2 border-b border-stone-800 pb-1">
              <span>🚩 Partida (0)</span>
              <div className="flex gap-4 sm:gap-6">
                <span>Vallas (1-6)</span>
                <span className="text-amber-400 font-black">🏆 Meta (7)</span>
              </div>
            </div>

            {/* Los 4 Carriles */}
            {HORSES.map((horse) => {
              const currentPos = positions[horse.id] || 0;
              const isWinner = manager.winner?.id === horse.id;
              const backers = manager.getBetsList().filter((b) => b.horseId === horse.id);

              return (
                <div
                  key={horse.id}
                  className={`rounded-xl p-2 border transition-all duration-300 ${horse.laneBg} ${
                    isWinner ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/20' : ''
                  }`}
                >
                  {/* Encabezado del carril con nombre, seda y apostadores */}
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{horse.symbol}</span>
                      <span className={`font-black ${horse.textClass}`}>{horse.name}</span>
                      <span className="text-[10px] text-stone-400 font-bold">#{horse.silkNumber}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-300">
                      {backers.length > 0 ? (
                        backers.map((b) => (
                          <span
                            key={b.playerId}
                            className="px-1.5 py-0.2 rounded bg-black/40 border border-white/10 text-[10px]"
                          >
                            {b.playerName} ({b.isAlSeco ? '🍺' : `${b.sipsBet}s`})
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-stone-500 italic">Sin apuestas</span>
                      )}
                    </div>
                  </div>

                  {/* Pista física con casillas y caballo avanzando */}
                  <div className="relative h-8 sm:h-9 bg-black/60 rounded-lg border border-white/10 overflow-hidden flex items-center px-1">
                    {/* Líneas divisorias de casillas (0 a 7) */}
                    <div className="absolute inset-0 grid grid-cols-8 divide-x divide-white/5 pointer-events-none">
                      <div className="h-full" />
                      <div className="h-full bg-stone-900/30" />
                      <div className="h-full" />
                      <div className="h-full bg-stone-900/30" />
                      <div className="h-full" />
                      <div className="h-full bg-stone-900/30" />
                      <div className="h-full" />
                      <div className="h-full bg-amber-500/15 border-l-2 border-amber-400/80" />
                    </div>

                    {/* Vallas laterales colocadas en la pista */}
                    {hurdles.map((hurdle) => {
                      const hurdleLeftPercent = (hurdle.step / DEFAULT_TRACK_LENGTH) * 87.5;
                      return (
                        <div
                          key={hurdle.step}
                          style={{ left: `${hurdleLeftPercent}%` }}
                          className={`absolute top-0 bottom-0 w-1 pointer-events-none z-10 flex flex-col justify-between items-center ${
                            hurdle.revealed ? 'bg-rose-500/80 shadow-rose-500' : 'bg-amber-400/30'
                          }`}
                          title={`Valla ${hurdle.step}: ${hurdle.revealed ? hurdle.card.name : 'Oculta'}`}
                        >
                          <span className="text-[7px] text-stone-400 font-mono">🚧</span>
                        </div>
                      );
                    })}

                    {/* Ficha / Caballo con animación de avance */}
                    <div
                      style={{
                        left: `${Math.min(100, (currentPos / DEFAULT_TRACK_LENGTH) * 88)}%`,
                        transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      className="absolute z-20 flex items-center gap-1 select-none pointer-events-none"
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 text-base ${horse.borderClass} ${horse.bgGradient} ${
                          isWinner ? 'scale-125 animate-bounce ring-2 ring-amber-300' : ''
                        }`}
                      >
                        {horse.avatar}
                      </div>
                      <span className="text-[10px] font-black text-amber-300 bg-black/80 px-1 rounded border border-white/20">
                        {currentPos}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner de Comentarios en Vivo y Última Carta */}
          <div className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-2.5 my-1.5 flex items-center gap-3">
            {lastEvent?.card ? (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-10 h-14 rounded-lg bg-stone-100 text-stone-950 border-2 border-stone-300 flex flex-col justify-between p-1 text-center shadow-md font-bold">
                  <span className="text-xs leading-none">
                    {lastEvent.card.suit === 'corazones' || lastEvent.card.suit === 'diamantes' ? (
                      <span className="text-red-600">{lastEvent.card.value}</span>
                    ) : (
                      <span className="text-black">{lastEvent.card.value}</span>
                    )}
                  </span>
                  <span className="text-base leading-none">
                    {HORSES.find((h) => h.id === lastEvent.card.suit)?.symbol}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-14 rounded-lg bg-stone-900 border border-dashed border-stone-700 flex items-center justify-center text-xs text-stone-500 shrink-0">
                🂠
              </div>
            )}

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                🎙️ Relator del Hipódromo:
              </span>
              <p className="text-xs text-stone-200 truncate">
                {lastEvent?.isFinished
                  ? `🏆 ¡${lastEvent.winner.name} cruzó la meta y es el GANADOR!`
                  : lastEvent?.advancingHorse
                  ? `${lastEvent.advancingHorse.name} avanza a casilla ${lastEvent.newPosition}.`
                  : '¡Partieron! Presiona "Destapar Carta" o activa Auto-Run.'}
              </p>

              {/* Mensaje de regalo de sorbos */}
              {lastEvent?.advanceGiftInfo?.backers?.length > 0 && !lastEvent?.isFinished && (
                <span className="text-[11px] text-emerald-400 font-bold block truncate">
                  🥂 {lastEvent.advanceGiftInfo.backers.map((b) => b.playerName).join(', ')}{' '}
                  regala {lastEvent.advanceGiftInfo.sipsPerBacker}{' '}
                  {lastEvent.advanceGiftInfo.sipsPerBacker === 1 ? 'sorbo' : 'sorbos'} a la mesa!
                </span>
              )}

              {/* Notificación de valla activada */}
              {lastEvent?.hurdlesTriggered?.length > 0 && (
                <span className="text-[11px] text-rose-400 font-bold block truncate">
                  🚧 ¡Valla {lastEvent.hurdlesTriggered[0].step} activada!{' '}
                  {lastEvent.hurdlesTriggered[0].penalizedHorse.name} retrocede a{' '}
                  {lastEvent.hurdlesTriggered[0].newPos}.
                </span>
              )}
            </div>
          </div>

          {/* Botonera de Control de Carrera */}
          <div className="w-full flex items-center gap-2">
            {phase === 'racing' ? (
              <>
                <button
                  onClick={handleDrawCard}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 font-black text-sm border border-amber-300 shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🃏</span>
                  <span>Destapar Carta</span>
                </button>

                <button
                  onClick={() => setAutoRun((prev) => !prev)}
                  className={`px-4 py-3 rounded-2xl font-black text-xs border transition cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0 ${
                    autoRun
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md animate-pulse'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
                  }`}
                >
                  <span>{autoRun ? '⏸️ Pausar' : '⚡ Auto-Run'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleResetRace}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 font-black text-sm border border-amber-300 shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>↺</span>
                <span>Nueva Carrera de Caballos</span>
              </button>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
