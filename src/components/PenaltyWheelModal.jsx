import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';
import { deckManager, GAME_MODES } from '../utils/deckManager';
import confetti from 'canvas-confetti';

// Configuraciones dinámicas de la Ruleta de Castigo según el Modo de Juego
export const PENALTY_CONFIGS = {
  vasito: [
    { id: 'nada', label: 'NADA (80%)', prob: 80, angle: 288, color: '#10b981', textColor: '#ffffff' },
    { id: '1_sorbo', label: '1 SORBO (10%)', prob: 10, angle: 36, color: '#3b82f6', textColor: '#ffffff' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, angle: 36, color: '#ec4899', textColor: '#ffffff' },
  ],
  caja: [
    { id: 'nada', label: 'NADA (50%)', prob: 50, angle: 180, color: '#10b981', textColor: '#ffffff' },
    { id: 'reto', label: 'RETO (25%)', prob: 25, angle: 90, color: '#ec4899', textColor: '#ffffff' },
    { id: '2_sorbos', label: '2 SORBOS (10%)', prob: 10, angle: 36, color: '#3b82f6', textColor: '#ffffff' },
    { id: '5_sorbos', label: '5 SORBOS (10%)', prob: 10, angle: 36, color: '#f59e0b', textColor: '#000000' },
    { id: 'al_seco', label: 'AL SECO (5%)', prob: 5, angle: 18, color: '#ef4444', textColor: '#ffffff' },
  ],
  chimbombo: [
    { id: 'nada', label: 'NADA (30%)', prob: 30, angle: 108, color: '#10b981', textColor: '#ffffff' },
    { id: '5_sorbos', label: '5 SORBOS (30%)', prob: 30, angle: 108, color: '#f59e0b', textColor: '#000000' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, angle: 36, color: '#ec4899', textColor: '#ffffff' },
    { id: '10_sorbos', label: '10 SORBOS (10%)', prob: 10, angle: 36, color: '#3b82f6', textColor: '#ffffff' },
    { id: 'al_seco', label: 'AL SECO (20%)', prob: 20, angle: 72, color: '#ef4444', textColor: '#ffffff' },
  ],
  camion: [
    { id: 'al_seco', label: 'AL SECO (50%)', prob: 50, angle: 180, color: '#ef4444', textColor: '#ffffff' },
    { id: '5_sorbos', label: '5 SORBOS (20%)', prob: 20, angle: 72, color: '#f59e0b', textColor: '#000000' },
    { id: '10_sorbos', label: '10 SORBOS (10%)', prob: 10, angle: 36, color: '#3b82f6', textColor: '#ffffff' },
    { id: 'reto', label: 'RETO (10%)', prob: 10, angle: 36, color: '#ec4899', textColor: '#ffffff' },
    { id: 'nada', label: 'NADA (10%)', prob: 10, angle: 36, color: '#10b981', textColor: '#ffffff' },
  ],
};

export default function PenaltyWheelModal({ isOpen, onClose, currentMode }) {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [retoDetalle, setRetoDetalle] = useState(null);

  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];
  const slices = PENALTY_CONFIGS[currentMode] || PENALTY_CONFIGS.caja;

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setRetoDetalle(null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    // Borde exterior
    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Dibujar cada rebanada proporcional a su probabilidad
    let currentAngle = 0;
    slices.forEach((slice) => {
      const sliceRad = (slice.angle * Math.PI) / 180;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceRad;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Texto de la rebanada
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceRad / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = slice.textColor;
      ctx.font = slice.prob >= 25 ? 'bold 13px system-ui, sans-serif' : 'bold 10px system-ui, sans-serif';
      ctx.fillText(slice.label, radius - 14, 0);
      ctx.restore();

      currentAngle = endAngle;
    });

    // Círculo central
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CASTIGO', center, center);
  }, [isOpen, currentMode]);

  if (!isOpen) return null;

  const spinPenalty = () => {
    if (isSpinning || result) return;
    setIsSpinning(true);
    soundManager.init();

    // Desaceleración y ticks
    let delay = 60;
    let accumulatedTime = 0;
    const scheduleTick = () => {
      if (accumulatedTime < 3300) {
        setTimeout(() => {
          soundManager.playTick(500 + Math.random() * 120);
          if (navigator.vibrate && accumulatedTime > 2200) {
            navigator.vibrate(12);
          }
        }, accumulatedTime);
        delay = delay * 1.1;
        accumulatedTime += delay;
        scheduleTick();
      }
    };
    scheduleTick();

    // Selección ponderada exacta según el modo
    const rand = Math.random() * 100;
    let selectedSlice = slices[0];
    let cumulative = 0;
    let sliceStartAngle = 0;

    for (const slice of slices) {
      if (rand >= cumulative && rand < cumulative + slice.prob) {
        selectedSlice = slice;
        break;
      }
      cumulative += slice.prob;
      sliceStartAngle += slice.angle;
    }

    // Calcular rotación para la flecha superior (270 grados)
    const sliceCenterAngle = sliceStartAngle + selectedSlice.angle / 2;
    const arrowOffset = 270;
    const targetSliceRotation = (arrowOffset + (360 - sliceCenterAngle)) % 360;

    const extraSpins = 360 * 5;
    const newRotation = currentRotation + extraSpins + (targetSliceRotation - (currentRotation % 360) + 360) % 360;

    setCurrentRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedSlice);

      if (selectedSlice.id === 'nada') {
        soundManager.playSuccess();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } else if (selectedSlice.id === 'reto') {
        soundManager.playFanfare();
        const reto = deckManager.getRandomReto(currentMode);
        setRetoDetalle(reto);
      } else {
        soundManager.playFanfare();
        if (navigator.vibrate) navigator.vibrate([150, 100, 200]);
      }
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xl">🎲</span>
          <h3 className="text-xl font-black text-red-400 uppercase tracking-wider">
            Ruleta del Jugoso
          </h3>
        </div>

        {/* Badge del modo actual */}
        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border mb-3 ${activeModeObj.badgeColor}`}>
          Modo: {activeModeObj.name}
        </span>

        <p className="text-xs text-slate-400 mb-3">
          ¿No quieres responder o hacer la tarjeta? ¡La ruleta decide tu suerte!
        </p>

        {/* Indicador de flecha */}
        <div className="relative z-20 -mb-4 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500 drop-shadow animate-pulse" />
        </div>

        {/* Canvas de la ruleta de castigo adaptada */}
        <div className="relative p-2 rounded-full bg-slate-950 border-4 border-slate-800 shadow-lg">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning ? 'transform 3.5s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none',
            }}
            className="rounded-full max-w-[70vw] max-h-[70vw]"
          />
        </div>

        {/* Resultado visual post-giro */}
        {result && (
          <div className="mt-5 w-full p-4 rounded-2xl bg-slate-800/90 border border-slate-700 animate-in zoom-in-95 duration-200">
            {result.id === 'nada' && (
              <div>
                <span className="text-3xl">🎉</span>
                <h4 className="text-xl font-black text-emerald-400 mt-1">¡TE SALVASTE!</h4>
                <p className="text-sm text-slate-300 mt-1">
                  La suerte estuvo de tu lado. No tomas nada y pasa el turno.
                </p>
              </div>
            )}

            {result.id === '1_sorbo' && (
              <div>
                <span className="text-3xl">🍺</span>
                <h4 className="text-xl font-black text-blue-400 mt-1">1 SORBO</h4>
                <p className="text-sm text-slate-300 mt-1">
                  Toma 1 sorbo piola y pasa el teléfono.
                </p>
              </div>
            )}

            {result.id === '2_sorbos' && (
              <div>
                <span className="text-3xl">🍺</span>
                <h4 className="text-xl font-black text-blue-400 mt-1">2 SORBOS</h4>
                <p className="text-sm text-slate-300 mt-1">
                  Toma 2 sorbos y pasa el teléfono al siguiente jugador.
                </p>
              </div>
            )}

            {result.id === '5_sorbos' && (
              <div>
                <span className="text-3xl">🍻</span>
                <h4 className="text-xl font-black text-amber-400 mt-1">5 SORBOS</h4>
                <p className="text-sm text-slate-300 mt-1">
                  ¡Te tocó trago pesado! Bebe 5 sorbos bien servidos.
                </p>
              </div>
            )}

            {result.id === '10_sorbos' && (
              <div>
                <span className="text-3xl">🔥</span>
                <h4 className="text-xl font-black text-indigo-400 mt-1">10 SORBOS</h4>
                <p className="text-sm text-indigo-200 mt-1 font-semibold">
                  ¡Castigo de carrete bravo! Bebe 10 sorbos sin quejarse.
                </p>
              </div>
            )}

            {result.id === 'reto' && (
              <div>
                <span className="text-3xl">🎭</span>
                <h4 className="text-xl font-black text-pink-400 mt-1">¡TE TOCA RETO!</h4>
                {retoDetalle && (
                  <div className="mt-2 text-left bg-slate-900/80 p-3 rounded-xl border border-pink-500/30">
                    <p className="text-xs font-bold text-pink-300 mb-1">{retoDetalle.titulo}</p>
                    <p className="text-sm text-slate-100">{retoDetalle.descripcion}</p>
                  </div>
                )}
              </div>
            )}

            {result.id === 'al_seco' && (
              <div className="border border-red-500/40 p-2 rounded-xl bg-red-950/30">
                <span className="text-3xl">💀</span>
                <h4 className="text-2xl font-black text-red-500 mt-1 animate-pulse">¡VASO AL SECO!</h4>
                <p className="text-sm text-red-200 mt-1 font-semibold">
                  ¡Mala suerte! ¡El vaso se va de un solo fondo!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-5 w-full flex flex-col gap-2">
          {!result ? (
            <button
              onClick={spinPenalty}
              disabled={isSpinning}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-base uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
                isSpinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white shadow-red-500/30'
              }`}
            >
              {isSpinning ? '¡Girando el Castigo...!' : '🎯 ¡Girar Ruleta de Castigo!'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-2xl font-black text-base uppercase tracking-wider shadow-lg transition-all"
            >
              ✅ Turno Terminado (Continuar)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
