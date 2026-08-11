import { chromium } from "playwright";

const DIR = process.argv[2];
const ROTAS = [
  ["pt/o-que-movemos", "movemos"],
  ["pt/quem-somos", "quem"],
  ["pt/ponto-de-vista", "vista"],
];

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
});

for (const [rota, nome] of ROTAS) {
  await pagina.goto(`http://localhost:3001/${rota}`, {
    waitUntil: "networkidle",
  });
  await pagina.waitForTimeout(2800);
  const alturaTotal = await pagina.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const paradas = Math.min(4, Math.ceil(alturaTotal / 900));
  for (let i = 0; i < paradas; i++) {
    await pagina.evaluate((y) => window.scrollTo(0, y), i * 900);
    await pagina.waitForTimeout(1800);
    await pagina.screenshot({ path: `${DIR}/${nome}-${i}.png` });
  }
}

await navegador.close();
console.log("ok");
