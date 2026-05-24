# Box e Pudim — Brazilian Pudding & Box InHouse

Site estático bilíngue (PT/EN) de pré-venda de pudim brasileiro e boxes de comida brasileira nos EUA. Cliente monta carrinho, finaliza pelo WhatsApp; dona acompanha tudo no admin privado.

Duas lojas no mesmo domínio + entrada split-screen + admin:

- **Brazilian Pudding** — `pudim.html` (pudim, sobremesas, eventos)
- **Box InHouse** — `box.html` (boxes de comida, bandejas, almoço)
- **Entrada** — `index.html` (split-screen anima e leva pra uma das lojas)
- **Admin** — `admin.html` (privado, login demo, pedidos, capacidade, leads)

---

## Quick start

### Opção A — Node (recomendado, suporta `import` de ES modules):

```bash
npm run dev
```

Servidor em `http://127.0.0.1:4173/`. Abra `/index.html`, `/pudim.html`, `/box.html` ou `/admin.html`.

### Opção B — Windows sem Node:

Duplo-clique em `start-server.bat` (usa `python -m http.server` ou `npx http-server` como fallback).

> ⚠️ **`file://` não funciona** — Chrome bloqueia ES modules e quebra Three.js. Use sempre o servidor local.

---

## Stack

- **Frontend:** HTML5 + CSS3 + ES6 vanilla. Three.js no hero do pudim (`assets/vendor/three.module.js`).
- **Persistência atual:** `localStorage` (cart, lang, admin orders/products/leads, capacidade).
- **Backend:** ainda não existe — estrutura `server/` é placeholder pra próxima rodada (Fastify + Prisma + Postgres + JWT).
- **Build:** sem bundler. Cache busting manual via `?v=N` nos `<script>`/`<link>`.

---

## Estrutura

```
box-e-pudim/
├── index.html, pudim.html, box.html, admin.html   ← 4 páginas
├── app.js (pudim) · box.js · admin.js · entry.js  ← lógica por página
├── styles.css (pudim) · box.css · admin.css · entry.css
│
├── package.json · dev-server.mjs · start-server.bat
├── README.md · CHANGELOG.md · .gitignore
│
├── assets/
│   ├── config/config.js          ← waPhone, leadTime, freeShipping, version (FONTE ÚNICA)
│   ├── header/                   ← bk-header compartilhado (4 páginas)
│   │   ├── header.css
│   │   └── header.js             ← lang toggle, drawer mobile, swipe, scroll-spy
│   ├── cart/                     ← cart drawer universal (pudim + box)
│   │   ├── cart-drawer.css
│   │   └── cart-drawer.js        ← DOM transfer + validação (vazio + lead time 48h)
│   ├── concierge/
│   │   └── concierge-ai.js       ← NLU bilíngue, 13 intents (só pudim por enquanto)
│   ├── i18n/
│   │   └── box-i18n.js           ← traduções PT dos 16 produtos do box
│   ├── admin/
│   │   ├── admin-router.css
│   │   └── admin-router.js       ← router, KPIs reais, modal pedido manual
│   ├── img/                      ← imagens organizadas por tema
│   │   ├── products/             ← 5 imagens (classic-pudim, product-*)
│   │   ├── boxes/                ← 10 imagens (box-*)
│   │   ├── events/               ← 8 imagens (event-*)
│   │   └── lifestyle/            ← 8 imagens (hero, pudding-photo, table-photo, etc)
│   └── vendor/
│       └── three.module.js       ← Three.js (hero do pudim)
│
├── server/                       ← placeholder pra próxima rodada (NÃO rode npm start ainda)
├── docs/
│   ├── BRIEFING_ESTRATEGIA.md
│   ├── PROJECT_MEMORY.md         ← memória viva do projeto
│   ├── ROADMAP_ENTREGA.md
│   └── SESSION_HANDOFF.md
│
└── _archive/                     ← screenshots históricos + logs vazios (não vai pra produção)
    ├── qa-history/               ← 19 pastas qa-* arquivadas
    └── deprecated/
```

---

## Regra de ouro

**Toda mudança visual ou de comportamento que aparece no site público vai aplicada nos DOIS sites: `pudim.html` E `box.html`. Nada de mexer só num lado.**

Aplica a header, drawer mobile, lang toggle, switcher Pudim ↔ Box, cart drawer, marquee, concierge, footer, CTAs, microinterações, motion, ícones, breakpoints mobile e qualquer outra mudança transversal.

Ordem de trabalho:

1. Implementar nos arquivos compartilhados (`assets/header/`, `assets/cart/`, `assets/concierge/`)
2. Plugar em `pudim.html`
3. Plugar em `box.html` (mesma rodada)
4. Plugar em `index.html` quando fizer sentido
5. Plugar em `admin.html` quando aplicável
6. **Bumpar `?v=N` em TODOS os links/scripts dos 4 HTMLs** (sincronizado — atualmente `v=70`)
7. Validar em desktop **e** mobile (≤480px) nos dois sites antes de declarar "feito"

Exceção (mudança que só faz sentido num lado): documentar aqui no README ou em comentário no arquivo modificado.

---

## Configuração

Tudo o que muda por ambiente fica em `assets/config/config.js`:

```js
window.BK_CONFIG = {
  waPhone:        '15551234567',          // formato internacional, só dígitos
  leadTimeHours:  48,                     // bloqueia datas anteriores no cart
  freeShippingMin: 299,                   // USD
  pickupWindow:   'Saturday, 5–7 PM',
  storeRegion:    'Orlando, FL · USA',
  supportEmail:   'hello@brazilianpudding.com',
  adminMode:      'demo',                 // 'demo' | 'production'
  version:        '1.0.0',
};
```

`app.js`, `box.js` e `admin.js` leem `window.BK_CONFIG.waPhone` automaticamente — **não duplique o número em outros arquivos**.

Helpers globais expostos pelo `config.js`:

- `window.bkWaLink(msg)` — gera `https://wa.me/{waPhone}?text={msg encodado}`
- `window.bkIsValidPreorderDate(dateStr)` — valida data >= agora + leadTimeHours

---

## Checklist pré-produção (Hostinger KVM)

**Configuração**
- [ ] Trocar `waPhone` em `assets/config/config.js` pelo número real
- [ ] Conferir `freeShippingMin`, `leadTimeHours`, `pickupWindow`, `storeRegion`
- [ ] Mudar `adminMode` de `"demo"` pra `"production"` quando admin tiver senha real
- [ ] Bumpar `version` no `config.js` + `?v=N` em todos os HTMLs

**Conteúdo**
- [ ] Substituir imagens mock em `assets/img/` por fotos reais
- [ ] Trocar `data-bk-deadline` no marquee dos 3 HTMLs
- [ ] Revisar todas as descrições EN e PT

**Testes obrigatórios (Chrome devtools mobile + desktop)**
- [ ] Pudim: clicar todos os "Choose this", drawer abre, item adicionado
- [ ] Box: clicar todos os 16 chips do switch, drawer abre, item adicionado
- [ ] Cart drawer: validação bloqueia envio sem item / com data < 48h
- [ ] Lang toggle: PT/EN persiste entre páginas, todas as strings traduzem
- [ ] Drawer mobile: arrasta pra direita fecha
- [ ] Header sticky shrink no scroll
- [ ] Concierge IA responde pt+en, escala pra WhatsApp se não souber
- [ ] Admin: login, navega entre views, cria pedido manual, exporta CSV de leads, KPIs atualizam ao vivo

**Performance**
- [ ] Comprimir PNGs em `assets/img/` (vários > 1.5 MB) → `squoosh.app` ou `imagemin`
- [ ] Adicionar `loading="lazy"` em imagens fora do hero
- [ ] Habilitar gzip/brotli no Nginx
- [ ] Cache-Control: 1 ano em `assets/`, no-cache nos HTMLs

**SEO + tracking**
- [ ] Open Graph tags + Twitter Cards
- [ ] Schema.org `LocalBusiness` no `index.html`
- [ ] Google Search Console + sitemap.xml
- [ ] Plausible/Umami pra analytics privacy-friendly
- [ ] favicon, robots.txt

**Segurança**
- [ ] HTTPS via Let's Encrypt (`certbot --nginx`)
- [ ] HSTS header
- [ ] Content-Security-Policy ajustada (whatsapp.com, fonts.googleapis.com, unsplash.com)
- [ ] Admin com senha real (não `qualquer credencial entra` do modo demo)
- [ ] Rate limiting no Nginx pra `/admin*`

**Backend (próxima rodada)**
- [ ] Postgres rodando (managed ou KVM dedicada)
- [ ] Implementar `server/src/server.js` (Fastify + Prisma + JWT) — `package.json` já está em `server/`
- [ ] Migrar `localStorage` do admin pra API REST
- [ ] Webhook do WhatsApp Business Cloud API substitui `wa.me`
- [ ] Backup automático Postgres + assets

---

## Como NÃO quebrar nada

**Antes de mexer:**
1. Ler `docs/PROJECT_MEMORY.md` (memória viva do projeto)
2. Ler este README (regra de ouro + estrutura)
3. Confirmar que vai aplicar nos 2 sites se for transversal

**Depois de mexer:**
1. Bumpar `?v=N` em todos os HTMLs afetados (atualmente `v=70`)
2. Validar em Chrome devtools desktop **e** mobile (≤480px)
3. Testar fluxo completo: clicar produto → drawer abre → mudar qty → trocar lang → finalizar pelo WhatsApp
4. Console deve estar sem erros (`F12 → Console`)

**Em caso de bug visual de lang/drawer/cart:**
1. Hard reload (Ctrl+F5) pra invalidar cache
2. Inspecionar `localStorage[bp-lang]`, `localStorage[bp-admin-orders-state]`, `localStorage[bp-admin-wa-number]`
3. Console: `window.bkCart.refresh()`, `window.bkApplyI18n('pt')`, `window.bkHeader.setLang('en')`

---

## Histórico

Veja `CHANGELOG.md` para o changelog versionado e `docs/PROJECT_MEMORY.md` para decisões arquiteturais detalhadas.
