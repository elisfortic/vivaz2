/** Abertura padrão das páginas internas: eyebrow + H1 + lead. */
export default function CabecalhoPagina({
  eyebrow,
  titulo,
  lead,
}: {
  eyebrow: string;
  titulo: React.ReactNode;
  lead?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-40">
      <p className="mb-6 text-sm uppercase tracking-[0.22em] text-terracota">
        {eyebrow}
      </p>
      <h1 className="font-montserrat max-w-3xl text-4xl font-semibold leading-tight text-verde md:text-5xl">
        {titulo}
      </h1>
      {lead && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-grafite/85">
          {lead}
        </p>
      )}
    </div>
  );
}
