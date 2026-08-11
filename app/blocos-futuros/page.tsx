import type { Metadata } from "next";
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
      <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-40">
        <p className="mb-6 text-sm uppercase tracking-[0.22em] text-terracota">
          Prévia interna
        </p>
        <h1 className="font-montserrat max-w-3xl text-4xl font-semibold leading-tight text-verde">
          Blocos do estado futuro
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
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
