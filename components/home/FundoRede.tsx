"use client";

import RedeViva from "@/components/rede/RedeViva";

/**
 * A rede fixa atrás de toda a home — as seções empilham por cima dela e,
 * nas transições e nas superfícies translúcidas, as linhas seguem visíveis
 * costurando as camadas.
 */
export default function FundoRede() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <RedeViva variante="claro" />
    </div>
  );
}
