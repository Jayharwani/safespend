/**
 * Generate the PWA icon + iOS splash set from a single source.
 *
 * Source of truth: scripts/icon-source.svg (a 1024×1024 emerald "H").
 * Replace that file with the real 1024 brand icon and re-run:
 *   node scripts/gen-icons.mjs
 *
 * Produces into /public:
 *   pwa-192.png, pwa-512.png, maskable-512.png, apple-touch-icon.png,
 *   favicon.svg, favicon-48.png, and apple-splash-*.png (iOS startup images).
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pub = join(root, "public");
if (!existsSync(pub)) mkdirSync(pub, { recursive: true });

const ACCENT = "#0E9E6B";
const ACCENT_DEEP = "#0A7A52";
const BG = "#F5F7F6";

// --- Source SVGs ---------------------------------------------------------
// "Headroom" mark: a ceiling line with an arrow rising toward it — the room
// you have before you hit your limit. Drawn as strokes (no font dependency).
function hMark(scale = 1, color = "#FFFFFF") {
  const sw = 74; // stroke width on a 1024 canvas
  const mark = `
    <g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M300 322 H724"/>
      <path d="M512 754 V 410"/>
      <path d="M444 470 L512 402 L580 470"/>
    </g>`;
  if (scale === 1) return mark;
  return `<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">${mark}</g>`;
}

const roundedSquare = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${ACCENT}"/><stop offset="1" stop-color="${ACCENT_DEEP}"/>
  </linearGradient></defs>
  <rect x="64" y="64" width="896" height="896" rx="220" fill="url(#g)"/>
  ${hMark(1)}
</svg>`;

const fullBleed = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${ACCENT}"/><stop offset="1" stop-color="${ACCENT_DEEP}"/>
  </linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  ${hMark(1)}
</svg>`;

// Maskable: full bleed, mark shrunk into the ~80% safe zone.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${ACCENT}"/><stop offset="1" stop-color="${ACCENT_DEEP}"/>
  </linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  ${hMark(0.62)}
</svg>`;

// Prefer a user-provided source if present.
const sourcePath = join(__dirname, "icon-source.svg");
const sourceSquare = existsSync(sourcePath) ? readFileSync(sourcePath) : Buffer.from(roundedSquare);

writeFileSync(join(pub, "favicon.svg"), Buffer.from(roundedSquare));

async function png(svgOrBuf, size, out) {
  const input = Buffer.isBuffer(svgOrBuf) ? svgOrBuf : Buffer.from(svgOrBuf);
  await sharp(input, { density: 384 }).resize(size, size, { fit: "cover" }).png().toFile(join(pub, out));
  console.log("  ✓", out, `${size}×${size}`);
}

// iOS splash: bg-coloured canvas with the icon centred.
async function splash(w, h) {
  const iconSize = Math.round(Math.min(w, h) * 0.26);
  const icon = await sharp(Buffer.from(roundedSquare), { density: 384 })
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();
  await sharp({
    create: { width: w, height: h, channels: 4, background: BG },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(join(pub, `apple-splash-${w}-${h}.png`));
  console.log("  ✓", `apple-splash-${w}-${h}.png`);
}

const SPLASHES = [
  [1290, 2796], [1179, 2556], [1284, 2778], [1170, 2532],
  [1125, 2436], [1242, 2208], [828, 1792], [750, 1334],
];

console.log("Icons:");
await png(sourceSquare, 192, "pwa-192.png");
await png(sourceSquare, 512, "pwa-512.png");
await png(maskable, 512, "maskable-512.png");
await png(fullBleed, 180, "apple-touch-icon.png");
await png(roundedSquare, 48, "favicon-48.png");
console.log("Splash:");
for (const [w, h] of SPLASHES) await splash(w, h);
console.log("Done.");
