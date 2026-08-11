const EXEMPLOS = [
  {
    quote:
      "A Vivaz nos ajudou a enxergar a organização como um sistema — e a mudança finalmente saiu do papel.",
    autor: "Nome Sobrenome",
    cargo: "CHRO, Empresa",
  },
  {
    quote:
      "Não entregaram um relatório: destravaram conversas que a gente adiava havia anos.",
    autor: "Nome Sobrenome",
    cargo: "CEO, Empresa",
  },
];

/**
 * Bloco futuro: depoimentos. Fora do fluxo público até haver depoimentos
 * reais autorizados. Conteúdo abaixo é ilustrativo e rotulado.
 */
export default function Depoimentos() {
  return (
    <section className="bg-off-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-terracota">
          EXEMPLO — conteúdo ilustrativo
        </p>
        <h2 className="font-montserrat text-3xl font-medium text-verde">
          O que dizem sobre mover sistemas
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {EXEMPLOS.map((depoimento) => (
            <figure
              key={depoimento.quote.slice(0, 20)}
              className="border-l-2 border-terracota pl-6"
            >
              <blockquote className="font-lato text-xl font-light leading-relaxed text-grafite">
                “{depoimento.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-grafite/70">
                <span className="font-montserrat font-medium text-verde">
                  {depoimento.autor}
                </span>{" "}
                · {depoimento.cargo}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
