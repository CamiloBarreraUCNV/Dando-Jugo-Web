import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import logoImg from '../assets/Logos/DandoJugoLogotransp2 4.png';

// Paleta Opción 3 (Casino & Barra Clandestina)
export const CATEGORIES = [
  { id: 'trivia', name: 'Trivia', color: '#1d4ed8', textColor: '#ffffff' },        // Zafiro Casino
  { id: 'minijuego', name: 'Minijuego', color: '#d97706', textColor: '#ffffff' },   // Cobre / Bronce
  { id: 'jugo', name: 'Jugo', color: '#9333ea', textColor: '#ffffff' },              // Ciruela Terciopelo
  { id: 'reto', name: 'Reto', color: '#b91c1c', textColor: '#ffffff' },              // Vino Tinto / Burdeos
];

export default function Roulette({ onSpinEnd, isSpinning, setIsSpinning }) {
  const canvasRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const numSlices = CATEGORIES.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Dibujar la ruleta en el Canvas con renderizado Retina HD
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Soporte para pantallas Retina / HiDPI (iPhone, Android moderno, iPad)
    const logicalSize = 340;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    
    canvas.width = logicalSize * dpr;
    canvas.height = logicalSize * dpr;
    
    // Escalar el contexto para dibujar en alta definición sin alterar las coordenadas lógicas
    ctx.scale(dpr, dpr);

    const center = logicalSize / 2;
    const radius = center - 12;

    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // Borde exterior metálico dorado / latón
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1719';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    CATEGORIES.forEach((cat, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0d0a0c';
      ctx.stroke();

      // Texto de la categoría
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = cat.textColor;
      ctx.font = '800 15px Outfit, system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(cat.name.toUpperCase(), radius - 20, 0);
      ctx.restore();
    });

    // Círculo central con detalles dorados
    ctx.beginPath();
    ctx.arc(center, center, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#0d0a0c';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundManager.init();

    let delay = 60;
    let accumulatedTime = 0;

    const scheduleTick = () => {
      if (accumulatedTime < 3800) {
        setTimeout(() => {
          soundManager.playTick(600 + Math.random() * 80);
        }, accumulatedTime);
        delay = delay * 1.09;
        accumulatedTime += delay;
        scheduleTick();
      }
    };
    scheduleTick();

    const selectedIndex = Math.floor(Math.random() * numSlices);
    const selectedCategory = CATEGORIES[selectedIndex];

    const sliceDeg = 360 / numSlices;
    const targetDegFromSlice = 360 - (selectedIndex * sliceDeg + sliceDeg / 2);
    const arrowOffset = 270;
    const targetSliceRotation = (arrowOffset + targetDegFromSlice) % 360;

    const extraSpins = 360 * 5;
    const newRotation = currentRotation + extraSpins + (targetSliceRotation - (currentRotation % 360) + 360) % 360;

    setCurrentRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      soundManager.playFanfare();
      onSpinEnd(selectedCategory);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full">
      {/* Flecha superior dorada */}
      <div className="relative z-20 -mb-5 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-pulse" />
      </div>

      {/* Rueda animada con marco de taberna / bronce y eje central con Logo */}
      <div className="relative p-2 sm:p-2.5 rounded-full bg-[#161214] shadow-[0_0_50px_rgba(212,175,55,0.2)] border-4 border-[#2d2228] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none',
          }}
          className="rounded-full cursor-pointer w-[min(320px,76vw)] h-[min(320px,76vw)] sm:w-[340px] sm:h-[340px] md:w-[370px] md:h-[370px] lg:w-[390px] lg:h-[390px] aspect-square block"
          onClick={spin}
        />

        {/* Eje central con el Logo Oficial del Juego */}
        <div
          onClick={spin}
          className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0d0a0c] border-2 sm:border-[3px] border-amber-400 p-2 shadow-2xl flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
          title="¡Tocar para Girar!"
        >
          <img
            src={logoImg}
            alt="Dando Jugo Logo"
            className="w-full h-full object-contain drop-shadow"
          />
        </div>
      </div>

      {/* Botón táctil grande con dorado ámbar y resplandor elegante */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`mt-3 sm:mt-4 w-full max-w-xs md:max-w-sm py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl font-display font-black text-base sm:text-lg md:text-xl tracking-wider uppercase shadow-xl transition-all duration-200 active:scale-95 ${
          isSpinning
            ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-stone-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 border-2 border-amber-300 hover:scale-[1.02]'
        }`}
      >
        {isSpinning ? '¡Girando...!' : '🎯 ¡Tocar para Girar!'}
      </button>
    </div>
  );
}
