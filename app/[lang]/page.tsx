import FundoRede from "@/components/home/FundoRede";
import Hero from "@/components/home/Hero";
import PilhaSecoes from "@/components/home/PilhaSecoes";
import MoverSistemas from "@/components/home/secoes/MoverSistemas";
import PontoDePartida from "@/components/home/secoes/PontoDePartida";
import PorQueFalham from "@/components/home/secoes/PorQueFalham";
import Territorios from "@/components/home/secoes/Territorios";
import QuemSomos from "@/components/home/secoes/QuemSomos";
import ComoTrabalhamos from "@/components/home/secoes/ComoTrabalhamos";
import Fechamento from "@/components/home/secoes/Fechamento";
import Rodape from "@/components/ui/Rodape";
import { ehIdioma } from "@/lib/idiomas";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();

  return (
    <main id="conteudo">
      <FundoRede />
      <PilhaSecoes>
        <Hero lang={lang} />
        <MoverSistemas lang={lang} />
        <PontoDePartida lang={lang} />
        <PorQueFalham lang={lang} />
        <Territorios lang={lang} />
        <QuemSomos lang={lang} />
        <ComoTrabalhamos lang={lang} />
        <Fechamento lang={lang} />
      </PilhaSecoes>
      <Rodape lang={lang} />
    </main>
  );
}
