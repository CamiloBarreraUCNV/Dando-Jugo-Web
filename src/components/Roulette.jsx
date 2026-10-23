import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';

export const CATEGORIES = [
  { id: 'trivia', name: 'Trivia', color: '#6366f1', textColor: '#ffffff' },        // Indigo
  { id: 'minijuego', name: 'Minijuego', color: '#f59e0b', textColor: '#000000' },   // Ámbar
  { id: 'jugo', name: 'Jugo', color: '#ec4899', textColor: '#ffffff' },              // Rosa
  { id: 'reto', name: 'Reto', color: '#ef4444', textColor: '#ffffff' },              // Rojo
];

export default function Roulette({ onSpinEnd, isSpinning, setIsSpinning }) {
  const canvasRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const numSlices = CATEGORIES.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Dibujar la ruleta en el Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12;

    ctx.clearRect(0, 0, size, size);

    // Borde exterior metálico
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
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

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Texto de la categoría
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = cat.textColor;
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(cat.name.toUpperCase(), radius - 20, 5);
      ctx.restore();
    });

    // Círculo central
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JUGO', center, center);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundManager.init();

    // Feedback háptico
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }

    // Programar la desaceleración del sonido de ticks durante los 4 segundos
    let delay = 60;
    let accumulatedTime = 0;

    const scheduleTick = () => {
      if (accumulatedTime < 3800) {
        setTimeout(() => {
          soundManager.playTick(600 + Math.random() * 80);
          if (navigator.vibrate && accumulatedTime > 2500) {
            navigator.vibrate(10);
          }
        }, accumulatedTime);
        delay = delay * 1.09;
        accumulatedTime += delay;
        scheduleTick();
      }
    };
    scheduleTick();

    // Selección aleatoria
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
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 150]);
      }
      onSpinEnd(selectedCategory);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Flecha superior */}
      <div className="relative z-20 -mb-5 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] animate-pulse" />
      </div>

      {/* Rueda animada */}
      <div className="relative p-2 rounded-full bg-slate-900 shadow-[0_0_40px_rgba(245,158,11,0.25)] border-4 border-slate-800">
        <canvas
          ref={canvasRef}
          width={340}
          height={340}
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none',
          }}
          className="rounded-full cursor-pointer max-w-[85vw] max-h-[85vw]"
          onClick={spin}
        />
      </div>

      {/* Botón táctil grande para girar */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`mt-6 w-full max-w-xs py-4 px-8 rounded-2xl font-black text-xl tracking-wider uppercase shadow-xl transition-all active:scale-95 ${
          isSpinning
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 animate-bounce'
        }`}
      >
        {isSpinning ? '¡Girando...!' : '🎯 ¡Tocar para Girar!'}
      </button>
    </div>
  );
}
