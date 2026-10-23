import triviaData from '../data/trivia.json';
import minijuegosData from '../data/minijuegos.json';
import jugoData from '../data/jugo.json';
import hoja7Data from '../data/hoja7_retos.json';
import catalogoMinijuegosData from '../data/catalogo_minijuegos.json';
import variablesData from '../data/variables.json';

// Definición de Modos de Juego y sus multiplicadores/reglas
export const GAME_MODES = [
  {
    id: 'vasito',
    name: 'Vasito de Juguito (250ml)',
    tag: 'Suave x0.5',
    description: 'Todas las variables valen 1 sorbo (excepto retos con tiempo).',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    icon: '🧃'
  },
  {
    id: 'caja',
    name: 'Jugo en Caja (1 Lt)',
    tag: 'Estándar x1',
    description: 'Dificultad recomendada por los creadores (#=1, $=2, %=3, &=4, /=5).',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    icon: '📦'
  },
  {
    id: 'chimbombo',
    name: 'Chimbombo de Jugo (5 Lts)',
    tag: 'Intenso x2',
    description: 'El doble de sufrimiento (sorbos y retos al 200%).',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    icon: '🍶'
  },
  {
    id: 'camion',
    name: 'Camión Jugosero (3 Ton)',
    tag: 'Extremo x4',
    description: 'Para los expertos en el famoso arte del emborrachamiento (sorbos x4).',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    icon: '🚛'
  }
];

// Algoritmo Fisher-Yates
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Reemplazar símbolos dinámicos según el modo de juego
export function resolverTexto(texto, modeId = 'caja') {
  if (!texto) return '';
  const lower = texto.toLowerCase();
  const isTimeRelated = lower.includes('segund') || lower.includes('minut') || lower.includes('tiempo');

  let res = texto;
  for (const [simbolo, baseVal] of Object.entries(variablesData)) {
    let finalVal = baseVal;

    switch (modeId) {
      case 'vasito':
        // En vasito, todo vale 1 a menos que sea un reto que considere tiempo
        finalVal = isTimeRelated ? baseVal : 1;
        break;
      case 'caja':
        finalVal = baseVal;
        break;
      case 'chimbombo':
        finalVal = baseVal * 2;
        break;
      case 'camion':
        finalVal = baseVal * 4;
        break;
      default:
        finalVal = baseVal;
    }

    res = res.replaceAll(simbolo, `${finalVal}`);
  }
  return res;
}

class DeckManager {
  constructor() {
    this.decks = {
      trivia: shuffle(triviaData),
      minijuego: shuffle(minijuegosData),
      jugo: shuffle(jugoData),
      reto: shuffle(hoja7Data),
      competencia: shuffle(catalogoMinijuegosData),
    };

    this.discards = {
      trivia: [],
      minijuego: [],
      jugo: [],
      reto: [],
      competencia: [],
    };
  }

  drawCard(category, modeId = 'caja') {
    const key = category.toLowerCase();
    if (!this.decks[key]) {
      console.warn(`Categoría no reconocida: ${category}`);
      return null;
    }

    if (this.decks[key].length === 0) {
      if (this.discards[key].length === 0) return null;
      this.decks[key] = shuffle(this.discards[key]);
      this.discards[key] = [];
    }

    const card = this.decks[key].pop();
    this.discards[key].push(card);

    return {
      ...card,
      categoriaJuego: category,
      descripcionFormateada: resolverTexto(card.descripcion || card.pregunta || '', modeId),
      castigoFormateado: card.castigo ? resolverTexto(card.castigo, modeId) : null,
    };
  }

  // Obtener un reto aleatorio rápido para la Ruleta de Castigo
  getRandomReto(modeId = 'caja') {
    const pool = [...jugoData, ...hoja7Data];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const item = pool[randomIndex];
    return {
      titulo: item.titulo || 'Reto de la Casa',
      descripcion: resolverTexto(item.descripcion, modeId),
    };
  }

  getRandomPenitencia(modeId = 'caja') {
    return this.getRandomReto(modeId);
  }
}

export const deckManager = new DeckManager();
