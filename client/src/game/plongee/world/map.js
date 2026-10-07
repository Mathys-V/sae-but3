export function setupOceanBoundaries(k) {
  const OCEAN_WIDTH = 12000;

  const WATER_LEVEL = 0;
  const ZONE1_END = 1500;
  const ZONE2_END = 3500;
  const OCEAN_DEPTH = 6000;

  // --- 1. LE CIEL ET LA SURFACE (Méthode de base initiale) ---
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
  // Zone 1 (0 à 150m) : Eau claire
  k.add([
    k.rect(OCEAN_WIDTH, ZONE1_END),
    k.pos(-OCEAN_WIDTH / 2, WATER_LEVEL),
    k.color(0, 180, 255),
    k.opacity(0.15),
    k.z(-94),
  ]);

  // Zone 3 Abyssale (350m à 600m) : Le sable + Filtre noir
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

  // 4.1 Le Bateau de départ (remplace l'ancien radeau rectangulaire)
  const boat = k.add([
    k.sprite("boat"),
    k.scale(3),
    // On ajoute +12 pour "enfoncer" légèrement la coque dans l'eau
    k.pos(0, WATER_LEVEL + 12),
    k.anchor("bot"),
    k.area(),
    k.body({ isStatic: true }),
    k.z(10), // 👈 NOUVEAU : On donne un Z-index élevé au bateau pour qu'il soit au premier plan
    "boat",
  ]);

  // 4.2 Le Tonneau / Inventaire commun posé sur le bateau
  const sharedBarrel = k.add([
    k.sprite("barrel-empty"),
    // On descend aussi le tonneau de quelques pixels pour qu'il suive le bateau
    k.pos(-40, WATER_LEVEL - 5),
    k.anchor("bot"),
    k.area(),
    k.z(5), // 👈 NOUVEAU : Z-index inférieur à celui du bateau (10). Il s'affichera donc "derrière" la coque !
    "inventory-barrel",
    k.scale(2),
  ]);

  k.add([
    k.rect(50, OCEAN_DEPTH + 1000),
    k.pos(-OCEAN_WIDTH / 2, -1000),
    k.area(),
    k.body({ isStatic: true }),
  ]);
  k.add([
    k.rect(50, OCEAN_DEPTH + 1000),
    k.pos(OCEAN_WIDTH / 2, -1000),
    k.area(),
    k.body({ isStatic: true }),
  ]);
  k.add([
    k.rect(OCEAN_WIDTH, 50),
    k.pos(-OCEAN_WIDTH / 2, OCEAN_DEPTH),
    k.color(10, 10, 15),
    k.area(),
    k.body({ isStatic: true }),
  ]);
}
