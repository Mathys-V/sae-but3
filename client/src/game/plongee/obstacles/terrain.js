/**
 * Construit les obstacles physiques de délimitation du terrain : bouées flottantes,
 * chaînes d'ancrage, murs invisibles verticaux et plancher sous-marin.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} waterLevel - Niveau Y de la surface de l'eau (0).
 * @param {number} oceanDepth - Profondeur maximale de l'océan (12 000).
 */
export function setupTerrain(k, waterLevel, oceanDepth) {
  // ================= PARAMÈTRES À RÉGLER =================
  const PLAYABLE_WIDTH = 16000; // largeur jouable (garde OCEAN_WIDTH de map.js > cette valeur)

  // Bouée
  const BUOY_SCALE = 1; // taille du sprite
  const BUOY_Y_OFFSET = 8; // + = descend la bouée (px)

  const BUOY_HIT_Y = 0; // décalage vertical fin de la hitbox (+ = descend)

  // Mur invisible
  const WALL_THICKNESS = 400;
  const WALL_TOP = -3000; // jusqu'où le mur monte dans le ciel (< -1296)

  // Chaîne
  const CHAIN_WIDTH = 16;
  const CHAIN_Y_OFFSET = -8;

  // Le sol invisible
  const FLOOR_RAISE = 90; // px dont on remonte le sol invisible (+ = plus haut)
  // =======================================================

  const BORDER_LEFT = -PLAYABLE_WIDTH / 2;
  const BORDER_RIGHT = PLAYABLE_WIDTH / 2;
  const wallHeight = oceanDepth - WALL_TOP + 1000;

  const buildBorder = (x, side) => {
    // side : -1 = gauche, +1 = droite

    // 1. Chaîne (centrée sur x)
    k.add([
      k.sprite("chain", {
        width: CHAIN_WIDTH,
        height: oceanDepth,
        tiled: true,
      }),
      k.pos(x, waterLevel + BUOY_Y_OFFSET + CHAIN_Y_OFFSET),
      k.anchor("top"),
      k.z(-50),
    ]);

    // 2. Bouée (visuel seul, sans area)
    k.add([
      k.sprite("bouee"),
      k.scale(BUOY_SCALE),
      k.pos(x, waterLevel + BUOY_Y_OFFSET),
      k.anchor("bot"),
      k.z(-49),
    ]);

    // 3. Hitbox de la bouée : un rectangle par étage du pixel art
    //    w, h en pixels du sprite ; up = distance entre le bas de la bouée
    //    et le bas de l'étage
    const BUOY_PARTS = [
      { w: 250, h: 95, up: 0 }, // base large rouge
      { w: 160, h: 55, up: 95 }, // pied gris (les "pinces")
      { w: 150, h: 110, up: 150 }, // pied gris 2e partie
      { w: 130, h: 120, up: 260 }, // haut rouge
    ];

    const buoyBottomY = waterLevel + BUOY_Y_OFFSET + BUOY_HIT_Y;

    for (const part of BUOY_PARTS) {
      k.add([
        k.rect(part.w * BUOY_SCALE, part.h * BUOY_SCALE),
        k.pos(x, buoyBottomY - part.up * BUOY_SCALE),
        k.anchor("bot"),
        k.opacity(0),
        k.area(),
        "solid",
      ]);
    }

    // 4. Mur invisible, qui monte jusque dans le ciel
    //    Placé côté extérieur pour que le joueur sur la bouée ne sorte pas
    k.add([
      k.rect(WALL_THICKNESS, wallHeight),
      k.pos(x + side * (WALL_THICKNESS / 2), WALL_TOP),
      k.anchor("top"),
      k.opacity(0),
      k.area(),
      "solid",
    ]);
  };

  buildBorder(BORDER_LEFT, -1);
  buildBorder(BORDER_RIGHT, 1);

  // Mur du fond : surface remontée de FLOOR_RAISE, le bas reste couvert
  k.add([
    k.rect(PLAYABLE_WIDTH + WALL_THICKNESS * 2, 500 + FLOOR_RAISE),
    k.pos(0, oceanDepth - FLOOR_RAISE),
    k.anchor("top"),
    k.opacity(0),
    k.area(),
    "solid",
  ]);

  setupSeabed(k, oceanDepth);
}

/**
 * Génère le décor rocheux du lit océanique avec un générateur pseudo-aléatoire à graine fixe
 * assurant un paysage sous-marin strictement identique et déterministe.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} oceanDepth - Coordonnée Y du fond de l'océan.
 */
function setupSeabed(k, oceanDepth) {
  // ================= PARAMÈTRES =================
  const SEABED_WIDTH = 20000; // = OCEAN_WIDTH de map.js
  const SCALE = 2; // pixel art 79px -> 158px à l'écran
  const ROCK_SINK = 10; // px dont les rochers s'enfoncent sous la ligne du fond
  const ROCK_OVERLAP = 20; // chevauchement entre deux rochers (px)
  const UNDER_DEPTH = 3000; // profondeur de la zone sous la map
  const ROCKS = [
    { name: "rock-fond1", w: 176 },
    { name: "rock-fond2", w: 79 },
    { name: "rock-fond3", w: 79 },
  ];
  // ==============================================

  const left = -SEABED_WIDTH / 2;

  // 1. Fond sombre de secours (au cas où une texture ne couvre pas tout)
  k.add([
    k.rect(SEABED_WIDTH, UNDER_DEPTH),
    k.pos(left, oceanDepth),
    k.color(10, 10, 15),
    k.z(-50),
  ]);

  // 2. Sous la map : sous-map1 répétée vers le bas
  const UNDER1_H = 39; // hauteur réelle du PNG sous-map1

  for (
    let y = oceanDepth;
    y < oceanDepth + UNDER_DEPTH;
    y += UNDER1_H * SCALE
  ) {
    k.add([
      k.sprite("rock-under1", {
        width: SEABED_WIDTH / SCALE,
        height: UNDER1_H,
        tiled: true,
      }),
      k.scale(SCALE),
      k.pos(left, y),
      k.z(-49),
    ]);
  }

  // 3. Bordure : rochers posés sur la ligne du fond, choisis au hasard
  //    Générateur avec graine fixe -> même fond chez tous les joueurs (multi)
  let seed = 1234;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  let x = left;
  while (x < left + SEABED_WIDTH) {
    const rock = ROCKS[Math.floor(rand() * ROCKS.length)];
    k.add([
      k.sprite(rock.name),
      k.scale(SCALE),
      k.pos(x, oceanDepth + ROCK_SINK),
      k.anchor("botleft"),
      k.z(-48),
    ]);
    x += rock.w * SCALE - ROCK_OVERLAP;
  }
}
