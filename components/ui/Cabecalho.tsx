"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface ItemNav {
  rotulo: string;
  href: string;
}

/**
 * Header fixo que adapta a cor quando uma superfície verde passa por baixo
 * (fechamento, rodapé) — grafite sobre claro, off-white sobre verde.
 * Em telas estreitas, menu de sobreposição. Itens chegam por prop (i18n).
 */
export default function Cabecalho({
  itens,
  hrefInicio = "/",
}: {
  itens: ItemNav[];
  hrefInicio?: string;
}) {
  const [sobreVerde, setSobreVerde] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const alvos = document.querySelectorAll(
      "section.bg-verde, footer.bg-verde",
    );
    if (alvos.length === 0) return;
    const visiveis = new Set<Element>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visiveis.add(entrada.target);
          else visiveis.delete(entrada.target);
        }
        setSobreVerde(visiveis.size > 0);
      },
      // só a faixa do header (top ~86px) conta
      { rootMargin: "0px 0px -92% 0px" },
    );
    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // trava o scroll com o menu aberto
  useEffect(() => {
    document.documentElement.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [aberto]);

  const claro = sobreVerde && !aberto;
  const corLink = claro
    ? "text-off-white/85 hover:text-off-white"
    : "text-grafite/80 hover:text-verde";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 py-[26px] ${
          aberto ? "bg-off-white" : ""
        }`}
      >
        <Link href={hrefInicio} className="flex items-center gap-2.5">
          <Image
            src={
              claro
                ? "/marca/vivaz-simbolo-branco.png"
                : "/marca/vivaz-simbolo.png"
            }
            alt="Vivaz"
            width={44}
            height={34}
            priority
          />
          <span
            className={`font-montserrat text-2xl font-semibold tracking-wide transition-colors duration-500 ${
              claro ? "text-off-white" : "text-verde"
            }`}
          >
            Vivaz
          </span>
        </Link>

        <nav className="hidden items-center gap-[30px] md:flex">
          {itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[16px] tracking-[0.01em] transition-colors duration-500 ${corLink}`}
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>

        {/* menu mobile */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-[2px] w-6 rounded transition-all duration-300 ${
              claro ? "bg-off-white" : "bg-verde"
            } ${aberto ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-6 rounded transition-all duration-300 ${
              claro ? "bg-off-white" : "bg-verde"
            } ${aberto ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-6 rounded transition-all duration-300 ${
              claro ? "bg-off-white" : "bg-verde"
            } ${aberto ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {aberto && (
        <nav className="flex h-[calc(100vh-86px)] flex-col gap-8 bg-off-white px-8 pt-12 md:hidden">
          {itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="font-montserrat text-2xl font-semibold text-verde"
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
