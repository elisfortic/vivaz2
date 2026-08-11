"use client";

import { useEffect, useRef } from "react";
import { LoopCanvas, criarRuido, lerCores, mulberry32, entre } from "@/lib/fibras";

/**
 * A linha condutora — um organismo só, do hero ao rodapé. Percorre os
 * gutters alternando de lado a cada seção e cruza a largura do conteúdo
 * exatamente nas fronteiras (a costura que marca cada parada do
 * empilhamento). Fio principal em verde com companheiro em sage; ondulação
 * lenta por ruído; partículas percorrendo o caminho inteiro; ponto
 * terracota pulsando em cada fronteira.
 *
 * Desenhado num canvas fixo em coordenadas de viewport: a geometria vive
 * em espaço de documento e é transladada por scrollY a cada quadro —
 * custo constante, sem canvas gigante.
 */
export default function FioCondutor() {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;
    if (window.innerWidth < 900) return; // sem gutter útil em telas estreitas

    const cores = lerCores(canvas);
    const ruido = criarRuido(20260817);
    const rng = mulberry32(20260817 ^ 0x2fa9);

    // geometria em espaço de documento
    let pontosX: number[] = [];
    let pontosY: number[] = [];
    let fronteiras: { x: number; y: number }[] = [];
    let yVerde = Infinity; // a partir daqui o fundo é verde → fio claro
    let comprimentoTotal = 1;

    const posicaoDocumento = (el: HTMLElement) => {
      let y = 0;
      let node: HTMLElement | null = el;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y;
    };

    const construir = () => {
      const secoes = Array.from(
        document.querySelectorAll<HTMLElement>("main section"),
      );
      if (secoes.length < 3) return;

      const larguraTela = document.documentElement.clientWidth;
      const gutter = Math.max((larguraTela - 1152) / 2, 48);
      const xDireita = larguraTela - gutter * 0.45;
      const xEsquerda = gutter * 0.45;
      const xCentro = larguraTela / 2;

      const medidas = secoes.map((el) => {
        const topo = posicaoDocumento(el);
        return { topo, base: topo + el.offsetHeight };
      });
      const ultima = medidas[medidas.length - 1];
      yVerde = ultima.topo;

      // waypoints: meio de cada seção no gutter (lados alternados) +
      // travessia central em cada fronteira
      const way: { x: number; y: number }[] = [];
      fronteiras = [];
      way.push({ x: xDireita, y: medidas[0].topo - 60 });
      medidas.forEach((medida, i) => {
        const lado = i % 2 === 0 ? xDireita : xEsquerda;
        const osc = (k: number) =>
          entre(mulberry32(i * 977 + k), -1, 1) * gutter * 0.12;
        const alturaSecao = medida.base - medida.topo;
        // três pontos abraçando o gutter — o fio segue colado à lateral
        // e só cruza a largura perto da fronteira
        way.push({ x: lado + osc(3), y: medida.topo + alturaSecao * 0.24 });
        way.push({ x: lado + osc(11), y: medida.topo + alturaSecao * 0.5 });
        way.push({ x: lado + osc(19), y: medida.topo + alturaSecao * 0.78 });
        if (i < medidas.length - 1) {
          const fronteira = {
            x: xCentro + entre(mulberry32(i * 131 + 7), -1, 1) * larguraTela * 0.14,
            y: medidas[i + 1].topo,
          };
          way.push(fronteira);
          fronteiras.push(fronteira);
        }
      });
      way.push({ x: xCentro, y: ultima.base + 40 });

      // Catmull-Rom → amostragem densa (~22px)
      pontosX = [];
      pontosY = [];
      for (let i = 0; i < way.length - 1; i++) {
        const p0 = way[Math.max(0, i - 1)];
        const p1 = way[i];
        const p2 = way[i + 1];
        const p3 = way[Math.min(way.length - 1, i + 2)];
        const passos = Math.max(
          6,
          Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 22),
        );
        for (let s = 0; s < passos; s++) {
          const u = s / passos;
          const u2 = u * u;
          const u3 = u2 * u;
          pontosX.push(
            0.5 *
              (2 * p1.x +
                (-p0.x + p2.x) * u +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
          );
          pontosY.push(
            0.5 *
              (2 * p1.y +
                (-p0.y + p2.y) * u +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
          );
        }
      }
      comprimentoTotal = 0;
      for (let i = 1; i < pontosX.length; i++) {
        comprimentoTotal += Math.hypot(
          pontosX[i] - pontosX[i - 1],
          pontosY[i] - pontosY[i - 1],
        );
      }
    };

    construir();
    const observadorDoc = new ResizeObserver(construir);
    observadorDoc.observe(document.body);

    const particulas = Array.from({ length: 3 }, () => ({
      f: rng(),
      vel: entre(rng, 1 / 90, 1 / 60), // fração do caminho por segundo
    }));

    const loop = new LoopCanvas(canvas, (ctx, largura, altura, t, dt) => {
      if (pontosX.length < 2) return;
      const rolagem = window.scrollY;
      const de = rolagem - 120;
      const ate = rolagem + altura + 120;

      const desloc = (i: number, canal: number) =>
        ruido(i * 0.13 + canal, 0, t / 30) * 9;

      // fio em dois tons: verde sobre superfícies claras, off-white sobre
      // o fechamento verde — cada tom em um path próprio
      const passadas = [
        { canal: 0, extra: 0, largura: 1.4, alfaBase: 0.5 },
        { canal: 57, extra: 13, largura: 1, alfaBase: 0.35 },
      ];
      for (const passada of passadas) {
        for (const tom of ["escuro", "claro"] as const) {
          ctx.beginPath();
          let caneta = false;
          for (let i = 0; i < pontosX.length; i++) {
            const y = pontosY[i];
            if (y < de || y > ate) {
              caneta = false;
              continue;
            }
            const nesteTom =
              tom === "escuro" ? y < yVerde : y >= yVerde;
            if (!nesteTom) {
              caneta = false;
              continue;
            }
            const x = pontosX[i] + desloc(i, passada.canal) + passada.extra;
            const yv = y - rolagem;
            if (caneta) {
              ctx.lineTo(x, yv);
            } else {
              ctx.moveTo(x, yv);
              caneta = true;
            }
          }
          ctx.strokeStyle =
            tom === "escuro" ? cores.verde : "rgba(250, 249, 246, 0.7)";
          ctx.globalAlpha = passada.alfaBase;
          ctx.lineWidth = passada.largura;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // nós verdes ancorando o fio no meio de cada seção — peso e propósito
      ctx.beginPath();
      for (let i = 0; i < pontosX.length; i += 40) {
        const y = pontosY[i];
        if (y < de || y > ate) continue;
        const x = pontosX[i] + desloc(i, 0);
        ctx.moveTo(x + 3, y - rolagem);
        ctx.arc(x, y - rolagem, 3, 0, Math.PI * 2);
      }
      ctx.fillStyle = cores.verde;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;

      // pontos terracota nas fronteiras — a costura de cada parada
      ctx.beginPath();
      for (const fronteira of fronteiras) {
        if (fronteira.y < de || fronteira.y > ate) continue;
        const r = 3.4 + 0.9 * ruido(fronteira.y * 0.01, 5, t / 12);
        ctx.moveTo(fronteira.x + r, fronteira.y - rolagem);
        ctx.arc(fronteira.x, fronteira.y - rolagem, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = cores.terracota;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      // partículas percorrendo o caminho inteiro
      if (dt > 0) {
        ctx.beginPath();
        for (const p of particulas) {
          p.f = (p.f + dt * p.vel) % 1;
          const indice = p.f * (pontosX.length - 1);
          const i0 = Math.floor(indice);
          const frac = indice - i0;
          const y =
            pontosY[i0] + (pontosY[Math.min(i0 + 1, pontosY.length - 1)] - pontosY[i0]) * frac;
          if (y < de || y > ate) continue;
          const x =
            pontosX[i0] +
            (pontosX[Math.min(i0 + 1, pontosX.length - 1)] - pontosX[i0]) * frac +
            desloc(i0, 0);
          ctx.moveTo(x + 2.4, y - rolagem);
          ctx.arc(x, y - rolagem, 2.4, 0, Math.PI * 2);
        }
        ctx.fillStyle = cores.sage;
        ctx.globalAlpha = 0.9;
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
