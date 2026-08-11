"use client";

import { useState } from "react";
import OrbitaPrincipios from "@/components/home/grafismos/OrbitaPrincipios";

const principios = [
  {
    numero: "01",
    titulo: "Profundidade",
    frase: "Entender antes de propor.",
    corpo:
      "Cada organização funciona de um jeito. Antes de desenhar qualquer solução, investimos tempo entendendo como as coisas realmente acontecem.",
  },
  {
    numero: "02",
    titulo: "Humanização",
    frase: "Pessoas não são indicadores.",
    corpo:
      "Gente não é dado a ser gerenciado. É por onde toda mudança começa ou trava. Por isso escutamos as pessoas antes de qualquer intervenção.",
  },
  {
    numero: "03",
    titulo: "Conexão",
    frase: "Ninguém se desenvolve sozinho.",
    corpo:
      "O conhecimento circula pelas relações. É no encontro entre pessoas que crescemos, que a rede se fortalece e que a inovação surge.",
  },
  {
    numero: "04",
    titulo: "Impacto",
    frase: "O que fica depois que a gente sai.",
    corpo:
      "Não tratamos sintoma. Buscamos o que está travando o sistema para que ele volte a andar e continue andando por conta própria.",
  },
];

/**
 * Os quatro princípios ao redor do anel vivo — hover num princípio acende
 * o arco do quadrante correspondente (0 sup-esq · 1 sup-dir · 2 inf-esq ·
 * 3 inf-dir, mesma ordem dos textos).
 */
export default function ComoTrabalhamos() {
  const [ativo, setAtivo] = useState<number | null>(null);
  const [agindo, setAgindo] = useState<number | null>(null);
  const emFoco = ativo ?? agindo;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-28">
        <p className="mb-6 text-center text-sm uppercase tracking-[0.22em] text-terracota">
          Como trabalhamos
        </p>
        <h2 className="font-montserrat text-center text-4xl font-semibold leading-tight text-verde md:text-5xl">
          O que orienta cada projeto
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
            {principios.map((p, i) => (
              <div
                key={p.numero}
                className={`max-w-xs ${
                  i % 2 === 1 ? "justify-self-end text-right" : ""
                }`}
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
              >
                <h3
                  className={`font-montserrat text-xl font-semibold transition-colors duration-700 ${
                    emFoco === i ? "text-terracota" : "text-verde"
                  }`}
                >
                  <span className="text-terracota">{p.numero}</span> ·{" "}
                  {p.titulo}
                </h3>
                <p className="font-lato mt-1 italic text-grafite/90">
                  “{p.frase}”
                </p>
                <p className="mt-3 text-sm leading-relaxed text-grafite/75">
                  {p.corpo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* mobile: anel menor no topo, princípios empilhados */}
        <div className="mt-10 md:hidden">
          <div className="relative mx-auto h-64 w-64">
            <OrbitaPrincipios ativo={ativo} />
          </div>
          <div className="mt-10 space-y-8">
            {principios.map((p) => (
              <div key={p.numero}>
                <h3 className="font-montserrat text-lg font-semibold text-verde">
                  <span className="text-terracota">{p.numero}</span> ·{" "}
                  {p.titulo}
                </h3>
                <p className="font-lato mt-1 italic text-grafite/90">
                  “{p.frase}”
                </p>
                <p className="mt-2 text-sm leading-relaxed text-grafite/75">
                  {p.corpo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
