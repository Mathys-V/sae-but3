import {
  spawnBossRequin,
  spawnRequinMarteau,
  spawnRequinTigre,
  spawnMonstreLance,
  spawnPoissonExplosif,
  spawnPoissonLanterne,
  spawnSireneMage,
  spawnMine,
} from "../entities/ennemies/monsters.js";

/**
 * Peuple la Zone 3 (7 000 m à 12 000 m - Abysses Sombres) avec les prédateurs d'élite,
 * requins géants, lanciers lourds et le Boss Requin dans son antre à 10 500 m.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} borderLeft - Limite X gauche d'apparition.
 * @param {number} borderRight - Limite X droite d'apparition.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 */
export function populateZone3(k, borderLeft, borderRight, player) {
  const ZONE3_START_Y = 7000;
  const ZONE3_END_Y = 11200;

  // Créatures d'élite des abysses sombres (densité optimisée)
  const MONSTRES_LANCE_COUNT = 8;
  const SIRENES_MAGE_COUNT = 6;
  const POISSONS_EXPLOSIFS_COUNT = 8;
  const LANTERNES_COUNT = 10;
  const MINES_LOURDES_COUNT = 8;

  // --- LES 3 REQUINS PREDATEURS RARES DE LA ZONE 3 ---
  // 2 Requins Marteaux et 1 Requin Tigre
  spawnRequinMarteau(k, k.rand(borderLeft, -1500), k.rand(7600, 9200), player);
  spawnRequinMarteau(k, k.rand(1500, borderRight), k.rand(8400, 9800), player);
  spawnRequinTigre(k, k.rand(-3000, 3000), k.rand(8000, 9600), player);

  for (let i = 0; i < MONSTRES_LANCE_COUNT; i++) {
    spawnMonstreLance(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE3_START_Y, ZONE3_END_Y),
      player,
    );
  }

  for (let i = 0; i < SIRENES_MAGE_COUNT; i++) {
    spawnSireneMage(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE3_START_Y, ZONE3_END_Y),
      player,
    );
  }

  for (let i = 0; i < POISSONS_EXPLOSIFS_COUNT; i++) {
    spawnPoissonExplosif(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE3_START_Y, ZONE3_END_Y),
      player,
    );
  }

  for (let i = 0; i < LANTERNES_COUNT; i++) {
    spawnPoissonLanterne(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE3_START_Y, ZONE3_END_Y),
      player,
    );
  }

  for (let i = 0; i < MINES_LOURDES_COUNT; i++) {
    spawnMine(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE3_START_Y, ZONE3_END_Y),
      true, // Mines géantes à haut dégât
    );
  }

  // ==========================================
  // 🔱 LE BOSS FINAL UNIQUE : LE BOSS REQUIN 🔱
  // Placé dans l'antre des abysses à 10 500 mètres
  // ==========================================
  spawnBossRequin(k, 0, 10500, player);
}
