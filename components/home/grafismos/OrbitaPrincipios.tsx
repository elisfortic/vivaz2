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
    const fibrasBraco = [criarFibra(rng, 5, 10), criarFibra(rng, 5, 10)];
    const brilho = new Array(4).fill(0.55);
    let ultimaAcao = -1;

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const cx = largura / 2;
      const cy = altura / 2;
      const raio = Math.min(largura, altura) * 0.4;
      const rotacao = (Math.PI * 2 * t) / 100;

      const posicao = (i: number) => {
        const angulo = rotacao + (Math.PI * 2 * i) / NOS - Math.PI / 2;
        const r = raio * (1 + 0.045 * ruido(i * 23.1, 0, t / 30));
        return {
          x: cx + Math.cos(angulo) * r,
          y: cy + Math.sin(angulo) * r,
        };
      };

      const quadranteDe = (x: number, y: number) =>
        (y < cy ? 0 : 2) + (x < cx ? 0 : 1);

      // a ação em curso: qual princípio, quanto estendida
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
      if (dt > 0 && acao !== ultimaAcao) {
        ultimaAcao = acao;
        refAoAgir.current?.(acao);
      }

      const emFoco = refAtivo.current ?? (extensao > 0.04 ? acao : null);
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.35);
      for (let q = 0; q < 4; q++) {
        const alvo = emFoco === null ? 0.55 : emFoco === q ? 1 : 0.25;
        brilho[q] += (alvo - brilho[q]) * k;
      }

      // arcos entrelaçados
      for (let i = 0; i < NOS; i++) {
        const a = posicao(i);
        const b = posicao((i + 1) % NOS);
        const q = quadranteDe((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.beginPath();
        for (const fibra of feixes[i]) {
          tracarFibra(ctx, ruido, fibra, a.x, a.y, b.x, b.y, t, 12, 0.3);
        }
        ctx.strokeStyle = cores.verde;
        ctx.globalAlpha = 0.14 + brilho[q] * 0.38;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
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

      // o braço da ação: do ponto do anel mais próximo até o princípio
      if (extensao > 0.01) {
        const alvo = ALVOS[acao];
        const tx = alvo.nx * largura;
        const ty = alvo.ny * altura;
        const anguloAlvo = Math.atan2(ty - cy, tx - cx);
        const origemX = cx + Math.cos(anguloAlvo) * raio;
        const origemY = cy + Math.sin(anguloAlvo) * raio;
        const pontaX = origemX + (tx - origemX) * extensao;
        const pontaY = origemY + (ty - origemY) * extensao;

        ctx.beginPath();
        for (const fibra of fibrasBraco) {
          tracarFibra(
            ctx,
            ruido,
            fibra,
            origemX,
            origemY,
            pontaX,
            pontaY,
            t,
            12,
            0.18,
          );
        }
        ctx.strokeStyle = cores.verde;
        ctx.globalAlpha = 0.35 + extensao * 0.35;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(pontaX, pontaY, 4.5 * extensao, 0, Math.PI * 2);
        ctx.fillStyle = cores.terracota;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

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
