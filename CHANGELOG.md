# Changelog

Todas as mudanças relevantes do **Box e Pudim** ficam aqui. Formato: [Keep a Changelog](https://keepachangelog.com/), versionamento semântico.

## [1.1.0] — 2026-05-10 — Reorganização sênior

Refatoração de estrutura sem quebra de comportamento. Original preservado em `c:\Users\admin\Documents\Codex\2026-04-25\files-mentioned-by-the-user-briefing-2\`.

### Added
- `package.json` raiz com scripts `dev` / `start` apontando pra `dev-server.mjs`.
- `.gitignore` cobrindo `node_modules/`, logs, editor metadata, `_archive/`, `server/.env`.
- `CHANGELOG.md` (este arquivo).
- `_archive/qa-history/` consolidando 19 pastas de screenshots de iterações antigas (~56 MB).
- `_archive/deprecated/` para arquivos descontinuados.
- `assets/img/` com subpastas temáticas:
  - `assets/img/products/` — pudins e produtos hero (5 arquivos)
  - `assets/img/boxes/` — boxes de comida (10 arquivos)
  - `assets/img/events/` — bandejas e arranjos para eventos (8 arquivos)
  - `assets/img/lifestyle/` — fotos ambientais e hero (8 arquivos)

### Changed
- **WA_PHONE consolidado.** `app.js`, `box.js` e `admin.js` agora leem `window.BK_CONFIG.waPhone` (com literal `15551234567` mantido como fallback). Antes, o número estava duplicado em 3 lugares apesar de já existir `assets/config/config.js`.
- **Versionamento `?v=N` sincronizado.** Todos os 4 HTMLs agora apontam para `?v=70` (antes: `index` v55, `admin` v65, `pudim`/`box` v66 — violava regra de ouro do README).
- **Imagens reorganizadas.** 31 PNGs flat em `assets/` migrados para `assets/img/{products,boxes,events,lifestyle}/`. Todos os `src=` / `href=` / `preload` atualizados via search-replace nos 4 HTMLs, 4 JSes, 2 CSSes.

### Moved (preservado em `_archive/`)
- `qa/` + 18 pastas `qa-*-*` (screenshots de iterações) → `_archive/qa-history/`
- `server.err.log`, `server.out.log` (vazios) → `_archive/deprecated/`

### Notes / não removido (decisão consciente)
- `start-server.bat` mantido (fallback Python para Windows sem Node).
- `server/` mantido como placeholder (próxima rodada Fastify+Prisma+JWT — `package.json` aponta pra `src/server.js` que ainda não existe; **não rode `npm start` lá**).
- `app.js`, `box.js`, `admin.js`, `entry.js`, `styles.css`, `box.css` mantidos com nomes legacy na raiz para não quebrar o vínculo histórico do `PROJECT_MEMORY.md` e do README. Renomeação fica para uma próxima rodada com build step.
- `index.html` agora carrega assets em `?v=70` (antes era `?v=55`); cache do browser pode ainda servir CSS/JS antigos — Ctrl+F5 na primeira abertura.

### Architectural decisions
- **HTMLs/JSes/CSSes principais ficam na raiz.** Mover para `public/` ou `src/` quebraria 100+ imports relativos e exigiria build tool. ROI baixo enquanto não há build step.
- **`_archive/` ignorado pelo `.gitignore`** — não é histórico de código (já está nos commits), são screenshots e logs vazios. Para reduzir tamanho do repo no `git push`.

---

## [1.0.0] — entregas anteriores (consolidado a partir de `docs/PROJECT_MEMORY.md`)

- v=66: config central `BK_CONFIG` + validação de cart + checklist pré-deploy.
- v=65: KPIs reais ao vivo no admin + i18n da brand do box.
- v=64: layout cart line empilhado.
- v=63: chips do switcher do box adicionam direto ao cart.
- v=62: `addBoxToCart` dispara cart drawer via class no body.
- v=61: handler `[data-box-product]` em cards.
- v=60: i18n entry split-screen + box hero.
- v=58: MutationObserver intercepta classes legacy (`cart-modal-open`, `box-cart-open`).
- v=55: refactor lang/switcher para 2 chips independentes.
- v=54: cart drawer universal (DOM transfer pattern).
- v=50: bandeiras SVG inline.
- v=46: swipe gestures (drawer + switcher).
- v=45: i18n PT/EN end-to-end.
- v=44: drawer mobile redesign.
