import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

export const CATEGORIES = [
  { id: 'trivia', name: 'Trivia', word: 'Trivia', icon: '🧠', color: '#1d4ed8', textColor: '#ffffff' },
  { id: 'reto', name: 'Reto', word: 'Reto', icon: '🔥', color: '#b91c1c', textColor: '#ffffff' },
  { id: 'jugo', name: 'Jugo', word: 'Jugo', icon: '🧃', color: '#9333ea', textColor: '#ffffff' },
  { id: 'minijuego', name: 'Minijuego', word: 'Minijuego', icon: '🎮', color: '#d97706', textColor: '#ffffff' },
];

export default function Roulette({ onSpinEnd, isSpinning, setIsSpinning }) {
  const frameRef = useRef(null);
  const stripRef = useRef(null);
  const cell0Ref = useRef(null);
  const cell1Ref = useRef(null);

  const [position, setPosition] = useState(0);
  const [resultText, setResultText] = useState('');
  const [isStopped, setIsStopped] = useState(false);

  // Inicializar celda 0
  useEffect(() => {
    if (cell0Ref.current) {
      paintCell(cell0Ref.current, CATEGORIES[0]);
    }
  }, []);

  const paintCell = (cell, cat) => {
    if (!cell || !cat) return;
    const iconEl = cell.querySelector('.reel-icon');
    const wordEl = cell.querySelector('.reel-word');
    if (iconEl) iconEl.textContent = cat.icon;
    if (wordEl) wordEl.textContent = cat.name;
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsStopped(false);
    setResultText('');

    const frame = frameRef.current;
    const strip = stripRef.current;
    const cell0 = cell0Ref.current;
    const cell1 = cell1Ref.current;

    if (!frame || !strip || !cell0 || !cell1) {
      setIsSpinning(false);
      return;
    }

    try {
      soundManager.init();
      frame.classList.remove('stopped');

      const targetIndex = Math.floor(Math.random() * CATEGORIES.length);
      const targetCategory = CATEGORIES[targetIndex];
      const totalSteps = 18;
      let currentPos = position;

      for (let step = 0; step < totalSteps; step++) {
        const isLast = step === totalSteps - 1;
        const nextIndex = isLast ? targetIndex : (currentPos + 1 + Math.floor(Math.random() * 2)) % CATEGORIES.length;
        const nextCat = CATEGORIES[nextIndex];

        paintCell(cell1, nextCat);

        // Reproducir sonido mecánico en cada paso con tono variable
        soundManager.playTick(550 + Math.random() * 120);

        strip.style.transition = 'transform 85ms linear';
        strip.style.transform = 'translateY(-50%)';

        await wait(90);

        paintCell(cell0, nextCat);
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        currentPos = nextIndex;

        // Lectura de layout para reiniciar ciclo de CSS
        void strip.offsetHeight;

        // Desaceleración progresiva al final del giro
        const extraDelay = Math.floor((step / totalSteps) * 22);
        await wait(14 + extraDelay);
      }

      setPosition(targetIndex);
      setIsStopped(true);
      frame.classList.add('stopped');

      soundManager.playFanfare();
      setResultText(targetCategory.name);

      // Esperar brevemente para que los jugadores vean el resultado y lanzar la carta
      setTimeout(() => {
        setIsSpinning(false);
        if (onSpinEnd) {
          onSpinEnd(targetCategory);
        }
      }, 650);
    } catch (err) {
      console.error('Error durante el giro:', err);
      setIsSpinning(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none px-2 sm:px-4">
      {/* Header con Logo y Textos de Estilo Tragamonedas */}
      <div className="text-center mb-4 sm:mb-6">
        <img
          src={logoImg}
          alt="Dando Jugo Logo"
          className="brand-image w-28 sm:w-36 h-auto max-h-24 object-contain mx-auto mb-2 drop-shadow-md"
        />
        <p className="eyebrow text-xs sm:text-sm font-bold tracking-widest text-[#ff8b22] uppercase mb-1">
          LA SUERTE DECIDE
        </p>
        <h2 className="headline text-2xl sm:text-3xl font-black text-[#fff1df] tracking-tight">
          Que corra la suerte.
        </h2>
        <p className="text-xs sm:text-sm text-[#cbb9a9] max-w-md mx-auto mt-1 leading-snug">
          Cuatro categorías. Un solo destino. Pulsa el botón y descubre qué toca en Dando Jugo.
        </p>
      </div>

      {/* Panel Tragamonedas */}
      <section
        className="game-panel w-full bg-[#1d1a18] border border-[#514031] rounded-3xl p-4 sm:p-6 shadow-2xl relative"
        aria-label="Máquina tragamonedas de Dando Jugo"
      >
        <div className="machine-top flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <span className="machine-tag font-mono text-xs font-bold tracking-widest text-[#ff8b22]">
            DANDO JUGO · 777
          </span>
        </div>

        <div className="reels flex justify-center">
          <div
            ref={frameRef}
            className={`reel-frame w-full max-w-sm p-2 bg-[#493426] border border-[#765239] rounded-2xl shadow-inner ${
              isStopped ? 'stopped' : ''
            }`}
          >
            <div className="reel-window relative h-36 sm:h-44 overflow-hidden rounded-xl bg-[#27211d]">
              <div ref={stripRef} className="reel-strip h-[200%]">
                {/* Celda 0 (Visible actualmente) */}
                <div ref={cell0Ref} className="reel-cell h-1/2 flex flex-col items-center justify-center gap-2 p-2">
                  <span className="reel-icon text-4xl sm:text-5xl">🧠</span>
                  <span className="reel-word font-extrabold text-lg sm:text-2xl text-[#fff1df] tracking-wide">
                    Trivia
                  </span>
                </div>

                {/* Celda 1 (Siguiente que entra desde abajo) */}
                <div ref={cell1Ref} className="reel-cell h-1/2 flex flex-col items-center justify-center gap-2 p-2">
                  <span className="reel-icon text-4xl sm:text-5xl"></span>
                  <span className="reel-word font-extrabold text-lg sm:text-2xl text-[#fff1df] tracking-wide"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de Resultado de la Máquina */}
        <p className="machine-result min-h-[36px] mt-3 sm:mt-4 text-center font-extrabold text-base sm:text-xl text-[#fff1df]">
          {resultText ? (
            <span>
              <span className="result-prefix text-[#ff8b22]">¡TOCÓ: </span>
              {resultText.toUpperCase()}!
            </span>
          ) : (
            <span className="text-stone-500 text-xs sm:text-sm font-semibold">
              Presiona el botón para tirar del carrete
            </span>
          )}
        </p>
      </section>

      {/* Botón de Tirar / Girar */}
      <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 w-full">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="spin-button w-full max-w-xs py-3.5 sm:py-4 px-8 rounded-full font-black text-base sm:text-lg tracking-wider uppercase shadow-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          style={{ background: '#ff8b22', color: '#141414' }}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block">🎰</span>
              <span>GIRANDO…</span>
            </span>
          ) : (
            <span>¡GIRAR!</span>
          )}
        </button>

        <p className="text-[11px] sm:text-xs text-[#aa9788] text-center max-w-xs leading-relaxed">
          Juega con moderación. Siempre puedes elegir una bebida sin alcohol.
        </p>
      </div>
    </div>
  );
}
