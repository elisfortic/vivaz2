import RioDeFibras from "@/components/home/grafismos/RioDeFibras";
import { MOVER } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

export default function MoverSistemas({ lang = "pt" }: { lang?: Idioma }) {
  const t = MOVER[lang];
  return (
    <section
      id="definicao"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-off-white"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-8">
        <div className="max-w-3xl">
          <p className="mb-10 text-sm uppercase tracking-[0.22em] text-terracota">
            {t.eyebrow}
          </p>
          <p className="font-lato text-[1.7rem] font-light leading-snug text-verde md:text-[2.05rem]">
            {t.frase}
          </p>
          <p className="mt-8 text-lg leading-relaxed text-grafite/85 md:text-xl">
            {t.lead}
          </p>
          <p className="mt-12 max-w-2xl text-[18px] leading-relaxed text-grafite">
            <strong>{t.recusaDestaque}</strong>
            {t.recusa}
          </p>
        </div>
      </div>
      <RioDeFibras className="pointer-events-none mt-6 h-52 w-full" />
    </section>
  );
}
