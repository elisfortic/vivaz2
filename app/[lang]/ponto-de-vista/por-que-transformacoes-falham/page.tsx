import type { Metadata } from "next";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import EstruturaTraduzir from "@/components/paginas/EstruturaTraduzir";

export const metadata: Metadata = {
  title: "Por que tantas transformações organizacionais falham · Vivaz",
};

export default async function ArtigoFalhamPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "pt") {
    return (
      <EstruturaTraduzir
        idioma={lang}
        rota="ponto-de-vista/por-que-transformacoes-falham"
      />
    );
  }
  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina
        eyebrow="Ponto de vista"
        titulo="Por que tantas transformações organizacionais falham"
      />

      <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <p className="text-sm text-grafite/70">
          Elisângela Chitero, Flavia Pilan e Leila Kido
        </p>
        <div className="mt-10 max-w-2xl space-y-4">
          <MarcadorPendente texto="ensaio a ser escrito pelas sócias (900–1.200 palavras). Estrutura acordada: 1. Abertura — não é falta de método; 2. Tese — transformação falha ao tratar partes isoladas de um sistema que precisa ser avaliado de maneira coordenada; 3. Caso 1 — estrutura sem cultura; 4. Caso 2 — liderança sem governança; 5. Caso 3 — valores sem avaliação; 6. O que fazer diferente — olhar de maneira coordenada como governança, processos e gestão interagem; 7. Fechamento — retomada da tagline" />
        </div>
      </article>

      <Rodape />
    </main>
  );
}
