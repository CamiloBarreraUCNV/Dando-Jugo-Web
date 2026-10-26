import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';

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
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(cat.name.toUpperCase(), radius - 20, 0);
      ctx.restore();
    });

    // Círculo central con detalles dorados
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0d0a0c';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JUGO', center, center);
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

      {/* Rueda animada con marco de taberna / bronce */}
      <div className="relative p-2 sm:p-2.5 rounded-full bg-[#161214] shadow-[0_0_50px_rgba(212,175,55,0.2)] border-4 border-[#2d2228]">
        <canvas
          ref={canvasRef}
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none',
          }}
          className="rounded-full cursor-pointer w-[min(320px,76vw)] h-[min(320px,76vw)] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px] lg:w-[400px] lg:h-[400px] aspect-square block"
          onClick={spin}
        />
      </div>

      {/* Botón táctil grande con dorado ámbar */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`mt-4 sm:mt-6 w-full max-w-xs md:max-w-sm py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl font-black text-lg sm:text-xl md:text-2xl tracking-wider uppercase shadow-xl transition-all active:scale-95 ${
          isSpinning
            ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-stone-950 shadow-amber-500/30 border border-amber-300 animate-bounce'
        }`}
      >
        {isSpinning ? '¡Girando...!' : '🎯 ¡Tocar para Girar!'}
      </button>
    </div>
  );
}
