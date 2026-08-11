import pt from "@/dictionaries/pt.json";
import es from "@/dictionaries/es.json";
import en from "@/dictionaries/en.json";

export const IDIOMAS = ["pt", "es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const ehIdioma = (valor: string): valor is Idioma =>
  (IDIOMAS as readonly string[]).includes(valor);

const dicionarios = { pt, es, en };

export type DicionarioUnica = typeof es;

export const dicionario = (idioma: Idioma) => dicionarios[idioma];

const unicos = { es, en };

/** Dicionários das páginas únicas (ES real, EN aguardando tradução). */
export const dicionarioUnica = (idioma: "es" | "en"): DicionarioUnica =>
  unicos[idioma];
