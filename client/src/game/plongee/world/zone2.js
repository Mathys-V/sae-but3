import {
  spawnPieuvre,
  spawnPoissonLanterne,
  spawnSireneEpee,
  spawnSireneMage,
  spawnPoissonExplosif,
  spawnMine,
} from "../entities/ennemies/monsters.js";

/**
 * Peuple la Zone 2 (3 000 m à 7 000 m - Cités & Cavernes) avec des menaces marines :
 * sirènes guerrières, sirènes mages, pieuvres géantes, poissons-lanternes et mines flottantes.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} borderLeft - Limite X gauche d'apparition.
 * @param {number} borderRight - Limite X droite d'apparition.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 */
export function populateZone2(k, borderLeft, borderRight, player) {
  const ZONE2_START_Y = 3000;
  const ZONE2_END_Y = 7000;

  // Créatures des cavernes & cités sous-marines (densité optimisée)
  const SIRENES_EPEE_COUNT = 8;
  const SIRENES_MAGE_COUNT = 6;
  const POISSONS_EXPLOSIFS_COUNT = 8;
  const PIEUVRES_COUNT = 8;
  const LANTERNES_COUNT = 8;
  const MINES_COUNT = 8;

  for (let i = 0; i < SIRENES_EPEE_COUNT; i++) {
    spawnSireneEpee(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      player,
    );
  }

  for (let i = 0; i < SIRENES_MAGE_COUNT; i++) {
    spawnSireneMage(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      player,
    );
  }

  for (let i = 0; i < POISSONS_EXPLOSIFS_COUNT; i++) {
    spawnPoissonExplosif(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      player,
    );
  }

  for (let i = 0; i < PIEUVRES_COUNT; i++) {
    spawnPieuvre(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      player,
    );
  }

  for (let i = 0; i < LANTERNES_COUNT; i++) {
    spawnPoissonLanterne(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      player,
    );
  }

  for (let i = 0; i < MINES_COUNT; i++) {
    spawnMine(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE2_START_Y, ZONE2_END_Y),
      false,
    );
  }
}
