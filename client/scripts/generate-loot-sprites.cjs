// client/scripts/generate-loot-sprites.js
// Générateur de sprites Pixel Art 16x16 pour tous les butins sous-marins

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function createPng(width, height, rgbaBuffer) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk("IHDR", ihdrData);

  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (1 + width * 4);
    scanlines[scanlineOffset] = 0;
    rgbaBuffer.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = createChunk("IDAT", compressed);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function hexToRgba(hex) {
  if (hex === "." || !hex) return [0, 0, 0, 0];
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.substring(0, 2), 16);
  const g = Number.parseInt(clean.substring(2, 4), 16);
  const b = Number.parseInt(clean.substring(4, 6), 16);
  const a = clean.length === 8 ? Number.parseInt(clean.substring(6, 8), 16) : 255;
  return [r, g, b, a];
}

function gridToPng(gridStr, palette) {
  const lines = gridStr.trim().split("\n").map(l => l.trim());
  const height = lines.length;
  const width = lines[0].length;
  const buf = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = lines[y][x];
      const hex = palette[char] || ".";
      const [r, g, b, a] = hexToRgba(hex);
      const idx = (y * width + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = a;
    }
  }

  return createPng(width, height, buf);
}

// ============================================================
// DEFINITION DES 11 SPRITES PIXEL ART 16x16
// ============================================================

// 1. Chair d'anguille
const anguilleMeatGrid = `
................
....KKKKKK......
...KPPRRPPKK....
..KPRRRRRRPPK...
.KPRRWWWRRRRPK..
.KRRRWWWWWRRRK..
.KRRWWKBWWWRRK..
.KRRWWBKBWWRRK..
.KRRRWWWWWRRRK..
.KPRRWWWRRRRPK..
..KPRRRRRRPPK...
...KPPRRPPKK....
....KKKKKK......
................
................
................
`;
const anguilleMeatPalette = {
  ".": ".",
  K: "#4a0404",
  P: "#f43f5e",
  R: "#e11d48",
  W: "#fecdd3",
  B: "#ffffff"
};

// 2. Filament de méduse
const jellyFilamentGrid = `
................
.....KKKKKK.....
...KKMMCCMMKK...
..KMCCCCCCCCMK..
..KCCCCCCCCCCK..
.KMCCCCCCCCCCMK.
.KCCCCCCCCCCCCK.
.KMMCCMMMMCCMMK.
..KKKKKKKKKKKK..
...KMK.KMK.KMK..
...KCK..KCK.KCK.
...KMK..KMK.KMK.
...KCK.KCK..KCK.
....K...K....K..
................
................
`;
const jellyFilamentPalette = {
  ".": ".",
  K: "#581c87",
  M: "#d946ef",
  C: "#38bdf8"
};

// 3. Écaille de tortue
const turtleShellGrid = `
................
....KKKKKKKK....
...KGGEEGGGEK...
..KGEEEEEGGEEK..
.KGEYEEEYEEGEYK.
.KGEEYEEYEEYEEK.
.KGEEEYEYEEEYEK.
.KGEYEEEEEYEEYK.
.KGEEEYEYEEEYEK.
.KGEYEEEYEEGEYK.
..KGEEEEEGGEEK..
...KGGEEGGGEK...
....KKKKKKKK....
................
................
................
`;
const turtleShellPalette = {
  ".": ".",
  K: "#064e3b",
  G: "#047857",
  E: "#10b981",
  Y: "#fde047"
};

// 4. Tentacule de pieuvre
const pieuvreTentacleGrid = `
................
........KKKK....
.......KPVVVK...
......KPVVVVK...
.....KPVVVVVK...
....KPVVVVVVK...
...KPVVWWVVVK...
...KPVWWWWVVK...
...KPVVWWVVVK...
...KPVVVVVVVK...
....KPVVVVWWK...
....KPVVVWWWK...
.....KPVVVWWK...
......KKKKKK....
................
................
`;
const pieuvreTentaclePalette = {
  ".": ".",
  K: "#3b0764",
  P: "#c084fc",
  V: "#9333ea",
  W: "#fdf4ff"
};

// 5. Lanterne abyssale
const lanternGrid = `
................
.......KK.......
......KYYK......
.....KYYYYK.....
....KKBBBBKK....
...KBYYYYYYBK...
..KBYWWWWWWYBK..
..KBYWWWWWWYBK..
..KBYWWWWWWYBK..
...KBYYYYYYBK...
....KKBBBBKK....
......KYYK......
.......KK.......
................
................
................
`;
const lanternPalette = {
  ".": ".",
  K: "#713f12",
  Y: "#eab308",
  B: "#ca8a04",
  W: "#fef9c3"
};

// 6. Écaille de sirène
const sirenScaleGrid = `
................
....KKKKKKKK....
...KCCMMMMCCK...
..KCMMTTCCTMMK..
.KCMMTTTTTTMMCK.
.KCMMTTTTTTMMCK.
.KMMTTTTTTTTMMK.
.KMMTTTTTTTTMMK.
..KMMTTTTTTMMK..
..KMMTTTTTTMMK..
...KMMTTTTMMK...
...KCMMTTMMCK...
....KCCMMCCK....
.....KKKKKK.....
................
................
`;
const sirenScalePalette = {
  ".": ".",
  K: "#042f2e",
  C: "#2dd4bf",
  M: "#14b8a6",
  T: "#0d9488"
};

// 7. Perle des abysses
const magicPearlGrid = `
................
.....KKKKKK.....
...KKVVPWWVKK...
..KVPPPPWWPPVK..
.KVPPPPPPWWPPVK.
.KVPPPPPPPPPPVK.
.KVPPPPPPPPPPVK.
.KVPPPPPPPPPPVK.
.KVPPPPPPPPPPVK.
.KVPPPPPPPPPPVK.
..KVPPPPPPPPVK..
...KKVVPPVVKK...
.....KKKKKK.....
................
................
................
`;
const magicPearlPalette = {
  ".": ".",
  K: "#2e1065",
  V: "#7c3aed",
  P: "#c084fc",
  W: "#ffffff"
};

// 8. Poudre explosive
const explosiveDustGrid = `
................
......KKKK......
.....KYYYYK.....
....KYYWWYYK....
...KOOOOOOOOK...
..KOOORRRROOOK..
.KOOORRRRRROOOK.
.KOORRWWWRRROOK.
.KOORWWWWWWRROK.
.KOORRWWWRRROOK.
.KOOORRRRRROOOK..
..KOOORRRROOOK..
...KOOOOOOOOK...
....KKKKKKKK....
................
................
`;
const explosiveDustPalette = {
  ".": ".",
  K: "#431407",
  Y: "#f59e0b",
  W: "#fef08a",
  O: "#ea580c",
  R: "#b91c1c"
};

// 9. Pointe de trident
const tridentTipGrid = `
................
...K...KK...K...
..KYK.KYYK.KYK..
..KYK.KYYK.KYK..
..KYKKKYYKKKYK..
..KYYYYYYYYYYK..
...KYYYYYYYYK...
....KYYYYYYK....
....KYYYYYYK....
.....KYYYYK.....
.....KYYYYK.....
......KYYK......
......KYYK......
......KYYK......
.......KK.......
................
`;
const tridentTipPalette = {
  ".": ".",
  K: "#78350f",
  Y: "#facc15"
};

// 10. Dent de requin
const sharkToothGrid = `
................
....KKKKKKKK....
...KRRRRRRRRK...
...KRRRDDDRRK...
..KKWWWWWWWWKK..
..KWWWWWWWWWDK..
..KWWWWWWWWWDK..
...KWWWWWWWDK...
...KWWWWWWWDK...
....KWWWWWDK....
....KWWWWWDK....
.....KWWWDK.....
.....KWWWDK.....
......KWDK......
.......KK.......
................
`;
const sharkToothPalette = {
  ".": ".",
  K: "#1f2937",
  R: "#4b5563",
  D: "#9ca3af",
  W: "#f9fafb"
};

// 11. Trophée du Boss Requin
const sharkKingToothGrid = `
................
...K.K.KK.K.K...
...KYKYRRYKYK...
..KYYYYRRYYYYK..
..KYYYYYYYYYYK..
.KYYYYYYYYYYYYK.
.KYYWWWYYWWYYYK.
.KYYWWBWWWWBYYK.
..KYYWWWWWWYYK..
..KYYYYYYYYYYK..
...KYYYYYYYYK...
...KYYYYYYYYK...
....KYYYYYYK....
.....KYYYYK.....
......KYYK......
.......KK.......
`;
const sharkKingToothPalette = {
  ".": ".",
  K: "#713f12",
  Y: "#eab308",
  R: "#ef4444",
  W: "#fef08a",
  B: "#ffffff"
};

const items = [
  { name: "loot_anguille_meat.png", grid: anguilleMeatGrid, pal: anguilleMeatPalette },
  { name: "loot_jelly_filament.png", grid: jellyFilamentGrid, pal: jellyFilamentPalette },
  { name: "loot_turtle_shell.png", grid: turtleShellGrid, pal: turtleShellPalette },
  { name: "loot_pieuvre_tentacle.png", grid: pieuvreTentacleGrid, pal: pieuvreTentaclePalette },
  { name: "loot_lantern.png", grid: lanternGrid, pal: lanternPalette },
  { name: "loot_siren_scale.png", grid: sirenScaleGrid, pal: sirenScalePalette },
  { name: "loot_magic_pearl.png", grid: magicPearlGrid, pal: magicPearlPalette },
  { name: "loot_explosive_dust.png", grid: explosiveDustGrid, pal: explosiveDustPalette },
  { name: "loot_trident_tip.png", grid: tridentTipGrid, pal: tridentTipPalette },
  { name: "loot_shark_tooth.png", grid: sharkToothGrid, pal: sharkToothPalette },
  { name: "loot_shark_king_tooth.png", grid: sharkKingToothGrid, pal: sharkKingToothPalette },
];

const outDir = path.resolve(__dirname, "../public/assets/plongee/items/loots");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const it of items) {
  const pngData = gridToPng(it.grid, it.pal);
  fs.writeFileSync(path.join(outDir, it.name), pngData);
  console.log(`✓ Generated ${it.name} (${pngData.length} bytes)`);
}

console.log("All 11 pixel-art loot sprites generated successfully!");
