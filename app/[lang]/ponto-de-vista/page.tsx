import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Rodape from "@/components/ui/Rodape";
import FeixeVertical from "@/components/home/grafismos/FeixeVertical";
import { PONTO_DE_VISTA_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Ponto de vista · Vivaz",
};

/**
 * Estrutura da Opção A: abertura em areia com estado vazio (o ensaio ainda
 * não foi publicado) e, à direita, a malha — aqui VIVA, com fade vertical.
 * A rota do artigo continua existindo para quando o texto chegar.
 */
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
      <section className="flex-1 overflow-hidden bg-areia">
        <div className="mx-auto grid min-h-[70vh] w-full max-w-6xl items-center gap-10 px-6 pb-20 pt-40 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracota">
              {t.eyebrow}
            </p>
            <h1 className="titulo-h2">{t.h1}</h1>
            <p className="texto-deck max-w-[680px]">{t.lead}</p>
            <p className="max-w-[680px] leading-relaxed text-grafite">
              {t.estadoVazio}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="relative hidden h-[480px] md:col-span-4 md:col-start-9 md:block"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
              maskImage:
                "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            }}
          >
            <FeixeVertical />
          </div>
        </div>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
