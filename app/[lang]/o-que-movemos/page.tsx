import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import Rodape from "@/components/ui/Rodape";
import FibraTerritorios from "@/components/home/grafismos/FibraTerritorios";
import { O_QUE_MOVEMOS_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "O que movemos · Vivaz",
};

const ANCORAS = [
  "cultura-etica",
  "estrutura-estrategia",
  "lideranca-desenvolvimento",
  "transformacao-mudanca",
];
const NUMEROS = ["01", "02", "03", "04"];

export default async function OQueMovemosPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = O_QUE_MOVEMOS_PAGINA[lang];

  return (
    <main id="conteudo" className="bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.h1} lead={t.lead} />

      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <FibraTerritorios className="pointer-events-none absolute -inset-x-6 inset-y-0 hidden h-full w-[calc(100%+48px)] md:block" />
        <div className="relative grid gap-y-16 md:grid-cols-2 md:gap-x-[120px] md:gap-y-[90px]">
          {t.territorios.map((terr, i) => (
            <article
              key={ANCORAS[i]}
              id={ANCORAS[i]}
              className="max-w-md scroll-mt-32 md:pl-10"
            >
              <span className="font-montserrat text-xl font-medium text-terracota">
                {NUMEROS[i]}
              </span>
              <h2 className="font-montserrat mt-2 text-2xl font-medium text-verde">
                {terr.titulo}
              </h2>
              {terr.paragrafos.map((paragrafo) => (
                <p
                  key={paragrafo.slice(0, 24)}
                  className="mt-4 leading-relaxed text-grafite"
                >
                  {paragrafo}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
