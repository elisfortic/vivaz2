import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import ProvedorLenis from "@/components/ui/ProvedorLenis";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vivaz · Pessoas que movem sistemas",
  description:
    "Conectamos estratégia, cultura e gestão para organizações que precisam se mover.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${lato.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-verde focus:px-4 focus:py-2 focus:text-off-white"
        >
          Ir para o conteúdo
        </a>
        <ProvedorLenis />
        {children}
      </body>
    </html>
  );
}
