"use client";

import { useEffect, useRef } from "react";
import {
  LoopCanvas,
  criarFibra,
  criarRuido,
  entre,
  lerCores,
  mulberry32,
  pontoNaFibra,
  tracarFibra,
  type ParamsFibra,
} from "@/lib/fibras";

interface FioVertical {
  fibra: ParamsFibra;
  xEntrada: number;
  xSaida: number;
  peso: number;
  tom: "verde" | "terracota" | "sage" | "claro";
  alfa: number;
}

/**
 * Feixe vertical de fibras (motivo do rio de fibras, em pé): cordas-guia
 * verde e terracota serpenteando entre hairlines, com nós assentados nos
 * encontros — as conversas que geram ideia nova. Presença calibrada para
 * superfície areia.
 */
export default function FeixeVertical({ className }: { className?: string }) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260827);
    const ruido = criarRuido(20260827 ^ 0x5e83);

    const tons: FioVertical["tom"][] = [
      "verde",
      "terracota",
      "verde",
      "sage",
      "sage",
      "sage",
      "claro",
      "claro",
      "claro",
      "claro",
    ];
    const fios: FioVertical[] = tons.map((tom) => ({
      fibra: criarFibra(rng, 9, 20),
      xEntrada: entre(rng, 0.18, 0.82),
      xSaida: entre(rng, 0.18, 0.82),
      peso:
        tom === "verde" ? 3 : tom === "terracota" ? 2.5 : tom === "sage" ? 1.6 : 0.9,
      tom,
      alfa: tom === "claro" ? 0.4 : tom === "sage" ? 0.55 : 0.75,
    }));

    // nós de encontro assentados sobre as cordas-guia
    const contas = [
      { fio: 0, f: 0.26 },
      { fio: 1, f: 0.48 },
      { fio: 2, f: 0.68 },
      { fio: 0, f: 0.82 },
      { fio: 1, f: 0.14 },
    ];

    const corDe = (tom: FioVertical["tom"]) =>
      tom === "verde"
        ? cores.verde
        : tom === "terracota"
          ? cores.terracota
          : tom === "sage"
            ? cores.sage
            : cores.linha;

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t) => {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (const fio of fios) {
        ctx.beginPath();
        tracarFibra(
          ctx,
          ruido,
          fio.fibra,
          fio.xEntrada * largura,
          -12,
          fio.xSaida * largura,
          altura + 12,
          t,
          22,
          0.09,
        );
        ctx.strokeStyle = corDe(fio.tom);
        ctx.globalAlpha = fio.alfa;
        ctx.lineWidth = fio.peso;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nós de encontro — verdes com um coração terracota
      const posicoes = contas.map((conta) => {
        const fio = fios[conta.fio];
        return pontoNaFibra(
          ruido,
          fio.fibra,
          fio.xEntrada * largura,
          -12,
          fio.xSaida * largura,
          altura + 12,
          conta.f,
          t,
          0.09,
        );
      });
      ctx.beginPath();
      posicoes.forEach((pos, i) => {
        const r = (i === 1 ? 8 : 5.5) * (1 + 0.06 * ruido(70 + i * 9, 0, t / 24));
        ctx.moveTo(pos.x + r, pos.y);
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.verde;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(posicoes[1].x, posicoes[1].y, 8, 0, Math.PI * 2);
      ctx.fillStyle = cores.terracota;
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
