import Link from "next/link";
import Rodape from "@/components/ui/Rodape";

/**
 * Estrutura pronta para ES/EN nas rotas internas: a arquitetura existe,
 * o conteúdo aguarda tradução humana — nunca tradução automática
 * apresentada como final.
 */
export default function EstruturaTraduzir({
  idioma,
  rota,
}: {
  idioma: string;
  rota: string;
}) {
  return (
    <main
      id="conteudo"
      lang={idioma}
      className="flex min-h-screen flex-col bg-off-white"
    >
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-44">
        <h1 className="font-montserrat text-3xl font-semibold text-verde">
          {`{{TRADUZIR: ${rota}}}`}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite/70 italic">
          {`{{TRADUZIR: conteúdo desta rota aguarda tradução humana}}`}
        </p>
        <Link
          href={`/pt/${rota}`}
          className="mt-10 inline-block text-sm font-medium text-verde underline-offset-4 hover:text-terracota"
        >
          → /pt/{rota}
        </Link>
      </div>
      <Rodape />
    </main>
  );
}
