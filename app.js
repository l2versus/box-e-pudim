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
    image: "assets/img/lifestyle/hero-premium.png",
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
  },
  {
    id: "cups-tower",
    category: "box",
    image: "assets/img/products/product-dessert-cups.png",
    price: "from $42",
    lead: "48h",
    tag: "Box InHouse",
    en: {
      name: "Dessert Cups Box",
      description: "Layered Brazilian sweets packed as dessert cups for parties, gifts and family weekends."
    },
    pt: {
      name: "Box de Tacas de Sobremesa",
      description: "Doces brasileiros em camadas, embalados em tacas para festas, presentes e fim de semana."
    }
  },
  {
    id: "shrimp-tray",
    category: "box",
    image: "assets/img/products/product-shrimp-tray.png",
    price: "from $56",
    lead: "48h",
    tag: "Box InHouse",
    en: {
      name: "Crispy Shrimp Tray",
      description: "Golden shrimp over crunchy potato sticks, prepared by schedule for pickup or delivery."
    },
    pt: {
      name: "Bandeja de Camarao Crocante",
      description: "Camarao dourado com batata palha crocante, preparado sob agenda para retirada ou entrega."
    }
  },
  {
    id: "weekend-family-box",
    category: "box",
    image: "assets/img/boxes/box-photo.png",
    price: "custom",
    lead: "48h",
    tag: "Box InHouse",
    en: {
      name: "Weekend Family Box",
      description: "Rotating Brazilian comfort food box for small gatherings and no-stress weekends."
    },
    pt: {
      name: "Box Familia de Fim de Semana",
      description: "Box rotativa de comida brasileira de conforto para encontros pequenos e fim de semana sem stress."
    }
  }
];

const copy = {
  en: {
    navMenu: "Menu",
    navOrder: "Order",
    navHow: "How it works",
    marqueePreorder: "Preorder only",
    marqueeWhatsapp: "WhatsApp ordering",
    marqueeDelivery: "Pickup or delivery request",
    marqueeBatches: "Limited weekly batches",
    marqueeBilingual: "Bilingual storefront",
    marqueeFresh: "Made fresh by preorder",
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
    menuTitle: "Brazilian pudding menu, made by preorder.",
    menuAside:
      "Every item is made by preorder unless marked in stock. Lead time and availability are confirmed before payment.",
    tabPuddings: "Puddings",
    tabEvents: "Events",
    tabBoxes: "Box InHouse",
    chooseProduct: "Preorder",
    orderEyebrow: "Reserve your batch",
    orderTitle: "Tell us what you want to preorder and when you need it.",
    orderText:
      "Choose the item, date, quantity and pickup or delivery preference. WhatsApp opens with the details ready, so the owner can confirm schedule and production.",
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
    deliveryOutsideMessage: "Outside the automatic delivery radius. The owner can confirm by WhatsApp.",
    deliveryFromDanbury: "from Danbury",
    deliverySuffix: "delivery",
    deliveryFreeUnlocked: "Free delivery unlocked",
    deliveryFreeMin: "Free delivery from {amount} in this ZIP range.",
    deliveryFreeRemaining: "{amount} away from free delivery",
    deliveryFreeAlmost: "Almost there — only {amount} to go",
    deliveryPickupAlways: "Pickup is always free",
    deliveryEnterZip: "Enter your ZIP to calculate delivery",
    cartUpsellTitle: "Add more to your bag",
    messageFreeDelivery: "$0 (free delivery)",
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
    footerText: "Puddings and Brazilian sweets by preorder in the USA.",
    footerTitle: "Ready for the next batch?",
    footerWhatsapp: "Order on WhatsApp",
    footerHowTitle: "How it works",
    footerPickupTitle: "Pickup & delivery",
    footerReserveDate: "Reserve a date",
    footerRequestZip: "Request delivery ZIP",
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
    messageNotFilled: "Not filled yet",
    messageAddressPending: "Address pending",
    messagePickupLine: "Pickup in Danbury, CT",
    messageConfirmWhatsapp: "Confirm on WhatsApp",
    messageNoItems: "No items selected",
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
    marqueePreorder: "Somente sob encomenda",
    marqueeWhatsapp: "Pedido pelo WhatsApp",
    marqueeDelivery: "Retirada ou entrega local",
    marqueeBatches: "Lotes semanais limitados",
    marqueeBilingual: "Vitrine bilingue",
    marqueeFresh: "Feito fresco por encomenda",
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
    menuTitle: "Cardapio de pudim brasileiro por encomenda.",
    menuAside:
      "Todo item e feito por encomenda, a menos que esteja marcado como pronta entrega. Prazo e disponibilidade sao confirmados antes do pagamento.",
    tabPuddings: "Pudins",
    tabEvents: "Eventos",
    tabBoxes: "Box InHouse",
    chooseProduct: "Encomendar",
    orderEyebrow: "Reserve sua fornada",
    orderTitle: "Conte o que voce quer encomendar e para quando precisa.",
    orderText:
      "Escolha item, data, quantidade e retirada ou entrega. O WhatsApp abre com os detalhes prontos para a dona confirmar agenda e producao.",
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
    deliveryOutsideMessage: "Fora do raio automatico. A dona confirma pelo WhatsApp.",
    deliveryFromDanbury: "de Danbury",
    deliverySuffix: "entrega",
    deliveryFreeUnlocked: "Entrega gratis desbloqueada",
    deliveryFreeMin: "Entrega gratis a partir de {amount} nessa faixa.",
    deliveryFreeRemaining: "Faltam {amount} pra frete gratis",
    deliveryFreeAlmost: "Quase la, faltam so {amount}",
    deliveryPickupAlways: "Retirada e sempre gratis",
    deliveryEnterZip: "Informe o ZIP pra calcular o frete",
    cartUpsellTitle: "Adicionar mais a sua sacola",
    messageFreeDelivery: "$0 (entrega gratis)",
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
    footerText: "Pudins e doces brasileiros sob encomenda nos EUA.",
    footerTitle: "Pronto para a proxima fornada?",
    footerWhatsapp: "Pedir no WhatsApp",
    footerHowTitle: "Como pedir",
    footerPickupTitle: "Retirada e entrega",
    footerReserveDate: "Reservar uma data",
    footerRequestZip: "Consultar ZIP de entrega",
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
    messageNotFilled: "Ainda nao preenchido",
    messageAddressPending: "Endereco pendente",
    messagePickupLine: "Retirada em Danbury, CT",
    messageConfirmWhatsapp: "Confirmar no WhatsApp",
    messageNoItems: "Nenhum item selecionado",
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

function t(key, vars) {
  let s = copy[language][key] || copy.en[key] || key;
  if (vars) {
    for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  }
  return s;
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

function productAvailability(product) {
  const mode = product.availabilityMode || (priceNumber(product.price) > 0 ? "preorder" : "quote");
  const stock = Number(product.stockQty || 0);

  if (mode === "in_stock" && stock > 0) {
    return {
      mode,
      label: language === "pt" ? `Pronta entrega - ${stock} disp.` : `In stock - ${stock} available`,
      action: language === "pt" ? "Reservar agora" : "Reserve now",
    };
  }

  if (mode === "sold_out" || (mode === "in_stock" && stock <= 0)) {
    return {
      mode: "sold_out",
      label: language === "pt" ? "Agenda cheia" : "Schedule full",
      action: language === "pt" ? "Entrar na lista" : "Join waitlist",
    };
  }

  if (mode === "quote") {
    return {
      mode,
      label: language === "pt" ? "Sob consulta" : "Custom order",
      action: language === "pt" ? "Pedir orcamento" : "Request quote",
    };
  }

  return {
    mode: "preorder",
    label: language === "pt" ? `Encomenda ${product.lead}` : `${product.lead} preorder`,
    action: language === "pt" ? "Encomendar" : "Preorder",
  };
}

/* ============================================================
   DUAL-MODE: cada produto pode ter "pronto agora" e/ou "próxima fornada".
   Os overrides abaixo são fallback/demo — a verdade real vem do admin/API
   (stockQty + AvailabilitySlot). hydrateAvailability() sobrescreve as vagas
   com /api/availability quando o backend está no ar.
   ============================================================ */
const DUAL_MODE_OVERRIDES = {
  "classic-pudim": { mode: "both", stockQty: 4, batchSlots: 8, apiCategory: "pudim" },
  "berry-pudim": { mode: "made_to_order", batchSlots: 6, apiCategory: "pudim" },
  "gift-pudim": { mode: "both", stockQty: 2, batchSlots: 6, apiCategory: "pudim" },
  "cookie-gift-duo": { mode: "ready", stockQty: 12, apiCategory: "sweet" },
};

const AVAIL_ICONS = {
  cal: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>',
  chat: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8 9 9 0 0 1-4-1L3 20l1.5-4.5a8.4 8.4 0 0 1 7.5-12 8.4 8.4 0 0 1 9 8z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

function dualModeOf(product) {
  const ov = DUAL_MODE_OVERRIDES[product.id] || {};
  const isQuote = priceNumber(product.price) <= 0;
  const mode = product.availabilityMode || ov.mode || (isQuote ? "quote" : "made_to_order");
  return {
    mode,
    stockQty: Number(product.stockQty ?? ov.stockQty ?? 0),
    batchSlots: Number(product.batchSlots ?? ov.batchSlots ?? 0),
    apiCategory: product.apiCategory || ov.apiCategory || (product.category === "puddings" ? "pudim" : "sweet"),
  };
}

function nextBatchLabel() {
  const d = new Date();
  const add = (6 - d.getDay() + 7) % 7 || 7; // próximo sábado futuro (base recorrente)
  d.setDate(d.getDate() + add);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const label = d.toLocaleDateString(language === "pt" ? "pt-BR" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return { iso, label };
}

function availabilityFor(product) {
  const dm = dualModeOf(product);
  const rows = [];

  if (dm.mode === "quote") {
    rows.push({
      kind: "quote",
      title: language === "pt" ? "Sob consulta" : "By request",
      sub: language === "pt" ? `Encomenda ${product.lead}` : `${product.lead} lead time`,
    });
    return { mode: "quote", rows, cta: language === "pt" ? "Pedir orçamento" : "Request a quote" };
  }

  if (dm.mode === "sold_out" || (dm.mode === "ready" && dm.stockQty <= 0)) {
    rows.push({
      kind: "soldout",
      title: language === "pt" ? "Esgotado por enquanto" : "Sold out for now",
      sub: language === "pt" ? "Entre na lista de espera" : "Join the waitlist",
    });
    return { mode: "sold_out", rows, cta: language === "pt" ? "Lista de espera" : "Join waitlist" };
  }

  const hasReady = (dm.mode === "ready" || dm.mode === "both") && dm.stockQty > 0;
  const hasBatch = dm.mode === "made_to_order" || dm.mode === "both";

  if (hasReady) {
    rows.push({
      kind: "ready",
      title: language === "pt" ? `Pronto agora · ${dm.stockQty} un.` : `Ready now · ${dm.stockQty} left`,
      sub: language === "pt" ? "Retirada ou entrega hoje" : "Pickup or delivery today",
    });
  }
  if (hasBatch) {
    const batch = nextBatchLabel();
    rows.push({
      kind: "batch",
      apiCategory: dm.apiCategory,
      batchIso: batch.iso,
      slots: dm.batchSlots,
      title: language === "pt" ? `Próxima fornada · ${batch.label}` : `Next batch · ${batch.label}`,
    });
  }

  const mode = hasReady && hasBatch ? "both" : hasReady ? "ready" : "made_to_order";
  const cta = hasReady && !hasBatch
    ? (language === "pt" ? "Pegar agora" : "Grab it now")
    : (language === "pt" ? "Adicionar ao pedido" : "Add to order");
  return { mode, rows, cta };
}

function renderAvailRow(r) {
  const slotsWord = language === "pt" ? "vagas" : "left";
  if (r.kind === "ready") {
    return `<div class="bk-avail-row is-ready"><span class="bk-avail-row__icon"><span class="bk-dot"></span></span><span class="bk-avail-row__text"><b>${r.title}</b><span>${r.sub}</span></span></div>`;
  }
  if (r.kind === "batch") {
    return `<div class="bk-avail-row is-batch" data-batch-cat="${r.apiCategory}" data-batch-date="${r.batchIso}"><span class="bk-avail-row__icon">${AVAIL_ICONS.cal}</span><span class="bk-avail-row__text"><b>${r.title}</b><span><span data-avail-slots>${r.slots}</span> ${slotsWord}</span></span></div>`;
  }
  if (r.kind === "quote") {
    return `<div class="bk-avail-row is-quote"><span class="bk-avail-row__icon">${AVAIL_ICONS.chat}</span><span class="bk-avail-row__text"><b>${r.title}</b><span>${r.sub}</span></span></div>`;
  }
  return `<div class="bk-avail-row is-soldout"><span class="bk-avail-row__icon">${AVAIL_ICONS.clock}</span><span class="bk-avail-row__text"><b>${r.title}</b><span>${r.sub}</span></span></div>`;
}

async function hydrateAvailability() {
  if (!window.bkApi) return;
  const rows = Array.from(grid.querySelectorAll(".bk-avail-row.is-batch[data-batch-date]"));
  const byDate = {};
  rows.forEach((row) => {
    (byDate[row.dataset.batchDate] = byDate[row.dataset.batchDate] || []).push(row);
  });
  for (const [date, rowEls] of Object.entries(byDate)) {
    try {
      const res = await window.bkApi.getAvailability(date);
      const map = {};
      (res?.slots || []).forEach((s) => { map[s.category] = s.available; });
      rowEls.forEach((row) => {
        const available = map[row.dataset.batchCat];
        if (available == null) return;
        const span = row.querySelector("[data-avail-slots]");
        if (span) span.textContent = available;
        if (available <= 0) row.classList.add("is-soldout");
      });
    } catch (_) {
      /* backend fora do ar: mantém as vagas estáticas do fallback */
    }
  }
}

function productPicture(product, content, attrs = "") {
  const imageClass = product.image.includes("product-") ? "product-cutout" : "";
  const classAttr = attrs.includes("class=") ? attrs : `class="${imageClass}" ${attrs}`.trim();
  return window.bkPicture
    ? window.bkPicture.html(product.image, `${classAttr} alt="${content.name}"`)
    : `<img ${classAttr} src="${product.image}" alt="${content.name}" />`;
}

function renderProducts() {
  grid.innerHTML = visibleProducts()
    .map((product, index) => {
      const content = product[language];
      const av = availabilityFor(product);
      const pictureMarkup = productPicture(product, content, 'loading="lazy" decoding="async"');
      const badge = product.tag ? `<span class="bk-pcard__badge">${product.tag}</span>` : "";
      const rowsHtml = av.rows.map(renderAvailRow).join("");
      return `
        <article class="product-card bk-pcard reveal" data-availability="${av.mode}" data-product-id="${product.id}" style="transition-delay:${index * 60}ms">
          <div class="bk-pcard__media">${badge}${pictureMarkup}</div>
          <div class="bk-pcard__body">
            <div class="bk-pcard__head">
              <h3 class="bk-pcard__title">${content.name}</h3>
              <span class="bk-pcard__price">${priceLabel(product.price)}</span>
            </div>
            <p class="bk-pcard__desc">${content.description}</p>
            <div class="bk-pcard__avail">${rowsHtml}</div>
            <button class="bk-pcard__cta select-product" type="button" data-select-product="${product.id}">${av.cta}</button>
          </div>
        </article>
      `;
    })
    .join("");
  observeReveals();
  wireCardLight();
  hydrateAvailability();
}

function updateProductSelect(selectedId = productSelect.value || products[0].id) {
  if (!productSelect) return;
  productSelect.innerHTML = products
    .map((product) => `<option value="${product.id}">${product[language].name} - ${priceLabel(product.price)}</option>`)
    .join("");
  productSelect.value = products.some((product) => product.id === selectedId) ? selectedId : products[0].id;
  renderCartProductPicker(productSelect.value);
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

function renderCartProductPicker(selectedId = productSelect?.value || products[0].id) {
  if (!productSelect) return;
  const host = productSelect.closest("label");
  if (!host) return;
  let picker = host.querySelector("[data-cart-product-picker]");
  if (!picker) {
    picker = document.createElement("div");
    picker.className = "cart-product-picker";
    picker.setAttribute("data-cart-product-picker", "");
    productSelect.insertAdjacentElement("afterend", picker);
  }

  picker.innerHTML = products.map((product) => {
    const content = product[language];
    const availability = productAvailability(product);
    const active = product.id === selectedId ? " is-active" : "";
    const image = productPicture(product, content, 'class="cart-product-thumb" loading="lazy" decoding="async"');
    return `
      <button class="cart-product-choice${active}" type="button" data-cart-pick-product="${product.id}">
        ${image}
        <span>
          <strong>${content.name}</strong>
          <small>${priceLabel(product.price)} - ${availability.label}</small>
        </span>
      </button>
    `;
  }).join("");
}

function money(value) {
  return value > 0 ? `$${value.toFixed(2).replace(/\.00$/, "")}` : (language === "pt" ? "sob consulta" : "custom");
}

function priceLabel(price) {
  const value = String(price || "");
  if (language === "pt") {
    if (/^from\s+/i.test(value)) return value.replace(/^from\s+/i, "a partir de ");
    if (/custom/i.test(value)) return "sob consulta";
  }
  return value;
}

function openCartModal(trigger) {
  if (!cartModal) return;
  lastCartTrigger = trigger || document.activeElement;
  document.body.classList.add("cart-modal-open");
  cartModal.setAttribute("aria-hidden", "false");
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
  return isDeliverySelected() && activeDeliveryQuote?.served && !hasFreeDelivery()
    ? (activeDeliveryQuote.feeCents || 0) / 100
    : 0;
}

function orderTotal() {
  return cartTotal() + deliveryFee();
}

function freeDeliveryMinCents() {
  return Number(activeDeliveryQuote?.tier?.freeMinCents || 0);
}

function hasFreeDelivery() {
  const min = freeDeliveryMinCents();
  return isDeliverySelected() && activeDeliveryQuote?.served && min > 0 && Math.round(cartTotal() * 100) >= min;
}

function freeDeliveryMinLabel() {
  const min = freeDeliveryMinCents();
  return min > 0 && window.bkDelivery ? window.bkDelivery.moneyFromCents(min) : "";
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
    const minCents = freeDeliveryMinCents();
    const remainingCents = Math.max(0, minCents - Math.round(cartTotal() * 100));
    const remainingLabel = window.bkDelivery
      ? window.bkDelivery.moneyFromCents(remainingCents)
      : `$${(remainingCents / 100).toFixed(2)}`;
    const freeCopy = !minCents
      ? ""
      : hasFreeDelivery()
        ? t("deliveryFreeUnlocked")
        : t(remainingCents / minCents <= 0.2 ? "deliveryFreeAlmost" : "deliveryFreeRemaining", { amount: remainingLabel });
    const feeTitle = hasFreeDelivery()
      ? t("deliveryFreeUnlocked")
      : `${quote.feeLabel} ${t("deliverySuffix")}`;
    deliveryQuoteBox.innerHTML = `<strong>${feeTitle}</strong><span>${quote.zip} - ${quote.distanceMiles} mi ${t("deliveryFromDanbury")} - ${quote.tier.label}${freeCopy ? ` - ${freeCopy}` : ""}</span>`;
    return;
  }
  deliveryQuoteBox.innerHTML = `<strong>${t("deliveryUnavailable")}</strong><span>${quote.zip || ""} ${quote.distanceMiles ? `- ${quote.distanceMiles} mi` : ""} - ${t("deliveryOutsideMessage")}</span>`;
}

function renderFreeShippingMeter() {
  const meter = document.querySelector("[data-ship-meter]");
  if (!meter) return;
  const label = meter.querySelector("[data-ship-label]");
  const pct = meter.querySelector("[data-ship-pct]");
  const fill = meter.querySelector("[data-ship-fill]");
  meter.classList.remove("is-pickup", "is-done");

  // Retirada: frete nao se aplica
  if (!isDeliverySelected()) {
    meter.hidden = false;
    meter.classList.add("is-pickup");
    if (label) label.textContent = t("deliveryPickupAlways");
    if (pct) pct.textContent = "";
    if (fill) fill.style.width = "100%";
    return;
  }
  // Delivery sem ZIP conferido ainda
  if (!activeDeliveryQuote || !activeDeliveryQuote.served) {
    meter.hidden = false;
    if (label) label.textContent = t("deliveryEnterZip");
    if (pct) pct.textContent = "";
    if (fill) fill.style.width = "0%";
    return;
  }
  const minCents = freeDeliveryMinCents();
  if (minCents <= 0) {
    meter.hidden = true;
    return;
  }
  const subCents = Math.round(cartTotal() * 100);
  const remainingCents = Math.max(0, minCents - subCents);
  const pctVal = Math.min(100, Math.round((subCents / minCents) * 100));
  meter.hidden = false;
  if (fill) fill.style.width = `${pctVal}%`;
  if (pct) pct.textContent = `${pctVal}%`;
  if (remainingCents <= 0) {
    meter.classList.add("is-done");
    if (label) label.textContent = t("deliveryFreeUnlocked");
  } else {
    const amount = window.bkDelivery
      ? window.bkDelivery.moneyFromCents(remainingCents)
      : `$${(remainingCents / 100).toFixed(2)}`;
    if (label) {
      label.textContent = t(remainingCents / minCents <= 0.2 ? "deliveryFreeAlmost" : "deliveryFreeRemaining", { amount });
    }
  }
}

async function checkDeliveryZip() {
  if (!deliveryZipInput || !window.bkDelivery) return null;
  const deliveryRadio = orderForm?.querySelector('input[name="fulfillment"][value*="Delivery"], input[name="fulfillment"][value*="entrega"]');
  if (deliveryRadio && !deliveryRadio.checked) {
    deliveryRadio.checked = true;
  }
  const zip = window.bkDelivery.sanitizeZip(deliveryZipInput.value);
  deliveryZipInput.value = zip;
  activeDeliveryQuote = window.bkDelivery.quoteByZip(zip);
  renderDeliveryQuote(activeDeliveryQuote);
  renderDeliveryMap();
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
            <small>${priceLabel(item.product.price)} - ${item.product.lead} - ${item.product.tag}</small>
          </div>
          <div class="cart-line-actions">
            <div class="quantity-stepper">
              <button type="button" data-cart-quantity="minus" aria-label="Decrease ${content.name}">-</button>
              <b>${item.quantity}</b>
              <button type="button" data-cart-quantity="plus" aria-label="Increase ${content.name}">+</button>
            </div>
            <span>${linePrice > 0 ? money(linePrice) : priceLabel(item.product.price)}</span>
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
  document.querySelectorAll("[data-bk-header]").forEach((item) => item.setAttribute("data-bk-cart-count", String(count)));
  if (cartTotalNode) cartTotalNode.textContent = count > 0 ? money(orderTotal()) : "$0";
  if (cartFloatingCount) {
    cartFloatingCount.textContent =
      language === "pt"
        ? `${count} ${count === 1 ? "item" : "itens"}`
        : `${count} ${count === 1 ? "item" : "items"}`;
  }
  if (cartFloatingTotal) cartFloatingTotal.textContent = count > 0 ? money(orderTotal()) : "$0";
  const floatingCart = cartFloatingCount?.closest(".cart-fab");
  if (floatingCart) floatingCart.hidden = count === 0;
  renderFreeShippingMeter();
}

function buildMessage() {
  const data = new FormData(orderForm);
  const notes = data.get("notes")?.trim() || t("fallbackNotes");
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const zip = String(data.get("deliveryZip") || "").trim();
  const address = String(data.get("deliveryAddress") || "").trim();
  const deliverySelected = isDeliverySelected();
  const fulfillmentLine = deliverySelected ? t("delivery") : t("pickup");
  const deliveryLine = deliverySelected
    ? `${address || t("messageAddressPending")}${zip ? ` - ZIP ${zip}` : ""}`
    : t("messagePickupLine");
  const feeLine = deliverySelected
    ? activeDeliveryQuote?.served
      ? hasFreeDelivery()
        ? t("messageFreeDelivery")
        : activeDeliveryQuote.feeLabel
      : t("messageConfirmWhatsapp")
    : "$0";
  const items = cartItems();
  const itemLines = items.length
    ? items
        .map((item) => {
          const product = item.product;
          const linePrice = priceNumber(product.price) * item.quantity;
          return `- ${item.quantity}x ${product[language].name} (${linePrice > 0 ? money(linePrice) : priceLabel(product.price)})`;
        })
        .join("\n")
    : `- ${t("messageNoItems")}`;
  return `${t("messageIntro")}

${t("messageCustomer")}: ${name || t("messageNotFilled")}
${t("messagePhone")}: ${phone || t("messageNotFilled")}
${t("messageItems")}:
${itemLines}
${t("messageDate")}: ${data.get("date")}
${t("messageTime")}: ${data.get("time") || t("fallbackTime")}
${t("messageFulfillment")}: ${fulfillmentLine}
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

function saveLocalOrderSnapshot(status = "requested") {
  try {
    const data = new FormData(orderForm);
    const delivery = isDeliverySelected();
    const orders = JSON.parse(window.localStorage.getItem("bp-local-orders") || "[]");
    const id = `local-${Date.now()}`;
    const order = {
      id,
      number: id.replace("local-", "L"),
      status,
      source: "Brazilian Pudding",
      createdAt: new Date().toISOString(),
      requestedFor: requestedForIso(String(data.get("date") || "").trim()),
      requestedTz: "America/New_York",
      fulfillment: delivery ? "delivery" : "pickup",
      deliveryAddress: delivery ? String(data.get("deliveryAddress") || "").trim() : "",
      deliveryZip: delivery ? String(data.get("deliveryZip") || "").trim() : "",
      customer: {
        name: String(data.get("name") || "").trim() || "Cliente",
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        preferredLang: language,
      },
      items: cartItems().map((item) => ({
        productId: item.product.id,
        qty: item.quantity,
        product: { name: item.product[language].name },
      })),
      totalCents: Math.round(orderTotal() * 100),
      currency: "USD",
      message: buildMessage(),
      notes: String(data.get("notes") || "").trim(),
    };
    window.localStorage.setItem("bp-local-orders", JSON.stringify([order, ...orders].slice(0, 120)));
    return order;
  } catch {
    return null;
  }
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
      saveLocalOrderSnapshot("requested");
      saveLocalLeadSnapshot("API offline");
    }
  } catch {
    try {
      if (window.bkApi) await window.bkApi.createLead(buildLeadPayload());
    } catch {
      saveLocalLeadSnapshot("API fallback");
    }
    saveLocalOrderSnapshot("requested");
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
    heroProductPrice.textContent = priceLabel(feature.price);
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

  const cartPickProduct = event.target.closest("[data-cart-pick-product]");
  if (cartPickProduct) {
    // 1-tap: o thumb do picker adiciona direto (openCart=false, ja estamos na sacola)
    addToCart(cartPickProduct.dataset.cartPickProduct, 1, false);
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
  renderFreeShippingMeter();
  updateMessage();
});
orderForm.addEventListener("change", () => {
  renderDeliveryQuote();
  renderFreeShippingMeter();
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
document.addEventListener("bk:cart-opened", () => {
  window.setTimeout(renderDeliveryMap, 140);
});

setMinimumDate();
applyTranslations();
setHeroFlavor("classic");
observeReveals();
updateScrollEffects();
initDessert3D();
