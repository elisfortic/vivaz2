import type { IdiomaFuturo } from "@/lib/idiomas";

/**
 * Copy trilíngue da home. PT é a fonte (docs/04-copy-final.md).
 * ES/EN traduzidos com autorização do cliente (2026-08-11); tom calibrado
 * pela página única ES do 04 ("Personas que mueven sistemas").
 */

export const HERO = {
  pt: {
    eyebrow: "Consultoria em cultura, liderança e gestão",
    h1Antes: "Pessoas que ",
    h1Destaque: "movem",
    h1Depois: " sistemas",
    lead: "Conectamos estratégia, cultura e gestão para organizações que precisam se mover.",
    botao: "Converse com uma sócia",
    linkAncora: "O que é mover sistemas ↓",
  },
  es: {
    eyebrow: "Consultoría en cultura, liderazgo y gestión",
    h1Antes: "Personas que ",
    h1Destaque: "mueven",
    h1Depois: " sistemas",
    lead: "Conectamos estrategia, cultura y gestión para organizaciones que necesitan moverse.",
    botao: "Habla con una socia",
    linkAncora: "Qué es mover sistemas ↓",
  },
  en: {
    eyebrow: "Consulting in culture, leadership and management",
    h1Antes: "People who ",
    h1Destaque: "move",
    h1Depois: " systems",
    lead: "We connect strategy, culture and management for organizations that need to move.",
    botao: "Talk to a partner",
    linkAncora: "What moving systems means ↓",
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const MOVER = {
  pt: {
    eyebrow: "Mover sistemas",
    frase: "Construir uma governança fluida.",
    lead: "Onde o conhecimento circula, onde a confiança sustenta as decisões e onde a diferença de opinião gera ideia nova em vez de conflito.",
    recusaDestaque: "Não desenvolvemos a estratégia da sua empresa.",
    recusa:
      " Conectamos a estratégia que já existe à cultura e à gestão de pessoas — para que ela deixe de ser uma intenção no papel e passe a acontecer no dia a dia.",
  },
  es: {
    eyebrow: "Mover sistemas",
    frase: "Construir una gobernanza fluida.",
    lead: "Donde el conocimiento circula, donde la confianza sostiene las decisiones y donde la diferencia de opinión genera ideas nuevas en lugar de conflicto.",
    recusaDestaque: "No desarrollamos la estrategia de tu empresa.",
    recusa:
      " Conectamos la estrategia que ya existe con la cultura y la gestión de personas — para que deje de ser una intención en el papel y empiece a suceder en el día a día.",
  },
  en: {
    eyebrow: "Moving systems",
    frase: "Building fluid governance.",
    lead: "Where knowledge circulates, where trust sustains decisions, and where differences of opinion create new ideas instead of conflict.",
    recusaDestaque: "We do not develop your company's strategy.",
    recusa:
      " We connect the strategy you already have to culture and people management — so it stops being an intention on paper and starts happening day to day.",
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const PONTO_DE_PARTIDA = {
  pt: {
    h2: "Toda organização é um sistema vivo.",
    p1: "Cultura, estrutura, liderança, processos, relações e propósito estão conectados — e respondendo aos movimentos uns dos outros.",
    p2: "Quando esses encontros acontecem, a organização aprende e se move sozinha.",
    rotulos: [
      {
        texto: "A Ilusão",
        linha: "O que mantém esse sistema vivo não é o organograma.",
      },
      {
        texto: "A Realidade",
        linha:
          "É o que acontece entre as pessoas: o conhecimento que circula, a confiança que sustenta, a diferença que gera ideia nova.",
      },
      {
        texto: "O Risco",
        linha:
          "Quando se rompem, nem a melhor estratégia do mundo faz a empresa sair do lugar.",
      },
    ],
  },
  es: {
    h2: "Toda organización es un sistema vivo.",
    p1: "Cultura, estructura, liderazgo, procesos, relaciones y propósito están conectados — y responden a los movimientos unos de otros.",
    p2: "Cuando esos encuentros suceden, la organización aprende y se mueve sola.",
    rotulos: [
      {
        texto: "La Ilusión",
        linha: "Lo que mantiene vivo ese sistema no es el organigrama.",
      },
      {
        texto: "La Realidad",
        linha:
          "Es lo que sucede entre las personas: el conocimiento que circula, la confianza que sostiene, la diferencia que genera ideas nuevas.",
      },
      {
        texto: "El Riesgo",
        linha:
          "Cuando se rompen, ni la mejor estrategia del mundo hace que la empresa avance.",
      },
    ],
  },
  en: {
    h2: "Every organization is a living system.",
    p1: "Culture, structure, leadership, processes, relationships and purpose are connected — each responding to the others' movements.",
    p2: "When those encounters happen, the organization learns and moves on its own.",
    rotulos: [
      {
        texto: "The Illusion",
        linha: "What keeps this system alive is not the org chart.",
      },
      {
        texto: "The Reality",
        linha:
          "It is what happens between people: knowledge that circulates, trust that sustains, difference that creates new ideas.",
      },
      {
        texto: "The Risk",
        linha:
          "When they break, not even the best strategy in the world moves the company forward.",
      },
    ],
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const FALHAM = {
  pt: {
    eyebrow: "Nosso ponto de vista",
    h2: "Por que tantas transformações falham",
    lead: "Não por falta de método — mas por tratar partes isoladas de um sistema que precisa ser avaliado de maneira coordenada.",
    linhas: [
      {
        titulo: "Mexe-se na estrutura,",
        subtitulo: "mas a cultura resiste.",
        corpo:
          "O novo organograma não funciona se as pessoas continuam operando na cultura antiga.",
      },
      {
        titulo: "Investe-se em liderança,",
        subtitulo: "mas a governança contradiz.",
        corpo:
          "Um programa robusto não muda nada se a decisão segue centralizada e o líder não decide.",
      },
      {
        titulo: "Anunciam-se valores,",
        subtitulo: "mas a avaliação não muda.",
        corpo:
          "Valor que não aparece na avaliação de desempenho não se torna real.",
      },
    ],
    linkEnsaio: "Leia o ensaio completo — 8 min →",
  },
  es: {
    eyebrow: "Nuestro punto de vista",
    h2: "Por qué fallan tantas transformaciones",
    lead: "No por falta de método — sino por tratar partes aisladas de un sistema que necesita evaluarse de manera coordinada.",
    linhas: [
      {
        titulo: "Se cambia la estructura,",
        subtitulo: "pero la cultura resiste.",
        corpo:
          "El nuevo organigrama no funciona si las personas siguen operando en la cultura antigua.",
      },
      {
        titulo: "Se invierte en liderazgo,",
        subtitulo: "pero la gobernanza contradice.",
        corpo:
          "Un programa robusto no cambia nada si la decisión sigue centralizada y el líder no decide.",
      },
      {
        titulo: "Se anuncian valores,",
        subtitulo: "pero la evaluación no cambia.",
        corpo:
          "Un valor que no aparece en la evaluación de desempeño no se vuelve real.",
      },
    ],
    linkEnsaio: "Lee el ensayo completo — 8 min →",
  },
  en: {
    eyebrow: "Our point of view",
    h2: "Why so many transformations fail",
    lead: "Not for lack of method — but for treating isolated parts of a system that needs to be assessed in a coordinated way.",
    linhas: [
      {
        titulo: "The structure changes,",
        subtitulo: "but culture resists.",
        corpo:
          "The new org chart doesn't work if people keep operating in the old culture.",
      },
      {
        titulo: "Leadership gets investment,",
        subtitulo: "but governance contradicts it.",
        corpo:
          "A robust program changes nothing if decisions stay centralized and leaders don't decide.",
      },
      {
        titulo: "Values are announced,",
        subtitulo: "but evaluation stays the same.",
        corpo:
          "A value that doesn't show up in performance reviews never becomes real.",
      },
    ],
    linkEnsaio: "Read the full essay — 8 min →",
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const TERRITORIOS = {
  pt: {
    eyebrow: "O que movemos",
    h2: "Quatro territórios de atuação",
    lead: "Nem todo projeto começa no mesmo lugar. Qualquer que seja a porta de entrada, lemos a organização como um sistema — porque mexer em uma parte sempre move as outras.",
    itens: [
      {
        titulo: "Cultura & Ética",
        corpo:
          "Transformação cultural, valores em uso versus valores declarados, ouvidoria, integridade e riscos psicossociais.",
      },
      {
        titulo: "Estrutura & Estratégia de Pessoas",
        corpo:
          "Estruturas organizacionais, governança, desempenho, sucessão, arquitetura de cargos e remuneração.",
      },
      {
        titulo: "Liderança & Desenvolvimento",
        corpo:
          "Mentoria, coaching executivo, trilhas de capacitação sob medida e transformação de times.",
      },
      {
        titulo: "Transformação & Mudança",
        corpo:
          "Gestão de mudança, integração pós-M&A e comunicação interna em transformações amplas.",
      },
    ],
  },
  es: {
    eyebrow: "Qué movemos",
    h2: "Cuatro territorios de actuación",
    lead: "No todo proyecto empieza en el mismo lugar. Sea cual sea la puerta de entrada, leemos la organización como un sistema — porque mover una parte siempre mueve las demás.",
    itens: [
      {
        titulo: "Cultura & Ética",
        corpo:
          "Transformación cultural, valores en uso frente a valores declarados, canal de denuncias, integridad y riesgos psicosociales.",
      },
      {
        titulo: "Estructura & Estrategia de Personas",
        corpo:
          "Estructuras organizacionales, gobernanza, desempeño, sucesión, arquitectura de puestos y remuneración.",
      },
      {
        titulo: "Liderazgo & Desarrollo",
        corpo:
          "Mentoría, coaching ejecutivo, itinerarios de capacitación a medida y transformación de equipos.",
      },
      {
        titulo: "Transformación & Cambio",
        corpo:
          "Gestión del cambio, integración post-M&A y comunicación interna en transformaciones amplias.",
      },
    ],
  },
  en: {
    eyebrow: "What we move",
    h2: "Four territories of practice",
    lead: "Not every project starts in the same place. Whatever the entry point, we read the organization as a system — because moving one part always moves the others.",
    itens: [
      {
        titulo: "Culture & Ethics",
        corpo:
          "Cultural transformation, values in use versus stated values, ombudsman channels, integrity and psychosocial risks.",
      },
      {
        titulo: "Structure & People Strategy",
        corpo:
          "Organizational structures, governance, performance, succession, job architecture and compensation.",
      },
      {
        titulo: "Leadership & Development",
        corpo:
          "Mentoring, executive coaching, tailor-made development tracks and team transformation.",
      },
      {
        titulo: "Transformation & Change",
        corpo:
          "Change management, post-M&A integration and internal communication in broad transformations.",
      },
    ],
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const QUEM_SOMOS_TEASER = {
  pt: {
    eyebrow: "Quem somos",
    h2Linha1: "Três percursos,",
    h2Linha2: "um trio alinhado.",
    lead: "Carreira executiva em algumas das organizações mais complexas do país — e a decisão de colocar essa experiência a serviço de empresas que precisam mover seus sistemas.",
    link: "Conheça Elisângela, Flavia e Leila →",
    trajetoriaRotulo: "Trajetória construída em",
  },
  es: {
    eyebrow: "Quiénes somos",
    h2Linha1: "Tres trayectorias,",
    h2Linha2: "un trío alineado.",
    lead: "Carrera ejecutiva en algunas de las organizaciones más complejas de Brasil — y la decisión de poner esa experiencia al servicio de empresas que necesitan mover sus sistemas.",
    link: "Conoce a Elisângela, Flavia y Leila →",
    trajetoriaRotulo: "Trayectoria construida en",
  },
  en: {
    eyebrow: "Who we are",
    h2Linha1: "Three paths,",
    h2Linha2: "one aligned trio.",
    lead: "Executive careers in some of the most complex organizations in Brazil — and the decision to put that experience at the service of companies that need to move their systems.",
    link: "Meet Elisângela, Flavia and Leila →",
    trajetoriaRotulo: "Track record built at",
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const COMO_TRABALHAMOS = {
  pt: {
    eyebrow: "Como trabalhamos",
    h2: "O que orienta cada projeto",
    principios: [
      {
        numero: "01",
        titulo: "Profundidade",
        frase: "Entender antes de propor.",
        corpo:
          "Cada organização funciona de um jeito. Antes de desenhar qualquer solução, investimos tempo entendendo como as coisas realmente acontecem.",
      },
      {
        numero: "02",
        titulo: "Humanização",
        frase: "Pessoas não são indicadores.",
        corpo:
          "Gente não é dado a ser gerenciado. É por onde toda mudança começa ou trava. Por isso escutamos as pessoas antes de qualquer intervenção.",
      },
      {
        numero: "03",
        titulo: "Conexão",
        frase: "Ninguém se desenvolve sozinho.",
        corpo:
          "O conhecimento circula pelas relações. É no encontro entre pessoas que crescemos, que a rede se fortalece e que a inovação surge.",
      },
      {
        numero: "04",
        titulo: "Impacto",
        frase: "O que fica depois que a gente sai.",
        corpo:
          "Não tratamos sintoma. Buscamos o que está travando o sistema para que ele volte a andar e continue andando por conta própria.",
      },
    ],
  },
  es: {
    eyebrow: "Cómo trabajamos",
    h2: "Lo que orienta cada proyecto",
    principios: [
      {
        numero: "01",
        titulo: "Profundidad",
        frase: "Entender antes de proponer.",
        corpo:
          "Cada organización funciona a su manera. Antes de diseñar cualquier solución, invertimos tiempo en entender cómo suceden realmente las cosas.",
      },
      {
        numero: "02",
        titulo: "Humanización",
        frase: "Las personas no son indicadores.",
        corpo:
          "La gente no es un dato que gestionar. Es donde todo cambio empieza o se traba. Por eso escuchamos a las personas antes de cualquier intervención.",
      },
      {
        numero: "03",
        titulo: "Conexión",
        frase: "Nadie se desarrolla solo.",
        corpo:
          "El conocimiento circula por las relaciones. Es en el encuentro entre personas donde crecemos, donde la red se fortalece y donde surge la innovación.",
      },
      {
        numero: "04",
        titulo: "Impacto",
        frase: "Lo que queda después de que nos vamos.",
        corpo:
          "No tratamos síntomas. Buscamos lo que está trabando el sistema para que vuelva a andar y siga andando por su cuenta.",
      },
    ],
  },
  en: {
    eyebrow: "How we work",
    h2: "What guides every project",
    principios: [
      {
        numero: "01",
        titulo: "Depth",
        frase: "Understand before proposing.",
        corpo:
          "Every organization works its own way. Before designing any solution, we invest time understanding how things really happen.",
      },
      {
        numero: "02",
        titulo: "Humanity",
        frase: "People are not indicators.",
        corpo:
          "People are not data to be managed. They are where every change begins or stalls. That's why we listen to people before any intervention.",
      },
      {
        numero: "03",
        titulo: "Connection",
        frase: "No one develops alone.",
        corpo:
          "Knowledge circulates through relationships. It is in the encounter between people that we grow, that the network strengthens, and that innovation emerges.",
      },
      {
        numero: "04",
        titulo: "Impact",
        frase: "What remains after we leave.",
        corpo:
          "We don't treat symptoms. We look for what is blocking the system so it moves again — and keeps moving on its own.",
      },
    ],
  },
} satisfies Record<IdiomaFuturo, unknown>;

export const FECHAMENTO = {
  pt: {
    h2Antes: "Pessoas que ",
    h2Destaque: "movem",
    h2Depois: " sistemas",
    corpo:
      "Se você está diante de uma mudança que precisa acontecer ao mesmo tempo na cultura, na estrutura e na gestão — vamos conversar.",
    botao: "Converse com uma sócia",
  },
  es: {
    h2Antes: "Personas que ",
    h2Destaque: "mueven",
    h2Depois: " sistemas",
    corpo:
      "Si estás frente a un cambio que necesita suceder al mismo tiempo en la cultura, la estructura y la gestión — hablemos.",
    botao: "Habla con una socia",
  },
  en: {
    h2Antes: "People who ",
    h2Destaque: "move",
    h2Depois: " systems",
    corpo:
      "If you are facing a change that needs to happen in culture, structure and management at the same time — let's talk.",
    botao: "Talk to a partner",
  },
} satisfies Record<IdiomaFuturo, unknown>;
