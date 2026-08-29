// One-off asset generator (.cjs because package.json sets "type": "module"). sharp is NOT a project dependency (it would only
// slow CI installs for an asset that changes once a brand refresh) — run it as:
//   npm i --no-save sharp && node scripts/make-dark-logo.cjs public/logo.jpg public/logo-dark.png
//
// Builds a transparent, light-on-dark version of logo.jpg for the dark site.
//
// The source is dark navy type + a blue mark on a near-white plate. Steps:
//   1. trim the excess white plate,
//   2. flip lightness while keeping hue (invert R/G/B, then rotate hue 180),
//   3. drive alpha from the resulting luminance, so the now-near-black plate
//      becomes fully transparent and the artwork stays opaque.
// Result: a PNG that sits correctly on any dark ground, no blend mode needed.

const sharp = require('sharp');
const path = require('path');

const src = process.argv[2];
const out = process.argv[3];

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

(async () => {
  // trim() removes the uniform plate border so the mark isn't swimming in space.
  const img = sharp(src).trim({ threshold: 12 });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const px = info.width * info.height;
  const outBuf = Buffer.alloc(px * 4);

  for (let i = 0; i < px; i++) {
    const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];

    // Keep hue and saturation; invert lightness. This turns dark navy type into
    // light type and the near-white plate into near-black, without the colour
    // shift a plain negate() would give the blue mark.
    const [h, s, l] = rgbToHsl(r, g, b);
    const [nr, ng, nb] = hslToRgb(h, s, 1 - l);

    // Alpha from the new luminance. The source plate is not pure white — it
    // carries a soft gradient — so a plain luminance-to-alpha map leaves it
    // faintly visible as a box. A smoothstep with a floor at LO drives anything
    // plate-dark to fully transparent while keeping the artwork solid.
    const LO = 0.13;
    const HI = 0.42;
    const lum = (0.299 * nr + 0.587 * ng + 0.114 * nb) / 255;
    const t = Math.min(1, Math.max(0, (lum - LO) / (HI - LO)));
    const alpha = Math.round(t * t * (3 - 2 * t) * 255);

    outBuf[i * 4] = nr;
    outBuf[i * 4 + 1] = ng;
    outBuf[i * 4 + 2] = nb;
    outBuf[i * 4 + 3] = alpha;
  }

  await sharp(outBuf, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log(`wrote ${path.basename(out)} — ${info.width}x${info.height}`);
})();
