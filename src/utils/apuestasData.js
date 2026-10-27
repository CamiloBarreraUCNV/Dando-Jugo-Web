/**
 * Motor de Lógica, Baraja y Probabilidades para "Juego de las Apuestas (Mayor o Menor)"
 * 
 * Reglas fundamentales:
 * 1. Baraja inglesa estándar de 52 cartas (del As = 1 al Rey alto = 13).
 * 2. Cálculo dinámico de probabilidades en tiempo real sobre las cartas restantes en el mazo:
 *    - Mayor (⬆️), Menor (⬇️) o Mismo Número / Empate (🟰).
 * 3. Riesgo vs Recompensa: Cuanto más baja la probabilidad de acierto, más sorbos regalas a la mesa.
 * 4. El Pozo Acumulado: Inicia en 1 y crece con cada acierto. Si fallas, ¡te bebes TODO el pozo!
 * 5. Empate Inesperado: Si sale el mismo número y no lo predijiste, ¡el pozo se duplica y te lo bebes!
 * 6. Estrategia de Plantarse: Tras acertar al menos 1 vez, el jugador puede plantarse y pasarle
 *    el pozo caliente al siguiente jugador.
 */

export const SUITS = [
  { id: 'corazones', name: 'Corazones', symbol: '❤️', isRed: true },
  { id: 'diamantes', name: 'Diamantes', symbol: '♦️', isRed: true },
  { id: 'treboles', name: 'Tréboles', symbol: '♣️', isRed: false },
  { id: 'picas', name: 'Picas', symbol: '♠️', isRed: false },
];

export const RANKS = [
  { rank: 1, label: 'A', name: 'As' },
  { rank: 2, label: '2', name: 'Dos' },
  { rank: 3, label: '3', name: 'Tres' },
  { rank: 4, label: '4', name: 'Cuatro' },
  { rank: 5, label: '5', name: 'Cinco' },
  { rank: 6, label: '6', name: 'Seis' },
  { rank: 7, label: '7', name: 'Siete' },
  { rank: 8, label: '8', name: 'Ocho' },
  { rank: 9, label: '9', name: 'Nueve' },
  { rank: 10, label: '10', name: 'Diez' },
  { rank: 11, label: 'J', name: 'Jota' },
  { rank: 12, label: 'Q', name: 'Reina' },
  { rank: 13, label: 'K', name: 'Rey' },
];

/**
 * Crea una baraja completa de 52 cartas
 */
export function createDeck() {
  const deck = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((r) => {
      deck.push({
        id: `${suit.id}_${r.label}`,
        suit: suit.id,
        suitSymbol: suit.symbol,
        isRed: suit.isRed,
        rank: r.rank,
        value: r.label,
        name: `${r.name} de ${suit.name}`,
      });
    });
  });
  return deck;
}

/**
 * Barajado Fisher-Yates
 */
export function shuffleDeck(deck) {
  const array = [...deck];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Determina los sorbos a regalar según la probabilidad matemática calculada
 * Regla: Mientras más baja la probabilidad, más sorbos regalas a la mesa si aciertas.
 */
export function getSipsForProbability(prob, isSame = false) {
  if (isSame) {
    // Si acierta el mismo número exacto (probabilidad ínfima ~5.8%): Recompensa Jackpot
    return 8;
  }
  if (prob <= 0) return 10; // Si era matemáticamente 0% y sale (ej. cartas comodín)
  if (prob >= 0.70) return 1; // Apuesta muy segura (≥ 70%) -> 1 sorbo
  if (prob >= 0.50) return 2; // Apuesta moderada (50% a 69%) -> 2 sorbos
  if (prob >= 0.30) return 4; // Apuesta arriesgada (30% a 49%) -> 4 sorbos
  if (prob >= 0.15) return 6; // Apuesta peligrosa (15% a 29%) -> 6 sorbos
  return 8;                   // Apuesta extrema (< 15%) -> 8 sorbos
}

/**
 * Etiqueta visual de nivel de riesgo
 */
export function getRiskTier(prob) {
  if (prob >= 0.70) return { label: 'Muy Segura', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' };
  if (prob >= 0.50) return { label: 'Moderada', color: 'text-amber-400', badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300' };
  if (prob >= 0.30) return { label: 'Arriesgada', color: 'text-orange-400', badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300' };
  if (prob >= 0.15) return { label: 'Peligro', color: 'text-rose-400', badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300' };
  return { label: 'Extrema', color: 'text-red-500', badgeBg: 'bg-red-500/20 border-red-500/40 text-red-300' };
}

/**
 * Calcula en tiempo real las probabilidades exactas sobre las cartas restantes en el mazo
 * @param {Object} currentCard Carta visible actual en la mesa
 * @param {Array} remainingDeck Cartas que aún quedan en el mazo
 * @returns {Object} Desglose completo de probabilidades y sorbos a regalar por opción
 */
export function calculateOdds(currentCard, remainingDeck) {
  if (!currentCard || !remainingDeck || remainingDeck.length === 0) {
    return {
      totalRemaining: 0,
      higher: { count: 0, prob: 0, percent: 0, sips: 1, tier: getRiskTier(0) },
      lower: { count: 0, prob: 0, percent: 0, sips: 1, tier: getRiskTier(0) },
      same: { count: 0, prob: 0, percent: 0, sips: 8, tier: { label: 'Jackpot', color: 'text-amber-300', badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300' } },
    };
  }

  const total = remainingDeck.length;
  const curRank = currentCard.rank;

  let higherCount = 0;
  let lowerCount = 0;
  let sameCount = 0;

  for (const card of remainingDeck) {
    if (card.rank > curRank) higherCount++;
    else if (card.rank < curRank) lowerCount++;
    else sameCount++;
  }

  const probMayor = higherCount / total;
  const probMenor = lowerCount / total;
  const probMismo = sameCount / total;

  return {
    totalRemaining: total,
    higher: {
      count: higherCount,
      prob: probMayor,
      percent: Math.round(probMayor * 100),
      sips: getSipsForProbability(probMayor, false),
      tier: getRiskTier(probMayor),
    },
    lower: {
      count: lowerCount,
      prob: probMenor,
      percent: Math.round(probMenor * 100),
      sips: getSipsForProbability(probMenor, false),
      tier: getRiskTier(probMenor),
    },
    same: {
      count: sameCount,
      prob: probMismo,
      percent: Math.round(probMismo * 100),
      sips: getSipsForProbability(probMismo, true),
      tier: { label: 'Jackpot 💎', color: 'text-amber-300', badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
    },
  };
}

/**
 * Gestor del Juego de las Apuestas (Mayor o Menor)
 */
export class ApuestasGameManager {
  constructor({ players = [] } = {}) {
    this.players = players.length > 0 ? players : [
      { id: '1', name: 'Jugador 1', animal: 'perro' },
      { id: '2', name: 'Jugador 2', animal: 'gato' },
    ];
    this.reset();
  }

  /**
   * Inicializa o reinicia la partida
   */
  reset() {
    this.deck = shuffleDeck(createDeck());
    this.discardPile = [];
    
    // Extraer la primera carta visible
    this.currentCard = this.deck.pop();

    this.pot = 1; // El pozo de sorbos arranca en 1
    this.streak = 0; // Racha de aciertos del jugador actual
    this.canPass = false; // Solo puede plantarse tras al menos 1 acierto
    this.currentPlayerIndex = 0;
    this.lastResult = null;
    this.history = [];
  }

  /**
   * Actualiza la lista de jugadores activos
   */
  setPlayers(players) {
    if (players && players.length > 0) {
      this.players = players;
      this.currentPlayerIndex = this.currentPlayerIndex % players.length;
    }
  }

  /**
   * Obtiene el jugador activo en turno
   */
  getActivePlayer() {
    return this.players[this.currentPlayerIndex % this.players.length];
  }

  /**
   * Obtiene las probabilidades del turno actual
   */
  getOdds() {
    return calculateOdds(this.currentCard, this.deck);
  }

  /**
   * Ejecuta una apuesta: 'mayor' | 'menor' | 'mismo'
   * @param {string} option 
   * @returns {Object} Resultado detallado de la apuesta
   */
  placeBet(option) {
    if (!['mayor', 'menor', 'mismo'].includes(option)) {
      throw new Error(`Opción no válida: ${option}`);
    }

    // Si el mazo se agota, rebarajamos los descartes
    if (this.deck.length === 0) {
      if (this.discardPile.length === 0) {
        throw new Error('No hay cartas para continuar.');
      }
      this.deck = shuffleDeck(this.discardPile);
      this.discardPile = [];
    }

    const oddsBefore = this.getOdds();
    const prevCard = this.currentCard;

    // Extraer la siguiente carta
    const newCard = this.deck.pop();

    // Determinar resultado real
    let outcome = 'mismo';
    if (newCard.rank > prevCard.rank) outcome = 'mayor';
    else if (newCard.rank < prevCard.rank) outcome = 'menor';

    const isCorrect = (option === outcome);
    const activePlayer = this.getActivePlayer();

    let result = null;

    if (isCorrect) {
      // 1. Caso Acierto:
      // Obtener los sorbos a regalar según la probabilidad que tenía esta opción
      const chosenOdds = option === 'mayor' ? oddsBefore.higher : option === 'menor' ? oddsBefore.lower : oddsBefore.same;
      const sipsGifted = chosenOdds.sips;

      // El pozo sube de tensión (+1 sorbo)
      this.pot += 1;
      this.streak += 1;
      this.canPass = true; // Ahora tiene la opción de plantarse

      result = {
        isCorrect: true,
        player: activePlayer,
        option,
        outcome,
        prevCard,
        newCard,
        sipsGifted,
        currentPot: this.pot,
        streak: this.streak,
        oddsAtBet: chosenOdds,
        isTiePunishment: false,
        text: `¡Acertó! ${newCard.name} es ${outcome.toUpperCase()} que ${prevCard.name}. Regala ${sipsGifted} sorbo${sipsGifted > 1 ? 's' : ''} a la mesa. El pozo sube a ${this.pot} sorbos.`,
      };
    } else {
      // 2. Caso Fallo:
      // ¿Salió empate sin haberlo predicho? ¡Castigo de Mismo Número!
      const isTiePunishment = (outcome === 'mismo' && option !== 'mismo');

      if (isTiePunishment) {
        // El pozo se DUPLICA y te lo tomas completo
        this.pot = this.pot * 2;
      }

      const sipsToDrink = this.pot;

      result = {
        isCorrect: false,
        player: activePlayer,
        option,
        outcome,
        prevCard,
        newCard,
        sipsGifted: 0,
        sipsToDrink,
        isTiePunishment,
        streak: this.streak,
        text: isTiePunishment
          ? `💥 ¡CARTA GEMELA! Salió otro ${newCard.value}. ¡El pozo se duplica a ${sipsToDrink} sorbos y ${activePlayer.name} debe tomárselo al seco!`
          : `❌ ¡Falló! Dijo ${option.toUpperCase()} pero salió ${newCard.name} (${outcome.toUpperCase()}). ¡${activePlayer.name} debe beberse todo el pozo acumulado (${sipsToDrink} sorbos)!`,
      };

      // Reinicio del pozo y racha tras fallar
      this.pot = 1;
      this.streak = 0;
      this.canPass = false;

      // El turno pasa automáticamente al siguiente jugador
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // Registrar en el historial de descartes y actualizar la carta activa
    this.discardPile.push(prevCard);
    this.currentCard = newCard;
    this.lastResult = result;
    this.history.push(result);

    return result;
  }

  /**
   * El jugador en turno decide plantarse y pasarle el pozo acumulado al siguiente
   */
  passTurn() {
    if (!this.canPass) {
      throw new Error('Debes acertar al menos una vez para poder plantarte.');
    }

    const previousPlayer = this.getActivePlayer();
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    const nextPlayer = this.getActivePlayer();

    this.streak = 0;
    this.canPass = false;

    const passEvent = {
      type: 'pass',
      fromPlayer: previousPlayer,
      toPlayer: nextPlayer,
      pot: this.pot,
      text: `🛡️ ${previousPlayer.name} se plantó con honor y le pasó el pozo vivo de ${this.pot} sorbos a ${nextPlayer.name}!`,
    };

    this.history.push(passEvent);
    return passEvent;
  }

  /**
   * Snapshot completo del estado actual para la interfaz
   */
  getSnapshot() {
    return {
      currentCard: this.currentCard,
      cardsRemaining: this.deck.length,
      cardsDiscarded: this.discardPile.length,
      pot: this.pot,
      streak: this.streak,
      canPass: this.canPass,
      activePlayer: this.getActivePlayer(),
      nextPlayer: this.players[(this.currentPlayerIndex + 1) % this.players.length],
      odds: this.getOdds(),
      lastResult: this.lastResult,
    };
  }
}

// Instancia compartida por defecto
export const apuestasGameManager = new ApuestasGameManager();
