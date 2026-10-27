/**
 * Motor Lógico de Baraja, Vallas y Apuestas para "Carrera de Caballos" (Turf Club)
 * 
 * Reglas fundamentales:
 * 1. 4 Caballos con 4 Colores Distintos (Rojo, Oro, Esmeralda, Zafiro) asignados a los 4 palos.
 * 2. Fase Inicial de Apuestas: Cada jugador elige su caballo y define sus sorbos apostados (>= 1).
 * 3. 6 Vallas / Obstáculos laterales con cartas boca abajo a lo largo del recorrido.
 * 4. Tropiezo en Vallas: Cuando los 4 caballos superan el escalón de una valla, se revela la carta
 *    lateral y el caballo de ese palo retrocede 1 casilla.
 * 5. Liquidación Final:
 *    - Los que apostaron al caballo ganador regalan/reparten el DOBLE de sus sorbos apostados.
 *    - Los que apostaron a los caballos perdedores beben sus sorbos apostados.
 */

// 1. Identidad de los 4 Caballos Competidores (4 Colores Distintos)
export const HORSES = [
  {
    id: 'corazones',
    suit: 'corazones',
    symbol: '❤️',
    name: 'Furia Roja',
    colorKey: 'rojo',
    hexColor: '#ef4444',
    bgGradient: 'from-red-600 to-rose-700',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-500',
    glowClass: 'shadow-rose-500/50',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    laneBg: 'bg-rose-950/30 border-rose-900/40',
    avatar: '🐎',
    silkNumber: 1,
  },
  {
    id: 'diamantes',
    suit: 'diamantes',
    symbol: '♦️',
    name: 'Relámpago Dorado',
    colorKey: 'oro',
    hexColor: '#f59e0b',
    bgGradient: 'from-amber-500 to-yellow-600',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-500',
    glowClass: 'shadow-amber-500/50',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    laneBg: 'bg-amber-950/30 border-amber-900/40',
    avatar: '🏇',
    silkNumber: 2,
  },
  {
    id: 'treboles',
    suit: 'treboles',
    symbol: '♣️',
    name: 'Trébol Esmeralda',
    colorKey: 'esmeralda',
    hexColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-700',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500',
    glowClass: 'shadow-emerald-500/50',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    laneBg: 'bg-emerald-950/30 border-emerald-900/40',
    avatar: '🐎',
    silkNumber: 3,
  },
  {
    id: 'picas',
    suit: 'picas',
    symbol: '♠️',
    name: 'Sombra Zafiro',
    colorKey: 'zafiro',
    hexColor: '#3b82f6',
    bgGradient: 'from-blue-600 to-indigo-700',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500',
    glowClass: 'shadow-blue-500/50',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    laneBg: 'bg-blue-950/30 border-blue-900/40',
    avatar: '🏇',
    silkNumber: 4,
  },
];

// Longitud por defecto de la pista (casillas para ganar)
export const DEFAULT_TRACK_LENGTH = 7; // Pasos de 0 a 7 (la meta es el paso 7)
export const DEFAULT_HURDLES_COUNT = 6; // Vallas en los pasos 1, 2, 3, 4, 5 y 6

export const SUIT_NAMES = {
  corazones: 'Corazones',
  diamantes: 'Diamantes',
  treboles: 'Tréboles',
  picas: 'Picas',
};

// Generador de baraja inglesa estándar completa (52 cartas)
export function createDeck() {
  const suits = ['corazones', 'diamantes', 'treboles', 'picas'];
  const values = [
    { value: 'A', name: 'As', rank: 14 },
    { value: '2', name: 'Dos', rank: 2 },
    { value: '3', name: 'Tres', rank: 3 },
    { value: '4', name: 'Cuatro', rank: 4 },
    { value: '5', name: 'Cinco', rank: 5 },
    { value: '6', name: 'Seis', rank: 6 },
    { value: '7', name: 'Siete', rank: 7 },
    { value: '8', name: 'Ocho', rank: 8 },
    { value: '9', name: 'Nueve', rank: 9 },
    { value: '10', name: 'Diez', rank: 10 },
    { value: 'J', name: 'Jota', rank: 11 },
    { value: 'Q', name: 'Reina', rank: 12 },
    { value: 'K', name: 'Rey', rank: 13 },
  ];

  const deck = [];
  suits.forEach((suit) => {
    values.forEach((val) => {
      deck.push({
        id: `${suit}_${val.value}`,
        suit,
        value: val.value,
        name: `${val.name} de ${SUIT_NAMES[suit]}`,
        rank: val.rank,
      });
    });
  });

  return deck;
}

// Barajado Fisher-Yates
export function shuffleDeck(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Gestor del Motor de Carrera de Caballos
 */
export class CaballosRaceManager {
  constructor({ trackLength = DEFAULT_TRACK_LENGTH, hurdlesCount = DEFAULT_HURDLES_COUNT } = {}) {
    this.trackLength = trackLength;
    this.hurdlesCount = Math.min(hurdlesCount, trackLength - 1);
    this.reset();
  }

  /**
   * Inicializa o reinicia la carrera completa
   */
  reset() {
    this.phase = 'betting'; // 'betting' | 'racing' | 'finished'
    this.winner = null;
    this.results = null;
    this.history = []; // Historial de eventos turnos/vallas

    // Posición inicial de cada caballo: paso 0
    this.positions = {
      corazones: 0,
      diamantes: 0,
      treboles: 0,
      picas: 0,
    };

    // Apuestas de los jugadores: { [playerId]: { playerId, playerName, horseId, sipsBet } }
    this.bets = {};

    // 1. Crear baraja completa y extraer los 4 Ases (los competidores)
    const rawDeck = createDeck();
    const aces = rawDeck.filter((c) => c.value === 'A');
    const remainingDeck = rawDeck.filter((c) => c.value !== 'A');

    // 2. Barajar las 48 cartas restantes
    const shuffledRemaining = shuffleDeck(remainingDeck);

    // 3. Separar las cartas de vallas (tantas como hurdlesCount)
    // Se colocan en los pasos 1, 2, 3, ... hurdlesCount
    this.hurdles = [];
    for (let i = 0; i < this.hurdlesCount; i++) {
      const card = shuffledRemaining.pop();
      this.hurdles.push({
        step: i + 1,
        card,
        revealed: false,
      });
    }

    // 4. El resto de cartas forman el mazo de avance de carrera
    this.raceDeck = shuffledRemaining;
    this.discardPile = [];
  }

  /**
   * Registra o actualiza la apuesta de un jugador
   * @param {string} playerId
   * @param {string} playerName
   * @param {string} horseId ('corazones', 'diamantes', 'treboles', 'picas')
   * @param {number} sipsBet Cantidad de sorbos apostados (>= 1)
   */
  setBet(playerId, playerName, horseId, sipsBet) {
    if (this.phase !== 'betting') {
      throw new Error('Solo se pueden realizar apuestas durante la ronda de apuestas previa.');
    }

    const horse = HORSES.find((h) => h.id === horseId);
    if (!horse) {
      throw new Error(`Caballo no válido: ${horseId}`);
    }

    const cleanSips = Math.max(1, parseInt(sipsBet, 10) || 1);

    this.bets[playerId] = {
      playerId,
      playerName: playerName || `Jugador ${playerId}`,
      horseId,
      horse,
      sipsBet: cleanSips,
    };

    return this.bets[playerId];
  }

  /**
   * Obtiene la lista de apuestas en formato array
   */
  getBetsList() {
    return Object.values(this.bets);
  }

  /**
   * Inicia la carrera después de la ronda de apuestas
   */
  startRace() {
    if (this.phase !== 'betting') return;
    this.phase = 'racing';
    this.history.push({
      type: 'race_started',
      timestamp: Date.now(),
      text: '¡Partieron! La carrera de caballos ha comenzado.',
    });
  }

  /**
   * Extrae la siguiente carta del mazo de carrera y procesa:
   * 1. Avance del caballo del palo de la carta (+1 paso).
   * 2. Verificación de si alcanzó la meta.
   * 3. Verificación de vallas superadas por todos los caballos (tropiezo y retroceso -1).
   * 
   * @returns {Object} Detalle de lo sucedido en este turno
   */
  drawNextCard() {
    if (this.phase !== 'racing') {
      return { phase: this.phase, isFinished: this.phase === 'finished' };
    }

    // Si el mazo se agota (muy raro), se rebaraja el descarte
    if (this.raceDeck.length === 0) {
      if (this.discardPile.length === 0) {
        throw new Error('No hay cartas disponibles para continuar la carrera.');
      }
      this.raceDeck = shuffleDeck(this.discardPile);
      this.discardPile = [];
    }

    // 1. Extraer carta
    const drawnCard = this.raceDeck.pop();
    this.discardPile.push(drawnCard);

    const advancingSuit = drawnCard.suit;
    const advancingHorse = HORSES.find((h) => h.id === advancingSuit);

    // 2. Avanzar el caballo correspondiente 1 paso
    this.positions[advancingSuit] += 1;
    const newPosition = this.positions[advancingSuit];

    const turnEvent = {
      card: drawnCard,
      advancingHorse,
      newPosition,
      hurdlesTriggered: [],
      winner: null,
      isFinished: false,
    };

    // 3. ¿El caballo cruzó la meta?
    if (newPosition >= this.trackLength) {
      this.phase = 'finished';
      this.winner = advancingHorse;
      this.results = this.calculateSettlement(advancingHorse.id);

      turnEvent.isFinished = true;
      turnEvent.winner = advancingHorse;
      turnEvent.results = this.results;

      this.history.push({
        type: 'winner',
        card: drawnCard,
        horse: advancingHorse,
        text: `🏆 ¡${advancingHorse.name} (${advancingHorse.symbol}) ha cruzado la meta en 1.er lugar!`,
      });

      return turnEvent;
    }

    // 4. Si aún no termina, verificar si todos los 4 caballos han superado alguna valla
    const minPosition = Math.min(
      this.positions.corazones,
      this.positions.diamantes,
      this.positions.treboles,
      this.positions.picas
    );

    // Revisar vallas que aún no se han revelado
    for (const hurdle of this.hurdles) {
      if (!hurdle.revealed && minPosition >= hurdle.step) {
        // ¡Se activa la valla!
        hurdle.revealed = true;
        const hurdleSuit = hurdle.card.suit;
        const penalizedHorse = HORSES.find((h) => h.id === hurdleSuit);

        // El caballo del palo de la valla tropieza y retrocede 1 paso (mínimo 0)
        const previousPos = this.positions[hurdleSuit];
        this.positions[hurdleSuit] = Math.max(0, this.positions[hurdleSuit] - 1);
        const penalizedNewPos = this.positions[hurdleSuit];

        const hurdleTrigger = {
          step: hurdle.step,
          card: hurdle.card,
          penalizedHorse,
          previousPos,
          newPos: penalizedNewPos,
        };

        turnEvent.hurdlesTriggered.push(hurdleTrigger);

        this.history.push({
          type: 'hurdle_triggered',
          step: hurdle.step,
          card: hurdle.card,
          horse: penalizedHorse,
          text: `🚧 ¡Valla ${hurdle.step} revelada! Salió ${hurdle.card.name}. ¡${penalizedHorse.name} tropieza y retrocede a la casilla ${penalizedNewPos}!`,
        });
      }
    }

    this.history.push({
      type: 'advance',
      card: drawnCard,
      horse: advancingHorse,
      newPosition,
      text: `${advancingHorse.name} avanza a la casilla ${newPosition} con ${drawnCard.name}.`,
    });

    return turnEvent;
  }

  /**
   * Liquidación de Apuestas:
   * - Si el caballo del jugador ganó: Regala/reparte el DOBLE de sus sorbos apostados.
   * - Si el caballo del jugador perdió: Bebe sus sorbos apostados.
   * 
   * @param {string} winningHorseId
   * @returns {Object} Resumen completo de ganadores, perdedores y total de sorbos
   */
  calculateSettlement(winningHorseId) {
    const betsList = this.getBetsList();
    const winningHorse = HORSES.find((h) => h.id === winningHorseId);

    const winners = [];
    const losers = [];
    let totalSipsToGive = 0;
    let totalSipsToDrink = 0;

    betsList.forEach((bet) => {
      const isWinner = bet.horseId === winningHorseId;

      if (isWinner) {
        const sipsToGive = bet.sipsBet * 2; // ¡Regala el doble!
        totalSipsToGive += sipsToGive;
        winners.push({
          ...bet,
          isWinner: true,
          sipsToGive,
          sipsToDrink: 0,
          description: `¡Acertó con ${winningHorse.name}! Reparte ${sipsToGive} sorbos a la mesa (el doble de sus ${bet.sipsBet} apostados).`,
        });
      } else {
        const sipsToDrink = bet.sipsBet; // ¡Bebe lo apostado!
        totalSipsToDrink += sipsToDrink;
        losers.push({
          ...bet,
          isWinner: false,
          sipsToGive: 0,
          sipsToDrink,
          description: `Apostó por ${bet.horse.name}. Debe tomarse ${sipsToDrink} sorbos de castigo.`,
        });
      }
    });

    return {
      winningHorse,
      winners,
      losers,
      totalSipsToGive,
      totalSipsToDrink,
      totalBetsPlaced: betsList.length,
    };
  }

  /**
   * Devuelve una instantánea del estado de la carrera
   */
  getSnapshot() {
    return {
      phase: this.phase,
      trackLength: this.trackLength,
      positions: { ...this.positions },
      hurdles: this.hurdles.map((h) => ({ ...h })),
      bets: this.getBetsList(),
      cardsRemaining: this.raceDeck.length,
      cardsDiscarded: this.discardPile.length,
      winner: this.winner,
      results: this.results,
      leader: this.getLeader(),
    };
  }

  /**
   * Obtiene el caballo puntero actual
   */
  getLeader() {
    let maxPos = -1;
    let leaders = [];

    HORSES.forEach((horse) => {
      const pos = this.positions[horse.id];
      if (pos > maxPos) {
        maxPos = pos;
        leaders = [horse];
      } else if (pos === maxPos) {
        leaders.push(horse);
      }
    });

    return {
      position: maxPos,
      horses: leaders,
      isTied: leaders.length > 1,
    };
  }
}

// Instancia compartida única por defecto
export const caballosRaceManager = new CaballosRaceManager();
