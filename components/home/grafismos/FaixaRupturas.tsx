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
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * A faixa das rupturas (motivo do slide "Por que falham" do deck,
 * construído vivo): fibras fluem pela faixa inteira e ROMPEM nas duas
 * divisórias entre as colunas — pontas com nós, lacuna respirando,
 * fragmentos à deriva no vão. Um sistema que tenta atravessar e não
 * consegue: o porquê da falha, em imagem.
 * `intensa` (0–2, coluna sob hover) acentua a ruptura daquele terço.
 */
export default function FaixaRupturas({
  intensa,
  className,
}: {
  intensa: number | null;
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refIntensa = useRef<number | null>(intensa);
  refIntensa.current = intensa;

  // as duas divisórias, em fração da largura (alinhadas ao grid de 3 colunas)
  const CORTES = [0.345, 0.675];

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260820);
    const ruido = criarRuido(20260820 ^ 0x77b1);

    interface Fio {
      fibra: ParamsFibra;
      yEntrada: number;
      ySaida: number;
      peso: number;
      alfa: number;
    }
    const fios: Fio[] = Array.from({ length: 9 }, (_, i) => ({
      fibra: criarFibra(rng, 7, 16),
      yEntrada: entre(rng, 0.14, 0.86),
      ySaida: entre(rng, 0.14, 0.86),
      peso: i < 2 ? 2.8 : i < 6 ? 1.7 : 1,
      alfa: i < 2 ? 0.7 : 0.5,
    }));

    const brilho = [0.6, 0.6, 0.6];

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.4);
      for (let z = 0; z < 3; z++) {
        const alvo = refIntensa.current === z ? 1 : 0.6;
        brilho[z] += (alvo - brilho[z]) * k;
      }

      // divisórias discretas, como no deck
      ctx.beginPath();
      for (const corte of CORTES) {
        ctx.moveTo(corte * largura, altura * 0.06);
        ctx.lineTo(corte * largura, altura * 0.94);
      }
      ctx.strokeStyle = cores.grafite;
      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const pontas: { x: number; y: number }[] = [];

      for (const fio of fios) {
        const ax = -10;
        const ay = fio.yEntrada * altura;
        const bx = largura + 10;
        const by = fio.ySaida * altura;

        // cada divisória tem lacuna própria que respira (~0.5–3% da largura)
        const zonas: [number, number][] = [];
        let inicio = 0;
        for (const corte of CORTES) {
          const respiro =
            0.022 + 0.014 * ruido(fio.fibra.canal + corte * 91, 3, t / 22);
          zonas.push([inicio, corte - respiro]);
          inicio = corte + respiro;
        }
        zonas.push([inicio, 1]);

        zonas.forEach(([f0, f1], zona) => {
          ctx.beginPath();
          const passos = 10;
          for (let s = 0; s <= passos; s++) {
            const f = f0 + ((f1 - f0) * s) / passos;
            const ponto = pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, f, t, 0.09);
            if (s === 0) ctx.moveTo(ponto.x, ponto.y);
            else ctx.lineTo(ponto.x, ponto.y);
          }
          ctx.strokeStyle = cores.verde;
          ctx.globalAlpha = fio.alfa * (0.6 + brilho[Math.min(zona, 2)] * 0.5);
          ctx.lineWidth = fio.peso;
          ctx.stroke();

          // pontas nos dois lados de cada ruptura
          if (f1 < 1) {
            pontas.push(pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, f1, t, 0.09));
          }
          if (f0 > 0) {
            pontas.push(pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, f0, t, 0.09));
          }
        });

        // fragmentos à deriva dentro de cada lacuna
        ctx.beginPath();
        CORTES.forEach((corte, ci) => {
          const desvX = ruido(fio.fibra.canal + 200 + ci * 31, 0, t / 26) * 14;
          const desvY = ruido(fio.fibra.canal + 230 + ci * 31, 9, t / 26) * 12;
          const meio = pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, corte, t, 0.09);
          ctx.moveTo(meio.x + desvX - 5, meio.y + desvY);
          ctx.lineTo(meio.x + desvX + 5, meio.y + desvY + 2);
        });
        ctx.strokeStyle = cores.sage;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // nós nas pontas rompidas — onde o movimento morre
      ctx.beginPath();
      for (const ponta of pontas) {
        ctx.moveTo(ponta.x + 2.6, ponta.y);
        ctx.arc(ponta.x, ponta.y, 2.6, 0, Math.PI * 2);
      }
      ctx.fillStyle = cores.verde;
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;

      // um ponto terracota por ruptura — o custo, marcado
      ctx.beginPath();
      CORTES.forEach((corte, i) => {
        const y = altura * (0.34 + i * 0.3);
        const r = 4.4 + 0.9 * ruido(600 + i * 17, 2, t / 14);
        ctx.moveTo(corte * largura + r, y);
        ctx.arc(corte * largura, y, r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.terracota;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    return () => loop.destruir();
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "h-44 w-full"}
      aria-hidden="true"
    />
  );
}
