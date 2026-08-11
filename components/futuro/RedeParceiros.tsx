const EXEMPLOS = [
  "Arquitetura de remuneração",
  "Riscos psicossociais",
  "Integração pós-M&A",
  "Especialistas setoriais",
  "Comunicação de mudança",
];

/**
 * Bloco futuro: rede de parceiros. Fora do fluxo público até os nomes e
 * autorizações existirem. Frentes abaixo são ilustrativas e rotuladas.
 */
export default function RedeParceiros() {
  return (
    <section className="bg-off-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-terracota">
          EXEMPLO — conteúdo ilustrativo
        </p>
        <h2 className="font-montserrat text-3xl font-medium text-verde">
          A rede que cada projeto convoca
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-grafite">
          Cada projeto reúne o time certo, e não o time disponível.
        </p>
        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
          {EXEMPLOS.map((frente) => (
            <li
              key={frente}
              className="flex items-center gap-2.5 rounded-full border border-linha px-4 py-2 text-sm text-grafite"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-sage" aria-hidden />
              {frente}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
