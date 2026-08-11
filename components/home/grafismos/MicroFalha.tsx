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

export type TipoFalha = "grade" | "preso" | "fragmenta";

/**
 * Micro-organismos das três falhas — cada canvas é a metáfora viva de uma:
 * - grade:     a estrutura rígida parada; a cultura (fibras) segue fluindo
 *              por ela do seu próprio jeito — mexer na grade não a move.
 * - preso:     fibras tentam alcançar as bordas e são puxadas de volta ao
 *              centro — a decisão que não se distribui.
 * - fragmenta: a fibra viaja, encontra o ponto e se desfaz em fragmentos —
 *              o valor que não chega à avaliação. Ciclo lento de romper e
 *              recompor.
 * `intensa` (hover na coluna) aumenta presença sem acelerar o ritmo.
 */
export default function MicroFalha({
  tipo,
  intensa,
  className,
}: {
  tipo: TipoFalha;
  intensa: boolean;
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refIntensa = useRef(intensa);
  refIntensa.current = intensa;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const semente = 20260815 ^ (tipo.length * 7919);
    const cores = lerCores(canvas);
    const rng = mulberry32(semente);
    const ruido = criarRuido(semente ^ 0x5b3d);

    const fibras: ParamsFibra[] = Array.from({ length: 6 }, () =>
      criarFibra(rng, 5, 12),
    );
    const presenca = { v: 0.6 };

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const alvo = refIntensa.current ? 1 : 0.6;
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.4);
      presenca.v += (alvo - presenca.v) * k;
      const alfa = presenca.v;

      if (tipo === "grade") {
        // grade rígida — imóvel de propósito
        ctx.beginPath();
        for (let i = 1; i <= 4; i++) {
          const x = (largura / 5) * i;
          ctx.moveTo(x, altura * 0.08);
          ctx.lineTo(x, altura * 0.92);
        }
        for (let j = 1; j <= 2; j++) {
          const y = (altura / 3) * j;
          ctx.moveTo(largura * 0.04, y);
          ctx.lineTo(largura * 0.96, y);
        }
        ctx.strokeStyle = cores.grafite;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // a cultura fluindo através, viva
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const y = altura * (0.25 + i * 0.25);
          tracarFibra(
            ctx,
            ruido,
            fibras[i],
            -8,
            y,
            largura + 8,
            y,
            t,
            18,
            0.1,
          );
        }
        ctx.strokeStyle = cores.sage;
        ctx.globalAlpha = 0.5 + alfa * 0.4;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }

      if (tipo === "preso") {
        const cx = largura / 2;
        const cy = altura * 0.52;
        const alcanceMax = Math.min(largura * 0.62, altura * 0.9);

        ctx.beginPath();
        const pontas: { x: number; y: number }[] = [];
        for (let i = 0; i < 6; i++) {
          const angulo = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          // tenta alcançar, é puxada de volta — cada fibra no próprio tempo
          const esforco =
            0.55 + 0.4 * ruido(50 + i * 11, 0, t / fibras[i].periodo);
          const px = cx + Math.cos(angulo) * alcanceMax * esforco;
          const py = cy + Math.sin(angulo) * alcanceMax * esforco * 0.55;
          pontas.push({ x: px, y: py });
          tracarFibra(ctx, ruido, fibras[i], cx, cy, px, py, t, 12, 0.16);
        }
        ctx.strokeStyle = cores.verde;
        ctx.globalAlpha = 0.45 + alfa * 0.35;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // pontas que não chegam
        ctx.beginPath();
        for (const ponta of pontas) {
          ctx.moveTo(ponta.x + 2.5, ponta.y);
          ctx.arc(ponta.x, ponta.y, 2.5, 0, Math.PI * 2);
        }
        ctx.fillStyle = cores.terracota;
        ctx.globalAlpha = 0.5 + alfa * 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;

        // o centro que não solta
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          10 * (1 + 0.05 * ruido(99, 0, t / 24)),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = cores.verde;
        ctx.fill();
        return;
      }

      // fragmenta
      const ax = -6;
      const ay = altura * 0.6;
      const bx = largura + 6;
      const by = altura * 0.4;
      const quebra = 0.6;
      // ciclo lento: inteira ↔ fragmentada (~40s)
      const cicloBruto = ruido(300, 0, t / 40);
      const fator = Math.min(1, Math.max(0, (cicloBruto + 0.4) / 0.8));

      const dx = bx - ax;
      const dy = by - ay;
      const comp = Math.hypot(dx, dy) || 1;
      const perpX = -dy / comp;
      const perpY = dx / comp;
      const ampForma = Math.min(comp * 0.12, 52);
      const SEG = 22;

      const pontoEm = (f: number) => {
        const respiracao =
          0.75 + 0.35 * ruido(fibras[0].canal + 7.3, 0, t / fibras[0].periodo);
        const formaS =
          (fibras[0].curvaA * 0.6 * Math.sin(Math.PI * f) +
            fibras[0].curvaB * Math.sin(2 * Math.PI * f)) *
          respiracao *
          ampForma;
        const envelope = Math.sin(Math.PI * f);
        const onda =
          ruido(
            fibras[0].canal,
            f * 2.2 - t / fibras[0].periodoViagem,
            t / (fibras[0].periodo * 2),
          ) *
          fibras[0].amp *
          envelope;
        const d = formaS + onda;
        return { x: ax + dx * f + perpX * d, y: ay + dy * f + perpY * d };
      };

      // trecho inteiro (até a quebra)
      ctx.beginPath();
      const inicio = pontoEm(0);
      ctx.moveTo(inicio.x, inicio.y);
      for (let s = 1; s <= SEG * quebra; s++) {
        const ponto = pontoEm(s / SEG);
        ctx.lineTo(ponto.x, ponto.y);
      }
      ctx.strokeStyle = cores.sage;
      ctx.globalAlpha = 0.6 + alfa * 0.3;
      ctx.lineWidth = 2;
      ctx.stroke();

      // além da quebra: fragmentos que se dispersam conforme o fator
      ctx.beginPath();
      for (let s = Math.ceil(SEG * quebra); s < SEG; s += 2) {
        const f1 = s / SEG;
        const f2 = (s + 1) / SEG;
        const desvioX =
          ruido(400 + s * 3, 0, t / 30) * 22 * fator;
        const desvioY =
          ruido(430 + s * 3, 20, t / 30) * 18 * fator;
        const p1 = pontoEm(f1);
        const p2 = pontoEm(f2);
        ctx.moveTo(p1.x + desvioX, p1.y + desvioY);
        ctx.lineTo(p2.x + desvioX, p2.y + desvioY);
      }
      ctx.globalAlpha = (0.6 + alfa * 0.3) * (1 - fator * 0.55);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // o ponto onde rompe
      const pontoQuebra = pontoEm(quebra);
      ctx.beginPath();
      ctx.arc(
        pontoQuebra.x,
        pontoQuebra.y,
        6 * (1 + 0.2 * fator),
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = cores.terracota;
      ctx.globalAlpha = 0.75 + fator * 0.25;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    return () => loop.destruir();
  }, [tipo]);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "h-36 w-full"}
      aria-hidden="true"
    />
  );
}
