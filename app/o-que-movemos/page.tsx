import type { Metadata } from "next";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import Rodape from "@/components/ui/Rodape";
import FibraTerritorios from "@/components/home/grafismos/FibraTerritorios";

export const metadata: Metadata = {
  title: "O que movemos · Vivaz",
};

const territorios = [
  {
    numero: "01",
    titulo: "Cultura & Ética",
    ancora: "cultura-etica",
    paragrafos: [
      "Apoiamos a evolução organizacional. Lemos a empresa em profundidade — atuamos em transformação cultural, mapeamos valores em uso versus valores declarados, padrões de comportamentos, processos, símbolos e prontidão para mudança.",
      "Estruturamos canais de ouvidoria, programas de integridade, riscos psicossociais e práticas de qualidade das relações que vão além do compliance.",
    ],
  },
  {
    numero: "02",
    titulo: "Estrutura & Estratégia de Pessoas",
    ancora: "estrutura-estrategia",
    paragrafos: [
      "Redesenhamos estruturas organizacionais, governança e modelos de gestão de pessoas — competências, gestão de desempenho, mapeamento de talentos, sucessão e proposta de valor para o colaborador.",
      "Trabalhamos a arquitetura de cargos e modelos de remuneração conectando estratégia de negócio à estratégia de pessoas.",
    ],
  },
  {
    numero: "03",
    titulo: "Liderança & Desenvolvimento",
    ancora: "lideranca-desenvolvimento",
    paragrafos: [
      "Conduzimos mentoria individual e coletiva, coaching executivo, desenhamos e implementamos trilhas de capacitação sob medida e facilitamos processos de transformação de times.",
      "Atuamos no desenvolvimento de lideranças em todos os níveis, sempre conectado aos desafios reais do negócio.",
    ],
  },
  {
    numero: "04",
    titulo: "Transformação & Mudança",
    ancora: "transformacao-mudanca",
    paragrafos: [
      "Conduzimos gestão de mudança, integração pós-M&A e comunicação interna. Atuamos como parceiros estratégicos em processos de transformação organizacional ampla — desenhando, conduzindo e sustentando mudanças que precisam acontecer simultaneamente na cultura, nas estruturas e nas práticas de gestão.",
    ],
  },
];

export default function OQueMovemosPagina() {
  return (
    <main id="conteudo" className="bg-off-white">
      <CabecalhoPagina
        eyebrow="O que movemos"
        titulo="Quatro territórios de atuação"
        lead="Nem todo projeto começa no mesmo lugar. Alguns pedem um diagnóstico amplo; outros, uma intervenção precisa. O que não muda é o olhar: qualquer que seja a porta de entrada, lemos a organização como um sistema — porque mexer em uma parte sempre move as outras."
      />

      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <FibraTerritorios className="pointer-events-none absolute -inset-x-6 inset-y-0 hidden h-full w-[calc(100%+48px)] md:block" />
        <div className="relative grid gap-y-16 md:grid-cols-2 md:gap-x-[120px] md:gap-y-[90px]">
          {territorios.map((terr) => (
            <article
              key={terr.ancora}
              id={terr.ancora}
              className="max-w-md scroll-mt-32 md:pl-10"
            >
              <span className="font-montserrat text-xl font-semibold text-terracota">
                {terr.numero}
              </span>
              <h2 className="font-montserrat mt-2 text-2xl font-semibold text-verde">
                {terr.titulo}
              </h2>
              {terr.paragrafos.map((paragrafo) => (
                <p
                  key={paragrafo.slice(0, 24)}
                  className="mt-4 leading-relaxed text-grafite/80"
                >
                  {paragrafo}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <Rodape />
    </main>
  );
}
