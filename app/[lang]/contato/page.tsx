import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import FormularioContato from "@/components/contato/FormularioContato";
import RioDeFibras from "@/components/home/grafismos/RioDeFibras";
import { CONTATO_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Contato · Vivaz",
};

export default async function ContatoPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = CONTATO_PAGINA[lang];

  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.h1} lead={t.lead} />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="grid gap-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <FormularioContato lang={lang} />
          <aside className="space-y-4">
            <MarcadorPendente texto={t.pendenteEmail} />
            <MarcadorPendente texto={t.pendenteLinkedin} />
          </aside>
        </div>
      </section>

      <RioDeFibras className="pointer-events-none h-40 w-full" />
      <Rodape lang={lang} />
    </main>
  );
}
