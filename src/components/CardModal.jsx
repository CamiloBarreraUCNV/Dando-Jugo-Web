import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { getAnimalAvatar } from '../utils/animalAvatars';
import { resolverInstruccionMinijuego } from '../utils/deckManager';

export default function CardModal({ card, activePlayer, currentMode, onClose, onTriggerPenalty }) {
  const [revealedTrivia, setRevealedTrivia] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [triviaStatus, setTriviaStatus] = useState(null); // 'correct' | 'wrong' | null

  if (!card) return null;

  const isTrivia = card.categoriaJuego?.toLowerCase() === 'trivia';

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

  // Manejo de respuesta en Trivia
  const handleSelectTriviaOption = (letter, text) => {
    if (revealedTrivia) return; // ya revelada
    setSelectedOption(text);
    setRevealedTrivia(true);

    const isCorrect = card.correcta && (text === card.correcta || letter === card.correcta);

    if (isCorrect) {
      setTriviaStatus('correct');
      soundManager.playSuccess();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#60a5fa']
      });
    } else {
      setTriviaStatus('wrong');
      soundManager.playFail();
    }
  };

  // Revelar verbalmente sin tocar opción previa
  const handleRevealDirectly = () => {
    setRevealedTrivia(true);
    soundManager.playTick(800);
  };

  const handleMarkVerbalResult = (status) => {
    setTriviaStatus(status);
    if (status === 'correct') {
      soundManager.playSuccess();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });
    } else {
      soundManager.playFail();
    }
  };

  const categoryThemes = {
    trivia: { bg: 'border-blue-600', badge: 'bg-blue-600 text-white', label: '🧠 TRIVIA' },
    minijuego: { bg: 'border-amber-600', badge: 'bg-amber-600 text-white', label: '👥 MINIJUEGO DE GRUPO' },
    jugo: { bg: 'border-purple-600', badge: 'bg-purple-600 text-white', label: '🍹 JUGO & PERSONALIDAD' },
    reto: { bg: 'border-red-700', badge: 'bg-red-700 text-white', label: '🔥 RETO / TOMAN TODOS' },
  };

  const theme = categoryThemes[card.categoriaJuego.toLowerCase()] || categoryThemes.jugo;

  const activeAnimal = getAnimalAvatar(activePlayer?.animal);
  const targetAnimal = card.targetPlayer ? getAnimalAvatar(card.targetPlayer.animal) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-md bg-[#171216] border-2 ${theme.bg} rounded-3xl p-6 shadow-2xl flex flex-col justify-between max-h-[88dvh] overflow-y-auto no-scrollbar`}>
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

          {/* Renderizado específico e interactivo para Trivia */}
          {isTrivia && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {card.opciones && Object.entries(card.opciones).map(([letter, text]) => {
                  const isCorrect = card.correcta && (text === card.correcta || letter === card.correcta);
                  const isChosen = selectedOption === text;

                  let optionStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800 cursor-pointer';

                  if (revealedTrivia) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-500/25 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/10';
                    } else if (isChosen) {
                      optionStyle = 'bg-red-500/25 border-red-500 text-red-200 line-through';
                    } else {
                      optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={revealedTrivia}
                      onClick={() => handleSelectTriviaOption(letter, text)}
                      className={`w-full text-left p-3 rounded-xl border text-sm sm:text-base font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <div>
                        <span className="inline-block w-6 font-black text-amber-400">{letter})</span> {text}
                      </div>
                      {revealedTrivia && isCorrect && <span className="text-base ml-2">✅</span>}
                      {revealedTrivia && isChosen && !isCorrect && <span className="text-base ml-2">❌</span>}
                    </button>
                  );
                })}
              </div>

              {/* Botón si responden verbalmente sin pulsar opciones */}
              {!revealedTrivia && (
                <button
                  onClick={handleRevealDirectly}
                  className="w-full mt-3 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md"
                >
                  👀 Mostrar Respuesta Correcta
                </button>
              )}

              {/* Estado cuando se revela la trivia */}
              {revealedTrivia && (
                <div className="mt-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-sm">
                    <span className="text-slate-400 font-semibold block text-xs uppercase tracking-wider mb-0.5">Respuesta oficial:</span>
                    <span className="text-emerald-400 font-black text-base">{card.correcta}</span>
                  </div>

                  {/* Selector si respondieron verbalmente */}
                  {triviaStatus === null && (
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <p className="text-xs text-center text-slate-300 font-semibold mb-2">
                        ¿Acertó {activePlayer?.name} en la mesa?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleMarkVerbalResult('correct')}
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide transition active:scale-95"
                        >
                          🎉 ¡Acertó!
                        </button>
                        <button
                          onClick={() => handleMarkVerbalResult('wrong')}
                          className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wide transition active:scale-95"
                        >
                          ❌ ¡Falló!
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mensajes de resultado */}
                  {triviaStatus === 'correct' && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-emerald-300 font-black text-sm">
                      🎉 ¡Respuesta Correcta! Te salvaste del castigo.
                    </div>
                  )}

                  {triviaStatus === 'wrong' && (
                    <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-center text-red-300 font-black text-sm animate-pulse">
                      🍺 ¡Respuesta Incorrecta! Paga tu castigo.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Castigo alternativo o castigo por fallar */}
          {card.castigoFormateado && (
            <div className={`mt-4 p-3 rounded-xl text-xs sm:text-sm border transition-all ${
              triviaStatus === 'wrong'
                ? 'bg-red-950/80 border-red-500 text-red-200 font-bold ring-2 ring-red-500/30'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}>
              <span className="font-bold text-red-400">
                {isTrivia ? 'Castigo si fallas:' : 'Castigo:'}
              </span>{' '}
              {isTrivia && /^\d+$/.test(card.castigoFormateado.trim())
                ? `Bebe ${card.castigoFormateado} sorbo(s).`
                : card.castigoFormateado}
            </div>
          )}

          {/* Ayuda visual e instrucción específica para minijuegos de grupo */}
          {card.categoriaJuego?.toLowerCase() === 'minijuego' && (
            <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200 text-center font-medium leading-relaxed shadow-sm">
              👉 {card.instruccionMinijuego || resolverInstruccionMinijuego(card.titulo, currentMode)}
            </div>
          )}
        </div>

        {/* Botones de acción inferiores */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
          <button
            onClick={triviaStatus === 'wrong' ? onClose : handleComplete}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-lg shadow-lg uppercase tracking-wider transition-all active:scale-98 ${
              triviaStatus === 'wrong'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isTrivia
              ? triviaStatus === 'wrong'
                ? '🍺 Listo, Castigo Pagado / Siguiente'
                : triviaStatus === 'correct'
                ? '🎉 ¡Siguiente Turno!'
                : '✅ Continuar / Siguiente'
              : '✅ ¡Cumplido / Siguiente!'}
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
