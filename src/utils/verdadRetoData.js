/**
 * Motor de Datos y Barajas de "Verdad o Reto" (La Mesa Caliente)
 * Banco completo ampliado: 50 Verdades y 50 Retos por cada nivel de intensidad.
 * Total: 150 Verdades + 150 Retos = 300 tarjetas en el mazo.
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
/* BANCO DE VERDADES (😇) — 50 POR NIVEL = 150 TOTAL         */
/* ========================================================= */
export const VERDADES_DATA = [
  // --- CLÁSICO (Previa / Amigos - 50 Verdades) ---
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
  { id: 'v_c21', nivel: 'clasico', texto: '¿Qué es lo más ridículo por lo que has llorado en tu vida?' },
  { id: 'v_c22', nivel: 'clasico', texto: '¿Alguna vez te has puesto ropa interior al revés o con hoyos por pereza de lavar ropa?' },
  { id: 'v_c23', nivel: 'clasico', texto: '¿Cuál ha sido el peor corte de pelo o look que has tenido en tu vida?' },
  { id: 'v_c24', nivel: 'clasico', texto: '¿Quién de esta mesa crees que sería el primero en morir en una película de terror y por qué?' },
  { id: 'v_c25', nivel: 'clasico', texto: '¿Has comido comida que se cayó al piso aplicando descaradamente la regla de los 5 segundos?' },
  { id: 'v_c26', nivel: 'clasico', texto: '¿Qué personaje animado o de ficción fue tu primer amor platónico de la infancia?' },
  { id: 'v_c27', nivel: 'clasico', texto: '¿Alguna vez has fingido que te sabías la letra de una canción en inglés inventando palabras?' },
  { id: 'v_c28', nivel: 'clasico', texto: '¿Cuál es el apodo más vergonzoso que te han puesto tus amigos, familia o una expareja?' },
  { id: 'v_c29', nivel: 'clasico', texto: '¿Has stalkeado a alguien en redes sociales desde una cuenta falsa o secundaria?' },
  { id: 'v_c30', nivel: 'clasico', texto: '¿Qué es lo más tonto o innecesario en lo que has gastado una cantidad absurda de plata?' },
  { id: 'v_c31', nivel: 'clasico', texto: '¿Alguna vez te has tropezado en la calle e intentaste disimular poniéndote a trotar?' },
  { id: 'v_c32', nivel: 'clasico', texto: '¿Quién de los presentes crees que es más probable que termine viviendo solo/a con 10 gatos?' },
  { id: 'v_c33', nivel: 'clasico', texto: '¿Has rescatado ropa sucia del canasto de lavado porque no tenías nada limpio para salir de fiesta?' },
  { id: 'v_c34', nivel: 'clasico', texto: '¿Cuál es la fobia o miedo más ridículo o infantil que todavía tienes hoy en día?' },
  { id: 'v_c35', nivel: 'clasico', texto: '¿Alguna vez enviaste un mensaje pelando o hablando mal de alguien a esa misma persona por error?' },
  { id: 'v_c36', nivel: 'clasico', texto: '¿Qué moda ridícula del pasado seguiste ciegamente y hoy te da vergüenza ajena recordar?' },
  { id: 'v_c37', nivel: 'clasico', texto: 'Si estuvieras obligado/a a borrar una red social para siempre, ¿cuál eliminarías sin dudar?' },
  { id: 'v_c38', nivel: 'clasico', texto: '¿Has fingido entender un chiste intelectual o chisme solo para no quedar como ignorante?' },
  { id: 'v_c39', nivel: 'clasico', texto: '¿Cuál es tu peor o más extraño hábito cuando estás completamente solo/a en tu casa?' },
  { id: 'v_c40', nivel: 'clasico', texto: '¿Quién de esta mesa crees que tiene el peor sentido de la orientación y se pierde hasta en el baño?' },
  { id: 'v_c41', nivel: 'clasico', texto: '¿Alguna vez te has quedado roncando en una clase, reunión de trabajo o misa?' },
  { id: 'v_c42', nivel: 'clasico', texto: '¿Qué comida típica odias a muerte y todo el mundo a tu alrededor ama?' },
  { id: 'v_c43', nivel: 'clasico', texto: '¿Cuál ha sido la mentira piadosa más grande que le has dicho a tus padres para salir de carrete?' },
  { id: 'v_c44', nivel: 'clasico', texto: '¿Alguna vez borraste una foto o publicación de redes sociales porque no tuvo suficientes likes?' },
  { id: 'v_c45', nivel: 'clasico', texto: '¿Quién de los presentes crees que sería el peor compañero de departamento por desordenado/a?' },
  { id: 'v_c46', nivel: 'clasico', texto: '¿Qué talento completamente inútil tienes y casi nadie en la mesa conoce?' },
  { id: 'v_c47', nivel: 'clasico', texto: '¿Alguna vez saliste de una tienda sin comprar nada sintiéndote culpable como si hubieras robado?' },
  { id: 'v_c48', nivel: 'clasico', texto: '¿Cuál ha sido el mensaje de texto más comprometedor o vergonzoso que mandaste al chat familiar?' },
  { id: 'v_c49', nivel: 'clasico', texto: 'Si te arrestaran hoy sin explicaciones, ¿qué crimen asumirían tus amigos de la mesa que cometiste?' },
  { id: 'v_c50', nivel: 'clasico', texto: '¿Quién de esta mesa crees que aguantaría menos tiempo sin bañarse en un campamento?' },

  // --- PICANTE (Hot / 18+ - 50 Verdades) ---
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
  { id: 'v_p21', nivel: 'picante', texto: '¿Qué es lo primero que le miras físicamente a alguien cuando te llama la atención en una fiesta?' },
  { id: 'v_p22', nivel: 'picante', texto: '¿Has tenido alguna vez un "amigo con ventaja" o "amigovio" que terminó en drama o celos?' },
  { id: 'v_p23', nivel: 'picante', texto: '¿Cuál es la prenda de ropa interior más atrevida o sexy que tienes guardada en tu cajón?' },
  { id: 'v_p24', nivel: 'picante', texto: '¿Alguna vez te has grabado en video durante la intimidad y aún conservas el archivo?' },
  { id: 'v_p25', nivel: 'picante', texto: 'Si pudieras pasar una noche de pasión sin compromisos con un famoso mundial, ¿a quién elegirías?' },
  { id: 'v_p26', nivel: 'picante', texto: '¿Has tenido alguna vez un sueño erótico con alguien que está sentado en esta misma mesa?' },
  { id: 'v_p27', nivel: 'picante', texto: '¿Cuál ha sido el lugar de tu casa (fuera de la cama) donde más te ha gustado tener relaciones?' },
  { id: 'v_p28', nivel: 'picante', texto: '¿Alguna vez has hecho "sexting" caliente durante una clase aburrida o en pleno horario de trabajo?' },
  { id: 'v_p29', nivel: 'picante', texto: 'En la cama, ¿prefieres que tu pareja tome el control absoluto o te gusta mandar a ti?' },
  { id: 'v_p30', nivel: 'picante', texto: '¿Has usado juguetes sexuales o estarías dispuesto/a a incorporarlos en pareja en la cama?' },
  { id: 'v_p31', nivel: 'picante', texto: '¿Qué es lo que más te "apaga las pasiones" o te mata el apetito sexual al instante?' },
  { id: 'v_p32', nivel: 'picante', texto: '¿Alguna vez besaste a alguien y supiste al primer segundo que besaba pésimo o no había química?' },
  { id: 'v_p33', nivel: 'picante', texto: '¿Cuál es tu postura o posición favorita en la cama y por qué la prefieres?' },
  { id: 'v_p34', nivel: 'picante', texto: '¿Has tenido alguna aventura íntima de una noche de la que nadie de tus amigos sepa nada?' },
  { id: 'v_p35', nivel: 'picante', texto: '¿Qué tan importante es el desempeño sexual para ti en una relación de pareja del 1 al 10?' },
  { id: 'v_p36', nivel: 'picante', texto: '¿Alguna vez has sentido tensión sexual o atracción por la mamá o papá de un amigo/a?' },
  { id: 'v_p37', nivel: 'picante', texto: '¿Te gusta que te hablen sucio al oído durante el acto o prefieres gemidos y silencio?' },
  { id: 'v_p38', nivel: 'picante', texto: '¿Cuál ha sido la petición más rara o bizarra que una pareja te ha pedido en la cama?' },
  { id: 'v_p39', nivel: 'picante', texto: '¿Alguna vez has dejado chupones o rasguños visibles a propósito para que otros se dieran cuenta?' },
  { id: 'v_p40', nivel: 'picante', texto: '¿Quién de esta mesa crees que tiene la mente más cochina y pervertida de todas?' },
  { id: 'v_p41', nivel: 'picante', texto: '¿Te has sentido alguna vez atraído/a o con curiosidad por una persona de tu mismo sexo?' },
  { id: 'v_p42', nivel: 'picante', texto: '¿Cuál es el fetiche o fetiches que jamás aceptarías probar bajo ninguna circunstancia?' },
  { id: 'v_p43', nivel: 'picante', texto: '¿Alguna vez tuviste que frenar un encuentro sexual porque no tenían condón a mano?' },
  { id: 'v_p44', nivel: 'picante', texto: '¿Qué canción pondrías de fondo para calentar el ambiente si estuvieras a solas con tu crush?' },
  { id: 'v_p45', nivel: 'picante', texto: '¿Has mentido sobre cuántas personas han pasado por tu cama para no ser juzgado/a?' },
  { id: 'v_p46', nivel: 'picante', texto: '¿Cuál consideras que es tu mejor atributo físico para seducir a alguien en la previa?' },
  { id: 'v_p47', nivel: 'picante', texto: '¿Alguna vez tuviste relaciones en el asiento trasero de un auto con miedo a que pasara gente?' },
  { id: 'v_p48', nivel: 'picante', texto: '¿Qué es lo más osado o atrevido que has hecho estando completamente desnudo/a con alguien?' },
  { id: 'v_p49', nivel: 'picante', texto: 'Siendo 100% sincero/a, ¿qué nota del 1 al 10 te pones a ti mismo/a en la cama?' },
  { id: 'v_p50', nivel: 'picante', texto: '¿Te atreverías a darle un piquito apasionado a {target} si toda la mesa te aplaude?' },

  // --- EXTREMO (Dando Jugo - 50 Verdades) ---
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
  { id: 'v_e11', nivel: 'extremo', texto: '¿Qué es lo más ilegal o turbio que has hecho y de lo que jamás te han pillado?' },
  { id: 'v_e12', nivel: 'extremo', texto: '¿Alguna vez le deseaste el mal de corazón a alguien y te alegraste por dentro cuando le fue mal?' },
  { id: 'v_e13', nivel: 'extremo', texto: 'Si tuvieras que decirle una verdad dolorosa en la cara a alguien de esta mesa, ¿a quién sería y qué le dirías?' },
  { id: 'v_e14', nivel: 'extremo', texto: '¿Has estado enamorado/a o enganchado/a de dos personas a la vez y jugaste a dos bandas?' },
  { id: 'v_e15', nivel: 'extremo', texto: '¿Alguna vez cortaste una amistad de años haciéndole ghosting total sin darle explicaciones?' },
  { id: 'v_e16', nivel: 'extremo', texto: '¿Cuál es la suma de dinero más grande que has botado a la basura por carrete, apuestas o estupidez?' },
  { id: 'v_e17', nivel: 'extremo', texto: '¿Has revisado las conversaciones privadas de alguien sin permiso y pillaste algo que te destruyó?' },
  { id: 'v_e18', nivel: 'extremo', texto: '¿Alguna vez te dio vergüenza presentar a tu pareja a tus amigos o familia por cómo era?' },
  { id: 'v_e19', nivel: 'extremo', texto: '¿Cuál es el chisme o rumor más destructivo que tú mismo/a inventaste o difundiste?' },
  { id: 'v_e20', nivel: 'extremo', texto: 'Si supieras que la pareja de tu mejor amigo/a le es infiel, ¿se lo contarías o te quedarías callado/a?' },
  { id: 'v_e21', nivel: 'extremo', texto: '¿Alguna vez le echaste la culpa de una cagada grave tuya a otra persona en el trabajo o la universidad?' },
  { id: 'v_e22', nivel: 'extremo', texto: '¿Qué es lo más tóxico o manipulador que has hecho en una relación de pareja?' },
  { id: 'v_e23', nivel: 'extremo', texto: '¿Has fingido ser amigo/a o tener buena onda con alguien solo por interés económico o contactos?' },
  { id: 'v_e24', nivel: 'extremo', texto: '¿Cuál es el mal hábito o vicio que sabes que te está arruinando la vida pero no puedes soltar?' },
  { id: 'v_e25', nivel: 'extremo', texto: '¿Alguna vez has querido desaparecer del mapa, bloquear a todos y empezar de cero en otra ciudad?' },
  { id: 'v_e26', nivel: 'extremo', texto: '¿Qué es lo más humillante o arrastrado que hiciste cuando te patearon o terminaron una relación?' },
  { id: 'v_e27', nivel: 'extremo', texto: '¿Has calentado la sopa o coqueteado con alguien teniendo pareja solo para inflar tu ego?' },
  { id: 'v_e28', nivel: 'extremo', texto: '¿Alguna vez te quedaste con plata que no te correspondía y no dijiste nada a nadie?' },
  { id: 'v_e29', nivel: 'extremo', texto: '¿Quién de los presentes crees que es la persona más falsa y careta con la gente?' },
  { id: 'v_e30', nivel: 'extremo', texto: '¿Cuál ha sido el pensamiento más oscuro o siniestro que has tenido en un momento de rabia?' },
  { id: 'v_e31', nivel: 'extremo', texto: '¿Alguna vez saboteaste los planes o la felicidad de alguien por pura envidia?' },
  { id: 'v_e32', nivel: 'extremo', texto: '¿Has inventado experiencia o títulos en tu CV para conseguir un trabajo donde no sabías nada?' },
  { id: 'v_e33', nivel: 'extremo', texto: '¿Qué es lo que más te avergüenza de tu familia y que siempre ocultas a tus parejas?' },
  { id: 'v_e34', nivel: 'extremo', texto: '¿Alguna vez te acostaste con alguien estando tan borracho/a que al día siguiente no te acordabas?' },
  { id: 'v_e35', nivel: 'extremo', texto: '¿Qué secreto tuyo destruiría tu vida social o familiar si se filtrara en redes mañana?' },
  { id: 'v_e36', nivel: 'extremo', texto: '¿Has sentido envidia amarga del éxito o la felicidad de tu mejor amigo o amiga?' },
  { id: 'v_e37', nivel: 'extremo', texto: '¿Alguna vez fingiste un ataque de llanto o drama para salirte con la tuya y manipular?' },
  { id: 'v_e38', nivel: 'extremo', texto: '¿Quién de esta mesa crees que terminaría primero en la cárcel si la policía revisara sus chats?' },
  { id: 'v_e39', nivel: 'extremo', texto: '¿Has hablado pésimo de un ex inventando mentiras cochinas para dejarlo/a mal parado/a?' },
  { id: 'v_e40', nivel: 'extremo', texto: '¿Alguna vez dejaste plantado/a a alguien en una cita y lo bloqueaste sin darle explicaciones?' },
  { id: 'v_e41', nivel: 'extremo', texto: '¿Qué es lo más hiriente o feo que le has dicho a tus padres y que nunca tuviste la decencia de disculparte?' },
  { id: 'v_e42', nivel: 'extremo', texto: '¿Alguna vez deseaste que la relación de un amigo o amiga fracasara porque no te caía la pareja?' },
  { id: 'v_e43', nivel: 'extremo', texto: '¿Has consumido sustancias o drogas a escondidas de toda tu familia y círculo cercano?' },
  { id: 'v_e44', nivel: 'extremo', texto: '¿Cuál ha sido la traición más asquerosa que te han hecho a ti y que jamás vas a perdonar?' },
  { id: 'v_e45', nivel: 'extremo', texto: '¿Has sido el amante o la "segunda opción" de alguien sabiendo que tenía pareja o familia?' },
  { id: 'v_e46', nivel: 'extremo', texto: '¿Qué es lo más bajo que has tenido que aceptar para conservar una pega o evitar que te echaran?' },
  { id: 'v_e47', nivel: 'extremo', texto: '¿Alguna vez sentiste alivio cuando un familiar o conocido lejano falleció?' },
  { id: 'v_e48', nivel: 'extremo', texto: 'Si pudieras arruinarle la vida a un enemigo de tu pasado sin que nadie lo sepa, ¿apretarías el botón?' },
  { id: 'v_e49', nivel: 'extremo', texto: '¿Quién de los presentes crees que es el más propenso a poner los cuernos en su próximo matrimonio?' },
  { id: 'v_e50', nivel: 'extremo', texto: '¿Qué fue lo peor o más clasista/prejuicioso que pensaste de {target} cuando lo/la viste por primera vez?' },
];

/* ========================================================= */
/* BANCO DE RETOS (😈) — 50 POR NIVEL = 150 TOTAL           */
/* ========================================================= */
export const RETOS_DATA = [
  // --- CLÁSICO (Previa / Amigos - 50 Retos) ---
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
  { id: 'r_c21', nivel: 'clasico', texto: 'Haz como gallina cacareando y aleteando alrededor de la mesa durante 20 segundos.' },
  { id: 'r_c22', nivel: 'clasico', texto: 'Deja que {target} te peine o te haga un peinado ridículo y quédate así por 2 rondas.' },
  { id: 'r_c23', nivel: 'clasico', texto: 'Cuenta un chiste tan malo que dé vergüenza ajena; si nadie en la mesa se ríe, bebes 2 sorbos.' },
  { id: 'r_c24', nivel: 'clasico', texto: 'Envía un sticker sin contexto a la última persona con la que hablaste en WhatsApp.' },
  { id: 'r_c25', nivel: 'clasico', texto: 'Intenta lamerte el codo durante 15 segundos frente a todos sin rendirte.' },
  { id: 'r_c26', nivel: 'clasico', texto: 'Haz una declaración de amor apasionada a una botella de trago como si fuera tu pareja ideal.' },
  { id: 'r_c27', nivel: 'clasico', texto: 'Mantén una cuchara en la punta de la nariz durante 20 segundos sin que se caiga.' },
  { id: 'r_c28', nivel: 'clasico', texto: 'Haz 10 sentadillas sosteniendo a {target} de las manos mientras lo/la miras fijamente a los ojos.' },
  { id: 'r_c29', nivel: 'clasico', texto: 'Deja que {target} te dibuje un tatuaje con lápiz en el brazo que diga "Amo a mi suegra".' },
  { id: 'r_c30', nivel: 'clasico', texto: 'Recita el abecedario de atrás hacia adelante en menos de 30 segundos sin equivocarte.' },
  { id: 'r_c31', nivel: 'clasico', texto: 'Habla susurrando como si estuvieras en una biblioteca secreta durante las próximas 2 rondas.' },
  { id: 'r_c32', nivel: 'clasico', texto: 'Deja que la mesa elija un filtro ridículo de Instagram o TikTok y sácate una selfie con él.' },
  { id: 'r_c33', nivel: 'clasico', texto: 'Haz una pasarela de modelo de alta costura cruzando la habitación con tacones imaginarios.' },
  { id: 'r_c34', nivel: 'clasico', texto: 'Deja que {target} elija un apodo vergonzoso para ti que todos deberán usar hasta el fin del juego.' },
  { id: 'r_c35', nivel: 'clasico', texto: 'Cómete una rodaja de limón con sal sin hacer ninguna mueca de dolor o acidez.' },
  { id: 'r_c36', nivel: 'clasico', texto: 'Finge que eres un robot al que se le está agotando la batería durante 30 segundos.' },
  { id: 'r_c37', nivel: 'clasico', texto: 'Intenta no parpadear en un duelo de miradas fijas contra {target} por 30 segundos.' },
  { id: 'r_c38', nivel: 'clasico', texto: 'Canta el coro de una canción de cuna con voz gutural de cantante de heavy metal.' },
  { id: 'r_c39', nivel: 'clasico', texto: 'Mantente en posición de plancha durante 35 segundos mientras la mesa te cuenta en voz alta.' },
  { id: 'r_c40', nivel: 'clasico', texto: 'Habla en rima obligatoria en cada frase que digas durante la siguiente ronda completa.' },
  { id: 'r_c41', nivel: 'clasico', texto: 'Deja que {target} te dé de beber un sorbo de trago directo a la boca como si fueras un bebé.' },
  { id: 'r_c42', nivel: 'clasico', texto: 'Haz la mímica de una persona que se está quemando en una isla desierta hasta que alguien adivine.' },
  { id: 'r_c43', nivel: 'clasico', texto: 'Ponte las manos en la espalda y bebe un sorbo de tu vaso sin usar las manos.' },
  { id: 'r_c44', nivel: 'clasico', texto: 'Lanza una moneda al aire: si sale cara te salvas, si sale sello debes hacer 10 flexiones de brazos.' },
  { id: 'r_c45', nivel: 'clasico', texto: 'Deja que {target} te haga cosquillas en las costillas durante 10 segundos sin que te muevas.' },
  { id: 'r_c46', nivel: 'clasico', texto: 'Imita la risa de un villano de película animada a todo volumen.' },
  { id: 'r_c47', nivel: 'clasico', texto: 'Haz una reverencia formal ante cada miembro de la mesa llamándolos "Su Majestad".' },
  { id: 'r_c48', nivel: 'clasico', texto: 'Deja que la mesa te revise las últimas 5 fotos que diste like en Instagram o TikTok.' },
  { id: 'r_c49', nivel: 'clasico', texto: 'Actúa como si fueras el mayordomo personal de {target} durante los próximos 2 minutos.' },
  { id: 'r_c50', nivel: 'clasico', texto: 'Ponte un calcetín en la mano y habla con él como si fuera una marioneta por 1 ronda.' },

  // --- PICANTE (Hot / 18+ - 50 Retos) ---
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
  { id: 'r_p21', nivel: 'picante', texto: 'Baila lento con {target} con las manos en su cintura mientras suena música romántica por 30 segundos.', prefSexoOpuesto: true },
  { id: 'r_p22', nivel: 'picante', texto: 'Deja que {target} te dé un beso en la frente y otro en la mejilla muy cerca de la comisura de los labios.', prefSexoOpuesto: true },
  { id: 'r_p23', nivel: 'picante', texto: 'Desabróchate un botón más de tu camisa o levántate la polera mostrando el abdomen durante 1 ronda.' },
  { id: 'r_p24', nivel: 'picante', texto: 'Mírale fijamente a los ojos a {target} y dile con voz ronca: "Esta noche no te salvas".', prefSexoOpuesto: true },
  { id: 'r_p25', nivel: 'picante', texto: 'Dale un masaje en las manos a {target} entrelazando los dedos suavemente durante 40 segundos.', prefSexoOpuesto: true },
  { id: 'r_p26', nivel: 'picante', texto: 'Pásale la punta de la nariz por la mejilla a {target} oliéndole el perfume de cerca.', prefSexoOpuesto: true },
  { id: 'r_p27', nivel: 'picante', texto: 'Dale de probar un hielo a {target} pasándoselo directamente desde tus labios.', prefSexoOpuesto: true },
  { id: 'r_p28', nivel: 'picante', texto: 'Deja que {target} te escriba una palabra secreta con el dedo en la espalda y tienes que adivinarla.', prefSexoOpuesto: true },
  { id: 'r_p29', nivel: 'picante', texto: 'Haz un brindis mirando a {target} y confiesa qué fantasía harías con él/ella en una isla desierta.', prefSexoOpuesto: true },
  { id: 'r_p30', nivel: 'picante', texto: 'Dale un beso suave en la mano a {target} inclinándote como en una novela de época.', prefSexoOpuesto: true },
  { id: 'r_p31', nivel: 'picante', texto: 'Siéntate al lado de {target} y tómale la mano por debajo de la mesa por toda la siguiente ronda.', prefSexoOpuesto: true },
  { id: 'r_p32', nivel: 'picante', texto: 'Deja que {target} te sople suavemente en el cuello y la nuca por 10 segundos seguidos.', prefSexoOpuesto: true },
  { id: 'r_p33', nivel: 'picante', texto: 'Haz una pose de modelo de ropa interior frente a la mesa durante 10 segundos sin reírte.' },
  { id: 'r_p34', nivel: 'picante', texto: 'Dale un abrazo muy apretado a {target} durante 20 segundos sin soltarlo/a.', prefSexoOpuesto: true },
  { id: 'r_p35', nivel: 'picante', texto: 'Pídele a {target} que te elija un apodo sensual que deba usar contigo por el resto del carrete.', prefSexoOpuesto: true },
  { id: 'r_p36', nivel: 'picante', texto: 'Descríbele a {target} cómo sería el beso de película perfecto que le darías en la lluvia.', prefSexoOpuesto: true },
  { id: 'r_p37', nivel: 'picante', texto: 'Muerde sensualmente una fruta o alimento mientras miras fijamente a {target}.', prefSexoOpuesto: true },
  { id: 'r_p38', nivel: 'picante', texto: 'Pásale suavemente una servilleta por los labios a {target} como si le limpiaras después de un beso.', prefSexoOpuesto: true },
  { id: 'r_p39', nivel: 'picante', texto: 'Deja que {target} te acomode el pelo y te acaricie la mejilla suavemente por 15 segundos.', prefSexoOpuesto: true },
  { id: 'r_p40', nivel: 'picante', texto: 'Haz un striptease cómico quitándote el jockey, pañuelo o chaqueta con música sensual de fondo.' },
  { id: 'r_p41', nivel: 'picante', texto: 'Dale un beso en la comisura de los labios a {target} quedándote a un milímetro de su boca.', prefSexoOpuesto: true },
  { id: 'r_p42', nivel: 'picante', texto: 'Susúrrale a {target} cuál es tu parte favorita de su cuerpo y por qué te gusta tanto.', prefSexoOpuesto: true },
  { id: 'r_p43', nivel: 'picante', texto: 'Deja que {target} te agarre de la cintura y te gire como en una escena de baile de tango.', prefSexoOpuesto: true },
  { id: 'r_p44', nivel: 'picante', texto: 'Hazle cosquillas suaves con la punta de los dedos en la palma de la mano a {target}.', prefSexoOpuesto: true },
  { id: 'r_p45', nivel: 'picante', texto: 'Baila con {target} espalda contra espalda rozándose suavemente al ritmo de la música por 30 segundos.', prefSexoOpuesto: true },
  { id: 'r_p46', nivel: 'picante', texto: 'Deja que {target} te dé un sorbo de su propio trago acercando su vaso a tu boca.', prefSexoOpuesto: true },
  { id: 'r_p47', nivel: 'picante', texto: 'Quítale los zapatos a {target} con cuidado y hazle un masaje en los pies por 20 segundos.', prefSexoOpuesto: true },
  { id: 'r_p48', nivel: 'picante', texto: 'Mira a {target} de arriba a abajo con mirada coqueta y muérdete el labio inferior sin reírte.', prefSexoOpuesto: true },
  { id: 'r_p49', nivel: 'picante', texto: 'Dale un beso en la clavícula a {target} o bébete 3 sorbos al seco ahora mismo.', prefSexoOpuesto: true },
  { id: 'r_p50', nivel: 'picante', texto: 'Tómale la cara con las dos manos a {target} y quédate mirándolo/a fijamente a 2 centímetros de su boca por 15 segundos.', prefSexoOpuesto: true },

  // --- EXTREMO (Dando Jugo - 50 Retos) ---
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
  { id: 'r_e11', nivel: 'extremo', texto: 'Llama a un contacto aleatorio de tu agenda y pregúntale con voz seria: "¿Dónde escondiste el cuerpo?".' },
  { id: 'r_e12', nivel: 'extremo', texto: 'Tómate 2 shots seguidos del destilado más fuerte de la mesa sin hacer ninguna mueca.' },
  { id: 'r_e13', nivel: 'extremo', texto: 'Deja que la mesa publique una foto vergonzosa tuya en tus historias de WhatsApp o Instagram.' },
  { id: 'r_e14', nivel: 'extremo', texto: 'Llama a un amigo que no esté en la fiesta y dile que necesitas 500 mil pesos urgente sin dar explicaciones.' },
  { id: 'r_e15', nivel: 'extremo', texto: 'Pasa las próximas 2 rondas bebiendo con las manos atadas o detrás de la espalda.' },
  { id: 'r_e16', nivel: 'extremo', texto: 'Deja que {target} te pinte la cara con lápiz labial o plumón lavable con el diseño que quiera.' },
  { id: 'r_e17', nivel: 'extremo', texto: 'Cómete una mezcla de 3 condimentos fuertes (mayo, mostaza, ají o salsa de soya) de una cucharada.' },
  { id: 'r_e18', nivel: 'extremo', texto: 'Llama a una pizzería o sushi y pide una pizza con relleno de helado de menta con chocolate.' },
  { id: 'r_e19', nivel: 'extremo', texto: 'Muestra a la mesa los últimos 5 mensajes eliminados o la papelera de reciclaje de tu celular.' },
  { id: 'r_e20', nivel: 'extremo', texto: 'Tómate medio vaso de cerveza o trago al seco apoyado sobre una sola pierna.' },
  { id: 'r_e21', nivel: 'extremo', texto: 'Deja que {target} te revise las fotos de WhatsApp recibidas en los últimos 7 días.' },
  { id: 'r_e22', nivel: 'extremo', texto: 'Envía un mensaje a tu crush o persona que te gusta diciendo: "Soñé contigo anoche y fue muy intenso".' },
  { id: 'r_e23', nivel: 'extremo', texto: 'Bébete un shot de trago con sal en la lengua y una rodaja de limón exprimida directo en la boca.' },
  { id: 'r_e24', nivel: 'extremo', texto: 'Deja que la mesa le envíe un mensaje a un contacto de tu elección en LinkedIn o Instagram.' },
  { id: 'r_e25', nivel: 'extremo', texto: 'Haz 25 sentadillas o 15 abdominales a máxima velocidad con un vaso de trago en la mano sin derramar.' },
  { id: 'r_e26', nivel: 'extremo', texto: 'Pon tu celular en altavoz y llama al último número marcado fingiendo ser de cobranzas de un banco.' },
  { id: 'r_e27', nivel: 'extremo', texto: 'Deja que {target} te dé una cucharada de un trago que él/ella misma prepare a ciegas.' },
  { id: 'r_e28', nivel: 'extremo', texto: 'Pasa el resto del juego descalzo/a con los calcetines en las manos como guantes.' },
  { id: 'r_e29', nivel: 'extremo', texto: 'Confiesa a la mesa cuál es la contraseña de desbloqueo de tu celular o déjalo en el centro boca arriba.' },
  { id: 'r_e30', nivel: 'extremo', texto: 'Bébete 3 sorbos dobles de trago sin usar las manos, solo con la boca desde la mesa.' },
  { id: 'r_e31', nivel: 'extremo', texto: 'Llama a un familiar y dile con voz preocupada: "Mamá/Papá, creo que choqué el auto" y corta a los 5 segundos.' },
  { id: 'r_e32', nivel: 'extremo', texto: 'Deja que {target} te corte un mechón diminuto de pelo o te depile una tira de cinta adhesiva en el brazo.' },
  { id: 'r_e33', nivel: 'extremo', texto: 'Tómate un vaso de trago mezclado con jugo y una pizca de sal marina al seco.' },
  { id: 'r_e34', nivel: 'extremo', texto: 'Deja que la mesa elija un contacto de tu WhatsApp y debes mandarle un audio diciendo: "Te amo, perdóname por todo".' },
  { id: 'r_e35', nivel: 'extremo', texto: 'Mantente en silencio absoluto durante las próximas 3 rondas; si hablas, bebes fondo blanco.' },
  { id: 'r_e36', nivel: 'extremo', texto: 'Deja que {target} te tire un chorrito de agua helada en la nuca por sorpresa.' },
  { id: 'r_e37', nivel: 'extremo', texto: 'Envía un sticker atrevido al grupo familiar de WhatsApp y no lo borres por 10 minutos.' },
  { id: 'r_e38', nivel: 'extremo', texto: 'Tómate 2 vasos de agua seguidos al seco y luego un shot de licor puro.' },
  { id: 'r_e39', nivel: 'extremo', texto: 'Deja que la mesa te revise el historial de YouTube o búsquedas de TikTok en voz alta.' },
  { id: 'r_e40', nivel: 'extremo', texto: 'Haz como si fueras un mimo atrapado en una caja invisible durante 45 segundos; si emites un sonido, bebes 3 sorbos.' },
  { id: 'r_e41', nivel: 'extremo', texto: 'Llama a un amigo que no esté presente y pregúntale: "¿Tú todavía crees que la Tierra es plana?".' },
  { id: 'r_e42', nivel: 'extremo', texto: 'Deja que {target} te dibuje cejas falsas exageradas con lápiz de ojos o plumón.' },
  { id: 'r_e43', nivel: 'extremo', texto: 'Ponte una prenda de ropa al revés (la polera o el pantalón) y quédate así por 3 rondas.' },
  { id: 'r_e44', nivel: 'extremo', texto: 'Bébete 5 sorbos gigantes de trago mientras todos en la mesa te gritan "¡Jugo, jugo, jugo!".' },
  { id: 'r_e45', nivel: 'extremo', texto: 'Deja que la mesa elija una foto de tu galería para ponerla de foto de perfil de WhatsApp por 1 hora.' },
  { id: 'r_e46', nivel: 'extremo', texto: 'Dale tu teléfono a {target} y deja que responda al último mensaje que te llegue en los próximos 5 minutos.' },
  { id: 'r_e47', nivel: 'extremo', texto: 'Haz una declaración de guerra cómica a {target} y desafíalo/a a un duelo de tragos al seco.' },
  { id: 'r_e48', nivel: 'extremo', texto: 'Cómete una rodaja de cebolla cruda o un ajo picado si la mesa tiene a mano, o bebe vaso al seco.' },
  { id: 'r_e49', nivel: 'extremo', texto: 'Deja que {target} te eche un cubito de hielo por dentro de la polera hasta que se derrita.' },
  { id: 'r_e50', nivel: 'extremo', texto: '¡EL CASTIGO SUPREMO! Bébete la copa completa al seco ("fondo blanco") y haz una reverencia a la mesa.' },
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
