# Box e Pudim — guia para o assistente

> **Antes de mexer:** ler este arquivo, `README.md`, e `docs/PROJECT_MEMORY.md`. Sempre.

## Contexto

Site bilíngue (PT/EN) de pré-venda de pudim brasileiro e boxes de comida brasileira nos EUA. Cliente monta carrinho, finaliza pelo WhatsApp; dona acompanha tudo no admin privado.

**Local da loja:** Danbury, CT · USA (NÃO Orlando — `config.js` antigo dizia Orlando, foi corrigido em maio/2026).

Duas lojas no mesmo domínio + entrada split-screen + admin:
- `index.html` — entry split-screen (Pudim ↔ Box)
- `pudim.html` — Brazilian Pudding (pudim, sobremesas, eventos)
- `box.html` — Box InHouse (boxes de comida, bandejas, almoço)
- `admin.html` — privado, login demo, pedidos, capacidade, leads

## Stack atual

- **Frontend:** HTML5 + CSS3 + JS ES6 vanilla. Three.js no hero do pudim (`assets/vendor/three.module.js`).
- **Persistência atual:** `localStorage` (cart, lang, admin orders/products/leads, capacidade).
- **Backend:** Fase 1 completa em `server/` — Fastify + Prisma + Postgres + auth argon2/JWT + outbox pg-boss + state machine. Faltava apenas subir Postgres (`docker compose up -d` + migrate + seed + `npm run dev`).
- **Build:** sem bundler. Cache busting manual via `?v=N` nos `<script>`/`<link>` (atualmente `v=70`).

## Stack planejada (Plano v4 — ver `C:\Users\admin\.claude\plans\aja-como-senior-e-dapper-crescent.md`)

- **Hostinger KVM** já paga (site + api + Plausible self-host)
- **Fastify + Prisma + Postgres** no backend
- **Cloudflare** proxy free na frente (DDoS + CDN + Turnstile + R2 backup)
- **Pagamento manual** Zelle + Venmo + Cash App → Square depois
- **Evolution API** em VPS isolada do cliente, só pra notificações outbound triggadas (low ban risk)
- **Concierge IA opcional** com Groq Llama free tier
- **Compliance CTDPA** (Connecticut Data Privacy Act, não CCPA — cliente é em CT)

## Regra de ouro (CRÍTICA)

**Toda mudança visual ou de comportamento que aparece no site público vai aplicada nos DOIS sites: `pudim.html` E `box.html`. Nada de mexer só num lado.**

Aplica a header, drawer mobile, lang toggle, switcher Pudim ↔ Box, cart drawer, marquee, concierge, footer, CTAs, microinterações, motion, ícones, breakpoints mobile e qualquer outra mudança transversal.

Ordem de trabalho:
1. Implementar nos arquivos compartilhados (`assets/header/`, `assets/cart/`, `assets/concierge/`)
2. Plugar em `pudim.html`
3. Plugar em `box.html` (mesma rodada)
4. Plugar em `index.html` quando fizer sentido
5. Plugar em `admin.html` quando aplicável
6. **Bumpar `?v=N` em TODOS os links/scripts dos 4 HTMLs** (sincronizado)
7. Validar em desktop **e** mobile (≤480px) nos dois sites antes de declarar "feito"

Exceção (mudança que só faz sentido num lado): documentar em comentário no arquivo modificado.

## Decisões arquiteturais críticas

### Padrão "DOM transfer" no cart
`cart-drawer.js` move o `<form data-cart-modal>` (pudim) ou `<form data-box-cart-modal>` (box) pra dentro do drawer ao abrir, devolve ao fechar. Listeners do legacy (`app.js`/`box.js`) continuam intactos. Vantagem: zero alteração no legacy de ~1200 linhas.

### Bridge de classes pra abrir drawer
`app.js` adiciona `body.cart-modal-open`, `box.js` adiciona `body.box-cart-open`. `cart-drawer.js` tem MutationObserver que intercepta essas classes, remove (pra não conflitar), e abre o drawer.

### i18n em duas camadas
1. `copy[lang][key]` no `app.js` — sistema antigo, traduz strings com `data-i18n` no pudim
2. `I18N[lang][key]` no `header.js` — sistema novo, traduz `data-bk-i18n` no header/drawer/cart/announcements (cobre os 4 HTMLs)
3. `box-i18n.js` — monkey-patch no `boxProducts` (em `box.js`) com versões PT, dispara `box-rerender` quando lang muda

Toggle `[data-bk-lang]` é fonte de verdade (persiste em `localStorage[bp-lang]`). Bridges sincronizam com `data-language-toggle` legacy do `app.js` e `.box-language-toggle` legacy do `box.js`. Loop guard com flag `bridging`.

### Versionamento `?v=N`
Sem build step → cache do browser persiste arquivos JS/CSS. Padrão: bumpar `?v=N` em todos os links/scripts dos 4 HTMLs ao mexer em CSS/JS compartilhado. Manualmente, sincronizado cross-páginas.

## Convenções de código

- **CSS namespace `bk-*`** pra componentes novos compartilhados (header, cart, lang, switch, drawer)
- **CSS namespace legacy** mantido (`.site-header`, `.box-cart`, `.admin-*`) — não mexer salvo bug
- **JS data attributes:** prefixo `data-bk-*` pros componentes novos, sem prefixo pros legacy
- **localStorage keys:** prefixo `bp-` (`bp-lang`, `bp-admin-*`, `bp-cart-*`)
- **Eventos custom:** prefixo `bp:` pros legacy, `bk:` pros novos (`bp:lang-change`, `bk:lang-change`, `box-rerender`)
- **i18n keys:** camelCase (`bkAnnounceBatchClose`, `entrySignature`, `boxHeroTitle`)

## Comandos

```bash
# Dev server (porta 4173)
npm run dev

# Sem Node (Windows fallback): duplo-clique em start-server.bat
```

**`file://` não funciona** — Chrome bloqueia ES modules e quebra Three.js. Use sempre o servidor local.

## Arquivos sensíveis

- `assets/config/config.js` — `waPhone` (atualmente fake `15551234567` — warning no console alerta), `storeRegion: 'Danbury, CT · USA'`, `adminMode` (`'demo'` por enquanto, mudar pra `'production'` quando backend tiver auth real)
- `admin.js:498-501` — login é literalmente "qualquer credencial entra" (`unlockDashboard()` direto). **Não publicar admin antes do backend.** Banner laranja no `admin.html` avisa MODO DEMO.
- `assets/img/**/*.png` — várias imagens grandes (1.8-2.6 MB cada), comprimir pra <300 KB antes de subir produção (script `scripts/optimize-images.mjs` planejado pra Fase 3)

## Como NÃO quebrar nada

**Antes de mexer:**
1. Ler este arquivo
2. Ler `README.md` (regra de ouro + checklist pré-deploy)
3. Confirmar que vai aplicar nos 2 sites se for transversal

**Depois de mexer:**
1. Bumpar `?v=N` em todos os HTMLs afetados (atualmente `v=70`)
2. Validar em Chrome devtools desktop **e** mobile (≤480px)
3. Testar fluxo completo: clicar produto → drawer abre → mudar qty → trocar lang → finalizar pelo WhatsApp
4. Console deve estar sem erros

**Em caso de bug visual de lang/drawer/cart:**
1. Hard reload (Ctrl+F5) pra invalidar cache
2. Inspecionar `localStorage[bp-lang]`, `localStorage[bp-admin-orders-state]`, `localStorage[bp-admin-wa-number]`
3. Console: `window.bkCart.refresh()`, `window.bkApplyI18n('pt')`, `window.bkHeader.setLang('en')`

## Tom e idioma

- **Comunicação com o dono (Emmanuel):** PT-BR sempre, tom direto, ele é dev júnior orientado por sênior
- **Textos in-game (site público):** EN primário (público alvo Florida/CT), PT secundário (brasileiros US)
- **Comentários no código:** PT-BR ou EN (consistente por arquivo)
- **Commits:** nunca sem aprovação explícita

## Status atual (último update: 11/05/2026)

Versão atual nos HTMLs: **`?v=78`**.

### Pronto e funcional (Fases 1 e 2 completas)
- **Frontend:** 4 HTMLs, header/cart/i18n compartilhados, concierge heurístico 13 intents (só pudim), Fluid Particles canvas 2D no hero (palette amber/green), 9 imgs `loading="lazy"`, Danbury CT corrigido, banner DEMO admin
- **Backend (`server/`):** Fastify + Prisma + **Postgres 18 via scoop (porta 5432)** + auth argon2/JWT + outbox pg-boss + state machine + Evolution wrapper (stub). 31 arquivos. **18/18 tests passam.**
  - Postgres roda local instalado via `scoop install postgresql`
  - Iniciar: `pg_ctl start -D ~/scoop/apps/postgresql/current/data -l ~/scoop/apps/postgresql/current/postgres.log`
  - Backend: `cd server && NODE_TLS_REJECT_UNAUTHORIZED=0 node src/server.js` (porta 3000)
  - Admin: `admin@brazilianpudding.com` / `ChangeMeOnFirstLogin2026!`
- **Frontend conecta API:** `assets/api/client.js` + 18 helpers, admin login real (fallback demo), `app.js`/`box.js` postam lead na API antes do WA, admin orders/leads/KPIs todos via API
- **Templates WhatsApp inteligentes:**
  - Chip dentro de conversa (lead da API): copia preenchido automaticamente
  - Template avulso: auto-detect `{variáveis}` → abre mini-modal com inputs + preview live; sem variáveis copia direto
- **Quick wins:** Orlando→Danbury, banner DEMO admin, warning waPhone fake, 9 imgs lazy

### Pendente (escolher próxima fase — ver plano v4 em `~/.claude/plans/`)
- **Fase 3 (recomendado próximo):** Mobile-first + PWA + perf + SEO — comprimir 46 MB → 3 MB, `<picture>` AVIF/WebP, manifest, Service Worker, OG/Schema, favicon, robots, sitemap. Sem bloqueio.
- **Fase 4:** Deploy Hostinger KVM. Precisa domínio + Cloudflare conta.
- **Fase 5:** QA automatizado + observabilidade (Vitest 70%, Playwright e2e, Sentry, Plausible).
- **Fase 6:** Pagamento manual Zelle/Venmo/Cash App.
- **Fase 7:** Evolution API outbound. Cliente provisiona VPS dele.
- **Fase 8:** Email Resend.
- **Fase 9:** Concierge IA Groq Llama (opcional).
- **Fase 10:** Compliance CTDPA.
- **Fase 11-12:** Polish + hardening + lançamento.

### Decisões pendentes do dono
- Domínio comprado?
- Cloudflare conta criada?
- Fotos reais dos produtos (substituir mocks)
- Endereço pickup oficial em Danbury
- Dona já tem Zelle/Venmo/Cash App configurado?
- Cliente vai provisionar VPS dele pro Evolution? Quando?
- Já tem clientes/produtos pra migrar de planilha?

## Não fazer

- Comitar sem aprovação explícita
- Mudar só num site (pudim OU box) quando é transversal
- Esquecer de bumpar `?v=N`
- Adicionar emojis no código a menos que pedido
- Subir admin pra produção antes do backend (segurança)
- Refatorar `app.js`/`box.js` legacy sem necessidade — usar padrões DOM transfer + bridges
- Criar arquivos `.md` extra sem o dono pedir
- Rodar `npm start` em `server/` (vai falhar — não tem código ainda)
- Usar Meta WhatsApp Business API em vez de Evolution (decisão do dono — Evolution + número dedicado)
