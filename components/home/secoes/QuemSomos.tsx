"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TrioAncoragem, {
  ANCORAS,
} from "@/components/home/grafismos/TrioAncoragem";

const socias = [
  { nome: "Elisângela Chitero", foto: "/socias/elisangela.jpg" },
  { nome: "Flavia Pilan", foto: "/socias/flavia.jpg" },
  { nome: "Leila Kido", foto: "/socias/leila.jpg" },
];

const trajetoria = [
  "Natura",
  "Hospital Albert Einstein",
  "Banco Itaú",
  "BankBoston",
  "Grupo Ultra",
  "Banco BV",
  "Credicard",
  "Hering",
  "Nutrien",
];

/**
 * As sócias são os pontos de ancoragem da rede: os retratos assentam
 * exatamente sobre as âncoras do grafismo vivo, e o hover em cada uma
 * acende o feixe de fibras que converge nela.
 */
export default function QuemSomos() {
  const [ativa, setAtiva] = useState<number | null>(null);

  return (
    <section className="flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-28">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-6 text-sm uppercase tracking-[0.22em] text-terracota">
              Quem somos
            </p>
            <h2 className="font-montserrat text-4xl font-semibold leading-tight text-verde md:text-5xl">
              Três percursos,
              <br />
              um trio alinhado.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite/85">
              Carreira executiva nos assentos mais sêniores de Recursos
              Humanos de algumas das organizações mais complexas do país — e a
              decisão de colocar isso a serviço de quem precisa mover seu
              sistema.
            </p>
            <Link
              href="/quem-somos"
              className="mt-10 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
            >
              Conheça Elisângela, Flavia e Leila →
            </Link>
          </div>

          <div className="relative h-[420px] md:h-[540px]">
            <TrioAncoragem ativa={ativa} />
            {socias.map((socia, i) => (
              <button
                key={socia.nome}
                type="button"
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-default"
                style={{
                  left: `${ANCORAS[i].nx * 100}%`,
                  top: `${ANCORAS[i].ny * 100}%`,
                }}
                onMouseEnter={() => setAtiva(i)}
                onMouseLeave={() => setAtiva(null)}
                onFocus={() => setAtiva(i)}
                onBlur={() => setAtiva(null)}
              >
                <span className="relative block h-20 w-20 overflow-hidden rounded-full md:h-24 md:w-24">
                  <Image
                    src={socia.foto}
                    alt={socia.nome}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                </span>
                <span className="font-montserrat absolute left-1/2 top-full mt-3 block w-fit -translate-x-1/2 whitespace-nowrap rounded-full bg-off-white/90 px-2.5 py-0.5 text-xs font-medium text-grafite">
                  {socia.nome}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-linha pt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-grafite/60">
            Trajetória construída em
          </p>
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-grafite/80">
            {trajetoria.map((empresa, i) => (
              <span key={empresa}>
                {empresa}
                {i < trajetoria.length - 1 && (
                  <span className="ml-3 text-linha">·</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
