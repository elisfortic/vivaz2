const EXEMPLOS = [
  {
    setor: "Saúde",
    titulo: "Integração pós-M&A com cultura preservada",
    resumo:
      "Dois hospitais, duas culturas, um sistema novo — governança e rituais redesenhados em conjunto com as lideranças.",
  },
  {
    setor: "Serviços financeiros",
    titulo: "Sucessão que destravou a estratégia",
    resumo:
      "Mapa de talentos e arquitetura de cargos conectados ao plano de crescimento — decisões que antes travavam no comitê.",
  },
  {
    setor: "Agronegócio",
    titulo: "Valores que chegaram à avaliação",
    resumo:
      "Do quadro na parede ao ciclo de desempenho: comportamentos observáveis e consequências reais.",
  },
];

/**
 * Bloco futuro: cases. Fora do fluxo público até haver cases nomeáveis e
 * autorizados. Conteúdo abaixo é ilustrativo e rotulado.
 */
export default function Cases() {
  return (
    <section className="bg-areia px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-terracota">
          EXEMPLO — conteúdo ilustrativo
        </p>
        <h2 className="font-montserrat text-3xl font-medium text-verde">
          Sistemas que se moveram
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {EXEMPLOS.map((caso) => (
            <article key={caso.titulo}>
              <p className="text-xs uppercase tracking-[0.18em] text-grafite/60">
                {caso.setor}
              </p>
              <h3 className="font-montserrat mt-2 text-xl font-medium text-verde">
                {caso.titulo}
              </h3>
              <p className="mt-3 leading-relaxed text-grafite">
                {caso.resumo}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
