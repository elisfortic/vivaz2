"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TrioAncoragem, {
  ANCORAS,
} from "@/components/home/grafismos/TrioAncoragem";
import { QUEM_SOMOS_TEASER } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

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
export default function QuemSomos({ lang = "pt" }: { lang?: Idioma }) {
  const [ativa, setAtiva] = useState<number | null>(null);
  const t = QUEM_SOMOS_TEASER[lang];

  return (
    <section className="flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-28">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
              {t.eyebrow}
            </p>
            <h2 className="titulo-h2">
              {t.h2Linha1}
              <br />
              {t.h2Linha2}
            </h2>
            <p className="texto-deck mt-6 max-w-xl">
              {t.lead}
            </p>
            <Link
              href={`/${lang}/quem-somos`}
              className="mt-10 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
            >
              {t.link}
            </Link>
          </div>

          <div className="relative mt-6 h-[460px] md:mt-0 md:h-[600px]">
            {/* o quadro do grafismo é maior que a coluna — as fibras
                entram e saem sem parecer cortadas; no retrato ele não
                sobe além da própria caixa para não brigar com o texto */}
            <div className="absolute -inset-x-24 inset-y-0 md:-inset-y-14">
              {/* fade elíptico: some antes do texto, do nav e da régua —
                  nunca corte seco */}
              <TrioAncoragem
                ativa={ativa}
                style={{
                  WebkitMaskImage:
                    "radial-gradient(115% 100% at 55% 48%, black 58%, transparent 95%)",
                  maskImage:
                    "radial-gradient(115% 100% at 55% 48%, black 58%, transparent 95%)",
                }}
              />
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
                  <span className="relative block h-36 w-36 overflow-hidden rounded-full border-[3px] border-verde md:h-48 md:w-48">
                    <Image
                      src={socia.foto}
                      alt={socia.nome}
                      width={192}
                      height={192}
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
        </div>

        <div className="mt-16 border-t border-linha pt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-grafite/60">
            {t.trajetoriaRotulo}
          </p>
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-grafite">
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
