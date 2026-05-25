import * as THREE from "./assets/vendor/three.module.js";

const WA_PHONE = (window.BK_CONFIG && window.BK_CONFIG.waPhone) || "12034822797";

const products = [
  {
    id: "classic-pudim",
    category: "puddings",
    image: "assets/img/products/product-classic-pudim.png",
    price: "from $28",
    lead: "48h",
    tag: "Best seller",
    en: {
      name: "Classic Brazilian Pudim",
      description: "Glossy caramel, silky custard and elegant packaging for weekend pickup."
    },
    pt: {
      name: "Pudim Brasileiro Classico",
      description: "Calda brilhante, textura cremosa e embalagem caprichada para retirada no fim de semana."
    }
  },
  {
    id: "berry-pudim",
    category: "puddings",
    image: "assets/img/products/product-berry-pudim.png",
    price: "from $34",
    lead: "48h",
    tag: "Fruit topping",
    en: {
      name: "Berry Brazilian Pudim",
      description: "Creamy pudim finished with glossy berry topping for birthdays and gift moments."
    },
    pt: {
      name: "Pudim de Frutas Vermelhas",
      description: "Pudim cremoso com calda brilhante de frutas vermelhas para presente e aniversario."
    }
  },
  {
    id: "gift-pudim",
    category: "puddings",
    image: "assets/img/lifestyle/pudding-photo.png",
    price: "from $34",
    lead: "48h",
    tag: "Gift-ready",
    en: {
      name: "Gift-Ready Pudim",
      description: "A polished pudding presentation for birthdays, dinner invites and Brazilian homesick moments."
    },
    pt: {
      name: "Pudim para Presente",
      description: "Apresentacao elegante para aniversario, jantar especial e saudade do Brasil."
    }
  },
  {
    id: "brigadeiro-tray",
    category: "events",
    image: "assets/img/lifestyle/sweets-photo.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Parties",
    en: {
      name: "Party Sweets Tray",
      description: "Brigadeiro-style sweets and dessert bites planned around guest count and event timing."
    },
    pt: {
      name: "Bandeja de Docinhos",
      description: "Docinhos e sobremesas planejados por quantidade de pessoas e horario do evento."
    }
  },
  {
    id: "event-dessert-table",
    category: "events",
    image: "assets/img/lifestyle/table-photo.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Events",
    en: {
      name: "Event Dessert Table",
      description: "Pudim, sweets and dessert styling planned around the event date, guest count and pickup window."
    },
    pt: {
      name: "Mesa de Sobremesas para Evento",
      description: "Pudim, docinhos e montagem de sobremesas planejados por data, convidados e horario."
    }
  },
  {
    id: "berry-celebration-cake",
    category: "events",
    image: "assets/img/events/event-berry-cake.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Birthday",
    en: {
      name: "Berry Celebration Cake",
      description: "Layered celebration cake with cream, berries and premium birthday presentation."
    },
    pt: {
      name: "Bolo de Aniversario com Frutas",
      description: "Bolo em camadas com creme, frutas vermelhas e apresentacao premium para aniversario."
    }
  },
  {
    id: "cookie-gift-duo",
    category: "events",
    image: "assets/img/events/event-cookie-duo.png",
    price: "from $12",
    lead: "48h",
    tag: "Gift",
    en: {
      name: "Cookie Gift Duo",
      description: "Soft gourmet cookies packed for add-ons, gifts and small celebration boxes."
    },
    pt: {
      name: "Dupla de Cookies Gourmet",
      description: "Cookies macios para complemento de presente, lembranca e caixas de celebracao."
    }
  },
  {
    id: "premium-gift-hamper",
    category: "events",
    image: "assets/img/events/event-luxury-hamper.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Luxury",
    en: {
      name: "Premium Gift Hamper",
      description: "Custom gift hamper with sweets, drinks, flowers and polished celebration styling."
    },
    pt: {
      name: "Cesta Premium Personalizada",
      description: "Cesta sob medida com doces, bebidas, flores e montagem elegante para presente."
    }
  },
  {
    id: "love-gift-box",
    category: "events",
    image: "assets/img/events/event-love-gift-box.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Romantic",
    en: {
      name: "Love Gift Box",
      description: "Romantic custom box with sweets, treats and red balloon styling."
    },
    pt: {
      name: "Box Romantico",
      description: "Box romantico personalizado com doces, mimos e decoracao com balao vermelho."
    }
  },
  {
    id: "birthday-breakfast-tray",
    category: "events",
    image: "assets/img/events/event-birthday-pink-tray.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Birthday",
    en: {
      name: "Birthday Breakfast Tray",
      description: "Birthday tray with treats, drinks and personalized celebration details."
    },
    pt: {
      name: "Bandeja de Aniversario",
      description: "Bandeja de aniversario com doces, bebidas e detalhes personalizados."
    }
  },
  {
    id: "charcuterie-event-board",
    category: "events",
    image: "assets/img/events/event-charcuterie-board.png",
    price: "custom",
    lead: "3-5 days",
    tag: "Events",
    en: {
      name: "Charcuterie Event Board",
      description: "Premium cheese, fruit and charcuterie board for gatherings and event tables."
    },
    pt: {
      name: "Tabua Premium para Eventos",
      description: "Tabua premium de queijos, frutas e frios para encontros e mesas de evento."
    }
  }
];

const copy = {
  en: {
    navMenu: "Menu",
    navOrder: "Order",
    navHow: "How it works",
    ownerLogin: "Owner login",
    orderNow: "WhatsApp",
    heroEyebrow: "Brazilian pudding in small batches",
    heroTitle: "Classic Brazilian Pudim",
    heroLede:
      "Silky caramel pudding and Brazilian sweets made fresh by preorder for weekends, gifts and events.",
    startOrder: "Reserve yours",
    askConcierge: "Ask concierge",
    stackOne: "Choose flavor",
    stackTwo: "Pick a date",
    stackThree: "Confirm on WhatsApp",
    commandLabel: "This week's favorite",
    commandBadge: "Fresh",
    commandProductText: "Caramel, silky custard, pickup by appointment",
    commandActionOne: "48h preorder",
    commandActionTwo: "Pickup or delivery",
    heroControlLabel: "This week",
    heroControlTitle: "from $28",
    heroControlText: "48h minimum notice. Owner confirms every order before production.",
    heroBuyNow: "Reserve",
    orbitOneLabel: "Batch status",
    orbitOneTitle: "5 slots left",
    orbitOneText: "Saturday window",
    orbitTwoLabel: "Pickup",
    orbitTwoText: "By appointment",
    deckOneLabel: "Made for real moments",
    deckOneTitle: "A taste of Brazil for Sundays, gifts and parties.",
    deckOneText:
      "From family lunch to birthday tables, every order starts with the date, the occasion and the craving.",
    deckTwoTitle: "Classic pudim",
    deckTwoText: "Glossy caramel and soft custard for family tables and weekend cravings.",
    deckThreeTitle: "Gift-ready pudim",
    deckThreeText: "Polished presentation for birthdays, dinners and Brazilian homesick moments.",
    deckFourTitle: "Party sweets",
    deckFourText: "Trays and bites planned around guest count, date and occasion.",
    menuEyebrow: "Menu",
    menuTitle: "Choose what you want, then request the best date.",
    menuAside:
      "Everything is made in small batches, with lead time and availability confirmed before payment.",
    tabPuddings: "Puddings",
    tabEvents: "Events",
    chooseProduct: "Choose this",
    orderEyebrow: "Reserve your batch",
    orderTitle: "Tell us what you are craving and when you want it.",
    orderText:
      "Choose the product, date, quantity and pickup or delivery preference. WhatsApp opens with the details ready, so the order can be confirmed faster.",
    metricNotice: "minimum notice",
    metricWhatsapp: "to WhatsApp",
    openCart: "Open preorder cart",
    fieldProduct: "Add product",
    fieldName: "Name",
    namePlaceholder: "Your name",
    fieldPhone: "WhatsApp",
    phonePlaceholder: "+1 (203) 000-0000",
    fieldEmail: "Email",
    emailPlaceholder: "you@email.com",
    fieldDate: "Preferred date",
    fieldTime: "Preferred time",
    timePlaceholder: "Saturday, 5-7 PM",
    fieldQuantity: "Quantity",
    fieldFulfillment: "Fulfillment",
    pickup: "Pickup",
    delivery: "Delivery request",
    deliveryTitle: "Delivery from Danbury",
    deliveryText: "Enter a ZIP to check the automatic radius and delivery fee.",
    fieldZip: "Delivery ZIP",
    zipPlaceholder: "06810",
    fieldAddress: "Delivery address",
    addressPlaceholder: "Street, city, CT",
    checkDelivery: "Check",
    deliveryWaiting: "Pickup is free.",
    deliveryWaitingSub: "For delivery, enter the ZIP before sending.",
    deliveryUnavailable: "Delivery needs confirmation.",
    fieldNotes: "Notes",
    notesPlaceholder: "Birthday, allergies, delivery ZIP, preferred time...",
    cartLabel: "Preorder cart",
    cartTitle: "Your batch request",
    cartAdd: "Add to cart",
    cartTotalLabel: "Estimated total",
    cartTeaserLabel: "Live order",
    cartTeaserTitle: "Review everything before WhatsApp.",
    cartTeaserText:
      "Your selected products, quantity, date, pickup or delivery and notes stay together in one cart.",
    cartFloatingLabel: "Preorder cart",
    previewLabel: "WhatsApp message preview",
    sendToWhatsapp: "Send to WhatsApp",
    howEyebrow: "Fresh batch rhythm",
    howTitle: "Choose, reserve and enjoy Brazilian sweets made fresh.",
    stepOneTitle: "Pick your favorite",
    stepOneText: "Choose pudim flavors or event sweets planned for your date.",
    stepTwoTitle: "Share the date",
    stepTwoText: "Send the ideal day, quantity, pickup time or delivery ZIP code.",
    stepThreeTitle: "Confirm on WhatsApp",
    stepThreeText: "The owner confirms availability, payment, pickup and final details.",
    adminSectionEyebrow: "Private owner area",
    adminSectionTitle: "A simple back office for orders, sales and schedule.",
    loginPanelLabel: "Private access",
    loginTitle: "Owner login",
    loginEmail: "Email or phone",
    loginPassword: "Password",
    loginButton: "Open dashboard",
    loginNote: "Prototype only. In production this connects to secure auth and SQL.",
    dashboardLabel: "Sales control",
    dashboardTitle: "Saturday preorder board",
    lockDashboard: "Lock",
    kpiRevenue: "Today revenue",
    kpiOrders: "Open orders",
    kpiCapacity: "Capacity left",
    statusRequested: "Requested",
    statusPaid: "Paid",
    statusProduction: "In production",
    adminAccepting: "Accepting orders",
    adminPuddings: "Pudding capacity",
    adminEvents: "Event slots",
    footerText: "Puddings and Brazilian sweets by preorder in the USA.",
    footerTitle: "Ready for the next batch?",
    footerWhatsapp: "Order on WhatsApp",
    footerHowTitle: "How it works",
    footerOwnerTitle: "Owner",
    chatStatus: "Guided preorder",
    chatIntro: "Hi, I can help you choose a dessert, check ordering rules and prepare your WhatsApp request.",
    quickNotice: "How early?",
    quickDelivery: "Delivery?",
    quickEvents: "Party order?",
    chatPlaceholder: "Ask about preorder, pickup or delivery",
    messageIntro: "Hi! I would like to request a preorder.",
    messageProduct: "Product",
    messageItems: "Items",
    messageDate: "Preferred date",
    messageTime: "Preferred time",
    messageQuantity: "Quantity",
    messageFulfillment: "Fulfillment",
    messageCustomer: "Customer",
    messagePhone: "WhatsApp",
    messageDelivery: "Delivery",
    messageDeliveryZip: "ZIP",
    messageDeliveryFee: "Delivery fee",
    messageTotal: "Estimated total",
    messageNotes: "Notes",
    fallbackTime: "Owner can suggest the best window",
    fallbackNotes: "No notes yet",
    assistantNotice: "Please order at least 48 hours ahead. Event trays may need 3 to 5 days.",
    assistantDelivery:
      "Delivery depends on ZIP code, route and order size. Share the ZIP and the owner confirms the fee on WhatsApp.",
    assistantEvents:
      "For parties, send date, guest count, product type and budget. I can prepare that request for WhatsApp.",
    assistantDefault:
      "I can help with menu, lead time, pickup, delivery and party orders. To finish, I prepare a WhatsApp request."
  },
  pt: {
    navMenu: "Cardapio",
    navOrder: "Pedir",
    navHow: "Como funciona",
    ownerLogin: "Login dona",
    orderNow: "WhatsApp",
    heroEyebrow: "Pudim brasileiro em pequenos lotes",
    heroTitle: "Pudim Brasileiro Classico",
    heroLede:
      "Pudim de caramelo cremoso e doces brasileiros feitos sob encomenda para fins de semana, presentes e eventos.",
    startOrder: "Reservar o meu",
    askConcierge: "Falar com concierge",
    stackOne: "Escolher sabor",
    stackTwo: "Escolher data",
    stackThree: "Confirmar no WhatsApp",
    commandLabel: "Favorito da semana",
    commandBadge: "Fresco",
    commandProductText: "Caramelo, textura cremosa, retirada combinada",
    commandActionOne: "48h antes",
    commandActionTwo: "Retirada ou entrega",
    heroControlLabel: "Esta semana",
    heroControlTitle: "a partir de $28",
    heroControlText: "Antecedencia minima de 48h. A dona confirma cada pedido antes da producao.",
    heroBuyNow: "Reservar",
    orbitOneLabel: "Status do lote",
    orbitOneTitle: "5 vagas livres",
    orbitOneText: "Janela de sabado",
    orbitTwoLabel: "Retirada",
    orbitTwoText: "Com hora marcada",
    deckOneLabel: "Feito para momentos reais",
    deckOneTitle: "Sabor do Brasil para domingo, presente e festa.",
    deckOneText:
      "Do almoco em familia a mesa de aniversario, cada pedido comeca pela data, ocasiao e vontade.",
    deckTwoTitle: "Pudim classico",
    deckTwoText: "Caramelo brilhante e textura cremosa para mesa de familia e vontade de fim de semana.",
    deckThreeTitle: "Pudim para presente",
    deckThreeText: "Apresentacao bonita para aniversario, jantar especial e saudade do Brasil.",
    deckFourTitle: "Docinhos para festa",
    deckFourText: "Bandejas planejadas por quantidade de pessoas, data e ocasiao.",
    menuEyebrow: "Cardapio",
    menuTitle: "Escolha o que deseja e solicite a melhor data.",
    menuAside:
      "Tudo e feito em pequenos lotes, com prazo e disponibilidade confirmados antes do pagamento.",
    tabPuddings: "Pudins",
    tabEvents: "Eventos",
    chooseProduct: "Escolher",
    orderEyebrow: "Reserve sua fornada",
    orderTitle: "Conte o que voce quer e para quando precisa.",
    orderText:
      "Escolha produto, data, quantidade e retirada ou entrega. O WhatsApp abre com os detalhes prontos para confirmar mais rapido.",
    metricNotice: "antecedencia",
    metricWhatsapp: "para WhatsApp",
    openCart: "Abrir carrinho",
    fieldProduct: "Adicionar produto",
    fieldName: "Nome",
    namePlaceholder: "Seu nome",
    fieldPhone: "WhatsApp",
    phonePlaceholder: "+1 (203) 000-0000",
    fieldEmail: "Email",
    emailPlaceholder: "voce@email.com",
    fieldDate: "Data desejada",
    fieldTime: "Horario desejado",
    timePlaceholder: "Sabado, 5-7 PM",
    fieldQuantity: "Quantidade",
    fieldFulfillment: "Forma",
    pickup: "Retirada",
    delivery: "Solicitar entrega",
    deliveryTitle: "Entrega saindo de Danbury",
    deliveryText: "Digite o ZIP para conferir o raio automatico e a taxa.",
    fieldZip: "ZIP da entrega",
    zipPlaceholder: "06810",
    fieldAddress: "Endereco da entrega",
    addressPlaceholder: "Rua, cidade, CT",
    checkDelivery: "Conferir",
    deliveryWaiting: "Retirada e gratis.",
    deliveryWaitingSub: "Para entrega, digite o ZIP antes de enviar.",
    deliveryUnavailable: "Entrega precisa de confirmacao.",
    fieldNotes: "Observacoes",
    notesPlaceholder: "Aniversario, alergias, ZIP da entrega, horario preferido...",
    cartLabel: "Carrinho de encomenda",
    cartTitle: "Seu pedido planejado",
    cartAdd: "Adicionar",
    cartTotalLabel: "Total estimado",
    cartTeaserLabel: "Pedido vivo",
    cartTeaserTitle: "Revise tudo antes do WhatsApp.",
    cartTeaserText:
      "Produtos, quantidade, data, retirada ou entrega e observacoes ficam juntos em um carrinho.",
    cartFloatingLabel: "Carrinho",
    previewLabel: "Previa da mensagem no WhatsApp",
    sendToWhatsapp: "Enviar para WhatsApp",
    howEyebrow: "Ritmo de fornada fresca",
    howTitle: "Escolha, reserve e aproveite doces brasileiros feitos na hora certa.",
    stepOneTitle: "Escolha seu favorito",
    stepOneText: "Selecione sabores de pudim ou doces de evento planejados para a sua data.",
    stepTwoTitle: "Envie a data",
    stepTwoText: "Informe o dia ideal, quantidade, horario de retirada ou ZIP da entrega.",
    stepThreeTitle: "Confirme no WhatsApp",
    stepThreeText: "A dona confirma disponibilidade, pagamento, retirada e detalhes finais.",
    adminSectionEyebrow: "Area privada da dona",
    adminSectionTitle: "Um painel simples para pedidos, vendas e agenda.",
    loginPanelLabel: "Acesso privado",
    loginTitle: "Login da dona",
    loginEmail: "Email ou telefone",
    loginPassword: "Senha",
    loginButton: "Abrir dashboard",
    loginNote: "Apenas prototipo. Em producao isso conecta auth seguro e SQL.",
    dashboardLabel: "Controle de vendas",
    dashboardTitle: "Quadro de encomendas de sabado",
    lockDashboard: "Bloquear",
    kpiRevenue: "Venda do dia",
    kpiOrders: "Pedidos abertos",
    kpiCapacity: "Vagas restantes",
    statusRequested: "Solicitado",
    statusPaid: "Pago",
    statusProduction: "Em producao",
    adminAccepting: "Aceitando pedidos",
    adminPuddings: "Capacidade de pudins",
    adminEvents: "Vagas para eventos",
    footerText: "Pudins e doces brasileiros sob encomenda nos EUA.",
    footerTitle: "Pronto para a proxima fornada?",
    footerWhatsapp: "Pedir no WhatsApp",
    footerHowTitle: "Como pedir",
    footerOwnerTitle: "Dona",
    chatStatus: "Pre-pedido guiado",
    chatIntro: "Oi, posso ajudar a escolher, explicar regras e preparar sua solicitacao para o WhatsApp.",
    quickNotice: "Com quanto tempo?",
    quickDelivery: "Entrega?",
    quickEvents: "Festa?",
    chatPlaceholder: "Pergunte sobre encomenda, retirada ou entrega",
    messageIntro: "Oi! Gostaria de solicitar uma encomenda.",
    messageProduct: "Produto",
    messageItems: "Itens",
    messageDate: "Data desejada",
    messageTime: "Horario desejado",
    messageQuantity: "Quantidade",
    messageFulfillment: "Forma",
    messageCustomer: "Cliente",
    messagePhone: "WhatsApp",
    messageDelivery: "Entrega",
    messageDeliveryZip: "ZIP",
    messageDeliveryFee: "Taxa de entrega",
    messageTotal: "Total estimado",
    messageNotes: "Observacoes",
    fallbackTime: "A dona pode sugerir a melhor janela",
    fallbackNotes: "Sem observacoes ainda",
    assistantNotice: "O ideal e pedir com pelo menos 48h de antecedencia. Bandejas podem precisar de 3 a 5 dias.",
    assistantDelivery:
      "A entrega depende do ZIP code, rota e tamanho do pedido. Envie o ZIP e a dona confirma a taxa no WhatsApp.",
    assistantEvents:
      "Para festas, envie data, numero de pessoas, produto e orcamento. Eu preparo isso para o WhatsApp.",
    assistantDefault:
      "Posso ajudar com cardapio, prazo, retirada, entrega e eventos. Para finalizar, preparo o pedido no WhatsApp."
  }
};

const heroFeatures = {
  classic: {
    id: "classic-pudim",
    price: "from $28",
    en: {
      shortName: "Classic Pudim",
      label: "Classic Pudim",
      lede: "Silky caramel pudding and Brazilian sweets made fresh by preorder in the USA.",
      description: "Caramel, silky custard, pickup by appointment"
    },
    pt: {
      shortName: "Pudim Classico",
      label: "Pudim Classico",
      lede: "Pudim de caramelo cremoso e doces brasileiros feitos sob encomenda nos EUA.",
      description: "Caramelo, textura cremosa, retirada combinada"
    }
  },
  berry: {
    id: "berry-pudim",
    price: "from $34",
    en: {
      shortName: "Berry Pudim",
      label: "Berry Pudim",
      lede: "Creamy Brazilian pudim with glossy berry topping for gifts, birthdays and weekend tables.",
      description: "Berry topping, silky custard, pickup by appointment"
    },
    pt: {
      shortName: "Frutas Vermelhas",
      label: "Frutas Vermelhas",
      lede: "Pudim brasileiro cremoso com calda intensa de frutas vermelhas para presente e aniversario.",
      description: "Frutas vermelhas, textura cremosa, retirada combinada"
    }
  }
};

const heroFeatureOrder = Object.keys(heroFeatures);

// Idioma persistente: lê do localStorage; default EN (site é US-based, vendido por BR)
let language = (() => {
  try {
    const saved = window.localStorage.getItem("bp-lang");
    return saved === "pt" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
})();
document.documentElement.setAttribute("lang", language);
let activeCategory = "puddings";
let ticking = false;
let preorderCart = [];
let lastCartTrigger = null;
let activeDeliveryQuote = null;

const grid = document.querySelector("[data-product-grid]");
const productSelect = document.querySelector("[data-product-select]");
const orderForm = document.querySelector("[data-order-form]");
const preview = document.querySelector("[data-message-preview]");
const orderLink = document.querySelector("[data-whatsapp-order]");
const cartModal = document.querySelector("[data-cart-modal]");
const cartBackdrop = document.querySelector("[data-cart-backdrop]");
const cartFloatingCount = document.querySelector("[data-cart-floating-count]");
const cartFloatingTotal = document.querySelector("[data-cart-floating-total]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const chatBody = document.querySelector("[data-chat-body]");
const chatForm = document.querySelector("[data-chat-form]");
const dateInput = document.querySelector("[data-date-input]");
const deliveryZipInput = document.querySelector("[data-delivery-zip]");
const deliveryCheckButton = document.querySelector("[data-delivery-check]");
const deliveryQuoteBox = document.querySelector("[data-delivery-quote]");
const serviceMap = document.querySelector("[data-service-map]");
const concierge = document.querySelector("[data-concierge]");
// Aponta tanto pro header legacy quanto pro novo bk-header (qualquer um que existir)
const header = document.querySelector("[data-site-header]") || document.querySelector("[data-bk-header]") || document.createElement("div");
const progress = document.querySelector("[data-scroll-progress]");
const adminShell = document.querySelector("[data-admin-shell]");
const adminLogin = document.querySelector("[data-admin-login]");
const dessertCanvas = document.querySelector("[data-dessert-canvas]");
const heroQuantityValue = document.querySelector("[data-hero-quantity-value]");
const heroProductStage = document.querySelector("[data-hero-product-stage]");
const heroProductTitle = document.querySelector("[data-hero-product-title]");
const heroProductName = document.querySelector("[data-hero-product-name]");
const heroProductDescription = document.querySelector("[data-hero-product-description]");
const heroProductLabel = document.querySelector("[data-hero-product-label]");
const heroProductPrice = document.querySelector("[data-hero-product-price]");
const heroProductLede = document.querySelector("[data-hero-product-lede]");
const heroProductIndex = document.querySelector("[data-hero-product-index]");

function t(key) {
  return copy[language][key] || copy.en[key] || key;
}

function setMinimumDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  const value = date.toISOString().slice(0, 10);
  dateInput.min = value;
  dateInput.value = value;
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelector("[data-language-toggle]").textContent = language === "en" ? "PT" : "EN";
  renderProducts();
  updateProductSelect();
  renderCart();
  updateMessage();
  setHeroFlavor(heroProductStage?.dataset.activeFlavor || "classic");
}

function visibleProducts() {
  return products.filter((product) => product.category === activeCategory);
}

function renderProducts() {
  grid.innerHTML = visibleProducts()
    .map((product, index) => {
      const content = product[language];
      const imageClass = product.image.includes("product-") ? "product-cutout" : "";
      const pictureMarkup = window.bkPicture
        ? window.bkPicture.html(product.image, `class="${imageClass}" alt="${content.name}"`)
        : `<img class="${imageClass}" src="${product.image}" alt="${content.name}" />`;
      return `
        <article class="product-card reveal" style="transition-delay:${index * 70}ms">
          ${pictureMarkup}
          <div class="product-card-content">
            <span class="price">${product.price}</span>
            <div class="product-meta">
              <h3>${content.name}</h3>
              <div class="product-tags">
                <span>${product.lead}</span>
                <span>${product.tag}</span>
              </div>
            </div>
            <p>${content.description}</p>
            <button class="button select-product" type="button" data-select-product="${product.id}">
              ${t("chooseProduct")}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
  observeReveals();
  wireCardLight();
}

function updateProductSelect(selectedId = productSelect.value || products[0].id) {
  if (!productSelect) return;
  productSelect.innerHTML = products
    .map((product) => `<option value="${product.id}">${product[language].name} - ${product.price}</option>`)
    .join("");
  productSelect.value = products.some((product) => product.id === selectedId) ? selectedId : products[0].id;
}

function selectedProduct() {
  return products.find((product) => product.id === productSelect.value) || products[0];
}

function productById(id) {
  return products.find((product) => product.id === id) || products[0];
}

function priceNumber(price) {
  const match = String(price || "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function money(value) {
  return value > 0 ? `$${value.toFixed(2).replace(/\.00$/, "")}` : "custom";
}

function openCartModal(trigger) {
  if (!cartModal) return;
  lastCartTrigger = trigger || document.activeElement;
  document.body.classList.add("cart-modal-open");
  cartModal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    const focusTarget = cartModal.querySelector("[data-date-input]") || cartModal.querySelector("button, input, select, textarea, a");
    focusTarget?.focus({ preventScroll: true });
  }, 120);
}

function closeCartModal() {
  if (!cartModal) return;
  document.body.classList.remove("cart-modal-open");
  cartModal.setAttribute("aria-hidden", "true");
  if (lastCartTrigger && document.contains(lastCartTrigger)) {
    lastCartTrigger.focus?.({ preventScroll: true });
  }
}

function cartItems() {
  return preorderCart
    .map((item) => ({ ...item, product: productById(item.productId) }))
    .filter((item) => item.product);
}

function cartQuantity() {
  return preorderCart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + priceNumber(item.product.price) * item.quantity, 0);
}

function fulfillmentValue() {
  return new FormData(orderForm).get("fulfillment") || "Pickup";
}

function isDeliverySelected() {
  return /delivery|entrega/i.test(String(fulfillmentValue()));
}

function deliveryFee() {
  return isDeliverySelected() && activeDeliveryQuote?.served ? (activeDeliveryQuote.feeCents || 0) / 100 : 0;
}

function orderTotal() {
  return cartTotal() + deliveryFee();
}

function renderDeliveryQuote(quote = activeDeliveryQuote) {
  if (!deliveryQuoteBox) return;
  const deliverySelected = isDeliverySelected();
  deliveryQuoteBox.classList.toggle("is-outside", !!quote && !quote.served);
  if (!deliverySelected) {
    deliveryQuoteBox.innerHTML = `<strong>${t("deliveryWaiting")}</strong><span>${t("deliveryWaitingSub")}</span>`;
    return;
  }
  if (!quote) {
    deliveryQuoteBox.innerHTML = `<strong>${t("deliveryWaiting")}</strong><span>${t("deliveryWaitingSub")}</span>`;
    return;
  }
  if (quote.served) {
    deliveryQuoteBox.innerHTML = `<strong>${quote.feeLabel} delivery</strong><span>${quote.zip} - ${quote.distanceMiles} mi from Danbury - ${quote.tier.label}</span>`;
    return;
  }
  deliveryQuoteBox.innerHTML = `<strong>${t("deliveryUnavailable")}</strong><span>${quote.zip || ""} ${quote.distanceMiles ? `- ${quote.distanceMiles} mi` : ""} - ${quote.message}</span>`;
}

async function checkDeliveryZip() {
  if (!deliveryZipInput || !window.bkDelivery) return null;
  const zip = window.bkDelivery.sanitizeZip(deliveryZipInput.value);
  deliveryZipInput.value = zip;
  activeDeliveryQuote = window.bkDelivery.quoteByZip(zip);
  renderDeliveryQuote(activeDeliveryQuote);
  renderCart();
  updateMessage();
  return activeDeliveryQuote;
}

function addToCart(productId, quantity = 1, openCart = true) {
  const product = productById(productId);
  if (!product) return;
  const amount = Math.max(1, Number(quantity) || 1);
  const existing = preorderCart.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += amount;
  } else {
    preorderCart.push({ productId: product.id, quantity: amount });
  }
  renderCart();
  updateMessage();
  if (openCart) openCartModal();
}

function setCartQuantity(productId, quantity) {
  const amount = Math.max(0, Number(quantity) || 0);
  preorderCart = preorderCart
    .map((item) => (item.productId === productId ? { ...item, quantity: amount } : item))
    .filter((item) => item.quantity > 0);
  renderCart();
  updateMessage();
}

function renderCart() {
  const cartLines = document.querySelector("[data-cart-lines]");
  const cartCount = document.querySelector("[data-cart-count]");
  const cartTotalNode = document.querySelector("[data-cart-total]");
  if (!cartLines) return;

  const items = cartItems();
  cartLines.innerHTML = items
    .map((item) => {
      const content = item.product[language];
      const linePrice = priceNumber(item.product.price) * item.quantity;
      const removeLabel = language === "pt" ? "Remover" : "Remove";
      const cartImg = window.bkPicture
        ? window.bkPicture.html(item.product.image, `alt="${content.name}"`)
        : `<img src="${item.product.image}" alt="${content.name}" />`;
      return `
        <article class="cart-line" data-cart-product="${item.product.id}">
          ${cartImg}
          <div>
            <strong>${content.name}</strong>
            <small>${item.product.price} - ${item.product.lead} - ${item.product.tag}</small>
          </div>
          <div class="cart-line-actions">
            <div class="quantity-stepper">
              <button type="button" data-cart-quantity="minus" aria-label="Decrease ${content.name}">-</button>
              <b>${item.quantity}</b>
              <button type="button" data-cart-quantity="plus" aria-label="Increase ${content.name}">+</button>
            </div>
            <span>${linePrice > 0 ? money(linePrice) : "custom"}</span>
            <button class="cart-remove" type="button" data-cart-remove aria-label="${removeLabel} ${content.name}">${removeLabel}</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (!items.length) {
    cartLines.innerHTML = `<div class="cart-empty">${language === "pt" ? "Adicione produtos do cardapio para montar sua encomenda." : "Add menu items to build your preorder."}</div>`;
  }

  const count = cartQuantity();
  if (cartCount) cartCount.textContent = language === "pt" ? `${count} itens` : `${count} items`;
  if (cartTotalNode) cartTotalNode.textContent = money(orderTotal());
  if (cartFloatingCount) {
    cartFloatingCount.textContent =
      language === "pt"
        ? `${count} ${count === 1 ? "item" : "itens"}`
        : `${count} ${count === 1 ? "item" : "items"}`;
  }
  if (cartFloatingTotal) cartFloatingTotal.textContent = money(orderTotal());
}

function buildMessage() {
  const data = new FormData(orderForm);
  const notes = data.get("notes")?.trim() || t("fallbackNotes");
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const zip = String(data.get("deliveryZip") || "").trim();
  const address = String(data.get("deliveryAddress") || "").trim();
  const deliveryLine = isDeliverySelected()
    ? `${address || "Address pending"}${zip ? ` - ZIP ${zip}` : ""}`
    : "Pickup in Danbury, CT";
  const feeLine = isDeliverySelected()
    ? activeDeliveryQuote?.served
      ? activeDeliveryQuote.feeLabel
      : "Confirm on WhatsApp"
    : "$0";
  const items = cartItems();
  const itemLines = items.length
    ? items
        .map((item) => {
          const product = item.product;
          const linePrice = priceNumber(product.price) * item.quantity;
          return `- ${item.quantity}x ${product[language].name} (${linePrice > 0 ? money(linePrice) : product.price})`;
        })
        .join("\n")
    : language === "pt" ? "- Nenhum item selecionado" : "- No items selected";
  return `${t("messageIntro")}

${t("messageCustomer")}: ${name || "Not filled yet"}
${t("messagePhone")}: ${phone || "Not filled yet"}
${t("messageItems")}:
${itemLines}
${t("messageDate")}: ${data.get("date")}
${t("messageTime")}: ${data.get("time") || t("fallbackTime")}
${t("messageFulfillment")}: ${data.get("fulfillment")}
${t("messageDelivery")}: ${deliveryLine}
${t("messageDeliveryFee")}: ${feeLine}
${t("messageTotal")}: ${money(orderTotal())}
${t("messageNotes")}: ${notes}`;
}

function updateMessage() {
  const message = buildMessage();
  preview.textContent = message;
  const href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  orderLink.href = href;
  whatsappLinks.forEach((link) => {
    link.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(t("messageIntro"))}`;
  });
}

function saveLeadSnapshot() {
  // Sempre grava localStorage (fallback offline + admin demo).
  try {
    const data = new FormData(orderForm);
    const items = cartItems();
    const leads = JSON.parse(window.localStorage.getItem("bp-leads") || "[]");
    const lead = {
      id: `lead-${Date.now()}`,
      source: "Brazilian Pudding",
      status: "Novo lead",
      createdAt: new Date().toISOString(),
      date: data.get("date"),
      time: data.get("time") || t("fallbackTime"),
      fulfillment: data.get("fulfillment"),
      total: money(cartTotal()),
      items: items.map((item) => `${item.quantity}x ${item.product[language].name}`),
      message: buildMessage(),
      note: "Sem API: lead salvo antes de abrir o WhatsApp."
    };
    window.localStorage.setItem("bp-leads", JSON.stringify([lead, ...leads].slice(0, 80)));
  } catch {
    /* O clique no WhatsApp nunca falha por causa de localStorage. */
  }

  // Persiste também na API (fire-and-forget com keepalive — não bloqueia o redirect).
  // Falha silenciosa: o lead local já foi salvo, e o WA continua abrindo.
  if (window.bkApi) {
    try {
      const data = new FormData(orderForm);
      const items = cartItems();
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      if (name && phone) {
        window.bkApi.createLead({
          name,
          phone,
          email: String(data.get("email") || "").trim() || undefined,
          productSlug: items[0]?.product?.id, // primeiro item como interesse principal
          message: buildMessage(),
          preferredLang: language,
          consent: true, // CTDPA: cliente confirmou ao clicar
        }).catch(() => { /* silencioso — keepalive segue */ });
      }
    } catch { /* não bloqueia WA */ }
  }
}

function saveLocalLeadSnapshot(status = "Novo lead") {
  try {
    const data = new FormData(orderForm);
    const items = cartItems();
    const leads = JSON.parse(window.localStorage.getItem("bp-leads") || "[]");
    const lead = {
      id: `lead-${Date.now()}`,
      source: "Brazilian Pudding",
      status,
      createdAt: new Date().toISOString(),
      date: data.get("date"),
      time: data.get("time") || t("fallbackTime"),
      fulfillment: data.get("fulfillment"),
      total: money(orderTotal()),
      items: items.map((item) => `${item.quantity}x ${item.product[language].name}`),
      message: buildMessage(),
      note: "Fallback local: confira a API para confirmar se o pedido entrou.",
    };
    window.localStorage.setItem("bp-leads", JSON.stringify([lead, ...leads].slice(0, 80)));
    return lead;
  } catch {
    return null;
  }
}

function requestedForIso(dateValue) {
  return `${dateValue}T17:00:00-04:00`;
}

function buildLeadPayload() {
  const data = new FormData(orderForm);
  const items = cartItems();
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim() || undefined,
    productSlug: items[0]?.product?.id,
    message: buildMessage(),
    preferredLang: language,
    consent: true,
  };
}

function buildOrderPayload() {
  const data = new FormData(orderForm);
  const delivery = isDeliverySelected();
  return {
    customer: {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim() || undefined,
      preferredLang: language,
    },
    fulfillment: delivery ? "delivery" : "pickup",
    requestedFor: requestedForIso(String(data.get("date") || "").trim()),
    requestedTz: "America/New_York",
    deliveryAddress: delivery ? String(data.get("deliveryAddress") || "").trim() : undefined,
    deliveryZip: delivery ? String(data.get("deliveryZip") || "").trim() : undefined,
    notes: String(data.get("notes") || "").trim() || undefined,
    items: cartItems().map((item) => ({
      productSlug: item.product.id,
      qty: item.quantity,
    })),
    consent: true,
  };
}

function validateCheckout() {
  const data = new FormData(orderForm);
  if (!cartItems().length) return language === "pt" ? "Adicione pelo menos 1 item." : "Add at least 1 item.";
  if (!String(data.get("name") || "").trim()) return language === "pt" ? "Informe seu nome." : "Enter your name.";
  if (!String(data.get("phone") || "").trim()) return language === "pt" ? "Informe seu WhatsApp." : "Enter your WhatsApp.";
  if (!String(data.get("date") || "").trim()) return language === "pt" ? "Escolha a data." : "Choose a date.";
  if (!window.bkIsValidPreorderDate(String(data.get("date") || ""))) {
    const lead = window.BK_CONFIG?.leadTimeHours || 48;
    return language === "pt" ? `A data precisa respeitar ${lead}h de antecedencia.` : `Date must be at least ${lead}h ahead.`;
  }
  if (isDeliverySelected()) {
    const zip = String(data.get("deliveryZip") || "").trim();
    const address = String(data.get("deliveryAddress") || "").trim();
    if (!zip) return language === "pt" ? "Informe o ZIP da entrega." : "Enter the delivery ZIP.";
    if (!address) return language === "pt" ? "Informe o endereco da entrega." : "Enter the delivery address.";
    const quote = activeDeliveryQuote?.zip === zip ? activeDeliveryQuote : window.bkDelivery?.quoteByZip(zip);
    activeDeliveryQuote = quote;
    renderDeliveryQuote(quote);
    if (!quote?.served) return language === "pt" ? "Esse ZIP precisa ser confirmado no WhatsApp." : "This ZIP needs WhatsApp confirmation.";
  }
  return "";
}

async function submitCheckout(event) {
  event.preventDefault();
  const error = validateCheckout();
  if (error) {
    alert(error);
    return;
  }

  const originalText = orderLink.textContent;
  orderLink.setAttribute("aria-busy", "true");
  orderLink.textContent = language === "pt" ? "Enviando..." : "Sending...";
  let message = buildMessage();

  try {
    if (window.bkApi) {
      const order = await window.bkApi.createOrder(buildOrderPayload());
      message = `${message}\n\nOrder: #${order.number}`;
    } else {
      saveLocalLeadSnapshot("API offline");
    }
  } catch {
    try {
      if (window.bkApi) await window.bkApi.createLead(buildLeadPayload());
    } catch {
      saveLocalLeadSnapshot("API fallback");
    }
  } finally {
    orderLink.removeAttribute("aria-busy");
    orderLink.textContent = originalText;
  }

  window.location.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

function addChatMessage(text, role) {
  const node = document.createElement("div");
  node.className = `chat-message ${role}`;
  node.textContent = text;
  chatBody.appendChild(node);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function answerQuestion(type) {
  const key =
    type === "notice"
      ? "assistantNotice"
      : type === "delivery"
        ? "assistantDelivery"
        : type === "events"
          ? "assistantEvents"
          : "assistantDefault";
  addChatMessage(t(key), "assistant");
}

function toggleConcierge(force) {
  const open = force ?? !concierge.classList.contains("is-open");
  concierge.classList.toggle("is-open", open);
  document.querySelectorAll("[data-chat-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", String(open));
  });
}

let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => revealObserver.observe(node));
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.setProperty("--progress", `${max > 0 ? (scrollTop / max) * 100 : 0}%`);
  if (header && header.classList) header.classList.toggle("is-scrolled", scrollTop > 24);

  document.querySelectorAll("[data-parallax]").forEach((node) => {
    const speed = Number(node.dataset.parallax || 0);
    const rect = node.getBoundingClientRect();
    const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    node.style.setProperty("--parallax-y", `${distance.toFixed(1)}px`);
  });
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

function wireCardLight() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}

function setHeroFlavor(flavor) {
  if (!heroProductStage) return;
  const normalized = heroFeatures[flavor] ? flavor : "classic";
  const feature = heroFeatures[normalized];
  const product = products.find((item) => item.id === feature.id);
  const content = product?.[language];
  heroProductStage.dataset.activeFlavor = normalized;
  heroProductStage.querySelectorAll("[data-hero-product-image]").forEach((image) => {
    image.classList.toggle("is-active", image.dataset.heroProductImage === normalized);
  });
  document.querySelectorAll("[data-hero-flavor]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.heroFlavor === normalized);
  });
  if (product && content) {
    heroProductTitle.textContent = content.name;
    heroProductName.textContent = feature[language].shortName;
    heroProductDescription.textContent = feature[language].description;
    heroProductLabel.textContent = feature[language].label;
    heroProductPrice.textContent = feature.price;
    heroProductLede.textContent = feature[language].lede;
    heroProductIndex.textContent = `${String(heroFeatureOrder.indexOf(normalized) + 1).padStart(2, "0")} / ${String(heroFeatureOrder.length).padStart(2, "0")}`;
  }
}

function cycleHeroFlavor(direction) {
  const active = heroProductStage?.dataset.activeFlavor || "classic";
  const currentIndex = heroFeatureOrder.indexOf(active);
  const offset = direction === "prev" ? -1 : 1;
  const nextIndex = (currentIndex + offset + heroFeatureOrder.length) % heroFeatureOrder.length;
  const nextFlavor = heroFeatureOrder[nextIndex];
  setHeroFlavor(nextFlavor);
  updateProductSelect(heroFeatures[nextFlavor].id);
  updateMessage();
}

function initDessert3D() {
  if (!dessertCanvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0.18, 1.15, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas: dessertCanvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const root = new THREE.Group();
  root.position.set(1.06, 0.72, 0);
  root.rotation.set(-0.08, -0.28, 0.03);
  scene.add(root);

  const custard = new THREE.MeshPhysicalMaterial({
    color: 0xf5c365,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.32,
    clearcoatRoughness: 0.24
  });
  const caramel = new THREE.MeshPhysicalMaterial({
    color: 0xb94b18,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12
  });
  const cream = new THREE.MeshPhysicalMaterial({
    color: 0xfffbf1,
    roughness: 0.48,
    metalness: 0,
    clearcoat: 0.25
  });
  const guava = new THREE.MeshPhysicalMaterial({
    color: 0xd73e5e,
    roughness: 0.32,
    clearcoat: 0.5
  });
  const chocolate = new THREE.MeshPhysicalMaterial({
    color: 0x4d261c,
    roughness: 0.5,
    clearcoat: 0.22
  });

  function createPuddingBodyGeometry(segments = 160) {
    const positions = [];
    const indices = [];
    const yBottom = -0.56;
    const yTop = 0.3;
    const outerBottom = 1.72;
    const outerTop = 1.54;
    const innerBottom = 0.52;
    const innerTop = 0.7;

    function pushVertex(radius, y, angle) {
      positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      return positions.length / 3 - 1;
    }

    function pushQuad(a, b, c, d) {
      indices.push(a, b, c, a, c, d);
    }

    const outerBottomRing = [];
    const outerTopRing = [];
    const innerBottomRing = [];
    const innerTopRing = [];

    for (let i = 0; i < segments; i += 1) {
      const a = (i / segments) * Math.PI * 2;
      outerBottomRing.push(pushVertex(outerBottom, yBottom, a));
      outerTopRing.push(pushVertex(outerTop, yTop, a));
      innerBottomRing.push(pushVertex(innerBottom, yBottom, a));
      innerTopRing.push(pushVertex(innerTop, yTop, a));
    }

    for (let i = 0; i < segments; i += 1) {
      const next = (i + 1) % segments;
      pushQuad(outerBottomRing[i], outerBottomRing[next], outerTopRing[next], outerTopRing[i]);
      pushQuad(innerBottomRing[next], innerBottomRing[i], innerTopRing[i], innerTopRing[next]);
      pushQuad(outerTopRing[i], outerTopRing[next], innerTopRing[next], innerTopRing[i]);
      pushQuad(innerBottomRing[i], innerBottomRing[next], outerBottomRing[next], outerBottomRing[i]);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.78, 0.12, 128), cream);
  plate.position.y = -0.66;
  plate.scale.z = 0.72;
  root.add(plate);

  const pudding = new THREE.Mesh(createPuddingBodyGeometry(), custard);
  pudding.scale.z = 0.72;
  root.add(pudding);

  const caramelTop = new THREE.Mesh(new THREE.RingGeometry(0.56, 1.72, 160), caramel);
  caramelTop.rotation.x = -Math.PI / 2;
  caramelTop.position.y = 0.315;
  caramelTop.scale.z = 0.72;
  root.add(caramelTop);

  const caramelLip = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.085, 28, 160), caramel);
  caramelLip.rotation.x = Math.PI / 2;
  caramelLip.position.y = 0.33;
  caramelLip.scale.set(1.14, 1.14, 0.72);
  root.add(caramelLip);

  const innerGloss = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.06, 18, 120), caramel);
  innerGloss.rotation.x = Math.PI / 2;
  innerGloss.position.y = 0.35;
  innerGloss.scale.z = 0.7;
  root.add(innerGloss);

  const dripGroup = new THREE.Group();
  for (let i = 0; i < 12; i += 1) {
    const angle = Math.PI * (0.58 + i * 0.075);
    const length = 0.22 + (i % 4) * 0.045;
    const drip = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, length, 6, 12), caramel);
    drip.position.set(Math.cos(angle) * 1.55, -0.05 - length * 0.48, Math.sin(angle) * 1.08);
    drip.rotation.z = 0.04 * Math.sin(i);
    dripGroup.add(drip);
  }
  root.add(dripGroup);

  // Sweets/orbital rings/particles removidos — efeito decorativo migrou
  // para FluidParticles (assets/vendor/fluid-particles.js) no hero background.

  scene.add(new THREE.AmbientLight(0xfff0df, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(-2.4, 5.4, 4.2);
  scene.add(key);
  const rim = new THREE.PointLight(0xd73e5e, 4.4, 9);
  rim.position.set(3.2, 1.8, 2.4);
  scene.add(rim);
  const cool = new THREE.PointLight(0x235aa6, 2.2, 8);
  cool.position.set(-2.4, -0.6, 3.2);
  scene.add(cool);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    const rect = dessertCanvas.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(320, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const compact = width < 700;
    root.position.x = compact ? 0 : 1.08;
    root.position.y = compact ? 0.36 : 0.72;
    root.scale.setScalar(compact ? 0.72 : 0.82);
  }

  function animate(time) {
    const seconds = time * 0.001;
    root.rotation.y = -0.24 + Math.sin(seconds * 0.34) * 0.11 + pointer.x * 0.04;
    root.rotation.x = -0.08 + pointer.y * 0.025;
    pudding.rotation.z = seconds * 0.16;
    caramelTop.rotation.z = -seconds * 0.12;
    caramelLip.rotation.z = seconds * 0.22;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(animate);
}

document.addEventListener("click", (event) => {
  const openCartButton = event.target.closest("[data-open-cart]");
  if (openCartButton) {
    event.preventDefault();
    openCartModal(openCartButton);
    return;
  }

  if (event.target.closest("[data-close-cart]") || event.target === cartBackdrop) {
    event.preventDefault();
    closeCartModal();
    return;
  }

  const tab = event.target.closest("[data-category]");
  if (tab) {
    activeCategory = tab.dataset.category;
    document.querySelectorAll("[data-category]").forEach((item) => item.classList.toggle("is-active", item === tab));
    renderProducts();
  }

  const productButton = event.target.closest("[data-select-product]");
  if (productButton) {
    updateProductSelect(productButton.dataset.selectProduct);
    const heroFlavor = Object.entries(heroFeatures).find(([, feature]) => feature.id === productButton.dataset.selectProduct)?.[0];
    if (heroFlavor) setHeroFlavor(heroFlavor);
    addToCart(productButton.dataset.selectProduct);
    return;
  }

  const addSelectedButton = event.target.closest("[data-add-selected-product]");
  if (addSelectedButton) {
    addToCart(productSelect.value, 1, true);
    return;
  }

  const heroAddButton = event.target.closest("[data-hero-add-to-cart]");
  if (heroAddButton) {
    const activeFlavor = heroProductStage?.dataset.activeFlavor || "classic";
    const productId = heroFeatures[activeFlavor]?.id || "classic-pudim";
    addToCart(productId, Number(heroQuantityValue?.textContent || 1));
    return;
  }

  const cartQuantityButton = event.target.closest("[data-cart-quantity]");
  if (cartQuantityButton) {
    const line = cartQuantityButton.closest("[data-cart-product]");
    const item = preorderCart.find((cartItem) => cartItem.productId === line?.dataset.cartProduct);
    if (!item) return;
    const direction = cartQuantityButton.dataset.cartQuantity === "plus" ? 1 : -1;
    setCartQuantity(item.productId, item.quantity + direction);
    return;
  }

  const cartRemoveButton = event.target.closest("[data-cart-remove]");
  if (cartRemoveButton) {
    const line = cartRemoveButton.closest("[data-cart-product]");
    if (line) setCartQuantity(line.dataset.cartProduct, 0);
    return;
  }

  const heroFlavorButton = event.target.closest("[data-hero-flavor]");
  if (heroFlavorButton) {
    const flavor = heroFlavorButton.dataset.heroFlavor;
    setHeroFlavor(flavor);
    updateProductSelect(heroFeatures[flavor]?.id || "classic-pudim");
    updateMessage();
  }

  const question = event.target.closest("[data-question]");
  if (question) {
    addChatMessage(question.textContent, "user");
    answerQuestion(question.dataset.question);
  }

  const heroCycleButton = event.target.closest("[data-hero-cycle]");
  if (heroCycleButton) {
    cycleHeroFlavor(heroCycleButton.dataset.heroCycle);
  }

  if (event.target.closest("[data-chat-toggle]")) {
    toggleConcierge();
  }

  if (event.target.closest("[data-chat-close]")) {
    toggleConcierge(false);
  }

  const heroQuantityButton = event.target.closest("[data-hero-quantity]");
  if (heroQuantityButton && heroQuantityValue) {
    const direction = heroQuantityButton.dataset.heroQuantity === "plus" ? 1 : -1;
    const nextQuantity = Math.min(20, Math.max(1, Number(heroQuantityValue.textContent) + direction));
    heroQuantityValue.textContent = nextQuantity;
  }

  if (event.target.closest("[data-lock-admin]") && adminShell) {
    adminShell.classList.remove("is-unlocked");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("cart-modal-open")) {
    closeCartModal();
  }
});

document.querySelector("[data-language-toggle]").addEventListener("click", () => {
  language = language === "en" ? "pt" : "en";
  try { window.localStorage.setItem("bp-lang", language); } catch {}
  applyTranslations();
  document.dispatchEvent(new CustomEvent("bp:lang-change", { detail: { lang: language } }));
});

orderForm.addEventListener("input", () => {
  renderDeliveryQuote();
  updateMessage();
});
orderForm.addEventListener("change", () => {
  renderDeliveryQuote();
  updateMessage();
});
deliveryCheckButton?.addEventListener("click", checkDeliveryZip);
deliveryZipInput?.addEventListener("blur", checkDeliveryZip);
orderLink.addEventListener("click", submitCheckout);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.elements.question;
  const value = input.value.trim();
  if (!value) return;
  addChatMessage(value, "user");
  const normalized = value.toLowerCase();
  if (normalized.includes("deliver") || normalized.includes("entrega") || normalized.includes("zip")) {
    answerQuestion("delivery");
  } else if (normalized.includes("party") || normalized.includes("festa") || normalized.includes("event")) {
    answerQuestion("events");
  } else if (normalized.includes("early") || normalized.includes("anteced") || normalized.includes("quando")) {
    answerQuestion("notice");
  } else {
    answerQuestion("default");
  }
  input.value = "";
});

if (adminLogin && adminShell) {
  adminLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    adminShell.classList.add("is-unlocked");
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

function renderDeliveryMap() {
  if (serviceMap && window.bkDelivery) {
    window.bkDelivery.renderServiceMap(serviceMap, { zip: deliveryZipInput?.value, reset: true });
  }
}

renderDeliveryMap();
document.addEventListener("bk:delivery-settings-loaded", () => {
  activeDeliveryQuote = deliveryZipInput?.value ? window.bkDelivery?.quoteByZip(deliveryZipInput.value) : null;
  renderDeliveryQuote(activeDeliveryQuote);
  renderDeliveryMap();
  renderCart();
});

setMinimumDate();
preorderCart = [{ productId: "classic-pudim", quantity: 1 }];
applyTranslations();
setHeroFlavor("classic");
observeReveals();
updateScrollEffects();
initDessert3D();
