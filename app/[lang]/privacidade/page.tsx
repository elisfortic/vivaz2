import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import { PRIVACIDADE_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Privacidade · Vivaz",
  robots: { index: false },
};

export default async function PrivacidadePagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = PRIVACIDADE_PAGINA[lang];

  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.h1} />
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="max-w-2xl">
          <MarcadorPendente texto={t.pendente} />
        </div>
      </section>
      <Rodape lang={lang} />
    </main>
  );
}
