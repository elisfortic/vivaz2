"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import OrganogramaFantasma from "@/components/home/OrganogramaFantasma";
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
 * O argumento central em um quadro (motivo organograma-v3 do deck,
 * construído vivo): o organograma fantasma parado ao fundo; por cima,
 * a rede real — nós verde e terracota conectados por fibras que ignoram
 * os níveis e não param de se mover. Três rótulos nomeiam o que se vê:
 * A Ilusão, A Realidade, O Risco (dizeres do deck da cliente).
 */

const NOS = [
  { nx: 0.2, ny: 0.62, cor: "terracota", r: 7 },
  { nx: 0.3, ny: 0.78, cor: "terracota", r: 5 },
  { nx: 0.33, ny: 0.52, cor: "verde", r: 9 },
  { nx: 0.42, ny: 0.68, cor: "terracota", r: 6 },
  { nx: 0.48, ny: 0.38, cor: "verde", r: 10 },
  { nx: 0.52, ny: 0.82, cor: "verde", r: 6 },
  { nx: 0.6, ny: 0.56, cor: "verde", r: 12 },
  { nx: 0.62, ny: 0.3, cor: "terracota", r: 6 },
  { nx: 0.72, ny: 0.72, cor: "terracota", r: 5 },
  { nx: 0.74, ny: 0.14, cor: "terracota", r: 7 },
  { nx: 0.82, ny: 0.44, cor: "verde", r: 7 },
] as const;

/** conexões atravessando níveis — nenhuma segue a hierarquia */
const LIGACOES: [number, number][] = [
  [0, 2],
  [1, 3],
  [2, 4],
  [2, 6],
  [3, 6],
  [4, 7],
  [4, 6],
  [5, 6],
  [6, 8],
  [6, 10],
  [7, 9],
  [9, 10],
  [0, 5],
];

const ROTULOS = [
  { texto: "A Ilusão", no: 9, dx: 0.06, dy: -0.06, alinhamento: "left" },
  { texto: "A Realidade", no: 6, dx: 0.12, dy: 0.02, alinhamento: "left" },
  { texto: "O Risco", no: 1, dx: -0.04, dy: 0.12, alinhamento: "right" },
] as const;

export default function SistemaVsOrganograma({
  className,
}: {
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260814);
    const ruido = criarRuido(20260814 ^ 0x3d2b);
    const fibras: ParamsFibra[] = LIGACOES.map(() => criarFibra(rng, 6, 14));

    // deriva suave de cada nó
    const canais = NOS.map((_, i) => ({ cx: i * 13.7, cy: 100 + i * 9.3 }));

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t) => {
      const posicoes = NOS.map((no, i) => ({
        x:
          no.nx * largura +
          ruido(canais[i].cx, 0, t / 32) * largura * 0.016,
        y:
          no.ny * altura +
          ruido(canais[i].cy, 40, t / 32) * altura * 0.02,
      }));

      // fibras vivas atravessando o organograma
      ctx.beginPath();
      LIGACOES.forEach(([a, b], i) => {
        tracarFibra(
          ctx,
          ruido,
          fibras[i],
          posicoes[a].x,
          posicoes[a].y,
          posicoes[b].x,
          posicoes[b].y,
          t,
          14,
          0.2,
        );
      });
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // linhas-guia dos rótulos
      ctx.beginPath();
      for (const rotulo of ROTULOS) {
        const alvo = posicoes[rotulo.no];
        const lx = (NOS[rotulo.no].nx + rotulo.dx) * largura;
        const ly = (NOS[rotulo.no].ny + rotulo.dy) * altura;
        ctx.moveTo(lx, ly);
        ctx.quadraticCurveTo(
          (lx + alvo.x) / 2,
          ly,
          alvo.x,
          alvo.y,
        );
      }
      ctx.strokeStyle = cores.grafite;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // nós — dois lotes por cor, com respiração sutil
      for (const cor of ["verde", "terracota"] as const) {
        ctx.beginPath();
        NOS.forEach((no, i) => {
          if (no.cor !== cor) return;
          const r = no.r * (1 + 0.06 * ruido(200 + i * 7, 0, t / 26));
          ctx.moveTo(posicoes[i].x + r, posicoes[i].y);
          ctx.arc(posicoes[i].x, posicoes[i].y, r, 0, Math.PI * 2);
        });
        ctx.fillStyle = cor === "verde" ? cores.verde : cores.terracota;
        ctx.fill();
      }
    });

    return () => loop.destruir();
  }, []);

  return (
    <div className={className}>
      <OrganogramaFantasma className="absolute inset-0 h-full w-full" />
      <canvas
        ref={refCanvas}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      {ROTULOS.map((rotulo, i) => (
        <motion.span
          key={rotulo.texto}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.5 + i * 0.45 }}
          className="font-montserrat absolute text-sm font-semibold text-verde md:text-base"
          style={{
            left: `${(NOS[rotulo.no].nx + rotulo.dx) * 100}%`,
            top: `${(NOS[rotulo.no].ny + rotulo.dy) * 100}%`,
            transform:
              rotulo.alinhamento === "right"
                ? "translate(-100%, -50%)"
                : "translate(4px, -50%)",
          }}
        >
          {rotulo.texto}
        </motion.span>
      ))}
    </div>
  );
}
