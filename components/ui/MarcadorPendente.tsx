/**
 * Marcador visível de conteúdo pendente — copy que ainda não existe nunca
 * é inventada (regra 1); fica sinalizada até o cliente entregar.
 */
export default function MarcadorPendente({ texto }: { texto: string }) {
  return (
    <p className="rounded-md border border-dashed border-terracota/40 bg-areia/40 px-4 py-3 text-sm italic leading-relaxed text-grafite/70">
      {`{{PENDENTE: ${texto}}}`}
    </p>
  );
}
