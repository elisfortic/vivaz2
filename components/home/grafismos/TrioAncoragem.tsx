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
  tracarFibra,
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * Posições normalizadas das três âncoras — compartilhadas com os retratos
 * (QuemSomos posiciona as fotos exatamente sobre estes pontos).
 * Ordem: Elisângela, Flavia, Leila.
 */
export const ANCORAS = [
  { nx: 0.52, ny: 0.24 },
  { nx: 0.33, ny: 0.62 },
  { nx: 0.71, ny: 0.68 },
] as const;

interface Feixe {
  fibra: ParamsFibra;
  /** origem normalizada (pode estar fora de [0,1] — nasce fora da tela) */
  ox: number;
  oy: number;
  /** âncora que a fibra atravessa */
  destino: number;
  /** fibra-guia (grossa) ou de acompanhamento */
  guia: boolean;
}

interface Entrelace {
  fibra: ParamsFibra;
  a: number;
  b: number;
}

/**
 * O trio como pontos de ancoragem da rede (motivo do deck, construído vivo):
 * feixes de fibras chegam de fora da tela e convergem em cada âncora;
 * entre as âncoras, fibras se entrelaçam — e partículas circulam por elas.
 * `ativa` (índice da sócia sob hover) acende o feixe correspondente.
 */
export default function TrioAncoragem({
  ativa,
  className,
  style,
}: {
  ativa: number | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAtiva = useRef<number | null>(ativa);
  refAtiva.current = ativa;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const cores = lerCores(canvas);
    const rng = mulberry32(20260813);
    const ruido = criarRuido(20260813 ^ 0x7a1c);

    // feixes externos: 9 fibras por âncora, nascendo num setor angular
    // próprio (evita simetria mecânica)
    const feixes: Feixe[] = [];
    const setores = [-Math.PI / 2, Math.PI, Math.PI / 3];
    ANCORAS.forEach((ancora, i) => {
      for (let j = 0; j < 9; j++) {
        const angulo = setores[i] + entre(rng, -1.1, 1.1);
        const raio = entre(rng, 0.95, 1.9);
        feixes.push({
          fibra: criarFibra(rng, 8, 20),
          ox: ancora.nx + Math.cos(angulo) * raio,
          oy: ancora.ny + Math.sin(angulo) * raio,
          destino: i,
          guia: false,
        });
      }
    });

    // entrelaçamento entre âncoras: 5 fibras por par
    const entrelaces: Entrelace[] = [];
    for (let a = 0; a < 3; a++) {
      for (let b = a + 1; b < 3; b++) {
        for (let k = 0; k < 5; k++) {
          entrelaces.push({ fibra: criarFibra(rng, 10, 24), a, b });
        }
      }
    }

    // partículas circulando pelos entrelaçamentos
    const particulas = Array.from({ length: 6 }, () => ({
      indice: Math.floor(rng() * entrelaces.length),
      f: rng(),
      dur: entre(rng, 6, 11),
      sentido: rng() < 0.5 ? 1 : -1,
    }));

    // brilho por âncora, com easing — hover acende devagar, apaga devagar
    const brilho = [0.5, 0.5, 0.5];

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      const px = (n: number) => n * largura;
      const py = (n: number) => n * altura;

      const alvoDe = (i: number) =>
        refAtiva.current === null ? 0.5 : refAtiva.current === i ? 1 : 0.12;
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt / 0.35);
      for (let i = 0; i < 3; i++) {
        brilho[i] += (alvoDe(i) - brilho[i]) * k;
      }

      // feixes externos — um lote por âncora (alpha própria)
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (const feixe of feixes) {
          if (feixe.destino !== i) continue;
          const ancora = ANCORAS[i];
          tracarFibra(
            ctx,
            ruido,
            feixe.fibra,
            px(feixe.ox),
            py(feixe.oy),
            px(ancora.nx),
            py(ancora.ny),
            t,
            16,
            0.14,
          );
        }
        ctx.strokeStyle = cores.verde;
        ctx.globalAlpha = 0.14 + brilho[i] * 0.42;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // entrelaçamentos — brilho do par = máximo das duas âncoras
      for (let a = 0; a < 3; a++) {
        for (let b = a + 1; b < 3; b++) {
          ctx.beginPath();
          for (const ent of entrelaces) {
            if (ent.a !== a || ent.b !== b) continue;
            tracarFibra(
              ctx,
              ruido,
              ent.fibra,
              px(ANCORAS[a].nx),
              py(ANCORAS[a].ny),
              px(ANCORAS[b].nx),
              py(ANCORAS[b].ny),
              t,
              16,
              0.22,
            );
          }
          ctx.strokeStyle = cores.verde;
          ctx.globalAlpha = 0.16 + Math.max(brilho[a], brilho[b]) * 0.4;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // partículas — o conhecimento circulando entre as sócias
      if (dt > 0) {
        ctx.beginPath();
        for (const p of particulas) {
          p.f += (dt / p.dur) * p.sentido;
          if (p.f > 1 || p.f < 0) {
            p.indice = Math.floor(Math.random() * entrelaces.length);
            p.sentido *= -1;
            p.f = Math.min(1, Math.max(0, p.f));
            p.dur = 6 + Math.random() * 5;
          }
          const ent = entrelaces[p.indice];
          const ponto = pontoNaFibra(
            ruido,
            ent.fibra,
            px(ANCORAS[ent.a].nx),
            py(ANCORAS[ent.a].ny),
            px(ANCORAS[ent.b].nx),
            py(ANCORAS[ent.b].ny),
            p.f,
            t,
            0.22,
          );
          ctx.moveTo(ponto.x + 2, ponto.y);
          ctx.arc(ponto.x, ponto.y, 2, 0, Math.PI * 2);
        }
        ctx.fillStyle = cores.terracota;
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // sem discos de canvas: o anel fino é CSS no próprio retrato —
      // alinhamento garantido em qualquer tamanho
    });

    return () => loop.destruir();
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className={className ?? "absolute inset-0 h-full w-full"}
      style={style}
      aria-hidden="true"
    />
  );
}
