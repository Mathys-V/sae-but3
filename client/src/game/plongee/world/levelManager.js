import { populateZone1 } from "./zone1.js";
import { populateZone2 } from "./zone2.js";
import { populateZone3 } from "./zone3.js";

/**
 * Coordonne la génération procédurale et la répartition des créatures marines, monstres
 * et dangers sur l'intégralité des trois strates de profondeur de l'océan.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 */
export function populateOcean(k, player) {
  // Limites de la zone jouable (Marge de 200px avant les murs invisibles de 3000px)
  const BORDER_LEFT = -7800;
  const BORDER_RIGHT = 7800;

  // --- GÉNÉRATION DES ZONES ---
  populateZone1(k, BORDER_LEFT, BORDER_RIGHT, player);
  populateZone2(k, BORDER_LEFT, BORDER_RIGHT, player);
  populateZone3(k, BORDER_LEFT, BORDER_RIGHT, player);
}
