import Link from "next/link";

const territorios = [
  {
    numero: "01",
    titulo: "Cultura & Ética",
    corpo:
      "Transformação cultural, valores em uso versus valores declarados, ouvidoria, integridade e riscos psicossociais.",
    ancora: "cultura-etica",
  },
  {
    numero: "02",
    titulo: "Estrutura & Estratégia de Pessoas",
    corpo:
      "Estruturas organizacionais, governança, desempenho, sucessão, arquitetura de cargos e remuneração.",
    ancora: "estrutura-estrategia",
  },
  {
    numero: "03",
    titulo: "Liderança & Desenvolvimento",
    corpo:
      "Mentoria, coaching executivo, trilhas de capacitação sob medida e transformação de times.",
    ancora: "lideranca-desenvolvimento",
  },
  {
    numero: "04",
    titulo: "Transformação & Mudança",
    corpo:
      "Gestão de mudança, integração pós-M&A e comunicação interna em transformações amplas.",
    ancora: "transformacao-mudanca",
  },
];

export default function Territorios() {
  return (
    <section className="relative flex min-h-screen items-center bg-off-white/90">
      <div className="relative mx-auto w-full max-w-5xl px-6 py-28">
        <p className="mb-6 text-sm uppercase tracking-[0.22em] text-terracota">
          O que movemos
        </p>
        <h2 className="font-montserrat text-4xl font-semibold leading-tight text-verde md:text-5xl">
          Quatro territórios de atuação
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
          Nem todo projeto começa no mesmo lugar. Qualquer que seja a porta de
          entrada, lemos a organização como um sistema — porque mexer em uma
          parte sempre move as outras.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-linha bg-linha md:grid-cols-2">
          {territorios.map((terr) => (
            <Link
              key={terr.ancora}
              href={`/o-que-movemos#${terr.ancora}`}
              className="group block bg-off-white p-8 transition-colors duration-500 hover:bg-verde"
            >
              <span className="font-montserrat text-sm text-terracota">
                {terr.numero}
              </span>
              <h3 className="font-montserrat mt-3 text-2xl font-semibold text-verde transition-colors duration-500 group-hover:text-off-white">
                {terr.titulo}
              </h3>
              <p className="mt-4 leading-relaxed text-grafite/80 transition-colors duration-500 group-hover:text-off-white/85">
                {terr.corpo}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
