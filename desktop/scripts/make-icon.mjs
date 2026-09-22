import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "assets");
mkdirSync(outDir, { recursive: true });

const BASE = 256;
const SAMPLES = 3;

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = (crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)) >>> 0;
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(raw, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = size * 4;
  const scan = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    scan[y * (stride + 1)] = 0;
    raw.copy(scan, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(scan, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function inRoundRect(x, y, x0, y0, w, h, r) {
  const qx = Math.abs(x - (x0 + w / 2)) - (w / 2 - r);
  const qy = Math.abs(y - (y0 + h / 2)) - (h / 2 - r);
  const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  return d <= 0;
}

function inTri(x, y, a, b, c) {
  const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const d1 = s(a, b, [x, y]);
  const d2 = s(b, c, [x, y]);
  const d3 = s(c, a, [x, y]);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

const lerp = (a, b, t) => a + (b - a) * t;

const GRAD_TOP = [233, 72, 82];
const GRAD_BOTTOM = [190, 45, 58];
const LINE = [205, 47, 60];

function paint(x, y, u) {
  const p = (v) => v * u;
  const px = p(66);
  const py = p(48);
  const pw = p(124);
  const ph = p(160);
  const pr = p(14);
  const cut = [
    [p(178), py],
    [p(192), py],
    [p(192), p(62)],
  ];
  const flap = [
    [p(192), py],
    [p(192), p(62)],
    [p(214), p(62)],
  ];

  let rgb = null;
  if (inRoundRect(x, y, p(24), p(24), p(208), p(208), p(56))) {
    const t = (y - p(24)) / p(208);
    rgb = [lerp(GRAD_TOP[0], GRAD_BOTTOM[0], t), lerp(GRAD_TOP[1], GRAD_BOTTOM[1], t), lerp(GRAD_TOP[2], GRAD_BOTTOM[2], t)];
  }
  const onCard = inRoundRect(x, y, px, py, pw, ph, pr);
  const onCut = inTri(x, y, cut[0], cut[1], cut[2]);
  if (onCard && !onCut) {
    rgb = [255, 255, 255];
  }
  if (inTri(x, y, flap[0], flap[1], flap[2])) {
    rgb = [255, 255, 255];
  }
  if (rgb && onCard && !onCut && inRoundRect(x, y, p(82), p(100), p(92), p(15), p(7.5))) {
    rgb = LINE;
  }
  if (rgb && onCard && !onCut && inRoundRect(x, y, p(82), p(128), p(92), p(15), p(7.5))) {
    rgb = LINE;
  }
  if (rgb && onCard && !onCut && inRoundRect(x, y, p(82), p(156), p(58), p(15), p(7.5))) {
    rgb = LINE;
  }
  return rgb;
}

function renderPng(size) {
  const u = size / BASE;
  const raw = Buffer.alloc(size * size * 4);
  const step = 1 / SAMPLES;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let covered = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const c = paint(x + (sx + 0.5) * step, y + (sy + 0.5) * step, u);
          if (c) {
            covered++;
            sumR += c[0];
            sumG += c[1];
            sumB += c[2];
          }
        }
      }
      const i = (y * size + x) * 4;
      raw[i] = covered ? Math.round(sumR / covered) : 0;
      raw[i + 1] = covered ? Math.round(sumG / covered) : 0;
      raw[i + 2] = covered ? Math.round(sumB / covered) : 0;
      raw[i + 3] = Math.round((covered / (SAMPLES * SAMPLES)) * 255);
    }
  }
  return makePng(raw, size);
}

const png256 = renderPng(BASE);
writeFileSync(path.join(outDir, "app-icon.png"), png256);

function makeIco(pngs) {
  const count = pngs.length;
  const entries = [];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  for (const size of pngs.map((p) => p.size)) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry.writeUInt16LE(1, 6);
    entry.writeUInt16LE(32, 8);
    entry.writeUInt32LE(pngs.find((p) => p.size === size).png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += pngs.find((p) => p.size === size).png.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.png)]);
}

const sizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = sizes.map((size) => ({ size, png: renderPng(size) }));
writeFileSync(path.join(outDir, "app-icon.ico"), makeIco(pngs));

console.log("icons written to", outDir);