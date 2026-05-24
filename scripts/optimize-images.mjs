#!/usr/bin/env node
// Box e Pudim — image optimizer
// Walks assets/img/**, generates AVIF + WebP + resized PNG fallback (max 1600px width).
// Writes siblings next to originals: foo.png -> foo.avif + foo.webp + foo.png (resized in place).
// Skips files when an optimized variant is already newer than the source.

import { readdir, stat, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const BACKUP_DIR = path.join(ROOT, 'assets', 'img-original');

const MAX_WIDTH = 1600;
const AVIF_QUALITY = 60;
const WEBP_QUALITY = 80;
const PNG_QUALITY = 82;

const SRC_EXT = new Set(['.png', '.jpg', '.jpeg']);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function isUpToDate(src, dst) {
  if (!existsSync(dst)) return false;
  const [a, b] = await Promise.all([stat(src), stat(dst)]);
  return b.mtimeMs >= a.mtimeMs;
}

async function backupOriginal(file) {
  const rel = path.relative(IMG_DIR, file);
  const dst = path.join(BACKUP_DIR, rel);
  if (existsSync(dst)) return;
  await mkdir(path.dirname(dst), { recursive: true });
  await copyFile(file, dst);
}

async function processFile(file, stats) {
  const ext = path.extname(file).toLowerCase();
  if (!SRC_EXT.has(ext)) return;

  const base = file.slice(0, -ext.length);
  const avif = `${base}.avif`;
  const webp = `${base}.webp`;
  const pngDst = `${base}.png`;

  const srcStat = await stat(file);
  stats.totalOriginal += srcStat.size;

  const sourceForVariants = path.join(BACKUP_DIR, path.relative(IMG_DIR, file));
  const sourcePath = existsSync(sourceForVariants) ? sourceForVariants : file;

  if (sourcePath === file) {
    await backupOriginal(file);
  }

  const tasks = [];
  let avifSize = 0;
  let webpSize = 0;
  let pngSize = 0;

  if (!(await isUpToDate(sourcePath, avif))) {
    tasks.push(
      sharp(sourcePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .avif({ quality: AVIF_QUALITY, effort: 4 })
        .toFile(avif)
        .then((info) => { avifSize = info.size; }),
    );
  } else {
    avifSize = (await stat(avif)).size;
  }

  if (!(await isUpToDate(sourcePath, webp))) {
    tasks.push(
      sharp(sourcePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(webp)
        .then((info) => { webpSize = info.size; }),
    );
  } else {
    webpSize = (await stat(webp)).size;
  }

  // PNG fallback overwrites the original with a resized + recompressed copy.
  // We always read from BACKUP_DIR so re-runs stay deterministic.
  const tmpPng = `${pngDst}.tmp`;
  if (ext === '.png') {
    tasks.push(
      sharp(sourcePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
        .toFile(tmpPng)
        .then(async (info) => {
          await copyFile(tmpPng, pngDst);
          const { unlink } = await import('node:fs/promises');
          await unlink(tmpPng);
          pngSize = info.size;
        }),
    );
  } else {
    // jpg/jpeg: keep original but also emit a resized .jpg copy in place.
    tasks.push(
      sharp(sourcePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: PNG_QUALITY, mozjpeg: true })
        .toFile(tmpPng)
        .then(async (info) => {
          await copyFile(tmpPng, file);
          const { unlink } = await import('node:fs/promises');
          await unlink(tmpPng);
          pngSize = info.size;
        }),
    );
  }

  await Promise.all(tasks);

  const newTotal = avifSize + webpSize + pngSize;
  stats.totalOptimized += newTotal;
  stats.files.push({
    file: path.relative(ROOT, file),
    orig: srcStat.size,
    avif: avifSize,
    webp: webpSize,
    fallback: pngSize,
  });
}

async function main() {
  if (!existsSync(IMG_DIR)) {
    console.error(`No image directory at ${IMG_DIR}`);
    process.exit(1);
  }

  const all = await walk(IMG_DIR);
  const targets = all.filter((f) => SRC_EXT.has(path.extname(f).toLowerCase()));

  if (targets.length === 0) {
    console.log('No PNG/JPG files to optimize.');
    return;
  }

  console.log(`Optimizing ${targets.length} images (max ${MAX_WIDTH}px, AVIF q=${AVIF_QUALITY}, WebP q=${WEBP_QUALITY}, PNG q=${PNG_QUALITY})...`);
  console.log(`Originals backed up to: ${path.relative(ROOT, BACKUP_DIR)}/`);
  console.log('');

  const stats = { totalOriginal: 0, totalOptimized: 0, files: [] };

  for (const file of targets) {
    try {
      await processFile(file, stats);
      const last = stats.files[stats.files.length - 1];
      if (last) {
        console.log(`  ${last.file}: ${fmt(last.orig)} -> avif ${fmt(last.avif)} | webp ${fmt(last.webp)} | fallback ${fmt(last.fallback)}`);
      }
    } catch (err) {
      console.error(`  FAILED ${path.relative(ROOT, file)}: ${err.message}`);
    }
  }

  const savedFallback = stats.totalOriginal - stats.files.reduce((s, f) => s + f.fallback, 0);
  console.log('');
  console.log(`Total originals:      ${fmt(stats.totalOriginal)}`);
  console.log(`Total AVIF emitted:   ${fmt(stats.files.reduce((s, f) => s + f.avif, 0))}`);
  console.log(`Total WebP emitted:   ${fmt(stats.files.reduce((s, f) => s + f.webp, 0))}`);
  console.log(`Total PNG fallback:   ${fmt(stats.files.reduce((s, f) => s + f.fallback, 0))} (saved ${fmt(savedFallback)})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
