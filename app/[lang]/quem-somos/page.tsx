import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import ComoTrabalhamos from "@/components/home/secoes/ComoTrabalhamos";
import RioDeFibras from "@/components/home/grafismos/RioDeFibras";
import { QUEM_SOMOS_PAGINA } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Quem somos · Vivaz",
};

const socias = [
  { nome: "Elisângela Chitero", foto: "/socias/elisangela.jpg" },
  { nome: "Flavia Pilan", foto: "/socias/flavia.jpg" },
  { nome: "Leila Kido", foto: "/socias/leila.jpg" },
];

export default async function QuemSomosPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = QUEM_SOMOS_PAGINA[lang];

  return (
    <main id="conteudo" className="bg-off-white">
      <CabecalhoPagina eyebrow={t.eyebrow} titulo={t.h1} lead={t.lead} />

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <p className="font-montserrat max-w-3xl text-2xl font-medium leading-snug text-verde md:text-3xl">
          {t.proposito}
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
          {t.descritor}
        </p>
        <div className="mt-8 max-w-2xl">
          <MarcadorPendente texto={t.pendenteGeografia} />
        </div>
      </section>

      <RioDeFibras className="pointer-events-none h-32 w-full" />

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          {socias.map((socia, i) => (
            <article key={socia.nome}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md border-[3px] border-verde">
                <Image
                  src={socia.foto}
                  alt={socia.nome}
                  fill
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
              <h2 className="font-montserrat mt-5 text-xl font-semibold text-verde">
                {socia.nome}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-grafite/80">
                {t.bios[i]}
              </p>
              <div className="mt-4">
                <MarcadorPendente texto={t.pendenteLinkedin} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <ComoTrabalhamos lang={lang} />

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="font-montserrat max-w-2xl text-3xl font-semibold leading-tight text-verde md:text-4xl">
          {t.redeH2}
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-grafite/85">
          <p>{t.redeP1}</p>
          <p>{t.redeP2}</p>
        </div>
        <div className="mt-10 max-w-2xl">
          <MarcadorPendente texto={t.pendenteSelos} />
        </div>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
