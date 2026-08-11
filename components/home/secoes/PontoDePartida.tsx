import SistemaVsOrganograma from "@/components/home/grafismos/SistemaVsOrganograma";

/**
 * Bloco "Ponto de partida" — a narrativa vive dentro do grafismo:
 * os rótulos A Ilusão / A Realidade / O Risco carregam as linhas da copy;
 * a coluna esquerda fica com a abertura e a síntese.
 */
export default function PontoDePartida() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-28 md:grid-cols-[1fr_1.25fr]">
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
              Quando esses encontros acontecem, a organização aprende e se
              move sozinha.
            </p>
          </div>
        </div>
        <SistemaVsOrganograma className="relative hidden h-[540px] md:block" />
      </div>
    </section>
  );
}
