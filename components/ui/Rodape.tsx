import Link from "next/link";

const itens = [
  { rotulo: "Quem somos", href: "/quem-somos" },
  { rotulo: "O que movemos", href: "/o-que-movemos" },
  { rotulo: "Ponto de vista", href: "/ponto-de-vista" },
  { rotulo: "Contato", href: "/contato" },
  { rotulo: "Privacidade", href: "/privacidade" },
];

export default function Rodape() {
  return (
    <footer className="relative z-10 bg-verde px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2">
          {itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-off-white/75 transition-colors duration-300 hover:text-off-white"
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-off-white/60">© 2026 Vivaz Consultoria</p>
      </div>
    </footer>
  );
}
