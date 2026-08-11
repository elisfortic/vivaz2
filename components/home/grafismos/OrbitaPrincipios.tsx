"use client";

import { useEffect, useRef } from "react";
import {
  LoopCanvas,
  criarFibra,
  criarRuido,
  lerCores,
  mulberry32,
  tracarFibra,
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * O anel dos princípios (motivo como-movemos/modo-atuar do deck, construído
 * vivo): 8 nós em círculo, feixes de fibras entrelaçadas entre nós vizinhos,
 * o anel inteiro girando devagar (~100s por volta), feixes respirando.
 * `ativo` (0–3, quadrante do princípio sob hover) acende o arco daquele
 * quadrante: 0 = superior-esquerdo, 1 = superior-direito,
 * 2 = inferior-esquerdo, 3 = inferior-direito.
 */
export default function OrbitaPrincipios({
  ativo,
  className,
}: {
  ativo: number | null;
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAtivo = useRef<number | null>(ativo);
  refAtivo.current = ativo;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260816);
    const ruido = criarRuido(20260816 ^ 0x44f1);

    const NOS = 8;
    // 5 fibras entre cada par de nós vizinhos
    const feixes: ParamsFibra[][] = Array.from({ length: NOS }, () =>
      Array.from({ length: 5 }, () => criarFibra(rng, 6, 15)),
    );
    const brilho = new Array(4).fill(0.55);

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const cx = largura / 2;
      const cy = altura / 2;
      const raio = Math.min(largura, altura) * 0.36;
      const rotacao = (Math.PI * 2 * t) / 100;

      const posicao = (i: number) => {
        const angulo = rotacao + (Math.PI * 2 * i) / NOS - Math.PI / 2;
        // o círculo respira — nunca perfeitamente redondo
        const r = raio * (1 + 0.045 * ruido(i * 23.1, 0, t / 30));
        return {
          x: cx + Math.cos(angulo) * r,
          y: cy + Math.sin(angulo) * r,
        };
      };

      const quadranteDe = (x: number, y: number) =>
        (y < cy ? 0 : 2) + (x < cx ? 0 : 1);

      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.35);
      for (let q = 0; q < 4; q++) {
        const alvo =
          refAtivo.current === null ? 0.55 : refAtivo.current === q ? 1 : 0.2;
        brilho[q] += (alvo - brilho[q]) * k;
      }

      // arcos: um lote de fibras por segmento (alpha do quadrante do meio)
      for (let i = 0; i < NOS; i++) {
        const a = posicao(i);
        const b = posicao((i + 1) % NOS);
        const q = quadranteDe((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.beginPath();
        for (const fibra of feixes[i]) {
          tracarFibra(ctx, ruido, fibra, a.x, a.y, b.x, b.y, t, 12, 0.3);
        }
        ctx.strokeStyle = cores.verde;
        ctx.globalAlpha = 0.18 + brilho[q] * 0.45;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nós — alternando verde e terracota, respirando
      for (const cor of ["verde", "terracota"] as const) {
        ctx.beginPath();
        for (let i = 0; i < NOS; i++) {
          if ((i % 2 === 0 ? "verde" : "terracota") !== cor) continue;
          const ponto = posicao(i);
          const r = 7.5 * (1 + 0.07 * ruido(140 + i * 9, 0, t / 26));
          ctx.moveTo(ponto.x + r, ponto.y);
          ctx.arc(ponto.x, ponto.y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = cor === "verde" ? cores.verde : cores.terracota;
        ctx.fill();
      }
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
