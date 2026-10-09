import { populateZone1 } from "./zone1.js";
// On importera zone2 et zone3 plus tard

export function populateOcean(k) {
  // Limites de la zone jouable (Marge de 200px avant les murs invisibles de 3000px)
  const BORDER_LEFT = -7800;
  const BORDER_RIGHT = 7800;

  // --- GÉNÉRATION DES ZONES ---
  populateZone1(k, BORDER_LEFT, BORDER_RIGHT);

  // populateZone2(k, BORDER_LEFT, BORDER_RIGHT);
  // populateZone3(k, BORDER_LEFT, BORDER_RIGHT);
}
