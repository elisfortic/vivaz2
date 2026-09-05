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
        if (i === itens.length - 1) return;
        const proxima = itens[i + 1];
        const conteudo = item.firstElementChild as HTMLElement | null;
        if (!conteudo) return;
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

    return () => contexto.revert();
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
