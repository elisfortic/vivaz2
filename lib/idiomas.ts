import pt from "@/dictionaries/pt.json";
import es from "@/dictionaries/es.json";
import en from "@/dictionaries/en.json";

// ES no ar a partir de 2026-09-07 (pedido do cliente); EN segue traduzido
// em lib/copy/* mas DESLIGADO até aprovação.
export const IDIOMAS = ["pt", "es"] as const;
export type Idioma = (typeof IDIOMAS)[number];
/** os três idiomas dos módulos de copy (en dormente até aprovação) */
export type IdiomaFuturo = "pt" | "es" | "en";

export const ehIdioma = (valor: string): valor is Idioma =>
  (IDIOMAS as readonly string[]).includes(valor);

/** troca só o primeiro segmento (idioma) do caminho atual, preservando o resto */
export const caminhoComIdioma = (pathname: string, alvo: Idioma): string => {
  const partes = pathname.split("/");
  partes[1] = alvo;
  return partes.join("/") || `/${alvo}`;
};

const dicionarios = { pt, es, en };

export type DicionarioUnica = typeof es;

export const dicionario = (idioma: Idioma) => dicionarios[idioma];

const unicos = { es, en };

/** Dicionários das páginas únicas (ES real, EN aguardando tradução). */
export const dicionarioUnica = (idioma: "es" | "en"): DicionarioUnica =>
  unicos[idioma];
