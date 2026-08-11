import type { Metadata } from "next";
import Link from "next/link";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import Rodape from "@/components/ui/Rodape";
import EstruturaTraduzir from "@/components/paginas/EstruturaTraduzir";

export const metadata: Metadata = {
  title: "Ponto de vista · Vivaz",
};

export default async function PontoDeVistaPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "pt") {
    return <EstruturaTraduzir idioma={lang} rota="ponto-de-vista" />;
  }
  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina
        eyebrow="Ponto de vista"
        titulo="Nosso ponto de vista"
        lead="O que pensamos sobre organizações, cultura e o trabalho de fazer sistemas se moverem. Textos, entrevistas e conversas — publicados aqui e no LinkedIn."
      />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <Link
          href="/ponto-de-vista/por-que-transformacoes-falham"
          className="group block max-w-2xl border-t border-linha pt-8"
        >
          <h2 className="font-montserrat text-2xl font-semibold leading-snug text-verde transition-colors duration-300 group-hover:text-terracota md:text-3xl">
            Por que tantas transformações organizacionais falham
          </h2>
          <p className="mt-3 text-sm text-grafite/70">
            Elisângela Chitero, Flavia Pilan e Leila Kido
          </p>
          <span className="mt-5 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 group-hover:text-terracota">
            Leia o ensaio completo — 8 min →
          </span>
        </Link>
      </section>

      <Rodape />
    </main>
  );
}
