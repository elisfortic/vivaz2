import SistemaVsOrganograma from "@/components/home/grafismos/SistemaVsOrganograma";
import { PONTO_DE_PARTIDA } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

/**
 * Bloco "Ponto de partida" — a narrativa vive dentro do grafismo:
 * os rótulos A Ilusão / A Realidade / O Risco carregam as linhas da copy;
 * a coluna esquerda fica com a abertura e a síntese.
 */
export default function PontoDePartida({ lang = "pt" }: { lang?: Idioma }) {
  const t = PONTO_DE_PARTIDA[lang];
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-off-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 short:gap-6 px-6 py-28 short:pb-8 short:pt-28 md:grid-cols-[1fr_1.25fr]">
        <div>
          <h2 className="titulo-manifesto">
            {t.h2}
          </h2>
          <div className="mt-10 short:mt-5 space-y-6 short:space-y-3 text-lg leading-relaxed text-grafite">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
          </div>
        </div>
        <SistemaVsOrganograma
          rotulos={t.rotulos}
          className="relative hidden h-[540px] short:h-[380px] md:block"
        />
      </div>
    </section>
  );
}
