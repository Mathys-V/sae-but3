import {
  spawnAnguille,
  spawnMeduse,
  spawnTortue,
} from "../entities/ennemies/fishes.js";

/**
 * Peuple la Zone 1 (Surface à 3 000 m) avec des créatures pacifiques et défensives :
 * anguilles électriques, méduses dérivantes et tortues marines protectrices.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} borderLeft - Limite X gauche d'apparition.
 * @param {number} borderRight - Limite X droite d'apparition.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 */
export function populateZone1(k, borderLeft, borderRight, player) {
  const ZONE1_START_Y = 200;
  const ZONE1_END_Y = 3000;

  // Faune équilibrée et fluide pour la Zone 1
  const ANGUILLES_COUNT = 18;
  const MEDUSES_COUNT = 14;
  const TORTUES_COUNT = 6;

  for (let i = 0; i < ANGUILLES_COUNT; i++) {
    spawnAnguille(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
      player,
    );
  }

  for (let i = 0; i < MEDUSES_COUNT; i++) {
    spawnMeduse(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
      player,
    );
  }

  for (let i = 0; i < TORTUES_COUNT; i++) {
    spawnTortue(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
      player,
    );
  }
}
