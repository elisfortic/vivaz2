"use client";

import { useState } from "react";
import OrbitaPrincipios from "@/components/home/grafismos/OrbitaPrincipios";
import { COMO_TRABALHAMOS } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

/**
 * Os quatro princípios ao redor do anel vivo — o nó do próprio anel faz o
 * gesto até cada princípio; o título correspondente muda de cor no toque.
 */
export default function ComoTrabalhamos({ lang = "pt" }: { lang?: Idioma }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const [agindo, setAgindo] = useState<number | null>(null);
  const emFoco = ativo ?? agindo;
  const t = COMO_TRABALHAMOS[lang];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-28">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-terracota">
          {t.eyebrow}
        </p>
        <h2 className="titulo-h2 text-center">
          {t.h2}
        </h2>

        <div className="relative mt-12 hidden md:block">
          {/* a cruz que organiza os quadrantes, como no deck */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-grafite/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-1/2 top-4 w-px bg-grafite/15"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2">
            <OrbitaPrincipios
              ativo={ativo}
              aoAgir={(q) => setAgindo(q < 0 ? null : q)}
            />
          </div>
          <div className="relative grid min-h-[640px] grid-cols-2 content-between gap-x-[380px] py-6">
            {t.principios.map((p, i) => (
              <div
                key={p.numero}
                className={`max-w-xs ${
                  i % 2 === 1 ? "justify-self-end text-right" : ""
                }`}
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
              >
                <h3
                  className={`font-montserrat text-xl font-medium transition-colors duration-700 ${
                    emFoco === i ? "text-terracota" : "text-verde"
                  }`}
                >
                  <span className="text-terracota">{p.numero}</span> ·{" "}
                  {p.titulo}
                </h3>
                <p className="font-lato mt-1 italic text-grafite">
                  “{p.frase}”
                </p>
                <p className="mt-3 text-sm leading-relaxed text-grafite/75">
                  {p.corpo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* mobile: anel e princípio ativo na MESMA visão — o card troca
            junto com o gesto do anel; os números permitem pular */}
        <div className="mt-6 md:hidden">
          <div className="relative mx-auto h-64 w-64">
            <OrbitaPrincipios
              ativo={ativo}
              aoAgir={(q) => setAgindo(q < 0 ? null : q)}
            />
          </div>
          <div className="mt-4 flex justify-center gap-5">
            {t.principios.map((p, i) => (
              <button
                key={p.numero}
                type="button"
                onClick={() => setAtivo(ativo === i ? null : i)}
                aria-label={p.titulo}
                className={`font-montserrat text-base font-medium transition-colors duration-300 ${
                  (emFoco ?? 0) === i ? "text-terracota" : "text-verde/50"
                }`}
              >
                {p.numero}
              </button>
            ))}
          </div>
          {(() => {
            const p = t.principios[emFoco ?? 0];
            return (
              <div
                key={p.numero}
                className="mx-auto mt-4 min-h-[190px] max-w-sm text-center"
              >
                <h3 className="font-montserrat text-lg font-medium text-verde">
                  <span className="text-terracota">{p.numero}</span> ·{" "}
                  {p.titulo}
                </h3>
                <p className="font-lato mt-1 italic text-grafite">
                  “{p.frase}”
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-grafite">
                  {p.corpo}
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
