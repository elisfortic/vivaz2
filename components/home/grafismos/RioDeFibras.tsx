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

interface Cordao {
  fibra: ParamsFibra;
  /** altura base na faixa (0..1) e inclinação até a saída */
  yEntrada: number;
  ySaida: number;
  espessura: number;
  tom: "verde" | "sage" | "terracota" | "claro";
  alfa: number;
}

/**
 * O rio de fibras (motivo do deck: cordas grossas e fios finos entrelaçados
 * atravessando a composição, com nós assentados sobre as cordas). Faixa
 * horizontal viva — a governança fluida em imagem.
 */
export default function RioDeFibras({ className }: { className?: string }) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260818);
    const ruido = criarRuido(20260818 ^ 0x61e3);

    const tons: Cordao["tom"][] = [
      "verde",
      "sage",
      "sage",
      "terracota",
      "verde",
      "sage",
      "terracota",
      "claro",
      "claro",
      "claro",
      "claro",
      "sage",
    ];
    const cordoes: Cordao[] = tons.map((tom, i) => ({
      fibra: criarFibra(rng, 8, 20),
      yEntrada: entre(rng, 0.15, 0.85),
      ySaida: entre(rng, 0.15, 0.85),
      espessura:
        tom === "verde"
          ? 3
          : tom === "terracota"
            ? i === 6
              ? 1.2
              : 2.4
            : tom === "sage"
              ? 1.8
              : 0.9,
      tom,
      alfa: tom === "claro" ? 0.5 : 0.75,
    }));

    // fios verticais leves cruzando a trama — é o que faz tecido, não listras
    const verticais = Array.from({ length: 7 }, () => ({
      fibra: criarFibra(rng, 4, 9),
      x: entre(rng, 0.05, 0.95),
      deriva: entre(rng, -0.04, 0.04),
    }));

    // nós assentados sobre três cordões, como contas na corda
    const contas = [
      { cordao: 0, f: 0.24 },
      { cordao: 3, f: 0.52 },
      { cordao: 4, f: 0.78 },
      { cordao: 1, f: 0.64 },
    ];

    const corDe = (tom: Cordao["tom"]) =>
      tom === "verde"
        ? cores.verde
        : tom === "sage"
          ? cores.sage
          : tom === "terracota"
            ? cores.terracota
            : cores.linha;

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t) => {
      // verticais primeiro — ficam por trás da trama horizontal
      ctx.beginPath();
      for (const vertical of verticais) {
        tracarFibra(
          ctx,
          ruido,
          vertical.fibra,
          vertical.x * largura,
          -8,
          (vertical.x + vertical.deriva) * largura,
          altura + 8,
          t,
          10,
          0.12,
        );
      }
      ctx.strokeStyle = cores.sage;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (const cordao of cordoes) {
        ctx.beginPath();
        tracarFibra(
          ctx,
          ruido,
          cordao.fibra,
          -12,
          cordao.yEntrada * altura,
          largura + 12,
          cordao.ySaida * altura,
          t,
          26,
          0.05,
        );
        ctx.strokeStyle = corDe(cordao.tom);
        ctx.globalAlpha = cordao.alfa;
        ctx.lineWidth = cordao.espessura;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.beginPath();
      const posicoes: { x: number; y: number; tom: Cordao["tom"] }[] = [];
      for (const conta of contas) {
        const cordao = cordoes[conta.cordao];
        const ponto = pontoNaFibra(
          ruido,
          cordao.fibra,
          -12,
          cordao.yEntrada * altura,
          largura + 12,
          cordao.ySaida * altura,
          conta.f,
          t,
          0.05,
        );
        posicoes.push({ ...ponto, tom: cordao.tom });
      }
      for (const pos of posicoes) {
        ctx.moveTo(pos.x + 4.5, pos.y);
        ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
      }
      ctx.fillStyle = cores.verde;
      ctx.fill();
      // miolo terracota numa das contas
      ctx.beginPath();
      ctx.arc(posicoes[1].x, posicoes[1].y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = cores.terracota;
      ctx.fill();
    });

    return () => loop.destruir();
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "h-52 w-full"}
      aria-hidden="true"
    />
  );
}
