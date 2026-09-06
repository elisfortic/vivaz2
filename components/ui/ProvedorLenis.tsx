"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll suave global. Desativado sob prefers-reduced-motion.
 *
 * O PilhaSecoes usa GSAP ScrollTrigger, que por padrão só recalcula em
 * eventos nativos de `scroll` — o Lenis intercepta o scroll e o suaviza
 * sem necessariamente disparar esses eventos no mesmo instante, então o
 * ScrollTrigger podia ler uma posição desatualizada (achado 2026-09-06).
 *
 * Fix: avisar o ScrollTrigger a cada tick do próprio Lenis. Mantém
 * `autoRaf: true` (o loop interno do Lenis, testado e previsível) — uma
 * tentativa anterior de fazer o ticker do GSAP dirigir o rAF do Lenis foi
 * revertida por risco: em hardware mais fraco, com vários canvases vivos
 * rodando em paralelo, um ticker atrasado travaria o próprio scroll.
 */
export default function ProvedorLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
    });

    lenis.on("scroll", ScrollTrigger.update);

    return () => lenis.destroy();
  }, []);

  return null;
}
