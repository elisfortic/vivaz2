import { createNoise3D, type NoiseFunction3D } from "simplex-noise";
import { mulberry32 } from "@/components/rede/grafo";

export { mulberry32 };
export type Ruido3D = NoiseFunction3D;

/**
 * Motor comum dos grafismos vivos — a mesma linguagem de movimento da
 * RedeViva (ruído simplex, períodos longos 20–45s, curvas S que respiram,
 * onda viajante) para que todos os organismos do site ondulem como um só
 * sistema, cada um no próprio ritmo.
 */

export const criarRuido = (seed: number): Ruido3D =>
  createNoise3D(mulberry32(seed));

/** Estático para prefers-reduced-motion e hardware fraco. */
export const estaticoPreferido = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  (typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4);

export const entre = (rng: () => number, min: number, max: number) =>
  min + rng() * (max - min);

/** Parâmetros de uma fibra viva — cada uma com ritmo independente. */
export interface ParamsFibra {
  canal: number;
  /** ciclo da respiração da forma (s) */
  periodo: number;
  /** tempo de travessia da onda pela fibra (s) */
  periodoViagem: number;
  /** pesos da curva S permanente */
  curvaA: number;
  curvaB: number;
  /** amplitude da ondulação em px */
  amp: number;
}

export function criarFibra(
  rng: () => number,
  ampMin = 6,
  ampMax = 16,
): ParamsFibra {
  return {
    canal: entre(rng, 0, 500),
    periodo: entre(rng, 20, 45),
    periodoViagem: entre(rng, 14, 30),
    curvaA: entre(rng, -1, 1),
    curvaB: rng() < 0.5 ? entre(rng, 0.4, 1) : entre(rng, -1, -0.4),
    amp: entre(rng, ampMin, ampMax),
  };
}

/**
 * Deslocamento perpendicular da fibra na fração f (0..1), em px:
 * curva S respirando + onda de ruído viajando ao longo da fibra.
 * `ampForma` controla a barriga da curva (proporcional ao vão).
 */
export function deslocFibra(
  ruido: Ruido3D,
  fibra: ParamsFibra,
  f: number,
  t: number,
  ampForma: number,
): number {
  const respiracao =
    0.75 + 0.35 * ruido(fibra.canal + 7.3, 0, t / fibra.periodo);
  const formaS =
    (fibra.curvaA * 0.6 * Math.sin(Math.PI * f) +
      fibra.curvaB * Math.sin(2 * Math.PI * f)) *
    respiracao *
    ampForma;
  const envelope = Math.sin(Math.PI * f);
  const onda =
    ruido(
      fibra.canal,
      f * 2.2 - t / fibra.periodoViagem,
      t / (fibra.periodo * 2),
    ) *
    fibra.amp *
    envelope;
  return formaS + onda;
}

/**
 * Traça a fibra entre (ax,ay) e (bx,by) no path atual do contexto.
 * Não faz stroke — o chamador agrupa fibras por cor/espessura.
 */
export function tracarFibra(
  ctx: CanvasRenderingContext2D,
  ruido: Ruido3D,
  fibra: ParamsFibra,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  t: number,
  segmentos = 16,
  fatorForma = 0.18,
): void {
  const dx = bx - ax;
  const dy = by - ay;
  const comp = Math.hypot(dx, dy) || 1;
  const perpX = -dy / comp;
  const perpY = dx / comp;
  const ampForma = Math.min(comp * fatorForma, 52);

  ctx.moveTo(ax, ay);
  for (let s = 1; s <= segmentos; s++) {
    const f = s / segmentos;
    const d = deslocFibra(ruido, fibra, f, t, ampForma);
    ctx.lineTo(ax + dx * f + perpX * d, ay + dy * f + perpY * d);
  }
}

/** Ponto sobre a fibra deformada na fração f — para partículas e rótulos. */
export function pontoNaFibra(
  ruido: Ruido3D,
  fibra: ParamsFibra,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  f: number,
  t: number,
  fatorForma = 0.18,
): { x: number; y: number } {
  const dx = bx - ax;
  const dy = by - ay;
  const comp = Math.hypot(dx, dy) || 1;
  const perpX = -dy / comp;
  const perpY = dx / comp;
  const ampForma = Math.min(comp * fatorForma, 52);
  const d = deslocFibra(ruido, fibra, f, t, ampForma);
  return { x: ax + dx * f + perpX * d, y: ay + dy * f + perpY * d };
}

export type FnDesenho = (
  ctx: CanvasRenderingContext2D,
  largura: number,
  altura: number,
  t: number,
  dt: number,
) => void;

/**
 * Ciclo de vida de um canvas vivo: DPR (cap 2), redimensionamento,
 * pausa fora do viewport e em aba oculta, relógio acumulado (pausar não
 * salta o tempo). Em modo estático desenha um único quadro composto.
 */
export class LoopCanvas {
  private ctx: CanvasRenderingContext2D;
  private largura = 0;
  private altura = 0;
  private t = 0;
  private ultimo = 0;
  private id = 0;
  private rodando = false;
  private visivel = true;
  private abaVisivel = true;
  private obsTamanho: ResizeObserver;
  private obsViewport: IntersectionObserver | null = null;
  readonly estatico: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    private desenhar: FnDesenho,
    private tEstatico = 7.3,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d indisponível");
    this.ctx = ctx;
    this.estatico = estaticoPreferido();
    this.abaVisivel = !document.hidden;

    this.obsTamanho = new ResizeObserver(() => this.dimensionar());
    this.obsTamanho.observe(canvas);
    this.dimensionar();

    if (this.estatico) return;

    this.obsViewport = new IntersectionObserver(
      ([entrada]) => {
        this.visivel = entrada.isIntersecting;
        this.atualizar();
      },
      { threshold: 0 },
    );
    this.obsViewport.observe(canvas);
    document.addEventListener("visibilitychange", this.aoMudarAba);
    this.atualizar();
  }

  private aoMudarAba = () => {
    this.abaVisivel = !document.hidden;
    this.atualizar();
  };

  private dimensionar() {
    const caixa = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.largura = caixa.width;
    this.altura = caixa.height;
    this.canvas.width = Math.round(caixa.width * dpr);
    this.canvas.height = Math.round(caixa.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.estatico) this.quadroEstatico();
  }

  private quadroEstatico() {
    this.ctx.clearRect(0, 0, this.largura, this.altura);
    this.desenhar(this.ctx, this.largura, this.altura, this.tEstatico, 0);
  }

  private quadro = (agora: number) => {
    // clamp inferior: o timestamp do rAF pode ser anterior ao
    // performance.now() da retomada — dt negativo quebraria os ciclos
    const dt = Math.min(Math.max((agora - this.ultimo) / 1000, 0), 0.05);
    this.ultimo = agora;
    this.t += dt;
    this.ctx.clearRect(0, 0, this.largura, this.altura);
    this.desenhar(this.ctx, this.largura, this.altura, this.t, dt);
    if (this.rodando) this.id = requestAnimationFrame(this.quadro);
  };

  private atualizar() {
    const deve = this.visivel && this.abaVisivel;
    if (deve && !this.rodando) {
      this.rodando = true;
      this.ultimo = performance.now();
      this.id = requestAnimationFrame(this.quadro);
    } else if (!deve && this.rodando) {
      this.rodando = false;
      cancelAnimationFrame(this.id);
    }
  }

  destruir() {
    this.rodando = false;
    cancelAnimationFrame(this.id);
    this.obsTamanho.disconnect();
    this.obsViewport?.disconnect();
    document.removeEventListener("visibilitychange", this.aoMudarAba);
  }
}

/** Lê os tokens de cor do brandbook a partir do elemento. */
export function lerCores(el: HTMLElement) {
  const estilo = getComputedStyle(el);
  const ler = (nome: string, alternativa: string) =>
    estilo.getPropertyValue(nome).trim() || alternativa;
  return {
    offWhite: ler("--off-white", "#faf9f6"),
    verde: ler("--verde", "#1a4d4e"),
    terracota: ler("--terracota", "#c26d53"),
    sage: ler("--sage", "#a3b18a"),
    areia: ler("--areia", "#d6d2c4"),
    grafite: ler("--grafite", "#333f48"),
    linha: ler("--linha", "#ddd9cd"),
  };
}
