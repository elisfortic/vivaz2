"use client";

export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center bg-off-white px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-montserrat text-4xl font-semibold text-verde md:text-5xl">
          Algo não funcionou.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-grafite/85">
          Tente recarregar a página. Se continuar, escreva para {"{{E-MAIL}}"}.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 rounded-full bg-verde px-8 py-3.5 text-sm font-medium text-off-white transition-transform duration-300 hover:scale-[1.03]"
        >
          Recarregar
        </button>
      </div>
    </main>
  );
}
