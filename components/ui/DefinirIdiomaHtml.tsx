"use client";

import { useEffect } from "react";
import type { Idioma } from "@/lib/idiomas";

const HTML_LANG: Record<Idioma, string> = { pt: "pt-BR", es: "es" };

/** root layout não tem acesso ao segmento [lang]; ajusta <html lang> no cliente. */
export default function DefinirIdiomaHtml({ lang }: { lang: Idioma }) {
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  return null;
}
