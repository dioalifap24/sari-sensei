#!/usr/bin/env node
/**
 * Script Generator Ikon APK & PWA untuk Aplikasi Sari Sensei (JLPT N5-N2)
 * Menghasilkan:
 * - public/icon.svg
 * - public/pwa-192x192.png (192x192)
 * - public/pwa-512x512.png (512x512)
 * - public/pwa-maskable-512x512.png (512x512 dengan safe-zone padding 15% untuk Android Adaptive Icon)
 * - public/apple-touch-icon.png (180x180 untuk iOS)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PUBLIC_DIR = path.resolve(__dirname, '../../public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Buat file SVG Ikon Utama (public/icon.svg)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4c0519" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Background Rounded Square -->
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)" />
  <!-- Outer Gold Frame -->
  <rect x="36" y="36" width="440" height="440" rx="72" fill="none" stroke="url(#goldGrad)" stroke-width="10" />
  <!-- Inner Cream Circle Emblem -->
  <circle cx="256" cy="240" r="142" fill="#fcf9f2" stroke="#1c1917" stroke-width="10" />
  <!-- Japanese Sun Disc Accent -->
  <circle cx="256" cy="240" r="108" fill="#ffe4e6" />
  <!-- Torii Gate / Kanji Silhouette -->
  <path d="M166 176 H346 V198 H166 Z" fill="#881337" />
  <path d="M184 212 H328 V230 H184 Z" fill="#881337" />
  <rect x="202" y="194" width="22" height="122" rx="4" fill="#881337" />
  <rect x="288" y="194" width="22" height="122" rx="4" fill="#881337" />
  <rect x="245" y="176" width="22" height="46" rx="4" fill="#1c1917" />
  <!-- Bottom Ribbon Label -->
  <rect x="96" y="400" width="320" height="54" rx="14" fill="#1c1917" stroke="url(#goldGrad)" stroke-width="6" />
  <text x="256" y="436" font-family="serif" font-size="30" font-weight="900" fill="#fde68a" text-anchor="middle" letter-spacing="3">SARI SENSEI</text>
</svg>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), svgContent, 'utf8');

// 2. Fungsi pembuat PNG murni menggunakan Node.js (tanpa library eksternal)
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createIconPng(size, isMaskable = false) {
  const rawData = Buffer.alloc(size * (size * 4 + 1));
  const cx = size / 2;
  const cy = size / 2;
  const safeScale = isMaskable ? 0.78 : 0.92;
  const outerRadius = (size / 2) * safeScale;
  const innerRadius = outerRadius * 0.74;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    rawData[rowStart] = 0; // filter type 0

    for (let x = 0; x < size; x++) {
      const idx = rowStart + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: Deep Crimson (#881337 -> #580b22 gradient)
      const gradT = (x + y) / (size * 2);
      let r = Math.round(136 - gradT * 45);
      let g = Math.round(19 - gradT * 10);
      let b = Math.round(55 - gradT * 20);
      let a = 255;

      // Gold outer ring
      if (Math.abs(dist - outerRadius) <= size * 0.022) {
        r = 251;
        g = 191;
        b = 36;
      } else if (dist < innerRadius) {
        // Warm cream circle (#fcf9f2)
        r = 252;
        g = 249;
        b = 242;

        // Inner black manga border ring
        if (dist > innerRadius - size * 0.018) {
          r = 28;
          g = 25;
          b = 23;
        } else {
          // Draw stylized Torii Gate inside the emblem
          const nx = dx / innerRadius; // -1 to 1
          const ny = dy / innerRadius; // -1 to 1

          const isTopBeam = ny >= -0.48 && ny <= -0.32 && Math.abs(nx) <= 0.68;
          const isTopCurve = ny >= -0.54 && ny <= -0.48 && Math.abs(nx) >= 0.45 && Math.abs(nx) <= 0.74;
          const isSecondBeam = ny >= -0.18 && ny <= -0.06 && Math.abs(nx) <= 0.56;
          const isLeftPillar = Math.abs(nx + 0.36) <= 0.08 && ny >= -0.36 && ny <= 0.56;
          const isRightPillar = Math.abs(nx - 0.36) <= 0.08 && ny >= -0.36 && ny <= 0.56;
          const isCenterStrut = Math.abs(nx) <= 0.06 && ny >= -0.36 && ny <= -0.06;
          const isBaseLeft = Math.abs(nx + 0.36) <= 0.13 && ny >= 0.48 && ny <= 0.58;
          const isBaseRight = Math.abs(nx - 0.36) <= 0.13 && ny >= 0.48 && ny <= 0.58;

          if (isBaseLeft || isBaseRight || isCenterStrut) {
            r = 28;
            g = 25;
            b = 23;
          } else if (isTopBeam || isTopCurve || isSecondBeam || isLeftPillar || isRightPillar) {
            r = 159;
            g = 18;
            b = 57;
          }
        }
      }

      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idatData = zlib.deflateSync(rawData, { level: 6 });

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const iconsToGenerate = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const item of iconsToGenerate) {
  const outPath = path.join(PUBLIC_DIR, item.name);
  const pngBuffer = createIconPng(item.size, item.maskable);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`[APK Icon Generator] Berhasil membuat: public/${item.name} (${item.size}x${item.size})`);
}

// 3. Jika proyek Android (android/app/src/main/res) sudah ada, pasang juga ikon Sari Sensei ke mipmap Android
const ANDROID_RES_DIR = path.resolve(__dirname, '../../android/app/src/main/res');
if (fs.existsSync(ANDROID_RES_DIR)) {
  const mipmapSizes = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const m of mipmapSizes) {
    const targetDir = path.join(ANDROID_RES_DIR, m.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const launcherBuf = createIconPng(m.size, false);
    const fgBuf = createIconPng(m.fgSize, true);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), launcherBuf);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), launcherBuf);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), fgBuf);
  }

  // Hapus adaptive icon XML bawaan Capacitor agar menggunakan PNG mipmap Sari Sensei secara penuh
  const anyDpiDir = path.join(ANDROID_RES_DIR, 'mipmap-anydpi-v26');
  if (fs.existsSync(anyDpiDir)) {
    fs.rmSync(anyDpiDir, { recursive: true, force: true });
  }

  const bgXmlPath = path.join(ANDROID_RES_DIR, 'values', 'ic_launcher_background.xml');
  if (fs.existsSync(path.dirname(bgXmlPath))) {
    const bgXml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#881337</color>\n</resources>\n`;
    fs.writeFileSync(bgXmlPath, bgXml, 'utf8');
  }

  console.log('[APK Icon Generator] Berhasil memasang ikon peluncur Android (mipmap-mdpi s/d xxxhdpi) untuk Sari Sensei.');
}

