const BOX_WA_PHONE = (window.BK_CONFIG && window.BK_CONFIG.waPhone) || "12034822797";

const boxProducts = {
  cups: {
    title: "Dessert cups tower",
    description: "Layered Brazilian sweets packed for parties, office treats and family weekends.",
    price: "from $42",
    label: "Dessert Cups",
    image: "assets/img/products/product-dessert-cups.png",
    tag: "Sweets",
    message: "Hi! I want to preorder the Box InHouse dessert cups. Can you send availability?"
  },
  classicPudim: {
    title: "Classic Brazilian pudim",
    description: "Glossy caramel pudding added as dessert to a Box InHouse preorder.",
    price: "from $28",
    label: "Classic Pudim",
    image: "assets/img/products/product-classic-pudim.png",
    tag: "Dessert add-on",
    message: "Hi! I want to add a classic Brazilian pudim to my Box InHouse preorder."
  },
  berryPudim: {
    title: "Berry Brazilian pudim",
    description: "Silky Brazilian pudim with berry topping for a dessert add-on.",
    price: "from $34",
    label: "Berry Pudim",
    image: "assets/img/products/product-berry-pudim.png",
    tag: "Dessert add-on",
    message: "Hi! I want to add a berry pudim to my Box InHouse preorder."
  },
  giftPudim: {
    title: "Gift-ready pudim",
    description: "A polished pudim presentation for gifting with food boxes.",
    price: "from $34",
    label: "Gift-Ready Pudim",
    image: "assets/img/lifestyle/hero-premium.png",
    tag: "Dessert add-on",
    message: "Hi! I want to add a gift-ready pudim to my Box InHouse preorder."
  },
  shrimp: {
    title: "Crispy shrimp tray",
    description: "Golden shrimp over crunchy potato sticks, made for pickup or delivery by schedule.",
    price: "from $56",
    label: "Crispy Shrimp",
    image: "assets/img/products/product-shrimp-tray.png",
    tag: "Savory",
    message: "Hi! I want to preorder the Box InHouse crispy shrimp tray. Can you send availability?"
  },
  weekend: {
    title: "Weekend family box",
    description: "A rotating Brazilian comfort box for small gatherings and no-stress weekends.",
    price: "custom quote",
    label: "Weekend Box",
    image: "assets/img/boxes/box-photo.png",
    tag: "Family",
    message: "Hi! I want to preorder a Box InHouse weekend family box. Can you send this week's options?"
  },
  beefRice: {
    title: "Beef rice lunch box",
    description: "Brazilian-style beef with rice, vegetables and pickup-ready packaging.",
    price: "from $18",
    label: "Beef Rice Box",
    image: "assets/img/boxes/box-beef-rice.png",
    tag: "Lunch",
    message: "Hi! I want to preorder the beef rice lunch box. Can you send availability?"
  },
  fitGroundBeef: {
    title: "Fit ground beef box",
    description: "Ground beef, rice and vegetables for balanced weekly meal orders.",
    price: "from $17",
    label: "Fit Ground Beef",
    image: "assets/img/boxes/box-fit-ground-beef.png",
    tag: "Fit",
    message: "Hi! I want to preorder the fit ground beef box. Can you send availability?"
  },
  grilledChicken: {
    title: "Grilled chicken box",
    description: "Seasoned chicken over rice, prepared in batches for the week.",
    price: "from $18",
    label: "Grilled Chicken Box",
    image: "assets/img/boxes/box-grilled-chicken.png",
    tag: "Lunch",
    message: "Hi! I want to preorder the grilled chicken box. Can you send availability?"
  },
  meatballPasta: {
    title: "Meatball pasta box",
    description: "Comfort pasta with meatballs, sauce and ready-to-share packaging.",
    price: "from $18",
    label: "Meatball Pasta",
    image: "assets/img/boxes/box-meatball-pasta.png",
    tag: "Comfort",
    message: "Hi! I want to preorder the meatball pasta box. Can you send availability?"
  },
  salmonMash: {
    title: "Salmon mash box",
    description: "Salmon, creamy mash and greens for a premium scheduled meal.",
    price: "from $24",
    label: "Salmon Mash Box",
    image: "assets/img/boxes/box-salmon-mash.png",
    tag: "Premium",
    message: "Hi! I want to preorder the salmon mash box. Can you send availability?"
  },
  groundBeefRice: {
    title: "Ground beef rice box",
    description: "Rice, ground beef, carrots and potatoes in a practical comfort box.",
    price: "from $17",
    label: "Ground Beef Rice",
    image: "assets/img/boxes/box-ground-beef-rice.png",
    tag: "Lunch",
    message: "Hi! I want to preorder the ground beef rice box. Can you send availability?"
  },
  pizzaWaffle: {
    title: "Pizza waffle snack",
    description: "Handheld savory waffle snack for add-ons and small gift boxes.",
    price: "from $10",
    label: "Pizza Waffle",
    image: "assets/img/boxes/box-pizza-waffle.png",
    tag: "Snack",
    message: "Hi! I want to preorder pizza waffles. Can you send availability?"
  },
  savoryPie: {
    title: "Savory straw potato pie",
    description: "Brazilian savory pie with crunchy potato topping for gatherings.",
    price: "from $42",
    label: "Savory Pie",
    image: "assets/img/boxes/box-savory-pie.png",
    tag: "Party",
    message: "Hi! I want to preorder the savory pie. Can you send availability?"
  },
  shrimpPlatter: {
    title: "Party shrimp platter",
    description: "Crispy shrimp platter with sauce, made for events and shared tables.",
    price: "from $68",
    label: "Shrimp Platter",
    image: "assets/img/boxes/box-shrimp-platter.png",
    tag: "Party",
    message: "Hi! I want to preorder the party shrimp platter. Can you send availability?"
  },
  cookieDuo: {
    title: "Cookie duo box",
    description: "Gourmet cookies for add-ons, gifts and dessert boxes.",
    price: "from $12",
    label: "Cookie Duo",
    image: "assets/img/events/event-cookie-duo.png",
    tag: "Sweets",
    message: "Hi! I want to preorder the cookie duo box. Can you send availability?"
  },
  charcuterie: {
    title: "Charcuterie board",
    description: "Premium cheese, fruit, crackers and cold cuts for events.",
    price: "custom quote",
    label: "Charcuterie Board",
    image: "assets/img/events/event-charcuterie-board.png",
    tag: "Events",
    message: "Hi! I want to request a charcuterie board quote. Can you send availability?"
  },
  luxuryHamper: {
    title: "Luxury gift hamper",
    description: "Custom hamper with sweets, drink, flowers and premium styling.",
    price: "custom quote",
    label: "Luxury Hamper",
    image: "assets/img/events/event-luxury-hamper.png",
    tag: "Gift",
    message: "Hi! I want to request a luxury gift hamper quote. Can you send options?"
  },
  birthdayTray: {
    title: "Birthday tray",
    description: "Personalized birthday tray with sweets, drinks and ribbons.",
    price: "custom quote",
    label: "Birthday Tray",
    image: "assets/img/events/event-birthday-blue-tray.png",
    tag: "Gift",
    message: "Hi! I want to request a birthday tray quote. Can you send options?"
  }
};

// Expor para o sistema de i18n externo (assets/i18n/box-i18n.js)
window.boxProducts = boxProducts;
window.addEventListener("box-rerender", () => {
  if (typeof renderProductControls === "function") renderProductControls();
  if (typeof renderProductCatalog === "function") renderProductCatalog();
  if (typeof setProduct === "function" && typeof activeProduct !== "undefined") setProduct(activeProduct);
  if (typeof refreshBoxCart === "function") refreshBoxCart();
});

let productButtons = [...document.querySelectorAll("[data-box-menu-product]")];
const productSwitch = document.querySelector("[data-box-product-switch]");
const productCatalog = document.querySelector("[data-box-product-catalog]");
const boxProductSelect = document.querySelector("[data-box-product-select]");
const mainImage = document.querySelector("[data-box-main-image]");
const title = document.querySelector("[data-box-title]");
const description = document.querySelector("[data-box-description]");
const price = document.querySelector("[data-box-price]");
const currentLabel = document.querySelector("[data-box-current-label]");
const currentPrice = document.querySelector("[data-box-current-price]");
const waLinks = [...document.querySelectorAll("[data-box-wa]")];
const progress = document.querySelector("[data-box-progress]");
const revealNodes = [...document.querySelectorAll("[data-box-reveal]")];
const header = document.querySelector("[data-box-header]");
const boxOrderForm = document.querySelector("[data-box-order-form]");
const boxCartLines = document.querySelector("[data-box-cart-lines]");
const boxCartCount = document.querySelector("[data-box-cart-count]");
const boxCartTotal = document.querySelector("[data-box-cart-total]");
const boxCartFloatingCount = document.querySelector("[data-box-cart-floating-count]");
const boxCartFloatingTotal = document.querySelector("[data-box-cart-floating-total]");
const boxOrderLink = document.querySelector("[data-box-order]");
const boxMessagePreview = document.querySelector("[data-box-message-preview]");
const boxDateInput = document.querySelector("[data-box-date]");
const boxDeliveryZipInput = document.querySelector("[data-delivery-zip]");
const boxDeliveryCheckButton = document.querySelector("[data-delivery-check]");
const boxDeliveryQuoteBox = document.querySelector("[data-delivery-quote]");
const boxServiceMap = document.querySelector("[data-service-map]");

let activeProduct = "cups";
let boxCart = [];
let activeBoxDeliveryQuote = null;

const BOX_UI = {
  en: {
    pickupFree: "Pickup is free.",
    pickup: "Pickup",
    deliveryChoice: "Delivery request",
    deliveryHint: "For delivery, enter the ZIP before sending.",
    enterZip: "Enter delivery ZIP.",
    quoteFrom: "We quote from Danbury, CT 06810.",
    deliverySuffix: "delivery",
    deliveryFromDanbury: "from Danbury",
    deliveryFreeUnlocked: "Free delivery unlocked",
    deliveryFreeMin: "Free delivery from {amount} in this ZIP range.",
    outsideRadiusMessage: "Outside the automatic delivery radius. The owner can confirm by WhatsApp.",
    confirmation: "Delivery needs confirmation.",
    noItems: "No items selected",
    emptyCart: "Add boxes, meals or pudim desserts from the menu to organize the preorder.",
    items: (count) => `${count} item${count === 1 ? "" : "s"}`,
    remove: "Remove",
    addToCart: "Add to cart",
    choose: "Choose",
    customQuote: "custom quote",
    customSuffix: "custom",
    intro: "Hi! I would like to request a Box InHouse preorder.",
    notFilled: "Not filled yet",
    addressPending: "Address pending",
    pickupLine: "Pickup in Danbury, CT",
    confirmWhatsapp: "Confirm on WhatsApp",
    freeDeliveryFee: "$0 (free delivery)",
    customer: "Customer",
    whatsapp: "WhatsApp",
    messageItems: "Items",
    preferredDate: "Preferred date",
    preferredTime: "Preferred time",
    fulfillment: "Fulfillment",
    delivery: "Delivery",
    deliveryFee: "Delivery fee",
    estimatedTotal: "Estimated total",
    notes: "Notes",
    fallbackTime: "Owner can suggest the best window",
    fallbackNotes: "No notes yet",
    validationItem: "Add at least 1 item.",
    validationName: "Enter your name.",
    validationWhatsapp: "Enter your WhatsApp.",
    validationDate: "Choose a date.",
    validationLead: "Date must be at least 48h ahead.",
    validationZip: "Enter the delivery ZIP.",
    validationAddress: "Enter the delivery address.",
    validationZipConfirm: "This ZIP needs WhatsApp confirmation.",
    sending: "Sending...",
  },
  pt: {
    pickupFree: "Retirada e gratis.",
    pickup: "Retirada",
    deliveryChoice: "Solicitar entrega",
    deliveryHint: "Para entrega, digite o ZIP antes de enviar.",
    enterZip: "Informe o ZIP da entrega.",
    quoteFrom: "Calculamos a partir de Danbury, CT 06810.",
    deliverySuffix: "entrega",
    deliveryFromDanbury: "de Danbury",
    deliveryFreeUnlocked: "Entrega gratis desbloqueada",
    deliveryFreeMin: "Entrega gratis a partir de {amount} nessa faixa.",
    outsideRadiusMessage: "Fora do raio automatico. A dona confirma pelo WhatsApp.",
    confirmation: "Entrega precisa de confirmacao.",
    noItems: "Nenhum item selecionado",
    emptyCart: "Adicione boxes, refeicoes ou pudins do menu para organizar a encomenda.",
    items: (count) => `${count} ${count === 1 ? "item" : "itens"}`,
    remove: "Remover",
    addToCart: "Adicionar",
    choose: "Escolher",
    customQuote: "sob consulta",
    customSuffix: "sob consulta",
    intro: "Oi! Gostaria de solicitar uma encomenda Box InHouse.",
    notFilled: "Ainda nao preenchido",
    addressPending: "Endereco pendente",
    pickupLine: "Retirada em Danbury, CT",
    confirmWhatsapp: "Confirmar no WhatsApp",
    freeDeliveryFee: "$0 (entrega gratis)",
    customer: "Cliente",
    whatsapp: "WhatsApp",
    messageItems: "Itens",
    preferredDate: "Data desejada",
    preferredTime: "Horario desejado",
    fulfillment: "Forma",
    delivery: "Entrega",
    deliveryFee: "Taxa de entrega",
    estimatedTotal: "Total estimado",
    notes: "Observacoes",
    fallbackTime: "A dona pode sugerir a melhor janela",
    fallbackNotes: "Sem observacoes ainda",
    validationItem: "Adicione pelo menos 1 item.",
    validationName: "Informe seu nome.",
    validationWhatsapp: "Informe seu WhatsApp.",
    validationDate: "Escolha a data.",
    validationLead: "A data precisa respeitar 48h de antecedencia.",
    validationZip: "Informe o ZIP da entrega.",
    validationAddress: "Informe o endereco da entrega.",
    validationZipConfirm: "Esse ZIP precisa ser confirmado no WhatsApp.",
    sending: "Enviando...",
  },
};

function boxLang() {
  try { return window.localStorage.getItem("bp-lang") === "pt" ? "pt" : "en"; }
  catch { return "en"; }
}

function boxUi(key, ...args) {
  const value = (BOX_UI[boxLang()] || BOX_UI.en)[key] ?? BOX_UI.en[key];
  return typeof value === "function" ? value(...args) : value;
}

function whatsappUrl(message) {
  return `https://wa.me/${BOX_WA_PHONE}?text=${encodeURIComponent(message)}`;
}

function productByKey(productKey) {
  return boxProducts[productKey] || boxProducts.cups;
}

function priceNumber(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function boxAvailability(product) {
  const lang = boxLang();
  const mode = product.availabilityMode || (priceNumber(product.price) > 0 ? "preorder" : "quote");
  const stock = Number(product.stockQty || 0);

  if (mode === "in_stock" && stock > 0) {
    return {
      mode,
      label: lang === "pt" ? `Pronta entrega - ${stock} disp.` : `In stock - ${stock} available`,
      action: lang === "pt" ? "Reservar agora" : "Reserve now",
    };
  }

  if (mode === "sold_out" || (mode === "in_stock" && stock <= 0)) {
    return {
      mode: "sold_out",
      label: lang === "pt" ? "Agenda cheia" : "Schedule full",
      action: lang === "pt" ? "Entrar na lista" : "Join waitlist",
    };
  }

  if (mode === "quote") {
    return {
      mode,
      label: lang === "pt" ? "Sob encomenda" : "Custom preorder",
      action: lang === "pt" ? "Pedir orcamento" : "Request quote",
    };
  }

  return {
    mode: "preorder",
    label: lang === "pt" ? "Encomenda 48h" : "48h preorder",
    action: lang === "pt" ? "Encomendar" : "Preorder",
  };
}

function boxPicture(product, attrs = "") {
  return window.bkPicture
    ? window.bkPicture.html(product.image, `${attrs} alt="${product.label}"`)
    : `<img ${attrs} src="${product.image}" alt="${product.label}" />`;
}

function money(value) {
  return value > 0 ? `$${value.toFixed(2).replace(/\.00$/, "")}` : boxUi("customQuote");
}

function boxPriceLabel(price) {
  const value = String(price || "");
  if (boxLang() === "pt") {
    if (/^from\s+/i.test(value)) return value.replace(/^from\s+/i, "a partir de ");
    if (/custom/i.test(value)) return boxUi("customQuote");
  }
  return value;
}

function cartItems() {
  return boxCart.map((item) => ({ ...item, product: productByKey(item.productKey) }));
}

function cartQuantity() {
  return boxCart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotalNumber() {
  return cartItems().reduce((sum, item) => sum + priceNumber(item.product.price) * item.quantity, 0);
}

function boxFulfillmentValue() {
  return new FormData(boxOrderForm).get("fulfillment") || "Pickup";
}

function isBoxDeliverySelected() {
  return /delivery|entrega/i.test(String(boxFulfillmentValue()));
}

function boxDeliveryFee() {
  return isBoxDeliverySelected() && activeBoxDeliveryQuote?.served && !hasBoxFreeDelivery()
    ? (activeBoxDeliveryQuote.feeCents || 0) / 100
    : 0;
}

function boxOrderTotalNumber() {
  return cartTotalNumber() + boxDeliveryFee();
}

function boxFreeDeliveryMinCents() {
  return Number(activeBoxDeliveryQuote?.tier?.freeMinCents || 0);
}

function hasBoxFreeDelivery() {
  const min = boxFreeDeliveryMinCents();
  return isBoxDeliverySelected() && activeBoxDeliveryQuote?.served && min > 0 && Math.round(cartTotalNumber() * 100) >= min;
}

function boxFreeDeliveryMinLabel() {
  const min = boxFreeDeliveryMinCents();
  return min > 0 && window.bkDelivery ? window.bkDelivery.moneyFromCents(min) : "";
}

function cartTotalText() {
  const items = cartItems();
  if (!items.length) return "$0";
  const total = cartTotalNumber();
  const hasCustom = items.some((item) => priceNumber(item.product.price) === 0);
  if (hasCustom && total > 0) return `${money(total)} + ${boxUi("customSuffix")}`;
  if (hasCustom) return boxUi("customQuote");
  return boxOrderTotalNumber() > 0 ? money(boxOrderTotalNumber()) : "$0";
}

function renderBoxDeliveryQuote(quote = activeBoxDeliveryQuote) {
  if (!boxDeliveryQuoteBox) return;
  const deliverySelected = isBoxDeliverySelected();
  boxDeliveryQuoteBox.classList.toggle("is-outside", !!quote && !quote.served);
  if (!deliverySelected) {
    boxDeliveryQuoteBox.innerHTML = `<strong>${boxUi("pickupFree")}</strong><span>${boxUi("deliveryHint")}</span>`;
    return;
  }
  if (!quote) {
    boxDeliveryQuoteBox.innerHTML = `<strong>${boxUi("enterZip")}</strong><span>${boxUi("quoteFrom")}</span>`;
    return;
  }
  if (quote.served) {
    const freeMin = boxFreeDeliveryMinLabel();
    const freeCopy = hasBoxFreeDelivery()
      ? boxUi("deliveryFreeUnlocked")
      : freeMin
        ? boxUi("deliveryFreeMin").replace("{amount}", freeMin)
        : "";
    const feeTitle = hasBoxFreeDelivery()
      ? boxUi("deliveryFreeUnlocked")
      : `${quote.feeLabel} ${boxUi("deliverySuffix")}`;
    boxDeliveryQuoteBox.innerHTML = `<strong>${feeTitle}</strong><span>${quote.zip} - ${quote.distanceMiles} mi ${boxUi("deliveryFromDanbury")} - ${quote.tier.label}${freeCopy ? ` - ${freeCopy}` : ""}</span>`;
    return;
  }
  boxDeliveryQuoteBox.innerHTML = `<strong>${boxUi("confirmation")}</strong><span>${quote.zip || ""} ${quote.distanceMiles ? `- ${quote.distanceMiles} mi` : ""} - ${boxUi("outsideRadiusMessage")}</span>`;
}

function checkBoxDeliveryZip() {
  if (!boxDeliveryZipInput || !window.bkDelivery) return null;
  const deliveryRadio = boxOrderForm?.querySelector('input[name="fulfillment"][value*="Delivery"], input[name="fulfillment"][value*="entrega"]');
  if (deliveryRadio && !deliveryRadio.checked) {
    deliveryRadio.checked = true;
  }
  const zip = window.bkDelivery.sanitizeZip(boxDeliveryZipInput.value);
  boxDeliveryZipInput.value = zip;
  activeBoxDeliveryQuote = window.bkDelivery.quoteByZip(zip);
  renderBoxDeliveryQuote(activeBoxDeliveryQuote);
  renderBoxDeliveryMap();
  refreshBoxCart();
  return activeBoxDeliveryQuote;
}

function setMinimumDate() {
  if (!boxDateInput) return;
  const date = new Date();
  date.setDate(date.getDate() + 2);
  const value = date.toISOString().slice(0, 10);
  boxDateInput.min = value;
  boxDateInput.value = value;
}

function updateHeaderWhatsApp() {
  const product = productByKey(activeProduct);
  waLinks.forEach((link) => {
    link.href = whatsappUrl(product.message);
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

function buildBoxMessage() {
  const data = new FormData(boxOrderForm);
  const notes = String(data.get("notes") || "").trim() || boxUi("fallbackNotes");
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const zip = String(data.get("deliveryZip") || "").trim();
  const address = String(data.get("deliveryAddress") || "").trim();
  const deliverySelected = isBoxDeliverySelected();
  const fulfillmentLine = deliverySelected ? boxUi("deliveryChoice") : boxUi("pickup");
  const deliveryLine = deliverySelected
    ? `${address || boxUi("addressPending")}${zip ? ` - ZIP ${zip}` : ""}`
    : boxUi("pickupLine");
  const feeLine = deliverySelected
    ? activeBoxDeliveryQuote?.served
      ? hasBoxFreeDelivery()
        ? boxUi("freeDeliveryFee")
        : activeBoxDeliveryQuote.feeLabel
      : boxUi("confirmWhatsapp")
    : "$0";
  const items = cartItems();
  const itemLines = items.length
    ? items
        .map((item) => {
          const priceValue = priceNumber(item.product.price) * item.quantity;
          const linePrice = priceValue > 0 ? money(priceValue) : boxPriceLabel(item.product.price);
          return `- ${item.quantity}x ${item.product.label} (${linePrice})`;
        })
        .join("\n")
    : `- ${boxUi("noItems")}`;

  return `${boxUi("intro")}

${boxUi("customer")}: ${name || boxUi("notFilled")}
${boxUi("whatsapp")}: ${phone || boxUi("notFilled")}
${boxUi("messageItems")}:
${itemLines}
${boxUi("preferredDate")}: ${data.get("date")}
${boxUi("preferredTime")}: ${data.get("time") || boxUi("fallbackTime")}
${boxUi("fulfillment")}: ${fulfillmentLine}
${boxUi("delivery")}: ${deliveryLine}
${boxUi("deliveryFee")}: ${feeLine}
${boxUi("estimatedTotal")}: ${cartTotalText()}
${boxUi("notes")}: ${notes}`;
}

function renderBoxCart() {
  if (!boxCartLines) return;

  const items = cartItems();
  boxCartLines.innerHTML = items
    .map((item) => {
      const priceValue = priceNumber(item.product.price) * item.quantity;
          const linePrice = priceValue > 0 ? money(priceValue) : boxPriceLabel(item.product.price);
      const lineImg = window.bkPicture
        ? window.bkPicture.html(item.product.image, `alt="${item.product.label}"`)
        : `<img src="${item.product.image}" alt="${item.product.label}" />`;
      return `
        <article class="box-cart-line" data-box-cart-product="${item.productKey}">
          ${lineImg}
          <div>
            <strong>${item.product.label}</strong>
            <small>${item.product.description}</small>
          </div>
          <div class="box-cart-actions">
            <div class="box-stepper">
              <button type="button" data-box-cart-quantity="minus" aria-label="Decrease ${item.product.label}">-</button>
              <b>${item.quantity}</b>
              <button type="button" data-box-cart-quantity="plus" aria-label="Increase ${item.product.label}">+</button>
            </div>
            <span>${linePrice}</span>
            <button type="button" data-box-cart-remove>${boxUi("remove")}</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (!items.length) {
    boxCartLines.innerHTML = `<div class="box-cart-empty">${boxUi("emptyCart")}</div>`;
  }

  const count = cartQuantity();
  if (boxCartCount) boxCartCount.textContent = boxUi("items", count);
  document.querySelectorAll("[data-bk-header]").forEach((item) => item.setAttribute("data-bk-cart-count", String(count)));
  if (boxCartTotal) boxCartTotal.textContent = cartTotalText();
  if (boxCartFloatingCount) boxCartFloatingCount.textContent = boxUi("items", count);
  if (boxCartFloatingTotal) boxCartFloatingTotal.textContent = cartTotalText();
  const floatingCart = boxCartFloatingCount?.closest(".box-cart-fab");
  if (floatingCart) floatingCart.hidden = count === 0;
}

function updateBoxOrder() {
  if (!boxOrderForm) return;
  const message = buildBoxMessage();
  if (boxMessagePreview) boxMessagePreview.textContent = message;
  if (boxOrderLink) boxOrderLink.href = whatsappUrl(message);
}

function saveBoxLeadSnapshot() {
  try {
    const data = new FormData(boxOrderForm);
    const leads = JSON.parse(window.localStorage.getItem("bp-leads") || "[]");
    const lead = {
      id: `lead-${Date.now()}`,
      source: "Box InHouse",
      status: "Novo lead",
      createdAt: new Date().toISOString(),
      date: data.get("date"),
      time: data.get("time") || boxUi("fallbackTime"),
      fulfillment: data.get("fulfillment"),
      total: cartTotalText(),
      items: cartItems().map((item) => `${item.quantity}x ${item.product.label}`),
      message: buildBoxMessage(),
      note: "Sem API: lead salvo antes de abrir o WhatsApp."
    };
    window.localStorage.setItem("bp-leads", JSON.stringify([lead, ...leads].slice(0, 80)));
  } catch {
    /* Mantém WhatsApp como prioridade se localStorage falhar. */
  }

  // Persiste na API (fire-and-forget — não bloqueia o redirect WA).
  if (window.bkApi) {
    try {
      const data = new FormData(boxOrderForm);
      const items = cartItems();
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      if (name && phone) {
        const lang = window.localStorage.getItem("bp-lang") === "pt" ? "pt" : "en";
        window.bkApi.createLead({
          name,
          phone,
          email: String(data.get("email") || "").trim() || undefined,
          productSlug: items[0]?.product?.slug || items[0]?.key,
          message: buildBoxMessage(),
          preferredLang: lang,
          consent: true,
        }).catch(() => { /* silencioso */ });
      }
    } catch { /* não bloqueia WA */ }
  }
}

function saveBoxLocalLead(status = "Novo lead") {
  try {
    const data = new FormData(boxOrderForm);
    const leads = JSON.parse(window.localStorage.getItem("bp-leads") || "[]");
    const lead = {
      id: `lead-${Date.now()}`,
      source: "Box InHouse",
      status,
      createdAt: new Date().toISOString(),
      date: data.get("date"),
      time: data.get("time") || boxUi("fallbackTime"),
      fulfillment: data.get("fulfillment"),
      total: cartTotalText(),
      items: cartItems().map((item) => `${item.quantity}x ${item.product.label}`),
      message: buildBoxMessage(),
      note: "Fallback local: confira a API para confirmar se o pedido entrou.",
    };
    window.localStorage.setItem("bp-leads", JSON.stringify([lead, ...leads].slice(0, 80)));
    return lead;
  } catch {
    return null;
  }
}

function boxRequestedForIso(dateValue) {
  return `${dateValue}T17:00:00-04:00`;
}

function boxSlug(productKey) {
  const map = {
    cups: "cups-tower",
    classicPudim: "classic-pudim",
    berryPudim: "berry-pudim",
    giftPudim: "gift-pudim",
    shrimp: "shrimp-tray",
    weekend: "weekend-family-box",
    beefRice: "beef-rice-box",
    fitGroundBeef: "fit-ground-beef-box",
    grilledChicken: "grilled-chicken-box",
    meatballPasta: "meatball-pasta-box",
    salmonMash: "salmon-mash-box",
    groundBeefRice: "ground-beef-rice-box",
    pizzaWaffle: "pizza-waffle",
    savoryPie: "savory-pie",
    shrimpPlatter: "shrimp-platter",
    cookieDuo: "cookie-duo",
    charcuterie: "charcuterie-board",
    luxuryHamper: "luxury-hamper",
    birthdayTray: "birthday-tray",
  };
  return map[productKey] || productKey;
}

function buildBoxLeadPayload() {
  const data = new FormData(boxOrderForm);
  const items = cartItems();
  const lang = window.localStorage.getItem("bp-lang") === "pt" ? "pt" : "en";
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim() || undefined,
    productSlug: boxSlug(items[0]?.productKey),
    message: buildBoxMessage(),
    preferredLang: lang,
    consent: true,
  };
}

function buildBoxOrderPayload() {
  const data = new FormData(boxOrderForm);
  const delivery = isBoxDeliverySelected();
  const lang = window.localStorage.getItem("bp-lang") === "pt" ? "pt" : "en";
  return {
    customer: {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim() || undefined,
      preferredLang: lang,
    },
    fulfillment: delivery ? "delivery" : "pickup",
    requestedFor: boxRequestedForIso(String(data.get("date") || "").trim()),
    requestedTz: "America/New_York",
    deliveryAddress: delivery ? String(data.get("deliveryAddress") || "").trim() : undefined,
    deliveryZip: delivery ? String(data.get("deliveryZip") || "").trim() : undefined,
    notes: String(data.get("notes") || "").trim() || undefined,
    items: cartItems().map((item) => ({
      productSlug: boxSlug(item.productKey),
      qty: item.quantity,
    })),
    consent: true,
  };
}

function saveBoxLocalOrderSnapshot(status = "requested") {
  try {
    const data = new FormData(boxOrderForm);
    const delivery = isBoxDeliverySelected();
    const lang = window.localStorage.getItem("bp-lang") === "pt" ? "pt" : "en";
    const orders = JSON.parse(window.localStorage.getItem("bp-local-orders") || "[]");
    const id = `local-${Date.now()}`;
    const order = {
      id,
      number: id.replace("local-", "L"),
      status,
      source: "Box InHouse",
      createdAt: new Date().toISOString(),
      requestedFor: boxRequestedForIso(String(data.get("date") || "").trim()),
      requestedTz: "America/New_York",
      fulfillment: delivery ? "delivery" : "pickup",
      deliveryAddress: delivery ? String(data.get("deliveryAddress") || "").trim() : "",
      deliveryZip: delivery ? String(data.get("deliveryZip") || "").trim() : "",
      customer: {
        name: String(data.get("name") || "").trim() || "Cliente",
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        preferredLang: lang,
      },
      items: cartItems().map((item) => ({
        productId: boxSlug(item.productKey),
        qty: item.quantity,
        product: { name: item.product.label },
      })),
      totalCents: Math.round(boxOrderTotalNumber() * 100),
      currency: "USD",
      message: buildBoxMessage(),
      notes: String(data.get("notes") || "").trim(),
    };
    window.localStorage.setItem("bp-local-orders", JSON.stringify([order, ...orders].slice(0, 120)));
    return order;
  } catch {
    return null;
  }
}

function validateBoxCheckout() {
  const data = new FormData(boxOrderForm);
  if (!cartItems().length) return boxUi("validationItem");
  if (!String(data.get("name") || "").trim()) return boxUi("validationName");
  if (!String(data.get("phone") || "").trim()) return boxUi("validationWhatsapp");
  if (!String(data.get("date") || "").trim()) return boxUi("validationDate");
  if (!window.bkIsValidPreorderDate(String(data.get("date") || ""))) return boxUi("validationLead");
  if (isBoxDeliverySelected()) {
    const zip = String(data.get("deliveryZip") || "").trim();
    const address = String(data.get("deliveryAddress") || "").trim();
    if (!zip) return boxUi("validationZip");
    if (!address) return boxUi("validationAddress");
    const quote = activeBoxDeliveryQuote?.zip === zip ? activeBoxDeliveryQuote : window.bkDelivery?.quoteByZip(zip);
    activeBoxDeliveryQuote = quote;
    renderBoxDeliveryQuote(quote);
    if (!quote?.served) return boxUi("validationZipConfirm");
  }
  return "";
}

async function submitBoxCheckout(event) {
  event.preventDefault();
  const error = validateBoxCheckout();
  if (error) {
    alert(error);
    return;
  }
  const originalText = boxOrderLink.textContent;
  boxOrderLink.setAttribute("aria-busy", "true");
  boxOrderLink.textContent = boxUi("sending");
  let message = buildBoxMessage();
  try {
    if (window.bkApi) {
      const order = await window.bkApi.createOrder(buildBoxOrderPayload());
      message = `${message}\n\nOrder: #${order.number}`;
    } else {
      saveBoxLocalOrderSnapshot("requested");
      saveBoxLocalLead("API offline");
    }
  } catch {
    try {
      if (window.bkApi) await window.bkApi.createLead(buildBoxLeadPayload());
    } catch {
      saveBoxLocalLead("API fallback");
    }
    saveBoxLocalOrderSnapshot("requested");
  } finally {
    boxOrderLink.removeAttribute("aria-busy");
    boxOrderLink.textContent = originalText;
  }
  window.location.href = whatsappUrl(message);
}

function renderProductControls() {
  if (!productSwitch) return;
  productSwitch.innerHTML = `
    ${Object.entries(boxProducts)
      .map(
        ([key, product]) => `
          <button type="button" data-box-menu-product="${key}" aria-controls="box-product-${key}">
            ${product.label}
          </button>
        `
      )
      .join("")}
  `;
  productButtons = [...document.querySelectorAll("[data-box-menu-product]")];
  renderBoxProductSelect();
}

function renderBoxProductSelect(selectedKey = boxProductSelect?.value || activeProduct) {
  if (!boxProductSelect) return;
  boxProductSelect.innerHTML = Object.entries(boxProducts)
    .map(([key, product]) => `<option value="${key}">${product.label} - ${boxPriceLabel(product.price)}</option>`)
    .join("");
  boxProductSelect.value = boxProducts[selectedKey] ? selectedKey : activeProduct;
  renderBoxCartProductPicker(boxProductSelect.value);
}

function renderBoxCartProductPicker(selectedKey = boxProductSelect?.value || activeProduct) {
  if (!boxProductSelect) return;
  const host = boxProductSelect.closest("label");
  if (!host) return;
  let picker = host.querySelector("[data-box-cart-product-picker]");
  if (!picker) {
    picker = document.createElement("div");
    picker.className = "box-cart-product-picker";
    picker.setAttribute("data-box-cart-product-picker", "");
    boxProductSelect.insertAdjacentElement("afterend", picker);
  }

  picker.innerHTML = Object.entries(boxProducts).map(([key, product]) => {
    const availability = boxAvailability(product);
    const active = key === selectedKey ? " is-active" : "";
    const image = boxPicture(product, 'class="box-cart-product-thumb" loading="lazy" decoding="async"');
    return `
      <button class="box-cart-product-choice${active}" type="button" data-box-cart-pick-product="${key}">
        ${image}
        <span>
          <strong>${product.label}</strong>
          <small>${boxPriceLabel(product.price)} - ${availability.label}</small>
        </span>
      </button>
    `;
  }).join("");
}

function renderProductCatalog() {
  if (!productCatalog) return;
  productCatalog.innerHTML = Object.entries(boxProducts)
    .map(
      ([key, product]) => {
        const availability = boxAvailability(product);
        const catImg = boxPicture(product, 'loading="lazy" decoding="async"');
        return `
        <article class="box-catalog-card" id="box-product-${key}" data-box-card="${key}" data-availability="${availability.mode}">
          <div class="box-catalog-media">${catImg}</div>
          <div>
            <span>${product.tag}</span>
            <strong>${product.label}</strong>
            <p>${product.description}</p>
            <small>${boxPriceLabel(product.price)} - ${availability.label}</small>
            <button class="box-button box-button-dark" type="button" data-box-add-product="${key}">${availability.action}</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function refreshBoxCart() {
  renderBoxCart();
  updateBoxOrder();
}

function addBoxToCart(productKey = activeProduct, quantity = 1, scrollToCart = true) {
  const key = boxProducts[productKey] ? productKey : "cups";
  const amount = Math.max(1, Number(quantity) || 1);
  const existing = boxCart.find((item) => item.productKey === key);
  if (existing) {
    existing.quantity += amount;
  } else {
    boxCart.push({ productKey: key, quantity: amount });
  }
  refreshBoxCart();
  if (scrollToCart) {
    // Aciona o cart drawer universal (cart-drawer.js escuta a classe no body)
    document.body.classList.add("box-cart-open");
  }
}

function setBoxCartQuantity(productKey, quantity) {
  const amount = Math.max(0, Number(quantity) || 0);
  boxCart = boxCart
    .map((item) => (item.productKey === productKey ? { ...item, quantity: amount } : item))
    .filter((item) => item.quantity > 0);
  refreshBoxCart();
}

function setProduct(productKey) {
  const product = productByKey(productKey);
  activeProduct = boxProducts[productKey] ? productKey : "cups";

  productButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.boxMenuProduct === activeProduct);
  });

  if (mainImage) {
    mainImage.style.opacity = "0";
    window.setTimeout(() => {
      if (window.bkPicture) {
        window.bkPicture.swap(mainImage, product.image);
      } else {
        mainImage.src = product.image;
      }
      mainImage.style.opacity = "1";
    }, 160);
  }

  if (title) title.textContent = product.title;
  if (description) description.textContent = product.description;
  if (price) price.textContent = boxPriceLabel(product.price);
  if (currentLabel) currentLabel.textContent = product.label;
  if (currentPrice) currentPrice.textContent = boxPriceLabel(product.price);
  if (boxProductSelect && boxProducts[activeProduct]) boxProductSelect.value = activeProduct;
  updateHeaderWhatsApp();
}

let menuFocusTimer = 0;

function highlightMenuProduct(productKey) {
  if (!boxProducts[productKey]) return;

  productButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.boxMenuProduct === productKey);
  });

  document.querySelectorAll("[data-box-card]").forEach((card) => {
    card.classList.toggle("is-focused", card.dataset.boxCard === productKey);
  });

  window.clearTimeout(menuFocusTimer);
  menuFocusTimer = window.setTimeout(() => {
    document.querySelectorAll(".box-catalog-card.is-focused").forEach((card) => {
      card.classList.remove("is-focused");
    });
  }, 1400);
}

function focusMenuProduct(productKey) {
  const card = document.querySelector(`[data-box-card="${productKey}"]`);
  highlightMenuProduct(productKey);
  if (!card) return;

  const offset = window.innerWidth <= 620 ? 118 : 150;
  const top = card.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const addProductButton = event.target.closest("[data-box-add-product]");
  if (addProductButton) {
    const key = addProductButton.dataset.boxAddProduct;
    highlightMenuProduct(key);
    addBoxToCart(key, 1, true);
    return;
  }

  const productButton = event.target.closest("[data-box-menu-product]");
  if (productButton) {
    const key = productButton.dataset.boxMenuProduct;
    focusMenuProduct(key);
    return;
  }

  const addSelected = event.target.closest("[data-box-add-selected]");
  if (addSelected) {
    addBoxToCart(boxProductSelect?.value || activeProduct, 1, true);
    return;
  }

  const cartPickProduct = event.target.closest("[data-box-cart-pick-product]");
  if (cartPickProduct) {
    const key = cartPickProduct.dataset.boxCartPickProduct;
    if (boxProductSelect && boxProducts[key]) boxProductSelect.value = key;
    highlightMenuProduct(key);
    renderBoxProductSelect(key);
    return;
  }

  const addCurrent = event.target.closest("[data-box-add-current]");
  if (addCurrent) {
    addBoxToCart(activeProduct, 1, !addCurrent.closest(".box-cart-panel"));
    return;
  }

  if (event.target.closest("[data-box-hero-add]")) {
    addBoxToCart(activeProduct, 1, true);
    return;
  }

  const cartQuantityButton = event.target.closest("[data-box-cart-quantity]");
  if (cartQuantityButton) {
    const line = cartQuantityButton.closest("[data-box-cart-product]");
    const item = boxCart.find((cartItem) => cartItem.productKey === line?.dataset.boxCartProduct);
    if (!item) return;
    const direction = cartQuantityButton.dataset.boxCartQuantity === "plus" ? 1 : -1;
    setBoxCartQuantity(item.productKey, item.quantity + direction);
    return;
  }

  const removeButton = event.target.closest("[data-box-cart-remove]");
  if (removeButton) {
    const line = removeButton.closest("[data-box-cart-product]");
    if (line) setBoxCartQuantity(line.dataset.boxCartProduct, 0);
  }
});

boxOrderForm?.addEventListener("input", () => {
  renderBoxDeliveryQuote();
  updateBoxOrder();
});
boxOrderForm?.addEventListener("change", () => {
  renderBoxDeliveryQuote();
  updateBoxOrder();
});
boxProductSelect?.addEventListener("change", () => {
  highlightMenuProduct(boxProductSelect.value);
  renderBoxProductSelect(boxProductSelect.value);
});
boxDeliveryCheckButton?.addEventListener("click", checkBoxDeliveryZip);
boxDeliveryZipInput?.addEventListener("blur", checkBoxDeliveryZip);
boxOrderLink?.addEventListener("click", submitBoxCheckout);

window.addEventListener(
  "pointermove",
  (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 42;
    const y = (event.clientY / window.innerHeight - 0.5) * 34;
    document.documentElement.style.setProperty("--box-mx", `${x.toFixed(2)}px`);
    document.documentElement.style.setProperty("--box-my", `${y.toFixed(2)}px`);
  },
  { passive: true }
);

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = scrollable > 0 ? scrollTop / scrollable : 0;
  document.documentElement.style.setProperty("--box-scroll", `${scrollTop.toFixed(2)}px`);
  if (progress) progress.style.transform = `scaleX(${progressValue})`;
  header?.classList.toggle("is-scrolled", scrollTop > 12);
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

renderProductControls();
renderProductCatalog();
function renderBoxDeliveryMap() {
  if (boxServiceMap && window.bkDelivery) {
    window.bkDelivery.renderServiceMap(boxServiceMap, { zip: boxDeliveryZipInput?.value, reset: true });
  }
}

renderBoxDeliveryMap();
document.addEventListener("bk:delivery-settings-loaded", () => {
  activeBoxDeliveryQuote = boxDeliveryZipInput?.value ? window.bkDelivery?.quoteByZip(boxDeliveryZipInput.value) : null;
  renderBoxDeliveryQuote(activeBoxDeliveryQuote);
  renderBoxDeliveryMap();
  refreshBoxCart();
});
document.addEventListener("bk:cart-opened", () => {
  window.setTimeout(renderBoxDeliveryMap, 140);
});
setMinimumDate();
setProduct(activeProduct);
refreshBoxCart();
updateScrollEffects();
