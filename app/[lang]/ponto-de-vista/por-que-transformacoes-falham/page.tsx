import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import { PONTO_DE_VISTA_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Por que tantas transformações organizacionais falham · Vivaz",
};

export default async function ArtigoFalhamPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = PONTO_DE_VISTA_PAGINA[lang];

  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.artigoTitulo} />

      <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <p className="text-sm text-grafite/70">{t.assinatura}</p>
        <div className="mt-10 max-w-2xl space-y-4">
          <MarcadorPendente texto={t.pendenteEnsaio} />
        </div>
      </article>

      <Rodape lang={lang} />
    </main>
  );
}
