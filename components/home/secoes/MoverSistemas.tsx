import RioDeFibras from "@/components/home/grafismos/RioDeFibras";

export default function MoverSistemas() {
  return (
    <section
      id="definicao"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-off-white"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-10">
        <div className="max-w-3xl">
        <p className="mb-10 text-sm uppercase tracking-[0.22em] text-terracota">
          Mover sistemas
        </p>
        <p className="font-lato text-[1.7rem] font-light leading-snug text-verde md:text-[2.05rem]">
          Construir uma governança fluida.
        </p>
        <p className="mt-8 text-lg leading-relaxed text-grafite/85 md:text-xl">
          Onde o conhecimento circula, onde a confiança sustenta as decisões e
          onde a diferença de opinião gera ideia nova em vez de conflito.
        </p>
        <p className="mt-12 max-w-2xl text-[18px] leading-relaxed text-grafite">
          <strong>Não desenvolvemos a estratégia da sua empresa.</strong>{" "}
          Conectamos a estratégia que já existe à cultura e à gestão de pessoas
          — para que ela deixe de ser uma intenção no papel e passe a acontecer
          no dia a dia.
        </p>
        </div>
      </div>
      <RioDeFibras className="pointer-events-none mt-6 h-52 w-full" />
    </section>
  );
}
