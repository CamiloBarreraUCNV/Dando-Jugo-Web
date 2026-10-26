import React, { useState } from 'react';
import { CuartoReyDeckManager, CARD_RULES } from '../utils/cuartoReyDeck';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

/**
 * Componente Visual de la Copa del Káiser con nivel de líquido progresivo y burbujas
 */
function KingCupVisual({ kingsDrawn, cupLevel, isGameOver }) {
  // Gradiente de líquido dinámico según cantidad de reyes
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
      {/* Capas decorativas de cartas para dar efecto 3D de baraja apilada */}
      <div className="relative group cursor-pointer" onClick={!disabled && !isDrawing ? onDraw : undefined}>
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
          {/* Esquinas decoradas con diseño de baraja */}
          <div className="w-full flex items-center justify-between text-amber-500/60 text-xs font-serif font-black">
            <span>♠ ♥</span>
            <span>♦ ♣</span>
          </div>

          {/* Logo Central de Dando Jugo */}
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
              ¡Toca para sacar!
            </span>
          </div>

          {/* Contador inferior */}
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
 * Componente Principal del Juego Cuarto Rey (Paso 2)
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
  const [lastDrawnCard, setLastDrawnCard] = useState(null);

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

  // Extraer carta
  const handleDrawCard = () => {
    if (isDrawing || stats.isGameOver) return;
    setIsDrawing(true);
    soundManager.playTick(800);

    const card = deckManager.drawCard();
    if (card) {
      setLastDrawnCard(card);
      setStats(deckManager.getStats());
      if (players.length > 0) {
        setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      }
    }
    setIsDrawing(false);
  };

  // Reiniciar partida
  const handleResetGame = () => {
    if (window.confirm('¿Deseas reiniciar la baraja y vaciar la Copa del Káiser?')) {
      soundManager.playTick(500);
      deckManager.reset();
      setStats(deckManager.getStats());
      setLastDrawnCard(null);
      setCurrentPlayerIndex(0);
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

      {/* 2. Banner del Jugador en Turno */}
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
          onClick={handleResetGame}
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
                className="text-stone-400 hover:text-white font-bold p-1 rounded-lg"
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
              className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider transition"
            >
              Cerrar y Continuar Jugando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
