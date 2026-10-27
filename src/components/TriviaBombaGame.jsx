import React, { useState, useEffect, useRef } from 'react';
import {
  TriviaBombaManager,
  getCategoryStyle,
} from '../utils/triviaBombaData';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

/**
 * Componente Visual de la Mecha y Bomba 3D con Tensión Progresiva
 */
function BombVisual({ tensionLevel, isExploded }) {
  // Configuración de colores y animaciones según la tensión invisible
  const tensionGlow = {
    calm: 'shadow-amber-500/20 border-stone-700',
    medium: 'shadow-orange-500/30 border-orange-500/40 animate-pulse',
    high: 'shadow-rose-600/40 border-rose-500/60 animate-bounce',
    critical: 'shadow-[0_0_45px_rgba(220,20,60,0.6)] border-[#DC143C] animate-shake',
  }[tensionLevel] || 'shadow-amber-500/20 border-stone-700';

  const sparkColor = {
    calm: 'bg-amber-400 text-amber-300 shadow-amber-400',
    medium: 'bg-orange-500 text-orange-300 shadow-orange-500',
    high: 'bg-rose-500 text-rose-300 shadow-rose-500',
    critical: 'bg-red-600 text-white shadow-red-600 animate-ping',
  }[tensionLevel] || 'bg-amber-400';

  if (isExploded) {
    return (
      <div className="relative flex flex-col items-center justify-center my-1">
        <span className="text-6xl sm:text-7xl animate-bounce drop-shadow-[0_0_35px_rgba(225,29,72,0.8)]">
          💥
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none">
      {/* Mecha humeante con chispa activa */}
      <div className="relative flex flex-col items-center">
        {/* Chispa con resplandor */}
        <div className="relative flex items-center justify-center">
          <span className={`w-3.5 h-3.5 rounded-full ${sparkColor} shadow-lg animate-ping`} />
          <span className="absolute text-xs leading-none">✨</span>
        </div>
        {/* Cuerda de la mecha curvada */}
        <div className="w-1.5 h-4 bg-gradient-to-b from-amber-700 via-amber-900 to-stone-900 rounded-t-sm" />
      </div>

      {/* Cuerpo esférico 3D de la Bomba Speakeasy */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-stone-800 via-[#181215] to-black border-2 ${tensionGlow} shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300`}
      >
        {/* Brillo especular superior */}
        <div className="absolute top-1.5 left-2.5 w-4 h-2.5 bg-white/20 rounded-full -rotate-45 blur-[0.5px]" />

        {/* Ícono central de calavera / bomba según tensión */}
        <span className={`text-2xl sm:text-3xl ${tensionLevel === 'critical' ? 'animate-bounce text-rose-500' : 'text-stone-300'}`}>
          {tensionLevel === 'critical' ? '☠️' : '💣'}
        </span>
      </div>
    </div>
  );
}

/**
 * Componente Principal: Trivia Bomba (La Papa Caliente Contrarreloj)
 * Paso 2: Tablero Visual Speakeasy, Bomba con Mecha, Preguntas de Opción Múltiple
 */
export default function TriviaBombaGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  const effectivePlayers =
    players && players.length >= 2
      ? players
      : [
          { id: '1', name: 'Jugador 1', gender: 'hombre', animal: 'perro' },
          { id: '2', name: 'Jugador 2', gender: 'mujer', animal: 'gato' },
        ];

  // Instancia única del motor de juego
  const [manager] = useState(() => new TriviaBombaManager({ players: effectivePlayers }));

  // Estado sincronizado desde el motor
  const [gameState, setGameState] = useState(() => manager.getSnapshot());

  // Estado de feedback visual de respuesta
  // type: 'correct' | 'wrong' | null
  const [feedback, setFeedback] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Referencia al intervalo del temporizador invisible
  const timerRef = useRef(null);

  // Sincronizar jugadores si cambian
  useEffect(() => {
    manager.setPlayers(effectivePlayers);
    syncState();
  }, [effectivePlayers]);

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const syncState = () => {
    setGameState(manager.getSnapshot());
  };

  // Iniciar la ronda
  const handleStartRound = () => {
    soundManager.playTimerStart();
    manager.startRound();
    syncState();
    setFeedback(null);
    setSelectedKey(null);
    setIsAnswering(false);

    // Iniciar el temporizador invisible
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const tickResult = manager.tick(1);
      syncState();

      if (tickResult.isExploded) {
        clearInterval(timerRef.current);
        soundManager.playTimerBuzzer();
      } else {
        const isUrgent = tickResult.tensionLevel === 'critical' || tickResult.tensionLevel === 'high';
        soundManager.playTimerTick(isUrgent);
      }
    }, 1000);
  };

  // Detener y reiniciar
  const handleResetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundManager.playTick(500);
    manager.reset();
    setFeedback(null);
    setSelectedKey(null);
    setIsAnswering(false);
    syncState();
  };

  // Procesar respuesta a una alternativa
  const handleSelectOption = (key) => {
    if (gameState.status !== 'running' || isAnswering) return;

    setIsAnswering(true);
    setSelectedKey(key);

    const result = manager.submitAnswer(key);

    if (result.isCorrect) {
      soundManager.playSuccess();
      setFeedback({
        type: 'correct',
        fromPlayer: result.fromPlayer,
        toPlayer: result.toPlayer,
        pot: result.pot,
      });

      // Breve pausa para mostrar la orden de pase y cargar la siguiente pregunta
      setTimeout(() => {
        setFeedback(null);
        setSelectedKey(null);
        setIsAnswering(false);
        syncState();
      }, 1100);
    } else {
      soundManager.playChickenPenalty();
      // REGLA CLAVE: NO MOSTRAR LA RESPUESTA CORRECTA.
      // Borde rojo durante 1 segundo y nueva pregunta inmediata.
      setFeedback({
        type: 'wrong',
        player: result.player,
      });

      setTimeout(() => {
        setFeedback(null);
        setSelectedKey(null);
        setIsAnswering(false);
        syncState();
      }, 1000);
    }
  };

  const activeAvatar = getAnimalAvatar(gameState.activePlayer?.animal);
  const nextAvatar = getAnimalAvatar(gameState.nextPlayer?.animal);
  const currentQ = gameState.currentQuestion;
  const categoryStyle = currentQ ? getCategoryStyle(currentQ.categoria) : getCategoryStyle('General');

  const isWrongFeedback = feedback && feedback.type === 'wrong';
  const isCorrectFeedback = feedback && feedback.type === 'correct';

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center px-3 sm:px-4 pt-safe pb-safe max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden overflow-x-hidden w-full animate-in fade-in duration-200 text-stone-100 select-none">
      {/* 1. Header Superior */}
      <header className="w-full flex items-center justify-between py-1.5 sm:py-2 border-b border-stone-800/80 shrink-0 gap-2">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            onBack();
          }}
          className="flex items-center gap-1 text-xs bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-200 font-bold px-3 py-1.5 rounded-xl border border-stone-700/80 transition shadow cursor-pointer"
          title="Volver a Otros Juegos"
        >
          <span>←</span>
          <span>Volver</span>
        </button>

        <div className="text-center min-w-0">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-base sm:text-lg">💣</span>
            <h2 className="font-display font-black text-sm sm:text-base text-red-400 tracking-wide truncate">
              Trivia Bomba
            </h2>
          </div>
          <span className="text-[9px] sm:text-[10px] text-stone-400 block truncate">
            Papa Caliente • Contrarreloj
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

      {/* 2. Cuerpo Central del Juego */}
      <main className="w-full flex-1 min-h-0 flex flex-col justify-between py-1 overflow-x-hidden overflow-y-auto no-scrollbar">
        {/* Barra Superior: Turno del Jugador, Pase y Pozo de la Bomba */}
        <div className="w-full flex items-center justify-between gap-1.5 mb-1 shrink-0">
          {/* Jugador con el teléfono en la mano */}
          <div className="flex items-center gap-1.5 bg-[#191416] border border-stone-800 px-2.5 py-1 rounded-2xl min-w-0">
            <img
              src={activeAvatar.image}
              alt={gameState.activePlayer?.name}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-contain border border-amber-400/50 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] text-stone-400 block uppercase tracking-wider font-bold">
                Tiene el teléfono:
              </span>
              <span className="text-xs font-black text-amber-300 truncate block">
                {gameState.activePlayer?.name}
              </span>
            </div>
          </div>

          {/* Pozo Acumulado de la Bomba */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl border transition-all duration-300 shadow-md ${
            gameState.status === 'running'
              ? 'bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border-red-500/70 shadow-red-950/50'
              : 'bg-[#191416] border-stone-800'
          }`}>
            <span className="text-base sm:text-lg animate-pulse">🍺</span>
            <div>
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-red-300 block leading-tight">
                Pozo Bomba:
              </span>
              <span className="text-xs sm:text-sm font-black text-white leading-tight">
                {gameState.pot} {gameState.pot === 1 ? 'Sorbo' : 'Sorbos'}
              </span>
            </div>
          </div>

          {/* Siguiente Jugador (A quién le toca recibirla) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-2xl shrink-0">
            <span className="text-[9px] text-stone-400 font-bold">Pasa a:</span>
            <img
              src={nextAvatar.image}
              alt={gameState.nextPlayer?.name}
              className="w-4 h-4 rounded-sm object-contain"
            />
            <span className="text-xs font-bold text-stone-300 truncate max-w-[80px]">
              {gameState.nextPlayer?.name}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PANTALLA A: ESTADO IDLE (Antes de Iniciar la Mecha)           */}
        {/* ------------------------------------------------------------- */}
        {gameState.status === 'idle' && (
          <div className="w-full border-2 border-stone-800 bg-[#120e10] rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center relative my-auto text-center gap-3">
            <BombVisual tensionLevel="calm" isExploded={false} />

            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-red-400 mb-1">
                ¿Listos para encender la mecha?
              </h3>
              <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                La bomba tiene un <strong>tiempo secreto aleatorio</strong>. Responde la pregunta en voz alta. Si aciertas, <strong>¡pásale el teléfono volando al siguiente!</strong> Si te explota en la mano, ¡te bebes todo el pozo!
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-stone-800 text-[11px] text-stone-400 max-w-xs space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-stone-300 font-bold">
                <span>⏱️</span>
                <span>Reloj invisible de 45 a 80 segundos</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300 font-bold">
                <span>⚡</span>
                <span>Si fallas, nueva pregunta sin spoilers</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300 font-bold">
                <span>🍻</span>
                <span>Cada acierto suma +1 sorbo al pozo</span>
              </div>
            </div>

            <button
              onClick={handleStartRound}
              className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-display font-black text-sm uppercase tracking-wider border border-red-300 shadow-xl shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              <span>🔥</span>
              <span>¡Encender Mecha e Iniciar!</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANTALLA B: ESTADO RUNNING (Ronda Activa / Bomba Tic-Tac)     */}
        {/* ------------------------------------------------------------- */}
        {gameState.status === 'running' && currentQ && (
          <div className={`w-full border-2 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col items-center justify-between relative my-auto transition-all duration-300 ${
            isWrongFeedback
              ? 'bg-gradient-to-b from-[#2e0911] via-[#1a060b] to-[#0f0407] border-[#DC143C] shadow-[0_0_30px_rgba(220,20,60,0.45)] animate-shake'
              : isCorrectFeedback
              ? 'bg-gradient-to-b from-[#0c2417] via-[#081810] to-[#040c08] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
              : 'bg-[#120e10] border-red-500/30 shadow-red-950/20'
          }`}>
            {/* Cabecera de la Tarjeta de Pregunta */}
            <div className="w-full flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${categoryStyle.badge}`}>
                <span>{categoryStyle.icon}</span>
                <span>{currentQ.categoria || 'Trivia'}</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                  Dificultad {currentQ.dificultad || 5}/10
                </span>
                <span className="text-[10px] font-black text-amber-400">
                  #{currentQ.id}
                </span>
              </div>
            </div>

            {/* Bomba animada con mecha */}
            <BombVisual tensionLevel={gameState.tensionLevel} isExploded={false} />

            {/* Texto de la Pregunta */}
            <div className="my-2 text-center px-1">
              <h3 className="font-display font-black text-sm sm:text-base md:text-lg text-white leading-snug drop-shadow-sm">
                {currentQ.pregunta}
              </h3>
            </div>

            {/* Banner de Feedback (Acierto o Fallo sin spoiler) */}
            {feedback && (
              <div className={`w-full p-2 rounded-xl text-center text-xs font-bold border transition animate-in fade-in duration-150 my-1 ${
                feedback.type === 'correct'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/90 border-[#DC143C] text-rose-200 animate-shake'
              }`}>
                {feedback.type === 'correct' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-emerald-300 font-black text-xs sm:text-sm">
                      🎉 ¡CORRECTO! (+1 Sorbo al Pozo)
                    </span>
                    <span className="text-white text-xs font-black mt-0.5 animate-pulse">
                      👉 ¡PÁSALE EL TELÉFONO RÁPIDO A {feedback.toPlayer?.name}!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold">
                    <span>❌</span>
                    <span>¡Respuesta incorrecta! Responde la siguiente de inmediato:</span>
                  </div>
                )}
              </div>
            )}

            {/* 4 Alternativas de Respuesta (A, B, C, D) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mt-1">
              {['A', 'B', 'C', 'D'].map((key) => {
                const optionText = currentQ.opciones?.[key] || '';
                const isSelected = selectedKey === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectOption(key)}
                    disabled={isAnswering}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
                      isSelected && isWrongFeedback
                        ? 'bg-red-950/90 border-[#DC143C] text-red-200'
                        : isSelected && isCorrectFeedback
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                        : 'bg-black/50 border-stone-800 hover:border-amber-400/70 hover:brightness-110 active:scale-95 text-stone-200'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected && isWrongFeedback
                        ? 'bg-red-600 text-white'
                        : isSelected && isCorrectFeedback
                        ? 'bg-emerald-500 text-stone-950'
                        : 'bg-stone-800 text-amber-400 border border-stone-700'
                    }`}>
                      {key}
                    </span>
                    <span className="text-xs font-semibold leading-tight flex-1">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANTALLA C: ESTADO EXPLODED (¡BOOM! Castigo del Pozo)          */}
        {/* ------------------------------------------------------------- */}
        {gameState.status === 'exploded' && (
          <div className="w-full border-2 border-[#DC143C] bg-gradient-to-b from-[#2e0911] via-[#1a060b] to-[#0f0407] rounded-2xl p-4 shadow-2xl shadow-rose-950/80 flex flex-col items-center justify-center relative my-auto text-center gap-3 animate-shake">
            <BombVisual tensionLevel="critical" isExploded={true} />

            <div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 inline-block mb-1">
                ¡TIEMPO AGOTADO!
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                ¡BOOOOOOM! LA BOMBA EXPLOTÓ
              </h3>
            </div>

            {/* Ficha de la Víctima que tenía el teléfono */}
            <div className="p-3 rounded-2xl bg-black/60 border border-rose-500/40 w-full max-w-sm flex flex-col items-center gap-1.5 shadow-inner">
              <span className="text-[10px] font-black uppercase text-stone-400">
                Le explotó en las manos a:
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={getAnimalAvatar(gameState.victimPlayer?.animal).image}
                  alt={gameState.victimPlayer?.name}
                  className="w-8 h-8 rounded-lg object-contain border border-amber-400"
                />
                <span className="text-base sm:text-lg font-black text-amber-300">
                  {gameState.victimPlayer?.name}
                </span>
              </div>

              <div className="w-full border-t border-white/10 mt-1 pt-1.5 flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-stone-200">Debe beberse:</span>
                <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-red-600/70 text-white border border-rose-400">
                  {gameState.pot} {gameState.pot === 1 ? 'Sorbo' : 'Sorbos'}
                </span>
                <span className="text-xs text-stone-300">del pozo acumulado 🍺</span>
              </div>
            </div>

            {/* Botones de Acción tras Explosión */}
            <div className="w-full max-w-xs flex flex-col gap-2 mt-1">
              <button
                onClick={handleStartRound}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider border border-red-300 shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔥</span>
                <span>Jugar Otra Ronda (Nueva Mecha)</span>
              </button>

              <button
                onClick={handleResetGame}
                className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <span>↺</span>
                <span className="ml-1">Reiniciar a Pantalla de Inicio</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
