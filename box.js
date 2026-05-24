const BOX_WA_PHONE = (window.BK_CONFIG && window.BK_CONFIG.waPhone) || "15551234567";

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
  if (typeof renderProductCatalog === "function") renderProductCatalog();
  if (typeof setProduct === "function" && typeof activeProduct !== "undefined") setProduct(activeProduct);
  if (typeof refreshBoxCart === "function") refreshBoxCart();
});

let productButtons = [...document.querySelectorAll("[data-box-product]")];
const productSwitch = document.querySelector("[data-box-product-switch]");
const productCatalog = document.querySelector("[data-box-product-catalog]");
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
const boxOrderLink = document.querySelector("[data-box-order]");
const boxMessagePreview = document.querySelector("[data-box-message-preview]");
const boxDateInput = document.querySelector("[data-box-date]");

let activeProduct = "cups";
let boxCart = [{ productKey: "cups", quantity: 1 }];

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

function money(value) {
  return value > 0 ? `$${value.toFixed(2).replace(/\.00$/, "")}` : "custom quote";
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

function cartTotalText() {
  const items = cartItems();
  const total = cartTotalNumber();
  const hasCustom = items.some((item) => priceNumber(item.product.price) === 0);
  if (hasCustom && total > 0) return `${money(total)} + custom`;
  if (hasCustom) return "custom quote";
  return money(total);
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
  const notes = String(data.get("notes") || "").trim() || "No notes yet";
  const items = cartItems();
  const itemLines = items.length
    ? items
        .map((item) => {
          const priceValue = priceNumber(item.product.price) * item.quantity;
          const linePrice = priceValue > 0 ? money(priceValue) : item.product.price;
          return `- ${item.quantity}x ${item.product.label} (${linePrice})`;
        })
        .join("\n")
    : "- No items selected";

  return `Hi! I would like to request a Box InHouse preorder.

Items:
${itemLines}
Preferred date: ${data.get("date")}
Preferred time: ${data.get("time") || "Owner can suggest the best window"}
Fulfillment: ${data.get("fulfillment")}
Estimated total: ${cartTotalText()}
Notes: ${notes}`;
}

function renderBoxCart() {
  if (!boxCartLines) return;

  const items = cartItems();
  boxCartLines.innerHTML = items
    .map((item) => {
      const priceValue = priceNumber(item.product.price) * item.quantity;
      const linePrice = priceValue > 0 ? money(priceValue) : item.product.price;
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
            <button type="button" data-box-cart-remove>Remove</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (!items.length) {
    boxCartLines.innerHTML = `<div class="box-cart-empty">Add boxes from the menu to organize the preorder.</div>`;
  }

  if (boxCartCount) boxCartCount.textContent = `${cartQuantity()} items`;
  if (boxCartTotal) boxCartTotal.textContent = cartTotalText();
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
      time: data.get("time") || "Owner can suggest the best window",
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

function renderProductControls() {
  if (!productSwitch) return;
  productSwitch.innerHTML = `
    ${Object.entries(boxProducts)
      .map(
        ([key, product]) => `
          <button type="button" data-box-product="${key}">
            ${product.label}
          </button>
        `
      )
      .join("")}
    <button class="box-product-add" type="button" data-box-add-current>Add selected</button>
  `;
  productButtons = [...document.querySelectorAll("[data-box-product]")];
}

function renderProductCatalog() {
  if (!productCatalog) return;
  productCatalog.innerHTML = Object.entries(boxProducts)
    .map(
      ([key, product]) => {
        const catImg = window.bkPicture
          ? window.bkPicture.html(product.image, `alt="${product.label}" loading="lazy"`)
          : `<img src="${product.image}" alt="${product.label}" loading="lazy" />`;
        return `
        <article class="box-catalog-card" data-box-card="${key}">
          ${catImg}
          <div>
            <span>${product.tag}</span>
            <strong>${product.label}</strong>
            <p>${product.description}</p>
            <small>${product.price}</small>
            <button class="box-button box-button-dark" type="button" data-box-product="${key}">Choose</button>
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
    button.classList.toggle("is-active", button.dataset.boxProduct === activeProduct);
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
  if (price) price.textContent = product.price;
  if (currentLabel) currentLabel.textContent = product.label;
  if (currentPrice) currentPrice.textContent = product.price;
  updateHeaderWhatsApp();
}

document.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-box-product]");
  if (productButton) {
    const key = productButton.dataset.boxProduct;
    setProduct(key);
    // Qualquer click num chip/card de produto adiciona ao cart e abre o drawer
    addBoxToCart(key, 1, true);
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

boxOrderForm?.addEventListener("input", updateBoxOrder);
boxOrderForm?.addEventListener("change", updateBoxOrder);
boxOrderLink?.addEventListener("click", saveBoxLeadSnapshot);

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
setMinimumDate();
setProduct(activeProduct);
refreshBoxCart();
updateScrollEffects();
