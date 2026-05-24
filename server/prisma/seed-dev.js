// Seed de desenvolvimento — popula com:
// - admin user (credenciais do .env)
// - 6 produtos do pudim (extraídos de app.js)
// - 16 produtos do box (extraídos de box.js)
// - regras de negócio iniciais
// - 30 dias de availability slots vazios pra cada categoria
// - 2 leads + 1 customer + 1 order de exemplo (pra ver UI populada)
//
// Rodar: npm run db:seed

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { config } from '../src/config.js';

const prisma = new PrismaClient();

// ============================================================
// Produtos pudim (de app.js)
// ============================================================
const PUDIM_PRODUCTS = [
  {
    slug: 'classic-pudim',
    category: 'pudim',
    name: 'Classic Brazilian Pudim',
    nameI18n: { en: 'Classic Brazilian Pudim', pt: 'Pudim Brasileiro Clássico' },
    description: 'Glossy caramel, silky custard and elegant packaging for weekend pickup.',
    descriptionI18n: {
      en: 'Glossy caramel, silky custard and elegant packaging for weekend pickup.',
      pt: 'Calda brilhante, textura cremosa e embalagem caprichada para retirada no fim de semana.',
    },
    priceCents: 2800,
    imageUrl: 'assets/img/products/product-classic-pudim.png',
    leadTimeHours: 48,
    sortOrder: 10,
  },
  {
    slug: 'berry-pudim',
    category: 'pudim',
    name: 'Berry Brazilian Pudim',
    nameI18n: { en: 'Berry Brazilian Pudim', pt: 'Pudim de Frutas Vermelhas' },
    description: 'Creamy pudim finished with glossy berry topping for birthdays and gift moments.',
    descriptionI18n: {
      en: 'Creamy pudim finished with glossy berry topping for birthdays and gift moments.',
      pt: 'Pudim cremoso com calda brilhante de frutas vermelhas para presente e aniversário.',
    },
    priceCents: 3400,
    imageUrl: 'assets/img/products/product-berry-pudim.png',
    leadTimeHours: 48,
    sortOrder: 20,
  },
  {
    slug: 'gift-pudim',
    category: 'gift',
    name: 'Gift-Ready Pudim',
    nameI18n: { en: 'Gift-Ready Pudim', pt: 'Pudim para Presente' },
    description: 'A polished pudding presentation for birthdays, dinner invites and Brazilian homesick moments.',
    descriptionI18n: {
      en: 'A polished pudding presentation for birthdays, dinner invites and Brazilian homesick moments.',
      pt: 'Apresentação elegante para aniversário, jantar especial e saudade do Brasil.',
    },
    priceCents: 3400,
    imageUrl: 'assets/img/lifestyle/pudding-photo.png',
    leadTimeHours: 48,
    sortOrder: 30,
  },
  {
    slug: 'brigadeiro-tray',
    category: 'sweet',
    name: 'Party Sweets Tray',
    nameI18n: { en: 'Party Sweets Tray', pt: 'Bandeja de Docinhos' },
    description: 'Brigadeiro-style sweets and dessert bites planned around guest count and event timing.',
    descriptionI18n: {
      en: 'Brigadeiro-style sweets and dessert bites planned around guest count and event timing.',
      pt: 'Docinhos e sobremesas planejados por quantidade de pessoas e horário do evento.',
    },
    priceCents: 0, // custom quote
    imageUrl: 'assets/img/lifestyle/sweets-photo.png',
    leadTimeHours: 96,
    sortOrder: 40,
  },
  {
    slug: 'event-dessert-table',
    category: 'gift',
    name: 'Event Dessert Table',
    nameI18n: { en: 'Event Dessert Table', pt: 'Mesa de Sobremesas para Evento' },
    description: 'Pudim, sweets and dessert styling planned around the event date, guest count and pickup window.',
    descriptionI18n: {
      en: 'Pudim, sweets and dessert styling planned around the event date, guest count and pickup window.',
      pt: 'Pudim, docinhos e montagem de sobremesas planejados por data, convidados e horário.',
    },
    priceCents: 0, // custom
    imageUrl: 'assets/img/lifestyle/table-photo.png',
    leadTimeHours: 120,
    sortOrder: 50,
  },
  {
    slug: 'berry-celebration-cake',
    category: 'gift',
    name: 'Berry Celebration Cake',
    nameI18n: { en: 'Berry Celebration Cake', pt: 'Bolo de Aniversário com Frutas Vermelhas' },
    description: 'Festive Brazilian berry cake for birthdays and special celebrations.',
    descriptionI18n: {
      en: 'Festive Brazilian berry cake for birthdays and special celebrations.',
      pt: 'Bolo brasileiro de frutas vermelhas para aniversários e celebrações.',
    },
    priceCents: 0,
    imageUrl: 'assets/img/events/event-berry-cake.png',
    leadTimeHours: 72,
    sortOrder: 60,
  },
];

// ============================================================
// Produtos box (de box.js)
// ============================================================
const BOX_PRODUCTS = [
  { slug: 'cups-tower', category: 'box', name: 'Dessert cups tower', priceCents: 4200, image: 'product-dessert-cups.png', sort: 100 },
  { slug: 'shrimp-tray', category: 'tray', name: 'Crispy shrimp tray', priceCents: 5600, image: 'product-shrimp-tray.png', sort: 110 },
  { slug: 'weekend-family-box', category: 'box', name: 'Weekend family box', priceCents: 0, image: 'box-photo.png', sort: 120 },
  { slug: 'beef-rice-box', category: 'box', name: 'Beef rice lunch box', priceCents: 1800, image: 'box-beef-rice.png', sort: 130 },
  { slug: 'fit-ground-beef-box', category: 'box', name: 'Fit ground beef box', priceCents: 1700, image: 'box-fit-ground-beef.png', sort: 140 },
  { slug: 'grilled-chicken-box', category: 'box', name: 'Grilled chicken box', priceCents: 1800, image: 'box-grilled-chicken.png', sort: 150 },
  { slug: 'meatball-pasta-box', category: 'box', name: 'Meatball pasta box', priceCents: 1800, image: 'box-meatball-pasta.png', sort: 160 },
  { slug: 'salmon-mash-box', category: 'box', name: 'Salmon mash box', priceCents: 2400, image: 'box-salmon-mash.png', sort: 170 },
  { slug: 'ground-beef-rice-box', category: 'box', name: 'Ground beef rice box', priceCents: 1700, image: 'box-ground-beef-rice.png', sort: 180 },
  { slug: 'pizza-waffle', category: 'sweet', name: 'Pizza waffle snack', priceCents: 1000, image: 'box-pizza-waffle.png', sort: 190 },
  { slug: 'savory-pie', category: 'tray', name: 'Savory straw potato pie', priceCents: 4200, image: 'box-savory-pie.png', sort: 200 },
  { slug: 'shrimp-platter', category: 'tray', name: 'Party shrimp platter', priceCents: 6800, image: 'box-shrimp-platter.png', sort: 210 },
  { slug: 'cookie-duo', category: 'sweet', name: 'Cookie duo box', priceCents: 1200, image: 'event-cookie-duo.png', sort: 220 },
  { slug: 'charcuterie-board', category: 'tray', name: 'Charcuterie board', priceCents: 0, image: 'event-charcuterie-board.png', sort: 230 },
  { slug: 'luxury-hamper', category: 'gift', name: 'Luxury gift hamper', priceCents: 0, image: 'event-luxury-hamper.png', sort: 240 },
  { slug: 'birthday-tray', category: 'gift', name: 'Birthday tray', priceCents: 0, image: 'event-birthday-blue-tray.png', sort: 250 },
];

// ============================================================
// Regras de negócio iniciais (concierge IA — Fase 9)
// ============================================================
const BUSINESS_RULES = [
  {
    key: 'lead_time_pudim',
    category: 'policy',
    contentEn: 'Pudim orders require 48h notice. Custom or event orders need 3-5 days.',
    contentPt: 'Pedidos de pudim precisam de 48h de antecedência. Pedidos personalizados ou para eventos precisam de 3-5 dias.',
  },
  {
    key: 'pickup_window',
    category: 'policy',
    contentEn: 'Saturday pickup window: 5–7 PM. Other windows by request.',
    contentPt: 'Janela de retirada padrão: sábado, 17h-19h. Outros horários sob consulta.',
  },
  {
    key: 'service_area',
    category: 'policy',
    contentEn: 'Pickup based in Danbury, CT. Delivery available within metro area for an additional fee.',
    contentPt: 'Retirada em Danbury, CT. Entrega disponível na região metropolitana com taxa adicional.',
  },
  {
    key: 'payment_methods',
    category: 'policy',
    contentEn: 'Accepted: Zelle, Venmo, Cash App. Card payments coming soon.',
    contentPt: 'Aceitamos: Zelle, Venmo, Cash App. Pagamento em cartão em breve.',
  },
];

// ============================================================
// Run seed
// ============================================================
async function main() {
  console.log('[seed-dev] Iniciando…');

  // Admin user
  const passwordHash = await argon2.hash(config.ADMIN_INITIAL_PASS, {
    type: argon2.argon2id,
    secret: Buffer.from(config.ARGON_SECRET),
  });
  const admin = await prisma.user.upsert({
    where: { email: config.ADMIN_INITIAL_EMAIL },
    update: {},
    create: {
      email: config.ADMIN_INITIAL_EMAIL,
      passwordHash,
      name: 'Owner',
      role: 'owner',
    },
  });
  console.log(`[seed-dev] Admin: ${admin.email} (id=${admin.id})`);

  // Produtos pudim
  for (const p of PUDIM_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`[seed-dev] ${PUDIM_PRODUCTS.length} produtos pudim`);

  // Produtos box
  for (const p of BOX_PRODUCTS) {
    const data = {
      slug: p.slug,
      category: p.category,
      name: p.name,
      priceCents: p.priceCents,
      imageUrl: `assets/img/${p.image.startsWith('event-') ? 'events' : p.image.startsWith('box-') ? 'boxes' : 'products'}/${p.image}`,
      leadTimeHours: 48,
      sortOrder: p.sort,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`[seed-dev] ${BOX_PRODUCTS.length} produtos box`);

  // Regras de negócio
  for (const rule of BUSINESS_RULES) {
    await prisma.businessRule.upsert({
      where: { key: rule.key },
      update: rule,
      create: rule,
    });
  }
  console.log(`[seed-dev] ${BUSINESS_RULES.length} regras de negócio`);

  // Availability slots — 30 dias adiante, capacidade default 8 por categoria
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const categories = ['pudim', 'sweet', 'box', 'tray', 'gift'];
  let slotCount = 0;
  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + d);
    for (const category of categories) {
      await prisma.availabilitySlot.upsert({
        where: { date_category: { date, category } },
        update: {},
        create: { date, category, capacityMax: category === 'pudim' ? 8 : 12, reserved: 0 },
      });
      slotCount++;
    }
  }
  console.log(`[seed-dev] ${slotCount} availability slots`);

  // Customer + Lead exemplo (pra UI ver dados)
  const customer = await prisma.customer.upsert({
    where: { phone: '+12039875432' },
    update: {},
    create: {
      name: 'Maria Silva',
      phone: '+12039875432',
      email: 'maria@example.com',
      zip: '06810',
      city: 'Danbury',
      preferredLang: 'pt',
    },
  }).catch(async () => {
    // Customer não tem unique no phone — busca/cria manual
    const existing = await prisma.customer.findFirst({ where: { phone: '+12039875432' } });
    if (existing) return existing;
    return prisma.customer.create({
      data: {
        name: 'Maria Silva',
        phone: '+12039875432',
        email: 'maria@example.com',
        zip: '06810',
        city: 'Danbury',
        preferredLang: 'pt',
      },
    });
  });

  await prisma.lead.upsert({
    where: { id: 'seed-lead-1' },
    update: {},
    create: {
      id: 'seed-lead-1',
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      productSlug: 'classic-pudim',
      message: 'Quero encomendar para o aniversário do meu filho dia 15.',
      source: 'site',
      status: 'new',
      consent: true,
      consentedAt: new Date(),
    },
  });
  console.log(`[seed-dev] Customer + Lead exemplo`);

  console.log('[seed-dev] Pronto.');
}

main()
  .catch((e) => {
    console.error('[seed-dev] Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
