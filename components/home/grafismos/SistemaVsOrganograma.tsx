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
  { nx: 0.64, ny: 0.8, cor: "terracota", r: 5 },
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

/** posições dos três rótulos; os textos chegam por prop (i18n) */
const POSICOES_ROTULOS = [
  { no: 9, dx: -0.05, dy: -0.17, alinhamento: "right" },
  { no: 6, dx: 0.11, dy: 0.08, alinhamento: "left" },
  { no: 1, dx: 0.02, dy: 0.13, alinhamento: "left" },
] as const;

export interface RotuloSistema {
  texto: string;
  linha: string;
}

/** as três curvas-guia (grossas) — 2 verdes, 1 terracota, como no deck */
const GUIAS = new Set([2, 5, 6]);

export default function SistemaVsOrganograma({
  rotulos,
  className,
}: {
  rotulos: readonly RotuloSistema[];
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

      // fibras vivas atravessando o organograma — finas de acompanhamento
      // e três curvas-guia grossas liderando a leitura (2 verdes, 1 terracota)
      const passadas = [
        { guia: false, tom: "verde", alfa: 0.45, peso: 1.1 },
        { guia: false, tom: "terracota", alfa: 0.4, peso: 1.1 },
        { guia: true, tom: "verde", alfa: 0.7, peso: 3 },
        { guia: true, tom: "terracota", alfa: 0.65, peso: 3 },
      ] as const;
      for (const passada of passadas) {
        ctx.beginPath();
        LIGACOES.forEach(([a, b], i) => {
          const ehGuia = GUIAS.has(i);
          if (ehGuia !== passada.guia) return;
          const terracota = ehGuia ? i === 6 : i % 4 === 1;
          if ((passada.tom === "terracota") !== terracota) return;
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
        ctx.strokeStyle =
          passada.tom === "verde" ? cores.verde : cores.terracota;
        ctx.globalAlpha = passada.alfa;
        ctx.lineWidth = passada.peso;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // linhas-guia dos rótulos
      ctx.beginPath();
      for (const rotulo of POSICOES_ROTULOS) {
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

      // nós — terracota com massa equivalente aos verdes (deck)
      for (const cor of ["verde", "terracota"] as const) {
        ctx.beginPath();
        NOS.forEach((no, i) => {
          if (no.cor !== cor) return;
          const base = no.cor === "terracota" ? no.r + 3 : no.r;
          const r = base * (1 + 0.06 * ruido(200 + i * 7, 0, t / 26));
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
      {POSICOES_ROTULOS.map((rotulo, i) => (
        <motion.div
          key={rotulo.no}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.5 + i * 0.45 }}
          className={`absolute w-[180px] ${
            rotulo.alinhamento === "right" ? "text-right" : ""
          }`}
          style={{
            left: `${(NOS[rotulo.no].nx + rotulo.dx) * 100}%`,
            top: `${(NOS[rotulo.no].ny + rotulo.dy) * 100}%`,
            transform:
              rotulo.alinhamento === "right"
                ? "translate(-100%, -50%)"
                : "translate(4px, -50%)",
          }}
        >
          <span className="font-montserrat block text-base font-medium text-verde md:text-[17px]">
            {rotulos[i].texto}
          </span>
          <span className="font-lato mt-1 block text-[15px] leading-normal text-grafite">
            {rotulos[i].linha}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
