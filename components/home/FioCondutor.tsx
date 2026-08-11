"use client";

import { useEffect, useRef } from "react";
import {
  LoopCanvas,
  criarFibra,
  criarRuido,
  entre,
  lerCores,
  mulberry32,
  type ParamsFibra,
} from "@/lib/fibras";

/**
 * A linha condutora, versão discreta: dois pares de fios vivos descendo
 * pelos gutters laterais — do hero ao rodapé, sem nunca entrar na zona de
 * conteúdo. Ondulação lenta, nós pequenos espaçados, uma partícula por
 * lado. Sobre o fechamento verde, os fios viram off-white.
 *
 * Desenhado em canvas fixo; geometria em espaço de documento transladada
 * por scrollY — custo constante. Se o gutter for estreito (< 56px de faixa
 * útil), não renderiza nada.
 */
export default function FioCondutor() {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    if (window.innerWidth < 1100) return;

    const cores = lerCores(canvas);
    const ruido = criarRuido(20260821);
    const rng = mulberry32(20260821 ^ 0x4e2f);

    let alturaDoc = 0;
    let yVerde = Infinity;
    let faixaEsq = { de: 0, ate: 0 };
    let faixaDir = { de: 0, ate: 0 };
    let estreito = false;

    const medir = () => {
      const larguraTela = document.documentElement.clientWidth;
      const gutter = (larguraTela - 1152) / 2;
      estreito = gutter < 80;
      // faixa útil: do respiro da borda até antes do conteúdo
      faixaEsq = { de: 18, ate: Math.max(gutter - 40, 40) };
      faixaDir = {
        de: larguraTela - Math.max(gutter - 40, 40),
        ate: larguraTela - 18,
      };
      alturaDoc = document.documentElement.scrollHeight;
      const secoes = document.querySelectorAll<HTMLElement>("main section");
      const ultima = secoes[secoes.length - 1];
      if (ultima) {
        let y = 0;
        let node: HTMLElement | null = ultima;
        while (node) {
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        yVerde = y;
      }
    };
    medir();
    const observadorDoc = new ResizeObserver(medir);
    observadorDoc.observe(document.body);

    interface FioLateral {
      fibra: ParamsFibra;
      lado: "esq" | "dir";
      /** posição na faixa útil (0 = borda externa · 1 = borda interna) */
      posicao: number;
      alfa: number;
      peso: number;
    }
    const fios: FioLateral[] = [
      { fibra: criarFibra(rng, 5, 10), lado: "esq", posicao: 0.35, alfa: 0.4, peso: 1.4 },
      { fibra: criarFibra(rng, 5, 10), lado: "esq", posicao: 0.7, alfa: 0.25, peso: 1 },
      { fibra: criarFibra(rng, 5, 10), lado: "dir", posicao: 0.65, alfa: 0.4, peso: 1.4 },
      { fibra: criarFibra(rng, 5, 10), lado: "dir", posicao: 0.3, alfa: 0.25, peso: 1 },
    ];
    const particulas = fios.slice(0, 2).map((_, i) => ({
      fio: i === 0 ? 0 : 2,
      y: rng() * 4000,
      vel: entre(rng, 26, 40), // px/s descendo
    }));

    const xDoFio = (fio: FioLateral, y: number, t: number) => {
      const faixa = fio.lado === "esq" ? faixaEsq : faixaDir;
      const base = faixa.de + (faixa.ate - faixa.de) * fio.posicao;
      const amplitude = Math.min((faixa.ate - faixa.de) * 0.3, 14);
      return (
        base +
        ruido(fio.fibra.canal, y * 0.0016, t / fio.fibra.periodo) * amplitude
      );
    };

    const loop = new LoopCanvas(canvas, (ctx, _largura, altura, t, dt) => {
      if (estreito) return;
      const rolagem = window.scrollY;
      const de = rolagem - 60;
      const ate = rolagem + altura + 60;

      for (const tom of ["escuro", "claro"] as const) {
        for (const fio of fios) {
          ctx.beginPath();
          let caneta = false;
          for (let y = de; y <= ate; y += 18) {
            if (y < 0 || y > alturaDoc) {
              caneta = false;
              continue;
            }
            const nesteTom = tom === "escuro" ? y < yVerde : y >= yVerde;
            if (!nesteTom) {
              caneta = false;
              continue;
            }
            const x = xDoFio(fio, y, t);
            if (caneta) ctx.lineTo(x, y - rolagem);
            else {
              ctx.moveTo(x, y - rolagem);
              caneta = true;
            }
          }
          ctx.strokeStyle =
            tom === "escuro" ? cores.verde : "rgba(250, 249, 246, 0.65)";
          ctx.globalAlpha = fio.alfa;
          ctx.lineWidth = fio.peso;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // nós pequenos a cada ~600px de documento, presos ao fio principal
      ctx.beginPath();
      for (const indice of [0, 2]) {
        const fio = fios[indice];
        for (let y = 300; y < alturaDoc; y += 620) {
          if (y < de || y > ate) continue;
          const x = xDoFio(fio, y, t);
          ctx.moveTo(x + 2.6, y - rolagem);
          ctx.arc(x, y - rolagem, 2.6, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = cores.sage;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;

      // uma partícula por lado, descendo devagar
      if (dt > 0) {
        ctx.beginPath();
        for (const p of particulas) {
          p.y += p.vel * dt;
          if (p.y > alturaDoc) p.y = -20;
          if (p.y < de || p.y > ate) continue;
          const x = xDoFio(fios[p.fio], p.y, t);
          ctx.moveTo(x + 2.2, p.y - rolagem);
          ctx.arc(x, p.y - rolagem, 2.2, 0, Math.PI * 2);
        }
        ctx.fillStyle = cores.terracota;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    return () => {
      observadorDoc.disconnect();
      loop.destruir();
    };
  }, []);

  return (
    <canvas
      ref={refCanvas}
      className="pointer-events-none fixed inset-0 z-20 hidden h-full w-full md:block"
      aria-hidden="true"
    />
  );
}
