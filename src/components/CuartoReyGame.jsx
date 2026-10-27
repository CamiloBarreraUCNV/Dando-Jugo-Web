import React, { useState, useEffect } from 'react';
import { CuartoReyDeckManager, CARD_RULES } from '../utils/cuartoReyDeck';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

/**
 * Componente Visual de la Copa del Káiser con nivel de líquido progresivo y burbujas
 */
function KingCupVisual({ kingsDrawn, cupLevel, isGameOver }) {
  const liquidGradient =
    kingsDrawn === 0
      ? 'from-transparent via-amber-500/10 to-transparent'
      : kingsDrawn === 1
      ? 'from-amber-600 via-yellow-500 to-amber-700'
      : kingsDrawn === 2
      ? 'from-amber-700 via-orange-600 to-amber-800'
      : kingsDrawn === 3
      ? 'from-red-800 via-rose-700 to-amber-800'
      : 'from-red-600 via-rose-600 to-purple-800';

  return (
    <div className="relative flex flex-col items-center justify-center py-1">
      {/* Resplandor ambiental de la copa */}
      <div
        className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-700 ${
          isGameOver
            ? 'bg-red-600/40 animate-pulse'
            : kingsDrawn === 3
            ? 'bg-amber-600/30 animate-pulse'
            : kingsDrawn > 0
            ? 'bg-amber-500/20'
            : 'bg-transparent'
        }`}
      />

      {/* Estructura del Vaso de Cristal Speakeasy */}
      <div className="relative w-28 sm:w-32 h-36 sm:h-40 bg-white/5 border-2 border-stone-500/40 rounded-b-3xl rounded-t-lg backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col justify-end p-1">
        {/* Borde del vaso con brillo metálico */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Marcadores de Reyes en el cristal (25%, 50%, 75%, 100%) */}
        <div className="absolute inset-y-0 right-1.5 flex flex-col justify-between py-2 text-[9px] font-black text-stone-500/60 select-none pointer-events-none z-10">
          <span className="text-red-400/80">K4 • 100%</span>
          <span className="text-amber-400/80">K3 • 75%</span>
          <span className="text-amber-300/70">K2 • 50%</span>
          <span className="text-yellow-300/60">K1 • 25%</span>
        </div>

        {/* Líquido animado con altura según cupLevel */}
        <div
          className={`w-full rounded-b-2xl transition-all duration-700 ease-out relative overflow-hidden bg-gradient-to-t ${liquidGradient} ${
            isGameOver ? 'animate-pulse' : ''
          }`}
          style={{ height: `${Math.max(6, cupLevel)}%` }}
        >
          {/* Espuma / Burbujas en la superficie */}
          {cupLevel > 0 && (
            <div className="absolute top-0 inset-x-0 h-2 bg-white/40 backdrop-blur-xs flex items-center justify-around overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
              <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" />
              <span className="w-2 h-1 rounded-full bg-white/60 animate-pulse" />
            </div>
          )}

          {/* Burbujas flotando dentro del líquido */}
          {cupLevel > 15 && (
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1 left-3 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-white absolute bottom-2 right-4 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-white absolute top-2 left-6 animate-ping" />
            </div>
          )}
        </div>

        {/* Reflejo de cristal frontal */}
        <div className="absolute inset-y-0 left-2 w-1.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full pointer-events-none" />
      </div>

      {/* Base sólida del vaso */}
      <div className="w-20 sm:w-24 h-2.5 bg-stone-700/80 rounded-full border border-stone-500/50 shadow-md mt-1" />

      {/* Estado y etiqueta de la Copa */}
      <div className="mt-2 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${
            isGameOver
              ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse'
              : kingsDrawn === 3
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
              : kingsDrawn > 0
              ? 'bg-stone-900/90 text-amber-400 border-amber-500/30'
              : 'bg-stone-900/80 text-stone-400 border-stone-800'
          }`}
        >
          <span>👑</span>
          <span>
            {kingsDrawn === 0
              ? 'Copa Vacía (0/4 Reyes)'
              : kingsDrawn === 4
              ? '¡Copa Llena! Fondo Blanco'
              : `Copa al ${cupLevel}% (${kingsDrawn}/4 Reyes)`}
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * Vista de la Baraja de Cartas Apilada en 3D
 */
function CardDeckStack({ cardsRemaining, onDraw, isDrawing, disabled }) {
  return (
    <div className="relative flex flex-col items-center justify-center my-2">
      <div
        className="relative group cursor-pointer"
        onClick={!disabled && !isDrawing ? onDraw : undefined}
      >
        {cardsRemaining > 3 && (
          <div className="absolute -inset-1 translate-x-2 translate-y-2 bg-[#120e10] border border-amber-900/40 rounded-2xl shadow-md rotate-3" />
        )}
        {cardsRemaining > 2 && (
          <div className="absolute -inset-1 -translate-x-1.5 translate-y-1.5 bg-[#171214] border border-amber-900/50 rounded-2xl shadow-lg -rotate-2" />
        )}
        {cardsRemaining > 1 && (
          <div className="absolute -inset-0.5 translate-x-1 translate-y-1 bg-[#1e171b] border border-amber-800/60 rounded-2xl shadow-lg rotate-1" />
        )}

        {/* Carta Superior del Mazo */}
        <div
          className={`relative w-40 sm:w-48 h-56 sm:h-64 rounded-2xl p-3 border-2 border-amber-500/70 bg-gradient-to-br from-amber-950 via-[#1b1418] to-stone-950 shadow-2xl flex flex-col items-center justify-between transition-all duration-200 ${
            disabled
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:scale-105 active:scale-95 hover:border-amber-400 shadow-amber-500/15'
          }`}
        >
          <div className="w-full flex items-center justify-between text-amber-500/60 text-xs font-serif font-black">
            <span>♠ ♥</span>
            <span>♦ ♣</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={logoImg}
              alt="Dando Jugo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md mb-1 opacity-90 group-hover:scale-110 transition-transform"
            />
            <span className="font-display font-black text-xs sm:text-sm text-amber-400 tracking-wider uppercase">
              Cuarto Rey
            </span>
            <span className="text-[10px] text-amber-200/60 font-sans mt-0.5">
              {disabled ? 'Partida Finalizada' : '¡Toca para destapar!'}
            </span>
          </div>

          <div className="w-full text-center border-t border-amber-900/50 pt-1.5">
            <span className="text-[11px] font-bold text-amber-300/80">
              🃏 {cardsRemaining} cartas restantes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de Revelación con Animación de Volteo 3D (Pasos 3 y 4)
 */
function CardRevealModal({ card, activePlayer, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Inicia el giro 3D apenas monta el modal
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
    }, 50);

    // Audio: Si es el 4to Rey, clímax dramático; si es rey 1 al 3, vertido de líquido
    if (card?.isFourthKing) {
      const climaxTimer = setTimeout(() => {
        soundManager.playFourthKingClimax();
      }, 300);
      return () => {
        clearTimeout(flipTimer);
        clearTimeout(climaxTimer);
      };
    } else if (card?.isKing) {
      const pourTimer = setTimeout(() => {
        soundManager.playPourDrink();
      }, 350);
      return () => {
        clearTimeout(flipTimer);
        clearTimeout(pourTimer);
      };
    }

    return () => clearTimeout(flipTimer);
  }, [card]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!card) return null;

  const isRed = card.suit.color === 'red';
  const suitSymbol = card.suit.symbol;
  const avatar = getAnimalAvatar(activePlayer?.animal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenedor con Perspectiva 3D */}
        <div
          className="relative w-64 sm:w-72 h-96 sm:h-[420px]"
          style={{ perspective: '1200px' }}
        >
          {/* Tarjeta con transformación 3D */}
          <div
            className="w-full h-full relative transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* CARA TRASERA (Dando Jugo Logo Speakeasy) */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl p-4 border-2 border-amber-500/70 bg-gradient-to-br from-amber-950 via-[#191216] to-stone-950 shadow-2xl flex flex-col items-center justify-between"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="w-full flex justify-between text-amber-500/60 text-xs font-serif font-black">
                <span>♠ ♥</span>
                <span>♦ ♣</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={logoImg}
                  alt="Dando Jugo"
                  className="w-20 h-20 object-contain drop-shadow-lg mb-2"
                />
                <span className="font-display font-black text-sm text-amber-400 tracking-widest uppercase">
                  Cuarto Rey
                </span>
                <span className="text-xs text-amber-200/60 mt-1">¡Revelando carta...!</span>
              </div>
              <div className="w-full text-center border-t border-amber-900/50 pt-2 text-[10px] text-amber-300/70 font-bold uppercase tracking-wider">
                Dando Jugo Oficial
              </div>
            </div>

            {/* CARA DELANTERA (Naipe Revelado rotado 180deg) */}
            <div
              className={`absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-5 border-2 ${
                card.isFourthKing
                  ? 'border-red-500 shadow-2xl shadow-red-600/50 bg-gradient-to-b from-[#240e13] via-[#150a0d] to-[#0a0507]'
                  : 'border-amber-400/80 shadow-2xl shadow-amber-500/20 bg-gradient-to-b from-[#1b1518] via-[#120d10] to-[#0a0709]'
              } flex flex-col justify-between text-stone-100`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Esquina Superior Izquierda: Valor y Palo */}
              <div className="w-full flex items-center justify-between">
                <div
                  className={`flex flex-col items-center leading-none ${
                    card.isFourthKing
                      ? 'text-red-400 animate-pulse'
                      : isRed
                      ? 'text-red-500'
                      : 'text-amber-400'
                  }`}
                >
                  <span className="font-display font-black text-2xl sm:text-3xl tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-xl sm:text-2xl mt-0.5">{suitSymbol}</span>
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    card.isFourthKing
                      ? 'bg-red-500/25 text-red-200 border-red-500/50 animate-bounce'
                      : 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                  }`}
                >
                  {card.isFourthKing ? '💀 FONDO BLANCO' : card.rule.badge}
                </span>
              </div>

              {/* Centro de la Carta: Icono, Título y Dinámica */}
              <div className="flex flex-col items-center text-center my-auto py-2">
                <span className="text-4xl sm:text-5xl mb-2 drop-shadow-md">
                  {card.isFourthKing ? '👑💀' : card.rule.icon}
                </span>
                <h3
                  className={`font-display font-black text-lg sm:text-xl tracking-wide uppercase drop-shadow mb-1.5 ${
                    card.isFourthKing ? 'text-red-400 animate-pulse' : 'text-white'
                  }`}
                >
                  {card.rule.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-[240px]">
                  {card.rule.description}
                </p>

                {/* Si es un Rey (1 al 3): Banner especial de advertencia */}
                {card.isKing && !card.isFourthKing && (
                  <div className="mt-3 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-[11px] font-bold text-amber-300 animate-pulse flex items-center gap-1.5">
                    <span>👑</span>
                    <span>¡Rey #{card.kingNumber} de 4 en la copa!</span>
                  </div>
                )}

                {/* Si es el 4.º Rey */}
                {card.isFourthKing && (
                  <div className="mt-3 px-3 py-1.5 rounded-xl bg-red-500/30 border border-red-400 text-xs font-black text-red-200 animate-pulse flex items-center gap-1.5">
                    <span>💀</span>
                    <span>¡EL VASO ES TODO TUYO!</span>
                  </div>
                )}
              </div>

              {/* Esquina Inferior Derecha: Valor y Palo invertidos */}
              <div className="w-full flex items-end justify-between border-t border-stone-800/80 pt-2">
                <div className="flex items-center gap-1.5 text-stone-400 text-[10px]">
                  <span>Palo:</span>
                  <strong className={isRed ? 'text-red-400' : 'text-amber-300'}>
                    {card.suit.name} {suitSymbol}
                  </strong>
                </div>

                <div
                  className={`flex flex-col items-center leading-none rotate-180 ${
                    card.isFourthKing
                      ? 'text-red-400'
                      : isRed
                      ? 'text-red-500'
                      : 'text-amber-400'
                  }`}
                >
                  <span className="font-display font-black text-xl tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-lg mt-0.5">{suitSymbol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ficha del Jugador que sacó la carta y Botón de Acción */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
            <img
              src={avatar.image}
              alt={avatar.name}
              className="w-4 h-4 rounded object-contain border border-amber-400/60"
            />
            <span>
              Carta sacada por <strong className="text-amber-300">{activePlayer.name}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              card.isFourthKing
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white shadow-red-600/30 border border-red-400'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-stone-950 shadow-amber-500/25 border border-amber-300'
            }`}
          >
            <span>{card.isFourthKing ? '☠️ Ver Castigo del Fondo Blanco' : 'Siguiente Jugador'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de Clímax Épico del 4.º Rey (Paso 4)
 * Muestra la copa al 100%, la víctima señalada y opciones de reinicio
 */
function FourthKingClimaxModal({
  victimPlayer,
  stats,
  onResetGame,
  onExit,
}) {
  const avatar = getAnimalAvatar(victimPlayer?.animal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      {/* Resplandor ominoso de fondo */}
      <div className="absolute inset-0 bg-radial from-red-600/25 via-rose-950/20 to-transparent pointer-events-none animate-pulse" />

      <div className="w-full max-w-md bg-[#161214] border-2 border-red-500/80 rounded-3xl p-6 shadow-2xl shadow-red-950/80 relative z-10 flex flex-col items-center text-center">
        {/* Cabecera dramática */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black uppercase tracking-wider mb-2 animate-bounce">
          <span>👑💀</span>
          <span>EL 4.° REY HA CAÍDO</span>
          <span>💀👑</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase drop-shadow mb-1">
          ¡FONDO BLANCO!
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mb-4">
          La Copa del Káiser está al 100% y ya tiene dueño en la mesa
        </p>

        {/* Copa del Káiser en su estado final desbordante */}
        <div className="my-2">
          <KingCupVisual kingsDrawn={4} cupLevel={100} isGameOver={true} />
        </div>

        {/* La Víctima Spotlight */}
        <div className="w-full bg-[#1e1418] border-2 border-red-500/60 rounded-2xl p-4 my-3 flex items-center gap-3.5 shadow-lg">
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-14 h-14 object-contain rounded-xl bg-black/70 p-1 border-2 border-red-400 drop-shadow shrink-0"
          />
          <div className="text-left min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
              ¡LA COPA ES PARA TI!
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl text-white truncate">
                {victimPlayer?.name}
              </span>
              <span className="text-sm">
                {victimPlayer?.gender === 'mujer' ? '👩' : victimPlayer?.gender === 'hombre' ? '👨' : '🧑'}
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5 leading-tight">
              Debes tomarte la copa central <strong>completa al seco</strong> sin parar.
            </p>
          </div>
        </div>

        {/* Resumen de la Partida */}
        <div className="w-full grid grid-cols-3 gap-2 my-2 text-stone-400 text-xs">
          <div className="bg-black/50 border border-stone-800 rounded-xl p-2 flex flex-col items-center">
            <span className="text-[10px] text-stone-500">Cartas jugadas</span>
            <strong className="text-stone-200 text-sm font-black">{stats.discards}</strong>
          </div>
          <div className="bg-black/50 border border-stone-800 rounded-xl p-2 flex flex-col items-center">
            <span className="text-[10px] text-stone-500">Reyes totales</span>
            <strong className="text-amber-400 text-sm font-black">4 / 4</strong>
          </div>
          <div className="bg-black/50 border border-stone-800 rounded-xl p-2 flex flex-col items-center">
            <span className="text-[10px] text-stone-500">Castigo</span>
            <strong className="text-red-400 text-sm font-black">Al Seco</strong>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="w-full flex flex-col gap-2 mt-3">
          <button
            onClick={onResetGame}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 font-display font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/25 border border-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔄</span>
            <span>Jugar Otra Partida (Vaciar Copa)</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-300 hover:text-white font-bold text-xs border border-stone-700/80 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Volver a Otros Juegos</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente Principal del Juego Cuarto Rey
 */
export default function CuartoReyGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  const [deckManager] = useState(() => new CuartoReyDeckManager());
  const [stats, setStats] = useState(() => deckManager.getStats());
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealedCard, setRevealedCard] = useState(null);
  const [victimPlayer, setVictimPlayer] = useState(null);
  const [showClimaxModal, setShowClimaxModal] = useState(false);

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

  // Extraer carta y activar animación 3D de volteo
  const handleDrawCard = () => {
    if (isDrawing || stats.isGameOver) return;
    setIsDrawing(true);
    soundManager.playCardFlip();

    const card = deckManager.drawCard();
    if (card) {
      if (card.isFourthKing) {
        setVictimPlayer(activePlayer);
      }
      setRevealedCard(card);
      setStats(deckManager.getStats());
    }
    setIsDrawing(false);
  };

  // Cerrar la carta revelada y avanzar el turno o activar clímax del 4.º Rey
  const handleCloseCard = () => {
    soundManager.playTick(600);
    const wasFourth = revealedCard?.isFourthKing;
    setRevealedCard(null);

    if (wasFourth) {
      setShowClimaxModal(true);
    } else if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  // Reiniciar partida completa
  const handleResetGame = () => {
    soundManager.playSuccess();
    deckManager.reset();
    setStats(deckManager.getStats());
    setRevealedCard(null);
    setShowClimaxModal(false);
    setVictimPlayer(null);
    setCurrentPlayerIndex(0);
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
            <span className="text-lg">👑</span>
            <h2 className="font-display font-black text-sm sm:text-base text-amber-400 tracking-wide truncate">
              Cuarto Rey
            </h2>
          </div>
          <span className="text-[10px] text-stone-400 block truncate">
            Copa del Káiser • {stats.remaining} cartas restantes
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCheatSheet(true)}
            className="text-xs bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-amber-300 font-bold px-2.5 py-1.5 rounded-xl border border-stone-700/80 transition cursor-pointer"
            title="Ver Reglas de las Cartas"
          >
            📖
          </button>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-sm bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-300 font-bold p-1.5 rounded-xl border border-stone-700/80 transition cursor-pointer"
              title="Ajustes"
            >
              ⚙️
            </button>
          )}
        </div>
      </header>

      {/* Banner de Aviso cuando el juego termina (4.º Rey) */}
      {stats.isGameOver && (
        <div className="w-full bg-red-950/80 border-2 border-red-500/80 rounded-2xl p-2.5 flex items-center justify-between text-xs my-1 animate-pulse shadow-lg shadow-red-950/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0">👑💀</span>
            <div className="min-w-0">
              <strong className="text-white block font-display tracking-wide truncate">
                ¡PARTIDA FINALIZADA!
              </strong>
              <span className="text-red-200 truncate block">
                La Copa es para <strong>{victimPlayer?.name || activePlayer.name}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowClimaxModal(true)}
            className="text-xs bg-red-500 hover:bg-red-400 text-stone-950 font-black px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
          >
            Ver Castigo
          </button>
        </div>
      )}

      {/* 2. Banner del Jugador en Turno */}
      {!stats.isGameOver && (
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
      )}

      {/* 3. Área Central: La Copa del Káiser + El Mazo 3D */}
      <main className="w-full flex-1 min-h-0 flex flex-col items-center justify-around py-1 overflow-hidden">
        {/* La Copa del Káiser animada */}
        <KingCupVisual
          kingsDrawn={stats.kingsDrawn}
          cupLevel={stats.cupLevel}
          isGameOver={stats.isGameOver}
        />

        {/* Mazo táctil de cartas */}
        <CardDeckStack
          cardsRemaining={stats.remaining}
          onDraw={handleDrawCard}
          isDrawing={isDrawing}
          disabled={stats.isGameOver}
        />
      </main>

      {/* 4. Footer con Controles y Ayuda */}
      <footer className="w-full py-1.5 flex items-center justify-between border-t border-stone-800/80 shrink-0 text-xs text-stone-400">
        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar la baraja y vaciar la Copa del Káiser?')) {
              handleResetGame();
            }
          }}
          className="text-stone-400 hover:text-red-400 font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <span>🔄</span>
          <span>Reiniciar Mazo</span>
        </button>

        <button
          onClick={() => setShowCheatSheet(true)}
          className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
        >
          Ver Tabla de Reglas
        </button>
      </footer>

      {/* Modal de Revelación de Carta con Giro 3D */}
      {revealedCard && (
        <CardRevealModal
          card={revealedCard}
          activePlayer={activePlayer}
          onClose={handleCloseCard}
        />
      )}

      {/* Modal de Clímax Épico del 4.º Rey (Paso 4) */}
      {showClimaxModal && (
        <FourthKingClimaxModal
          victimPlayer={victimPlayer || activePlayer}
          stats={stats}
          onResetGame={handleResetGame}
          onExit={onBack}
        />
      )}

      {/* Modal de Tabla de Reglas (Cheat Sheet de Cartas) */}
      {showCheatSheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowCheatSheet(false)}
        >
          <div
            className="w-full max-w-md bg-[#161214] border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h3 className="font-display font-black text-base text-amber-400">
                  Reglas del Cuarto Rey
                </h3>
              </div>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="text-stone-400 hover:text-white font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {Object.values(CARD_RULES).map((r) => (
                <div
                  key={r.value}
                  className="bg-black/40 border border-stone-800/80 rounded-xl p-2.5 flex items-start gap-2.5 text-xs"
                >
                  <span className="text-2xl p-1 bg-stone-900 rounded-lg shrink-0">
                    {r.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-amber-300 font-black">
                        {r.label}: {r.title}
                      </strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-stone-300 font-semibold">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-stone-300 mt-0.5 leading-snug">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCheatSheet(false)}
              className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Cerrar y Continuar Jugando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
