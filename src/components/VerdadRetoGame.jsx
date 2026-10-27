import React, { useState, useEffect } from 'react';
import { verdadRetoManager, INTENSITY_LEVELS } from '../utils/verdadRetoData';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { soundManager } from '../utils/soundEffects';

/**
 * Modal de Revelación Dramática de Verdad o Reto (Pasos 3 y 4)
 */
function VerdadRetoRevealModal({
  card,
  activePlayer,
  onFulfilled,
  onChickened,
  onClose,
}) {
  const isVerdad = card.tipo === 'verdad';

  // Sonido específico al abrir
  useEffect(() => {
    if (isVerdad) {
      soundManager.playTruthReveal();
    } else {
      soundManager.playDareReveal();
    }
  }, [isVerdad]);

  // Soporte de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!card) return null;

  const playerAvatar = getAnimalAvatar(activePlayer?.animal);
  const targetAvatar = card.targetPlayer ? getAnimalAvatar(card.targetPlayer.animal) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Resplandor ambiental de fondo */}
      <div
        className={`absolute inset-0 bg-radial pointer-events-none transition-all duration-700 ${
          isVerdad
            ? 'from-cyan-500/15 via-sky-950/20 to-transparent'
            : 'from-rose-500/20 via-red-950/25 to-transparent'
        }`}
      />

      <div
        className={`w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative z-10 flex flex-col justify-between border-2 animate-in zoom-in-95 duration-200 ${
          isVerdad
            ? 'border-cyan-400/80 shadow-cyan-900/50 bg-gradient-to-b from-[#0e1924] via-[#091118] to-[#04080c] text-cyan-50'
            : 'border-rose-500/80 shadow-rose-950/60 bg-gradient-to-b from-[#240e13] via-[#17090c] to-[#0a0406] text-rose-50'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">{isVerdad ? '😇' : '😈'}</span>
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isVerdad
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}
            >
              {isVerdad ? 'VERDAD' : 'RETO'}
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            {card.nivelInfo.icon} {card.nivelInfo.tag}
          </span>
        </div>

        {/* Ficha del Jugador en Turno */}
        <div className="flex items-center gap-2 mb-2 p-1.5 rounded-xl bg-black/40 border border-white/5">
          <img
            src={playerAvatar.image}
            alt={playerAvatar.name}
            className="w-6 h-6 rounded-md object-contain border border-amber-400/60"
          />
          <span className="text-xs text-stone-300 truncate">
            Turno de <strong className="text-amber-300">{activePlayer.name}</strong>
          </span>
        </div>

        {/* Contenido Central: Pregunta o Reto */}
        <div className="my-auto py-3 text-center flex flex-col items-center">
          <span className="text-4xl sm:text-5xl mb-2 drop-shadow-md">
            {isVerdad ? '✨' : '🔥'}
          </span>
          <h3
            className={`font-display font-black text-sm uppercase tracking-widest mb-2 ${
              isVerdad ? 'text-cyan-300' : 'text-rose-300'
            }`}
          >
            {isVerdad ? '¡MOMENTO DE CONFESIÓN!' : '¡DESAFÍO EN LA MESA!'}
          </h3>
          <p className="text-base sm:text-lg font-medium leading-relaxed drop-shadow text-white">
            "{card.texto}"
          </p>

          {/* Cómplice o víctima destacada */}
          {card.targetPlayer && (
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs font-bold text-amber-200 animate-pulse">
              {targetAvatar && (
                <img
                  src={targetAvatar.image}
                  alt={targetAvatar.name}
                  className="w-5 h-5 rounded object-contain border border-amber-400"
                />
              )}
              <span>
                Cómplice asignado: <strong>{card.targetPlayer.name}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Footer de la tarjeta con los botones de resolución (Paso 4) */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5 mb-1">
            <span>🐔 Castigo si arruga:</span>
            <strong className="text-amber-300 font-bold">
              {card.castigoSorbos} sorbos de trago
            </strong>
          </div>

          {/* Botones de Resolución para la mesa */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Opción 1: Cumplió */}
            <button
              onClick={onFulfilled}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 text-stone-950 font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 border border-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Cumplió con éxito la verdad o el reto"
            >
              <span>✅</span>
              <span>¡Cumplió!</span>
            </button>

            {/* Opción 2: Arrugó */}
            <button
              onClick={onChickened}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:brightness-110 active:scale-95 text-white font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/40 border border-rose-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="No se atrevió o se negó a responder"
            >
              <span>🐔</span>
              <span>¡Arrugó!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal de Cobro de Castigo ("¡Arrugó!") (Paso 4)
 */
function ArruguePenaltyModal({ card, activePlayer, onPenaltyPaid }) {
  const avatar = getAnimalAvatar(activePlayer?.animal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="absolute inset-0 bg-radial from-amber-600/20 via-red-950/25 to-transparent pointer-events-none animate-pulse" />

      <div className="w-full max-w-sm bg-[#181114] border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl shadow-amber-950/80 relative z-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider mb-2 animate-bounce">
          <span>🐔 ¡GALLINA A LA VISTA! 🐔</span>
        </div>

        <span className="text-5xl my-1 animate-pulse">🐔🍺</span>

        <h3 className="font-display font-black text-2xl text-white tracking-wide uppercase drop-shadow mt-1">
          ¡A PAGAR EL CASTIGO!
        </h3>

        <div className="w-full bg-black/50 border border-amber-500/40 rounded-2xl p-3.5 my-3 flex items-center gap-3">
          <img
            src={avatar.image}
            alt={avatar.name}
            className="w-12 h-12 object-contain rounded-xl bg-stone-900 p-1 border border-amber-400 drop-shadow shrink-0"
          />
          <div className="text-left min-w-0">
            <span className="text-xs text-amber-300 font-bold block truncate">
              {activePlayer.name} no se atrevió
            </span>
            <span className="text-xs text-stone-300 block leading-tight">
              Debe beber <strong className="text-red-400 text-sm font-black">{card.castigoSorbos} sorbos</strong> de su trago ahora mismo.
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-400 mb-4 italic">
          "El que arruga en esta mesa, paga con jugo."
        </p>

        <button
          onClick={onPenaltyPaid}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 font-display font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 border border-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🍻</span>
          <span>¡Sorbos Pagados! (Siguiente Jugador)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Componente Principal de Verdad o Reto
 */
export default function VerdadRetoGame({
  players = [],
  onBack,
  onOpenSettings,
}) {
  const [currentLevel, setCurrentLevel] = useState('clasico');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [consecutiveVerdades, setConsecutiveVerdades] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [chickenPenaltyCard, setChickenPenaltyCard] = useState(null);

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
    // Control de racha anti-arrugue (máximo 2 verdades seguidas)
    if (tipo === 'verdad' && consecutiveVerdades >= 2) {
      alert(
        `⚠️ ¡${activePlayer.name}, ya elegiste Verdad 2 veces seguidas! Por regla de la casa, debes elegir RETO obligatoriamente.`
      );
      return;
    }

    const card = verdadRetoManager.drawCard(tipo, currentLevel, activePlayer, players);
    setActiveCard(card);

    if (tipo === 'verdad' || card.tipo === 'verdad') {
      setConsecutiveVerdades((prev) => prev + 1);
    } else {
      setConsecutiveVerdades(0);
    }
  };

  // 1. Caso Cumplido (Paso 4): Fanfarria y pase de turno con honor
  const handleFulfilled = () => {
    soundManager.playSuccess();
    setActiveCard(null);
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  // 2. Caso Arrugó (Paso 4): Sonido de gallina y activación del cobro de castigo
  const handleChickened = () => {
    soundManager.playChickenPenalty();
    setChickenPenaltyCard(activeCard);
    setActiveCard(null);
  };

  // 3. Castigo pagado
  const handlePenaltyPaid = () => {
    soundManager.playTick(600);
    setChickenPenaltyCard(null);
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
                setActiveCard(null);
                setChickenPenaltyCard(null);
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
      </main>

      {/* 5. Footer con información del mazo */}
      <footer className="w-full py-1.5 flex items-center justify-between border-t border-stone-800/80 shrink-0 text-xs text-stone-400">
        <span>Nivel: <strong className="text-stone-200">{activeLevelObj.name}</strong></span>
        <span>🐔 Arrugar: <strong className="text-amber-400">{activeLevelObj.penaltySips} sorbos</strong></span>
      </footer>

      {/* Modal de Revelación Dramática con Botones Cumplió / Arrugó (Paso 4) */}
      {activeCard && (
        <VerdadRetoRevealModal
          card={activeCard}
          activePlayer={activePlayer}
          onFulfilled={handleFulfilled}
          onChickened={handleChickened}
          onClose={() => setActiveCard(null)}
        />
      )}

      {/* Modal de Cobro de Castigo (Paso 4) */}
      {chickenPenaltyCard && (
        <ArruguePenaltyModal
          card={chickenPenaltyCard}
          activePlayer={activePlayer}
          onPenaltyPaid={handlePenaltyPaid}
        />
      )}
    </div>
  );
}
