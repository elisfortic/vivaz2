import Link from "next/link";
import Rodape from "@/components/ui/Rodape";
import RioDeFibras from "@/components/home/grafismos/RioDeFibras";
import type { DicionarioUnica, Idioma } from "@/lib/idiomas";

/**
 * Página única em espanhol/inglês (copy do 04 §/ES; EN aguarda tradução).
 * Uma rolagem curta, estática, sem CMS.
 */
export default function PaginaUnica({
  idioma,
  dicionario,
}: {
  idioma: Idioma;
  dicionario: DicionarioUnica;
}) {
  const textos = dicionario.paginaUnica;
  return (
    <main id="conteudo" lang={idioma} className="flex min-h-screen flex-col bg-off-white">
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-44 text-center">
        <h1 className="font-montserrat text-4xl font-medium leading-tight text-verde md:text-6xl">
          {textos.h1Antes}
          <strong className="font-bold text-terracota">
            {textos.h1Destaque}
          </strong>
          {textos.h1Depois}
          <span className="text-terracota">.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-grafite/85">
          {textos.lead}
        </p>

        <div className="mt-16 space-y-12 text-left">
          <div>
            <h2 className="font-montserrat text-2xl font-semibold text-verde">
              {textos.quienesSomosTitulo}
            </h2>
            <p className="mt-4 leading-relaxed text-grafite/85">
              {textos.quienesSomos}
            </p>
          </div>
          <div>
            <h2 className="font-montserrat text-2xl font-semibold text-verde">
              {textos.queHacemosTitulo}
            </h2>
            <p className="mt-4 leading-relaxed text-grafite/85">
              {textos.queHacemos}
            </p>
          </div>
          <div>
            <p className="font-montserrat text-2xl font-semibold text-verde">
              {textos.cierre}
            </p>
            <Link
              href="/pt"
              className="mt-4 inline-block text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
            >
              {textos.linkPortugues}
            </Link>
          </div>
        </div>
      </section>
      <RioDeFibras className="pointer-events-none h-36 w-full" />
      <Rodape />
    </main>
  );
}
