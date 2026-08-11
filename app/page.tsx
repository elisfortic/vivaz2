import FioCondutor from "@/components/home/FioCondutor";
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

export default function Home() {
  return (
    <main id="conteudo">
      <FundoRede />
      <FioCondutor />
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
      <footer className="relative z-10 bg-verde px-6 py-6 text-center text-xs text-off-white/60">
        © 2026 Vivaz Consultoria
      </footer>
    </main>
  );
}
