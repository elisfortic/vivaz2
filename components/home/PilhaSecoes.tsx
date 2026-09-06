"use client";

import { Children, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Empilhamento de seções (ref. corall.net): cada seção chega por cima da
 * anterior, que permanece e recua — escala 0.96, opacidade 0.5, sem blur.
 * Borda de 1px em --linha no topo da seção que sobe dá a profundidade.
 *
 * Desativado em mobile (< 768px) e sob prefers-reduced-motion:
 * vira scroll normal, conteúdo completo.
 */
export default function PilhaSecoes({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [empilhar, setEmpilhar] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const atualizar = () => setEmpilhar(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);

  useEffect(() => {
    if (!empilhar || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const contexto = gsap.context(() => {
      const itens = Array.from(
        ref.current!.querySelectorAll<HTMLElement>("[data-pilha-item]"),
      );
      itens.forEach((item, i) => {
        const conteudo = item.firstElementChild as HTMLElement | null;
        if (!conteudo) return;

        // Revela por dentro o conteúdo que excede a altura do viewport,
        // usando a própria distância de scroll que o `position: sticky`
        // já reserva enquanto a seção fica fixada (de "top top" a
        // "bottom bottom" é exatamente a duração do pino). Sem isto, o
        // trecho abaixo da dobra fica congelado invisível o tempo todo
        // em que a seção está fixada — só aparece no instante em que já
        // está desbotando para a próxima, nunca em opacidade plena.
        // Achado 2026-09-06 (Fabio, notebook 14"): medido 184px de
        // excedente em "Por que tantas transformações falham" a 768px
        // de altura de viewport — a 3ª linha e o link nunca liam.
        gsap.fromTo(
          conteudo,
          { y: 0 },
          {
            y: () => -Math.max(0, conteudo.scrollHeight - window.innerHeight),
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        if (i === itens.length - 1) return;
        const proxima = itens[i + 1];
        // As duas janelas são sequenciais, nunca sobrepostas — quando
        // tinham sobreposição (35%→20%), as duas tweens brigavam pela
        // mesma propriedade "opacity" no mesmo instante e o texto sumia
        // de golpe antes da próxima seção cobrir a área de verdade
        // (achado 2026-09-05, PDF das sócias: "come uma parte da escrita").
        // O esmaecimento total só termina em "top 10%", quando a próxima
        // seção já cobre ~90% da tela — nunca some antes de estar coberta.
        gsap.to(conteudo, {
          scale: 0.94,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: proxima,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        });
        gsap.to(conteudo, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: proxima,
            start: "top 45%",
            end: "top 10%",
            scrub: true,
          },
        });
      });
    }, ref);

    // As fontes carregam com `display: "swap"` (troca depois do 1º
    // render) — se o GSAP calcular as posições antes da troca, a altura
    // real do texto muda depois e todos os cálculos de excedente/pino
    // ficam errados. Recalcula assim que as fontes assentarem.
    let cancelado = false;
    document.fonts.ready.then(() => {
      if (!cancelado) ScrollTrigger.refresh();
    });

    return () => {
      cancelado = true;
      contexto.revert();
    };
  }, [empilhar]);

  return (
    <div ref={ref} className="relative z-10">
      {Children.map(children, (filho) => (
        <div
          data-pilha-item
          className={empilhar ? "sticky top-0" : undefined}
          style={
            empilhar ? { borderTop: "1px solid var(--linha)" } : undefined
          }
        >
          <div style={{ transformOrigin: "center top", willChange: "transform" }}>
            {filho}
          </div>
        </div>
      ))}
    </div>
  );
}
