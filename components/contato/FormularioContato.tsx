"use client";

import { useActionState } from "react";
import { enviarContato, type EstadoContato } from "@/lib/acoes/contato";

const inicial: EstadoContato = { status: "inicial" };

const estiloCampo =
  "w-full rounded-md border border-linha bg-off-white px-4 py-3 text-grafite outline-none transition-colors duration-300 focus:border-verde";

function Erro({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return <p className="mt-1.5 text-sm text-terracota">{mensagem}</p>;
}

export default function FormularioContato() {
  const [estado, agir, enviando] = useActionState(enviarContato, inicial);
  const erros = estado.errosCampos ?? {};

  if (estado.status === "sucesso") {
    return (
      <p className="max-w-xl rounded-md bg-verde px-6 py-5 text-off-white">
        Mensagem enviada. Respondemos em até dois dias úteis.
      </p>
    );
  }

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
          Nome
        </label>
        <input id="nome" name="nome" type="text" className={estiloCampo} />
        <Erro mensagem={erros.nome} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-grafite">
          E-mail
        </label>
        <input id="email" name="email" type="email" className={estiloCampo} />
        <Erro mensagem={erros.email} />
      </div>

      <div>
        <label htmlFor="empresa" className="mb-1.5 block text-sm font-medium text-grafite">
          Empresa
        </label>
        <input id="empresa" name="empresa" type="text" className={estiloCampo} />
        <Erro mensagem={erros.empresa} />
      </div>

      <div>
        <label htmlFor="cargo" className="mb-1.5 block text-sm font-medium text-grafite">
          Cargo
        </label>
        <input id="cargo" name="cargo" type="text" className={estiloCampo} />
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-grafite">
          O que está acontecendo
        </label>
        <textarea id="mensagem" name="mensagem" rows={5} className={estiloCampo} />
        <Erro mensagem={erros.mensagem} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-grafite/85">
          <input
            type="checkbox"
            name="consentimento"
            className="mt-1 h-4 w-4 accent-verde"
          />
          Autorizo a Vivaz a usar meus dados para responder a este contato.
        </label>
        <Erro mensagem={erros.consentimento} />
      </div>

      {estado.status === "erro" && !estado.errosCampos && (
        <p className="rounded-md bg-terracota/10 px-4 py-3 text-sm text-terracota">
          Não foi possível enviar agora. Tente novamente ou escreva para{" "}
          {"{{E-MAIL}}"}.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-full bg-verde px-8 py-3.5 text-sm font-medium tracking-wide text-off-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
      >
        Enviar mensagem
      </button>
    </form>
  );
}
