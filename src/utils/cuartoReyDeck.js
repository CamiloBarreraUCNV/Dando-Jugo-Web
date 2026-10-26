/**
 * Motor de Baraja y Reglas del Cuarto Rey (King's Cup)
 * Gestiona el mazo tradicional de 52 cartas, la asignación de dinámicas
 * y el conteo progresivo de los 4 Reyes (Copa del Káiser).
 */

export const SUITS = [
  { id: 'corazones', name: 'Corazones', symbol: '♥', color: 'red' },
  { id: 'diamantes', name: 'Diamantes', symbol: '♦', color: 'red' },
  { id: 'picas', name: 'Picas', symbol: '♠', color: 'black' },
  { id: 'treboles', name: 'Tréboles', symbol: '♣', color: 'black' },
];

export const CARD_RULES = {
  A: {
    value: 'A',
    label: 'As',
    title: '¡Cascada!',
    icon: '🌊',
    type: 'grupal',
    badge: 'Toda la mesa',
    summary: 'Cadena continua de tragos.',
    description:
      'Todos empiezan a beber a la vez. Nadie puede detenerse hasta que la persona a su izquierda pare. ¡El jugador que sacó el As decide cuándo parar primero!',
  },
  '2': {
    value: '2',
    label: '2',
    title: 'Tú Tomas',
    icon: '👉',
    type: 'regalas',
    badge: 'Regalas sorbos',
    summary: 'Eliges a la víctima.',
    description: 'Elige a cualquier persona de la mesa para que beba 2 sorbos.',
  },
  '3': {
    value: '3',
    label: '3',
    title: 'Yo Tomo',
    icon: '🍺',
    type: 'bebes',
    badge: 'Bebes tú',
    summary: 'Te toca sufrir.',
    description: '¡Mala suerte! Quien sacó la carta debe beber 2 sorbos inmediatamente.',
  },
  '4': {
    value: '4',
    label: '4',
    title: '¡Piso!',
    icon: '👇',
    type: 'reflejos',
    badge: 'Reflejos',
    summary: 'Manos al suelo a máxima velocidad.',
    description:
      '¡Todos deben tocar el piso con una mano! La última persona en tocar el suelo debe beber 2 sorbos de castigo.',
  },
  '5': {
    value: '5',
    label: '5',
    title: 'Cultura Chupística',
    icon: '🗣️',
    type: 'agilidad',
    badge: 'Dinámica oral',
    summary: 'Ronda de conceptos rápidos.',
    description:
      'Quien sacó la carta elige un tema (ej: "Marcas de cerveza"). Por turnos, cada persona tiene 5 segundos para nombrar uno nuevo. Quien repita o se quede en blanco, ¡bebe 2 sorbos!',
  },
  '6': {
    value: '6',
    label: '6',
    title: 'Hombres',
    icon: '👨',
    type: 'grupal',
    badge: 'Hombres',
    summary: 'Salud muchachos.',
    description: 'Todos los hombres de la mesa beben 2 sorbos.',
  },
  '7': {
    value: '7',
    label: '7',
    title: '¡Cielo!',
    icon: '☝️',
    type: 'reflejos',
    badge: 'Reflejos',
    summary: 'Dedos apuntando arriba.',
    description:
      '¡Todos deben apuntar con un dedo hacia el techo! La última persona en apuntar al cielo bebe 2 sorbos.',
  },
  '8': {
    value: '8',
    label: '8',
    title: 'Compañero de Trago',
    icon: '🤝',
    type: 'social',
    badge: 'Pareja',
    summary: 'Eliges a tu gemelo de vaso.',
    description:
      'Elige a un compañero: cada vez que tú bebas por cualquier motivo, esa persona también debe beber contigo (y viceversa) hasta que alguien saque otro 8.',
  },
  '9': {
    value: '9',
    label: '9',
    title: 'Yo Nunca Nunca',
    icon: '🙈',
    type: 'social',
    badge: 'Confesiones',
    summary: 'Confesión en voz alta.',
    description:
      'Quien sacó la carta dice en voz alta: "Yo nunca nunca...". Todos los que hayan realizado ese acto en su vida deben beber 2 sorbos.',
  },
  '10': {
    value: '10',
    label: '10',
    title: 'Regla de la Casa',
    icon: '⚖️',
    type: 'regla',
    badge: 'Ley de mesa',
    summary: 'Inventa una regla obligatoria.',
    description:
      'Inventas una ley obligatoria para toda la mesa que durará hasta el fin del juego (ej: "solo beber con la mano izquierda", "prohibido decir groserías", "no mirar a los ojos"). Quien la rompa, ¡bebe castigo!',
  },
  J: {
    value: 'J',
    label: 'Jota',
    title: 'Mujeres',
    icon: '👩',
    type: 'grupal',
    badge: 'Mujeres',
    summary: 'Salud reinas.',
    description: 'Todas las mujeres de la mesa beben 2 sorbos.',
  },
  Q: {
    value: 'Q',
    label: 'Reina',
    title: 'El Preguntón',
    icon: '❓',
    type: 'trampa',
    badge: 'Trampa social',
    summary: 'Nadie puede responderte.',
    description:
      'Te conviertes en El Preguntón: si le haces cualquier pregunta a alguien de la mesa y esa persona te responde directamente, ¡cae en la trampa y debe beber 2 sorbos!',
  },
  K: {
    value: 'K',
    label: 'Rey (Káiser)',
    title: 'La Copa del Rey',
    icon: '👑',
    type: 'copa',
    badge: 'Copa Central',
    summary: 'Vierte tu trago al vaso central.',
    description:
      '¡Ha salido un Rey! Debes verter un chorro generoso de tu propio trago en la Copa Central.',
    fourthKingTitle: '¡EL CUARTO REY! 👑💀',
    fourthKingDescription:
      '¡DESTAPASTE EL ÚLTIMO REY! La Copa Central está completa: ¡te debes tomar el vaso al seco ("fondo blanco")!',
  },
};

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Algoritmo de barajado Fisher-Yates
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Gestor del Mazo de Cuarto Rey
 */
export class CuartoReyDeckManager {
  constructor() {
    this.deck = [];
    this.discards = [];
    this.kingsDrawn = 0;
    this.totalKings = 4;
    this.reset();
  }

  /**
   * Genera las 52 cartas completas y las baraja
   */
  reset() {
    const cards = [];
    for (const suit of SUITS) {
      for (const val of VALUES) {
        const rule = CARD_RULES[val];
        cards.push({
          id: `${val}-${suit.id}`,
          value: val,
          suit: suit,
          isKing: val === 'K',
          rule: { ...rule },
        });
      }
    }

    this.deck = shuffle(cards);
    this.discards = [];
    this.kingsDrawn = 0;
  }

  /**
   * Extrae la siguiente carta del mazo
   * Retorna null si no quedan cartas
   */
  drawCard() {
    if (this.deck.length === 0) {
      return null;
    }

    const card = this.deck.pop();

    if (card.isKing) {
      this.kingsDrawn += 1;
      card.kingNumber = this.kingsDrawn;
      card.isFourthKing = this.kingsDrawn === 4;

      if (card.isFourthKing) {
        card.rule.title = card.rule.fourthKingTitle;
        card.rule.description = card.rule.fourthKingDescription;
      }
    }

    this.discards.push(card);

    return {
      ...card,
      cardsRemaining: this.deck.length,
      discardsCount: this.discards.length,
      kingsDrawn: this.kingsDrawn,
      kingsRemaining: this.totalKings - this.kingsDrawn,
      cupLevel: Math.min(100, Math.round((this.kingsDrawn / this.totalKings) * 100)),
      isGameOver: this.kingsDrawn >= 4,
    };
  }

  /**
   * Estadísticas actuales de la partida
   */
  getStats() {
    return {
      totalCards: 52,
      remaining: this.deck.length,
      discards: this.discards.length,
      kingsDrawn: this.kingsDrawn,
      kingsRemaining: Math.max(0, this.totalKings - this.kingsDrawn),
      cupLevel: Math.min(100, Math.round((this.kingsDrawn / this.totalKings) * 100)),
      isGameOver: this.kingsDrawn >= 4,
    };
  }
}

export const cuartoReyDeck = new CuartoReyDeckManager();
