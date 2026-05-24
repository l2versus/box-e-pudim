# Session Handoff - Brazilian Pudding / Box InHouse

## Onde abrir

Use sempre o servidor local, nao `file://`, porque a vitrine do pudim usa Three.js/ES module:

`http://127.0.0.1:4173/index.html`

Rotas principais:

- Entrada split-screen: `http://127.0.0.1:4173/index.html`
- Brazilian Pudding: `http://127.0.0.1:4173/pudim.html`
- Box InHouse: `http://127.0.0.1:4173/box.html`

Painel admin demo:

`http://127.0.0.1:4173/admin.html`

## Estado atual

- `index.html` agora e a porta de entrada premium, separando Pudim e Box InHouse.
- A entrada virou split-screen full-screen e ganhou uma segunda dobra `entry-runway` com cards grandes para Pudim/Eventos e Box/Comfort food.
- `pudim.html` preserva a vitrine publica do pudim, focada em vender pudins e eventos, sem Box InHouse.
- `box.html` e uma primeira pagina propria para Box InHouse/comida em box.
- Header do Box foi alinhado ao padrao do Pudim: transparente no topo, glass/creme no scroll, marca redonda e nav em pill.
- Admin nao aparece mais no fluxo publico; ficou separado em `admin.html`.
- Hero foi redesenhado em estilo craft/e-commerce premium, inspirado no exemplo amarelo da Dribbble.
- Fundo principal amarelo/caramelo, produto grande no centro, CTA de reserva e preco na primeira dobra.
- Hero do pudim agora tem carrossel limpo com setas e tabs:
  - Classic
  - Berry
- A troca do hero atualiza:
  - imagem central
  - titulo
  - descricao
  - nome do produto
  - preco
  - select do formulario de pedido
- Mobile-first foi ajustado para fluxo vertical:
  - marca/header
  - titulo/proposta
  - produto central
  - seletor com setas
  - preco/reserva
- Concierge IA permanece como icone flutuante.
- WhatsApp ja esta interligado via `wa.me`, mas ainda usa numero fake.
- Admin agora tem cadastro demo de produtos com nome, categoria, valor, quantidade/vagas, tipo de venda, prazo, foto e ativo/pausado.
- Produtos do admin salvam no `localStorage`; ainda nao e banco real.

## Arquivos principais

- `index.html`: entrada split-screen com escolha Pudim x Box.
- `entry.css` / `entry.js`: visual, hover/touch expansion, parallax e reveal da entrada.
- `pudim.html`: vitrine publica do Brazilian Pudding.
- `styles.css`: visual completo, responsivo e hero craft.
- `app.js`: produtos, i18n, WhatsApp, concierge, carrossel, Three.js sutil.
- `box.html`: pagina publica Box InHouse.
- `box.css` / `box.js`: visual Box, troca de produto, parallax e WhatsApp.
- `admin.html`: painel privado demo.
- `admin.css`: visual do back office.
- `admin.js`: interacoes do painel demo.
- `README.md`: instrucoes de abertura e configuracao.
- `docs/BRIEFING_ESTRATEGIA.md`: blueprint tecnico/comercial.

## Assets reais adicionados

Os arquivos vieram de Downloads e foram copiados para `assets/`:

- `assets/product-classic-pudim.png`
- `assets/product-berry-pudim.png`
- `assets/product-shrimp-tray.png`
- `assets/product-dessert-cups.png`

Todos tinham transparencia real no canto (`alpha = 0`).

## Produtos no `app.js`

Atualmente o array `products` inclui:

- `classic-pudim`
- `berry-pudim`
- `gift-pudim`
- `brigadeiro-tray`
- `event-dessert-table`

O objeto `heroFeatures` controla os 2 produtos do hero:

- `classic`
- `berry`

## Validacoes feitas

Foram testados com Playwright/Chromium:

- Desktop hero.
- Mobile hero.
- Troca por setas.
- Troca por tabs.
- Admin escondido no site publico.
- Sem erro JS.
- Sem imagens quebradas.
- Sem overflow horizontal.
- Admin produtos: cadastro testado com Playwright, adicionando produto demo e atualizando contadores.
- Pudim limpo: `pudim.html` testado sem termos visiveis de Box InHouse, com tabs apenas `Puddings` e `Events`.
- Box header: testado no topo, no scroll e no mobile, sem erro JS e sem overflow.

Screenshots de QA ficaram em:

- `qa-product-pass/`
- `qa-carousel-pass/`
- `qa-admin-products/`
- `qa-pudim-clean/`
- `qa-box-header/`

## Decisoes importantes

- O site publico deve vender comida/produto, nao explicar painel ou sistema.
- Admin fica como URL privada direta, sem link visivel no site publico.
- Producao real provavelmente deve usar auth + banco (Supabase/Postgres ou similar).
- Para uma versao barata inicial, pode ser estatico + WhatsApp + planilha/admin simples, mas se quiser pedidos, estoque, agenda, login e historico com seguranca, precisa backend/banco.
- WhatsApp final depende de trocar `WA_PHONE` em `app.js`.
- Cadastro de produto final precisa conectar admin, banco e catalogo publico.
- O admin demo agora ja nasce com produtos novos de eventos, doces e Box InHouse, usando as fotos adicionadas em `assets/`.
- Leads de Pudim e Box sao salvos antes do clique no WhatsApp em `localStorage` para reduzir perda de cliente no MVP.
- Sem WhatsApp API nao existe historico real de conversa no admin; para isso precisa WhatsApp Business Platform/provedor oficial + webhook.
- Roadmap tecnico de entrega foi salvo em `docs/ROADMAP_ENTREGA.md`.

## Proximos ataques sugeridos

1. Refinar mobile acima da dobra com screenshots reais no browser do app.
2. Ajustar copy PT/EN para o publico brasileiro nos EUA.
3. Melhorar cards do menu para usar mais fotos reais sem fundo.
4. Criar fluxo de agendamento mais real:
   - data
   - horario
   - pickup/delivery
   - ZIP
   - disponibilidade por produto
5. Atualizar WhatsApp para mandar mensagens diferentes por produto.
6. Decidir stack final:
   - barato: site estatico + WhatsApp + Google Sheets/Airtable
   - robusto: Next/Supabase ou Vercel/Supabase
7. No admin, transformar demo em CRUD real:
   - produtos
   - pedidos
   - status
   - agenda/capacidade
   - vendas
   - leads
8. Conectar produtos cadastrados no admin ao site publico:
   - salvar em Supabase/Postgres
   - upload de foto
   - estoque/capacidade por dia
   - mostrar/ocultar no catalogo

## Nota para a proxima sessao

O usuario quer nivel visual premium, nao "cara de WordPress" e nao "vender sistema".
Tom certo: agir como senior UI/UX + ecommerce, mostrar resultado visual direto e evitar explicar demais.
