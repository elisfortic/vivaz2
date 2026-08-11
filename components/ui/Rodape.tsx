import Link from "next/link";
import { dicionario, type Idioma } from "@/lib/idiomas";

export default function Rodape({ lang = "pt" }: { lang?: Idioma }) {
  const t = dicionario(lang);
  const itens = [
    { rotulo: t.nav.quemSomos, href: `/${lang}/quem-somos` },
    { rotulo: t.nav.oQueMovemos, href: `/${lang}/o-que-movemos` },
    { rotulo: t.nav.pontoDeVista, href: `/${lang}/ponto-de-vista` },
    { rotulo: t.nav.contato, href: `/${lang}/contato` },
    { rotulo: t.nav.privacidade, href: `/${lang}/privacidade` },
  ];

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
        {/* seletor de idioma volta quando a fase ES/EN for aprovada */}
        <p className="text-xs text-off-white/60">{t.rodape.copyright}</p>
      </div>
    </footer>
  );
}
