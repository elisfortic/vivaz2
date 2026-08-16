"use client";

import { useState } from "react";
import Link from "next/link";
import LinhaRuptura from "@/components/home/grafismos/LinhaRuptura";
import { FALHAM } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

/**
 * Três linhas de ruptura (layout da Opção A, grafismo construído vivo):
 * título → seta → impacto → fibra que se desfaz → consequência.
 */
export default function PorQueFalham({ lang = "pt" }: { lang?: Idioma }) {
  const [ativa, setAtiva] = useState<number | null>(null);
  const t = FALHAM[lang];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-areia">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
          {t.eyebrow}
        </p>
        <h2 className="titulo-h2 max-w-3xl">
          {t.h2}
        </h2>
        <p className="texto-deck mt-4 max-w-2xl">
          {t.lead}
        </p>

        <div className="mt-8 space-y-5">
          {t.linhas.map((linha, i) => (
            <div
              key={linha.titulo}
              className="grid items-center gap-6 md:grid-cols-[minmax(0,0.85fr)_460px_minmax(0,1fr)]"
              onMouseEnter={() => setAtiva(i)}
              onMouseLeave={() => setAtiva(null)}
            >
              <h3 className="font-montserrat text-xl font-medium leading-snug text-verde md:text-right md:text-2xl">
                {linha.titulo}
              </h3>
              {/* mobile: a mesma fibra que se rompe, compacta, liga a
                  causa à consequência — o gesto não pode sumir no retrato */}
              <LinhaRuptura
                semente={i + 1}
                intensa={ativa === i}
                className="h-24 w-full md:hidden"
              />
              <LinhaRuptura
                semente={i + 1}
                intensa={ativa === i}
                className="hidden h-36 w-full md:block"
              />
              <div>
                <p className="font-montserrat text-xl font-medium text-terracota md:text-2xl">
                  {linha.subtitulo}
                </p>
                <p className="mt-2 max-w-md leading-relaxed text-grafite">
                  {linha.corpo}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/${lang}/ponto-de-vista/por-que-transformacoes-falham`}
          className="mt-10 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
        >
          {t.linkEnsaio}
        </Link>
      </div>
    </section>
  );
}
