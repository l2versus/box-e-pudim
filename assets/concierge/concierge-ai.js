/* ============================================================
   Brazilian Kitchen — Concierge AI (NLU local, sem API externa)

   Recursos:
   - Intent detection multi-keyword com weights
   - Multi-intent (responde múltiplas perguntas em sequência)
   - Trilíngue (EN/PT/ES) baseado em localStorage[bp-lang]
   - Variáveis dinâmicas: hora atual, próximo sábado, WA real
   - Chips de follow-up clicáveis
   - Escalação pro WhatsApp com mensagem pré-formatada
   - Tom da marca: caloroso, direto, sempre orienta uma próxima ação
   - Roda em pudim.html E box.html (atende as duas lojas)
   - Render via textContent/DOM seguro (sem innerHTML)
   ============================================================ */
(() => {
  'use strict';

  const chatForm = document.querySelector('[data-chat-form]');
  const chatBody = document.querySelector('[data-chat-body]');
  if (!chatForm || !chatBody) return;

  /* ----- Idioma (trilíngue) ----- */
  const getLang = () => {
    try {
      const v = localStorage.getItem('bp-lang');
      return v === 'pt' || v === 'es' ? v : 'en';
    } catch { return 'en'; }
  };
  // Helper trilíngue: escolhe a string pelo idioma atual com fallback EN.
  const T3 = (en, pt, es) => ({ en, pt, es }[getLang()] ?? en);

  /* ----- Configurações da loja (puxa de localStorage quando possível) ----- */
  const getWaNumber = () => {
    const raw = localStorage.getItem('bp-admin-wa-number') || window.BK_CONFIG?.waPhone || '+1 (203) 482-2797';
    return raw.replace(/\D/g, '');
  };
  const waLink = (msg) => `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`;

  /* ----- Helpers de data/hora ----- */
  const fmtHour = () => {
    const h = new Date().getHours();
    const slot = h < 12 ? 'am' : h < 18 ? 'pm' : 'eve';
    return T3(
      { am: 'morning', pm: 'afternoon', eve: 'evening' }[slot],
      { am: 'manhã', pm: 'tarde', eve: 'noite' }[slot],
      { am: 'mañana', pm: 'tarde', eve: 'noche' }[slot],
    );
  };
  const nextSaturday = () => {
    const d = new Date();
    const days = (6 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + days);
    return d;
  };
  const fmtDate = (d) => {
    const loc = { en: 'en-US', pt: 'pt-BR', es: 'es-US' }[getLang()] || 'en-US';
    return d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'short' });
  };

  /* ============================================================
     Knowledge base (intents + respostas)
     Cada intent tem keywords (PT+EN+ES) e renderizadores trilíngues.
     ============================================================ */
  const INTENTS = [
    {
      id: 'greeting',
      kw: ['oi', 'olá', 'ola', 'eai', 'opa', 'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'bom dia', 'boa tarde', 'boa noite', 'hola', 'buenas', 'buenos dias', 'buenas tardes'],
      reply: () => T3(
        `Hi there! Good ${fmtHour()}. I'm the Brazilian Kitchen assistant. I can help with lead times, delivery, flavors, payment or events. What can I help you with?`,
        `Oi! Boa ${fmtHour()}. Sou o assistente da Brazilian Kitchen. Posso ajudar com prazo, entrega, sabores, pagamento ou eventos. O que você procura?`,
        `¡Hola! Buena ${fmtHour()}. Soy el asistente de Brazilian Kitchen. Puedo ayudarte con plazos, entrega, sabores, pago o eventos. ¿En qué te ayudo?`,
      ),
      chips: () => T3(
        ['Lead time', 'Flavors', 'Payment', 'Events'],
        ['Prazo de entrega', 'Sabores', 'Pagamento', 'Eventos'],
        ['Plazo', 'Sabores', 'Pago', 'Eventos'],
      ),
    },
    {
      id: 'lead_time',
      kw: ['prazo', 'antecedência', 'antecedencia', 'quantos dias', 'quanto tempo', 'quando', 'how early', 'how long', 'lead time', 'how far in advance', 'preorder time', 'cedo', 'cuándo', 'cuando', 'cuántos días', 'con cuánto tiempo', 'anticipación'],
      reply: () => {
        const sat = fmtDate(nextSaturday());
        return T3(
          `Minimum lead time is 48h for pudim and boxes — events need 3 to 5 days. Next open window: Saturday, ${sat}, pickup 5–7:30 PM. If you need a specific date, tell me and I'll check capacity.`,
          `O mínimo é 48h pra pudim e boxes — eventos pedem 3 a 5 dias. Próxima janela aberta: sábado, ${sat}, retirada 5–7:30 PM. Se você precisa pra uma data específica, me conta que verifico capacidade.`,
          `El mínimo es 48h para pudim y boxes — los eventos piden de 3 a 5 días. Próxima ventana abierta: sábado, ${sat}, para recoger 5–7:30 PM. Si necesitas una fecha específica, dime y reviso la disponibilidad.`,
        );
      },
      chips: () => T3(
        ['Reserve now', 'Do you deliver?', 'How do I pay?'],
        ['Reservar agora', 'Tem entrega?', 'Como pago?'],
        ['Reservar ahora', '¿Hacen entrega?', '¿Cómo pago?'],
      ),
    },
    {
      id: 'delivery',
      kw: ['entrega', 'deliver', 'frete', 'shipping', 'zip', 'cep', 'endereço', 'endereco', 'address', 'pickup', 'retirada', 'envio', 'domicilio', 'recoger', 'dirección', 'direccion', 'reparto'],
      reply: () => T3(
        `We serve Danbury, CT 06810 and nearby areas with scheduled pickup or local delivery. The site checks the ZIP before WhatsApp; pickup is free.`,
        `Atendemos Danbury, CT 06810 e arredores com retirada agendada ou entrega local. O site calcula pelo ZIP antes do WhatsApp; pickup e gratuito.`,
        `Atendemos Danbury, CT 06810 y alrededores con recogida agendada o entrega local. El sitio calcula por el ZIP antes del WhatsApp; recoger es gratis.`,
      ),
      chips: () => T3(
        ['I want delivery', 'I will pick up', "What's the lead time?"],
        ['Quero entrega', 'Vou retirar', 'Qual o prazo?'],
        ['Quiero entrega', 'Voy a recoger', '¿Cuál es el plazo?'],
      ),
    },
    {
      id: 'payment',
      kw: ['pagamento', 'pagar', 'pay', 'payment', 'zelle', 'venmo', 'cash app', 'pix', 'cartão', 'cartao', 'card', 'credit', 'pago', 'tarjeta', 'efectivo'],
      reply: () => T3(
        `We accept Zelle, Venmo and Cash App. Deposit or full payment locks your slot and starts production. Credit card on request — message us on WhatsApp to set it up.`,
        `Aceitamos Zelle, Venmo e Cash App. O depósito ou pagamento integral confirma a vaga e libera a produção. Cartão de crédito sob consulta — me chama no WhatsApp pra fechar.`,
        `Aceptamos Zelle, Venmo y Cash App. El depósito o el pago completo confirma tu lugar e inicia la producción. Tarjeta de crédito a consultar — escríbenos por WhatsApp para coordinar.`,
      ),
      chips: () => T3(
        ['Open WhatsApp', "What's the price?", 'Can I cancel?'],
        ['Falar no WhatsApp', 'Qual o valor?', 'Cancelo se mudar?'],
        ['Abrir WhatsApp', '¿Cuál es el precio?', '¿Puedo cancelar?'],
      ),
    },
    {
      id: 'flavors',
      kw: ['sabor', 'sabores', 'flavor', 'flavors', 'gosto', 'tipo', 'tipos', 'kind', 'kinds', 'menu', 'cardápio', 'cardapio', 'opções', 'opcoes', 'options', 'menú', 'opciones'],
      reply: () => T3(
        `Our hero is the Classic Pudim (silky caramel). We also do Berry Pudim, birthday cakes, sweet trays, savory boxes and gift boxes. Want photos and pricing on any specific one?`,
        `O carro-chefe é o Pudim Clássico (caramelo cremoso). Tem também o Berry Pudim (frutas vermelhas), bolos de aniversário, bandejas de doces, boxes salgados e gift boxes. Posso te mandar fotos e preços de algum específico?`,
        `El favorito es el Pudim Clásico (caramelo cremoso). También hay Berry Pudim (frutos rojos), pasteles de cumpleaños, bandejas de dulces, boxes salados y gift boxes. ¿Te mando fotos y precios de alguno?`,
      ),
      chips: () => T3(
        ['Classic Pudim', 'Birthday cake', 'Party sweets'],
        ['Pudim Clássico', 'Bolo de aniversário', 'Doces de festa'],
        ['Pudim Clásico', 'Pastel de cumpleaños', 'Dulces de fiesta'],
      ),
    },
    {
      id: 'price',
      kw: ['preço', 'preco', 'valor', 'custa', 'price', 'cost', 'how much', 'quanto custa', 'cheapest', 'mais barato', 'mais caro', 'precio', 'cuánto cuesta', 'cuanto cuesta', 'cuánto vale'],
      reply: () => T3(
        `Classic Pudim: from $28. Berry Pudim: from $34. Sweet tray: $48–$140 (qty-based). Custom cake: $68+. Events have dedicated quotes — tell me your date and guest count and I'll send numbers.`,
        `Pudim Clássico: a partir de $28. Berry Pudim: a partir de $34. Bandeja de doces: $48–$140 (depende da quantidade). Bolo personalizado: $68+. Eventos têm orçamento dedicado — me conta sua data e número de convidados que monto.`,
        `Pudim Clásico: desde $28. Berry Pudim: desde $34. Bandeja de dulces: $48–$140 (según cantidad). Pastel personalizado: $68+. Los eventos tienen cotización dedicada — dime tu fecha y número de invitados y te paso números.`,
      ),
      chips: () => T3(
        ['Reserve', 'Event slots?', 'How to pay?'],
        ['Reservar', 'Vagas pra festa?', 'Como pagar?'],
        ['Reservar', '¿Cupos para fiesta?', '¿Cómo pagar?'],
      ),
    },
    {
      id: 'events',
      kw: ['festa', 'aniversário', 'aniversario', 'casamento', 'evento', 'event', 'party', 'birthday', 'wedding', 'celebration', 'celebração', 'baby shower', 'corporate', 'fiesta', 'cumpleaños', 'cumpleanos', 'boda'],
      reply: () => T3(
        `Events are planned by date, guest count and format. We ask for 3–5 days lead time. We can build a package (pudim + sweets + cake) or just part of it. Tell me the date and headcount?`,
        `Eventos são planejados com base na data, número de convidados e formato. Pedimos 3–5 dias de antecedência. Posso fechar um pacote (pudim + doces + bolo) ou só uma parte. Me conta a data e quantos vão estar?`,
        `Los eventos se planean por fecha, número de invitados y formato. Pedimos de 3 a 5 días de anticipación. Puedo armar un paquete (pudim + dulces + pastel) o solo una parte. ¿Me dices la fecha y cuántas personas?`,
      ),
      chips: () => T3(
        ['Get a quote', '20 people', '50+ people'],
        ['Cotar evento', '20 pessoas', '50+ pessoas'],
        ['Cotizar evento', '20 personas', '50+ personas'],
      ),
    },
    {
      id: 'allergens',
      kw: ['alergia', 'alérgico', 'alergico', 'sem glúten', 'sem gluten', 'gluten free', 'lactose', 'vegano', 'vegan', 'allergy', 'allergic', 'kosher', 'halal', 'restrição', 'restricao', 'sin gluten', 'lactosa', 'alérgeno'],
      reply: () => T3(
        `Our base recipes use dairy, eggs, gluten, sugar and may contain nuts traces. Lactose-free and gluten-free are made on request — always flag allergens so we can isolate production.`,
        `Trabalhamos com leite, ovos, glúten, açúcar e podemos ter traços de nuts. Versões sem lactose e sem glúten saem sob encomenda — sempre confirme alérgenos no pedido pra eu separar a produção.`,
        `Las recetas base llevan lácteos, huevos, gluten, azúcar y pueden tener trazas de nueces. Las versiones sin lactosa y sin gluten se hacen por encargo — avisa siempre los alérgenos para separar la producción.`,
      ),
      chips: () => T3(
        ['Lactose-free', 'Gluten-free', 'Talk on WhatsApp'],
        ['Sem lactose', 'Sem glúten', 'Falar pelo WhatsApp'],
        ['Sin lactosa', 'Sin gluten', 'Hablar por WhatsApp'],
      ),
    },
    {
      id: 'cancel',
      kw: ['cancelar', 'cancel', 'reembolso', 'refund', 'desistir', 'mudar data', 'reschedule', 'remarcar', 'cancelación', 'reagendar', 'devolución'],
      reply: () => T3(
        `Cancellations with 24+ hours notice get a full refund. Within 24h we can reschedule to another date at no extra cost. Events have a separate policy — message us on WhatsApp.`,
        `Cancelamentos com 24h+ de antecedência têm reembolso integral. Dentro de 24h conseguimos remarcar pra outra data, sem custo extra. Eventos têm política específica — me chama no WhatsApp pra alinhar.`,
        `Las cancelaciones con 24h+ de aviso tienen reembolso completo. Dentro de 24h podemos reagendar a otra fecha sin costo extra. Los eventos tienen su propia política — escríbenos por WhatsApp.`,
      ),
      chips: () => T3(['Talk to the owner', 'Reschedule order'], ['Falar com a dona', 'Remarcar pedido'], ['Hablar con la dueña', 'Reagendar pedido']),
    },
    {
      id: 'hours',
      kw: ['horário', 'horario', 'hora', 'hours', 'open', 'aberto', 'fecha', 'close', 'expediente', 'horarios', 'abierto', 'cierran'],
      reply: () => T3(
        `We work by schedule — there's no walk-in counter. WhatsApp messages are answered 9am–9pm EST. Pickup is usually between 5pm and 7:30pm on batch days.`,
        `A produção é por agenda — não temos horário de balcão. Mensagens no WhatsApp são respondidas das 9h às 21h (EST). Pickup costuma ser entre 17h e 19h30 nos dias de batch.`,
        `Trabajamos por agenda — no hay mostrador para visitas. Respondemos por WhatsApp de 9am a 9pm (EST). La recogida suele ser entre 5pm y 7:30pm en los días de lote.`,
      ),
      chips: () => T3(['Reserve', 'Message now'], ['Reservar', 'Falar agora'], ['Reservar', 'Escribir ahora']),
    },
    {
      id: 'human',
      kw: ['atendente', 'humano', 'pessoa', 'falar com', 'real person', 'human', 'someone', 'representante', 'owner', 'dona', 'persona', 'dueña', 'agente'],
      reply: () => T3(
        `Of course — the owner replies directly on WhatsApp. Tap "Open chat" below and I'll send you in with a starter message.`,
        `Claro — a dona responde direto pelo WhatsApp. Toque "Abrir conversa" abaixo que eu te levo com uma mensagem inicial pronta.`,
        `Claro — la dueña responde directo por WhatsApp. Toca "Abrir chat" abajo y te llevo con un mensaje inicial listo.`,
      ),
      chips: () => T3(['Open chat'], ['Abrir conversa'], ['Abrir chat']),
      action: { type: 'wa', text: { en: "Hi! I'd like to chat about an order.", pt: 'Oi! Queria conversar sobre um pedido.', es: '¡Hola! Quisiera conversar sobre un pedido.' } },
    },
    {
      id: 'thanks',
      kw: ['obrigado', 'obrigada', 'valeu', 'thanks', 'thank you', 'thx', 'gracias', 'mil gracias'],
      reply: () => T3(
        `Thank you! Anytime. Want me to send you to WhatsApp to wrap it up?`,
        `Eu que agradeço! Quando precisar é só chamar. Se quiser, posso te mandar pro WhatsApp pra fechar?`,
        `¡Gracias a ti! Cuando quieras. Si deseas, ¿te llevo al WhatsApp para cerrar el pedido?`,
      ),
      chips: () => T3(['Open WhatsApp', 'Keep browsing'], ['Falar no WhatsApp', 'Continuar olhando'], ['Abrir WhatsApp', 'Seguir mirando']),
    },
  ];

  /* ============================================================
     Intent classifier — score por keyword match com pesos
     ============================================================ */
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')   // remove acentos
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function classify(text) {
    const t = normalize(text);
    if (!t) return [];
    const scored = INTENTS.map((intent) => {
      let score = 0;
      for (const kw of intent.kw) {
        const n = normalize(kw);
        if (!n) continue;
        if (t === n) score += 5;
        else if (t.includes(' ' + n + ' ') || t.startsWith(n + ' ') || t.endsWith(' ' + n)) score += 3;
        else if (t.includes(n)) score += 2;
      }
      return { intent, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
    return scored;
  }

  /* ============================================================
     Render — sempre textContent (seguro contra XSS) + DOM nodes
     ============================================================ */
  function renderMessage(text, role, opts = {}) {
    const node = document.createElement('div');
    node.className = `chat-message ${role}`;
    node.textContent = text;
    chatBody.appendChild(node);

    if (opts.chips?.length) {
      const chipsRow = document.createElement('div');
      chipsRow.className = 'chat-chips';
      chipsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px;';
      opts.chips.forEach((label) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.style.cssText = `
          font: inherit; font-size: 12px; font-weight: 700;
          padding: 6px 12px; border-radius: 999px;
          border: 1px solid rgba(0,0,0,.12); background: #fff;
          cursor: pointer; color: #17120f;
          transition: background .2s, border-color .2s, transform .2s;
        `;
        b.onmouseenter = () => { b.style.background = '#f3eadf'; b.style.transform = 'translateY(-1px)'; };
        b.onmouseleave = () => { b.style.background = '#fff'; b.style.transform = 'translateY(0)'; };
        b.onclick = () => {
          renderUser(label);
          handleInput(label);
        };
        chipsRow.appendChild(b);
      });
      chatBody.appendChild(chipsRow);
    }

    if (opts.action?.type === 'wa') {
      const lang = getLang();
      const link = document.createElement('a');
      link.href = waLink(opts.action.text[lang] || opts.action.text.en);
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = T3('Open WhatsApp chat →', 'Abrir conversa no WhatsApp →', 'Abrir chat de WhatsApp →');
      link.style.cssText = `
        display: inline-flex; align-items: center; gap: 6px;
        margin: 4px 0 14px;
        padding: 8px 14px;
        border-radius: 999px;
        background: linear-gradient(135deg, #25d366, #128c7e);
        color: #fff; text-decoration: none;
        font-size: 13px; font-weight: 700;
      `;
      chatBody.appendChild(link);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderUser(text) {
    renderMessage(text, 'user');
  }

  // Localiza o "chrome" do concierge (status, placeholder, atalhos) — necessário
  // no box.html, que não carrega o app.js que traduz os data-i18n do pudim.
  function localizeChrome() {
    const dock = chatBody.closest('.concierge-dock') || document;
    const status = dock.querySelector('.chat-header span');
    if (status) status.textContent = T3('Guided preorder', 'Pré-pedido guiado', 'Pre-pedido guiado');
    const input = document.querySelector('[data-chat-form] input[name="question"]');
    if (input) input.placeholder = T3('Ask about preorder, pickup or delivery', 'Pergunte sobre encomenda, retirada ou entrega', 'Pregunta sobre encargo, recogida o entrega');
    const shortLabels = {
      notice: T3('How early?', 'Antecedência?', '¿Anticipación?'),
      delivery: T3('Delivery?', 'Entrega?', '¿Entrega?'),
      events: T3('Party order?', 'Festa?', '¿Fiesta?'),
    };
    document.querySelectorAll('.quick-questions button').forEach((b) => {
      const k = b.dataset.question;
      if (shortLabels[k]) b.textContent = shortLabels[k];
    });
  }

  /* ============================================================
     Núcleo: interpretar + responder
     ============================================================ */
  function handleInput(rawText) {
    const matches = classify(rawText);

    if (!matches.length) {
      // Fallback: nem uma keyword pegou — oferece WA
      renderMessage(
        T3(
          "I don't have a ready answer for that, but I can connect you with the owner to sort it out. Want me to?",
          'Não tenho uma resposta pronta pra essa, mas posso te conectar direto com a dona pra resolver. Quer?',
          'No tengo una respuesta lista para eso, pero puedo conectarte directo con la dueña para resolverlo. ¿Quieres?',
        ),
        'assistant',
        {
          chips: T3(['Yes, message now', 'See menu', 'Lead time'], ['Sim, falar agora', 'Ver cardápio', 'Prazo de entrega'], ['Sí, escribir ahora', 'Ver menú', 'Plazo de entrega']),
          action: { type: 'wa', text: { en: `Hi! I asked: "${rawText}". Can you help?`, pt: `Oi! Perguntei: "${rawText}". Pode me ajudar?`, es: `¡Hola! Pregunté: "${rawText}". ¿Me puedes ayudar?` } },
        },
      );
      return;
    }

    // Top intent
    const { intent } = matches[0];
    renderMessage(intent.reply(), 'assistant', {
      chips: intent.chips ? intent.chips() : undefined,
      action: intent.action,
    });

    // Multi-intent: se o segundo match tem score >= 3, responde em sequência (resumido)
    if (matches[1] && matches[1].score >= 3 && matches[1].intent.id !== intent.id) {
      setTimeout(() => {
        const second = matches[1].intent;
        const prefix = T3('Also about ', 'E sobre ', 'Y sobre ');
        renderMessage(prefix + second.id.replace(/_/g, ' ') + ': ' + second.reply(), 'assistant', {
          chips: second.chips ? second.chips() : undefined,
        });
      }, 600);
    }
  }

  /* ============================================================
     Substituir handlers do legacy (app.js no pudim)
     ============================================================ */
  // Remover listener antigo do form (clonando o nó pra limpar listeners)
  const newForm = chatForm.cloneNode(true);
  chatForm.parentNode.replaceChild(newForm, chatForm);

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const input = newForm.elements.question;
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    renderUser(value);
    setTimeout(() => handleInput(value), 250);
  });

  // Quick questions: também substituir
  document.querySelectorAll('.quick-questions button').forEach((btn) => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', () => {
      const lang = getLang();
      const labels = {
        notice:   { en: 'How early do I need to order?', pt: 'Com quanta antecedência preciso pedir?', es: '¿Con cuánta anticipación debo pedir?' },
        delivery: { en: 'Do you deliver?', pt: 'Vocês fazem entrega?', es: '¿Hacen entrega?' },
        events:   { en: 'How do event orders work?', pt: 'Como funcionam pedidos pra evento?', es: '¿Cómo funcionan los pedidos para evento?' },
      };
      const q = labels[fresh.dataset.question]?.[lang] || fresh.textContent;
      renderUser(q);
      setTimeout(() => handleInput(q), 250);
    });
  });

  localizeChrome();

  /* ----- Substituir mensagem inicial ----- */
  const initial = chatBody.querySelector('.chat-message.assistant');
  const introText = T3(
    `Hi! Good ${fmtHour()}. I can help with lead time, flavors, delivery, payment or events. Ask anything or tap a quick reply.`,
    `Oi! Boa ${fmtHour()}. Posso ajudar com prazo, sabores, entrega, pagamento ou eventos. Pergunta o que quiser ou toque numa sugestão.`,
    `¡Hola! Buena ${fmtHour()}. Puedo ayudarte con plazos, sabores, entrega, pago o eventos. Pregunta lo que quieras o toca una sugerencia.`,
  );
  if (initial) initial.textContent = introText;

  // Atualizar quando idioma mudar. No pudim a troca dispara DOIS eventos
  // (bp:lang-change do app.js + bk:lang-change do header.js); o guard por
  // idioma evita o toast duplicado — só reage quando o idioma realmente muda.
  let lastToastLang = getLang();
  const onLangChange = () => {
    const l = getLang();
    if (l === lastToastLang) return;
    lastToastLang = l;
    localizeChrome();
    renderMessage(
      T3('Language switched to English. How can I help?', 'Idioma alterado pra português. Em que posso ajudar?', 'Idioma cambiado a español. ¿En qué puedo ayudar?'),
      'assistant',
      { chips: T3(['Lead time', 'Delivery', 'Flavors', 'Payment'], ['Prazo', 'Entrega', 'Sabores', 'Pagamento'], ['Plazo', 'Entrega', 'Sabores', 'Pago']) },
    );
  };
  document.addEventListener('bp:lang-change', onLangChange);
  document.addEventListener('bk:lang-change', onLangChange);

  // Abrir/fechar o dock: no pudim o app.js já cuida (via delegação).
  // No box.html não há app.js (detectado por window.bkSetLegacyLang), então tratamos aqui.
  if (typeof window.bkSetLegacyLang !== 'function') {
    const dockRoot = document.querySelector('[data-concierge]');
    const toggle = (force) => {
      if (!dockRoot) return;
      const open = force ?? !dockRoot.classList.contains('is-open');
      dockRoot.classList.toggle('is-open', open);
      document.querySelectorAll('[data-chat-toggle]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
    };
    document.querySelectorAll('[data-chat-toggle]').forEach((b) => b.addEventListener('click', () => toggle()));
    document.querySelectorAll('[data-chat-close]').forEach((b) => b.addEventListener('click', () => toggle(false)));
  }

  /* expor pra debug ----- */
  window.bkConcierge = { handleInput, classify, INTENTS };
})();
