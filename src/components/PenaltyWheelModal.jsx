import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { deckManager, GAME_MODES } from '../utils/deckManager';
import confetti from 'canvas-confetti';

export const PENALTY_CONFIGS = {
  vasito: [
    { id: 'nada', label: 'NADA (80%)', prob: 80, word: '¡Te Salvaste! (Nada)', icon: '🍀', color: '#059669' },
    { id: '1_sorbo', label: '1 SORBO (10%)', prob: 10, word: 'Toma 1 Sorbo', icon: '🍺', color: '#1d4ed8' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, word: '¡Te Toca Reto!', icon: '🎭', color: '#9333ea' },
  ],
  caja: [
    { id: 'nada', label: 'NADA (50%)', prob: 50, word: '¡Te Salvaste! (Nada)', icon: '🍀', color: '#059669' },
    { id: 'reto', label: 'RETO (25%)', prob: 25, word: '¡Te Toca Reto!', icon: '🎭', color: '#9333ea' },
    { id: '2_sorbos', label: '2 SORBOS (10%)', prob: 10, word: 'Toma 2 Sorbos', icon: '🍺', color: '#1d4ed8' },
    { id: '5_sorbos', label: '5 SORBOS (10%)', prob: 10, word: 'Toma 5 Sorbos', icon: '🍻', color: '#d97706' },
    { id: 'al_seco', label: 'AL SECO (5%)', prob: 5, word: '¡Vaso al Seco!', icon: '💀', color: '#b91c1c' },
  ],
  chimbombo: [
    { id: 'nada', label: 'NADA (30%)', prob: 30, word: '¡Te Salvaste! (Nada)', icon: '🍀', color: '#059669' },
    { id: '5_sorbos', label: '5 SORBOS (30%)', prob: 30, word: 'Toma 5 Sorbos', icon: '🍻', color: '#d97706' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, word: '¡Te Toca Reto!', icon: '🎭', color: '#9333ea' },
    { id: '10_sorbos', label: '10 SORBOS (10%)', prob: 10, word: 'Toma 10 Sorbos', icon: '🔥', color: '#1d4ed8' },
    { id: 'al_seco', label: 'AL SECO (20%)', prob: 20, word: '¡Vaso al Seco!', icon: '💀', color: '#b91c1c' },
  ],
  camion: [
    { id: 'al_seco', label: 'AL SECO (50%)', prob: 50, word: '¡Vaso al Seco!', icon: '💀', color: '#b91c1c' },
    { id: '5_sorbos', label: '5 SORBOS (20%)', prob: 20, word: 'Toma 5 Sorbos', icon: '🍻', color: '#d97706' },
    { id: '10_sorbos', label: '10 SORBOS (10%)', prob: 10, word: 'Toma 10 Sorbos', icon: '🔥', color: '#1d4ed8' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, word: '¡Te Toca Reto!', icon: '🎭', color: '#9333ea' },
    { id: 'nada', label: 'NADA (10%)', prob: 10, word: '¡Te Salvaste! (Nada)', icon: '🍀', color: '#059669' },
  ],
};

export default function PenaltyWheelModal({ isOpen, onClose, currentMode }) {
  const frameRef = useRef(null);
  const stripRef = useRef(null);
  const cell0Ref = useRef(null);
  const cell1Ref = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [retoDetalle, setRetoDetalle] = useState(null);
  const [isStopped, setIsStopped] = useState(false);

  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];
  const slices = PENALTY_CONFIGS[currentMode] || PENALTY_CONFIGS.caja;

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setRetoDetalle(null);
      setIsStopped(false);
      return;
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSpinning) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSpinning, onClose]);

  useEffect(() => {
    if (isOpen && cell0Ref.current && slices.length > 0) {
      paintCell(cell0Ref.current, slices[0]);
    }
  }, [isOpen, slices]);

  const paintCell = (cell, item) => {
    if (!cell || !item) return;
    const iconEl = cell.querySelector('.reel-icon');
    const wordEl = cell.querySelector('.reel-word');
    const badgeEl = cell.querySelector('.reel-badge');
    if (iconEl) iconEl.textContent = item.icon;
    if (wordEl) wordEl.textContent = item.word;
    if (badgeEl) {
      badgeEl.textContent = item.label;
      badgeEl.style.backgroundColor = item.color;
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const spinPenalty = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsStopped(false);
    setResult(null);
    setRetoDetalle(null);
    soundManager.init();

    const frame = frameRef.current;
    const strip = stripRef.current;
    const cell0 = cell0Ref.current;
    const cell1 = cell1Ref.current;

    if (!frame || !strip || !cell0 || !cell1) {
      setIsSpinning(false);
      return;
    }

    frame.classList.remove('stopped');

    // Selección ponderada de castigo según probabilidades del modo
    const rand = Math.random() * 100;
    let accumulated = 0;
    let targetSlice = slices[0];
    let targetIndex = 0;

    for (let i = 0; i < slices.length; i++) {
      accumulated += slices[i].prob;
      if (rand <= accumulated) {
        targetSlice = slices[i];
        targetIndex = i;
        break;
      }
    }

    const totalSteps = 16;
    let currentPos = 0;

    for (let step = 0; step < totalSteps; step++) {
      const isLast = step === totalSteps - 1;
      const nextIndex = isLast ? targetIndex : (currentPos + 1 + Math.floor(Math.random() * 2)) % slices.length;
      const nextSlice = slices[nextIndex];

      paintCell(cell1, nextSlice);

      soundManager.playTick(500 + Math.random() * 120);

      strip.style.transition = 'transform 85ms linear';
      strip.style.transform = 'translateY(-50%)';

      await wait(90);

      paintCell(cell0, nextSlice);
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0)';
      currentPos = nextIndex;

      void strip.offsetHeight;

      const extraDelay = Math.floor((step / totalSteps) * 20);
      await wait(12 + extraDelay);
    }

    setIsStopped(true);
    frame.classList.add('stopped');
    setResult(targetSlice);

    if (targetSlice.id === 'nada') {
      soundManager.playFanfare();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else if (targetSlice.id === 'al_seco') {
      soundManager.playGlassBreak();
    } else {
      soundManager.playPenaltyTick();
    }

    if (targetSlice.id === 'reto') {
      const reto = deckManager.getRandomReto();
      setRetoDetalle(reto);
    }

    setIsSpinning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#161214] border-2 border-red-900/60 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header de la Máquina de Castigos */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🎰</span>
          <h3 className="text-xl sm:text-2xl font-black text-[#ff8b22] uppercase tracking-wider">
            Máquina de Castigos
          </h3>
        </div>

        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border mb-3 ${activeModeObj.badgeColor}`}>
          Modo: {activeModeObj.name}
        </span>

        <p className="text-xs sm:text-sm text-stone-300 mb-3 max-w-xs">
          ¿No quieres responder o cumplir la tarjeta? ¡El carrete decide tu penitencia!
        </p>

        {/* Panel Tragamonedas de Castigo */}
        <section
          className="game-panel w-full bg-[#1d1a18] border border-[#514031] rounded-2xl p-3 sm:p-4 shadow-xl relative my-1"
          aria-label="Máquina de Castigos"
        >
          <div className="machine-top flex items-center justify-center gap-2 mb-3" aria-hidden="true">
            <span className="machine-tag font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#ff8b22]">
              CASTIGOS · 777
            </span>
          </div>

          <div className="reels flex justify-center">
            <div
              ref={frameRef}
              className={`reel-frame w-full max-w-xs p-1.5 bg-[#493426] border border-[#765239] rounded-xl shadow-inner ${
                isStopped ? 'stopped' : ''
              }`}
            >
              <div className="reel-window relative h-28 sm:h-36 overflow-hidden rounded-lg bg-[#27211d]">
                <div ref={stripRef} className="reel-strip h-[200%]">
                  {/* Celda 0 */}
                  <div ref={cell0Ref} className="reel-cell h-1/2 flex flex-col items-center justify-center gap-1.5 p-1">
                    <span className="reel-icon text-3xl sm:text-4xl">🎲</span>
                    <span className="reel-word font-extrabold text-sm sm:text-base text-[#fff1df]">
                      ¿Qué te tocará?
                    </span>
                    <span className="reel-badge text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow">
                      CASTIGO
                    </span>
                  </div>

                  {/* Celda 1 */}
                  <div ref={cell1Ref} className="reel-cell h-1/2 flex flex-col items-center justify-center gap-1.5 p-1">
                    <span className="reel-icon text-3xl sm:text-4xl"></span>
                    <span className="reel-word font-extrabold text-sm sm:text-base text-[#fff1df]"></span>
                    <span className="reel-badge text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detalle del Resultado */}
        {result && (
          <div className="mt-3 w-full p-3 sm:p-4 rounded-2xl bg-[#211a1e] border border-stone-700 animate-in zoom-in-95 duration-200">
            {result.id === 'nada' && (
              <div>
                <span className="text-3xl">🎉</span>
                <h4 className="text-lg sm:text-xl font-black text-emerald-400 mt-1">¡TE SALVASTE!</h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  La suerte estuvo de tu lado. No tomas nada y pasa el turno.
                </p>
              </div>
            )}

            {result.id === '1_sorbo' && (
              <div>
                <span className="text-3xl">🍺</span>
                <h4 className="text-lg sm:text-xl font-black text-blue-400 mt-1">1 SORBO</h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Toma 1 sorbo piola y pasa el teléfono.
                </p>
              </div>
            )}

            {result.id === '2_sorbos' && (
              <div>
                <span className="text-3xl">🍺</span>
                <h4 className="text-lg sm:text-xl font-black text-blue-400 mt-1">2 SORBOS</h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Toma 2 sorbos y pasa el teléfono al siguiente jugador.
                </p>
              </div>
            )}

            {result.id === '5_sorbos' && (
              <div>
                <span className="text-3xl">🍻</span>
                <h4 className="text-lg sm:text-xl font-black text-amber-400 mt-1">5 SORBOS</h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  ¡Te tocó trago pesado! Bebe 5 sorbos bien servidos.
                </p>
              </div>
            )}

            {result.id === '10_sorbos' && (
              <div>
                <span className="text-3xl">🔥</span>
                <h4 className="text-lg sm:text-xl font-black text-amber-500 mt-1">10 SORBOS</h4>
                <p className="text-xs sm:text-sm text-amber-200 mt-1 font-semibold">
                  ¡Castigo de carrete bravo! Bebe 10 sorbos sin quejarse.
                </p>
              </div>
            )}

            {result.id === 'reto' && (
              <div>
                <span className="text-3xl">🎭</span>
                <h4 className="text-lg sm:text-xl font-black text-purple-400 mt-1">¡TE TOCA RETO!</h4>
                {retoDetalle && (
                  <div className="mt-2 text-left bg-[#140f12] p-3 rounded-xl border border-purple-500/40">
                    <p className="text-xs font-bold text-purple-300 mb-1">{retoDetalle.titulo}</p>
                    <p className="text-xs sm:text-sm text-stone-200">{retoDetalle.descripcion}</p>
                  </div>
                )}
              </div>
            )}

            {result.id === 'al_seco' && (
              <div className="border border-red-700/60 p-2.5 rounded-xl bg-red-950/40">
                <span className="text-3xl">💀</span>
                <h4 className="text-xl sm:text-2xl font-black text-red-500 mt-1 animate-pulse">¡VASO AL SECO!</h4>
                <p className="text-xs sm:text-sm text-red-200 mt-1 font-semibold">
                  ¡Mala suerte! ¡El vaso se va de un solo fondo ("fondo blanco")!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Acciones de la Máquina */}
        <div className="mt-4 w-full flex flex-col gap-2">
          {!result ? (
            <button
              onClick={spinPenalty}
              disabled={isSpinning}
              className="spin-button w-full py-3 sm:py-3.5 px-6 rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-wait"
              style={{ background: '#ff8b22', color: '#141414' }}
            >
              {isSpinning ? 'GIRANDO EL CARRETE…' : '¡GIRAR CASTIGO!'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 active:scale-98 text-stone-950 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              ✅ Turno Terminado (Continuar)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
