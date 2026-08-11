import SistemaVsOrganograma from "@/components/home/grafismos/SistemaVsOrganograma";

/**
 * Bloco "Ponto de partida" — superfície translúcida de propósito:
 * a rede viva fixa segue visível atravessando a camada; à direita, o
 * argumento em um quadro: organograma fantasma parado contra a rede viva
 * que o ignora.
 */
export default function PontoDePartida() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-off-white/85">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-28 md:grid-cols-[1fr_1.15fr]">
        <div>
          <h2 className="font-montserrat text-4xl font-semibold leading-tight text-verde md:text-5xl">
            Toda organização é um sistema vivo.
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-grafite/90">
            <p>
              Cultura, estrutura, liderança, processos, relações e propósito
              estão conectados — e respondendo aos movimentos uns dos outros.
            </p>
            <p>
              E o que mantém esse sistema vivo não é o organograma. É o que
              acontece entre as pessoas: o conhecimento que circula, a
              confiança que sustenta, a diferença que gera ideia nova.
            </p>
            <p>
              Quando esses encontros acontecem, a organização aprende e se
              move sozinha. Quando se rompem, nem a melhor estratégia do mundo
              faz a empresa sair do lugar.
            </p>
          </div>
        </div>
        <SistemaVsOrganograma className="relative hidden h-[460px] md:block" />
      </div>
    </section>
  );
}
