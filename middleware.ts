import { NextResponse, type NextRequest } from "next/server";

const IDIOMAS = ["pt", "es", "en"] as const;

/** Só português no ar — toda rota sem idioma vai para /pt. */
function detectar(_pedido: NextRequest): string {
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
