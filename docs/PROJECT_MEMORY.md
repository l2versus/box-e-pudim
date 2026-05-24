# Brazilian Pudding / Box InHouse — memória do projeto

Documento vivo. Última atualização: 06/05/2026.

Objetivo: qualquer dev (ou eu mesmo daqui 3 meses) abre esse arquivo e em 5 minutos sabe o que está feito, o que está pendente, e onde mexer sem quebrar nada.

---

## 1. O que é o produto

Site estático de pré-venda de pudim brasileiro e boxes de comida brasileira nos EUA (vendido por brasileiros baseados em Orlando). Cliente vê catálogo, monta carrinho, envia pedido pelo WhatsApp. Dona acompanha tudo num admin separado.

Duas lojas no mesmo domínio:

- **Brazilian Pudding** (`pudim.html`) — pudim, sobremesas, eventos
- **Box InHouse** (`box.html`) — boxes de comida, bandejas, almoço

Página de entrada split-screen (`index.html`) leva pra uma das duas. Admin (`admin.html`) é privado.

Cliente target é US-based (default EN). Vendedor opera em PT (toggle PT/EN persistido em `localStorage[bp-lang]`).

---

## 2. Stack atual

**Frontend:** HTML5 + CSS3 + JavaScript ES6 vanilla. Sem framework. Three.js no hero do pudim (cena 3D de partículas).

**Persistência atual:** `localStorage` (cart, lang, admin orders/products/leads, templates de WhatsApp, capacidade).

**Servidor de dev:** Python `http.server` ou `npx http-server`. Script de start: `start-server.bat` na raiz.

**Backend:** ainda não existe. Estrutura `server/` com Fastify + Prisma + Postgres + JWT planejada pra próxima rodada (foco do dia que o usuário contratar Hostinger KVM).

---

## 3. Estrutura de arquivos

```
files-mentioned-by-the-user-briefing-2/
├── index.html                     ← entry split-screen
├── pudim.html                     ← loja Brazilian Pudding
├── box.html                       ← loja Box InHouse
├── admin.html                     ← painel privado
│
├── app.js                         ← lógica do pudim (i18n próprio + cart embedded)
├── box.js                         ← lógica do box (catalog + cart embedded)
├── entry.js                       ← split-screen interactions
├── admin.js                       ← lógica do admin (login + orders + products + leads)
│
├── styles.css                     ← visual do pudim (legacy)
├── box.css                        ← visual do box (legacy)
├── entry.css                      ← visual da entry
├── admin.css                      ← visual do admin
│
├── start-server.bat               ← inicia servidor local na 4173
├── README.md                      ← regra de ouro + checklist pré-deploy
│
├── assets/
│   ├── config/
│   │   └── config.js              ← waPhone, leadTime, freeShipping, version
│   ├── header/
│   │   ├── header.css             ← bk-header compartilhado (pudim+box+index+admin)
│   │   └── header.js              ← lang toggle, drawer mobile, swipe, scroll-spy
│   ├── cart/
│   │   ├── cart-drawer.css        ← cart drawer lateral
│   │   └── cart-drawer.js         ← DOM transfer + validação cart
│   ├── concierge/
│   │   └── concierge-ai.js        ← NLU bilíngue (13 intents) — só pudim
│   ├── i18n/
│   │   └── box-i18n.js            ← traduções PT dos 16 produtos do box
│   ├── admin/
│   │   ├── admin-router.css       ← view system + KPIs + modal
│   │   └── admin-router.js        ← router, persistência, busca, modal pedido manual
│   └── vendor/
│       └── three.module.js        ← Three.js (hero pudim)
│
└── docs/
    ├── BRIEFING_ESTRATEGIA.md     ← briefing original
    └── PROJECT_MEMORY.md          ← este arquivo
```

---

## 4. Padrões arquiteturais

### Regra de ouro

**Toda mudança visual ou de comportamento aplica nos DOIS sites (pudim + box) na MESMA rodada.** Vide README. Quando aplica também em index/admin, fazer junto.

### Padrão "DOM transfer" no cart

Em vez de duplicar a lógica completa do carrinho (250+ linhas de `app.js` ligadas ao `<form data-cart-modal>`), o `cart-drawer.js` **move** esse form pra dentro do drawer ao abrir, e devolve ao fechar. Listeners do legacy continuam intactos. Aplica idêntico no box (`<form data-box-cart-modal>`). Detecção automática via querySelector.

Vantagem: zero alteração em `app.js` / `box.js`, drawer pode ser desativado removendo só o `<link>` e `<script>` novos.

### Bridge de classes pra abrir drawer

`app.js` adiciona `body.cart-modal-open` quando abre cart embedded. `box.js` adiciona `body.box-cart-open`. O `cart-drawer.js` tem MutationObserver no `body.classList` que intercepta essas classes, remove (pra não conflitar), e abre o drawer. Resultado: qualquer caminho legacy que abria cart agora abre drawer, sem mexer no JS legacy.

### i18n em duas camadas

1. **`copy[lang][key]` no `app.js`** — sistema antigo, traduz strings com `data-i18n` no pudim
2. **`I18N[lang][key]` no `header.js`** — sistema novo, traduz strings com `data-bk-i18n` no header/drawer/cart/announcements (cobre os 4 HTMLs)
3. **`box-i18n.js`** — monkey-patch no `boxProducts` (em `box.js`) com versões PT, dispara `box-rerender` event quando lang muda

Toggle `[data-bk-lang]` é a fonte de verdade (persiste em `localStorage[bp-lang]`). Bridges ligam: ao clicar `bk-lang`, dispara click no `[data-language-toggle]` legacy do `app.js` e no `.box-language-toggle` legacy do `box.js`. Loop guard: flag `bridging` evita recursão.

### Versionamento de assets (`?v=N`)

Como o projeto não tem build step, o cache do browser persiste arquivos JS/CSS. Padrão: incrementar `?v=N` em todos os links/scripts dos 4 HTMLs ao mexer em CSS/JS compartilhado. Manualmente — mas o número precisa estar consistente cross-páginas.

Evolução futura: hash automático no Nginx (`add_header Cache-Control` por extensão) ou build step com `vite build` que embute hash no nome.

---

## 5. Estado atual de cada feature

| Feature | Status | Onde |
|---|---|---|
| Header bk-header (sticky shrink, marquee, switcher, lang toggle) | ✅ Pronto | header.css + header.js |
| Drawer mobile com swipe-to-close | ✅ Pronto | header.js |
| Lang toggle PT/EN (bandeiras SVG, persistência, sincronização) | ✅ Pronto | header.js + app.js bridge |
| Concierge AI bilíngue (13 intents, multi-keyword, escalação WA) | ✅ Pronto | concierge-ai.js (só pudim) |
| Cart drawer universal (DOM transfer + validação) | ✅ Pronto | cart-drawer.js |
| Validação de pedido (vazio + lead time 48h) | ✅ Pronto | cart-drawer.js |
| i18n 16 produtos do box | ✅ Pronto | box-i18n.js |
| Admin router (view system, sem scroll infinito) | ✅ Pronto | admin-router.js |
| Admin KPIs reais ao vivo | ✅ Pronto | admin-router.js (updateKPIs) |
| Admin templates WhatsApp editáveis | ✅ Pronto | admin-router.js + admin.html |
| Modal "Novo pedido manual" | ✅ Pronto | admin-router.js |
| Persistência admin (orders, capacity, accepting, lang) | ✅ Pronto | localStorage |
| Config central (waPhone, leadTime, freeShipping) | ✅ Pronto | config/config.js |
| Concierge AI no box | ❌ Não plugado | nice-to-have |
| Backend Fastify + Prisma + Postgres | ❌ Próxima rodada | server/ a criar |
| Auth admin real (senha hash + sessão) | ❌ Próxima rodada | depende do backend |
| WhatsApp Cloud API (substitui wa.me) | ❌ Futuro | depende de conta business |

---

## 6. Decisões arquiteturais e por quê

**Por que vanilla JS sem framework?** O site é estático de baixa complexidade, hospedado em VPS modesto. Framework adicionaria build step e ~50kb gzip de runtime. Performance no mobile (público target) ganha com vanilla.

**Por que `localStorage` em vez de cookies?** Demo offline-first. Cliente pode montar carrinho sem conexão estável. Quando o backend entrar, `localStorage` continua como cache + fallback, mas dados críticos passam pra Postgres.

**Por que NÃO refatorei `app.js` / `box.js` antigos?** São ~1200 linhas testadas e funcionais. Risco de regressão é alto. Padrão "DOM transfer" + bridges permite adicionar features novas sem tocar no legacy. Quando o backend entrar, vou progressivamente substituir trechos do legacy por chamadas à API.

**Por que `box-i18n.js` monkey-patch o `boxProducts` em vez de duplicar?** Manter source of truth única (`boxProducts` em `box.js`) e aplicar PT como overlay. `_titleEn` etc preserva original pra restaurar quando voltar pra EN. Sem duplicação de dados.

**Por que validação no cart-drawer e não no `app.js`?** Validação é UX/regra de negócio compartilhada (vazio, lead time). Se eu colocasse no `app.js`, teria que duplicar no `box.js`. No `cart-drawer.js` cobre os dois com 1 implementação.

**Por que duas camadas de i18n (copy do app.js + I18N do header.js)?** O `app.js` legacy tem dicionário próprio com 100+ strings do pudim. Refatorar pra fonte única seria trabalho grande. O header.js cobre só strings novas (header, drawer, cart, announcements) que não existem no legacy. Bridge garante sincronização. Numa fase futura, consolidar tudo num único `i18n/strings.js` quando o projeto migrar pra build step.

---

## 7. Backlog priorizado

### P0 — Bloqueios de produção (próxima rodada)
1. Backend Fastify + Prisma + Postgres + JWT (~3h)
2. `assets/api/client.js` (fetch wrapper) + migração progressiva do admin pra API
3. Auth admin real (argon2 hash + JWT em cookie httpOnly)

### P1 — Antes de subir o site público
4. Trocar `waPhone` em `config.js` pelo número real
5. Substituir imagens mock por fotos reais
6. Comprimir PNGs grandes (alguns > 500kb)
7. `loading="lazy"` em imagens fora do hero
8. Open Graph + Twitter Cards + Schema.org `LocalBusiness`
9. HTTPS + HSTS + CSP no Nginx
10. Rate limiting em `/admin*`

### P2 — Polish / melhorias
11. Concierge widget no box.html
12. Cart cross-page (preserva quando muda Pudim ↔ Box)
13. Smooth scroll global (Lenis 3kb)
14. Section reveal otimizado (já existe IntersectionObserver no app.js)
15. Magnetic CTA no botão WhatsApp principal
16. Skeleton loading no cart enquanto monta
17. Toast notification quando adiciona ao cart (em vez de só drawer abrir)

### P3 — Backend evoluído
18. WhatsApp Cloud API (substitui `wa.me` por mensagens via webhook)
19. Stripe ou Square pagamento integrado
20. Email transacional (confirmação de pedido) via Resend
21. Cron job pra atualizar `data-bk-deadline` automático

---

## 8. Como NÃO quebrar nada

**Antes de mexer:**
1. Ler este arquivo
2. Ler `README.md` (regra de ouro)
3. Confirmar que vai aplicar nos 2 sites (pudim + box) se for mudança transversal

**Depois de mexer:**
1. Bumpar `?v=N` em todos os links/scripts dos HTMLs afetados
2. Validar em Chrome devtools desktop + mobile (≤480px)
3. Testar fluxo completo do cliente: clicar produto → drawer abre → mudar qty → trocar lang → finalizar pelo WhatsApp
4. Console deve estar sem erros (`F12 → Console`)

**Em caso de bug visual de lang/drawer/cart:**
1. Hard reload (Ctrl+F5) pra invalidar cache
2. Inspecionar `localStorage[bp-lang]`, `localStorage[bp-admin-orders-state]`, `localStorage[bp-admin-wa-number]`
3. `window.bkCart.refresh()`, `window.bkApplyI18n('pt')`, `window.bkHeader.setLang('en')` no console pra debug

---

## 9. Configurações importantes

`assets/config/config.js`:

```js
window.BK_CONFIG = {
  waPhone: localStorage.getItem('bp-admin-wa-number') || '15551234567',
  leadTimeHours: 48,
  freeShippingMin: 299,
  pickupWindow: 'Saturday, 5–7 PM',
  storeRegion: 'Orlando, FL · USA',
  adminMode: 'demo',  // 'demo' | 'production'
  version: '1.0.0',
};
```

Mudou `waPhone`? Bumpar `version` e `?v=N` nos HTMLs.

---

## 10. Convenções de código

- **CSS namespace `bk-*`** pra componentes novos compartilhados (header, cart, lang, switch, drawer)
- **CSS namespace legacy** mantido (`.site-header`, `.box-cart`, `.admin-*`, etc) — não mexer salvo bug
- **JS data attributes** prefixo `data-bk-*` pros componentes novos, sem prefixo pros legacy
- **localStorage keys** prefixo `bp-` (`bp-lang`, `bp-admin-*`, `bp-cart-*`)
- **Eventos custom** prefixo `bp:` pros legacy, `bk:` pros novos (`bp:lang-change`, `bk:lang-change`, `box-rerender`)
- **i18n keys** camelCase (`bkAnnounceBatchClose`, `entrySignature`, `boxHeroTitle`)

---

## 11. Histórico resumido (últimas rodadas)

- v=66: config central + validação cart + checklist pré-deploy
- v=65: KPIs reais no admin + brand box i18n
- v=64: layout cart line empilhado (descrição não quebra mais palavra-por-palavra)
- v=63: chips do switch box adicionam direto ao cart, "+" hint, "Add selected" escondido
- v=62: `addBoxToCart` dispara cart drawer via class no body
- v=61: handler `[data-box-product]` em cards adiciona + abre drawer
- v=60: i18n entry split-screen + box hero
- v=58: MutationObserver intercepta classes legacy `cart-modal-open` / `box-cart-open`
- v=55: refactor lang toggle / switcher pra 2 chips independentes (sem knob deslizante)
- v=54: cart drawer universal entregue (DOM transfer)
- v=53: app.js consertado (header null check) + versionamento de todos os scripts
- v=50: bandeiras SVG inline (resolve "US"/"BR" do Windows)
- v=46: swipe gestures (drawer + switcher)
- v=45: i18n PT/BR end-to-end + bandeiras + bk-lang sync
- v=44: drawer mobile redesign senior + footer com switcher + lang
- v=42: drawer mobile fundo opaco (resolve texto preto sobre amarelo)
