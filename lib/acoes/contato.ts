"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

/** Erros com as mensagens exatas da copy (04-copy-final.md). */
const esquema = z.object({
  nome: z.string().trim().min(1, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  empresa: z.string().trim().min(1, "Informe a empresa."),
  cargo: z.string().trim().optional(),
  mensagem: z
    .string()
    .trim()
    .min(1, "Conte um pouco sobre o momento da organização."),
  consentimento: z.literal("on", {
    error: "Precisamos da sua autorização para responder.",
  }),
});

export interface EstadoContato {
  status: "inicial" | "sucesso" | "erro";
  errosCampos?: Record<string, string>;
}

// rate limit simples em memória: 5 envios por IP por hora
const envios = new Map<string, number[]>();
const LIMITE = 5;
const JANELA_MS = 60 * 60 * 1000;

export async function enviarContato(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  // honeypot: campo invisível preenchido = robô; finge sucesso
  if (dados.get("website")) {
    return { status: "sucesso" };
  }

  const cabecalhos = await headers();
  const ip =
    cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const agora = Date.now();
  const historico = (envios.get(ip) ?? []).filter(
    (ts) => agora - ts < JANELA_MS,
  );
  if (historico.length >= LIMITE) {
    return { status: "erro" };
  }

  const resultado = esquema.safeParse({
    nome: dados.get("nome"),
    email: dados.get("email"),
    empresa: dados.get("empresa"),
    cargo: dados.get("cargo") ?? undefined,
    mensagem: dados.get("mensagem"),
    consentimento: dados.get("consentimento"),
  });
  if (!resultado.success) {
    const errosCampos: Record<string, string> = {};
    for (const problema of resultado.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !errosCampos[campo]) {
        errosCampos[campo] = problema.message;
      }
    }
    return { status: "erro", errosCampos };
  }

  const chave = process.env.RESEND_API_KEY;
  const destino = process.env.CONTATO_DESTINO; // {{PENDENTE: contato@}}
  if (!chave || !destino) {
    // caixas ainda não existem — registra e falha com a mensagem da copy
    console.error("contato: RESEND_API_KEY/CONTATO_DESTINO não configurados");
    return { status: "erro" };
  }

  const { nome, email, empresa, cargo, mensagem } = resultado.data;
  try {
    const resend = new Resend(chave);
    const { error } = await resend.emails.send({
      from: process.env.CONTATO_REMETENTE ?? "Vivaz <onboarding@resend.dev>",
      to: destino,
      replyTo: email,
      subject: `Contato pelo site — ${nome} (${empresa})`,
      text: [
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        `Empresa: ${empresa}`,
        `Cargo: ${cargo || "—"}`,
        "",
        mensagem,
      ].join("\n"),
    });
    if (error) {
      console.error("contato: falha no envio", error);
      return { status: "erro" };
    }
    envios.set(ip, [...historico, agora]);
    return { status: "sucesso" };
  } catch (erro: unknown) {
    console.error("contato: exceção no envio", erro);
    return { status: "erro" };
  }
}
