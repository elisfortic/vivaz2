## Ferramentas globais já ativas (escopo do usuário, não deste repo)

Verificado em 2026-08-17 — nada disto precisou ser "instalado" para este projeto, já
existia na conta:

- **everything-claude-code** (`everything-claude-code@everything-claude-code`,
  já `enabled: true`) — é a origem dos agentes `planner`, `code-reviewer`,
  `security-reviewer`, `tdd-guide`, `architect` etc. usados via `Agent`. Não
  há hook automático de scan de segurança antes de commit — o uso é
  proativo (chamar `security-reviewer` antes de commits sensíveis), conforme
  `~/.claude/rules/common/security.md`.
- **superpowers** (`superpowers@claude-plugins-official`, já ativo) — skill
  de descoberta de processo (`brainstorming`, `systematic-debugging` etc.),
  não é um framework de TDD com fases automáticas.

Adicionado nesta sessão (escopo usuário, marketplace
`alirezarezvani/claude-skills`, só os bundles de engenharia/produtividade —
não os 88 disponíveis): `engineering-skills`, `engineering-advanced-skills`,
`a11y-audit`, `zero-hallucination-coder`, `llm-cost-optimizer`,
`workflow-builder`, `write-a-skill`.

## rtk

`rtk.exe` (instalado em `C:/Users/House_Fol/.local/bin/rtk.exe`, binário verificado por checksum SHA-256, sem hook automático — o auto-patch do PreToolUse foi tentado e bloqueado pelo classifier de permissões desta sessão) comprime saída ruidosa de CLI antes de chegar ao contexto. Uso manual quando o comando tende a ser verboso:

- `rtk git status` / `rtk git diff` / `rtk git log` no lugar do `git` puro
- `rtk ls` / `rtk tree` no lugar de listagens grandes
- Ver `rtk --help` para a lista completa de subcomandos suportados (npm, aws, psql, gh, etc.)

Não é obrigatório — só vale a pena chamar quando a saída normal seria grande.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
