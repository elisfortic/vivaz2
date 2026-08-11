import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

/** Nó da rede com posição normalizada [0,1] e parâmetros de movimento próprios. */
export interface No {
  id: number;
  /** posição base normalizada (após d3-force) */
  nx: number;
  ny: number;
  /** raio em px na escala de referência */
  raio: number;
  /** amplitude da ondulação em px na escala de referência */
  amp: number;
  /** período do ciclo de ruído em segundos (20–45) */
  periodo: number;
  /** canais de ruído fixos — garantem ritmo independente por nó */
  canalX: number;
  canalY: number;
  /** órbita lenta: deriva circular perceptível, além do ruído */
  orbitaRaio: number;
  orbitaPeriodo: number;
  orbitaFase: number;
  orbitaDir: 1 | -1;
  terracota: boolean;
}

export interface Aresta {
  a: number;
  b: number;
  /** período próprio da ondulação da linha (20–45s) */
  periodo: number;
  /** amplitude da ondulação perpendicular em px na escala de referência */
  amp: number;
  /** canal de ruído fixo da aresta */
  canal: number;
  /** forma S permanente: pesos das duas barrigas (sin πf e sin 2πf) */
  curvaA: number;
  curvaB: number;
  /** período com que a onda percorre a linha (fluxo direcional) */
  periodoViagem: number;
  /** hierarquia: "corda" é grossa e em sage; "fio" é a linha fina padrão */
  tipo: "fio" | "corda";
  /** abertura em malha: a linha se desfia em filamentos e volta a fechar */
  filamentos: number;
  periodoAbertura: number;
  canalAbertura: number;
  /** afastamento máximo dos filamentos em px na escala de referência */
  espalhamento: number;
}

export interface Grafo {
  nos: No[];
  arestas: Aresta[];
}

/** PRNG determinístico — layout reproduzível entre visitas. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface NoSim extends SimulationNodeDatum {
  id: number;
}

const entre = (rng: () => number, min: number, max: number) =>
  min + rng() * (max - min);

/**
 * Constrói o grafo: nós espalhados por d3-force, cada um ligado aos 2 vizinhos
 * mais próximos, mais alguns atalhos de longo alcance (sensação de sistema,
 * não de malha regular). Posições finais normalizadas para [0,1].
 */
export function construirGrafo(
  quantidade: number,
  terracotas: number,
  seed = 20260811,
): Grafo {
  const rng = mulberry32(seed);
  const LARGURA = 1000;
  const ALTURA = 620;

  const simNos: NoSim[] = Array.from({ length: quantidade }, (_, id) => ({
    id,
    x: entre(rng, 0, LARGURA),
    y: entre(rng, 0, ALTURA),
  }));

  // 2 vizinhos mais próximos por nó (sem duplicatas)
  const chaves = new Set<string>();
  const ligacoes: SimulationLinkDatum<NoSim>[] = [];
  const ligar = (a: number, b: number) => {
    const chave = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a !== b && !chaves.has(chave)) {
      chaves.add(chave);
      ligacoes.push({ source: a, target: b });
    }
  };

  for (const no of simNos) {
    const porDistancia = simNos
      .filter((outro) => outro.id !== no.id)
      .sort(
        (p, q) =>
          (p.x! - no.x!) ** 2 +
          (p.y! - no.y!) ** 2 -
          ((q.x! - no.x!) ** 2 + (q.y! - no.y!) ** 2),
      );
    ligar(no.id, porDistancia[0].id);
    ligar(no.id, porDistancia[1].id);
  }

  // atalhos de longo alcance: ~10% do total de nós
  const atalhos = Math.max(2, Math.round(quantidade * 0.1));
  for (let i = 0; i < atalhos; i++) {
    ligar(
      Math.floor(rng() * quantidade),
      Math.floor(rng() * quantidade),
    );
  }

  const simulacao = forceSimulation(simNos)
    .force(
      "ligacao",
      forceLink(ligacoes)
        .id((d) => (d as NoSim).id)
        .distance(120)
        .strength(0.35),
    )
    .force("carga", forceManyBody().strength(-60))
    .force("centro", forceCenter(LARGURA / 2, ALTURA / 2))
    .force("colisao", forceCollide(30))
    .force("horizontal", forceX(LARGURA / 2).strength(0.025))
    .force("vertical", forceY(ALTURA / 2).strength(0.06))
    .stop();

  simulacao.tick(300);

  // normalização pela caixa envolvente, com folga
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const no of simNos) {
    minX = Math.min(minX, no.x!);
    maxX = Math.max(maxX, no.x!);
    minY = Math.min(minY, no.y!);
    maxY = Math.max(maxY, no.y!);
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  // terracotas bem espalhados: amostragem gulosa de ponto mais distante
  const marcados = new Set<number>();
  if (terracotas > 0) {
    marcados.add(Math.floor(rng() * quantidade));
    while (marcados.size < Math.min(terracotas, quantidade)) {
      let melhor = -1;
      let melhorDist = -1;
      for (const no of simNos) {
        if (marcados.has(no.id)) continue;
        let menor = Infinity;
        for (const m of marcados) {
          const outro = simNos[m];
          menor = Math.min(
            menor,
            (no.x! - outro.x!) ** 2 + (no.y! - outro.y!) ** 2,
          );
        }
        if (menor > melhorDist) {
          melhorDist = menor;
          melhor = no.id;
        }
      }
      marcados.add(melhor);
    }
  }

  const nos: No[] = simNos.map((no) => ({
    id: no.id,
    nx: (no.x! - minX) / spanX,
    ny: (no.y! - minY) / spanY,
    raio: entre(rng, 2, 4.5),
    amp: entre(rng, 18, 40),
    periodo: entre(rng, 20, 45),
    canalX: entre(rng, 0, 100),
    canalY: entre(rng, 100, 200),
    orbitaRaio: entre(rng, 7, 18),
    orbitaPeriodo: entre(rng, 24, 50),
    orbitaFase: entre(rng, 0, Math.PI * 2),
    orbitaDir: rng() < 0.5 ? 1 : -1,
    terracota: marcados.has(no.id),
  }));

  const arestas: Aresta[] = ligacoes.map((lig) => ({
    a: (lig.source as NoSim).id,
    b: (lig.target as NoSim).id,
    periodo: entre(rng, 20, 45),
    amp: entre(rng, 9, 22),
    canal: entre(rng, 200, 300),
    curvaA: entre(rng, -1, 1),
    curvaB: rng() < 0.5 ? entre(rng, 0.5, 1) : entre(rng, -1, -0.5),
    periodoViagem: entre(rng, 14, 30),
    tipo: rng() < 0.16 ? "corda" : "fio",
    filamentos: rng() < 0.6 ? 2 : 3,
    periodoAbertura: entre(rng, 25, 55),
    canalAbertura: entre(rng, 300, 400),
    espalhamento: entre(rng, 12, 26),
  }));

  return { nos, arestas };
}
