---
name: vivaz-b
description: Sistema de design, motor de movimento e processo de trabalho do site Vivaz Opção B. Use ao criar/editar qualquer página, grafismo ou seção deste projeto — contém as regras invioláveis, a linguagem visual aprovada, o motor lib/fibras.ts e o processo de revisão que o cliente exige.
---

# Vivaz Opção B — sistema e processo

## Tese
A hierarquia é uma coisa, o sistema real é outra; mexer numa parte move as
outras. O site DEMONSTRA isso com grafismos vivos — nunca fala sobre.

## Regras invioláveis (cliente)
1. Copy SÓ de `docs/04-copy-final.md`. Mudanças de copy: só o cliente; ao
   trocar, atualizar o doc com nota datada.
2. Paleta (extraída do Brandbook.pptx): off-white #FAF9F6, verde #1A4D4E,
   terracota #C26D53, sage #A3B18A, areia #D6D2C4, grafite #333F48,
   linha #DDD9CD (derivada). Montserrat (títulos) + Lato (corpo). Fraunces
   e Geist PROIBIDOS.
3. NUNCA raster estático para grafismo estrutural — tudo canvas vivo escrito
   à mão. PNGs do deck NotebookLM = direção de arte a superar, não assets.
4. Só linhas/fibras orgânicas e círculos. Sem pessoas figurativas (exceto
   fotos das sócias em Quem Somos — 2×, anel fino verde), sem bento grids.
5. "Trajetória construída em", nunca "nossos clientes". Texto, não logos.
6. 60fps ou degrada; prefers-reduced-motion = tudo estático e completo.
7. Grafismo nunca sobrepõe texto; texto nunca sobre nós/bolas. Sem fundos
   em rótulos — reposicionar em vez de pôr pill.

## Motor de movimento — lib/fibras.ts
- `criarFibra/tracarFibra/pontoNaFibra`: curva S que respira + onda de ruído
  viajante; períodos 20–45s; NUNCA sin() puro para movimento.
- `LoopCanvas`: DPR cap 2, pausa fora do viewport/aba, relógio acumulado,
  modo estático (reduced-motion/hardware fraco) com quadro composto t=7.3.
- BUG conhecido corrigido: timestamp do rAF pode ser ANTERIOR ao
  performance.now() da retomada → dt clampado em [0, 0.05]. Nunca remover.
- Anéis/loops fechados: ruído amostrado em coordenadas circulares
  (cos/sin do ângulo), senão a emenda cria degrau visível ao girar.
- Dentilhado: amostras altas (240 num anel), lineJoin/lineCap "round".
- Hierarquia de traço estilo deck: 3 camadas (guia 2.2–3.5px alpha .6–.9;
  média 1.5px; hairline 1px alpha .15–.3). Nós em degraus de tamanho.

## Componentes existentes (reusar, não recriar)
- `components/rede/RedeViva` (variante claro/verde, hero + fechamento)
- `components/home/grafismos/`: TrioAncoragem (âncoras exportadas, fotos
  posicionam por elas), OrbitaPrincipios (nó do anel faz gesto até cada
  princípio ~9s, aoAgir callback), LinhaRuptura (seta→impacto→fibra que se
  desfaz), SistemaVsOrganograma (+OrganogramaFantasma), RioDeFibras,
  FaixaRupturas/MicroFalha/FibraTerritorios (não usados, disponíveis)
- `PilhaSecoes`: empilhamento sticky (0.94/0.35 + fade a 0 até 5% do
  viewport — mata bleed-through), desativado <768px e reduced-motion
- `Cabecalho`: adaptativo sobre verde; logo 44px, wordmark 24px, nav 16px
  tracking .01em, gap 30px, py 26px (aprovado por parecer de designer)

## Processo que o cliente exige
1. NUNCA mostrar sem auto-revisão: `node scripts/shots.mjs <dir>` gera
   screenshot por seção (Playwright, dev na porta 3001); comparar com deck
   antes de chamar o cliente. Fast Refresh durante captura gera canvas em
   branco — recapturar limpo. Canvas some = checar erro de console
   (`scripts/erros.mjs` pattern) antes de culpar screenshot.
2. Pareceres de "equipe": spawnar agente diretor-de-arte/designer com
   screenshots + referências do deck; aplicar com triagem fundamentada
   (pode recusar com razão). Cliente valoriza isso explicitamente.
3. Git: commit a cada estado aprovado pelo cliente; mensagens pt-BR
   feat/fix/docs/chore. NUNCA commitar sem aprovação de marco.
4. Cliente decide por imagem: iterar rápido, mostrar, ajustar valores
   (tamanhos ±20%, posições) conforme feedback visual.
5. `npm run build` NUNCA com dev server aberto (corrompe .next). Verificar
   com `npx tsc --noEmit`; dev roda na porta 3001.

## Referências visuais
`origem/Moving_Living_Systems2.pptx` + `Vivaz_Living_Systems.pptx` (slides
extraídos em scratchpad), `public/grafismos/*.png` (curadoria da Opção A).
Slide "falham" = image3 MLS2; anel = image7; trio = trio-v2.png.
Opção A em `C:\Users\House_Fol\Vivaz` — LER apenas, nunca tocar.

## REGRA DURA de publicação
NUNCA `git push` para elisfortic/vivaz2 sem aprovação explícita do estado
exato. Fluxo: mostrar local → cliente aprova → push. O remoto contém SÓ o
que foi aprovado (hoje: a home, commit abfee64). Uma língua por vez: PT
fecha primeiro; ES/EN estão traduzidos e dormentes em lib/copy/*
(IdiomaFuturo) — religar só com aprovação (IDIOMAS em lib/idiomas.ts,
seletor no Rodape, middleware).

## Pauta futura (discutir com as sócias após fechar a v1 — NÃO construir antes)
- Admin/CMS para as sócias postarem conteúdo (Ponto de vista)
- Seção de vídeos, casos de sucesso — integrada a LinkedIn e YouTube
- Idiomas ES/EN (traduções prontas e dormentes) — ÚLTIMA parte
- Deploy 2026-08-11: f26a8d8 no elisfortic/vivaz2 (aprovado) — sócias
  revisando; site aguarda o retorno delas

## Estado (2026-08-11)
Home APROVADA e fechada (fases 1–3). Restam: 4 rotas internas, 5 i18n
(/pt /es /en, PT completo, ES/EN {{TRADUZIR}}), 6 formulário Resend
(destino {{PENDENTE: contato@}}), 7 blocos futuros (/blocos-futuros,
noindex, "EXEMPLO — conteúdo ilustrativo"), 8 mobile/a11y/perf.
Pendências de copy: geografia Quem Somos, e-mail, LinkedIn URLs, ensaio.
