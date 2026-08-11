import pt from "@/dictionaries/pt.json";
import es from "@/dictionaries/es.json";
import en from "@/dictionaries/en.json";

// ES/EN traduzidos e guardados em lib/copy/*, mas DESLIGADOS até o
// cliente aprovar a fase de idiomas — só português no ar (2026-08-11)
export const IDIOMAS = ["pt"] as const;
export type Idioma = (typeof IDIOMAS)[number];
/** os três idiomas dos módulos de copy (es/en dormentes até aprovação) */
export type IdiomaFuturo = "pt" | "es" | "en";

export const ehIdioma = (valor: string): valor is Idioma =>
  (IDIOMAS as readonly string[]).includes(valor);

const dicionarios = { pt, es, en };

export type DicionarioUnica = typeof es;

export const dicionario = (idioma: Idioma) => dicionarios[idioma];

const unicos = { es, en };

/** Dicionários das páginas únicas (ES real, EN aguardando tradução). */
export const dicionarioUnica = (idioma: "es" | "en"): DicionarioUnica =>
  unicos[idioma];
