"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const itens = [
  { rotulo: "Quem somos", href: "/quem-somos" },
  { rotulo: "O que movemos", href: "/o-que-movemos" },
  { rotulo: "Ponto de vista", href: "/ponto-de-vista" },
  { rotulo: "Contato", href: "/contato" },
];

/**
 * Header fixo que adapta a cor quando uma superfície verde passa por baixo
 * (fechamento, rodapé) — grafite sobre claro, off-white sobre verde.
 */
export default function Cabecalho() {
  const [sobreVerde, setSobreVerde] = useState(false);

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
      // só a faixa do header (top ~72px) conta
      { rootMargin: "0px 0px -92% 0px" },
    );
    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  const corLink = sobreVerde
    ? "text-off-white/85 hover:text-off-white"
    : "text-grafite/80 hover:text-verde";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={
              sobreVerde
                ? "/marca/vivaz-simbolo-branco.png"
                : "/marca/vivaz-simbolo.png"
            }
            alt="Vivaz"
            width={34}
            height={26}
            priority
          />
          <span
            className={`font-montserrat text-xl font-semibold tracking-wide transition-colors duration-500 ${
              sobreVerde ? "text-off-white" : "text-verde"
            }`}
          >
            Vivaz
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[15px] transition-colors duration-500 ${corLink}`}
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/contato"
          className={`text-[15px] transition-colors duration-500 md:hidden ${corLink}`}
        >
          Contato
        </Link>
      </div>
    </header>
  );
}
