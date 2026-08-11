"use client";

import { useEffect, useRef } from "react";
import {
  LoopCanvas,
  criarFibra,
  criarRuido,
  entre,
  lerCores,
  mulberry32,
  tracarFibra,
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * A linha da ruptura (motivo ruptura.png da Opção A, construído vivo):
 * a intervenção chega decidida — seta reta, verde escuro — atinge o ponto
 * terracota (anéis concêntricos ecoando o impacto), e do outro lado a
 * energia sai como fibra ondulante que se desfaz em fragmentos à deriva.
 * Cada linha tem semente própria: três instâncias, três ritmos.
 * `intensa` (hover na linha) acentua o eco e os fragmentos.
 */
export default function LinhaRuptura({
  semente,
  intensa,
  className,
}: {
  semente: number;
  intensa: boolean;
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refIntensa = useRef(intensa);
  refIntensa.current = intensa;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260822 ^ (semente * 7919));
    const ruido = criarRuido(20260822 ^ (semente * 104729));

    const fibraSaida: ParamsFibra = criarFibra(rng, 5, 9);
    const contexto: ParamsFibra[] = [criarFibra(rng, 4, 8), criarFibra(rng, 4, 8)];
    const fragmentos = Array.from({ length: 6 }, (_, i) => ({
      f: 0.05 + i * 0.16,
      canal: entre(rng, 700, 800),
    }));
    const presenca = { v: 0.6 };

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const alvo = refIntensa.current ? 1 : 0.6;
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.4);
      presenca.v += (alvo - presenca.v) * k;
      const alfa = presenca.v;

      const cy = altura * 0.5;
      const nx = largura * 0.42; // o ponto do impacto
      const raioNo = Math.min(altura * 0.16, 15);

      // fibras de contexto varrendo ao fundo, como no original
      ctx.beginPath();
      contexto.forEach((fibra, i) => {
        tracarFibra(
          ctx,
          ruido,
          fibra,
          -8,
          altura * (0.3 + i * 0.4),
          largura * 0.72,
          altura * (0.18 + i * 0.5),
          t,
          14,
          0.14,
        );
      });
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // anéis concêntricos — o eco do impacto, pulsando devagar
      for (let i = 0; i < 3; i++) {
        const fase = ((t / 5 + i / 3) % 1 + 1) % 1;
        const r = raioNo + 6 + fase * raioNo * 2.2;
        ctx.beginPath();
        ctx.arc(nx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = cores.terracota;
        ctx.globalAlpha = (1 - fase) * 0.35 * (0.6 + alfa * 0.5);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // a seta — reta, decidida, sem ondulação: a intervenção
      const ySeta = cy;
      const xInicio = largura * 0.04;
      const xPonta = nx - raioNo - 7;
      ctx.beginPath();
      ctx.moveTo(xInicio, ySeta);
      ctx.lineTo(xPonta - 10, ySeta);
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 4.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xPonta, ySeta);
      ctx.lineTo(xPonta - 13, ySeta - 7);
      ctx.lineTo(xPonta - 13, ySeta + 7);
      ctx.closePath();
      ctx.fillStyle = cores.verde;
      ctx.fill();
      ctx.globalAlpha = 1;

      // o ponto do impacto
      ctx.beginPath();
      ctx.arc(nx, cy, raioNo * (1 + 0.05 * ruido(90, 0, t / 18)), 0, Math.PI * 2);
      ctx.fillStyle = cores.terracota;
      ctx.fill();

      // a fibra que sai ondulando — a energia dissipando
      const xSaida = nx + raioNo;
      const xFim = largura * 0.74;
      ctx.beginPath();
      tracarFibra(ctx, ruido, fibraSaida, xSaida, cy, xFim, cy, t, 14, 0.2);
      ctx.strokeStyle = cores.sage;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // fragmentos à deriva — o que resta
      ctx.beginPath();
      for (const frag of fragmentos) {
        const fx =
          xFim +
          (largura * 0.2) * frag.f +
          ruido(frag.canal, 0, t / 20) * 10;
        const fy =
          cy +
          (frag.f - 0.4) * altura * 0.3 +
          ruido(frag.canal + 40, 8, t / 20) * 12;
        const comp = 7 * (1 - frag.f * 0.6);
        const ang = ruido(frag.canal + 80, 3, t / 24) * 1.2;
        ctx.moveTo(fx - Math.cos(ang) * comp, fy - Math.sin(ang) * comp);
        ctx.lineTo(fx + Math.cos(ang) * comp, fy + Math.sin(ang) * comp);
      }
      ctx.strokeStyle = cores.sage;
      ctx.globalAlpha = (0.5 + alfa * 0.35) * 0.9;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    return () => loop.destruir();
  }, [semente]);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "h-32 w-full"}
      aria-hidden="true"
    />
  );
}
