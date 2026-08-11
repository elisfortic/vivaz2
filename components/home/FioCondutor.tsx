"use client";

import { useEffect, useRef } from "react";
import { LoopCanvas, criarRuido, lerCores, mulberry32, entre } from "@/lib/fibras";

/**
 * O fio condutor, v3 — regras do cliente:
 * - NASCE da rede viva do hero (primeiro ponto dentro dela) e MORRE dentro
 *   da rede verde do fechamento;
 * - nunca passa por cima nem por baixo de conteúdo: desce pelo gutter
 *   direito e se INTEGRA aos grafismos que alcançam a borda — mergulha na
 *   borda do rio de fibras, do organograma e do trio, entra e sai;
 * - muito sutil (1.2px, alpha baixa), com dois círculos em órbita
 *   percorrendo o fio.
 *
 * Canvas fixo; geometria em espaço de documento transladada por scrollY.
 */
export default function FioCondutor() {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    if (window.innerWidth < 1100) return;

    const cores = lerCores(canvas);
    const ruido = criarRuido(20260823);
    const rng = mulberry32(20260823 ^ 0x1d7f);

    let pontosX: number[] = [];
    let pontosY: number[] = [];
    let yVerde = Infinity;

    const posicaoDocumento = (el: HTMLElement) => {
      let y = 0;
      let node: HTMLElement | null = el;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y;
    };

    const construir = () => {
      const secoes = Array.from(
        document.querySelectorAll<HTMLElement>("main section"),
      );
      if (secoes.length < 8) return;
      const larguraTela = document.documentElement.clientWidth;
      const gutter = Math.max((larguraTela - 1152) / 2, 48);
      const xGutter = larguraTela - gutter * 0.45;

      const medidas = secoes.map((el) => {
        const topo = posicaoDocumento(el);
        return { topo, base: topo + el.offsetHeight, altura: el.offsetHeight };
      });
      yVerde = medidas[7].topo;

      const way: { x: number; y: number }[] = [];
      const osc = (k: number) =>
        entre(mulberry32(k * 733 + 11), -1, 1) * gutter * 0.1;

      // nasce DENTRO da rede do hero
      way.push({
        x: larguraTela * 0.72,
        y: medidas[0].topo + medidas[0].altura * 0.55,
      });
      way.push({
        x: larguraTela * 0.85,
        y: medidas[0].topo + medidas[0].altura * 0.8,
      });

      // mergulhos: onde cada grafismo alcança a borda direita, o fio entra
      // e sai dele; nos demais, abraça o gutter
      const mergulhos: Record<number, { x: number; fy: number }> = {
        1: { x: larguraTela * 0.9, fy: 0.82 }, // rio de fibras (faixa inferior)
        2: { x: larguraTela * 0.88, fy: 0.5 }, // organograma
        5: { x: larguraTela * 0.92, fy: 0.42 }, // trio de ancoragem
      };

      for (let i = 1; i < 7; i++) {
        const medida = medidas[i];
        way.push({ x: xGutter + osc(i * 3 + 1), y: medida.topo + medida.altura * 0.18 });
        const mergulho = mergulhos[i];
        if (mergulho) {
          way.push({ x: mergulho.x, y: medida.topo + medida.altura * mergulho.fy });
        } else {
          way.push({ x: xGutter + osc(i * 3 + 2), y: medida.topo + medida.altura * 0.55 });
        }
        way.push({ x: xGutter + osc(i * 3 + 3), y: medida.topo + medida.altura * 0.85 });
      }

      // morre DENTRO da rede verde do fechamento
      way.push({
        x: larguraTela * 0.88,
        y: medidas[7].topo + medidas[7].altura * 0.15,
      });
      way.push({
        x: larguraTela * 0.7,
        y: medidas[7].topo + medidas[7].altura * 0.45,
      });

      // Catmull-Rom → amostragem densa
      pontosX = [];
      pontosY = [];
      for (let i = 0; i < way.length - 1; i++) {
        const p0 = way[Math.max(0, i - 1)];
        const p1 = way[i];
        const p2 = way[i + 1];
        const p3 = way[Math.min(way.length - 1, i + 2)];
        const passos = Math.max(
          6,
          Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 20),
        );
        for (let s = 0; s < passos; s++) {
          const u = s / passos;
          const u2 = u * u;
          const u3 = u2 * u;
          pontosX.push(
            0.5 *
              (2 * p1.x +
                (-p0.x + p2.x) * u +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
          );
          pontosY.push(
            0.5 *
              (2 * p1.y +
                (-p0.y + p2.y) * u +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
          );
        }
      }
    };
    construir();
    const observadorDoc = new ResizeObserver(construir);
    observadorDoc.observe(document.body);

    // dois círculos em órbita percorrendo o fio
    const orbitas = [
      { s: rng() * 0.9, vel: 1 / 210, raio: 7, fase: 0, cor: "terracota" },
      { s: rng() * 0.9, vel: 1 / 260, raio: 6, fase: Math.PI, cor: "sage" },
    ];

    const desloc = (i: number) => ruido(i * 0.11, 0, 0) * 0; // reservado

    const loop = new LoopCanvas(canvas, (ctx, _largura, altura, t, dt) => {
      const total = pontosX.length;
      if (total < 2) return;
      const rolagem = window.scrollY;
      const de = rolagem - 80;
      const ate = rolagem + altura + 80;

      const ox = (i: number) => ruido(i * 0.09, 0, t / 34) * 6;

      // o fio — um só, sutil; verde sobre claro, off-white dentro do verde
      for (const tom of ["escuro", "claro"] as const) {
        ctx.beginPath();
        let caneta = false;
        for (let i = 0; i < total; i++) {
          const y = pontosY[i];
          if (y < de || y > ate) {
            caneta = false;
            continue;
          }
          const nesteTom = tom === "escuro" ? y < yVerde : y >= yVerde;
          if (!nesteTom) {
            caneta = false;
            continue;
          }
          const x = pontosX[i] + ox(i) + desloc(i);
          if (caneta) ctx.lineTo(x, y - rolagem);
          else {
            ctx.moveTo(x, y - rolagem);
            caneta = true;
          }
        }
        ctx.strokeStyle =
          tom === "escuro" ? cores.verde : "rgba(250, 249, 246, 0.5)";
        ctx.globalAlpha = tom === "escuro" ? 0.32 : 0.2;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // círculos em órbita — giram em volta do fio enquanto o percorrem
      if (dt > 0) {
        for (const orbita of orbitas) {
          orbita.s = (orbita.s + dt * orbita.vel) % 1;
          const indice = orbita.s * (total - 1);
          const i0 = Math.floor(indice);
          const frac = indice - i0;
          const i1 = Math.min(i0 + 1, total - 1);
          const y = pontosY[i0] + (pontosY[i1] - pontosY[i0]) * frac;
          if (y < de || y > ate) continue;
          const x = pontosX[i0] + (pontosX[i1] - pontosX[i0]) * frac + ox(i0);
          const angulo = t * 0.9 + orbita.fase;
          const px = x + Math.cos(angulo) * orbita.raio;
          const py = y - rolagem + Math.sin(angulo) * orbita.raio * 0.45;
          ctx.beginPath();
          ctx.arc(px, py, 2.4, 0, Math.PI * 2);
          ctx.fillStyle =
            orbita.cor === "terracota" ? cores.terracota : cores.sage;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    });

    return () => {
      observadorDoc.disconnect();
      loop.destruir();
    };
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className="pointer-events-none fixed inset-0 z-20 hidden h-full w-full md:block"
      aria-hidden="true"
    />
  );
}
