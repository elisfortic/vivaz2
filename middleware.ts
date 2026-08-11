import { NextResponse, type NextRequest } from "next/server";

const IDIOMAS = ["pt", "es", "en"] as const;

/**
 * Só o espanhol tem página com conteúdo real — navegador em ES vai para
 * /es; qualquer outro idioma vai para /pt. /en (estrutura {{TRADUZIR}})
 * só é alcançável pelo seletor do rodapé, nunca por redirecionamento.
 */
function detectar(pedido: NextRequest): string {
  const aceita = pedido.headers.get("accept-language") ?? "";
  const principal = aceita.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return principal === "es" ? "es" : "pt";
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
