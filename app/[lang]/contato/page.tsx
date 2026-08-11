import type { Metadata } from "next";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import FormularioContato from "@/components/contato/FormularioContato";
import RioDeFibras from "@/components/home/grafismos/RioDeFibras";
import EstruturaTraduzir from "@/components/paginas/EstruturaTraduzir";

export const metadata: Metadata = {
  title: "Contato · Vivaz",
};

export default async function ContatoPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "pt") {
    return <EstruturaTraduzir idioma={lang} rota="contato" />;
  }
  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina
        eyebrow="Contato"
        titulo="Vamos conversar"
        lead="Conte um pouco sobre o momento da sua organização. Respondemos em até dois dias úteis."
      />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="grid gap-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <FormularioContato />
          <aside className="space-y-4">
            <MarcadorPendente texto="e-mail corporativo" />
            <MarcadorPendente texto="URL da página da empresa no LinkedIn" />
          </aside>
        </div>
      </section>

      <RioDeFibras className="pointer-events-none h-40 w-full" />
      <Rodape />
    </main>
  );
}
