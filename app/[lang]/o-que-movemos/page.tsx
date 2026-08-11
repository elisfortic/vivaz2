import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Rodape from "@/components/ui/Rodape";
import OrbitaTerritorios from "@/components/home/grafismos/OrbitaTerritorios";
import { O_QUE_MOVEMOS_PAGINA, GRAFISMOS_DECK } from "@/lib/copy/paginas";
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
const GRAFISMOS = [
  "/grafismos/territorio-cultura.png",
  "/grafismos/territorio-estrutura.png",
  "/grafismos/territorio-lideranca.png",
  "/grafismos/territorio-transformacao.png",
];

/**
 * Estrutura da Opção A (aprovada pelo cliente): faixas full-width
 * alternando superfície e lado, número gigante, grafismo grande do deck.
 * Fechamento: frase-manifesto + órbitas dos territórios VIVAS.
 */
export default async function OQueMovemosPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = O_QUE_MOVEMOS_PAGINA[lang];
  const deck = GRAFISMOS_DECK[lang];

  return (
    <main id="conteudo" className="bg-off-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-14 pt-40 md:grid-cols-2">
        <div>
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
            {t.eyebrow}
          </p>
          <h1 className="titulo-h2">{t.h1}</h1>
        </div>
        <p className="texto-deck self-end">{t.lead}</p>
      </div>

      <div>
        {t.territorios.map((terr, i) => (
          <section
            key={ANCORAS[i]}
            id={ANCORAS[i]}
            className={`scroll-mt-28 ${i % 2 === 1 ? "bg-areia" : "bg-off-white"}`}
          >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-12">
              <div
                className={`flex flex-col gap-4 md:col-span-5 ${
                  i % 2 === 1 ? "md:order-2 md:col-start-8" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="font-montserrat text-[64px] font-medium leading-none tracking-[0.08em] text-sage"
                >
                  {NUMEROS[i]}
                </span>
                <h2 className="font-montserrat text-2xl font-medium leading-snug text-verde md:text-[28px]">
                  {terr.titulo}
                </h2>
                {terr.paragrafos.map((paragrafo) => (
                  <p
                    key={paragrafo.slice(0, 24)}
                    className="leading-relaxed text-grafite"
                  >
                    {paragrafo}
                  </p>
                ))}
              </div>
              <Image
                src={GRAFISMOS[i]}
                alt=""
                aria-hidden="true"
                width={900}
                height={560}
                loading="eager"
                className={`h-auto w-full md:col-span-7 ${
                  i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-6"
                }`}
              />
            </div>
          </section>
        ))}
      </div>

      <section className="bg-areia">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-12">
          <p className="titulo-manifesto md:col-span-4">
            {deck.manifestoTerritorios}
          </p>
          <OrbitaTerritorios
            nucleo={deck.nucleoOrbitas}
            titulos={t.territorios.map((terr) => terr.titulo)}
            className="relative hidden h-[520px] md:col-span-8 md:col-start-5 md:block"
          />
        </div>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
