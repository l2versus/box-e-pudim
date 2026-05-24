# Roadmap de entrega - Brazilian Pudding / Box InHouse

## Norte do produto

O site precisa vender primeiro e operar depois. A experiencia publica deve parecer uma vitrine premium de encomendas, enquanto o admin precisa resolver quatro coisas simples: produtos, agenda, pedidos e leads.

## Fase 1 - Vitrine premium e fluxo de pedido

- Finalizar home de entrada com escolha clara entre Pudim e Box InHouse.
- Deixar `pudim.html` apenas para puddings, doces e eventos.
- Deixar `box.html` para meals, trays, savory boxes e gifts.
- Transformar o pedido em carrinho de encomenda:
  - produto
  - quantidade
  - data
  - horario ou janela
  - pickup/delivery
  - observacoes
  - total estimado
- Salvar lead antes de abrir WhatsApp para nao perder cliente.
- Gerar mensagem WhatsApp estruturada para o atendimento humano confirmar.

## Fase 2 - Admin operacional

- Login real para a dona.
- CRUD de produtos:
  - nome
  - categoria
  - descricao
  - preco
  - foto
  - ativo/pausado
  - pronta entrega ou sob encomenda
  - prazo minimo
  - quantidade/vagas
- Pedidos com status:
  - lead
  - solicitado
  - confirmado
  - pago
  - em producao
  - pronto
  - entregue/cancelado
- Agenda por dia com capacidade por categoria.
- Dashboard simples:
  - vendas do periodo
  - pedidos abertos
  - vagas restantes
  - produtos mais pedidos

## Fase 3 - Banco, arquivos e backend

- Trocar `localStorage` por banco real.
- Recomendacao tecnica: Postgres para pedidos, produtos, usuarios e agenda.
- Guardar imagens em storage de arquivos, nao dentro do banco.
- Criar API para:
  - listar produtos publicos
  - criar lead
  - criar pedido
  - atualizar status
  - atualizar produto
  - consultar agenda/capacidade
- Registrar eventos importantes para auditoria:
  - lead criado
  - pedido enviado ao WhatsApp
  - pagamento criado
  - status alterado

## Fase 4 - WhatsApp de verdade

Sem API, o site so consegue abrir o WhatsApp com texto pronto. Ele nao consegue ler a conversa depois que o cliente entra no app.

Com API, o caminho correto e:

- WhatsApp Business Platform ou provedor oficial.
- Webhook para receber mensagens.
- Tabela de conversas e mensagens no banco.
- Templates aprovados para confirmacao, pagamento e lembretes.
- Regras para escalar para humano quando houver alergia, evento grande, preco especial ou indisponibilidade.

## Fase 5 - Pagamento

- MVP: pagamento combinado no WhatsApp.
- Entregavel profissional: checkout com link de pagamento.
- Fluxo recomendado:
  - cliente monta preorder
  - pedido entra como `solicitado`
  - dona confirma disponibilidade
  - sistema gera link de pagamento
  - webhook confirma pagamento
  - pedido muda para `pago`
- Evitar confirmar producao automaticamente antes de validar agenda e capacidade.

## Fase 6 - IA concierge

- O chatbot deve vender, explicar regras e coletar pedido, mas nao confirmar sozinho quando depender de agenda.
- Funcoes esperadas:
  - responder prazos, pickup, delivery, pagamentos e produtos
  - sugerir itens por ocasiao
  - montar carrinho
  - criar lead no banco
  - encaminhar para WhatsApp com resumo
  - chamar humano em excecoes
- Base de conhecimento inicial:
  - politicas do negocio
  - horarios
  - areas atendidas
  - cardapio
  - regras de antecedencia

## Fase 7 - Hospedagem Hostinger

Para site estatico, hospedagem simples resolve. Para admin real, banco, upload, webhooks, WhatsApp API e checkout, o projeto precisa de backend.

Caminho pratico para Hostinger:

- Usar VPS/Cloud quando houver backend Node, webhooks e jobs.
- Usar dominio e SSL na Hostinger.
- Banco pode ficar gerenciado fora da VPS para reduzir manutencao.
- Manter variaveis secretas fora do codigo:
  - credenciais do banco
  - chave de pagamento
  - token do WhatsApp
  - chave da IA

## Fase 8 - QA e observabilidade

- Testar mobile primeiro.
- Testar fluxo completo:
  - produto ativo aparece no site
  - produto pausado some do site
  - carrinho calcula total
  - lead salva antes do WhatsApp
  - pedido aparece no admin
  - pagamento muda status
  - webhook do WhatsApp salva mensagem
- Monitorar:
  - erros JS
  - API lenta
  - falha de webhook
  - checkout abandonado
  - leads criados sem WhatsApp aberto

## Ordem sugerida de implementacao

1. Fechar UI publica e carrinho de encomenda.
2. Conectar produtos publicos ao admin local.
3. Escolher stack final de backend e banco.
4. Implementar auth, banco e storage.
5. Criar API de produtos, leads, pedidos e agenda.
6. Integrar checkout de pagamento.
7. Integrar WhatsApp API e webhooks.
8. Ligar IA concierge nas APIs internas.
9. Fazer QA mobile, performance e deploy na Hostinger.
