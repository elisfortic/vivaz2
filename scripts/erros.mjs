import { chromium } from "playwright";

const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
});
pagina.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    console.log(`[${msg.type()}]`, msg.text().slice(0, 600));
  }
});
pagina.on("pageerror", (err) =>
  console.log("[pageerror]", (err.stack ?? String(err)).slice(0, 1500)),
);
await pagina.goto("http://localhost:3001", { waitUntil: "networkidle" });
await pagina.waitForTimeout(3000);
for (let i = 0; i < 8; i++) {
  await pagina.evaluate((idx) => {
    document
      .querySelectorAll("main section")
      [idx].scrollIntoView({ behavior: "instant" });
  }, i);
  await pagina.waitForTimeout(1200);
}
console.log("fim");
await navegador.close();
