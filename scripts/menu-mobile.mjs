import { chromium, webkit, devices } from "playwright";

const DIR = process.argv[2];
const ALVO = process.argv[3] ?? "http://localhost:3001/pt";

for (const [nome, tipo, device] of [
  ["chromium", chromium, devices["Pixel 7"]],
  ["webkit", webkit, devices["iPhone 14"]],
]) {
  const navegador = await tipo.launch();
  const contexto = await navegador.newContext({ ...device });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on("pageerror", (e) => erros.push(String(e).slice(0, 200)));
  pagina.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text().slice(0, 200));
  });

  await pagina.goto(ALVO, { waitUntil: "networkidle" });
  await pagina.waitForTimeout(2500);
  await pagina.screenshot({ path: `${DIR}/menu-${nome}-fechado.png` });

  const botao = pagina.locator('button[aria-label="Abrir menu"]');
  const visivel = await botao.isVisible().catch(() => false);
  console.log(`[${nome}] hamburguer visível: ${visivel}`);
  if (visivel) {
    await botao.tap().catch(async () => botao.click());
    await pagina.waitForTimeout(900);
    await pagina.screenshot({ path: `${DIR}/menu-${nome}-aberto.png` });
    const linkVisivel = await pagina
      .locator('nav >> text=Quem somos')
      .last()
      .isVisible()
      .catch(() => false);
    console.log(`[${nome}] painel abriu com links: ${linkVisivel}`);
  }
  console.log(`[${nome}] erros: ${erros.length ? erros.join(" | ") : "nenhum"}`);
  await navegador.close();
}
console.log("fim");
