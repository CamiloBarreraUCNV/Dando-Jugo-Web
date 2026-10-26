import React, { useState, useEffect } from 'react';
import Roulette from './components/Roulette';
import CardModal from './components/CardModal';
import ModeSelectorModal from './components/ModeSelectorModal';
import PenaltyWheelModal from './components/PenaltyWheelModal';
import MainMenu from './components/MainMenu';
import PlayerSetup from './components/PlayerSetup';
import SettingsModal from './components/SettingsModal';
import FreePlaySelector from './components/FreePlaySelector';
import { deckManager, GAME_MODES } from './utils/deckManager';
import { soundManager } from './utils/soundEffects';
import { getAnimalAvatar } from './utils/animalAvatars';
import { wakeLockManager } from './utils/wakeLockManager';

export default function App() {
  // 1. Estado de Jugadores (recuperado de localStorage)
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('dando_jugo_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Pantalla activa: 'players' (si no hay jugadores), 'menu' (menú principal), 'game' (ruleta), o 'freemode' (a la carta)
  const [screen, setScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('dando_jugo_players');
      const list = saved ? JSON.parse(saved) : [];
      return list.length >= 2 ? 'menu' : 'players';
    } catch {
      return 'players';
    }
  });

  // 3. Índice del jugador actual en turno
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // 4. Configuración de Opciones (Tema, Audio y Wake Lock)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('dando_jugo_theme') !== 'light';
  });
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem('dando_jugo_volume');
    return v !== null ? parseFloat(v) : 1.0;
  });
  const [wheelSound, setWheelSound] = useState(() => {
    return localStorage.getItem('dando_jugo_wheelsound') !== 'false';
  });
  const [keepScreenOn, setKeepScreenOn] = useState(() => {
    return localStorage.getItem('dando_jugo_wakelock') !== 'false';
  });

  // 5. Modo de juego actual
  const [currentMode, setCurrentMode] = useState(() => {
    return localStorage.getItem('dando_jugo_mode') || 'caja';
  });

  // 6. Estados de modales y juego
  const [currentCard, setCurrentCard] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sincronizar audio con soundManager en inicio
  useEffect(() => {
    soundManager.setVolume(volume);
    soundManager.setWheelSound(wheelSound);
  }, []);

  // Sincronizar Wake Lock (Mantener pantalla encendida durante el juego)
  useEffect(() => {
    wakeLockManager.setEnabled(keepScreenOn);
  }, [keepScreenOn]);

  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];
  const activePlayer = players[currentPlayerIndex % (players.length || 1)] || { name: 'Jugador 1', gender: 'hombre' };
  const nextPlayer = players.length > 1 ? players[(currentPlayerIndex + 1) % players.length] : null;

  // Guardar jugadores
  const handleSavePlayers = (newPlayers) => {
    setPlayers(newPlayers);
    localStorage.setItem('dando_jugo_players', JSON.stringify(newPlayers));
    setCurrentPlayerIndex(0);
    setScreen('menu');
  };

  // Cambiar modo de juego
  const handleSelectMode = (modeId) => {
    setCurrentMode(modeId);
    localStorage.setItem('dando_jugo_mode', modeId);
    soundManager.playTick(750);
  };

  // Ajustes de opciones
  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('dando_jugo_theme', next ? 'dark' : 'light');
  };

  const handleChangeVolume = (val) => {
    setVolume(val);
    localStorage.setItem('dando_jugo_volume', val.toString());
  };

  const handleToggleWheelSound = (val) => {
    setWheelSound(val);
    localStorage.setItem('dando_jugo_wheelsound', val ? 'true' : 'false');
  };

  const handleToggleKeepScreenOn = (val) => {
    setKeepScreenOn(val);
    localStorage.setItem('dando_jugo_wakelock', val ? 'true' : 'false');
  };

  // Detección automática si la tarjeta requiere otro jugador objetivo / víctima
  const detectTargetPlayer = (card, playerInTurn) => {
    if (!players || players.length < 2) return null;
    const fullText = `${card.titulo || ''} ${card.descripcion || ''} ${card.pregunta || ''} ${card.instruccionMinijuego || ''}`.toLowerCase();

    const triggers = [
      'otro jugador',
      'un jugador',
      'elige a un jugador',
      'elige un jugador',
      'sexo contrario',
      'votar por un jugador',
      'succiona el dedo',
      'pellizquen',
      'lame la oreja',
      'sientate en las piernas',
      'sentadillas en la cara'
    ];

    const needsTarget = triggers.some((t) => fullText.includes(t));
    if (!needsTarget) return null;

    const otherPlayers = players.filter((p) => p.id !== playerInTurn.id);
    if (otherPlayers.length === 0) return null;

    if (fullText.includes('sexo contrario')) {
      const opposites = otherPlayers.filter((p) => p.gender !== playerInTurn.gender);
      if (opposites.length > 0) {
        return opposites[Math.floor(Math.random() * opposites.length)];
      }
    }

    return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  };

  // Manejo de giro de ruleta (Modo Clásico)
  const handleSpinEnd = (selectedCategory) => {
    const card = deckManager.drawCard(selectedCategory.id, currentMode);
    if (card) {
      const target = detectTargetPlayer(card, activePlayer);
      setCurrentCard({
        ...card,
        targetPlayer: target,
      });
    } else {
      alert(`¡Se agotaron las tarjetas de ${selectedCategory.name}!`);
    }
  };

  // Manejo de selección directa (Modo a la Carta / Sin Ruleta)
  const handleSelectSpecificGame = (gameTypeId) => {
    const card = deckManager.drawSpecificCard(gameTypeId, currentMode);
    if (card) {
      const target = detectTargetPlayer(card, activePlayer);
      setCurrentCard({
        ...card,
        targetPlayer: target,
      });
    } else {
      alert('¡Se agotaron las tarjetas de esta categoría!');
    }
  };

  // Pasar al siguiente jugador
  const advanceTurn = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const handleCloseCard = () => {
    setCurrentCard(null);
    advanceTurn();
  };

  const handleTriggerPenalty = () => {
    setCurrentCard(null);
    setShowPenaltyModal(true);
  };

  const handleClosePenalty = () => {
    setShowPenaltyModal(false);
    advanceTurn();
  };

  // Estilos según el modo oscuro/claro (Fondo ahumado cálido para contrastar con el logo)
  const themeContainerClass = isDarkMode
    ? 'bg-gradient-to-b from-[#140f12] via-[#0b080a] to-[#040304] text-stone-100'
    : 'bg-gradient-to-b from-amber-50 via-stone-100 to-amber-50 text-stone-900';

  // RENDER 1: Pantalla de Configuración de Jugadores
  if (screen === 'players') {
    return (
      <div className={`min-h-dvh ${themeContainerClass} transition-colors duration-200`}>
        <PlayerSetup
          players={players}
          onSavePlayers={handleSavePlayers}
          onCancel={players.length >= 2 ? () => setScreen('menu') : null}
          isFirstTime={players.length < 2}
        />
      </div>
    );
  }

  // RENDER 2: Menú Principal
  if (screen === 'menu') {
    return (
      <div className={`min-h-dvh ${themeContainerClass} transition-colors duration-200 relative`}>
        <MainMenu
          players={players}
          currentMode={currentMode}
          onPlay={() => setScreen('game')}
          onFreePlay={() => setScreen('freemode')}
          onOptions={() => setShowSettingsModal(true)}
          onChangePlayers={() => setScreen('players')}
          onOpenRules={() => setShowRules(true)}
          onOpenModeSelector={() => setShowModeModal(true)}
        />

        {/* Modal de Opciones */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          volume={volume}
          onChangeVolume={handleChangeVolume}
          wheelSound={wheelSound}
          onToggleWheelSound={handleToggleWheelSound}
          keepScreenOn={keepScreenOn}
          onToggleKeepScreenOn={handleToggleKeepScreenOn}
        />

        {/* Modal de Selección de Modos */}
        <ModeSelectorModal
          isOpen={showModeModal}
          onClose={() => setShowModeModal(false)}
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
        />

        {/* Modal de Reglas */}
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-sm sm:max-w-md bg-[#161214] border border-amber-900/40 rounded-3xl p-6 shadow-2xl text-stone-100">
              <h3 className="text-xl font-display font-black text-amber-400 mb-3">
                🍹 Reglas de la Casa
              </h3>
              <ul className="text-sm text-stone-300 space-y-2 mb-6">
                <li>✨ <strong>Un solo celular:</strong> Se van pasando el teléfono en cada turno.</li>
                <li>🎯 <strong>Modo Ruleta:</strong> El azar decide qué categoría juegas.</li>
                <li>🎴 <strong>Modo a la Carta:</strong> El jugador en turno elige libremente qué dinámica jugar.</li>
                <li>🎲 <strong>¿No quieres hacerlo?:</strong> Si te rehúsas a responder o hacer el reto, gira la <em>Ruleta del Jugoso</em> para probar tu suerte.</li>
                <li>🧃 <strong>Modos de juego:</strong> Cambia la intensidad arriba (desde *Vasito 250ml* hasta *Camión 3 Ton*).</li>
                <li>💧 <strong>Toma con cabeza:</strong> Puedes jugar con cerveza, tragos, agua o jugo. ¡No hay obligación de beber alcohol!</li>
              </ul>
              <button
                onClick={() => setShowRules(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-98 text-stone-950 rounded-xl font-display font-black text-sm uppercase tracking-wide transition border border-amber-300 shadow-lg"
              >
                ¡Entendido, a Jugar!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER 3 & 4: Pantalla de Juego (Ruleta o Modo a la Carta)
  const isFreeMode = screen === 'freemode';

  return (
    <div className={`h-dvh max-h-dvh flex flex-col justify-between items-center px-4 pt-safe pb-safe ${themeContainerClass} max-w-md md:max-w-4xl lg:max-w-5xl mx-auto relative transition-colors duration-200 overflow-hidden w-full`}>
      {/* Barra superior del Juego */}
      <header className="w-full flex items-center justify-between py-2 border-b border-slate-800/60 shrink-0">
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-1.5 text-xs bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition shadow"
        >
          <span>🏠</span>
          <span>Menú</span>
        </button>

        {/* Selector de modo Ruleta vs A la Carta */}
        <button
          onClick={() => setScreen(isFreeMode ? 'game' : 'freemode')}
          className="flex items-center gap-1 text-xs bg-stone-900/90 hover:bg-stone-800 active:scale-95 text-amber-300 font-black px-2.5 py-1.5 rounded-xl border border-amber-500/40 transition shadow-sm"
          title={isFreeMode ? 'Cambiar a modo Ruleta' : 'Cambiar a modo A la Carta'}
        >
          <span>{isFreeMode ? '🎯 Ruleta' : '🎴 A la Carta'}</span>
        </button>

        {/* Pill del modo activo */}
        <button
          onClick={() => setShowModeModal(true)}
          className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 shadow-sm active:scale-95 transition ${activeModeObj.badgeColor}`}
        >
          <span>{activeModeObj.icon}</span>
          <span className="font-bold">{activeModeObj.name}</span>
        </button>

        {/* Acciones de Opciones y Estado Wake Lock */}
        <div className="flex items-center gap-1.5">
          {keepScreenOn && (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded-xl border border-amber-500/30 transition flex items-center gap-1 active:scale-95"
              title="Pantalla siempre encendida: Activa"
            >
              <span>🔆</span>
              <span className="hidden sm:inline text-[10px]">On</span>
            </button>
          )}

          <button
            onClick={() => setShowSettingsModal(true)}
            className="text-sm bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold p-1.5 rounded-xl border border-slate-700 transition"
            title="Opciones"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Indicador destacado del Turno del Jugador (Visible solo en Móvil, en Tablet/TV se integra a la derecha) */}
      <div className="w-full my-2 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 shrink-0 md:hidden">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          ES EL TURNO DE
        </span>
        <div className="flex items-center gap-3 mt-1 px-4 py-2 rounded-2xl bg-amber-500/10 border-2 border-amber-400/60 shadow-lg shadow-amber-500/10">
          <img
            src={getAnimalAvatar(activePlayer?.animal).image}
            alt={getAnimalAvatar(activePlayer?.animal).name}
            className="w-11 h-11 object-contain rounded-xl bg-slate-950 p-0.5 border border-amber-400 drop-shadow"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-display font-black text-amber-400 tracking-wide">
                {activePlayer.name}
              </span>
              <span className="text-xs">
                {activePlayer.gender === 'mujer' ? '👩' : activePlayer.gender === 'hombre' ? '👨' : '🧑'}
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold block">
              {getAnimalAvatar(activePlayer?.animal).name} • {getAnimalAvatar(activePlayer?.animal).phrase}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 italic">
          👉 ¡Pásale el teléfono a {activePlayer.name}!
        </span>
      </div>

      {/* Centro: Ruleta interactiva O Selector A la Carta */}
      <main className={`w-full flex-1 min-h-0 flex flex-col ${isFreeMode ? 'justify-start' : 'justify-center'} my-1 overflow-hidden`}>
        {isFreeMode ? (
          <FreePlaySelector onSelectGameType={handleSelectSpecificGame} />
        ) : (
          <div className="w-full h-full flex flex-col md:grid md:grid-cols-12 md:gap-8 items-center justify-center">
            
            {/* Columna Izquierda (7 cols en Tablet/Desktop): Ruleta */}
            <div className="w-full flex flex-col items-center justify-center md:col-span-7">
              <Roulette
                onSpinEnd={handleSpinEnd}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            </div>

            {/* Columna Derecha (5 cols en Tablet/Desktop): Tablero de la Mesa & Jugador Activo */}
            <div className="hidden md:flex flex-col gap-3.5 md:col-span-5 w-full bg-[#161214]/90 p-5 rounded-3xl border border-amber-900/40 shadow-2xl">
              
              {/* Turno Actual */}
              <div className="border-b border-stone-800/80 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300/80 block mb-1">
                  🏆 ES EL TURNO DE
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={getAnimalAvatar(activePlayer?.animal).image}
                    alt={getAnimalAvatar(activePlayer?.animal).name}
                    className="w-14 h-14 object-contain rounded-2xl bg-[#0c0a0b] p-1 border-2 border-amber-400 drop-shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-display font-black text-amber-400 tracking-wide">
                        {activePlayer.name}
                      </span>
                      <span className="text-sm">
                        {activePlayer.gender === 'mujer' ? '👩' : activePlayer.gender === 'hombre' ? '👨' : '🧑'}
                      </span>
                    </div>
                    <span className="text-xs text-amber-300 font-bold block">
                      {getAnimalAvatar(activePlayer?.animal).name}
                    </span>
                    <span className="text-[11px] text-stone-400 italic block">
                      "{getAnimalAvatar(activePlayer?.animal).phrase}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Mesa y Ronda de Jugadores */}
              <div className="bg-[#0c0a0b] p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between text-xs text-stone-400 font-bold mb-2">
                  <span>👥 MESA ({players.length} JUGADORES)</span>
                  {nextPlayer && (
                    <span className="text-amber-400">👉 Siguiente: <strong>{nextPlayer.name}</strong></span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                  {players.map((p, idx) => {
                    const isCurrent = idx === currentPlayerIndex % (players.length || 1);
                    const isNext = nextPlayer && p.id === nextPlayer.id;
                    const pAnimal = getAnimalAvatar(p.animal);
                    return (
                      <span
                        key={p.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                            : isNext
                            ? 'bg-stone-800/90 border border-amber-500/30 text-stone-200'
                            : 'bg-[#161214] border border-stone-800 text-stone-500'
                        }`}
                      >
                        <img src={pAnimal.image} alt={pAnimal.name} className="w-4 h-4 object-contain rounded" />
                        <span>{p.name}</span>
                        {isCurrent && <span className="text-[10px]">🎯</span>}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Modo de Juego Activo */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeModeObj.icon}</span>
                  <div>
                    <span className="text-xs font-black text-white block">{activeModeObj.name}</span>
                    <span className="text-[10px] text-stone-400 block">{activeModeObj.tag}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModeModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                >
                  Cambiar
                </button>
              </div>

              {/* Acceso Rápido Ruleta de Castigo */}
              <button
                onClick={() => setShowPenaltyModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs uppercase tracking-wide transition flex items-center justify-center gap-2 shadow"
              >
                <span>🎲</span>
                <span>Ruleta del Jugoso (Castigo)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Tarjeta del Reto */}
      {currentCard && (
        <CardModal
          card={currentCard}
          activePlayer={activePlayer}
          currentMode={currentMode}
          onClose={handleCloseCard}
          onTriggerPenalty={handleTriggerPenalty}
        />
      )}

      {/* Modal de Ruleta de Castigo adaptativa */}
      <PenaltyWheelModal
        isOpen={showPenaltyModal}
        onClose={handleClosePenalty}
        currentMode={currentMode}
      />

      {/* Modal de Selección de Modos de Juego */}
      <ModeSelectorModal
        isOpen={showModeModal}
        onClose={() => setShowModeModal(false)}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
      />

      {/* Modal de Opciones */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        wheelSound={wheelSound}
        onToggleWheelSound={handleToggleWheelSound}
        keepScreenOn={keepScreenOn}
        onToggleKeepScreenOn={handleToggleKeepScreenOn}
      />

      {/* Footer informativo */}
      <footer className="w-full text-center py-1 text-[11px] text-slate-500 shrink-0">
        Jugador {currentPlayerIndex + 1} de {players.length} • {isFreeMode ? 'Modo A la Carta' : 'Modo Ruleta'}
      </footer>
    </div>
  );
}
