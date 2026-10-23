import React, { useState, useEffect } from 'react';
import Roulette from './components/Roulette';
import CardModal from './components/CardModal';
import ModeSelectorModal from './components/ModeSelectorModal';
import PenaltyWheelModal from './components/PenaltyWheelModal';
import MainMenu from './components/MainMenu';
import PlayerSetup from './components/PlayerSetup';
import SettingsModal from './components/SettingsModal';
import { deckManager, GAME_MODES } from './utils/deckManager';
import { soundManager } from './utils/soundEffects';
import { getAnimalAvatar } from './utils/animalAvatars';

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

  // 2. Pantalla activa: 'players' (si no hay jugadores), 'menu' (menú principal), o 'game' (ruleta)
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

  // 4. Configuración de Opciones (Tema y Audio)
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

  const activeModeObj = GAME_MODES.find((m) => m.id === currentMode) || GAME_MODES[1];
  const activePlayer = players[currentPlayerIndex % (players.length || 1)] || { name: 'Jugador 1', gender: 'hombre' };

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

  // Manejo de giro de ruleta
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
      <div className={`min-h-screen ${themeContainerClass} transition-colors duration-200`}>
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
      <div className={`min-h-screen ${themeContainerClass} transition-colors duration-200 relative`}>
        <MainMenu
          players={players}
          currentMode={currentMode}
          onPlay={() => setScreen('game')}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
              <h3 className="text-xl font-black text-amber-400 mb-3">
                🍹 Reglas de la Casa
              </h3>
              <ul className="text-sm text-slate-300 space-y-2 mb-6">
                <li>✨ <strong>Un solo celular:</strong> Se van pasando el teléfono en cada turno.</li>
                <li>🎯 <strong>Gira la ruleta:</strong> Cumple el reto o pregunta de la categoría que salga.</li>
                <li>🎲 <strong>¿No quieres hacerlo?:</strong> Si te rehúsas a responder o hacer el reto, gira la <em>Ruleta del Jugoso</em> para probar tu suerte.</li>
                <li>🧃 <strong>Modos de juego:</strong> Cambia la intensidad arriba (desde *Vasito 250ml* hasta *Camión 3 Ton*).</li>
                <li>💧 <strong>Toma con cabeza:</strong> Puedes jugar con cerveza, tragos, agua o jugo. ¡No hay obligación de beber alcohol!</li>
              </ul>
              <button
                onClick={() => setShowRules(false)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 rounded-xl font-black text-sm uppercase tracking-wide transition"
              >
                ¡Entendido, a Jugar!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER 3: Pantalla de Juego con la Ruleta
  return (
    <div className={`min-h-screen flex flex-col justify-between items-center px-4 py-4 ${themeContainerClass} max-w-md mx-auto relative transition-colors duration-200`}>
      {/* Barra superior del Juego */}
      <header className="w-full flex items-center justify-between py-2 border-b border-slate-800/60">
        <button
          onClick={() => setScreen('menu')}
          className="flex items-center gap-1.5 text-xs bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition shadow"
        >
          <span>🏠</span>
          <span>Menú</span>
        </button>

        {/* Pill del modo activo */}
        <button
          onClick={() => setShowModeModal(true)}
          className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 shadow-sm active:scale-95 transition ${activeModeObj.badgeColor}`}
        >
          <span>{activeModeObj.icon}</span>
          <span className="font-bold">{activeModeObj.name}</span>
        </button>

        {/* Botón rápido de Opciones */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="text-sm bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold p-1.5 rounded-xl border border-slate-700 transition"
          title="Opciones"
        >
          ⚙️
        </button>
      </header>

      {/* Indicador destacado del Turno del Jugador */}
      <div className="w-full my-3 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
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
              <span className="text-xl font-black text-amber-400 tracking-wide">
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

      {/* Centro: Ruleta interactiva principal */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-2">
        <Roulette
          onSpinEnd={handleSpinEnd}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
        />
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
      />

      {/* Footer informativo */}
      <footer className="w-full text-center py-1 text-[11px] text-slate-500">
        Jugador {currentPlayerIndex + 1} de {players.length} • 100% Offline
      </footer>
    </div>
  );
}
