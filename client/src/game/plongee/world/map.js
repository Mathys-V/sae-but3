import { setupTerrain } from "../obstacles/terrain.js";
import { stats } from "../entities/stats.js";

/**
 * Configure les arrière-plans défilants, les filtres d'ambiance marine par zone,
 * le navire à la surface, le plancher solide, le tonneau d'inventaire et le PNJ marchand.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 */
export function setupOceanBoundaries(k) {
  const OCEAN_WIDTH = 20000; // doit être > PLAYABLE_WIDTH (16000)

  const WATER_LEVEL = 0;
  const ZONE1_END = 3000;
  const ZONE2_END = 7000;
  const OCEAN_DEPTH = 12000;

  // --- 1. LE CIEL ET LA SURFACE ---
  k.add([
    k.sprite("bg-surface", { width: OCEAN_WIDTH, height: 1296, tiled: true }),
    k.pos(-OCEAN_WIDTH / 2, -1296),
    k.z(-100),
  ]);

  // --- 2. LES CORAUX ET FONDS MARINS (scale 2x pour un 60 FPS fluide) ---
  k.add([
    k.sprite("bg-zone2", {
      width: OCEAN_WIDTH / 2,
      height: OCEAN_DEPTH / 2,
      tiled: true,
    }),
    k.scale(2),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.z(-99),
  ]);

  k.add([
    k.sprite("midground-zone2", {
      width: OCEAN_WIDTH / 2,
      height: OCEAN_DEPTH / 2,
      tiled: true,
    }),
    k.scale(2),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.z(-95),
  ]);

  // --- 3. FILTRES D'AMBIANCE DE PROFONDEUR ---
  // Zone 1 : Filtre turquoise ensoleillé
  k.add([
    k.rect(OCEAN_WIDTH, ZONE1_END),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.color(0, 180, 255),
    k.opacity(0.12),
    k.z(-94),
  ]);

  // Zone 2 : Filtre bleu profond
  k.add([
    k.rect(OCEAN_WIDTH, ZONE2_END - ZONE1_END),
    k.pos(-OCEAN_WIDTH / 2, ZONE1_END),
    k.color(10, 50, 120),
    k.opacity(0.35),
    k.z(-94),
  ]);

  // Zone 3 : Filtre sombre abyssal uniforme sur toute la profondeur
  k.add([
    k.rect(OCEAN_WIDTH, OCEAN_DEPTH - ZONE2_END),
    k.pos(-OCEAN_WIDTH / 2, ZONE2_END),
    k.color(2, 6, 18),
    k.opacity(0.72),
    k.z(-94),
  ]);

  // --- 4. LA BARQUE, LE PLANCHER SOLIDE ET LE MARCHAND PÊCHEUR ---
  // Visuel du bateau agrandi (scale 4)
  k.add([
    k.sprite("boat"),
    k.scale(4),
    k.pos(0, WATER_LEVEL + 15),
    k.anchor("bot"),
    k.z(10),
    "boat",
  ]);

  // Plancher solide dédié : sous les pieds du joueur sur la barque à y = -46 (évite toute éjection et maintient les pieds sur le plancher)
  k.add([
    k.rect(235, 18),
    k.pos(0, -46),
    k.anchor("top"),
    k.opacity(0),
    k.area(),
    "solid",
    "boat-floor",
  ]);

  // Le Tonneau de stockage (à gauche sur le plancher de la barque, agrandi à scale 2.8)
  const barrelSprite =
    stats.barrelInventory && stats.barrelInventory.length > 0
      ? "barrel-full"
      : "barrel-empty";

  k.add([
    k.sprite(barrelSprite),
    k.pos(-78, WATER_LEVEL - 8),
    k.anchor("bot"),
    k.area(),
    k.z(9),
    "inventory-barrel",
    k.scale(2.8),
  ]);

  // Le Pêcheur Marchand (reculé à x = 82 pour que son personnage apparaisse bien à droite sur la barque, agrandi à scale 2.8)
  const fisherman = k.add([
    k.sprite("fisherman-idle"),
    k.pos(82, WATER_LEVEL - 10),
    k.anchor("bot"),
    k.area(),
    k.z(9),
    k.scale(2.8),
    "npc",
    "fisherman",
    "merchant",
    {
      hurt() {
        fisherman.use(k.sprite("fisherman-hurt"));
        fisherman.use(k.scale(2.8));
        fisherman.play("hurt");
        k.wait(0.35, () => {
          fisherman.use(k.sprite("fisherman-idle"));
          fisherman.use(k.scale(2.8));
          fisherman.play("idle");
        });
      },
    },
  ]);
  fisherman.play("idle");

  // --- 5. LIMITES DU TERRAIN (Bouées, chaînes et murs invisibles) ---
  setupTerrain(k, WATER_LEVEL, OCEAN_DEPTH);
}
