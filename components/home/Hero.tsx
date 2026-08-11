"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HERO } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

const suave = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — a rede ondula ao fundo (FundoRede, fixa); a tagline emerge dela:
 * cada linha de texto sobe devagar de dentro do movimento, sem pressa.
 */
export default function Hero({ lang = "pt" }: { lang?: Idioma }) {
  const reduzido = useReducedMotion();
  const t = HERO[lang];

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
        className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-grafite/70"
      >
        {t.eyebrow}
      </motion.p>

      <motion.h1
        {...emergir(0.8)}
        className="titulo-h1 max-w-4xl"
      >
        {t.h1Antes}
        <strong className="font-bold text-terracota">{t.h1Destaque}</strong>
        {t.h1Depois}
        <span className="text-terracota">.</span>
      </motion.h1>

      <motion.p
        {...emergir(1.15)}
        className="mt-8 max-w-xl text-lg leading-relaxed text-grafite md:text-xl"
      >
        {t.lead}
      </motion.p>

      <motion.div
        {...emergir(1.5)}
        className="mt-12 flex flex-col items-center gap-6"
      >
        <Link
          href={`/${lang}/contato`}
          className="rounded-full bg-verde px-8 py-3.5 text-sm font-medium tracking-wide text-off-white transition-transform duration-300 hover:scale-[1.03]"
        >
          {t.botao}
        </Link>
        <a
          href="#definicao"
          className="text-sm text-grafite/70 transition-colors duration-300 hover:text-verde"
        >
          {t.linkAncora}
        </a>
      </motion.div>
    </section>
  );
}
