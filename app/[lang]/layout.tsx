import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Cabecalho from "@/components/ui/Cabecalho";
import DefinirIdiomaHtml from "@/components/ui/DefinirIdiomaHtml";
import { IDIOMAS, dicionario, ehIdioma } from "@/lib/idiomas";

export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!ehIdioma(lang)) return {};
  const t = dicionario(lang);
  return {
    title: t.metadados.titulo,
    description: t.metadados.descricao,
    alternates: {
      canonical: `/${lang}`,
      languages: { "pt-BR": "/pt", es: "/es", en: "/en" },
    },
  };
}

export default async function LayoutIdioma({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = dicionario(lang);
  const itens = [
    { rotulo: t.nav.quemSomos, href: `/${lang}/quem-somos` },
    { rotulo: t.nav.oQueMovemos, href: `/${lang}/o-que-movemos` },
    { rotulo: t.nav.pontoDeVista, href: `/${lang}/ponto-de-vista` },
    { rotulo: t.nav.contato, href: `/${lang}/contato` },
  ];
  return (
    <>
      <DefinirIdiomaHtml lang={lang} />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-verde focus:px-4 focus:py-2 focus:text-off-white"
      >
        {t.acessibilidade.pularParaConteudo}
      </a>
      <Cabecalho itens={itens} hrefInicio={`/${lang}`} lang={lang} />
      {children}
    </>
  );
}
