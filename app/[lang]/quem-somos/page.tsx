import type { Metadata } from "next";
import Image from "next/image";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";
import ComoTrabalhamos from "@/components/home/secoes/ComoTrabalhamos";
import EstruturaTraduzir from "@/components/paginas/EstruturaTraduzir";

export const metadata: Metadata = {
  title: "Quem somos · Vivaz",
};

const socias = [
  {
    nome: "Elisângela Chitero",
    foto: "/socias/elisangela.jpg",
    bio: "25 anos atuando em Recursos Humanos em Grupo Ultra, Hospital Albert Einstein, Natura, Hering e Nutrien Soluções Agrícolas, com foco em desenvolvimento de liderança, cultura, transformação organizacional, carreira e reestruturação pós-M&A. Desde 2022 atuando como Consultora e Professora convidada da Universidade Israelita Albert Einstein. Formação em Administração pela Universidade Estadual de Maringá. MBA em Recursos Humanos pela FIA-USP. Formação em Coaching, Mentoring e Transformação Cultural pelo Barrett Institute.",
  },
  {
    nome: "Flavia Pilan",
    foto: "/socias/flavia.jpg",
    bio: "Trajetória executiva ao lado de CEOs e lideranças sênior em Credicard, Hospital Albert Einstein, Banco BV e Natura, onde liderou a área de RH do Natura Pay. Atua em transformação organizacional, fortalecimento de liderança e construção de ambientes de alta performance — combinando visão sistêmica, pragmatismo e escuta qualificada para traduzir desafios complexos em decisão e execução. MBA em Recursos Humanos pela FIA-USP. Formação em Conselho Administrativo pelo IBGC.",
  },
  {
    nome: "Leila Kido",
    foto: "/socias/leila.jpg",
    bio: "30 anos em Recursos Humanos, Ouvidoria & Qualidade das Relações em BankBoston, Banco Itaú e Natura, em posições de liderança regional e global, conduzindo transformação organizacional e integração pós-M&A. Consultora e professora associada da FIA-USP, com formação adicional em Psicanálise. Formação em Administração pela FEA-USP. MBA em Gestão de Negócios pela Boston School com módulo internacional pela Universidade de Nova York.",
  },
];

export default async function QuemSomosPagina({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "pt") {
    return <EstruturaTraduzir idioma={lang} rota="quem-somos" />;
  }
  return (
    <main id="conteudo" className="bg-off-white">
      <CabecalhoPagina
        eyebrow="Quem somos"
        titulo="Três percursos, um trio alinhado em valores."
        lead="Carreira executiva em algumas das organizações mais complexas do país — e a decisão de colocar essa experiência a serviço de empresas que precisam mover seus sistemas."
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <p className="font-montserrat max-w-3xl text-2xl font-medium leading-snug text-verde md:text-3xl">
          Mover sistemas para que pessoas e organizações cresçam juntas — com
          profundidade humana e clareza metodológica.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
          Transformação organizacional que continua depois que a gente sai.
        </p>
        <div className="mt-8 max-w-2xl">
          <MarcadorPendente texto='Q-I — texto sobre "Entre o Brasil e a Europa" e o modelo de presença nos projetos' />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          {socias.map((socia) => (
            <article key={socia.nome}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <Image
                  src={socia.foto}
                  alt={socia.nome}
                  fill
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-cover"
                />
              </div>
              <h2 className="font-montserrat mt-5 text-xl font-semibold text-verde">
                {socia.nome}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-grafite/80">
                {socia.bio}
              </p>
              <div className="mt-4">
                <MarcadorPendente texto="URL do LinkedIn" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <ComoTrabalhamos />

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="font-montserrat max-w-2xl text-3xl font-semibold leading-tight text-verde md:text-4xl">
          Ninguém se desenvolve sozinho — inclusive nós.
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-grafite/85">
          <p>
            Acreditamos que o conhecimento circula pelas relações. Por isso a
            Vivaz opera com uma rede de especialistas convidados em frentes
            onde a profundidade técnica exige quem vive aquilo todos os dias —
            de arquitetura de remuneração a temas específicos de cada setor.
          </p>
          <p>Cada projeto reúne o time certo, e não o time disponível.</p>
        </div>
        <div className="mt-10 max-w-2xl">
          <MarcadorPendente texto="autorização de uso das marcas FIA-USP, IBGC, Barrett Institute, Universidade Israelita Albert Einstein — listar como texto até a liberação" />
        </div>
      </section>

      <Rodape />
    </main>
  );
}
