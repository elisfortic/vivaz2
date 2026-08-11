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
 * O anel dos princípios (motivo como-movemos do deck, construído vivo):
 * 8 nós em círculo, feixes entrelaçados entre vizinhos, duas fibras-líder
 * finas serpenteando (verde + terracota, como no deck), o anel girando
 * devagar (~100s/volta).
 *
 * E o anel AGE: a cada ~9s estende uma fibra até um dos quatro princípios
 * (01→02→03→04), toca com a ponta terracota, segura e recolhe — cada ação
 * ocorrendo e voltando ao sistema. `aoAgir` avisa qual princípio está
 * recebendo a ação (para o texto acender junto); `ativo` (hover) tem
 * prioridade sobre o ciclo.
 * Quadrantes: 0 sup-esq · 1 sup-dir · 2 inf-esq · 3 inf-dir.
 */

const ALVOS = [
  { nx: 0.08, ny: 0.12 },
  { nx: 0.92, ny: 0.12 },
  { nx: 0.08, ny: 0.88 },
  { nx: 0.92, ny: 0.88 },
] as const;

const DURACAO_ACAO = 9;

const suavizar = (u: number) => u * u * (3 - 2 * u);

export default function OrbitaPrincipios({
  ativo,
  aoAgir,
  className,
}: {
  ativo: number | null;
  aoAgir?: (quadrante: number) => void;
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAtivo = useRef<number | null>(ativo);
  refAtivo.current = ativo;
  const refAoAgir = useRef(aoAgir);
  refAoAgir.current = aoAgir;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260816);
    const ruido = criarRuido(20260816 ^ 0x44f1);

    const NOS = 8;
    const feixes: ParamsFibra[][] = Array.from({ length: NOS }, () =>
      Array.from({ length: 5 }, () => criarFibra(rng, 6, 15)),
    );
    let ultimaAcao = -1;
    let escolhido = -1;
    let tocado = false;

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const cx = largura / 2;
      const cy = altura / 2;
      const raio = Math.min(largura, altura) * 0.4;
      const rotacao = (Math.PI * 2 * t) / 100;

      const posicaoBase = (i: number) => {
        const angulo = rotacao + (Math.PI * 2 * i) / NOS - Math.PI / 2;
        const r = raio * (1 + 0.045 * ruido(i * 23.1, 0, t / 30));
        return {
          x: cx + Math.cos(angulo) * r,
          y: cy + Math.sin(angulo) * r,
        };
      };

      // a ação: um dos nós DO PRÓPRIO ANEL se estende até quase tocar o
      // princípio da vez e volta — cada ação ocorrendo e retornando
      const acao = Math.floor(t / DURACAO_ACAO) % 4;
      const p = (t % DURACAO_ACAO) / DURACAO_ACAO;
      const extensao =
        p < 0.35
          ? suavizar(p / 0.35)
          : p < 0.55
            ? 1
            : p < 0.9
              ? 1 - suavizar((p - 0.55) / 0.35)
              : 0;
      const alvoX = ALVOS[acao].nx * largura;
      const alvoY = ALVOS[acao].ny * altura;
      if (acao !== ultimaAcao) {
        ultimaAcao = acao;
        tocado = false;
        // o nó mais próximo do princípio assume o gesto
        let melhor = 0;
        let melhorDist = Infinity;
        for (let i = 0; i < NOS; i++) {
          const ponto = posicaoBase(i);
          const d = (ponto.x - alvoX) ** 2 + (ponto.y - alvoY) ** 2;
          if (d < melhorDist) {
            melhorDist = d;
            melhor = i;
          }
        }
        escolhido = melhor;
      }
      if (dt > 0) {
        if (!tocado && extensao > 0.88) {
          tocado = true;
          refAoAgir.current?.(acao);
        }
        if (tocado && extensao < 0.15) {
          tocado = false;
          refAoAgir.current?.(-1);
        }
      }

      const posicao = (i: number) => {
        const base = posicaoBase(i);
        if (i !== escolhido || extensao <= 0.01) return base;
        // quase toca: 72% do caminho até o texto
        return {
          x: base.x + (alvoX - base.x) * 0.72 * extensao,
          y: base.y + (alvoY - base.y) * 0.72 * extensao,
        };
      };

      // arcos entrelaçados — presença constante, nada esmaece;
      // quando o nó escolhido sai, os arcos vizinhos se esticam com ele
      ctx.beginPath();
      for (let i = 0; i < NOS; i++) {
        const a = posicao(i);
        const b = posicao((i + 1) % NOS);
        for (const fibra of feixes[i]) {
          tracarFibra(ctx, ruido, fibra, a.x, a.y, b.x, b.y, t, 12, 0.3);
        }
      }
      ctx.strokeStyle = cores.verde;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // fibras-líder serpenteando por cima do pente (deck): o corpo do anel
      const lideres = [
        { cor: cores.verde, peso: 3.5, fase: 0, alfa: 0.8 },
        { cor: cores.terracota, peso: 3, fase: Math.PI / NOS, alfa: 0.9 },
      ];
      for (const lider of lideres) {
        ctx.beginPath();
        const AMOSTRAS = 96;
        for (let s = 0; s <= AMOSTRAS; s++) {
          const angulo = rotacao + (Math.PI * 2 * s) / AMOSTRAS - Math.PI / 2;
          const serpente =
            Math.sin(angulo * (NOS / 2) + lider.fase * (NOS / 2)) * 18;
          const wobble = ruido(lider.fase * 7 + 40, s * 0.09, t / 34) * 7;
          const r = raio + serpente + wobble;
          const x = cx + Math.cos(angulo) * r;
          const y = cy + Math.sin(angulo) * r;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = lider.cor;
        ctx.globalAlpha = lider.alfa;
        ctx.lineWidth = lider.peso;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nós — alternando verde e terracota, respirando
      for (const cor of ["verde", "terracota"] as const) {
        ctx.beginPath();
        for (let i = 0; i < NOS; i++) {
          if ((i % 2 === 0 ? "verde" : "terracota") !== cor) continue;
          const ponto = posicao(i);
          const r = 14 * (1 + 0.07 * ruido(140 + i * 9, 0, t / 26));
          ctx.moveTo(ponto.x + r, ponto.y);
          ctx.arc(ponto.x, ponto.y, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = cor === "verde" ? cores.verde : cores.terracota;
        ctx.fill();
      }

      // o nó em gesto ganha um halo terracota enquanto está fora do anel
      if (escolhido >= 0 && extensao > 0.4) {
        const ponto = posicao(escolhido);
        ctx.beginPath();
        ctx.arc(ponto.x, ponto.y, 19, 0, Math.PI * 2);
        ctx.strokeStyle = cores.terracota;
        ctx.globalAlpha = (extensao - 0.4) * 1.2;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
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
