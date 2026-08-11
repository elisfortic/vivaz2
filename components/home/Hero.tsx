"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const suave = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — a rede ondula ao fundo (FundoRede, fixa); a tagline emerge dela:
 * cada linha de texto sobe devagar de dentro do movimento, sem pressa.
 */
export default function Hero() {
  const reduzido = useReducedMotion();

  const emergir = (atraso: number) =>
    reduzido
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.4, delay: atraso, ease: suave },
        };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p
        {...emergir(0.5)}
        className="mb-6 text-sm uppercase tracking-[0.22em] text-grafite/70"
      >
        Consultoria em cultura, liderança e gestão
      </motion.p>

      <motion.h1
        {...emergir(0.8)}
        className="font-montserrat max-w-4xl text-5xl font-medium leading-[1.08] text-verde md:text-7xl"
      >
        Pessoas que{" "}
        <strong className="font-bold text-terracota">movem</strong> sistemas
        <span className="text-terracota">.</span>
      </motion.h1>

      <motion.p
        {...emergir(1.15)}
        className="mt-8 max-w-xl text-lg leading-relaxed text-grafite/85 md:text-xl"
      >
        Conectamos estratégia, cultura e gestão para organizações que precisam
        se mover.
      </motion.p>

      <motion.div
        {...emergir(1.5)}
        className="mt-12 flex flex-col items-center gap-6"
      >
        <Link
          href="/contato"
          className="rounded-full bg-verde px-8 py-3.5 text-sm font-medium tracking-wide text-off-white transition-transform duration-300 hover:scale-[1.03]"
        >
          Converse com uma sócia
        </Link>
        <a
          href="#definicao"
          className="text-sm text-grafite/70 transition-colors duration-300 hover:text-verde"
        >
          O que é mover sistemas ↓
        </a>
      </motion.div>
    </section>
  );
}
