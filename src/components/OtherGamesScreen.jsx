import React, { useState } from 'react';
import { soundManager } from '../utils/soundEffects';

const OTHER_GAMES_CATALOG = [
  {
    id: 'cuarto-rey',
    name: 'Cuarto Rey (Copa del Kaiser)',
    icon: '👑',
    category: 'Cartas',
    players: '2+ Jugadores',
    badge: '¡Modo Virtual Jugable!',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    color: 'from-amber-950/60 via-stone-900/90 to-amber-950/60',
    description:
      'Se coloca un vaso grande al centro. Cada carta de la baraja tiene una regla o dinámica. Cuando sale un Rey (Kaiser), debes verter un tercio de tu vaso al centro. ¡Quien saque el 4to Rey debe tomarse el vaso completo!',
    materials: 'Jugable 100% en la app (o con 1 baraja física y 1 vaso central).',
    rules: [
      'As: Cascada (todos beben en orden hasta que el de su izquierda pare).',
      '2 al 6: Reglas de sorbos numéricos (repartes o tomas según el número).',
      '7: Cultura Chupística exprés sobre la marcha.',
      '8: Compañero de trago (cada vez que tú tomes, tu compañero toma).',
      '9: Rima instantánea (el que repita o se quede en blanco, toma).',
      '10: Yo Nunca Nunca con los dedos de la mano.',
      'Jota (J): Nueva regla para toda la mesa (ej: no señalar con el dedo).',
      'Reina (Q): Preguntón (a quien le respondas una pregunta, bebe).',
      'Rey (K): Kaiser. Llena 1/3 del vaso central. El 4to Rey se lo toma al seco.',
    ],
    status: 'Modo Virtual Activo en la App',
  },
  {
    id: 'trivia-bomba',
    name: 'Trivia Bomba',
    icon: '💣',
    category: 'Competitivo',
    players: '2+ Jugadores',
    badge: 'A Contrarreloj',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    borderColor: 'border-red-500/40 hover:border-red-400',
    color: 'from-red-950/60 via-stone-900/90 to-red-950/60',
    description:
      'Preguntas de conocimiento y rapidez mental. La bomba tiene un temporizador invisible aleatorio entre 45 y 90 segundos. Quien tenga el teléfono en la mano cuando explote, ¡bebe la cantidad total de preguntas respondidas en sorbos!',
    materials: 'Solo la app móvil.',
    rules: [
      'El jugador en turno lee la trivia en voz alta.',
      'Si acierta, pasa inmediatamente el teléfono al jugador de la derecha.',
      'Si falla, debe responder otra pregunta antes de poder pasar el turno.',
      'El tic-tac acelera aleatoriamente.',
      '¡Quien tenga el teléfono al sonar la explosión se bebe el acumulado!',
    ],
    status: 'Próximamente en la app',
  },
  {
    id: 'caballos',
    name: 'Carrera de Caballos',
    icon: '🏇',
    category: 'Apuestas',
    players: '2+ Jugadores',
    badge: '¡Modo Virtual Jugable!',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    color: 'from-emerald-950/60 via-stone-900/90 to-emerald-950/60',
    description:
      '4 caballos con 4 colores distintos (Rojo, Oro, Esmeralda y Zafiro) compiten por la gloria. Apuesta sorbos o el vaso al seco, supera las vallas y regala sorbos en cada avance.',
    materials: 'Jugable 100% en la app (con baraja virtual, 6 vallas y apuestas).',
    rules: [
      'Ronda de Apuestas: Cada jugador elige su caballo y define sus sorbos apostados (o activa ¡Al Seco!).',
      'Avance y Regalo: Cuando un caballo avanza, quienes apostaron por él regalan sorbos a la mesa (comienza en 1 sorbo).',
      'Tropiezo en Vallas: Cuando los 4 caballos cruzan un tramo, se revela la carta lateral: ese caballo retrocede 1 casilla y el valor de sorbos a regalar sube en +1.',
      'Meta Final: Quien apostó al caballo ganador regala el DOBLE (o manda 2 vasos al seco); los perdedores beben su apuesta (o el vaso completo al seco).',
    ],
    status: 'Modo Virtual Activo en la App',
  },
  {
    id: 'apuestas-mayor-menor',
    name: 'Juego de las Apuestas (Mayor o Menor)',
    icon: '📈',
    category: 'Cartas',
    players: '2+ Jugadores',
    badge: '¡Modo Virtual Jugable!',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-cyan-500/50 hover:border-cyan-400',
    color: 'from-cyan-950/60 via-stone-900/90 to-cyan-950/60',
    description:
      'Casino Speakeasy en vivo. Predice si la carta siguiente será Mayor, Menor o el Jackpot de Mismo Número con probabilidades teóricas anti-conteo. Acierta para regalar sorbos y engordar el pozo, o plántate y pásale la bomba caliente al siguiente.',
    materials: 'Jugable 100% en la app (con probabilidades en vivo, pozo acumulativo y baraja inglesa).',
    rules: [
      'Jerarquía: As (A) vale 1 (la carta más baja) y Rey (K) vale 13 (la más alta).',
      'Probabilidades Teóricas Anti-Trampas: Se calculan sobre las 52 cartas del mazo completo para evitar conteos.',
      'Sorbos según Riesgo: A menor probabilidad de la opción acertada, más sorbos regalas a la mesa (hasta 8 sorbos).',
      'Fallo en Rojo Carmesí: Si te equivocas, la mesa arde en rojo y debes beberte todos los sorbos del pozo acumulado.',
      'Carta Gemela Imprevista: Si sale el mismo valor sin haberlo predicho, el pozo se duplica y se recomienda tomarlo al seco.',
      'Plantarme y Pasar Pozo: Al acertar al menos 1 vez, puedes plantarte y transferirle el pozo caliente al siguiente jugador.',
    ],
    status: 'Modo Virtual Activo en la App',
  },
  {
    id: 'verdad-reto',
    name: 'Verdad o Reto (La Mesa Caliente)',
    icon: '🌶️',
    category: 'Grupal',
    players: '2+ Jugadores',
    badge: '¡Modo Virtual Jugable!',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-rose-500/50 hover:border-rose-400',
    color: 'from-rose-950/60 via-stone-900/90 to-rose-950/60',
    description:
      'El clásico juego de fiesta llevado al extremo con 300 cartas interactivas y 3 niveles de intensidad. Elige entre confesar tus secretos más íntimos o realizar penitencias y pruebas de valor.',
    materials: 'Jugable 100% en la app (300 cartas con 3 niveles de intensidad).',
    rules: [
      'El jugador en turno debe elegir obligatoriamente "Verdad" (😇), "Reto" (😈) o "Al Azar" (🎲).',
      'Regla Anti-Arrugue: No se puede elegir "Verdad" más de 2 veces consecutivas por turno.',
      'Resolución de mesa: Al resolver la carta, la mesa valida si "¡Cumplió! ✅" o "¡Arrugó! 🐔" pagando los sorbos de penitencia.',
      '3 Niveles de Intensidad: Previa Entre Amigos (2 sorbos), Picante 18+ (3 sorbos) y Extremo Jugo (4 sorbos).',
    ],
    status: 'Modo Virtual Activo en la App',
  },
];

const CATEGORIES = ['Todos', ...new Set(OTHER_GAMES_CATALOG.map((g) => g.category))];

export default function OtherGamesScreen({
  onBack,
  onOpenSettings,
  onPlayCuartoRey,
  onPlayVerdadReto,
  onPlayCaballos,
  onPlayApuestas,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedGameId, setExpandedGameId] = useState(null);

  const filteredGames =
    selectedCategory === 'Todos'
      ? OTHER_GAMES_CATALOG
      : OTHER_GAMES_CATALOG.filter((g) => g.category === selectedCategory);

  const handleToggleExpand = (gameId) => {
    soundManager.playTick(600);
    setExpandedGameId((prev) => (prev === gameId ? null : gameId));
  };

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center px-4 pt-safe pb-safe max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden w-full animate-in fade-in duration-200">
      {/* 1. Header Superior */}
      <header className="w-full flex items-center justify-between py-2 border-b border-stone-800/80 shrink-0 gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-200 font-bold px-3 py-1.5 rounded-xl border border-stone-700/80 transition shadow cursor-pointer"
          title="Volver al Menú Principal"
        >
          <span>←</span>
          <span>Menú</span>
        </button>

        <div className="text-center min-w-0">
          <h2 className="font-display font-black text-sm sm:text-base text-amber-400 tracking-wide flex items-center justify-center gap-1.5 truncate">
            <span>🎮</span>
            <span>Otros Juegos de Carrete</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-stone-400 truncate">
            Modos clásicos, apuestas y dinámicas alternativas para tu mesa
          </p>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-sm bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-stone-300 font-bold p-1.5 rounded-xl border border-stone-700/80 transition cursor-pointer"
            title="Opciones y Ajustes"
          >
            ⚙️
          </button>
        )}
      </header>

      {/* 2. Filtros de Categorías */}
      <div className="w-full py-2 shrink-0 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                soundManager.playTick(750);
                setSelectedCategory(cat);
              }}
              className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer active:scale-95 border ${
                isActive
                  ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-[#161214] text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Listado de Juegos (Grid interactivo con scroll) */}
      <main className="w-full flex-1 min-h-0 overflow-y-auto custom-scrollbar my-1 pr-1 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGames.map((game) => {
            const isExpanded = expandedGameId === game.id;
            return (
              <div
                key={game.id}
                className={`bg-[#161214]/95 border-2 ${game.borderColor} rounded-2xl p-4 shadow-xl transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  {/* Encabezado del Juego */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-3xl p-2 bg-black/50 rounded-xl border border-white/10 shrink-0">
                        {game.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display font-black text-base text-white tracking-wide truncate">
                          {game.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${game.badgeColor}`}
                          >
                            {game.badge}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            👥 {game.players}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción General */}
                  <p className="text-xs text-stone-300 leading-relaxed mb-3">
                    {game.description}
                  </p>

                  {/* Detalle Desplegable (Reglas & Materiales) */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-stone-800/80 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2.5">
                      <div className="bg-black/40 rounded-xl p-2.5 border border-stone-800 text-xs">
                        <strong className="text-amber-300 block mb-1">
                          📦 Lo que necesitas:
                        </strong>
                        <span className="text-stone-300">{game.materials}</span>
                      </div>

                      <div className="bg-black/40 rounded-xl p-2.5 border border-stone-800 text-xs">
                        <strong className="text-amber-300 block mb-1.5">
                          📜 Reglas e Instrucciones:
                        </strong>
                        <ul className="space-y-1 text-stone-300 list-disc list-inside">
                          {game.rules.map((rule, idx) => (
                            <li key={idx} className="leading-snug">
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer de la tarjeta con botones de juego y reglas */}
                <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ['cuarto-rey', 'verdad-reto', 'caballos', 'apuestas-mayor-menor'].includes(game.id)
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span
                      className={
                        ['cuarto-rey', 'verdad-reto', 'caballos', 'apuestas-mayor-menor'].includes(game.id)
                          ? 'text-emerald-300 font-bold'
                          : ''
                      }
                    >
                      {['cuarto-rey', 'verdad-reto', 'caballos', 'apuestas-mayor-menor'].includes(game.id)
                        ? '¡Modo Virtual Listo!'
                        : game.status}
                    </span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {game.id === 'cuarto-rey' && onPlayCuartoRey && (
                      <button
                        onClick={onPlayCuartoRey}
                        className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-stone-950 border border-amber-300 shadow-md shadow-amber-500/25 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>▶️</span>
                        <span>Jugar Cuarto Rey</span>
                      </button>
                    )}

                    {game.id === 'verdad-reto' && onPlayVerdadReto && (
                      <button
                        onClick={onPlayVerdadReto}
                        className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:brightness-110 active:scale-95 text-white border border-rose-300 shadow-md shadow-rose-500/25 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>▶️</span>
                        <span>Jugar Verdad o Reto</span>
                      </button>
                    )}

                    {game.id === 'caballos' && onPlayCaballos && (
                      <button
                        onClick={onPlayCaballos}
                        className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:brightness-110 active:scale-95 text-stone-950 border border-emerald-300 shadow-md shadow-emerald-500/25 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>▶️</span>
                        <span>Jugar Carrera de Caballos</span>
                      </button>
                    )}

                    {game.id === 'apuestas-mayor-menor' && onPlayApuestas && (
                      <button
                        onClick={onPlayApuestas}
                        className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:brightness-110 active:scale-95 text-stone-950 border border-cyan-300 shadow-md shadow-cyan-500/25 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>▶️</span>
                        <span>Jugar Apuestas</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleExpand(game.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Cerrar ✕' : 'Ver Reglas 📖'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. Footer con acción rápida */}
      <footer className="w-full py-2 flex items-center justify-between border-t border-stone-800/80 shrink-0 text-xs text-stone-400">
        <span>Mostrando <strong>{filteredGames.length}</strong> juegos</span>
        <button
          onClick={onBack}
          className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
        >
          Volver al Menú Principal
        </button>
      </footer>
    </div>
  );
}
