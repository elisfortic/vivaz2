import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import Rodape from "@/components/ui/Rodape";
import LinhaRuptura from "@/components/home/grafismos/LinhaRuptura";
import { PONTO_DE_VISTA_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Ponto de vista · Vivaz",
};

export default async function PontoDeVistaPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = PONTO_DE_VISTA_PAGINA[lang];

  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.h1} lead={t.lead} />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <LinhaRuptura
          semente={4}
          intensa={false}
          className="pointer-events-none mb-12 hidden h-36 w-full max-w-2xl md:block"
        />
        <Link
          href={`/${lang}/ponto-de-vista/por-que-transformacoes-falham`}
          className="group block max-w-2xl border-t border-linha pt-8"
        >
          <h2 className="font-montserrat text-2xl font-semibold leading-snug text-verde transition-colors duration-300 group-hover:text-terracota md:text-3xl">
            {t.artigoTitulo}
          </h2>
          <p className="mt-3 text-sm text-grafite/70">{t.assinatura}</p>
          <span className="mt-5 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 group-hover:text-terracota">
            {t.linkEnsaio}
          </span>
        </Link>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
