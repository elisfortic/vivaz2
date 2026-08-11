"use client";

import { useActionState } from "react";
import { enviarContato, type EstadoContato } from "@/lib/acoes/contato";
import { CONTATO_PAGINA } from "@/lib/copy/paginas";
import type { Idioma } from "@/lib/idiomas";

const inicial: EstadoContato = { status: "inicial" };

const estiloCampo =
  "w-full rounded-md border border-linha bg-off-white px-4 py-3 text-grafite outline-none transition-colors duration-300 focus:border-verde";

export default function FormularioContato({
  lang = "pt",
}: {
  lang?: Idioma;
}) {
  const [estado, agir, enviando] = useActionState(enviarContato, inicial);
  const t = CONTATO_PAGINA[lang];
  const invalido = (campo: string) =>
    estado.camposInvalidos?.includes(campo)
      ? t.erros[campo as keyof typeof t.erros]
      : undefined;

  if (estado.status === "sucesso") {
    return (
      <p className="max-w-xl rounded-md bg-verde px-6 py-5 text-off-white">
        {t.sucesso}
      </p>
    );
  }

  const Erro = ({ campo }: { campo: string }) => {
    const mensagem = invalido(campo);
    if (!mensagem) return null;
    return <p className="mt-1.5 text-sm text-terracota">{mensagem}</p>;
  };

  return (
    <form action={agir} className="max-w-xl space-y-6" noValidate>
      {/* honeypot — invisível para pessoas, irresistível para robôs */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-grafite">
          {t.campos.nome}
        </label>
        <input id="nome" name="nome" type="text" className={estiloCampo} />
        <Erro campo="nome" />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-grafite">
          {t.campos.email}
        </label>
        <input id="email" name="email" type="email" className={estiloCampo} />
        <Erro campo="email" />
      </div>

      <div>
        <label htmlFor="empresa" className="mb-1.5 block text-sm font-medium text-grafite">
          {t.campos.empresa}
        </label>
        <input id="empresa" name="empresa" type="text" className={estiloCampo} />
        <Erro campo="empresa" />
      </div>

      <div>
        <label htmlFor="cargo" className="mb-1.5 block text-sm font-medium text-grafite">
          {t.campos.cargo}
        </label>
        <input id="cargo" name="cargo" type="text" className={estiloCampo} />
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-grafite">
          {t.campos.mensagem}
        </label>
        <textarea id="mensagem" name="mensagem" rows={5} className={estiloCampo} />
        <Erro campo="mensagem" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-grafite/85">
          <input
            type="checkbox"
            name="consentimento"
            className="mt-1 h-4 w-4 accent-verde"
          />
          {t.campos.consentimento}
        </label>
        <Erro campo="consentimento" />
      </div>

      {estado.status === "erro" && !estado.camposInvalidos && (
        <p className="rounded-md bg-terracota/10 px-4 py-3 text-sm text-terracota">
          {t.erroEnvio}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-full bg-verde px-8 py-3.5 text-sm font-medium tracking-wide text-off-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
      >
        {t.botao}
      </button>
    </form>
  );
}
