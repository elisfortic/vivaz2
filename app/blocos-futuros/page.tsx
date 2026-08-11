import type { Metadata } from "next";
import Cabecalho from "@/components/ui/Cabecalho";
import Rodape from "@/components/ui/Rodape";
import Depoimentos from "@/components/futuro/Depoimentos";
import Cases from "@/components/futuro/Cases";
import RedeParceiros from "@/components/futuro/RedeParceiros";

export const metadata: Metadata = {
  title: "Blocos do estado futuro · Vivaz (interno)",
  robots: { index: false, follow: false },
};

/**
 * Rota não listada: prévia interna dos blocos que entram no site quando
 * houver conteúdo real autorizado. Nada aqui aparece em página pública.
 */
export default function BlocosFuturosPagina() {
  return (
    <main id="conteudo" className="bg-off-white">
      <Cabecalho
        hrefInicio="/pt"
        itens={[
          { rotulo: "Quem somos", href: "/pt/quem-somos" },
          { rotulo: "O que movemos", href: "/pt/o-que-movemos" },
          { rotulo: "Ponto de vista", href: "/pt/ponto-de-vista" },
          { rotulo: "Contato", href: "/pt/contato" },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-40">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
          Prévia interna
        </p>
        <h1 className="titulo-h2 max-w-3xl">
          Blocos do estado futuro
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite">
          Três blocos prontos, fora do ar, aguardando conteúdo real:
          depoimentos, cases e rede de parceiros. Os textos são exemplos
          ilustrativos — nunca serão publicados como reais.
        </p>
      </div>
      <div className="mt-10">
        <Depoimentos />
        <Cases />
        <RedeParceiros />
      </div>
      <Rodape />
    </main>
  );
}
