"use client";

import RedeViva from "@/components/rede/RedeViva";

/**
 * A rede fixa atrás de toda a home — as seções empilham por cima dela e,
 * nas transições e nas superfícies translúcidas, as linhas seguem visíveis
 * costurando as camadas.
 */
export default function FundoRede() {
  return (
    // começa abaixo da faixa do header — nós nunca passam atrás do menu
    <div className="fixed inset-x-0 bottom-0 top-[88px] z-0" aria-hidden="true">
      <RedeViva variante="claro" />
    </div>
  );
}
