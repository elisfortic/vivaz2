import Link from "next/link";
import Rodape from "@/components/ui/Rodape";

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col bg-off-white">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-6 pt-24">
        <h1 className="font-montserrat text-4xl font-semibold text-verde md:text-5xl">
          Esta página não existe.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite/85">
          O link pode ter mudado de lugar. Volte para a home ou escreva para a
          gente.
        </p>
        <div className="mt-10 flex gap-6">
          <Link
            href="/"
            className="rounded-full bg-verde px-8 py-3.5 text-sm font-medium text-off-white transition-transform duration-300 hover:scale-[1.03]"
          >
            Voltar para a home
          </Link>
          <Link
            href="/contato"
            className="self-center text-sm font-medium text-verde underline-offset-4 hover:text-terracota"
          >
            Contato
          </Link>
        </div>
      </div>
      <Rodape />
    </main>
  );
}
