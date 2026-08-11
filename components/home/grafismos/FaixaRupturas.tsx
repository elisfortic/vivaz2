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
 * A faixa das rupturas (motivo do slide "Por que falham" do deck):
 * a maioria das fibras atravessa; QUATRO rompem nas divisórias — vão real,
 * pontas soltas com nós, reentrada deslocada no eixo Y, fragmentos à
 * deriva. O contraste entre o que passa e o que quebra é o significado.
 * Sangra a largura toda (a seção aplica máscara de fade nas bordas).
 * `intensa` (0–2, coluna sob hover) acentua o terço correspondente.
 */
export default function FaixaRupturas({
  intensa,
  className,
  style,
}: {
  intensa: number | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refIntensa = useRef<number | null>(intensa);
  refIntensa.current = intensa;

  // divisórias alinhadas aos gutters do grid de 3 colunas (máx-w-5xl @1440)
  const CORTES = [0.383, 0.617];

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
      rompe: boolean;
      /** deslocamento Y da reentrada após cada ruptura (px) */
      desvios: [number, number];
    }
    const fios: Fio[] = Array.from({ length: 9 }, (_, i) => ({
      fibra: criarFibra(rng, 7, 16),
      yEntrada: entre(rng, 0.12, 0.88),
      ySaida: entre(rng, 0.12, 0.88),
      peso: i < 2 ? 2.2 : i < 6 ? 1.5 : 1,
      alfa: i < 2 ? 0.65 : i < 6 ? 0.38 : 0.18,
      rompe: i === 1 || i === 3 || i === 5 || i === 7,
      desvios: [
        (rng() < 0.5 ? -1 : 1) * entre(rng, 8, 14),
        (rng() < 0.5 ? -1 : 1) * entre(rng, 8, 14),
      ],
    }));

    const brilho = [0.6, 0.6, 0.6];

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.4);
      for (let z = 0; z < 3; z++) {
        const alvo = refIntensa.current === z ? 1 : 0.6;
        brilho[z] += (alvo - brilho[z]) * k;
      }

      // divisórias — presentes, ultrapassando a faixa como no deck
      ctx.beginPath();
      for (const corte of CORTES) {
        ctx.moveTo(corte * largura, altura * 0.02);
        ctx.lineTo(corte * largura, altura * 0.98);
      }
      ctx.strokeStyle = cores.grafite;
      ctx.globalAlpha = 0.24;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const pontas: { x: number; y: number }[] = [];

      for (const fio of fios) {
        const ax = -10;
        const ay = fio.yEntrada * altura;
        const bx = largura + 10;
        const by = fio.ySaida * altura;

        if (!fio.rompe) {
          // atravessa inteira
          ctx.beginPath();
          const passos = 26;
          for (let s = 0; s <= passos; s++) {
            const ponto = pontoNaFibra(
              ruido, fio.fibra, ax, ay, bx, by, s / passos, t, 0.09,
            );
            if (s === 0) ctx.moveTo(ponto.x, ponto.y);
            else ctx.lineTo(ponto.x, ponto.y);
          }
          ctx.strokeStyle = cores.verde;
          ctx.globalAlpha = fio.alfa;
          ctx.lineWidth = fio.peso;
          ctx.stroke();
          continue;
        }

        // rompe: vão real de ~30px em cada divisória + reentrada deslocada
        const zonas: [number, number][] = [];
        let inicio = 0;
        for (const corte of CORTES) {
          const gap =
            (30 + 8 * ruido(fio.fibra.canal + corte * 91, 3, t / 22)) /
            largura;
          zonas.push([inicio, corte - gap / 2]);
          inicio = corte + gap / 2;
        }
        zonas.push([inicio, 1]);

        zonas.forEach(([f0, f1], zona) => {
          const desvio =
            zona === 0
              ? 0
              : zona === 1
                ? fio.desvios[0]
                : fio.desvios[0] + fio.desvios[1];
          ctx.beginPath();
          const passos = 10;
          let primeiro: { x: number; y: number } | null = null;
          let ultimo: { x: number; y: number } | null = null;
          for (let s = 0; s <= passos; s++) {
            const f = f0 + ((f1 - f0) * s) / passos;
            const ponto = pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, f, t, 0.09);
            const y = ponto.y + desvio;
            if (s === 0) {
              ctx.moveTo(ponto.x, y);
              primeiro = { x: ponto.x, y };
            } else ctx.lineTo(ponto.x, y);
            ultimo = { x: ponto.x, y };
          }
          ctx.strokeStyle = cores.verde;
          ctx.globalAlpha =
            fio.alfa * (0.7 + brilho[Math.min(zona, 2)] * 0.45);
          ctx.lineWidth = fio.peso;
          ctx.stroke();

          // pontas soltas nos dois lados de cada vão
          if (f1 < 1 && ultimo) pontas.push(ultimo);
          if (f0 > 0 && primeiro) pontas.push(primeiro);
        });

        // fragmentos à deriva dentro dos vãos
        ctx.beginPath();
        CORTES.forEach((corte, ci) => {
          const desvX = ruido(fio.fibra.canal + 200 + ci * 31, 0, t / 26) * 12;
          const desvY = ruido(fio.fibra.canal + 230 + ci * 31, 9, t / 26) * 10;
          const meio = pontoNaFibra(ruido, fio.fibra, ax, ay, bx, by, corte, t, 0.09);
          ctx.moveTo(meio.x + desvX - 5, meio.y + desvY);
          ctx.lineTo(meio.x + desvX + 5, meio.y + desvY + 2);
        });
        ctx.strokeStyle = cores.sage;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // nós nas pontas rompidas — onde o movimento morre
      ctx.beginPath();
      for (const ponta of pontas) {
        ctx.moveTo(ponta.x + 5, ponta.y);
        ctx.arc(ponta.x, ponta.y, 5, 0, Math.PI * 2);
      }
      ctx.fillStyle = cores.verde;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      // um ponto terracota por ruptura — o custo, marcado
      ctx.beginPath();
      CORTES.forEach((corte, i) => {
        const y = altura * (0.36 + i * 0.26);
        const r = 8 + 1 * ruido(600 + i * 17, 2, t / 14);
        ctx.moveTo(corte * largura + r, y);
        ctx.arc(corte * largura, y, r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.terracota;
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    return () => loop.destruir();
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "h-56 w-full"}
      style={style}
      aria-hidden="true"
    />
  );
}
