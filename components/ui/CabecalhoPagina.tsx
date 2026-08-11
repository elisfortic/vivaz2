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
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-terracota">
        {eyebrow}
      </p>
      <h1 className="titulo-h2 max-w-3xl">
        {titulo}
      </h1>
      {lead && (
        <p className="texto-deck mt-6 max-w-2xl">
          {lead}
        </p>
      )}
    </div>
  );
}
