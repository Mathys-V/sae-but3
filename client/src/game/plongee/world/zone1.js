import {
  spawnAnguille,
  spawnMeduse,
  spawnTortue,
} from "../entities/ennemies/fishes.js";

export function populateZone1(k, borderLeft, borderRight) {
  const ZONE1_START_Y = 200;
  const ZONE1_END_Y = 3000; // 👈 On double la limite basse de spawn

  // 👈 On multiplie les quantités pour remplir cet immense océan
  const ANGUILLES_COUNT = 60;
  const MEDUSES_COUNT = 50;
  const TORTUES_COUNT = 25;

  for (let i = 0; i < ANGUILLES_COUNT; i++) {
    spawnAnguille(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
    );
  }

  for (let i = 0; i < MEDUSES_COUNT; i++) {
    spawnMeduse(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
    );
  }

  for (let i = 0; i < TORTUES_COUNT; i++) {
    spawnTortue(
      k,
      k.rand(borderLeft, borderRight),
      k.rand(ZONE1_START_Y, ZONE1_END_Y),
    );
  }
}
