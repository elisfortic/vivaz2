"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Scroll suave global. Desativado sob prefers-reduced-motion. */
export default function ProvedorLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
