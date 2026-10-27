/**
 * Motor de Datos y Barajas de "Verdad o Reto" (La Mesa Caliente)
 * Incluye banco categorizado de verdades y retos por niveles de intensidad,
 * asignación inteligente de jugadores objetivo ({target}) y control de descarte.
 */

export const INTENSITY_LEVELS = [
  {
    id: 'clasico',
    name: 'Previa Entre Amigos',
    icon: '🍹',
    tag: 'Clásico',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Anécdotas divertidas, risas y momentos cómicos sin incomodar a nadie.',
    penaltySips: 2,
  },
  {
    id: 'picante',
    name: 'Modo Picante (18+)',
    icon: '🔥',
    tag: 'Hot',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Secretos íntimos, confesiones picantes, roces y coqueteo en la mesa.',
    penaltySips: 3,
  },
  {
    id: 'extremo',
    name: 'Modo Extremo (Jugo)',
    icon: '🤯',
    tag: 'Extremo',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Penitencias pesadas, llamadas en vivo y castigos duros de copas al seco.',
    penaltySips: 4,
  },
];

/* ========================================================= */
/* BANCO DE VERDADES (😇)                                    */
/* ========================================================= */
export const VERDADES_DATA = [
  // --- CLÁSICO (Previa / Amigos) ---
  { id: 'v_c1', nivel: 'clasico', texto: '¿Cuál ha sido la mentira más tonta que has dicho para zafar de un compromiso o junta?' },
  { id: 'v_c2', nivel: 'clasico', texto: '¿Qué es lo más vergonzoso que has hecho estando bajo los efectos del alcohol?' },
  { id: 'v_c3', nivel: 'clasico', texto: '¿Quién de las personas presentes en esta mesa crees que tiene el peor gusto para vestir?' },
  { id: 'v_c4', nivel: 'clasico', texto: '¿Alguna vez te has quedado dormido/a en el baño durante un carrete o evento social?' },
  { id: 'v_c5', nivel: 'clasico', texto: '¿Cuál es tu placer culpable musical más vergonzoso que jamás admites en público?' },
  { id: 'v_c6', nivel: 'clasico', texto: '¿Has fingido alguna vez estar enfermo/a en el trabajo o la universidad para quedarte flojeando?' },
  { id: 'v_c7', nivel: 'clasico', texto: 'Si pudieras borrar un año completo de tu vida para siempre, ¿cuál borrarías y por qué?' },
  { id: 'v_c8', nivel: 'clasico', texto: '¿Cuál ha sido tu peor cita de Tinder, Bumble o similar? Cuenta la anécdota con detalles.' },
  { id: 'v_c9', nivel: 'clasico', texto: '¿Alguna vez le has revisado el teléfono a una pareja o amigo/a a escondidas?' },
  { id: 'v_c10', nivel: 'clasico', texto: '¿Quién de los presentes crees que sobreviviría menos tiempo en un apocalipsis zombi?' },
  { id: 'v_c11', nivel: 'clasico', texto: '¿Cuál es la búsqueda más vergonzosa o extraña que tienes en tu historial reciente de Google?' },
  { id: 'v_c12', nivel: 'clasico', texto: '¿Alguna vez has roto algo en casa ajena y te hiciste el desentendido para no pagar?' },
  { id: 'v_c13', nivel: 'clasico', texto: '¿Qué es lo más asqueroso que has comido por apuesta o por no hacer sentir mal a quien cocinó?' },
  { id: 'v_c14', nivel: 'clasico', texto: '¿Alguna vez te has enamorado o tenido onda con la pareja de un conocido?' },
  { id: 'v_c15', nivel: 'clasico', texto: 'Si tuvieras que intercambiar de vida por 24 horas con alguien de esta mesa, ¿con quién sería?' },
  { id: 'v_c16', nivel: 'clasico', texto: '¿Qué rumor falso o chisme sobre ti llegó a tus oídos y te dio mucha rabia o risa?' },
  { id: 'v_c17', nivel: 'clasico', texto: '¿Cuál ha sido el peor regalo que te han dado y tuviste que sonreír fingiendo que te encantaba?' },
  { id: 'v_c18', nivel: 'clasico', texto: '¿Alguna vez te han pillado hablando solo/a o haciendo el ridículo frente a un espejo?' },
  { id: 'v_c19', nivel: 'clasico', texto: '¿Quién de los presentes te prestaría dinero sin dudar y a quién jamás le prestarías tú?' },
  { id: 'v_c20', nivel: 'clasico', texto: '¿Cuál ha sido la situación más incómoda que has vivido con tus suegros o padres de una pareja?' },

  // --- PICANTE (Hot / 18+) ---
  { id: 'v_p1', nivel: 'picante', texto: '¿Alguna vez has tenido ganas de comerte o besar a alguien que está sentado en esta misma mesa?' },
  { id: 'v_p2', nivel: 'picante', texto: '¿Te has comido a alguien solo para no irte solo/a del carrete al final de la noche?' },
  { id: 'v_p3', nivel: 'picante', texto: '¿Alguna vez te ha gustado el hermano, hermana o familiar directo de un buen amigo?' },
  { id: 'v_p4', nivel: 'picante', texto: '¿Has fingido alguna vez llegar al orgasmo para que el encuentro terminara más rápido?' },
  { id: 'v_p5', nivel: 'picante', texto: '¿Te has arrepentido a los 10 segundos después de haber tenido sexo con alguien?' },
  { id: 'v_p6', nivel: 'picante', texto: '¿Cuál es el lugar público más arriesgado o insólito donde has tenido relaciones o intimidad?' },
  { id: 'v_p7', nivel: 'picante', texto: '¿Alguna vez has mandado o recibido una foto íntima (nude) de la que te arrepientas hoy?' },
  { id: 'v_p8', nivel: 'picante', texto: '¿Te has besado con más de dos personas distintas en una sola noche de fiesta?' },
  { id: 'v_p9', nivel: 'picante', texto: '¿Cuál es tu fetiche o fantasía sexual más secreta que casi nadie conoce?' },
  { id: 'v_p10', nivel: 'picante', texto: 'Si estuvieras obligado/a a darte un beso con lengua con alguien de la mesa, ¿a quién elegirías?' },
  { id: 'v_p11', nivel: 'picante', texto: '¿Alguna vez has tenido una fantasía íntima con un profesor, profesora o jefe/jefa?' },
  { id: 'v_p12', nivel: 'picante', texto: '¿Has tenido sexo pensando en otra persona diferente a la que estaba contigo en la cama?' },
  { id: 'v_p13', nivel: 'picante', texto: '¿Cuál ha sido tu peor experiencia en la cama y qué fue lo que la arruinó por completo?' },
  { id: 'v_p14', nivel: 'picante', texto: '¿Alguna vez has estado con alguien solo porque tenía auto, dinero o te pagaba las salidas?' },
  { id: 'v_p15', nivel: 'picante', texto: '¿Qué parte del cuerpo te excita más cuando te la besan o acarician suavemente?' },
  { id: 'v_p16', nivel: 'picante', texto: '¿Tendrías un trío si la oportunidad perfecta se presentara esta misma noche?' },
  { id: 'v_p17', nivel: 'picante', texto: '¿Alguna vez te han pillado en pleno acto tus padres, amigos o compañeros de casa?' },
  { id: 'v_p18', nivel: 'picante', texto: '¿Cuál ha sido la propuesta indecente más extraña o descarada que te han hecho por mensaje directo?' },
  { id: 'v_p19', nivel: 'picante', texto: '¿Has seguido acostándote con tu expareja sabiendo perfectamente que era una mala idea?' },
  { id: 'v_p20', nivel: 'picante', texto: '¿Qué es lo más caliente que te han dicho al oído y te dejó completamente desarmado/a?' },

  // --- EXTREMO (Dando Jugo) ---
  { id: 'v_e1', nivel: 'extremo', texto: 'Di el nombre de la persona presente en la mesa que te caiga peor o con la que tengas menos onda, sin rodeos.' },
  { id: 'v_e2', nivel: 'extremo', texto: '¿Alguna vez has sido infiel o has ayudado conscientemente a alguien a engañar a su pareja?' },
  { id: 'v_e3', nivel: 'extremo', texto: 'Muestra a la mesa los últimos 3 chats abiertos de tu WhatsApp ahora mismo.' },
  { id: 'v_e4', nivel: 'extremo', texto: '¿Cuál es el secreto más oscuro que tus padres jamás podrán enterarse bajo ninguna circunstancia?' },
  { id: 'v_e5', nivel: 'extremo', texto: '¿Has hablado mal a espaldas de alguien que está sentado en esta misma mesa en los últimos 3 meses?' },
  { id: 'v_e6', nivel: 'extremo', texto: '¿Alguna vez has robado algo en una tienda o en el trabajo (aunque haya sido algo pequeño)?' },
  { id: 'v_e7', nivel: 'extremo', texto: '¿Qué es lo peor que has hecho por dinero o por desesperación económica en tu vida?' },
  { id: 'v_e8', nivel: 'extremo', texto: 'Si tuvieras que salvar de un incendio solo a una persona de esta mesa, ¿a quién elegirías y a quién dejarías?' },
  { id: 'v_e9', nivel: 'extremo', texto: '¿Cuál ha sido la traición de confianza más grande que le has hecho a un amigo o amiga?' },
  { id: 'v_e10', nivel: 'extremo', texto: '¿Alguna vez has usado a alguien románticamente sabiendo que esa persona estaba enamorada de ti?' },
];

/* ========================================================= */
/* BANCO DE RETOS (😈)                                       */
/* ========================================================= */
export const RETOS_DATA = [
  // --- CLÁSICO (Previa / Amigos) ---
  { id: 'r_c1', nivel: 'clasico', texto: 'Imita a {target} durante las próximas 2 rondas (gestos, tono de voz y frases típicas).' },
  { id: 'r_c2', nivel: 'clasico', texto: 'Llama a un contacto al azar de tu teléfono y cántale "Cumpleaños Feliz" con pasión antes de cortar.' },
  { id: 'r_c3', nivel: 'clasico', texto: 'Párate en una silla y haz un brindis emotivo de 1 minuto elogiando a {target} como si fuera tu héroe.' },
  { id: 'r_c4', nivel: 'clasico', texto: 'Deja que {target} te dibuje un bigote o un tatuaje falso con plumón en la mejilla.' },
  { id: 'r_c5', nivel: 'clasico', texto: 'Habla con acento extranjero (español castizo, argentino o mexicano) hasta que vuelva a ser tu turno.' },
  { id: 'r_c6', nivel: 'clasico', texto: 'Baila reggaeton con una escoba o un objeto inanimado como si fuera la fiesta de tu vida por 30 segundos.' },
  { id: 'r_c7', nivel: 'clasico', texto: 'Muestra a todos la foto más vergonzosa o graciosa que tengas guardada en tu galería del teléfono.' },
  { id: 'r_c8', nivel: 'clasico', texto: 'Haz 15 flexiones de brazos o 20 sentadillas ahora mismo mientras la mesa cuenta en voz alta.' },
  { id: 'r_c9', nivel: 'clasico', texto: 'Deja que {target} revise tu lista de canciones más escuchadas de Spotify sin censura.' },
  { id: 'r_c10', nivel: 'clasico', texto: 'Intenta hacer reír a {target} en 30 segundos sin tocarle ni hablar (solo con muecas y gestos).' },
  { id: 'r_c11', nivel: 'clasico', texto: 'Cómete una cucharada de mostaza, ají o condimento fuerte que elija la mesa.' },
  { id: 'r_c12', nivel: 'clasico', texto: 'Publica en tus historias de WhatsApp o Instagram un estado ridículo dictado por la mesa durante 10 minutos.' },
  { id: 'r_c13', nivel: 'clasico', texto: 'Pasa el resto de la ronda con los ojos vendados o cerrados intentando beber sin botar nada.' },
  { id: 'r_c14', nivel: 'clasico', texto: 'Dile un piropo ridículamente poético y exagerado mirándolo/a fijamente a los ojos a {target}.' },
  { id: 'r_c15', nivel: 'clasico', texto: 'Deja que la mesa te prepare una mezcla de bebestibles (máximo 3 ingredientes) y bébetela de un sorbo.' },
  { id: 'r_c16', nivel: 'clasico', texto: 'Haz una imitación de un perro pidiendo comida a {target} hasta que te dé el visto bueno.' },
  { id: 'r_c17', nivel: 'clasico', texto: 'Cántale una balada romántica a capela a {target} tomándole suavemente las dos manos.' },
  { id: 'r_c18', nivel: 'clasico', texto: 'Intercambia una prenda de ropa visible (polerón, jockey o chaqueta) con {target} por 2 rondas.' },
  { id: 'r_c19', nivel: 'clasico', texto: 'Envía un audio a un grupo de WhatsApp diciendo: "Chicos, no me lo van a creer, me caso" y no aclares nada por 5 minutos.' },
  { id: 'r_c20', nivel: 'clasico', texto: 'Haz como comentarista de fútbol relatando lo que cada persona de la mesa está haciendo durante 1 minuto.' },

  // --- PICANTE (Hot / 18+) ---
  { id: 'r_p1', nivel: 'picante', texto: 'Dale un beso suave en el cuello a {target} durante 5 segundos seguidos.', prefSexoOpuesto: true },
  { id: 'r_p2', nivel: 'picante', texto: 'Susúrrale al oído a {target} la cosa más coqueta o atrevida que se te ocurra en este instante.', prefSexoOpuesto: true },
  { id: 'r_p3', nivel: 'picante', texto: 'Siéntate en las piernas de {target} durante toda la siguiente ronda completa.', prefSexoOpuesto: true },
  { id: 'r_p4', nivel: 'picante', texto: 'Baila pegado/a un tema lento o perreo intenso con {target} durante 40 segundos.', prefSexoOpuesto: true },
  { id: 'r_p5', nivel: 'picante', texto: 'Pásale un hielo suavemente por el cuello o la clavícula a {target} con los ojos cerrados.', prefSexoOpuesto: true },
  { id: 'r_p6', nivel: 'picante', texto: 'Quítate una prenda de ropa (zapatos no cuentan) y quédate así por el resto de la partida.' },
  { id: 'r_p7', nivel: 'picante', texto: 'Deja que {target} te dé un mordisco suave en el lóbulo de la oreja.', prefSexoOpuesto: true },
  { id: 'r_p8', nivel: 'picante', texto: 'Tómate un trago directamente desde el vaso de {target} pero sosteniéndolo con la boca.', prefSexoOpuesto: true },
  { id: 'r_p9', nivel: 'picante', texto: 'Mírale fijamente los labios a {target} a 5 centímetros de distancia durante 20 segundos sin besarse ni reírse.', prefSexoOpuesto: true },
  { id: 'r_p10', nivel: 'picante', texto: 'Hazle un masaje sensual en los hombros y cuello a {target} durante 1 minuto completo.', prefSexoOpuesto: true },
  { id: 'r_p11', nivel: 'picante', texto: 'Pásale un dedo con trago por los labios a {target} y deja que lo saboree lentamente.', prefSexoOpuesto: true },
  { id: 'r_p12', nivel: 'picante', texto: 'Recrea tu gemido más falso pero convincente frente a toda la mesa sin taparte la cara.' },
  { id: 'r_p13', nivel: 'picante', texto: 'Deja que {target} te desabroche los dos primeros botones de la camisa o polera.', prefSexoOpuesto: true },
  { id: 'r_p14', nivel: 'picante', texto: 'Dile a cada persona de la mesa qué es lo que encuentras más sexy o atractivo físicamente de ella.' },
  { id: 'r_p15', nivel: 'picante', texto: 'Alimenta a {target} con un bocado o fruta usando solo tu boca sin ocupar las manos.', prefSexoOpuesto: true },
  { id: 'r_p16', nivel: 'picante', texto: 'Descríbele a la mesa con lujo de detalles cómo sería tu noche romántica perfecta con {target}.', prefSexoOpuesto: true },
  { id: 'r_p17', nivel: 'picante', texto: 'Dale un piquito suave a {target} o bébanse ambos 3 sorbos al seco.', prefSexoOpuesto: true },
  { id: 'r_p18', nivel: 'picante', texto: 'Deja que {target} te huela el cuello y dé un veredicto en voz alta sobre cómo hueles.', prefSexoOpuesto: true },
  { id: 'r_p19', nivel: 'picante', texto: 'Tócale suavemente el abdomen o la cintura a {target} por debajo de la ropa por 5 segundos.', prefSexoOpuesto: true },
  { id: 'r_p20', nivel: 'picante', texto: 'Haz un striptease cómico quitándote los calcetines al ritmo de una canción sensual.' },

  // --- EXTREMO (Dando Jugo) ---
  { id: 'r_e1', nivel: 'extremo', texto: 'Bébete un vaso completo al seco ("fondo blanco") ahora mismo sin respirar.' },
  { id: 'r_e2', nivel: 'extremo', texto: 'Llama a tu ex (o a tu crush) y dile "te extraño" en altavoz frente a toda la mesa.' },
  { id: 'r_e3', nivel: 'extremo', texto: 'Deja que {target} publique lo que quiera en tu Twitter/X o historia de Instagram sin revisarlo antes.' },
  { id: 'r_e4', nivel: 'extremo', texto: 'Deja que la mesa te revise la carpeta de fotos ocultas o eliminadas de tu celular.' },
  { id: 'r_e5', nivel: 'extremo', texto: 'Tómate un shot directo de licor puro con sal y limón en los ojos de tus amigos.' },
  { id: 'r_e6', nivel: 'extremo', texto: 'Envía un emoji de berenjena (🍆) o durazno (🍑) al 5.° contacto más reciente de tus mensajes sin dar explicaciones.' },
  { id: 'r_e7', nivel: 'extremo', texto: 'Deja tu teléfono desbloqueado en el centro de la mesa durante las próximas 3 rondas.' },
  { id: 'r_e8', nivel: 'extremo', texto: 'Bébete 4 sorbos gigantescos del trago más fuerte que haya en la mesa.' },
  { id: 'r_e9', nivel: 'extremo', texto: 'Llama a un restaurante o delivery y pregunta seriamente si venden jugo de calcetín con hielos.' },
  { id: 'r_e10', nivel: 'extremo', texto: 'Deja que {target} te dé un golpe suave con la mano abierta en la espalda o el muslo.' },
];

/**
 * Algoritmo Fisher-Yates para barajar
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
 * Gestor del Motor de Verdad o Reto
 */
export class VerdadRetoDeckManager {
  constructor() {
    this.decks = {
      verdad: {
        clasico: [],
        picante: [],
        extremo: [],
      },
      reto: {
        clasico: [],
        picante: [],
        extremo: [],
      },
    };

    this.discards = {
      verdad: {
        clasico: [],
        picante: [],
        extremo: [],
      },
      reto: {
        clasico: [],
        picante: [],
        extremo: [],
      },
    };

    this.resetAll();
  }

  /**
   * Inicializa o reinicia todos los mazos barajados
   */
  resetAll() {
    for (const lvl of ['clasico', 'picante', 'extremo']) {
      this.decks.verdad[lvl] = shuffle(VERDADES_DATA.filter((v) => v.nivel === lvl));
      this.decks.reto[lvl] = shuffle(RETOS_DATA.filter((r) => r.nivel === lvl));
      this.discards.verdad[lvl] = [];
      this.discards.reto[lvl] = [];
    }
  }

  /**
   * Selecciona un jugador cómplice/víctima distinto al jugador en turno
   */
  selectTargetPlayer(activePlayer, allPlayers = [], preferOppositeGender = false) {
    if (!allPlayers || allPlayers.length <= 1) {
      return { name: 'otro jugador', gender: 'hombre', animal: 'gato' };
    }

    const candidates = allPlayers.filter((p) => p.id !== activePlayer?.id);
    if (candidates.length === 0) {
      return { name: 'otro jugador', gender: 'hombre', animal: 'gato' };
    }

    if (preferOppositeGender && activePlayer?.gender) {
      const opposites = candidates.filter((p) => p.gender !== activePlayer.gender);
      if (opposites.length > 0) {
        return opposites[Math.floor(Math.random() * opposites.length)];
      }
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Extrae una tarjeta (Verdad o Reto) según el nivel de intensidad
   */
  drawCard(type = 'verdad', levelId = 'clasico', activePlayer, allPlayers = []) {
    const validLevel = ['clasico', 'picante', 'extremo'].includes(levelId) ? levelId : 'clasico';
    const effectiveType = type === 'azar' ? (Math.random() > 0.5 ? 'verdad' : 'reto') : type;

    const deckPool = this.decks[effectiveType][validLevel];
    const discardPool = this.discards[effectiveType][validLevel];

    // Si el mazo se agotó, rebarajar los descartes
    if (deckPool.length === 0) {
      if (discardPool.length === 0) {
        // Recargar con la data original si ambos estuviesen vacíos
        const originalData =
          effectiveType === 'verdad'
            ? VERDADES_DATA.filter((v) => v.nivel === validLevel)
            : RETOS_DATA.filter((r) => r.nivel === validLevel);
        this.decks[effectiveType][validLevel] = shuffle(originalData);
      } else {
        this.decks[effectiveType][validLevel] = shuffle(discardPool);
        this.discards[effectiveType][validLevel] = [];
      }
    }

    const card = this.decks[effectiveType][validLevel].pop();
    this.discards[effectiveType][validLevel].push(card);

    // Detección de jugador objetivo para retos o preguntas interactivas
    let resolvedText = card.texto;
    let targetPlayer = null;

    if (card.texto.includes('{target}')) {
      targetPlayer = this.selectTargetPlayer(activePlayer, allPlayers, card.prefSexoOpuesto || false);
      resolvedText = card.texto.replace(/\{target\}/g, targetPlayer.name);
    }

    const levelObj = INTENSITY_LEVELS.find((l) => l.id === validLevel) || INTENSITY_LEVELS[0];

    return {
      id: card.id,
      tipo: effectiveType, // 'verdad' o 'reto'
      nivel: validLevel,
      nivelInfo: levelObj,
      textoOriginal: card.texto,
      texto: resolvedText,
      targetPlayer: targetPlayer,
      castigoSorbos: levelObj.penaltySips,
      remainingInDeck: this.decks[effectiveType][validLevel].length,
    };
  }

  /**
   * Estadísticas de los mazos por nivel
   */
  getStats(levelId = 'clasico') {
    const validLevel = ['clasico', 'picante', 'extremo'].includes(levelId) ? levelId : 'clasico';
    return {
      nivel: validLevel,
      verdadesRestantes: this.decks.verdad[validLevel].length,
      retosRestantes: this.decks.reto[validLevel].length,
      verdadesDescartadas: this.discards.verdad[validLevel].length,
      retosDescartados: this.discards.reto[validLevel].length,
    };
  }
}

export const verdadRetoManager = new VerdadRetoDeckManager();
