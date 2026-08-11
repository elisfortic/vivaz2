"use client";

import { useState } from "react";
import Link from "next/link";
import LinhaRuptura from "@/components/home/grafismos/LinhaRuptura";

const linhas = [
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
 * Três linhas de ruptura (layout da Opção A, grafismo construído vivo):
 * título → seta → impacto → fibra que se desfaz → consequência.
 */
export default function PorQueFalham() {
  const [ativa, setAtiva] = useState<number | null>(null);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-areia">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-28">
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

        <div className="mt-16 space-y-12">
          {linhas.map((linha, i) => (
            <div
              key={linha.titulo}
              className="grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_400px_minmax(0,1.1fr)]"
              onMouseEnter={() => setAtiva(i)}
              onMouseLeave={() => setAtiva(null)}
            >
              <h3 className="font-montserrat text-xl font-semibold leading-snug text-verde md:text-right md:text-2xl">
                {linha.titulo}
              </h3>
              <LinhaRuptura
                semente={i + 1}
                intensa={ativa === i}
                className="hidden h-32 w-full md:block"
              />
              <div>
                <p className="font-montserrat text-xl font-semibold text-terracota md:text-2xl">
                  {linha.subtitulo}
                </p>
                <p className="mt-2 max-w-md leading-relaxed text-grafite/80">
                  {linha.corpo}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/ponto-de-vista/por-que-transformacoes-falham"
          className="mt-16 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
        >
          Leia o ensaio completo — 8 min →
        </Link>
      </div>
    </section>
  );
}
