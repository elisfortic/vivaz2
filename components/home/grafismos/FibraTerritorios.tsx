"use client";

import { useEffect, useRef } from "react";
import {
  LoopCanvas,
  criarFibra,
  criarRuido,
  lerCores,
  mulberry32,
  pontoNaFibra,
  tracarFibra,
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * Âncoras normalizadas da fibra que costura os quatro territórios —
 * entra pelo 01, passa pelo 02, desce ao 03 e sai pelo 04, com um nó em
 * cada. "Mexer em uma parte sempre move as outras", em imagem.
 * As posições correspondem aos quatro blocos do grid 2x2.
 */
const ANCORAS = [
  { nx: 0.035, ny: 0.1 },
  { nx: 0.525, ny: 0.16 },
  { nx: 0.035, ny: 0.66 },
  { nx: 0.525, ny: 0.72 },
] as const;

export default function FibraTerritorios({
  className,
}: {
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260819);
    const ruido = criarRuido(20260819 ^ 0x9c47);

    // três trechos: 01→02, 02→03, 03→04 (+ entrada e saída sangrando)
    const trechos: ParamsFibra[] = Array.from({ length: 5 }, () =>
      criarFibra(rng, 8, 16),
    );
    const particula = { f: 0, dur: 26 };

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const px = (n: number) => n * largura;
      const py = (n: number) => n * altura;
      const caminho: [number, number, number, number][] = [
        [px(-0.06), py(-0.1), px(ANCORAS[0].nx), py(ANCORAS[0].ny)],
        [px(ANCORAS[0].nx), py(ANCORAS[0].ny), px(ANCORAS[1].nx), py(ANCORAS[1].ny)],
        [px(ANCORAS[1].nx), py(ANCORAS[1].ny), px(ANCORAS[2].nx), py(ANCORAS[2].ny)],
        [px(ANCORAS[2].nx), py(ANCORAS[2].ny), px(ANCORAS[3].nx), py(ANCORAS[3].ny)],
        [px(ANCORAS[3].nx), py(ANCORAS[3].ny), px(1.06), py(1.08)],
      ];

      ctx.beginPath();
      caminho.forEach(([ax, ay, bx, by], i) => {
        tracarFibra(ctx, ruido, trechos[i], ax, ay, bx, by, t, 16, 0.1);
      });
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // partícula percorrendo os quatro territórios em ciclo
      if (dt > 0) {
        particula.f = (particula.f + dt / particula.dur) % 1;
        const total = caminho.length;
        const indice = Math.min(
          total - 1,
          Math.floor(particula.f * total),
        );
        const fLocal = particula.f * total - indice;
        const [ax, ay, bx, by] = caminho[indice];
        const ponto = pontoNaFibra(
          ruido,
          trechos[indice],
          ax,
          ay,
          bx,
          by,
          fLocal,
          t,
          0.1,
        );
        ctx.beginPath();
        ctx.arc(ponto.x, ponto.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = cores.terracota;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // um nó em cada território
      ctx.beginPath();
      ANCORAS.forEach((ancora, i) => {
        const r = 7 * (1 + 0.07 * ruido(70 + i * 9, 0, t / 26));
        ctx.moveTo(px(ancora.nx) + r, py(ancora.ny));
        ctx.arc(px(ancora.nx), py(ancora.ny), r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.verde;
      ctx.fill();
    });

    return () => loop.destruir();
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "absolute inset-0 h-full w-full"}
      aria-hidden="true"
    />
  );
}
