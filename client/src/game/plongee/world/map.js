import { setupTerrain } from "../obstacles/terrain.js";

export function setupOceanBoundaries(k) {
  const OCEAN_WIDTH = 20000; // doit être > PLAYABLE_WIDTH (16000)

  const WATER_LEVEL = 0;
  const ZONE1_END = 1500;
  const ZONE2_END = 3500;
  const OCEAN_DEPTH = 6000;

  // --- 1. LE CIEL ET LA SURFACE ---
  k.add([
    k.sprite("bg-surface", { width: OCEAN_WIDTH, height: 1296, tiled: true }),
    k.pos(-OCEAN_WIDTH / 2, -1296),
    k.z(-100),
  ]);

  // --- 2. LES CORAUX (De la surface à la Zone 3) ---
  k.add([
    k.sprite("bg-zone2", {
      width: OCEAN_WIDTH,
      height: ZONE2_END,
      tiled: true,
    }),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.z(-99),
  ]);
  k.add([
    k.sprite("midground-zone2", {
      width: OCEAN_WIDTH,
      height: ZONE2_END,
      tiled: true,
    }),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.z(-95),
  ]);

  // --- 3. FILTRES DE PROFONDEUR ET ABYSSES ---
  k.add([
    k.rect(OCEAN_WIDTH, ZONE1_END),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.color(0, 180, 255),
    k.opacity(0.15),
    k.z(-94),
  ]);

  k.add([
    k.sprite("bg-zone3", { width: OCEAN_WIDTH, height: 324, tiled: true }),
    k.pos(-OCEAN_WIDTH / 2, OCEAN_DEPTH - 324),
    k.z(-96),
  ]);
  k.add([
    k.rect(OCEAN_WIDTH, OCEAN_DEPTH - ZONE2_END),
    k.pos(-OCEAN_WIDTH / 2, ZONE2_END),
    k.color(5, 5, 20),
    k.opacity(0.85),
    k.z(-94),
  ]);

  // --- 4. PHYSIQUE ET COLLISIONS ---
  k.add([
    k.sprite("boat"),
    k.scale(3),
    k.pos(0, WATER_LEVEL + 12),
    k.anchor("bot"),
    k.area(),
    k.z(10),
    "solid", // à la place de k.body({ isStatic: true })
    "boat",
  ]);

  k.add([
    k.sprite("barrel-empty"),
    k.pos(-40, WATER_LEVEL - 5),
    k.anchor("bot"),
    k.area(),
    k.z(5),
    "inventory-barrel",
    k.scale(2),
  ]);

  // --- 5. LIMITES DU TERRAIN (Bouées, chaînes et murs invisibles) ---

  setupTerrain(k, WATER_LEVEL, OCEAN_DEPTH);
}
