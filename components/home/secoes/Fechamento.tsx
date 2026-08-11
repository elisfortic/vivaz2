import Image from "next/image";
import Link from "next/link";
import RedeViva from "@/components/rede/RedeViva";
import { FECHAMENTO } from "@/lib/copy/home";
import type { Idioma } from "@/lib/idiomas";

export default function Fechamento({ lang = "pt" }: { lang?: Idioma }) {
  const t = FECHAMENTO[lang];
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-verde">
      <div className="absolute inset-0" aria-hidden="true">
        <RedeViva variante="verde" seed={20260812} />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <h2 className="font-montserrat text-4xl font-semibold leading-tight text-off-white md:text-6xl">
          {t.h2Antes}
          <strong className="font-bold text-terracota">{t.h2Destaque}</strong>
          {t.h2Depois}
          <span className="text-terracota">.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-off-white/85">
          {t.corpo}
        </p>
        <Link
          href={`/${lang}/contato`}
          className="mt-12 inline-block rounded-full bg-off-white px-8 py-3.5 text-sm font-medium tracking-wide text-verde transition-transform duration-300 hover:scale-[1.03]"
        >
          {t.botao}
        </Link>
      </div>

      <Image
        src="/marca/vivaz-simbolo-branco.png"
        alt=""
        aria-hidden="true"
        width={380}
        height={290}
        className="pointer-events-none absolute -bottom-10 -right-6 h-auto opacity-[0.07]"
      />
    </section>
  );
}
