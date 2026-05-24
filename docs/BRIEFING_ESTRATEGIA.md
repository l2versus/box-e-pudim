# Estrategia do site - Brazilian Pudding / Box InHouse

## Leitura do briefing

O briefing original aponta para um site institucional com catalogo, agenda, painel admin, Instagram e WhatsApp. A melhoria principal e mudar a linguagem de "loja online" para "pre-order concierge": o produto e caseiro, a producao tem limite e o cliente precisa entender que a compra passa por confirmacao.

Pontos fortes do briefing:

- Ja reconhece que a agenda e a operacao sao a parte critica.
- Ja separa pudins e comida regional.
- Ja considera bilingue, recomendado para comunidade brasileira e publico americano.
- Ja considera painel simples para a esposa.

Pontos que eu acrescentaria:

- Regra clara de status do pedido: solicitado, confirmado, aguardando pagamento, em producao, pronto para retirada/entrega, concluido.
- Datas de corte por produto: pudim simples pode pedir com 48h, bandeja/evento pode exigir 3 a 5 dias.
- Capacidade por categoria, nao apenas por dia. Exemplo: 8 pudins/dia e 12 boxes/dia.
- Checkout por WhatsApp no MVP, mas com lead salvo no banco para nao perder cliente.
- Chatbot com limite de autoridade: ele explica e coleta dados, mas nao confirma encomenda sem disponibilidade/pagamento.
- Prova social: prints de WhatsApp, comentarios do Instagram, fotos de embalagem e bastidores.

## Instagram

Tentei abrir os perfis publicos pelo ambiente de pesquisa, mas o Instagram nao retornou conteudo acessivel sem a camada de login/bloqueio. Mesmo assim, o site ja deve prever integracao dos handles:

- https://www.instagram.com/brazilianpudding
- https://www.instagram.com/box_inhouse

Para a proxima etapa, o ideal e receber screenshots dos perfis, destaques, fotos de produto e mensagens comuns de clientes. Isso ajuda a extrair tom de voz, paleta real, produtos mais desejados e perguntas repetidas.

## Posicionamento recomendado

**Promessa:** Brazilian comfort food by pre-order, made fresh for your date.

**Em portugues:** O sabor do Brasil, feito sob encomenda para a sua data.

**O que vender primeiro:**

- Pudim classico e sabores fixos.
- Pudim/bolo de pudim para fim de semana.
- Boxes regionais com menu semanal.
- Bandejas e encomendas para aniversario, reuniao, empresa e comunidade brasileira.

## Fluxo do cliente

1. Cliente entra por Google, Instagram ou link do WhatsApp.
2. Escolhe idioma: ingles ou portugues.
3. Ve produtos agrupados por ocasiao: sobremesa, almoco/box, festa/evento.
4. Escolhe produto, quantidade, data, retirada/entrega e observacoes.
5. Site valida antecedencia minima e bloqueios basicos.
6. Site gera mensagem estruturada para WhatsApp.
7. Dona confirma disponibilidade, pagamento e horario.
8. Pedido confirmado entra no painel.

## WhatsApp

Sim, da para interligar ao WhatsApp deles.

### MVP barato

Usar links `wa.me` com mensagem pre-preenchida:

```text
https://wa.me/14075551234?text=Oi%2C%20gostaria%20de%20fazer%20uma%20encomenda
```

Vantagem: barato, simples, sem API, funciona com WhatsApp normal ou Business.

Limite: o site nao envia a mensagem sozinho. O cliente precisa tocar em "Enviar" dentro do WhatsApp.

### Versao avancada

Usar WhatsApp Business Platform/API por um provedor oficial ou pelo setup da Meta.

Vantagem: automacoes, templates, notificacoes, CRM e recuperacao de lead.

Limite: exige configuracao, aprovacao, templates e custo por conversa/mensagem dependendo do provedor e da Meta.

## Chatbot com IA

O chatbot nao deve ser um "vendedor solto". Ele deve ser um concierge com ferramentas:

- Responder regras do negocio: antecedencia, retirada, entrega, pagamento, ingredientes, eventos.
- Consultar disponibilidade real por data/produto.
- Coletar nome, produto, data, quantidade, ZIP e observacoes.
- Criar lead no banco antes de mandar para WhatsApp.
- Gerar link WhatsApp com resumo completo.
- Encaminhar para humano quando houver duvida, preco especial, alergia, evento grande ou excecao.

Stack IA recomendada:

- OpenAI Responses API para conversas com estado.
- Modelo economico para atendimento: GPT-5.4 mini ou equivalente atual no momento da implementacao.
- Base de conhecimento pequena no banco no inicio. File Search/vector store so quando houver muitos documentos, politicas, cardapios e FAQs.

Fontes oficiais OpenAI verificadas:

- A pagina oficial de precos mostra GPT-5.4 mini a US$0.75 / 1M tokens de entrada e US$4.50 / 1M tokens de saida: https://openai.com/api/pricing/
- A documentacao de GPT-5.5 recomenda Responses API para uso com ferramentas, reasoning e conversas multi-turn: https://developers.openai.com/api/docs/guides/latest-model
- A documentacao de File Search explica vector stores e busca em arquivos na Responses API: https://platform.openai.com/docs/guides/tools-file-search
- A documentacao de retrieval informa que vector stores tem 1GB gratis e custo alem disso: https://platform.openai.com/docs/guides/retrieval

## Precisa de SQL?

### Sem SQL da para fazer

Serve para um MVP ultra barato:

- Site estatico.
- Catalogo em JSON no codigo.
- WhatsApp com mensagem pre-preenchida.
- Sem painel real.
- Alteracoes feitas por dev.

Custo: dominio e talvez zero de hospedagem.

### Com SQL e melhor para o que ele pediu

Como ele quer agenda, controle pelo celular, produtos editaveis e IA sem perder cliente, eu recomendo banco desde o MVP operacional.

Tabelas iniciais:

- `products`: nome, categoria, descricao, preco, tamanho, lead time, ativo.
- `availability_days`: data, aceita pedidos, capacidade por categoria, observacao.
- `orders`: status, produto, quantidade, data desejada, cliente, WhatsApp, ZIP, observacoes.
- `business_rules`: regras de entrega, pagamento, horario, antecedencia, politicas.
- `chat_leads`: conversa, intencao, dados coletados, link WhatsApp gerado.
- `testimonials`: depoimentos e origem.

SQL recomendado: Cloudflare D1 ou Supabase/Postgres.

## Hospedagem

### Recomendacao mais barata e robusta

**Cloudflare Pages + Workers + D1**

- Pages para frontend estatico.
- Workers para API, WhatsApp link, chatbot e painel.
- D1 como SQL pequeno para produtos, pedidos e agenda.
- R2 para imagens quando precisar.

Por que gosto desta opcao: para um negocio pequeno, e muito barato, rapido e aguenta trafego local/Instagram. A documentacao oficial informa Workers Free com 100.000 requests/dia e Workers Paid a partir de US$5/mes, alem de D1 com cotas gratuitas de leitura/escrita/armazenamento: https://developers.cloudflare.com/workers/platform/pricing/

### Recomendacao mais facil para Next.js/admin rico

**Vercel + Supabase**

- Melhor DX se formos criar app Next.js completo.
- Supabase entrega Postgres, auth, storage e painel.
- Para negocio comercial, Vercel Pro costuma ser o plano adequado. A pagina oficial lista Hobby gratis e Pro a partir de US$20/mes + uso: https://vercel.com/pricing
- Supabase Free tem 500MB de banco, 1GB de storage e 50k MAU; Pro inclui cotas maiores e aparece nos exemplos oficiais a US$25/mes: https://supabase.com/docs/guides/platform/billing-on-supabase

### Caminho de pagamento

Comecar sem checkout online, com Zelle/Venmo/Cash App/PayPal combinado no WhatsApp. Integrar Stripe quando tiver dados fiscais/conta preparados. A Stripe informa que para aceitar pagamentos em live mode e necessario ativar a conta e cumprir KYC, coletando dados do negocio e da pessoa responsavel: https://docs.stripe.com/get-started/account/activate

## Roadmap

### Fase 1 - MVP vendedor

- Site bilingue premium.
- Catalogo por categoria.
- Formulario de pre-pedido.
- Link WhatsApp com resumo.
- SEO local.
- Instagram e prova social.

### Fase 2 - Operacao

- Banco SQL.
- Painel privado mobile.
- Bloqueio de agenda.
- Limite por categoria/produto.
- Cadastro de pedidos e status.

### Fase 3 - IA

- Concierge no site.
- Consulta de disponibilidade.
- Lead salvo antes do WhatsApp.
- Respostas baseadas nas regras do negocio.
- Handoff para WhatsApp quando precisar de humano.

### Fase 4 - Crescimento

- Pagamento online.
- Cupons e campanhas sazonais.
- Captura de emails/WhatsApp para lista VIP.
- Relatorio de demanda por produto e bairro/ZIP.
