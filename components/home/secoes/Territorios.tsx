import Link from "next/link";
import { TERRITORIOS } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

const ANCORAS = [
  "cultura-etica",
  "estrutura-estrategia",
  "lideranca-desenvolvimento",
  "transformacao-mudanca",
];
const NUMEROS = ["01", "02", "03", "04"];

export default function Territorios({ lang = "pt" }: { lang?: Idioma }) {
  const t = TERRITORIOS[lang];
  return (
    <section className="relative flex min-h-screen items-center bg-off-white/90">
      <div className="relative mx-auto w-full max-w-5xl px-6 py-28">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
          {t.eyebrow}
        </p>
        <h2 className="titulo-h2">
          {t.h2}
        </h2>
        <p className="texto-deck mt-6 max-w-2xl">
          {t.lead}
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-linha bg-linha md:grid-cols-2">
          {t.itens.map((terr, i) => (
            <Link
              key={ANCORAS[i]}
              href={`/${lang}/o-que-movemos#${ANCORAS[i]}`}
              className="group block bg-off-white p-8 transition-colors duration-500 hover:bg-verde"
            >
              <span className="font-montserrat text-sm text-terracota">
                {NUMEROS[i]}
              </span>
              <h3 className="font-montserrat mt-3 text-2xl font-medium text-verde transition-colors duration-500 group-hover:text-off-white">
                {terr.titulo}
              </h3>
              <p className="mt-4 leading-relaxed text-grafite transition-colors duration-500 group-hover:text-off-white/85">
                {terr.corpo}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
