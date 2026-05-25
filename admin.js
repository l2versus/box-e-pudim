const ADMIN_WA_PHONE = (window.BK_CONFIG && window.BK_CONFIG.waPhone) || "12034822797";

const body = document.body;
const loginForm = document.querySelector("[data-login-form]");
const adminApp = document.querySelector("[data-admin-app]");
const toast = document.querySelector("[data-toast]");
const acceptingToggle = document.querySelector("[data-accepting-toggle]");
const acceptingCopy = document.querySelector("[data-accepting-copy]");
const openOrders = document.querySelector("[data-open-orders]");
const capacityLeft = document.querySelector("[data-capacity-left]");
const productForm = document.querySelector("[data-product-form]");
const productList = document.querySelector("[data-product-list]");
const productSubmit = document.querySelector("[data-product-submit]");
const productCancel = document.querySelector("[data-product-cancel]");
const productReset = document.querySelector("[data-product-reset]");
const productsActive = document.querySelector("[data-products-active]");
const productsReady = document.querySelector("[data-products-ready]");
const productsPreorder = document.querySelector("[data-products-preorder]");
const leadList = document.querySelector("[data-lead-list]");

const isProductionAdmin = () => Boolean(window.bkApi && window.BK_CONFIG?.adminMode !== "demo");

const statusFlow = [
  { key: "requested", label: "Solicitado", action: "Avancar" },
  { key: "paid", label: "Pago", action: "Avancar" },
  { key: "production", label: "Producao", action: "Avancar" },
  { key: "ready", label: "Pronto", action: "Finalizar" },
  { key: "delivered", label: "Entregue", action: "Reabrir" }
];

let acceptingOrders = true;
let toastTimer;
let adminProducts = loadProducts();
let adminLeads = loadLeads();

const productImages = {
  Pudim: "assets/img/products/product-classic-pudim.png",
  "Box InHouse": "assets/img/products/product-dessert-cups.png",
  Doces: "assets/img/lifestyle/sweets-photo.png",
  Salgados: "assets/img/products/product-shrimp-tray.png",
  Eventos: "assets/img/events/event-berry-cake.png"
};

const CATEGORY_TO_API = {
  Pudim: "pudim",
  Doces: "sweet",
  "Box InHouse": "box",
  Salgados: "tray",
  Eventos: "gift"
};

const API_TO_CATEGORY = {
  pudim: "Pudim",
  sweet: "Doces",
  box: "Box InHouse",
  tray: "Salgados",
  gift: "Eventos"
};

function defaultProducts() {
  return [
    {
      id: "classic-pudim",
      name: "Pudim classico",
      category: "Pudim",
      storefront: "Brazilian Pudding",
      description: "Pudim classico de caramelo para retirada por encomenda.",
      price: 28,
      quantity: 9,
      saleType: "Sob encomenda",
      leadTime: "48h",
      image: "assets/img/products/product-classic-pudim.png",
      active: true
    },
    {
      id: "gift-box",
      name: "Gift box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Cups em camadas para presente, escritorio e fim de semana.",
      price: 34,
      quantity: 12,
      saleType: "Ambos",
      leadTime: "48h",
      image: "assets/img/products/product-dessert-cups.png",
      active: true
    },
    {
      id: "shrimp-tray",
      name: "Camarao crocante",
      category: "Salgados",
      storefront: "Box InHouse",
      description: "Camarao crocante com batata palha, preparado por agenda.",
      price: 56,
      quantity: 6,
      saleType: "Pronta entrega",
      leadTime: "sabado",
      image: "assets/img/products/product-shrimp-tray.png",
      active: true
    },
    {
      id: "party-sweets",
      name: "Docinhos festa",
      category: "Doces",
      storefront: "Brazilian Pudding",
      description: "Docinhos e sobremesas planejados para festas e eventos.",
      price: 0,
      quantity: 20,
      saleType: "Sob encomenda",
      leadTime: "3 a 5 dias",
      image: "assets/img/lifestyle/sweets-photo.png",
      active: true
    },
    {
      id: "berry-celebration-cake",
      name: "Berry celebration cake",
      category: "Eventos",
      storefront: "Brazilian Pudding",
      description: "Bolo premium com creme, frutas vermelhas e acabamento para aniversario.",
      price: 82,
      quantity: 4,
      saleType: "Sob encomenda",
      leadTime: "3 a 5 dias",
      image: "assets/img/events/event-berry-cake.png",
      active: true
    },
    {
      id: "cookie-gift-duo",
      name: "Cookie gift duo",
      category: "Doces",
      storefront: "Brazilian Pudding",
      description: "Caixa com cookies artesanais para presente, reuniao ou pedido extra.",
      price: 18,
      quantity: 12,
      saleType: "Ambos",
      leadTime: "24 a 48h",
      image: "assets/img/events/event-cookie-duo.png",
      active: true
    },
    {
      id: "charcuterie-event-board",
      name: "Charcuterie board",
      category: "Eventos",
      storefront: "Brazilian Pudding",
      description: "Tabua de frios, queijos, frutas e geleia para eventos e presentes.",
      price: 110,
      quantity: 3,
      saleType: "Sob encomenda",
      leadTime: "3 a 5 dias",
      image: "assets/img/events/event-charcuterie-board.png",
      active: true
    },
    {
      id: "love-gift-box",
      name: "Love gift box",
      category: "Eventos",
      storefront: "Brazilian Pudding",
      description: "Box romantico com doces, balao e embalagem premium para presente.",
      price: 95,
      quantity: 3,
      saleType: "Sob encomenda",
      leadTime: "3 a 5 dias",
      image: "assets/img/events/event-love-gift-box.png",
      active: true
    },
    {
      id: "birthday-breakfast-tray",
      name: "Birthday breakfast tray",
      category: "Eventos",
      storefront: "Brazilian Pudding",
      description: "Bandeja de aniversario com salgados, bebidas e decoracao personalizada.",
      price: 125,
      quantity: 2,
      saleType: "Sob encomenda",
      leadTime: "5 dias",
      image: "assets/img/events/event-birthday-pink-tray.png",
      active: true
    },
    {
      id: "beef-rice-box",
      name: "Beef rice box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Box individual com arroz, carne cozida, legumes e finalizacao fresca.",
      price: 24,
      quantity: 10,
      saleType: "Ambos",
      leadTime: "agenda semanal",
      image: "assets/img/boxes/box-beef-rice.png",
      active: true
    },
    {
      id: "fit-ground-beef-box",
      name: "Fit ground beef box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Box equilibrado com arroz, carne moida, legumes e tempero brasileiro.",
      price: 23,
      quantity: 10,
      saleType: "Ambos",
      leadTime: "agenda semanal",
      image: "assets/img/boxes/box-fit-ground-beef.png",
      active: true
    },
    {
      id: "grilled-chicken-box",
      name: "Grilled chicken box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Frango grelhado com arroz e acompanhamentos para pickup programado.",
      price: 24,
      quantity: 10,
      saleType: "Ambos",
      leadTime: "agenda semanal",
      image: "assets/img/boxes/box-grilled-chicken.png",
      active: true
    },
    {
      id: "meatball-pasta-box",
      name: "Meatball pasta box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Massa com almondegas, molho vermelho e queijo, vendida por agenda.",
      price: 22,
      quantity: 8,
      saleType: "Sob encomenda",
      leadTime: "48h",
      image: "assets/img/boxes/box-meatball-pasta.png",
      active: true
    },
    {
      id: "salmon-mash-box",
      name: "Salmon mash box",
      category: "Box InHouse",
      storefront: "Box InHouse",
      description: "Salmao com pure cremoso e brocolis para encomenda premium.",
      price: 32,
      quantity: 6,
      saleType: "Sob encomenda",
      leadTime: "48h",
      image: "assets/img/boxes/box-salmon-mash.png",
      active: true
    },
    {
      id: "pizza-waffle",
      name: "Pizza waffle",
      category: "Salgados",
      storefront: "Box InHouse",
      description: "Salgado prensado com recheio de pizza para evento ou lanche.",
      price: 12,
      quantity: 18,
      saleType: "Ambos",
      leadTime: "24 a 48h",
      image: "assets/img/boxes/box-pizza-waffle.png",
      active: true
    },
    {
      id: "savory-pie",
      name: "Torta salgada",
      category: "Salgados",
      storefront: "Box InHouse",
      description: "Torta salgada familiar coberta com batata palha para encomenda.",
      price: 58,
      quantity: 5,
      saleType: "Sob encomenda",
      leadTime: "48h",
      image: "assets/img/boxes/box-savory-pie.png",
      active: true
    },
    {
      id: "shrimp-platter",
      name: "Shrimp party platter",
      category: "Salgados",
      storefront: "Box InHouse",
      description: "Travessa de camarao crocante com molho, ideal para compartilhar.",
      price: 68,
      quantity: 5,
      saleType: "Sob encomenda",
      leadTime: "48h",
      image: "assets/img/boxes/box-shrimp-platter.png",
      active: true
    }
  ];
}

function loadProducts() {
  if (isProductionAdmin()) return [];
  try {
    const saved = window.localStorage.getItem("bp-admin-products");
    if (!saved) return defaultProducts();
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaultProducts();
    const defaults = defaultProducts();
    const savedIds = new Set(parsed.map((product) => product.id));
    return [...parsed, ...defaults.filter((product) => !savedIds.has(product.id))];
  } catch {
    return defaultProducts();
  }
}

function saveProducts() {
  if (isProductionAdmin()) return;
  window.localStorage.setItem("bp-admin-products", JSON.stringify(adminProducts));
}

function defaultLeads() {
  return [
    {
      id: "demo-lead-pudim",
      source: "Brazilian Pudding",
      status: "Novo lead",
      createdAt: new Date().toISOString(),
      date: "2026-05-02",
      time: "Saturday, 5-7 PM",
      fulfillment: "Pickup",
      total: "$56",
      items: ["2x Classic Brazilian Pudim"],
      message: "Hi! I would like to request a preorder.\n\nItems:\n- 2x Classic Brazilian Pudim ($56)",
      note: "Demo: em producao esse lead vem do carrinho antes do WhatsApp."
    },
    {
      id: "demo-lead-box",
      source: "Box InHouse",
      status: "Aguardando pagamento",
      createdAt: new Date().toISOString(),
      date: "2026-05-03",
      time: "Owner can suggest the best window",
      fulfillment: "Delivery request",
      total: "custom quote",
      items: ["1x Birthday Tray"],
      message: "Hi! I would like to request a Box InHouse preorder.\n\nItems:\n- 1x Birthday Tray",
      note: "Conversa completa exige WhatsApp Business Cloud API + webhook."
    }
  ];
}

function loadLeads() {
  if (isProductionAdmin()) return [];
  try {
    const saved = window.localStorage.getItem("bp-leads");
    return saved ? JSON.parse(saved) : defaultLeads();
  } catch {
    return defaultLeads();
  }
}

function money(value) {
  const number = Number(value || 0);
  return number > 0 ? `$${number.toFixed(2).replace(/\.00$/, "")}` : "sob consulta";
}

function productImage(product) {
  return product.image || productImages[product.category] || "assets/img/lifestyle/pudding-photo.png";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function slugify(value) {
  return String(value || "product")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || `product-${Date.now()}`;
}

function storeFromCategory(category) {
  return ["box", "tray"].includes(category) ? "Box InHouse" : "Brazilian Pudding";
}

function adminProductFromApi(product) {
  const category = API_TO_CATEGORY[product.category] || "Eventos";
  return {
    id: product.id,
    apiId: product.id,
    slug: product.slug,
    name: product.name,
    category,
    storefront: storeFromCategory(product.category),
    description: product.description || "",
    price: Number(product.priceCents || 0) / 100,
    quantity: Number(product.maxQtyPerDay || (product.category === "pudim" ? 10 : 14)),
    saleType: "Sob encomenda",
    leadTime: `${Number(product.leadTimeHours || 48)}h`,
    image: product.imageUrl || productImages[category],
    active: Boolean(product.active && !product.paused),
    backendCategory: product.category,
    sortOrder: product.sortOrder || 0
  };
}

function productToApiPayload(product) {
  const category = CATEGORY_TO_API[product.category] || product.backendCategory || "gift";
  return {
    slug: product.slug || slugify(product.name),
    category,
    name: product.name,
    description: product.description || undefined,
    priceCents: Math.max(0, Math.round(Number(product.price || 0) * 100)),
    imageUrl: product.image || undefined,
    active: Boolean(product.active),
    paused: !product.active,
    leadTimeHours: parseInt(String(product.leadTime || "48").match(/\d+/)?.[0] || "48", 10),
    maxQtyPerDay: Math.max(0, Math.round(Number(product.quantity || 0))) || undefined,
    sortOrder: product.sortOrder || 0
  };
}

async function refreshProductsFromApi(options = {}) {
  if (!isProductionAdmin()) return false;
  try {
    const res = await window.bkApi.adminListProducts();
    adminProducts = (res?.products || []).map(adminProductFromApi);
    renderProducts();
    if (!options.silent) showToast("Produtos sincronizados com a API.");
    return true;
  } catch {
    if (!options.silent) showToast("Nao consegui carregar produtos da API.");
    return false;
  }
}

function leadFromApi(lead) {
  return {
    id: lead.id,
    source: `API - ${lead.source || "site"}`,
    status: lead.status === "new" ? "Novo lead" : lead.status,
    createdAt: lead.createdAt,
    date: "",
    time: "",
    fulfillment: "",
    total: "",
    items: lead.productSlug ? [lead.productSlug] : ["Lead sem produto"],
    message: lead.message || "",
    note: "",
    phone: lead.phone,
    email: lead.email,
  };
}

async function refreshLeadsFromApi() {
  if (!isProductionAdmin()) return false;
  try {
    const res = await window.bkApi.adminListLeads({ pageSize: 50 });
    adminLeads = (res?.leads || []).map(leadFromApi);
    renderLeads();
    return true;
  } catch {
    return false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function unlockDashboard() {
  body.classList.add("is-unlocked");
  adminApp.setAttribute("aria-hidden", "false");
  showToast("Painel desbloqueado.");
  refreshProductsFromApi({ silent: true });
  refreshLeadsFromApi();
}

function lockDashboard() {
  body.classList.remove("is-unlocked");
  adminApp.setAttribute("aria-hidden", "true");
}

function statusIndex(key) {
  return statusFlow.findIndex((status) => status.key === key);
}

function applyOrderStatus(card, next) {
  const pill = card.querySelector(".status-pill");
  const button = card.querySelector("[data-next-status]");
  card.dataset.status = next.key;
  pill.className = `status-pill ${next.key}`;
  pill.textContent = next.label;
  button.textContent = next.action;
}

function updateOrderCounts() {
  const activeCards = [...document.querySelectorAll("[data-status]")].filter(
    (card) => card.dataset.status !== "delivered"
  );
  openOrders.textContent = activeCards.length;
}

function updateCapacitySummary() {
  const puddings = Number(document.querySelector('[data-capacity-slider="puddings"]').value);
  const boxes = Number(document.querySelector('[data-capacity-slider="boxes"]').value);
  const reserved = 16;
  capacityLeft.textContent = Math.max(0, puddings + boxes - reserved);
}

function renderProducts() {
  if (!productList) return;

  if (!adminProducts.length) {
    productList.innerHTML = `<div class="lead-empty">Nenhum produto carregado ainda. Entre no painel e sincronize a API.</div>`;
    productsActive.textContent = "0";
    productsReady.textContent = "0";
    productsPreorder.textContent = "0";
    return;
  }

  productList.innerHTML = adminProducts
    .map((product) => {
      const availability = Number(product.quantity) <= 0 ? "Esgotado" : `${product.quantity} vagas`;
      const storefront = product.storefront || product.category || "Cardapio";
      const description = product.description || "Sem descricao cadastrada";
      const paused = product.active ? "" : " is-paused";
      const soldOut = Number(product.quantity) <= 0 ? " is-sold-out" : "";
      const imgSrc = productImage(product);
      const rowImg = window.bkPicture
        ? window.bkPicture.html(imgSrc, `alt="${escapeHtml(product.name)}" loading="lazy"`)
        : `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(product.name)}" loading="lazy" />`;
      return `
        <article class="product-control product-row${paused}${soldOut}" data-product-id="${escapeHtml(product.id)}">
          ${rowImg}
          <div class="product-info">
            <span class="product-row-top">
              <strong>${escapeHtml(product.name)}</strong>
              <b>${escapeHtml(money(product.price))}</b>
            </span>
            <small>${escapeHtml(storefront)} - ${escapeHtml(product.category)} - ${escapeHtml(availability)} - ${escapeHtml(product.leadTime || "sem prazo definido")}</small>
            <small>${escapeHtml(description)}</small>
            <span class="product-badges">
              <em>${escapeHtml(product.saleType)}</em>
              <em>${escapeHtml(storefront)}</em>
              <em>${product.active ? "Ativo" : "Pausado"}</em>
            </span>
          </div>
          <div class="product-row-actions">
            <label class="product-switch">
              <input type="checkbox" ${product.active ? "checked" : ""} data-product-active />
              <span>${product.active ? "On" : "Off"}</span>
            </label>
            <button type="button" data-product-edit>Editar</button>
          </div>
        </article>
      `;
    })
    .join("");

  productsActive.textContent = adminProducts.filter((product) => product.active).length;
  productsReady.textContent = adminProducts.filter(
    (product) => product.active && ["Pronta entrega", "Ambos"].includes(product.saleType)
  ).length;
  productsPreorder.textContent = adminProducts.filter(
    (product) => product.active && ["Sob encomenda", "Ambos"].includes(product.saleType)
  ).length;
}

function renderLeads() {
  if (!leadList) return;
  if (!adminLeads.length) {
    leadList.innerHTML = `<div class="lead-empty">Nenhum lead salvo ainda. Quando o cliente enviar o carrinho para WhatsApp, o pedido fica registrado aqui primeiro.</div>`;
    return;
  }

  leadList.innerHTML = adminLeads
    .map((lead) => {
      const created = lead.createdAt ? new Date(lead.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Sem data";
      const items = Array.isArray(lead.items) ? lead.items.join(", ") : "Sem itens";
      const waTarget = digitsOnly(lead.phone) || ADMIN_WA_PHONE;
      const message = lead.message || lead.note || "Sem mensagem salva";
      return `
        <article>
          <div>
            <span>${escapeHtml(lead.status || "Novo lead")} - ${escapeHtml(lead.source || "Site")} - ${escapeHtml(created)}</span>
            <strong>${escapeHtml(items)}</strong>
            <p>${escapeHtml(lead.fulfillment || "Forma nao informada")} - ${escapeHtml(lead.date || "sem data")} - ${escapeHtml(lead.time || "sem horario")} - ${escapeHtml(lead.total || "sem total")}</p>
            <pre>${escapeHtml(message)}</pre>
          </div>
          <a href="https://wa.me/${escapeHtml(waTarget)}" target="_blank" rel="noreferrer">Responder</a>
        </article>
      `;
    })
    .join("");
}

function clearProductForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  productForm.elements.active.checked = true;
  productSubmit.textContent = "Adicionar produto";
  productCancel.hidden = true;
}

function fillProductForm(product) {
  productForm.elements.id.value = product.id;
  productForm.elements.name.value = product.name;
  productForm.elements.category.value = product.category;
  productForm.elements.storefront.value = product.storefront || "Brazilian Pudding";
  productForm.elements.price.value = product.price;
  productForm.elements.quantity.value = product.quantity;
  productForm.elements.saleType.value = product.saleType;
  productForm.elements.leadTime.value = product.leadTime;
  productForm.elements.description.value = product.description || "";
  productForm.elements.image.value = product.image;
  productForm.elements.active.checked = product.active;
  productSubmit.textContent = "Salvar produto";
  productCancel.hidden = false;
  productForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function productFromForm() {
  const form = new FormData(productForm);
  const category = form.get("category");
  const saleType = form.get("saleType");
  const fallbackLeadTime = saleType === "Pronta entrega" ? "hoje" : "48h";
  const id = form.get("id") || `product-${Date.now()}`;
  const existing = adminProducts.find((item) => item.id === id);

  return {
    id,
    apiId: existing?.apiId,
    slug: existing?.slug,
    sortOrder: existing?.sortOrder || 0,
    name: String(form.get("name") || "").trim(),
    category,
    storefront: String(form.get("storefront") || "Brazilian Pudding").trim(),
    description: String(form.get("description") || "").trim(),
    price: Number(form.get("price") || 0),
    quantity: Number(form.get("quantity") || 0),
    saleType,
    leadTime: String(form.get("leadTime") || fallbackLeadTime).trim(),
    image: String(form.get("image") || productImages[category] || "").trim(),
    active: form.get("active") === "on"
  };
}

// Login real via API (substitui o "qualquer credencial entra" anterior).
// Fallback pra modo demo se API ausente OU adminMode === 'demo' no config.
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = String(data.get("owner") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn?.textContent;

  const useApi = window.bkApi && (!window.BK_CONFIG || window.BK_CONFIG.adminMode !== "demo");

  if (!useApi) {
    // Modo demo (sem backend): mantém comportamento legacy
    unlockDashboard();
    return;
  }

  if (!email || !password) {
    showToast("Preencha email e senha.");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";
  }

  try {
    await window.bkApi.adminLogin(email, password);
    unlockDashboard();
    showToast(`Bem-vinda, ${email}.`);
  } catch (err) {
    const msg =
      err?.status === 401
        ? "Email ou senha inválidos."
        : err?.status === 429
          ? "Muitas tentativas. Aguarde um minuto."
          : err?.code === "network_error"
            ? "API offline — confira se o backend está rodando."
            : "Erro ao entrar. Tente novamente.";
    showToast(msg);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel || "Entrar no painel";
    }
  }
});

// Logout real (limpa cookie do servidor além do estado local)
document.addEventListener("click", async (event) => {
  if (!event.target.closest("[data-lock-admin]")) return;
  if (window.bkApi && window.BK_CONFIG?.adminMode !== "demo") {
    try {
      await window.bkApi.adminLogout();
    } catch {
      /* mesmo se falhar, faz logout local */
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-lock-admin]")) {
    lockDashboard();
    return;
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("is-active", button === filter);
    });
    const value = filter.dataset.filter;
    document.querySelectorAll(".order-card").forEach((card) => {
      const visible = value === "all" || card.dataset.status === value;
      card.hidden = !visible;
    });
    return;
  }

  const nextButton = event.target.closest("[data-next-status]");
  if (nextButton) {
    const card = nextButton.closest("[data-status]");
    const currentIndex = statusIndex(card.dataset.status);
    const next = statusFlow[(currentIndex + 1) % statusFlow.length];
    applyOrderStatus(card, next);
    updateOrderCounts();
    showToast(`Pedido movido para ${next.label.toLowerCase()}.`);
    return;
  }

  const productEdit = event.target.closest("[data-product-edit]");
  if (productEdit) {
    const card = productEdit.closest("[data-product-id]");
    const product = adminProducts.find((item) => item.id === card.dataset.productId);
    if (product) fillProductForm(product);
  }
});

acceptingToggle.addEventListener("click", () => {
  acceptingOrders = !acceptingOrders;
  acceptingToggle.textContent = acceptingOrders ? "Aceitando pedidos" : "Agenda bloqueada";
  acceptingCopy.textContent = acceptingOrders ? "Aceitando pedidos" : "Agenda bloqueada";
  acceptingToggle.classList.toggle("admin-button-soft", acceptingOrders);
  acceptingToggle.classList.toggle("admin-button-ghost", !acceptingOrders);
  showToast(acceptingOrders ? "Novos pedidos liberados." : "Novos pedidos pausados.");
});

document.querySelectorAll("[data-capacity-slider]").forEach((slider) => {
  slider.addEventListener("input", () => {
    const output = document.querySelector(`[data-capacity-output="${slider.dataset.capacitySlider}"]`);
    output.textContent = slider.value;
    updateCapacitySummary();
  });
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const product = productFromForm();

  if (!product.name) {
    showToast("Informe o nome do produto.");
    return;
  }

  if (isProductionAdmin()) {
    const payload = productToApiPayload(product);
    productSubmit.disabled = true;
    try {
      if (product.apiId) {
        await window.bkApi.adminUpdateProduct(product.apiId, payload);
        showToast(`${product.name} atualizado na API.`);
      } else {
        await window.bkApi.adminCreateProduct(payload);
        showToast(`${product.name} criado na API.`);
      }
      await refreshProductsFromApi({ silent: true });
      clearProductForm();
    } catch (err) {
      showToast(err?.code === "slug_taken" ? "Ja existe produto com esse slug." : "Erro ao salvar produto na API.");
    } finally {
      productSubmit.disabled = false;
    }
    return;
  }

  const existingIndex = adminProducts.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    adminProducts[existingIndex] = product;
    showToast(`${product.name} atualizado no cardapio.`);
  } else {
    adminProducts = [product, ...adminProducts];
    showToast(`${product.name} adicionado ao cardapio.`);
  }
  saveProducts();
  renderProducts();
  clearProductForm();
});

productCancel.addEventListener("click", clearProductForm);

productReset.addEventListener("click", () => {
  if (isProductionAdmin()) {
    refreshProductsFromApi();
    clearProductForm();
    return;
  }
  adminProducts = defaultProducts();
  saveProducts();
  renderProducts();
  clearProductForm();
  showToast("Produtos demo restaurados.");
});

productList.addEventListener("change", async (event) => {
  const activeToggle = event.target.closest("[data-product-active]");
  if (!activeToggle) return;

  const card = activeToggle.closest("[data-product-id]");
  const product = adminProducts.find((item) => item.id === card.dataset.productId);
  if (!product) return;

  product.active = activeToggle.checked;
  if (isProductionAdmin() && product.apiId) {
    activeToggle.disabled = true;
    try {
      await window.bkApi.adminUpdateProduct(product.apiId, productToApiPayload(product));
      showToast(`${product.name} ${product.active ? "ativo" : "pausado"} na API.`);
      await refreshProductsFromApi({ silent: true });
    } catch {
      product.active = !product.active;
      showToast("Erro ao atualizar produto na API.");
      renderProducts();
    } finally {
      activeToggle.disabled = false;
    }
    return;
  }
  saveProducts();
  renderProducts();
  showToast(`${product.name} ${product.active ? "ativo" : "pausado"} no cardapio.`);
});

updateOrderCounts();
updateCapacitySummary();
if (productReset && window.BK_CONFIG?.adminMode !== "demo") {
  productReset.textContent = "Recarregar API";
} else if (productReset) {
  productReset.textContent = "Restaurar demo";
}
renderProducts();
renderLeads();
