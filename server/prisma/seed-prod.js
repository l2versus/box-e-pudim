import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { config } from '../src/config.js';
import { DEFAULT_DELIVERY_SETTINGS } from '../src/lib/delivery-settings.js';

const prisma = new PrismaClient();

const PRODUCTS = [
  { slug: 'classic-pudim', category: 'pudim', name: 'Classic Brazilian Pudim', priceCents: 2800, imageUrl: 'assets/img/products/product-classic-pudim.png', leadTimeHours: 48, sortOrder: 10 },
  { slug: 'berry-pudim', category: 'pudim', name: 'Berry Brazilian Pudim', priceCents: 3400, imageUrl: 'assets/img/products/product-berry-pudim.png', leadTimeHours: 48, sortOrder: 20 },
  { slug: 'gift-pudim', category: 'gift', name: 'Gift-Ready Pudim', priceCents: 3400, imageUrl: 'assets/img/lifestyle/pudding-photo.png', leadTimeHours: 48, sortOrder: 30 },
  { slug: 'brigadeiro-tray', category: 'sweet', name: 'Party Sweets Tray', priceCents: 0, imageUrl: 'assets/img/lifestyle/sweets-photo.png', leadTimeHours: 96, sortOrder: 40 },
  { slug: 'event-dessert-table', category: 'gift', name: 'Event Dessert Table', priceCents: 0, imageUrl: 'assets/img/lifestyle/table-photo.png', leadTimeHours: 120, sortOrder: 50 },
  { slug: 'berry-celebration-cake', category: 'gift', name: 'Berry Celebration Cake', priceCents: 0, imageUrl: 'assets/img/events/event-berry-cake.png', leadTimeHours: 72, sortOrder: 60 },
  { slug: 'cookie-gift-duo', category: 'sweet', name: 'Cookie Gift Duo', priceCents: 1200, imageUrl: 'assets/img/events/event-cookie-duo.png', leadTimeHours: 48, sortOrder: 70 },
  { slug: 'premium-gift-hamper', category: 'gift', name: 'Premium Gift Hamper', priceCents: 0, imageUrl: 'assets/img/events/event-luxury-hamper.png', leadTimeHours: 120, sortOrder: 80 },
  { slug: 'love-gift-box', category: 'gift', name: 'Love Gift Box', priceCents: 0, imageUrl: 'assets/img/events/event-love-gift-box.png', leadTimeHours: 72, sortOrder: 90 },
  { slug: 'birthday-breakfast-tray', category: 'gift', name: 'Birthday Breakfast Tray', priceCents: 0, imageUrl: 'assets/img/events/event-birthday-pink-tray.png', leadTimeHours: 120, sortOrder: 100 },
  { slug: 'charcuterie-event-board', category: 'tray', name: 'Charcuterie Event Board', priceCents: 0, imageUrl: 'assets/img/events/event-charcuterie-board.png', leadTimeHours: 72, sortOrder: 110 },
  { slug: 'cups-tower', category: 'box', name: 'Dessert cups tower', priceCents: 4200, imageUrl: 'assets/img/products/product-dessert-cups.png', leadTimeHours: 48, sortOrder: 120 },
  { slug: 'shrimp-tray', category: 'tray', name: 'Crispy shrimp tray', priceCents: 5600, imageUrl: 'assets/img/products/product-shrimp-tray.png', leadTimeHours: 48, sortOrder: 130 },
  { slug: 'weekend-family-box', category: 'box', name: 'Weekend family box', priceCents: 0, imageUrl: 'assets/img/boxes/box-photo.png', leadTimeHours: 48, sortOrder: 140 },
  { slug: 'beef-rice-box', category: 'box', name: 'Beef rice lunch box', priceCents: 1800, imageUrl: 'assets/img/boxes/box-beef-rice.png', leadTimeHours: 48, sortOrder: 150 },
  { slug: 'fit-ground-beef-box', category: 'box', name: 'Fit ground beef box', priceCents: 1700, imageUrl: 'assets/img/boxes/box-fit-ground-beef.png', leadTimeHours: 48, sortOrder: 160 },
  { slug: 'grilled-chicken-box', category: 'box', name: 'Grilled chicken box', priceCents: 1800, imageUrl: 'assets/img/boxes/box-grilled-chicken.png', leadTimeHours: 48, sortOrder: 170 },
  { slug: 'meatball-pasta-box', category: 'box', name: 'Meatball pasta box', priceCents: 1800, imageUrl: 'assets/img/boxes/box-meatball-pasta.png', leadTimeHours: 48, sortOrder: 180 },
  { slug: 'salmon-mash-box', category: 'box', name: 'Salmon mash box', priceCents: 2400, imageUrl: 'assets/img/boxes/box-salmon-mash.png', leadTimeHours: 48, sortOrder: 190 },
  { slug: 'ground-beef-rice-box', category: 'box', name: 'Ground beef rice box', priceCents: 1700, imageUrl: 'assets/img/boxes/box-ground-beef-rice.png', leadTimeHours: 48, sortOrder: 200 },
  { slug: 'pizza-waffle', category: 'sweet', name: 'Pizza waffle snack', priceCents: 1000, imageUrl: 'assets/img/boxes/box-pizza-waffle.png', leadTimeHours: 48, sortOrder: 210 },
  { slug: 'savory-pie', category: 'tray', name: 'Savory straw potato pie', priceCents: 4200, imageUrl: 'assets/img/boxes/box-savory-pie.png', leadTimeHours: 48, sortOrder: 220 },
  { slug: 'shrimp-platter', category: 'tray', name: 'Party shrimp platter', priceCents: 6800, imageUrl: 'assets/img/boxes/box-shrimp-platter.png', leadTimeHours: 48, sortOrder: 230 },
  { slug: 'cookie-duo', category: 'sweet', name: 'Cookie duo box', priceCents: 1200, imageUrl: 'assets/img/events/event-cookie-duo.png', leadTimeHours: 48, sortOrder: 240 },
  { slug: 'charcuterie-board', category: 'tray', name: 'Charcuterie board', priceCents: 0, imageUrl: 'assets/img/events/event-charcuterie-board.png', leadTimeHours: 72, sortOrder: 250 },
  { slug: 'luxury-hamper', category: 'gift', name: 'Luxury gift hamper', priceCents: 0, imageUrl: 'assets/img/events/event-luxury-hamper.png', leadTimeHours: 72, sortOrder: 260 },
  { slug: 'birthday-tray', category: 'gift', name: 'Birthday tray', priceCents: 0, imageUrl: 'assets/img/events/event-birthday-blue-tray.png', leadTimeHours: 72, sortOrder: 270 },
];

function uniqueEmails(emails) {
  return [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
}

async function seedAdmins() {
  const passwordHash = await argon2.hash(config.ADMIN_INITIAL_PASS, {
    type: argon2.argon2id,
    secret: Buffer.from(config.ARGON_SECRET),
  });

  const adminEmails = uniqueEmails([
    config.ADMIN_INITIAL_EMAIL,
    'admin@brazilianpudding.com',
    'owner@brazilianpudding.com',
  ]);

  const admins = [];
  for (const email of adminEmails) {
    admins.push(await prisma.user.upsert({
      where: { email },
      update: { passwordHash, active: true, role: 'owner' },
      create: { email, passwordHash, name: 'Owner', role: 'owner' },
    }));
  }
  console.log(`[seed-prod] Admins garantidos: ${admins.map((admin) => admin.email).join(', ')}`);
}

async function seedProducts() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, active: true, paused: false, deletedAt: null },
      create: product,
    });
  }
  console.log(`[seed-prod] Produtos garantidos: ${PRODUCTS.length}`);
}

async function seedAvailability() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const categories = ['pudim', 'sweet', 'box', 'tray', 'gift'];
  let slotCount = 0;
  for (let dayOffset = 0; dayOffset < 90; dayOffset += 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + dayOffset);
    for (const category of categories) {
      await prisma.availabilitySlot.upsert({
        where: { date_category: { date, category } },
        update: {},
        create: { date, category, capacityMax: category === 'pudim' ? 10 : 14, reserved: 0 },
      });
      slotCount += 1;
    }
  }
  console.log(`[seed-prod] Availability slots garantidos: ${slotCount}`);
}

async function seedDeliverySettings() {
  await prisma.businessRule.upsert({
    where: { key: 'delivery_settings' },
    update: {
      category: 'delivery',
      contentEn: JSON.stringify(DEFAULT_DELIVERY_SETTINGS),
      contentPt: 'Configuracao de entrega em JSON',
      active: true,
    },
    create: {
      key: 'delivery_settings',
      category: 'delivery',
      contentEn: JSON.stringify(DEFAULT_DELIVERY_SETTINGS),
      contentPt: 'Configuracao de entrega em JSON',
      active: true,
    },
  });
  console.log('[seed-prod] Configuracao de entrega garantida: Danbury/CT 06810');
}

async function main() {
  console.log('[seed-prod] Iniciando...');
  if (config.NODE_ENV !== 'production') {
    console.warn('[seed-prod] AVISO: NODE_ENV != production. Voce quis rodar db:seed?');
  }
  await seedAdmins();
  await seedProducts();
  await seedAvailability();
  await seedDeliverySettings();
  console.log('[seed-prod] Pronto.');
}

main()
  .catch((e) => {
    console.error('[seed-prod] Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
