import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { getAnimalAvatar } from '../utils/animalAvatars';

export default function CardModal({ card, activePlayer, onClose, onTriggerPenalty }) {
  const [revealedTrivia, setRevealedTrivia] = useState(false);

  if (!card) return null;

  const handleComplete = () => {
    soundManager.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#ec4899', '#10b981', '#6366f1']
    });
    onClose();
  };

  const handleRefuse = () => {
    soundManager.playTick(500);
    onTriggerPenalty();
  };

  const categoryThemes = {
    trivia: { bg: 'border-indigo-500', badge: 'bg-indigo-500 text-white', label: '🧠 TRIVIA' },
    minijuego: { bg: 'border-amber-500', badge: 'bg-amber-500 text-slate-950', label: '👥 MINIJUEGO DE GRUPO' },
    jugo: { bg: 'border-pink-500', badge: 'bg-pink-500 text-white', label: '🍹 JUGO & PERSONALIDAD' },
    reto: { bg: 'border-red-500', badge: 'bg-red-500 text-white', label: '🔥 RETO / TOMAN TODOS' },
  };

  const theme = categoryThemes[card.categoriaJuego.toLowerCase()] || categoryThemes.jugo;

  const activeAnimal = getAnimalAvatar(activePlayer?.animal);
  const targetAnimal = card.targetPlayer ? getAnimalAvatar(card.targetPlayer.animal) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-md bg-slate-900 border-2 ${theme.bg} rounded-3xl p-6 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto`}>
        <div>
          {/* Barra superior de categoría y dificultad */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${theme.badge}`}>
              {theme.label}
            </span>
            <div className="flex items-center gap-1.5">
              {card.dificultad && (
                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                  Dificultad {card.dificultad}/10
                </span>
              )}
              {card.categoria && (
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                  {card.categoria}
                </span>
              )}
            </div>
          </div>

          {/* Banner de Jugador en Turno y Objetivo Automático con Animales */}
          <div className="mb-4 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2.5">
              <img
                src={activeAnimal.image}
                alt={activeAnimal.name}
                className="w-10 h-10 object-contain rounded-xl bg-slate-900 p-0.5 border border-amber-400/60 drop-shadow"
              />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Turno de:
                </span>
                <span className="text-sm font-black text-amber-400">
                  {activePlayer?.name || 'Jugador'}
                </span>
              </div>
            </div>

            {/* Jugador Objetivo seleccionado automáticamente */}
            {card.targetPlayer && targetAnimal && (
              <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/50 px-2.5 py-1 rounded-xl animate-pulse">
                <img
                  src={targetAnimal.image}
                  alt={targetAnimal.name}
                  className="w-8 h-8 object-contain rounded-lg bg-slate-950 p-0.5 border border-rose-400 drop-shadow"
                />
                <div>
                  <span className="text-[9px] text-rose-300 font-black block uppercase tracking-wider">
                    🎯 Víctima / Pareja:
                  </span>
                  <span className="text-xs font-black text-white">
                    {card.targetPlayer.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Título de la tarjeta */}
          {(card.titulo || card.juego) && (
            <h3 className="text-2xl font-black text-amber-400 mb-2 leading-tight">
              {card.titulo || card.juego}
            </h3>
          )}

          {/* Contenido / Descripción */}
          <div className="my-3 text-slate-100 text-lg sm:text-xl font-medium leading-relaxed">
            {card.descripcionFormateada || card.pregunta}
          </div>

          {/* Renderizado específico para Trivia */}
          {card.categoriaJuego.toLowerCase() === 'trivia' && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {card.opciones && Object.entries(card.opciones).map(([letter, text]) => (
                  <div
                    key={letter}
                    className={`p-3 rounded-xl border text-sm sm:text-base font-semibold transition-all ${
                      revealedTrivia && card.correcta && (text === card.correcta || letter === card.correcta)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="inline-block w-6 font-black text-amber-400">{letter})</span> {text}
                  </div>
                ))}
              </div>

              {!revealedTrivia ? (
                <button
                  onClick={() => {
                    soundManager.playTick(800);
                    setRevealedTrivia(true);
                  }}
                  className="w-full mt-3 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md"
                >
                  👀 Mostrar Respuesta Correcta
                </button>
              ) : (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl mt-2 text-center text-emerald-300 font-bold text-sm">
                  ✅ Respuesta: {card.correcta}
                </div>
              )}
            </div>
          )}

          {/* Castigo alternativo o castigo por fallar */}
          {card.castigoFormateado && (
            <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs sm:text-sm text-red-300">
              <span className="font-bold text-red-400">
                {card.categoriaJuego.toLowerCase() === 'trivia' ? 'Castigo si fallas:' : 'Castigo:'}
              </span>{' '}
              {card.categoriaJuego.toLowerCase() === 'trivia' && /^\d+$/.test(card.castigoFormateado.trim())
                ? `Bebe ${card.castigoFormateado} sorbo(s).`
                : card.castigoFormateado}
            </div>
          )}

          {/* Ayuda visual para minijuegos de grupo */}
          {card.categoriaJuego.toLowerCase() === 'minijuego' && (
            <div className="mt-4 p-3 bg-slate-800/60 rounded-xl text-xs text-slate-400 text-center italic">
              👉 Cuenten hasta 3 y apunten al mismo tiempo. Quien reciba más votos, ¡debe beber o pagar el reto!
            </div>
          )}
        </div>

        {/* Botones de acción inferiores */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
          <button
            onClick={handleComplete}
            className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
          >
            ✅ ¡Cumplido / Siguiente!
          </button>

          {/* Botón para cuando NO quiere responder o hacer el reto */}
          <button
            onClick={handleRefuse}
            className="w-full py-3 px-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 hover:text-white rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow active:scale-98 flex items-center justify-center gap-2"
          >
            <span>🎲 No quiero hacerlo</span>
            <span className="text-xs bg-rose-500/40 px-2 py-0.5 rounded-full text-rose-200">Girar Castigo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
