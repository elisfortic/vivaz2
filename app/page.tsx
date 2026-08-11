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

export default function Home() {
  return (
    <main id="conteudo">
      <FundoRede />
      <PilhaSecoes>
        <Hero />
        <MoverSistemas />
        <PontoDePartida />
        <PorQueFalham />
        <Territorios />
        <QuemSomos />
        <ComoTrabalhamos />
        <Fechamento />
      </PilhaSecoes>
      <Rodape />
    </main>
  );
}
