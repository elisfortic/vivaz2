# VIVAZ · OPÇÃO B
## Plano de execução — "O sistema que se move"

Projeto paralelo e independente da Opção A (`C:\Users\House_Fol\Vivaz`).
Todas as decisões do cliente incorporadas. Substitui qualquer versão anterior.

---

# PARTE 1 · O CONCEITO

## 1.1 A tese visual

O site inteiro é a demonstração de uma ideia:

> **A hierarquia é uma coisa. O sistema real é outra. E quando uma parte se
> move, move todas as outras.**

Toda organização tem um organograma — caixas, níveis, linhas retas. E tem o
que de fato acontece: conhecimento circulando, confiança sustentando,
processos atravessando níveis sem pedir licença. A Opção A **conta** isso.
A Opção B **mostra**: o visitante vê a estrutura rígida e a rede viva
coexistindo, e ao interagir percebe que mexer num ponto move o resto.

Isso não é ornamento. É o argumento comercial da Vivaz virado interface.

## 1.2 A linguagem visual

**Formas puramente abstratas.** Linhas e círculos — a linguagem que já
existe no deck. Sem pessoas, sem ambiente de trabalho, sem figuração.

**Qualidade de movimento: braços de anêmona.**
- Ondulação lenta e contínua, sem início nem fim perceptíveis
- Várias linhas com ritmos independentes — nunca sincronizadas
- Graciosa, orgânica, nunca mecânica; sem "easing de UI"
- Ciclos longos (20–45s), amplitudes variadas
- O olho percebe vida, não animação

*(Referência interna de qualidade apenas. A palavra "anêmona" e imagens de
anêmona não aparecem em lugar nenhum do site.)*

## 1.3 Como a tese aparece em cada bloco

| Bloco | O que o sistema faz |
|---|---|
| Hero | A rede ondula livre; a tagline emerge dela |
| Ponto de partida | Organograma rígido esmaecido ao fundo; a rede viva o atravessa, ignorando os níveis |
| Por que falham | Três clusters; ao mexer num, os outros reagem — mas um se desconecta |
| Territórios | Quatro nós; ativar um reconfigura o sistema inteiro |
| Quem somos | Três nós; as arestas desenham as trajetórias até as empresas |
| Fechamento | Tudo converge no símbolo |

---

# PARTE 2 · DECISÕES LOCKADAS

| # | Decisão |
|---|---|
| Escopo | **7 rotas completas**, iguais à Opção A |
| Superfície | **Off-white dominante**, com blocos pontuais em verde profundo. Sem toggle |
| Scroll | **Empilhamento** (cards sobrepostos no scroll), referência corall.net |
| Copy | **Idêntica** ao `04-copy-final.md` da Opção A |
| Idiomas | Arquitetura pronta para **PT · ES · EN** |
| Formulário | **Funcional** |
| Imagens | Abstratas: linhas e círculos. Geradas permitidas como raster atmosférico |
| Fotos das sócias | Provisórias atuais; definitivas depois |
| Blocos futuros | Depoimentos, cases e rede de parceiros: **construídos, não publicados** |
| Apresentação | **Assíncrona** — cada sócia vê sozinha, depois discutem |

---

# PARTE 3 · ESPECIFICAÇÕES

## 3.1 Empilhamento (scroll stacking)

Referência: corall.net. Cada seção principal chega por cima da anterior,
que permanece e recua levemente.

- Seção atual: `position: sticky`, escala 1, opacidade 1
- Seção anterior ao ser coberta: escala 0.96, opacidade 0.5, sem blur
- Transição de 400–600ms, easing suave
- Profundidade por borda de 1px em `--linha` no topo da seção que sobe —
  nunca box-shadow difusa
- **A rede atravessa as camadas:** as linhas seguem visíveis entre uma seção
  e a seguinte, costurando o empilhamento. É o que diferencia da Corall
- Mobile: empilhamento desativado, scroll normal — em tela pequena atrapalha
  e custa performance
- `prefers-reduced-motion`: desativado

## 3.2 A rede viva

- Canvas 2D com `d3-force`, 40–60 nós em desktop, 20 em mobile
- Ondulação contínua por ruído (simplex) aplicado à posição — é o que produz
  a qualidade "anêmona"; `sin()` puro produz movimento mecânico
- Cursor aplica repulsão suave, raio ~180px, com retorno lento — a rede
  "lembra" e volta devagar, não salta
- Nós em `--sage`; até 4 em `--terracota` por rota, nos pontos de significado
- Arestas em `--linha` sobre claro, `rgba(off-white,.18)` sobre verde
- 60fps obrigatório; pausa fora do viewport; versão estática elegante em
  `prefers-reduced-motion` e em hardware fraco (`hardwareConcurrency <= 4`)

## 3.3 Organograma fantasma

No bloco "Ponto de partida":
- Retângulos vazios conectados por linhas retas, `--linha` a 35%, sem texto
- A rede viva passa por cima e através, com nós fora das caixas
- Estático contra vivo — o contraste é o argumento

## 3.4 Internacionalização

Arquitetura completa desde o início, conteúdo apenas em PT:

- Rotas `/pt`, `/es`, `/en` com middleware de detecção e redirecionamento
- Dicionários em `/dictionaries/{pt,es,en}.json`
- `hreflang` recíproco entre as três, canônica correta
- **PT completo. ES e EN com estrutura pronta e strings `{{TRADUZIR}}`** —
  nunca tradução automática apresentada como final
- Seletor de idioma discreto no rodapé

## 3.5 Blocos do estado futuro

Depoimentos, cases e rede de parceiros: **componentes construídos e prontos,
fora do fluxo das páginas públicas.**

- Ficam em `components/futuro/`
- Rota não listada `/blocos-futuros` (com `noindex`) exibe os três, para que
  as sócias vejam o que virá quando houver conteúdo
- Conteúdo dos exemplos rotulado `EXEMPLO — conteúdo ilustrativo`
- Nunca depoimento, número ou nome de cliente fictício apresentado como real
- Não aparecem em nenhuma página pública

## 3.6 Formulário

Funcional: Resend + Server Action, seis campos, consentimento LGPD, honeypot,
rate limit. Destino `{{PENDENTE: contato@}}` até as caixas existirem.

---

# PARTE 4 · SEPARAÇÃO E STACK

## 4.1 Estrutura no disco

```
C:\Users\House_Fol\Vivaz\      ← Opção A (intacta)
C:\Users\House_Fol\VivazB\     ← Opção B (repositório próprio)
```

Pasta e repositório Git separados — evita conflito de `CLAUDE.md`,
`node_modules` e settings, e permite duas sessões de Claude Code em paralelo.

**Copiar da A:** `docs/04-copy-final.md`, `docs/01-briefing.md`, `origem/`
inteira, `public/marca/`, `public/socias/`.
**Não copiar:** docs de direção de arte da A (03, 18–24) nem o `CLAUDE.md`.

## 4.2 Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 15 + TypeScript |
| Estilo | Tailwind v4 |
| Rede | Canvas 2D + `d3-force` + `simplex-noise` |
| Scroll e empilhamento | GSAP + ScrollTrigger |
| Scroll suave | Lenis |
| Transições de UI | Framer Motion |
| i18n | Middleware nativo do Next + dicionários JSON |
| E-mail | Resend |

Bibliotecas de animação são permitidas nesta opção — é o ponto do experimento.

## 4.3 Skills, plugins e MCPs

A Opção A desativou três skills por conflito com o brandbook fechado.
Na Opção B, parte desse conflito desaparece — mas não todo.

### Ativas

| Recurso | Status | Uso |
|---|---|---|
| `frontend-design` (Anthropic) | Instalado, ativo | Contínuo, em toda decisão visual |
| `taste-skill` | **Reativada parcialmente** | Só a camada de motion e micro-interação. Ver restrição abaixo |
| Higgsfield / FAL MCP | **Liberados** | Apenas raster atmosférico abstrato |
| Firecrawl | Disponível | Monitorar corall.net (referência de empilhamento) |

### Restrição que permanece para `taste-skill`

Ela impõe Geist/Outfit/Cabinet Grotesk/Satoshi e no máximo um accent color.
**Isso continua proibido** — o brandbook da Vivaz define Montserrat + Lato e
a paleta completa. Usar a skill como fonte de padrões de motion e interação,
nunca de tipografia ou cor.

### Recursos a investigar (o agente reporta antes de usar)

`21st.dev`, `better-icons`, `Open Design MCP` e `ui-ux-pro-max` foram citados
no material de referência do cliente. O agente deve:
1. Verificar se existem e estão disponíveis nesta máquina
2. Ler o que cada um instrui
3. **Reportar antes de ativar** — mesma disciplina da Opção A

### O que NÃO usar, por decisão de projeto

- **Catálogos de componentes prontos** (21st.dev, shadcn blocks, Bento grids
  de template): grid de Bento e cards de catálogo são o visual genérico de
  2026. O diferencial da Vivaz é a rede — que nenhum catálogo tem e que só
  existe escrita à mão.
- **Templates de layout do Open Design** (estruturas Stripe/Linear): mesma
  razão. Ferramenta que acelera o comum é bem-vinda; ferramenta que decide
  estética, não.
- `imagegen-frontend-mobile`: gera mockups de app mobile, fora de escopo.

## 4.4 Modelo

**Fable** durante toda a Opção B. Criação visual com física, composição e
ruído — onde o modelo maior rende visivelmente mais.

---

# PARTE 5 · PROMPT PARA O CLAUDE CODE

Iniciar sessão em `C:\Users\House_Fol\VivazB`, trocar para Fable, e colar:

```
Você vai construir a OPÇÃO B do site da Vivaz — proposta alternativa a ser
comparada com a Opção A (existe em ..\Vivaz e NÃO deve ser tocada).

Leia: docs/00-opcao-b.md (plano completo) e docs/04-copy-final.md (copy).

A TESE: a hierarquia é uma coisa, o sistema real é outra, e quando uma parte
se move ela move todas as outras. O site demonstra isso — não fala sobre.

QUALIDADE DE MOVIMENTO — o critério mais importante:
Ondulação lenta e contínua, várias linhas com ritmos independentes, nunca
sincronizadas, sem início nem fim perceptíveis. Graciosa e orgânica, nunca
mecânica. Ciclos de 20 a 45 segundos. Use ruído (simplex), não sin() puro.
O olho deve perceber vida, não animação.

FASE 1 — Fundação e rede
Next.js 15 + TS + Tailwind v4, sem src/, alias @/*.
Instalar: d3-force, simplex-noise, gsap, lenis, framer-motion, resend, zod.
Construir o componente RedeViva conforme docs/00-opcao-b.md seção 3.2.
PARE e me mostre a rede isolada antes de qualquer conteúdo.

FASE 2 — Hero + empilhamento
Hero com a rede; tagline emergindo dela.
Empilhamento de seções conforme seção 3.1 — a rede atravessa as camadas.
PARE e me mostre a home antes de seguir.

FASE 3 — Demais seções da home
Organograma fantasma, territórios interativos, sócias como rede de
trajetória, fechamento convergindo no símbolo.

FASE 4 — Demais rotas
Quem somos, O que movemos, Ponto de vista, Contato, Privacidade.

FASE 5 — i18n
Rotas /pt /es /en, dicionários, hreflang. PT completo, ES e EN com
estrutura e strings {{TRADUZIR}}.

FASE 6 — Formulário funcional (Resend).

FASE 7 — Blocos do estado futuro em components/futuro/ e rota não
listada /blocos-futuros com noindex.

FASE 8 — Mobile, acessibilidade e performance.

SKILLS E FERRAMENTAS
Antes da Fase 1, verifique o que está disponível nesta máquina
(~/.claude/skills/, plugins instalados, MCPs da sessão) e me reporte em
tabela — nome, encontrado, o que instrui. Não ative nada sem minha
aprovação, exceto frontend-design (oficial, uso contínuo).

taste-skill: se disponível, use APENAS a camada de motion e micro-interação.
As instruções dela sobre fonte (Geist/Satoshi) e paleta (1 accent color)
estão PROIBIDAS — o brandbook da Vivaz vence.

Não use catálogos de componentes prontos (21st.dev, Bento grids, templates
Stripe/Linear). O diferencial deste site é a rede escrita à mão.

REGRAS INVIOLÁVEIS
1. NENHUM texto inventado. Copy só de docs/04-copy-final.md. Exemplos nos
   blocos futuros são rotulados "EXEMPLO — conteúdo ilustrativo".
2. Paleta e tipografia do brandbook: off-white dominante, verde em blocos
   pontuais, terracota como acento. Montserrat + Lato apenas.
   Fraunces e Geist proibidos.
3. Imagem gerada por IA permitida apenas como raster atmosférico abstrato.
   PROIBIDA para logo, grafismos estruturais, diagramas e qualquer imagem
   com texto. Registrar em docs/creditos-imagens.md.
4. Sem pessoas, sem ambiente de trabalho, sem figuração. Só linhas e círculos.
5. 60fps ou degrada. prefers-reduced-motion entrega tudo estático e completo.
6. "Trajetória construída em", nunca "nossos clientes".

Pare ao fim de cada fase. Não commite sem minha aprovação.
```

---

# PARTE 6 · APRESENTAÇÃO ASSÍNCRONA

As sócias verão sozinhas, sem ninguém narrando. Três consequências:

**A Opção B precisa se explicar.** Site experimental sem contexto pode ler
como "bonito mas estranho". Preparar um documento de uma página que acompanha
os dois links, dizendo o que cada opção tenta fazer e o que observar — sem
vender nenhuma das duas.

**Perguntas orientadas.** Em vez de "qual você prefere":
- Qual dos dois faz você confiar mais na Vivaz?
- Qual você mandaria para um CHRO que pediu indicação?
- Em qual você encontraria mais rápido o que procura?

**A Opção A também recebe as imagens abstratas** já criadas, para que a
comparação não seja enviesada por um recurso que só uma das duas usou.

*(O documento de apresentação será escrito quando a Opção B estiver pronta.)*
