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

// Catálogo de tipos de juegos disponibles para el Modo a la Carta
export const GAME_TYPES = [
  {
    id: 'trivia',
    name: 'Trivia',
    icon: '🧠',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-500/50',
    description: 'Preguntas con alternativas de cultura, geografía, copete e historia.',
    badge: '100 Preguntas',
  },
  {
    id: 'mimica',
    name: 'Mímica',
    icon: '🎭',
    color: 'from-purple-600 to-violet-700',
    borderColor: 'border-purple-500/50',
    description: 'Actúa el concepto sin hablar. Si adivinan, ¡tú y esa persona regalan sorbos!',
    badge: '30 Tarjetas',
  },
  {
    id: 'chupistica',
    name: 'Cultura Chupística',
    icon: '🗣️',
    color: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-500/50',
    description: '5 segundos por persona para nombrar un objeto del tema y pasar el celular.',
    badge: '50 Tarjetas',
  },
  {
    id: 'nunca',
    name: 'Nunca Nunca',
    icon: '🙈',
    color: 'from-rose-600 to-pink-700',
    borderColor: 'border-rose-500/50',
    description: 'Confesiones grupales: las personas que hayan realizado el acto, ¡beben!',
    badge: '50 Tarjetas',
  },
  {
    id: 'probable',
    name: '¿Quién es más Probable?',
    icon: '👥',
    color: 'from-cyan-600 to-teal-700',
    borderColor: 'border-cyan-500/50',
    description: 'Votación al unísono con el dedo. El que tenga más votos bebe o paga.',
    badge: '50 Tarjetas',
  },
  {
    id: 'versus',
    name: 'Versus',
    icon: '⚔️',
    color: 'from-red-600 to-orange-700',
    borderColor: 'border-red-500/50',
    description: 'Duelo 1 vs 1 contra otro jugador. El ganador regala sorbos.',
    badge: '35 Tarjetas',
  },
  {
    id: 'reto',
    name: 'Retos Grupales',
    icon: '🔥',
    color: 'from-amber-700 to-red-800',
    borderColor: 'border-amber-600/50',
    description: 'Reglas de trago directo, "Toman Todos" y dinámicas con castigo.',
    badge: '91 Tarjetas',
  },
  {
    id: 'jugo',
    name: 'Jugo & Retos Personales',
    icon: '🍹',
    color: 'from-fuchsia-600 to-purple-800',
    borderColor: 'border-fuchsia-500/50',
    description: 'Desafíos individuales de fiesta y personajes jugosos.',
    badge: '40 Tarjetas',
  },
  {
    id: 'random',
    name: 'Al Azar (Sorpresa)',
    icon: '🎲',
    color: 'from-stone-700 to-stone-900',
    borderColor: 'border-stone-500/50',
    description: 'Saca una tarjeta al azar entre todas las categorías sin girar ruleta.',
    badge: 'Todo el mazo',
  },
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

// Resolver dinámicamente la instrucción según el tipo de minijuego
export function resolverInstruccionMinijuego(titulo, modeId = 'caja') {
  if (!titulo) return '¡Sigue la dinámica en grupo!';
  const normalizado = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?]/g, '')
    .trim();

  let template = '';
  if (normalizado.includes('probable')) {
    template = 'Cuenten hasta 3 y apunten al mismo tiempo. Quien reciba más votos, ¡debe beber o pagar el reto!';
  } else if (normalizado.includes('cultura chupistica')) {
    template = 'Tienes 5 segundos para decir un objeto relacionado con el tema y pasar el teléfono para el lado.';
  } else if (normalizado.includes('mimica')) {
    template = 'Debes recrear el tema dado sin decir ninguna palabra, si alguien adivina, tú y esa persona regalan $ sorbos.';
  } else if (normalizado.includes('nunca')) {
    template = 'Debes leer el enunciado en voz alta y las personas que hayan realizado ese acto, deben tomar.';
  } else if (normalizado.includes('versus')) {
    template = 'Compite con otro jugador, el ganador regala $ sorbos.';
  } else {
    template = 'Cuenten hasta 3 y apunten al mismo tiempo. Quien reciba más votos, ¡debe beber o pagar el reto!';
  }

  const res = resolverTexto(template, modeId);
  return res.replace(/\b1 sorbos\b/g, '1 sorbo');
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

    // Sub-mazos independientes para selección libre / a la carta
    this.subDecks = {
      probable: shuffle(minijuegosData.filter((d) => d.titulo === '¿Quién es más Probable?')),
      chupistica: shuffle(minijuegosData.filter((d) => d.titulo === 'Cultura Chupistica')),
      mimica: shuffle(minijuegosData.filter((d) => d.titulo === 'Mimica')),
      nunca: shuffle(minijuegosData.filter((d) => d.titulo === 'Nunca nunca')),
      versus: shuffle(minijuegosData.filter((d) => d.titulo === 'Versus')),
    };

    this.subDiscards = {
      probable: [],
      chupistica: [],
      mimica: [],
      nunca: [],
      versus: [],
    };
  }

  // Extracción tradicional por categoría principal (Ruleta)
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
      instruccionMinijuego: key === 'minijuego'
        ? resolverInstruccionMinijuego(card.titulo, modeId)
        : null,
    };
  }

  // Extracción específica para el "Modo a la Carta" (Sin ruleta)
  drawSpecificCard(typeId, modeId = 'caja') {
    if (typeId === 'trivia') {
      return this.drawCard('trivia', modeId);
    }
    if (typeId === 'reto') {
      return this.drawCard('reto', modeId);
    }
    if (typeId === 'jugo') {
      return this.drawCard('jugo', modeId);
    }
    if (typeId === 'random') {
      const allTypes = ['trivia', 'reto', 'jugo', 'mimica', 'chupistica', 'nunca', 'probable', 'versus'];
      const chosen = allTypes[Math.floor(Math.random() * allTypes.length)];
      return this.drawSpecificCard(chosen, modeId);
    }

    const subKey = typeId.toLowerCase();
    if (!this.subDecks[subKey]) {
      console.warn(`Sub-tipo no reconocido: ${typeId}`);
      return this.drawCard('minijuego', modeId);
    }

    if (this.subDecks[subKey].length === 0) {
      if (this.subDiscards[subKey].length === 0) return null;
      this.subDecks[subKey] = shuffle(this.subDiscards[subKey]);
      this.subDiscards[subKey] = [];
    }

    const card = this.subDecks[subKey].pop();
    this.subDiscards[subKey].push(card);

    return {
      ...card,
      categoriaJuego: 'minijuego',
      descripcionFormateada: resolverTexto(card.descripcion || card.pregunta || '', modeId),
      castigoFormateado: card.castigo ? resolverTexto(card.castigo, modeId) : null,
      instruccionMinijuego: resolverInstruccionMinijuego(card.titulo, modeId),
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
