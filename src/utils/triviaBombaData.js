/**
 * Motor de Lógica, Preguntas y Temporizador Invisible para "Trivia Bomba"
 * 
 * Reglas fundamentales:
 * 1. Temporizador Invisible Aleatorio:
 *    - La bomba tiene un tiempo secreto entre 45 y 85 segundos.
 *    - Los jugadores NO ven los segundos restantes, solo sienten la aceleración del tic-tac
 *      y la tensión visual de la mecha consumiéndose.
 * 2. Dinámica de Pase de Teléfono (Papa Caliente):
 *    - El jugador en turno responde una pregunta de opción múltiple (A, B, C, D).
 *    - Si acierta: El pozo de sorbos suma +1 y debe pasarle el teléfono de inmediato al siguiente.
 *    - Si falla: NO se revela la respuesta correcta (para mantener la agilidad y el ritmo);
 *      se activa un feedback rojo de 1 segundo y se carga una nueva pregunta de inmediato.
 *      ¡No puede pasar el teléfono hasta responder bien!
 * 3. La Gran Explosión (Castigo):
 *    - Cuando el tiempo invisible se agota: ¡BOOM!
 *    - La persona que tenga el teléfono en la mano en ese momento exacto pierde la ronda
 *      y debe beberse todos los sorbos acumulados en el pozo de la bomba.
 */

import TRIVIA_QUESTIONS_RAW from '../data/trivia.json';

/**
 * Barajado Fisher-Yates inmutable
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Paleta de colores e íconos por categoría de trivia
 */
export const CATEGORY_STYLES = {
  Alcohol: {
    color: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '🍺',
  },
  Geografía: {
    color: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🌍',
  },
  Historia: {
    color: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    icon: '📜',
  },
  Cine: {
    color: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: '🎬',
  },
  Música: {
    color: 'text-pink-400',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    icon: '🎵',
  },
  Deportes: {
    color: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '⚽',
  },
  Ciencia: {
    color: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: '🔬',
  },
  'Cultura Pop': {
    color: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '⭐',
  },
  General: {
    color: 'text-stone-300',
    badge: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
    icon: '💡',
  },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.General;
}

/**
 * Motor Central de Trivia Bomba
 */
export class TriviaBombaManager {
  constructor(options = {}) {
    this.players =
      options.players && options.players.length >= 2
        ? options.players
        : [
            { id: '1', name: 'Jugador 1', gender: 'hombre', animal: 'perro' },
            { id: '2', name: 'Jugador 2', gender: 'mujer', animal: 'gato' },
          ];

    this.minDuration = options.minDuration || 45; // Segundos mínimos
    this.maxDuration = options.maxDuration || 80; // Segundos máximos
    this.basePot = options.basePot || 2;          // Sorbos base del pozo

    // Banco de preguntas
    this.questionsPool = Array.isArray(TRIVIA_QUESTIONS_RAW) ? TRIVIA_QUESTIONS_RAW : [];
    this.deck = [];
    this.usedQuestions = [];
    this.currentQuestion = null;

    // Estado de la ronda
    this.status = 'idle'; // 'idle' | 'running' | 'exploded'
    this.currentPlayerIndex = 0;
    this.pot = this.basePot;
    this.correctCount = 0;
    this.wrongCount = 0;

    // Temporizador invisible
    this.targetDuration = 60; // Duración secreta
    this.elapsedTime = 0;     // Tiempo transcurrido
    this.victimPlayer = null;

    // Historial de eventos de la ronda
    this.history = [];

    this.reset();
  }

  /**
   * Actualiza la lista de jugadores activos
   */
  setPlayers(players) {
    if (players && players.length >= 2) {
      this.players = players;
      this.currentPlayerIndex = this.currentPlayerIndex % players.length;
    }
  }

  /**
   * Obtiene el jugador en turno
   */
  getActivePlayer() {
    return this.players[this.currentPlayerIndex % this.players.length];
  }

  /**
   * Obtiene el siguiente jugador en la ronda
   */
  getNextPlayer() {
    return this.players[(this.currentPlayerIndex + 1) % this.players.length];
  }

  /**
   * Obtiene el nivel de tensión actual según el tiempo transcurrido (sin revelar segundos)
   * - calm: 0% a 40%
   * - medium: 40% a 70%
   * - high: 70% a 88%
   * - critical: 88% a 100%
   */
  getTensionLevel() {
    if (this.status !== 'running') return 'calm';
    const ratio = Math.min(1, this.elapsedTime / this.targetDuration);
    if (ratio >= 0.88) return 'critical';
    if (ratio >= 0.70) return 'high';
    if (ratio >= 0.40) return 'medium';
    return 'calm';
  }

  /**
   * Obtiene la siguiente pregunta barajada del mazo
   */
  drawNextQuestion() {
    if (this.deck.length === 0) {
      this.deck = shuffleArray(this.questionsPool);
      this.usedQuestions = [];
    }
    const q = this.deck.pop();
    this.usedQuestions.push(q);
    this.currentQuestion = q;
    return q;
  }

  /**
   * Inicia una nueva ronda de Trivia Bomba con temporizador secreto
   */
  startRound() {
    // Escoger duración aleatoria secreta e invisible
    this.targetDuration =
      Math.floor(Math.random() * (this.maxDuration - this.minDuration + 1)) +
      this.minDuration;

    this.elapsedTime = 0;
    this.status = 'running';
    this.pot = this.basePot;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.victimPlayer = null;
    this.history = [];

    // Barajar banco de preguntas si está vacío
    if (this.deck.length === 0) {
      this.deck = shuffleArray(this.questionsPool);
    }

    this.drawNextQuestion();

    return {
      status: this.status,
      activePlayer: this.getActivePlayer(),
      nextPlayer: this.getNextPlayer(),
      currentQuestion: this.currentQuestion,
      pot: this.pot,
    };
  }

  /**
   * Procesa la respuesta de un jugador a la pregunta actual.
   * 
   * REGLA CLAVE SOLICITADA POR EL USUARIO:
   * Si se equivoca, NO se muestra la respuesta correcta.
   * Simplemente se reporta `isCorrect: false` y se entrega de inmediato la siguiente pregunta.
   * 
   * @param {string} selectedKey O clave ('A','B','C','D') o texto de la opción elegida
   * @returns {Object} Resultado de la respuesta
   */
  submitAnswer(selectedKey) {
    if (this.status !== 'running') {
      throw new Error('La ronda no está activa.');
    }
    if (!this.currentQuestion) {
      throw new Error('No hay pregunta activa.');
    }

    const q = this.currentQuestion;
    const activePlayer = this.getActivePlayer();

    // Determinar texto elegido
    let chosenText = selectedKey;
    if (['A', 'B', 'C', 'D'].includes(selectedKey) && q.opciones && q.opciones[selectedKey]) {
      chosenText = q.opciones[selectedKey];
    }

    // Verificar si coincide con la correcta
    const isCorrect =
      typeof chosenText === 'string' &&
      typeof q.correcta === 'string' &&
      chosenText.trim().toLowerCase() === q.correcta.trim().toLowerCase();

    const previousQuestion = q;

    if (isCorrect) {
      // 1. Caso Acierto:
      this.correctCount += 1;
      this.pot += 1; // El pozo de la bomba suma tensión

      const fromPlayer = activePlayer;
      // El turno pasa al siguiente jugador de la mesa
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      const toPlayer = this.getActivePlayer();

      // Nueva pregunta para el siguiente jugador
      const nextQ = this.drawNextQuestion();

      const event = {
        type: 'correct',
        isCorrect: true,
        fromPlayer,
        toPlayer,
        selectedKey,
        chosenText,
        pot: this.pot,
        correctCount: this.correctCount,
        previousQuestion,
        nextQuestion: nextQ,
        text: `🎉 ¡Correcto! ${fromPlayer.name} acertó. ¡Pásale el teléfono rápido a ${toPlayer.name}!`,
      };

      this.history.push(event);
      return event;
    } else {
      // 2. Caso Fallo (Sin revelar la respuesta correcta):
      this.wrongCount += 1;

      // El jugador NO puede pasar el teléfono; se le entrega una NUEVA pregunta de inmediato.
      // Ocultamos 'correcta' para garantizar que la UI no revele la respuesta.
      const safePrevQuestion = { ...previousQuestion };
      delete safePrevQuestion.correcta;

      const nextQ = this.drawNextQuestion();

      const event = {
        type: 'wrong',
        isCorrect: false,
        player: activePlayer,
        selectedKey,
        chosenText,
        pot: this.pot,
        wrongCount: this.wrongCount,
        previousQuestion: safePrevQuestion,
        nextQuestion: nextQ,
        text: `❌ ¡Fallaste! Responde otra pregunta antes de poder pasar.`,
      };

      this.history.push(event);
      return event;
    }
  }

  /**
   * Avanza el tiempo del temporizador invisible (llamado periódicamente cada tick/segundo)
   * @param {number} deltaSeconds Segundos transcurridos (por defecto 1)
   * @returns {Object} Estado del tick
   */
  tick(deltaSeconds = 1) {
    if (this.status !== 'running') {
      return { isExploded: false, status: this.status };
    }

    this.elapsedTime += deltaSeconds;

    // ¿Explotó la bomba?
    if (this.elapsedTime >= this.targetDuration) {
      this.status = 'exploded';
      this.victimPlayer = this.getActivePlayer();

      const explosionEvent = {
        isExploded: true,
        status: 'exploded',
        victim: this.victimPlayer,
        sipsToDrink: this.pot,
        totalQuestionsAnswered: this.correctCount,
        durationSeconds: Math.round(this.elapsedTime),
        text: `💥 ¡BOOOOOOM! La bomba le explotó en las manos a ${this.victimPlayer.name}. ¡Debe beberse los ${this.pot} sorbos acumulados!`,
      };

      this.history.push(explosionEvent);
      return explosionEvent;
    }

    return {
      isExploded: false,
      status: 'running',
      tensionLevel: this.getTensionLevel(),
      tensionRatio: Math.min(1, this.elapsedTime / this.targetDuration),
      elapsedTime: this.elapsedTime,
      pot: this.pot,
    };
  }

  /**
   * Reinicia la partida completa
   */
  reset() {
    this.status = 'idle';
    this.elapsedTime = 0;
    this.targetDuration = 60;
    this.pot = this.basePot;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.victimPlayer = null;
    this.history = [];
    this.deck = shuffleArray(this.questionsPool);
    this.usedQuestions = [];
    this.currentQuestion = this.deck.length > 0 ? this.deck[this.deck.length - 1] : null;
  }

  /**
   * Snapshot completo del estado para sincronización con React
   */
  getSnapshot() {
    return {
      status: this.status,
      activePlayer: this.getActivePlayer(),
      nextPlayer: this.getNextPlayer(),
      currentQuestion: this.currentQuestion,
      pot: this.pot,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      tensionLevel: this.getTensionLevel(),
      tensionRatio: Math.min(1, this.elapsedTime / this.targetDuration),
      elapsedTime: this.elapsedTime,
      victimPlayer: this.victimPlayer,
      questionsRemaining: this.deck.length,
    };
  }
}

// Instancia compartida exportada por conveniencia
export const triviaBombaManager = new TriviaBombaManager();
