import type { Metadata } from "next";
import CabecalhoPagina from "@/components/ui/CabecalhoPagina";
import MarcadorPendente from "@/components/ui/MarcadorPendente";
import Rodape from "@/components/ui/Rodape";

export const metadata: Metadata = {
  title: "Privacidade · Vivaz",
  robots: { index: false },
};

export default function PrivacidadePagina() {
  return (
    <main id="conteudo" className="flex min-h-screen flex-col bg-off-white">
      <CabecalhoPagina eyebrow="Privacidade" titulo="Privacidade" />
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="max-w-2xl">
          <MarcadorPendente texto="política de privacidade (LGPD) a ser fornecida pela cliente — nenhum texto legal é redigido pelo site" />
        </div>
      </section>
      <Rodape />
    </main>
  );
}
