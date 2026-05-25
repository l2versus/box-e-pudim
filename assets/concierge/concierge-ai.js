/* ============================================================
   Brazilian Pudding — Concierge AI (NLU local, sem API externa)

   Recursos:
   - Intent detection multi-keyword com weights
   - Multi-intent (responde múltiplas perguntas em sequência)
   - Bilíngue (EN/PT) baseado em localStorage[bp-lang]
   - Variáveis dinâmicas: hora atual, próximo sábado, WA real, kpis live
   - Chips de follow-up clicáveis
   - Escalação pro WhatsApp com mensagem pré-formatada
   - Tom da marca: caloroso, direto, sempre orienta uma próxima ação
   ============================================================ */
(() => {
  'use strict';

  const chatForm = document.querySelector('[data-chat-form]');
  const chatBody = document.querySelector('[data-chat-body]');
  if (!chatForm || !chatBody) return;

  /* ----- Idioma ----- */
  const getLang = () => {
    try {
      const v = localStorage.getItem('bp-lang');
      return v === 'pt' ? 'pt' : 'en';
    } catch { return 'en'; }
  };

  /* ----- Configurações da loja (puxa de localStorage quando possível) ----- */
  const getWaNumber = () => {
    const raw = localStorage.getItem('bp-admin-wa-number') || window.BK_CONFIG?.waPhone || '+1 (203) 482-2797';
    return raw.replace(/\D/g, '');
  };
  const waLink = (msg) => `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`;

  /* ----- Helpers de data/hora ----- */
  const fmtHourPt = () => {
    const h = new Date().getHours();
    if (h < 12) return 'manhã';
    if (h < 18) return 'tarde';
    return 'noite';
  };
  const fmtHourEn = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  };
  const nextSaturday = () => {
    const d = new Date();
    const days = (6 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + days);
    return d;
  };
  const fmtDate = (d, lang) => d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  /* ============================================================
     Knowledge base (intents + respostas)
     Cada intent tem keywords (PT+EN) e renderizadores bilíngues.
     ============================================================ */
  const INTENTS = [
    {
      id: 'greeting',
      kw: ['oi', 'olá', 'ola', 'eai', 'opa', 'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'bom dia', 'boa tarde', 'boa noite'],
      reply: (lang) => lang === 'pt'
        ? `Oi! Boa ${fmtHourPt()}. Sou o assistente do Brazilian Pudding. Posso ajudar com prazo, entrega, sabores, pagamento ou eventos. O que você procura?`
        : `Hi there! Good ${fmtHourEn()}. I'm the Brazilian Pudding assistant. I can help with lead times, delivery, flavors, payment or events. What can I help you with?`,
      chips: (lang) => lang === 'pt'
        ? ['Prazo de entrega', 'Sabores', 'Pagamento', 'Eventos']
        : ['Lead time', 'Flavors', 'Payment', 'Events'],
    },
    {
      id: 'lead_time',
      kw: ['prazo', 'antecedência', 'antecedencia', 'quantos dias', 'quanto tempo', 'quando', 'how early', 'how long', 'lead time', 'how far in advance', 'preorder time', 'cedo'],
      reply: (lang) => {
        const sat = fmtDate(nextSaturday(), lang);
        return lang === 'pt'
          ? `O mínimo é 48h pra pudim e boxes — eventos pedem 3 a 5 dias. Próxima janela aberta: sábado, ${sat}, retirada 5–7:30 PM. Se você precisa pra uma data específica, me conta que verifico capacidade.`
          : `Minimum lead time is 48h for pudim and boxes — events need 3 to 5 days. Next open window: Saturday, ${sat}, pickup 5–7:30 PM. If you need a specific date, tell me and I'll check capacity.`;
      },
      chips: (lang) => lang === 'pt'
        ? ['Reservar agora', 'Tem entrega?', 'Como pago?']
        : ['Reserve now', 'Do you deliver?', 'How do I pay?'],
    },
    {
      id: 'delivery',
      kw: ['entrega', 'deliver', 'frete', 'shipping', 'zip', 'cep', 'endereço', 'endereco', 'address', 'pickup', 'retirada', 'envio'],
      reply: (lang) => lang === 'pt'
        ? `Atendemos Danbury, CT 06810 e arredores com retirada agendada ou entrega local. O site calcula pelo ZIP antes do WhatsApp; pickup e gratuito.`
        : `We serve Danbury, CT 06810 and nearby areas with scheduled pickup or local delivery. The site checks the ZIP before WhatsApp; pickup is free.`,
      chips: (lang) => lang === 'pt'
        ? ['Quero entrega', 'Vou retirar', 'Qual o prazo?']
        : ['I want delivery', 'I will pick up', "What's the lead time?"],
    },
    {
      id: 'payment',
      kw: ['pagamento', 'pagar', 'pay', 'payment', 'zelle', 'venmo', 'cash app', 'pix', 'cartão', 'cartao', 'card', 'credit'],
      reply: (lang) => lang === 'pt'
        ? `Aceitamos Zelle, Venmo e Cash App. O depósito ou pagamento integral confirma a vaga e libera a produção. Cartão de crédito sob consulta — me chama no WhatsApp pra fechar.`
        : `We accept Zelle, Venmo and Cash App. Deposit or full payment locks your slot and starts production. Credit card on request — message us on WhatsApp to set it up.`,
      chips: (lang) => lang === 'pt'
        ? ['Falar no WhatsApp', 'Qual o valor?', 'Cancelo se mudar?']
        : ['Open WhatsApp', "What's the price?", 'Can I cancel?'],
    },
    {
      id: 'flavors',
      kw: ['sabor', 'sabores', 'flavor', 'flavors', 'gosto', 'tipo', 'tipos', 'kind', 'kinds', 'menu', 'cardápio', 'cardapio', 'opções', 'opcoes', 'options'],
      reply: (lang) => lang === 'pt'
        ? `O carro-chefe é o Pudim Clássico (caramelo cremoso). Tem também o Berry Pudim (frutas vermelhas), bolos de aniversário, bandejas de doces e gift boxes. Posso te mandar fotos e preços de algum específico?`
        : `Our hero is the Classic Pudim (silky caramel). We also do Berry Pudim, birthday cakes, sweet trays and gift boxes. Want photos and pricing on any specific one?`,
      chips: (lang) => lang === 'pt'
        ? ['Pudim Clássico', 'Bolo de aniversário', 'Doces de festa']
        : ['Classic Pudim', 'Birthday cake', 'Party sweets'],
    },
    {
      id: 'price',
      kw: ['preço', 'preco', 'valor', 'custa', 'price', 'cost', 'how much', 'quanto custa', 'cheapest', 'mais barato', 'mais caro'],
      reply: (lang) => lang === 'pt'
        ? `Pudim Clássico: a partir de $28. Berry Pudim: a partir de $34. Bandeja de doces: $48–$140 (depende da quantidade). Bolo personalizado: $68+. Eventos têm orçamento dedicado — me conta sua data e número de convidados que monto.`
        : `Classic Pudim: from $28. Berry Pudim: from $34. Sweet tray: $48–$140 (qty-based). Custom cake: $68+. Events have dedicated quotes — tell me your date and guest count and I'll send numbers.`,
      chips: (lang) => lang === 'pt'
        ? ['Reservar', 'Vagas pra festa?', 'Como pagar?']
        : ['Reserve', 'Event slots?', 'How to pay?'],
    },
    {
      id: 'events',
      kw: ['festa', 'aniversário', 'aniversario', 'casamento', 'evento', 'event', 'party', 'birthday', 'wedding', 'celebration', 'celebração', 'baby shower', 'corporate'],
      reply: (lang) => lang === 'pt'
        ? `Eventos são planejados com base na data, número de convidados e formato. Pedimos 3–5 dias de antecedência. Posso fechar um pacote (pudim + doces + bolo) ou só uma parte. Me conta a data e quantos vão estar?`
        : `Events are planned by date, guest count and format. We ask for 3–5 days lead time. We can build a package (pudim + sweets + cake) or just part of it. Tell me the date and headcount?`,
      chips: (lang) => lang === 'pt'
        ? ['Cotar evento', '20 pessoas', '50+ pessoas']
        : ['Get a quote', '20 people', '50+ people'],
    },
    {
      id: 'allergens',
      kw: ['alergia', 'alérgico', 'alergico', 'sem glúten', 'sem gluten', 'gluten free', 'lactose', 'vegano', 'vegan', 'allergy', 'allergic', 'kosher', 'halal', 'restrição', 'restricao'],
      reply: (lang) => lang === 'pt'
        ? `Trabalhamos com leite, ovos, glúten, açúcar e podemos ter traços de nuts. Versões sem lactose e sem glúten saem sob encomenda — sempre confirme alérgenos no pedido pra eu separar a produção.`
        : `Our base recipes use dairy, eggs, gluten, sugar and may contain nuts traces. Lactose-free and gluten-free are made on request — always flag allergens so we can isolate production.`,
      chips: (lang) => lang === 'pt'
        ? ['Sem lactose', 'Sem glúten', 'Falar pelo WhatsApp']
        : ['Lactose-free', 'Gluten-free', 'Talk on WhatsApp'],
    },
    {
      id: 'cancel',
      kw: ['cancelar', 'cancel', 'reembolso', 'refund', 'desistir', 'mudar data', 'reschedule', 'remarcar'],
      reply: (lang) => lang === 'pt'
        ? `Cancelamentos com 24h+ de antecedência têm reembolso integral. Dentro de 24h conseguimos remarcar pra outra data, sem custo extra. Eventos têm política específica — me chama no WhatsApp pra alinhar.`
        : `Cancellations with 24+ hours notice get a full refund. Within 24h we can reschedule to another date at no extra cost. Events have a separate policy — message us on WhatsApp.`,
      chips: (lang) => lang === 'pt' ? ['Falar com a dona', 'Remarcar pedido'] : ['Talk to the owner', 'Reschedule order'],
    },
    {
      id: 'hours',
      kw: ['horário', 'horario', 'hora', 'hours', 'open', 'aberto', 'fecha', 'close', 'expediente'],
      reply: (lang) => lang === 'pt'
        ? `A produção é por agenda — não temos horário de balcão. Mensagens no WhatsApp são respondidas das 9h às 21h (EST). Pickup costuma ser entre 17h e 19h30 nos dias de batch.`
        : `We work by schedule — there's no walk-in counter. WhatsApp messages are answered 9am–9pm EST. Pickup is usually between 5pm and 7:30pm on batch days.`,
      chips: (lang) => lang === 'pt' ? ['Reservar', 'Falar agora'] : ['Reserve', 'Message now'],
    },
    {
      id: 'human',
      kw: ['atendente', 'humano', 'pessoa', 'falar com', 'real person', 'human', 'someone', 'representante', 'owner', 'dona'],
      reply: (lang) => lang === 'pt'
        ? `Claro — a dona responde direto pelo WhatsApp. Toque "Abrir conversa" abaixo que eu te levo com uma mensagem inicial pronta.`
        : `Of course — the owner replies directly on WhatsApp. Tap "Open chat" below and I'll send you in with a starter message.`,
      chips: (lang) => lang === 'pt' ? ['Abrir conversa'] : ['Open chat'],
      action: { type: 'wa', text: { en: "Hi! I'd like to chat about an order.", pt: 'Oi! Queria conversar sobre um pedido.' } },
    },
    {
      id: 'thanks',
      kw: ['obrigado', 'obrigada', 'valeu', 'thanks', 'thank you', 'thx'],
      reply: (lang) => lang === 'pt'
        ? `Eu que agradeço! Quando precisar é só chamar. Se quiser, posso te mandar pro WhatsApp pra fechar?`
        : `Thank you! Anytime. Want me to send you to WhatsApp to wrap it up?`,
      chips: (lang) => lang === 'pt' ? ['Falar no WhatsApp', 'Continuar olhando'] : ['Open WhatsApp', 'Keep browsing'],
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
        else if (t.includes(' ' + n + ' ') || t.startsWith(n + ' ') || t.endsWith(' ' + n) || t === n) score += 3;
        else if (t.includes(n)) score += 2;
      }
      return { intent, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
    return scored;
  }

  /* ============================================================
     Render
     ============================================================ */
  function renderMessage(html, role, opts = {}) {
    const node = document.createElement('div');
    node.className = `chat-message ${role}`;
    node.innerHTML = html;
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
      link.textContent = lang === 'pt' ? 'Abrir conversa no WhatsApp →' : 'Open WhatsApp chat →';
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
    renderMessage(escapeHtml(text), 'user');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  /* ============================================================
     Núcleo: interpretar + responder
     ============================================================ */
  function handleInput(rawText) {
    const lang = getLang();
    const matches = classify(rawText);

    if (!matches.length) {
      // Fallback: nem uma keyword pegou — oferece WA
      renderMessage(
        lang === 'pt'
          ? 'Não tenho uma resposta pronta pra essa, mas posso te conectar direto com a dona pra resolver. Quer?'
          : "I don't have a ready answer for that, but I can connect you with the owner to sort it out. Want me to?",
        'assistant',
        {
          chips: lang === 'pt' ? ['Sim, falar agora', 'Ver cardápio', 'Prazo de entrega'] : ['Yes, message now', 'See menu', 'Lead time'],
          action: { type: 'wa', text: { en: `Hi! I asked: "${rawText}". Can you help?`, pt: `Oi! Perguntei: "${rawText}". Pode me ajudar?` } },
        },
      );
      return;
    }

    // Top intent
    const { intent } = matches[0];
    renderMessage(escapeHtml(intent.reply(lang)), 'assistant', {
      chips: intent.chips ? intent.chips(lang) : undefined,
      action: intent.action,
    });

    // Multi-intent: se o segundo match tem score >= 3, responde em sequência (resumido)
    if (matches[1] && matches[1].score >= 3 && matches[1].intent.id !== intent.id) {
      setTimeout(() => {
        const second = matches[1].intent;
        const prefix = lang === 'pt' ? 'E sobre ' : 'Also about ';
        renderMessage(prefix + '<em>' + escapeHtml(second.id.replace(/_/g, ' ')) + '</em>: ' + escapeHtml(second.reply(lang)), 'assistant', {
          chips: second.chips ? second.chips(lang) : undefined,
        });
      }, 600);
    }
  }

  /* ============================================================
     Substituir handlers do app.js legacy
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
        notice:   { en: 'How early do I need to order?', pt: 'Com quanta antecedência preciso pedir?' },
        delivery: { en: 'Do you deliver?', pt: 'Vocês fazem entrega?' },
        events:   { en: 'How do event orders work?', pt: 'Como funcionam pedidos pra evento?' },
      };
      const q = labels[fresh.dataset.question]?.[lang] || fresh.textContent;
      renderUser(q);
      setTimeout(() => handleInput(q), 250);
    });
  });

  /* ----- Substituir mensagem inicial ----- */
  // Trocar a `.chat-message.assistant` inicial por mensagem dinâmica baseada no idioma
  const initial = chatBody.querySelector('.chat-message.assistant');
  const lang = getLang();
  const introText = lang === 'pt'
    ? `Oi! Boa ${fmtHourPt()}. Posso ajudar com prazo, sabores, entrega, pagamento ou eventos. Pergunta o que quiser ou toque numa sugestão.`
    : `Hi! Good ${fmtHourEn()}. I can help with lead time, flavors, delivery, payment or events. Ask anything or tap a quick reply.`;
  if (initial) initial.textContent = introText;

  // Atualizar quando idioma mudar
  document.addEventListener('bp:lang-change', () => {
    const l = getLang();
    const txt = l === 'pt'
      ? `Idioma alterado pra português. Em que posso ajudar?`
      : `Language switched to English. How can I help?`;
    renderMessage(txt, 'assistant', {
      chips: l === 'pt' ? ['Prazo', 'Entrega', 'Sabores', 'Pagamento'] : ['Lead time', 'Delivery', 'Flavors', 'Payment'],
    });
  });

  /* expor pra debug ----- */
  window.bkConcierge = { handleInput, classify, INTENTS };
})();
