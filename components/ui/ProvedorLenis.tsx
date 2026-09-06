"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll suave global. Desativado sob prefers-reduced-motion.
 *
 * O Lenis roda no próprio rAF (`autoRaf`) e o PilhaSecoes usa GSAP
 * ScrollTrigger — sem ligar os dois, são dois loops de animação
 * independentes: a posição visual suavizada pelo Lenis (lerp) e a posição
 * que o ScrollTrigger lê ficam um frame fora de sincronia durante o scroll
 * ativo, fazendo o fade das seções cortar o texto cedo ou tarde. Some só
 * durante o movimento real (mouse/trackpad) e nunca aparece em captura
 * parada, porque os dois convergem assim que o scroll cessa — achado
 * 2026-09-06, reportado pelo Fabio em notebook Dell 14".
 *
 * Fix padrão da documentação Lenis+GSAP: o ticker do GSAP dirige o rAF do
 * Lenis (autoRaf desligado) e o ScrollTrigger recalcula a cada evento de
 * scroll do Lenis — os dois passam a compartilhar o mesmo relógio.
 */
export default function ProvedorLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker entrega o tempo em segundos; lenis.raf espera milissegundos
    const raf = (tempoSegundos: number) => lenis.raf(tempoSegundos * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
