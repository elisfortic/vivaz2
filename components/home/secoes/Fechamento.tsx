import Image from "next/image";
import Link from "next/link";
import RedeViva from "@/components/rede/RedeViva";

export default function Fechamento() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-verde">
      <div className="absolute inset-0" aria-hidden="true">
        <RedeViva variante="verde" seed={20260812} />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <h2 className="font-montserrat text-4xl font-semibold leading-tight text-off-white md:text-6xl">
          Pessoas que{" "}
          <strong className="font-bold text-terracota">movem</strong> sistemas
          <span className="text-terracota">.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-off-white/85">
          Se você está diante de uma mudança que precisa acontecer ao mesmo
          tempo na cultura, na estrutura e na gestão — vamos conversar.
        </p>
        <Link
          href="/contato"
          className="mt-12 inline-block rounded-full bg-off-white px-8 py-3.5 text-sm font-medium tracking-wide text-verde transition-transform duration-300 hover:scale-[1.03]"
        >
          Converse com uma sócia
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
