import { NextResponse, type NextRequest } from "next/server";

const IDIOMAS = ["pt", "es", "en"] as const;

/** Detecta o idioma preferido do navegador entre os suportados. */
function detectar(pedido: NextRequest): string {
  const aceita = pedido.headers.get("accept-language") ?? "";
  for (const trecho of aceita.split(",")) {
    const codigo = trecho.split(";")[0]?.trim().slice(0, 2).toLowerCase();
    if ((IDIOMAS as readonly string[]).includes(codigo)) return codigo;
  }
  return "pt";
}

export function middleware(pedido: NextRequest) {
  const { pathname } = pedido.nextUrl;
  const temIdioma = IDIOMAS.some(
    (idioma) =>
      pathname === `/${idioma}` || pathname.startsWith(`/${idioma}/`),
  );
  if (temIdioma) return NextResponse.next();

  const url = pedido.nextUrl.clone();
  url.pathname = `/${detectar(pedido)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // tudo, exceto assets, API e a rota interna não listada
  matcher: [
    "/((?!_next|api|blocos-futuros|favicon.ico|marca|socias|grafismos|.*\\..*).*)",
  ],
};
