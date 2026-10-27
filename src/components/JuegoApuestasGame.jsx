import React, { useState, useEffect } from 'react';
import {
  ApuestasGameManager,
} from '../utils/apuestasData';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

/**
 * Modal Dramático de Explosión del Pozo (Paso 3)
 */
function PozoExplosionModal({ data, onClose }) {
  if (!data) return null;

  const playerAvatar = getAnimalAvatar(data.player?.animal);
  const isRedPrev = data.prevCard.isRed;
  const isRedNew = data.newCard.isRed;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 shadow-2xl relative z-10 flex flex-col items-center border-2 border-rose-500/80 bg-gradient-to-b from-[#240e13] via-[#17090c] to-[#0a0406] text-stone-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl animate-bounce">💥</span>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50">
            {data.isTiePunishment ? '¡CARTA GEMELA DUPLICADA!' : '¡EXPLOSIÓN DEL POZO!'}
          </span>
        </div>

        {/* Ficha del Jugador Castigado */}
        <div className="flex items-center gap-2 my-1.5 p-1 px-3 rounded-full bg-black/50 border border-white/10">
          <img
            src={playerAvatar.image}
            alt={data.player.name}
            className="w-5 h-5 rounded-md object-contain border border-amber-400/50"
          />
          <span className="text-xs text-stone-200">
            ¡Le tocó pagar a <strong className="text-amber-300">{data.player.name}</strong>!
          </span>
        </div>

        {/* Comparación visual de las 2 cartas */}
        <div className="flex items-center justify-center gap-3 my-3">
          {/* Carta Anterior */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 font-bold mb-1">Tenías:</span>
            <div className="w-16 h-24 rounded-xl bg-stone-100 border-2 border-white shadow-md flex flex-col justify-between p-1.5 text-center select-none">
              <span className={`text-xs font-black leading-none ${isRedPrev ? 'text-red-600' : 'text-stone-900'}`}>
                {data.prevCard.value}
              </span>
              <span className="text-2xl leading-none">
                {data.prevCard.suitSymbol}
              </span>
              <span className={`text-xs font-black leading-none self-end rotate-180 ${isRedPrev ? 'text-red-600' : 'text-stone-900'}`}>
                {data.prevCard.value}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-rose-400">Dijiste</span>
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-black/60 border border-rose-500/40 text-rose-300 my-1">
              {data.option === 'mayor' ? '⬆️ Mayor' : data.option === 'menor' ? '⬇️ Menor' : '🟰 Mismo'}
            </span>
            <span className="text-base text-stone-500">➔</span>
          </div>

          {/* Carta Revelada */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-400 font-bold mb-1">Salió:</span>
            <div className="w-16 h-24 rounded-xl bg-stone-100 border-2 border-rose-400 shadow-md shadow-rose-500/30 flex flex-col justify-between p-1.5 text-center select-none animate-shake">
              <span className={`text-xs font-black leading-none ${isRedNew ? 'text-red-600' : 'text-stone-900'}`}>
                {data.newCard.value}
              </span>
              <span className="text-2xl leading-none">
                {data.newCard.suitSymbol}
              </span>
              <span className={`text-xs font-black leading-none self-end rotate-180 ${isRedNew ? 'text-red-600' : 'text-stone-900'}`}>
                {data.newCard.value}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje de Cobro y Sorbos Gigantes */}
        <div className="w-full my-1.5 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-center flex flex-col items-center gap-1 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">
            {data.isTiePunishment ? '¡Empate Imprevisto! Pozo Duplicado' : 'Castigo del Pozo Acumulado:'}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-1.5 drop-shadow-md">
            <span>🍺</span>
            <span className="text-rose-400">{data.sipsToDrink}</span>
            <span>{data.sipsToDrink === 1 ? 'Sorbo' : 'Sorbos'}</span>
          </div>
          {data.isTiePunishment && (
            <span className="text-[11px] text-amber-300 font-black animate-pulse mt-0.5">
              ¡Se recomienda tomarlo al seco! 💀
            </span>
          )}
        </div>

        {/* Botón de Continuar */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm border border-rose-300 shadow-lg shadow-rose-500/30 transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
        >
          <span>¡Castigo Pagado!</span>
          <span>🍻</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Modal de Jackpot de Carta Gemela (Paso 3)
 */
function JackpotMismoModal({ data, onClose }) {
  if (!data) return null;

  const playerAvatar = getAnimalAvatar(data.player?.animal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 shadow-2xl relative z-10 flex flex-col items-center border-2 border-amber-400/80 bg-gradient-to-b from-[#2a1c0d] via-[#1a1208] to-[#0d0904] text-stone-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-5xl animate-bounce my-1">💎</span>
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 mb-2">
          ¡JACKPOT DE CARTA GEMELA!
        </span>

        <div className="flex items-center gap-2 my-1 p-1 px-3 rounded-full bg-black/50 border border-amber-500/30">
          <img
            src={playerAvatar.image}
            alt={data.player.name}
            className="w-5 h-5 rounded-md object-contain border border-amber-400"
          />
          <span className="text-xs text-amber-200">
            ¡Hazaña histórica de <strong>{data.player.name}</strong>!
          </span>
        </div>

        <p className="text-xs text-stone-300 text-center my-2">
          Acertó la apuesta de <strong>Mismo Número (~6% de probabilidad)</strong> con el {data.newCard.name}.
        </p>

        <div className="w-full my-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-center flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
            PREMIO LEGENDARIO PARA REGALAR:
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300">
            ¡Regalas {data.sipsGifted} Sorbos! 🔥
          </span>
          <span className="text-[11px] text-stone-300">
            (O tienes derecho a mandar 1 Vaso al Seco a quien elijas)
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 font-black text-xs sm:text-sm border border-amber-300 shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
        >
          <span>¡Repartir Premio con Gloria!</span>
          <span>🏆</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Componente Principal: Juego de las Apuestas (Mayor o Menor)
 * Paso 3: Volteo 3D, Modales de Explosión de Pozo, Empate x2 y Jackpot Gemelo
 */
export default function JuegoApuestasGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  const effectivePlayers =
    players && players.length > 0
      ? players
      : [
          { id: '1', name: 'Jugador 1', gender: 'hombre', animal: 'perro' },
          { id: '2', name: 'Jugador 2', gender: 'mujer', animal: 'gato' },
        ];

  // Instancia única del motor
  const [manager] = useState(() => new ApuestasGameManager({ players: effectivePlayers }));

  // Estado sincronizado desde el motor
  const [currentCard, setCurrentCard] = useState(() => manager.currentCard);
  const [cardsRemaining, setCardsRemaining] = useState(() => manager.deck.length);
  const [discardPile, setDiscardPile] = useState(() => manager.discardPile);
  const [pot, setPot] = useState(() => manager.pot);
  const [streak, setStreak] = useState(() => manager.streak);
  const [canPass, setCanPass] = useState(() => manager.canPass);
  const [activePlayer, setActivePlayer] = useState(() => manager.getActivePlayer());
  const [odds, setOdds] = useState(() => manager.getOdds());
  const [lastResult, setLastResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Estados de Modales del Paso 3
  const [explosionModalData, setExplosionModalData] = useState(null);
  const [jackpotModalData, setJackpotModalData] = useState(null);

  // Sincronizar jugadores si cambian
  useEffect(() => {
    manager.setPlayers(effectivePlayers);
    syncState();
  }, [effectivePlayers]);

  const syncState = () => {
    const snap = manager.getSnapshot();
    setCurrentCard(snap.currentCard);
    setCardsRemaining(snap.cardsRemaining);
    setDiscardPile([...manager.discardPile]);
    setPot(snap.pot);
    setStreak(snap.streak);
    setCanPass(snap.canPass);
    setActivePlayer(snap.activePlayer);
    setOdds(snap.odds);
    setLastResult(snap.lastResult);
  };

  // Ejecutar apuesta: 'mayor' | 'menor' | 'mismo'
  const handleBet = (option) => {
    if (isFlipping) return;

    soundManager.playCardFlip();
    setIsFlipping(true);

    setTimeout(() => {
      const result = manager.placeBet(option);
      syncState();
      setIsFlipping(false);

      if (result.isCorrect) {
        soundManager.playSuccess();
        // Si acertó el Jackpot de mismo número:
        if (result.option === 'mismo') {
          setJackpotModalData(result);
        }
      } else {
        soundManager.playChickenPenalty();
        // Abrir modal de explosión de pozo (Paso 3)
        setExplosionModalData(result);
      }
    }, 280);
  };

  // Plantarse y pasarle el pozo al siguiente jugador
  const handlePass = () => {
    if (!canPass || isFlipping) return;

    soundManager.playTick(750);
    manager.passTurn();
    syncState();
  };

  // Reiniciar partida
  const handleReset = () => {
    soundManager.playTick(500);
    manager.reset();
    setExplosionModalData(null);
    setJackpotModalData(null);
    syncState();
  };

  const avatar = getAnimalAvatar(activePlayer?.animal);
  const isRed = currentCard?.isRed;

  // Nivel de intensidad del pozo para efectos visuales
  const potIntensity =
    pot >= 8
      ? 'from-red-950/80 via-rose-900/60 to-red-950/80 border-rose-500 shadow-rose-500/30 animate-pulse'
      : pot >= 4
      ? 'from-amber-950/80 via-orange-950/60 to-amber-950/80 border-amber-500 shadow-amber-500/20'
      : 'from-amber-950/60 via-red-950/40 to-amber-950/60 border-amber-500/40 shadow-amber-500/10';

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center px-3 sm:px-4 pt-safe pb-safe max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden w-full animate-in fade-in duration-200 text-stone-100">
      {/* 1. Header Superior del Casino */}
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
            <span className="text-lg">📈</span>
            <h2 className="font-display font-black text-sm sm:text-base text-cyan-400 tracking-wide truncate">
              Juego de las Apuestas
            </h2>
          </div>
          <span className="text-[10px] text-stone-400 block truncate">
            Casino Speakeasy • Mayor o Menor
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
      <main className="w-full flex-1 flex flex-col justify-between py-1.5 min-h-0 overflow-y-auto">
        {/* Ficha del Turno y Medidor del Pozo */}
        <div className="w-full flex items-center justify-between gap-2 mb-1">
          {/* Ficha del Jugador Activo */}
          <div className="flex items-center gap-2 bg-[#191416] border border-stone-800 px-3 py-1.5 rounded-2xl">
            <img
              src={avatar.image}
              alt={activePlayer.name}
              className="w-7 h-7 rounded-lg object-contain border border-amber-400/50"
            />
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-bold">
                Turno de:
              </span>
              <span className="text-xs font-black text-amber-300 truncate block">
                {activePlayer.name}
              </span>
            </div>
            {streak > 0 && (
              <span className="ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🔥 {streak}
              </span>
            )}
          </div>

          {/* El Pozo Acumulado de Sorbos (The Pot) con fuego dinámico */}
          <div className={`flex items-center gap-2 bg-gradient-to-r ${potIntensity} border px-3.5 py-1.5 rounded-2xl shadow-md transition-all duration-300`}>
            <span className={`text-xl ${pot >= 6 ? 'animate-bounce' : 'animate-pulse'}`}>
              {pot >= 8 ? '🔥' : '🍺'}
            </span>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block leading-tight">
                Pozo Acumulado:
              </span>
              <span className="text-sm font-black text-white leading-tight">
                {pot} {pot === 1 ? 'Sorbo' : 'Sorbos'}
              </span>
            </div>
          </div>
        </div>

        {/* Mesa Central: La Carta Activa y Descarte */}
        <div className="w-full bg-[#120e10] border-2 border-cyan-500/30 rounded-2xl p-3 shadow-2xl flex flex-col items-center justify-center relative my-auto">
          {/* Contador de mazo restante */}
          <div className="absolute top-2.5 right-3 text-[10px] font-bold text-stone-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
            Mazo: <strong>{cardsRemaining}</strong> cartas
          </div>

          {/* Historial de cartas descartadas (cinta horizontal) */}
          <div className="absolute top-2.5 left-3 flex items-center gap-1">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Historial:</span>
            {discardPile.slice(-3).map((c, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/60 border border-white/10 ${
                  c.isRed ? 'text-red-400' : 'text-stone-300'
                }`}
              >
                {c.value}{c.suitSymbol}
              </span>
            ))}
          </div>

          {/* La Carta Central con animación 3D */}
          <div className="my-2 mt-4 sm:my-3 flex flex-col items-center">
            <div
              className={`w-28 h-40 sm:w-32 sm:h-44 rounded-2xl bg-stone-50 border-4 border-white shadow-2xl flex flex-col justify-between p-2.5 transition-transform duration-300 select-none ${
                isFlipping ? 'scale-90 rotate-6 opacity-60' : 'scale-100 rotate-0 opacity-100 shadow-cyan-900/30'
              }`}
            >
              <div className={`text-lg font-black leading-none ${isRed ? 'text-red-600' : 'text-stone-900'}`}>
                {currentCard?.value}
              </div>
              <div className="text-center text-5xl sm:text-6xl leading-none">
                {currentCard?.suitSymbol}
              </div>
              <div className={`text-lg font-black leading-none self-end rotate-180 ${isRed ? 'text-red-600' : 'text-stone-900'}`}>
                {currentCard?.value}
              </div>
            </div>

            <span className="text-xs font-black text-amber-300 mt-2 text-center truncate">
              {currentCard?.name}
            </span>
          </div>

          {/* Notificación de último resultado */}
          {lastResult && (
            <div
              className={`w-full max-w-sm p-2 rounded-xl text-center text-xs font-bold border transition animate-in fade-in duration-150 ${
                lastResult.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300 animate-shake'
              }`}
            >
              {lastResult.isCorrect ? (
                <span>
                  🎉 ¡Acertaste! <strong>Regalas {lastResult.sipsGifted} sorbo{lastResult.sipsGifted > 1 ? 's' : ''}</strong> a la mesa.
                </span>
              ) : (
                <span>
                  {lastResult.isTiePunishment
                    ? `💥 ¡CARTA GEMELA! Pozo duplicado. ¡Tómate ${lastResult.sipsToDrink} sorbos!`
                    : `❌ ¡Fallaste! Te bebes los ${lastResult.sipsToDrink} sorbos del pozo.`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3. Panel de Probabilidades y Botones de Apuesta */}
        <div className="w-full mt-2 flex flex-col gap-2">
          <div className="text-center">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              ¿Cómo será la siguiente carta?
            </span>
          </div>

          {/* Los 3 Botones Principales con Probabilidad en Vivo y Sorbos a Regalar */}
          <div className="grid grid-cols-3 gap-2">
            {/* Opción 1: MAYOR (⬆️) */}
            <button
              onClick={() => handleBet('mayor')}
              disabled={isFlipping}
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-cyan-950/70 to-stone-900 border-2 border-cyan-500/40 hover:border-cyan-400 hover:scale-[1.02] active:scale-95 transition-all text-center flex flex-col items-center justify-between shadow-lg cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-cyan-400 font-black text-xs sm:text-sm">
                <span>⬆️</span>
                <span>MAYOR</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white my-0.5">
                {odds.higher.percent}%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Regala +{odds.higher.sips}s
              </span>
            </button>

            {/* Opción 2: MISMO NÚMERO (🟰) */}
            <button
              onClick={() => handleBet('mismo')}
              disabled={isFlipping}
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-amber-950/70 to-stone-900 border-2 border-amber-500/40 hover:border-amber-400 hover:scale-[1.02] active:scale-95 transition-all text-center flex flex-col items-center justify-between shadow-lg cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-amber-400 font-black text-xs sm:text-sm">
                <span>🟰</span>
                <span>MISMO</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white my-0.5">
                {odds.same.percent}%
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                Regala +{odds.same.sips}s 🔥
              </span>
            </button>

            {/* Opción 3: MENOR (⬇️) */}
            <button
              onClick={() => handleBet('menor')}
              disabled={isFlipping}
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-rose-950/70 to-stone-900 border-2 border-rose-500/40 hover:border-rose-400 hover:scale-[1.02] active:scale-95 transition-all text-center flex flex-col items-center justify-between shadow-lg cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1 text-rose-400 font-black text-xs sm:text-sm">
                <span>⬇️</span>
                <span>MENOR</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-white my-0.5">
                {odds.lower.percent}%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Regala +{odds.lower.sips}s
              </span>
            </button>
          </div>

          {/* Botón de Decisión Estratégica: Plantarme y Pasar el Pozo */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handlePass}
              disabled={!canPass || isFlipping}
              className={`flex-1 py-2.5 rounded-2xl font-black text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                canPass
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:brightness-110 active:scale-95 text-stone-950 border-emerald-300 shadow-md shadow-emerald-500/20 cursor-pointer animate-pulse'
                  : 'bg-stone-900/60 border-stone-800 text-stone-500 opacity-50 cursor-not-allowed'
              }`}
              title={canPass ? 'Plántate y pásale el pozo caliente al siguiente jugador' : 'Acierta al menos 1 vez para poder plantarte'}
            >
              <span>🛡️</span>
              <span>
                {canPass
                  ? `PLANTARME Y PASAR POZO (${pot}s)`
                  : 'Plantarme (Acierta 1 para desbloquear)'}
              </span>
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer shrink-0"
              title="Reiniciar baraja y pozo"
            >
              <span>↺</span>
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 4. MODALES DE PASO 3: EXPLOSIÓN DE POZO & JACKPOT GEMELO  */}
      {/* ========================================================= */}
      {explosionModalData && (
        <PozoExplosionModal
          data={explosionModalData}
          onClose={() => setExplosionModalData(null)}
        />
      )}

      {jackpotModalData && (
        <JackpotMismoModal
          data={jackpotModalData}
          onClose={() => setJackpotModalData(null)}
        />
      )}
    </div>
  );
}
