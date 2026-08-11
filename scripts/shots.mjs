import { chromium } from "playwright";

const DIR = process.argv[2];
const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
});
await pagina.goto("http://localhost:3001", { waitUntil: "networkidle" });
await pagina.waitForTimeout(3000);

const total = await pagina.evaluate(
  () => document.querySelectorAll("main section").length,
);

for (let i = 0; i < total; i++) {
  await pagina.evaluate((idx) => {
    document
      .querySelectorAll("main section")
      [idx].scrollIntoView({ behavior: "instant", block: "start" });
  }, i);
  await pagina.waitForTimeout(2500);
  await pagina.screenshot({ path: `${DIR}/secao-${i}.png` });
}

await navegador.close();
console.log(`ok: ${total} seções`);
