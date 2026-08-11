"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import {
  construirGrafo,
  mulberry32,
  type Aresta,
  type Grafo,
} from "./grafo";

interface RedeVivaProps {
  /** superfície sob a rede — muda a cor das arestas */
  variante?: "claro" | "verde";
  /** nós em terracota (até 4 por rota) */
  terracotas?: number;
  /** repulsão ao cursor */
  interativa?: boolean;
  seed?: number;
  className?: string;
}

const RAIO_CURSOR = 180;
const FORCA_CURSOR = 46;
/** referência de escala: amplitudes do grafo são calibradas para esta altura */
const ALTURA_REFERENCIA = 800;

/**
 * A rede viva — canvas 2D, d3-force para o layout, simplex noise para a
 * ondulação contínua. Cada nó e cada linha têm período próprio (20–45s):
 * nada se sincroniza, nada começa nem termina.
 *
 * Linguagem de movimento:
 * - linhas em curva S permanente que respira devagar;
 * - onda de ruído viajando ao longo de cada linha (fluxo direcional);
 * - nós em órbitas elípticas lentas somadas à deriva de ruído;
 * - partículas percorrendo as linhas e saltando de nó em nó —
 *   o conhecimento circulando pela rede, literalmente.
 *
 * Degradação: 60fps alvo → menos segmentos por linha → quadro estático.
 * `prefers-reduced-motion` e hardware fraco recebem o quadro estático direto.
 */
export default function RedeViva({
  variante = "claro",
  terracotas = 4,
  interativa = true,
  seed,
  className,
}: RedeVivaProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const estilo = getComputedStyle(canvas);
    const corSage = estilo.getPropertyValue("--sage").trim() || "#a3b18a";
    const corTerracota =
      estilo.getPropertyValue("--terracota").trim() || "#c26d53";
    const corLinha = estilo.getPropertyValue("--linha").trim() || "#ddd9cd";
    const corAresta =
      variante === "verde" ? "rgba(250, 249, 246, 0.18)" : corLinha;
    const corCorda =
      variante === "verde"
        ? "rgba(250, 249, 246, 0.28)"
        : "rgba(163, 177, 138, 0.55)";
    const corParticula =
      variante === "verde" ? "rgba(250, 249, 246, 0.6)" : corSage;

    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hardwareFraco =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 4;
    const estatico = movimentoReduzido || hardwareFraco;

    const mobile = window.innerWidth < 768;
    const semente = seed ?? 20260811;
    const grafo: Grafo = construirGrafo(mobile ? 20 : 48, terracotas, semente);

    const ruido = createNoise3D(mulberry32(semente ^ 0x9e37));
    const rng = mulberry32(semente ^ 0x51f2);

    // estado por nó: posição renderizada e deslocamento de repulsão
    const n = grafo.nos.length;
    const px = new Float64Array(n);
    const py = new Float64Array(n);
    const dispX = new Float64Array(n);
    const dispY = new Float64Array(n);

    // adjacência: arestas que tocam cada nó — rota das partículas
    const adjacencia: number[][] = Array.from({ length: n }, () => []);
    grafo.arestas.forEach((aresta, idx) => {
      adjacencia[aresta.a].push(idx);
      adjacencia[aresta.b].push(idx);
    });

    // partículas: fluxo visível de nó a nó
    interface Particula {
      aresta: number;
      /** nó de origem — a partícula viaja para o outro extremo */
      origem: number;
      f: number;
      dur: number;
    }
    const particulas: Particula[] = [];
    if (!estatico) {
      const total = Math.max(5, Math.round(grafo.arestas.length / 3));
      for (let i = 0; i < total; i++) {
        const aresta = Math.floor(rng() * grafo.arestas.length);
        particulas.push({
          aresta,
          origem: rng() < 0.5 ? grafo.arestas[aresta].a : grafo.arestas[aresta].b,
          f: rng(),
          dur: 5 + rng() * 5,
        });
      }
    }

    let largura = 0;
    let altura = 0;
    let escala = 1;
    let dpr = 1;

    const dimensionar = () => {
      const caixa = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = caixa.width;
      altura = caixa.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      escala = Math.min(1.25, Math.max(0.45, altura / ALTURA_REFERENCIA));
    };
    dimensionar();

    const observadorTamanho = new ResizeObserver(() => {
      dimensionar();
      if (estatico) desenhar(7.3, 0);
    });
    observadorTamanho.observe(canvas);

    // cursor em coordenadas do canvas; null = fora
    let cursorX: number | null = null;
    let cursorY: number | null = null;
    const aoMoverCursor = (ev: PointerEvent) => {
      const caixa = canvas.getBoundingClientRect();
      cursorX = ev.clientX - caixa.left;
      cursorY = ev.clientY - caixa.top;
    };
    const aoSairCursor = () => {
      cursorX = null;
      cursorY = null;
    };
    if (interativa && !estatico) {
      window.addEventListener("pointermove", aoMoverCursor, { passive: true });
      window.addEventListener("pointerleave", aoSairCursor);
    }

    // margem para a rede respirar sem colar nas bordas
    const MARGEM = 0.07;

    /** nível de degradação: 0 pleno · 1 linhas simplificadas · 2 estático */
    let degrau = estatico ? 2 : 0;

    /** transição suave 0→1 — abre e fecha a malha sem degrau */
    const suave01 = (v: number, ini: number, fim: number) => {
      const u = Math.min(1, Math.max(0, (v - ini) / (fim - ini)));
      return u * u * (3 - 2 * u);
    };

    /**
     * Quanto a linha está aberta em malha agora (0 fechada · 1 desfiada).
     * Ruído lento por aresta: cada uma abre e fecha no próprio tempo —
     * aberta ~1/3 do tempo, transição de vários segundos.
     */
    const abertura = (aresta: Aresta, t: number) =>
      suave01(
        ruido(aresta.canalAbertura, 0, t / aresta.periodoAbertura),
        0.1,
        0.55,
      );

    /**
     * Deslocamento perpendicular da linha na fração f (0..1):
     * curva S permanente respirando + onda de ruído que viaja de a → b.
     */
    const deslocamentoAresta = (aresta: Aresta, f: number, t: number) => {
      const respiracao =
        0.75 + 0.35 * ruido(aresta.canal + 7.3, 0, t / aresta.periodo);
      const formaS =
        (aresta.curvaA * 0.6 * Math.sin(Math.PI * f) +
          aresta.curvaB * Math.sin(2 * Math.PI * f)) *
        respiracao;
      const envelope = Math.sin(Math.PI * f);
      const onda =
        ruido(
          aresta.canal,
          f * 2.2 - t / aresta.periodoViagem,
          t / (aresta.periodo * 2),
        ) *
        aresta.amp *
        escala *
        envelope;
      return { formaS, onda };
    };

    const desenhar = (t: number, dt: number) => {
      ctx.clearRect(0, 0, largura, altura);

      const spanX = largura * (1 - MARGEM * 2);
      const spanY = altura * (1 - MARGEM * 2);
      const baseX = largura * MARGEM;
      const baseY = altura * MARGEM;

      // posições: base + órbita lenta + ondulação de ruído + repulsão com memória
      for (let i = 0; i < n; i++) {
        const no = grafo.nos[i];
        const amp = no.amp * escala;
        const angulo =
          no.orbitaFase +
          no.orbitaDir * ((Math.PI * 2 * t) / no.orbitaPeriodo);
        const orbita = no.orbitaRaio * escala;
        const ox =
          Math.cos(angulo) * orbita +
          ruido(no.canalX, 0, t / no.periodo) * amp;
        const oy =
          Math.sin(angulo) * orbita * 0.75 +
          ruido(no.canalY, 50, t / no.periodo + 31.7) * amp;
        let x = baseX + no.nx * spanX + ox;
        let y = baseY + no.ny * spanY + oy;

        if (cursorX !== null && cursorY !== null && degrau < 2) {
          const dx = x - cursorX;
          const dy = y - cursorY;
          const dist = Math.hypot(dx, dy);
          let alvoX = 0;
          let alvoY = 0;
          if (dist < RAIO_CURSOR && dist > 0.001) {
            const forca = (1 - dist / RAIO_CURSOR) ** 2 * FORCA_CURSOR * escala;
            alvoX = (dx / dist) * forca;
            alvoY = (dy / dist) * forca;
          }
          // empurra com resposta rápida; solta devagar — a rede "lembra"
          const indoEmbora =
            alvoX * alvoX + alvoY * alvoY <
            dispX[i] * dispX[i] + dispY[i] * dispY[i];
          const k = indoEmbora
            ? 1 - Math.exp(-dt / 1.6)
            : 1 - Math.exp(-dt / 0.25);
          dispX[i] += (alvoX - dispX[i]) * k;
          dispY[i] += (alvoY - dispY[i]) * k;
        } else {
          const k = 1 - Math.exp(-dt / 1.6);
          dispX[i] -= dispX[i] * k;
          dispY[i] -= dispY[i] * k;
        }

        px[i] = x + dispX[i];
        py[i] = y + dispY[i];
      }

      // arestas: polilinhas curvas, um stroke por hierarquia —
      // fios finos na cor de linha, cordas grossas em sage (como no deck)
      const segmentos = degrau >= 1 ? 8 : 16;
      const tracarAresta = (aresta: Aresta) => {
        const ax = px[aresta.a];
        const ay = py[aresta.a];
        const bx = px[aresta.b];
        const by = py[aresta.b];
        const dx = bx - ax;
        const dy = by - ay;
        const comp = Math.hypot(dx, dy) || 1;
        const perpX = -dy / comp;
        const perpY = dx / comp;
        const ampForma = Math.min(comp * 0.18, 46 * escala);

        ctx.moveTo(ax, ay);
        for (let s = 1; s <= segmentos; s++) {
          const f = s / segmentos;
          const { formaS, onda } = deslocamentoAresta(aresta, f, t);
          const desloc = formaS * ampForma + onda;
          ctx.lineTo(
            ax + dx * f + perpX * desloc,
            ay + dy * f + perpY * desloc,
          );
        }
      };

      ctx.beginPath();
      for (const aresta of grafo.arestas) {
        if (aresta.tipo === "fio") tracarAresta(aresta);
      }
      ctx.strokeStyle = corAresta;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      for (const aresta of grafo.arestas) {
        if (aresta.tipo === "corda") tracarAresta(aresta);
      }
      ctx.strokeStyle = corCorda;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // malha: filamentos que se desfiam da linha e voltam a fechar.
      // Afastamento determinístico separa o feixe; ruído próprio faz os
      // filamentos se cruzarem — a linha vira trama, depois volta a ser uma.
      if (degrau === 0) {
        ctx.beginPath();
        let algumAberto = false;
        for (const aresta of grafo.arestas) {
          const aberto = abertura(aresta, t);
          if (aberto < 0.03) continue;
          algumAberto = true;
          const ax = px[aresta.a];
          const ay = py[aresta.a];
          const bx = px[aresta.b];
          const by = py[aresta.b];
          const dx = bx - ax;
          const dy = by - ay;
          const comp = Math.hypot(dx, dy) || 1;
          const perpX = -dy / comp;
          const perpY = dx / comp;
          const ampForma = Math.min(comp * 0.18, 46 * escala);
          const afastamento =
            Math.min(aresta.espalhamento * escala, comp * 0.14) * aberto;

          for (let j = 0; j < aresta.filamentos; j++) {
            // lados alternados: -1, +1, -2…
            const lado = (j % 2 === 0 ? -1 : 1) * (Math.floor(j / 2) + 1);
            ctx.moveTo(ax, ay);
            for (let s = 1; s <= segmentos; s++) {
              const f = s / segmentos;
              const envelope = Math.sin(Math.PI * f);
              const { formaS, onda } = deslocamentoAresta(aresta, f, t);
              const tecer =
                ruido(
                  aresta.canal + 13.7 * (j + 1),
                  f * 2.5 - t / aresta.periodoViagem,
                  t / aresta.periodo,
                ) *
                aresta.amp *
                0.7 *
                escala *
                envelope *
                aberto;
              const desloc =
                formaS * ampForma +
                onda +
                lado * afastamento * envelope +
                tecer;
              ctx.lineTo(
                ax + dx * f + perpX * desloc,
                ay + dy * f + perpY * desloc,
              );
            }
          }
        }
        if (algumAberto) {
          ctx.strokeStyle = corAresta;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // partículas: avançam pela linha deformada e saltam para a próxima
      if (degrau < 2 && particulas.length > 0) {
        ctx.beginPath();
        for (const p of particulas) {
          const aresta = grafo.arestas[p.aresta];
          p.f += dt / p.dur;
          if (p.f >= 1) {
            // chegou: continua a partir do nó de destino, por outra aresta
            const chegada = p.origem === aresta.a ? aresta.b : aresta.a;
            const opcoes = adjacencia[chegada].filter(
              (idx) => idx !== p.aresta,
            );
            p.aresta =
              opcoes.length > 0
                ? opcoes[Math.floor(rng() * opcoes.length)]
                : p.aresta;
            p.origem = chegada;
            p.f = 0;
            p.dur = 5 + rng() * 5;
          }
          const arestaAtual = grafo.arestas[p.aresta];
          const invertida = p.origem === arestaAtual.b;
          const f = invertida ? 1 - p.f : p.f;
          const ax = px[arestaAtual.a];
          const ay = py[arestaAtual.a];
          const dx = px[arestaAtual.b] - ax;
          const dy = py[arestaAtual.b] - ay;
          const comp = Math.hypot(dx, dy) || 1;
          const perpX = -dy / comp;
          const perpY = dx / comp;
          const ampForma = Math.min(comp * 0.18, 46 * escala);
          const { formaS, onda } = deslocamentoAresta(arestaAtual, f, t);
          const desloc = formaS * ampForma + onda;
          const x = ax + dx * f + perpX * desloc;
          const y = ay + dy * f + perpY * desloc;
          const r = 1.8 * escala;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = corParticula;
        ctx.fill();
      }

      // nós em dois lotes por cor
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (grafo.nos[i].terracota) continue;
        ctx.moveTo(px[i] + grafo.nos[i].raio * escala, py[i]);
        ctx.arc(px[i], py[i], grafo.nos[i].raio * escala, 0, Math.PI * 2);
      }
      ctx.fillStyle = corSage;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (!grafo.nos[i].terracota) continue;
        const r = (grafo.nos[i].raio + 1) * escala;
        ctx.moveTo(px[i] + r, py[i]);
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
      }
      ctx.fillStyle = corTerracota;
      ctx.fill();
    };

    if (estatico) {
      desenhar(7.3, 0);
      return () => observadorTamanho.disconnect();
    }

    // relógio acumulado — pausar não salta o tempo
    let t = 0;
    let ultimo = performance.now();
    let idAnimacao = 0;
    let rodando = false;
    let visivel = true;
    let abaVisivel = !document.hidden;

    // vigia de fps: média móvel; sustentado ruim → degrada um degrau
    let mediaQuadro = 1 / 60;
    let quadrosRuins = 0;

    const quadro = (agora: number) => {
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;
      t += dt;

      mediaQuadro += (dt - mediaQuadro) * 0.05;
      if (degrau < 2) {
        if (mediaQuadro > 0.026) {
          quadrosRuins++;
          if (quadrosRuins > 90) {
            degrau++;
            quadrosRuins = 0;
            mediaQuadro = 1 / 60;
          }
        } else if (quadrosRuins > 0) {
          quadrosRuins--;
        }
      }

      desenhar(t, dt);

      if (degrau >= 2) {
        rodando = false;
        return; // degradou até estático — para de vez
      }
      idAnimacao = requestAnimationFrame(quadro);
    };

    const atualizarExecucao = () => {
      const deveRodar = visivel && abaVisivel && degrau < 2;
      if (deveRodar && !rodando) {
        rodando = true;
        ultimo = performance.now();
        idAnimacao = requestAnimationFrame(quadro);
      } else if (!deveRodar && rodando) {
        rodando = false;
        cancelAnimationFrame(idAnimacao);
      }
    };

    const observadorViewport = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting;
        atualizarExecucao();
      },
      { threshold: 0 },
    );
    observadorViewport.observe(canvas);

    const aoMudarVisibilidade = () => {
      abaVisivel = !document.hidden;
      atualizarExecucao();
    };
    document.addEventListener("visibilitychange", aoMudarVisibilidade);

    atualizarExecucao();

    return () => {
      rodando = false;
      cancelAnimationFrame(idAnimacao);
      observadorTamanho.disconnect();
      observadorViewport.disconnect();
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
      window.removeEventListener("pointermove", aoMoverCursor);
      window.removeEventListener("pointerleave", aoSairCursor);
    };
  }, [variante, terracotas, interativa, seed]);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "absolute inset-0 h-full w-full"}
      aria-hidden="true"
    />
  );
}
