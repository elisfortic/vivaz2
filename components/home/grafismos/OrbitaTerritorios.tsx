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
 * Órbitas dos territórios (motivo orbitas-v2 do deck, construído vivo):
 * núcleo circulado respirando; quatro nós (verde/terracota alternados)
 * orbitando lentíssimo; fibras cruzando entre vizinhos e mergulhando no
 * núcleo — ativar um território reconfigura o sistema inteiro.
 * Textos (núcleo e 4 títulos) ficam em HTML por cima, fixos nos quadrantes.
 */
export default function OrbitaTerritorios({
  nucleo,
  titulos,
  className,
}: {
  nucleo: string;
  titulos: readonly string[];
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260824);
    const ruido = criarRuido(20260824 ^ 0x6b31);

    const NOS = 4;
    const paresVizinhos: ParamsFibra[][] = Array.from({ length: NOS }, () =>
      Array.from({ length: 3 }, () => criarFibra(rng, 8, 18)),
    );
    const aoNucleo: ParamsFibra[][] = Array.from({ length: NOS }, () =>
      Array.from({ length: 2 }, () => criarFibra(rng, 6, 12)),
    );

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t) => {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const cx = largura / 2;
      const cy = altura / 2;
      const raioOrbita = Math.min(largura, altura) * 0.36;
      const raioNucleo = Math.min(largura, altura) * 0.17;
      const rotacao = (Math.PI * 2 * t) / 120 - Math.PI / 4;

      const posicao = (i: number) => {
        const angulo = rotacao + (Math.PI * 2 * i) / NOS;
        const r = raioOrbita * (1 + 0.04 * ruido(i * 19.3, 0, t / 30));
        return { x: cx + Math.cos(angulo) * r, y: cy + Math.sin(angulo) * r };
      };

      // fibras entre vizinhos — pétalas cruzando por fora do núcleo
      ctx.beginPath();
      for (let i = 0; i < NOS; i++) {
        const a = posicao(i);
        const b = posicao((i + 1) % NOS);
        for (const fibra of paresVizinhos[i]) {
          tracarFibra(ctx, ruido, fibra, a.x, a.y, b.x, b.y, t, 18, 0.34);
        }
      }
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.stroke();

      // fibras mergulhando na borda do núcleo
      ctx.beginPath();
      for (let i = 0; i < NOS; i++) {
        const p = posicao(i);
        const anguloAoCentro = Math.atan2(cy - p.y, cx - p.x);
        const bx = cx - Math.cos(anguloAoCentro) * raioNucleo;
        const by = cy - Math.sin(anguloAoCentro) * raioNucleo;
        for (const fibra of aoNucleo[i]) {
          tracarFibra(ctx, ruido, fibra, p.x, p.y, bx, by, t, 12, 0.2);
        }
      }
      ctx.strokeStyle = cores.terracota;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // núcleo — o círculo firme que tudo orbita
      const respiro = 1 + 0.025 * ruido(77, 0, t / 26);
      ctx.beginPath();
      ctx.arc(cx, cy, raioNucleo * respiro, 0, Math.PI * 2);
      ctx.strokeStyle = cores.verde;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // os quatro nós, alternando verde e terracota
      for (const cor of ["verde", "terracota"] as const) {
        ctx.beginPath();
        for (let i = 0; i < NOS; i++) {
          if ((i % 2 === 0 ? "verde" : "terracota") !== cor) continue;
          const p = posicao(i);
          const r = 11 * (1 + 0.06 * ruido(140 + i * 9, 0, t / 24));
          ctx.moveTo(p.x + r, p.y);
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = cor === "verde" ? cores.verde : cores.terracota;
        ctx.fill();
      }
    });

    return () => loop.destruir();
  }, []);

  const posicoesTitulos = [
    "right-[4%] top-[10%] text-left",
    "bottom-[10%] right-[4%] text-left",
    "bottom-[10%] left-[4%] text-right",
    "left-[4%] top-[10%] text-right",
  ];

  return (
    <div className={className}>
      <canvas
        ref={refCanvas}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      <span className="font-montserrat absolute left-1/2 top-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2 text-center text-base font-medium leading-snug text-verde md:text-lg">
        {nucleo}
      </span>
      {titulos.map((titulo, i) => (
        <span
          key={titulo}
          className={`font-montserrat absolute w-[30%] text-sm font-medium leading-snug text-verde md:text-base ${posicoesTitulos[i]}`}
        >
          <span className="text-terracota">{`0${i + 1}`}</span> · {titulo}
        </span>
      ))}
    </div>
  );
}
