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
 * A rede de especialistas (motivo rede.png do deck, construído vivo):
 * o trio de nós verdes entrelaçado no centro; satélites terracota — as
 * frentes convidadas — conectados por feixes de fibras que ondulam.
 * Rótulos das frentes em HTML, fixos junto aos satélites.
 */

const TRIO = [
  { nx: 0.46, ny: 0.42 },
  { nx: 0.55, ny: 0.62 },
  { nx: 0.38, ny: 0.66 },
] as const;

const SATELITES = [
  { nx: 0.24, ny: 0.22 },
  { nx: 0.66, ny: 0.16 },
  { nx: 0.1, ny: 0.62 },
  { nx: 0.84, ny: 0.5 },
] as const;

export default function RedeEspecialistas({
  frentes,
  className,
}: {
  frentes: readonly string[];
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260825);
    const ruido = criarRuido(20260825 ^ 0x2c19);

    // trança interna do trio
    const tranca: { a: number; b: number; fibra: ParamsFibra }[] = [];
    for (let a = 0; a < 3; a++) {
      for (let b = a + 1; b < 3; b++) {
        for (let k = 0; k < 4; k++) {
          tranca.push({ a, b, fibra: criarFibra(rng, 8, 16) });
        }
      }
    }
    // feixes satélite → nó do trio mais próximo (7 fibras cada)
    const feixes = SATELITES.map((satelite, s) => {
      let melhor = 0;
      let menor = Infinity;
      TRIO.forEach((no, i) => {
        const d = (no.nx - satelite.nx) ** 2 + (no.ny - satelite.ny) ** 2;
        if (d < menor) {
          menor = d;
          melhor = i;
        }
      });
      return {
        satelite: s,
        alvo: melhor,
        fibras: Array.from({ length: 7 }, () => criarFibra(rng, 6, 14)),
      };
    });

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t) => {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const px = (n: number) => n * largura;
      const py = (n: number) => n * altura;

      // feixes das frentes convidadas
      ctx.beginPath();
      for (const feixe of feixes) {
        const s = SATELITES[feixe.satelite];
        const a = TRIO[feixe.alvo];
        for (const fibra of feixe.fibras) {
          tracarFibra(
            ctx, ruido, fibra,
            px(s.nx), py(s.ny), px(a.nx), py(a.ny),
            t, 14, 0.22,
          );
        }
      }
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.32;
      ctx.lineWidth = 1;
      ctx.stroke();

      // trança do trio
      ctx.beginPath();
      for (const par of tranca) {
        tracarFibra(
          ctx, ruido, par.fibra,
          px(TRIO[par.a].nx), py(TRIO[par.a].ny),
          px(TRIO[par.b].nx), py(TRIO[par.b].ny),
          t, 14, 0.3,
        );
      }
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // nós: trio verde grande, satélites terracota
      ctx.beginPath();
      TRIO.forEach((no, i) => {
        const r = Math.min(largura, altura) * 0.055 *
          (1 + 0.05 * ruido(60 + i * 11, 0, t / 26));
        ctx.moveTo(px(no.nx) + r, py(no.ny));
        ctx.arc(px(no.nx), py(no.ny), r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.verde;
      ctx.fill();

      ctx.beginPath();
      SATELITES.forEach((no, i) => {
        const r = Math.min(largura, altura) * 0.045 *
          (1 + 0.06 * ruido(90 + i * 13, 0, t / 24));
        ctx.moveTo(px(no.nx) + r, py(no.ny));
        ctx.arc(px(no.nx), py(no.ny), r, 0, Math.PI * 2);
      });
      ctx.fillStyle = cores.terracota;
      ctx.fill();
    });

    return () => loop.destruir();
  }, []);

  const posicoesRotulos = [
    "left-[24%] top-[22%] -translate-x-1/2 -translate-y-[calc(100%+18px)]",
    "left-[66%] top-[16%] -translate-x-1/2 -translate-y-[calc(100%+18px)]",
    "left-[10%] top-[62%] -translate-x-1/2 translate-y-[24px]",
    "left-[84%] top-[50%] -translate-x-1/2 translate-y-[24px]",
  ];

  return (
    <div className={className}>
      <canvas
        ref={refCanvas}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      {frentes.map((frente, i) => (
        <span
          key={frente}
          className={`font-montserrat absolute w-max max-w-[180px] text-center text-sm font-medium leading-snug text-grafite ${posicoesRotulos[i]}`}
        >
          {frente}
        </span>
      ))}
    </div>
  );
}
