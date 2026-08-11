import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import ComoTrabalhamos from "@/components/home/secoes/ComoTrabalhamos";
import TrioAncoragem from "@/components/home/grafismos/TrioAncoragem";
import RedeEspecialistas from "@/components/home/grafismos/RedeEspecialistas";
import { QUEM_SOMOS_PAGINA, GRAFISMOS_DECK } from "@/lib/copy/paginas";
import { ehIdioma } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Quem somos · Vivaz",
};

const socias = [
  {
    nome: "Elisângela Chitero",
    foto: "/socias/elisangela.jpg",
    linkedin: "https://www.linkedin.com/in/elisangelafortichitero/",
  },
  {
    nome: "Flavia Pilan",
    foto: "/socias/flavia.jpg",
    linkedin: "https://www.linkedin.com/in/flaviavassere/",
  },
  {
    nome: "Leila Kido",
    foto: "/socias/leila.jpg",
    linkedin: "https://www.linkedin.com/in/leila-kido-3064179/",
  },
];

/**
 * Estrutura da Opção A com os motores vivos da B: abertura em areia com o
 * trio de ancoragem VIVO à direita; sócias em cards horizontais compactos;
 * Como trabalhamos (anel vivo); rede de especialistas VIVA no fechamento.
 */
export default async function QuemSomosPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = QUEM_SOMOS_PAGINA[lang];
  const deck = GRAFISMOS_DECK[lang];

  return (
    <main id="conteudo" className="bg-off-white">
      {/* abertura + propósito — areia, trio vivo à direita */}
      <section className="overflow-hidden bg-areia">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-40 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
                {t.eyebrow}
              </p>
              <h1 className="titulo-h2">{t.h1}</h1>
            </div>
            <p className="texto-deck">{t.lead}</p>
            <hr className="m-0 h-px border-0 bg-grafite/20" />
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
                Propósito
              </p>
              <p className="titulo-manifesto">{t.proposito}</p>
            </div>
            <p className="leading-relaxed text-verde">{t.descritor}</p>
          </div>
          <div className="relative hidden h-[560px] md:block">
            <div className="absolute -inset-x-16 -inset-y-10">
              <TrioAncoragem
                ativa={null}
                discos
                style={{
                  WebkitMaskImage:
                    "radial-gradient(115% 105% at 50% 50%, black 58%, transparent 96%)",
                  maskImage:
                    "radial-gradient(115% 105% at 50% 50%, black 58%, transparent 96%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* sócias — cards horizontais compactos (medida da A) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-16">
          {socias.map((socia, i) => (
            <article
              key={socia.nome}
              className="flex flex-col items-start gap-6 sm:flex-row sm:gap-12"
            >
              <div className="relative aspect-[3/4] w-full max-w-[200px] shrink-0 overflow-hidden rounded-md sm:max-w-[220px]">
                <Image
                  src={socia.foto}
                  alt={socia.nome}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-montserrat text-xl font-medium text-verde">
                  {socia.nome}
                </h2>
                <p className="max-w-[680px] text-[15px] leading-relaxed text-grafite">
                  {t.bios[i]}
                </p>
                <a
                  href={socia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-verde underline-offset-4 transition-colors duration-300 hover:text-terracota"
                >
                  LinkedIn →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ComoTrabalhamos lang={lang} />

      {/* rede de especialistas — grafismo vivo (motivo rede.png) */}
      <section className="overflow-hidden bg-areia">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="titulo-h2 max-w-2xl">{t.redeH2}</h2>
          <div className="mt-6 max-w-[680px] space-y-4 leading-relaxed text-grafite">
            <p>{t.redeP1}</p>
            <p>{t.redeP2}</p>
          </div>
          <RedeEspecialistas
            frentes={deck.frentesRede}
            className="relative mx-auto mt-12 hidden h-[440px] w-full max-w-[900px] md:block"
          />
          <div className="mt-12 max-w-2xl">
            <MarcadorPendente texto={t.pendenteSelos} />
          </div>
        </div>
      </section>

      <Rodape lang={lang} />
    </main>
  );
}
