"use client";

import { useState } from "react";
import Link from "next/link";
import FaixaRupturas from "@/components/home/grafismos/FaixaRupturas";

const colunas = [
  {
    titulo: "Mexe-se na estrutura,",
    subtitulo: "mas a cultura resiste.",
    corpo:
      "O novo organograma não funciona se as pessoas continuam operando na cultura antiga.",
  },
  {
    titulo: "Investe-se em liderança,",
    subtitulo: "mas a governança contradiz.",
    corpo:
      "Um programa robusto não muda nada se a decisão segue centralizada e o líder não decide.",
  },
  {
    titulo: "Anunciam-se valores,",
    subtitulo: "mas a avaliação não muda.",
    corpo:
      "Valor que não aparece na avaliação de desempenho não se torna real.",
  },
];

/**
 * O bloco do impacto: uma única faixa de fibras atravessa as três colunas
 * e rompe nas divisórias (motivo do deck) — o hover em cada coluna acentua
 * a ruptura daquele terço.
 */
export default function PorQueFalham() {
  const [ativa, setAtiva] = useState<number | null>(null);

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-areia">
      <div className="relative mx-auto w-full max-w-5xl px-6 pt-28">
        <p className="mb-6 text-sm uppercase tracking-[0.22em] text-terracota">
          Nosso ponto de vista
        </p>
        <h2 className="font-montserrat max-w-3xl text-4xl font-semibold leading-tight text-verde md:text-5xl">
          Por que tantas transformações falham
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
          Não por falta de método — mas por tratar partes isoladas de um
          sistema que precisa ser avaliado de maneira coordenada.
        </p>
      </div>

      {/* sangra a largura toda, com fade nas bordas — tira o ar de gráfico */}
      <FaixaRupturas
        intensa={ativa}
        className="mt-12 h-56 w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 9%, black 91%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 9%, black 91%, transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28">
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {colunas.map((col, i) => (
            <div
              key={col.titulo}
              onMouseEnter={() => setAtiva(i)}
              onMouseLeave={() => setAtiva(null)}
            >
              <h3 className="font-montserrat text-xl font-semibold text-grafite">
                {col.titulo}
                <br />
                <span className="text-terracota">{col.subtitulo}</span>
              </h3>
              <p className="mt-4 leading-relaxed text-grafite/80">
                {col.corpo}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/ponto-de-vista/por-que-transformacoes-falham"
          className="mt-14 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
        >
          Leia o ensaio completo — 8 min →
        </Link>
      </div>
    </section>
  );
}
