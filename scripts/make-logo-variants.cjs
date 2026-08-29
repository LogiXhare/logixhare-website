// One-off asset generator (.cjs because package.json sets "type": "module").
// sharp is NOT a project dependency — it would slow every CI install for an
// asset that only changes on a brand refresh. Run it ad-hoc:
//
//   npm i --no-save sharp
//   node scripts/make-logo-variants.cjs
//
// Builds both transparent logo variants from public/logo.jpg, which ships as
// dark navy type + a blue mark on a near-white plate:
//
//   logo-light.png  for the LIGHT theme — original colours, plate knocked out.
//   logo-dark.png   for the DARK theme  — lightness inverted (hue preserved, so
//                   the blue mark stays blue), then the now-dark plate knocked out.
//
// In both cases alpha is driven from luminance rather than a CSS blend mode:
// screen would blow the white plate to solid white and multiply would kill the
// artwork, so neither can produce a usable logo on the opposite ground.

const sharp = require('sharp');
const path = require('path');

const SRC = process.argv[2] || 'public/logo.jpg';
const OUT_DIR = process.argv[3] || 'public';

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

// Smoothstep, used to ramp alpha without leaving a faint halo where the plate
// meets the artwork.
const smoothstep = (lo, hi, x) => {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

/**
 * @param invertLightness  true  -> dark variant: flip L, keep hue, then knock out
 *                                  the (now dark) plate.
 *                         false -> light variant: keep colours, knock out the
 *                                  (still light) plate.
 */
async function build(invertLightness, outFile) {
  // trim() removes the uniform plate border so the mark isn't swimming in space.
  const { data, info } = await sharp(SRC)
    .trim({ threshold: 12 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);

  for (let i = 0; i < px; i++) {
    const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];
    let nr = r, ng = g, nb = b;

    if (invertLightness) {
      // Keep hue and saturation, invert lightness only. Turns dark navy type
      // light and the near-white plate near-black, without the colour shift a
      // plain negate() would give the blue mark.
      const [h, s, l] = rgbToHsl(r, g, b);
      [nr, ng, nb] = hslToRgb(h, s, 1 - l);
    }

    // The source plate is not pure white — it carries a soft gradient — so a
    // plain luminance-to-alpha map leaves it faintly visible as a box. The
    // smoothstep floor drives anything plate-coloured to fully transparent
    // while keeping the artwork solid.
    const lum = (0.299 * nr + 0.587 * ng + 0.114 * nb) / 255;
    const alpha = invertLightness
      ? smoothstep(0.13, 0.42, lum)        // dark variant: keep the LIGHT pixels
      : 1 - smoothstep(0.62, 0.93, lum);   // light variant: keep the DARK pixels

    out[i * 4] = nr;
    out[i * 4 + 1] = ng;
    out[i * 4 + 2] = nb;
    out[i * 4 + 3] = Math.round(alpha * 255);
  }

  const dest = path.join(OUT_DIR, outFile);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  console.log(`wrote ${dest} — ${info.width}x${info.height}`);
}

(async () => {
  await build(false, 'logo-light.png');
  await build(true, 'logo-dark.png');
})();
