import kaplay from "kaplay";
import { setupPlayer } from "../entities/player.js";
import { setupOceanBoundaries } from "../world/map.js";
import { setupUI } from "./ui.js";
import { setupSolids } from "../obstacles/solids.js";

export function initDivingGame(canvasElement) {
  const k = kaplay({
    canvas: canvasElement,
    width: 1024,
    height: 768,
    background: [25, 116, 186],
    global: false,
  });

  k.setGravity(1400);
  //k.debug.inspect = true; // pour le debug : montre les hitboxes et les points d'ancrage

  // --- 1. CHARGEMENT DES ASSETS (Chemins mis à jour selon la nouvelle structure) ---

  // Environnements
  k.loadSprite(
    "bg-surface",
    "/assets/plongee/env/backgrounds/surface_ocean_jour.png",
  );
  k.loadSprite(
    "bg-zone2",
    "/assets/plongee/env/backgrounds/background_profondeur2.png",
  );
  k.loadSprite(
    "midground-zone2",
    "/assets/plongee/env/backgrounds/midground_profondeur2.png",
  );
  k.loadSprite(
    "bg-zone3",
    "/assets/plongee/env/backgrounds/orig_profondeur3.png",
  );

  // Joueur
  k.loadSprite("diver-swim", "/assets/plongee/player/player-swiming.png", {
    sliceX: 7,
    sliceY: 1,
    anims: { swim: { from: 0, to: 6, loop: true, speed: 8 } },
  });

  k.loadSprite("diver-idle", "/assets/plongee/player/player-idle.png", {
    sliceX: 6,
    sliceY: 1,
    anims: { idle: { from: 0, to: 5, loop: true, speed: 4 } },
  });

  // Ennemis (fishes & monsters)
  k.loadSprite("fish-small", "/assets/plongee/enemies/fishes/fish.png");
  k.loadSprite("mine", "/assets/plongee/enemies/monsters/mine.png");

  // Sons
  k.loadSound("bgm-dive", "/assets/plongee/sounds/watery_cave_loop.ogg");

  // Items & Objets interactifs
  k.loadSprite("boat", "/assets/plongee/items/Boat.png");
  k.loadSprite("barrel-empty", "/assets/plongee/items/Fishbarrel3.png");
  k.loadSprite("barrel-full", "/assets/plongee/items/Fishbarrel4.png");

  k.loadSprite("bouee", "/assets/plongee/items/bouee_de_mer.png");
  k.loadSprite("chain", "/assets/plongee/items/chain.png");

  k.loadSprite("rock-fond1", "/assets/plongee/items/rocher-fond1.png");
  k.loadSprite("rock-fond2", "/assets/plongee/items/rocher-fond2.png");
  k.loadSprite("rock-fond3", "/assets/plongee/items/rocher-fond3.png");
  k.loadSprite(
    "rock-under1",
    "/assets/plongee/items/rocher-fond-sous-map1.png",
  );
  k.loadSprite(
    "rock-under2",
    "/assets/plongee/items/rocher-fond-sous-map2.png",
  );

  k.scene("dive", () => {
    k.play("bgm-dive", { loop: true, volume: 0.5 });
    setupOceanBoundaries(k);
    const localPlayer = setupPlayer(k, 0, 150);
    setupUI(k, localPlayer);
    setupSolids(k, localPlayer); // doit être appelé AVANT la caméra et le filet

    // Filet de sécurité : le joueur ne peut jamais sortir de la zone
    const PLAYABLE_WIDTH = 16000; // même valeur que terrain.js
    const OCEAN_DEPTH = 6000;
    const FLOOR_RAISE = 90; // même valeur que terrain.js
    const MARGIN = 20;

    const MIN_X = -PLAYABLE_WIDTH / 2 + MARGIN;
    const MAX_X = PLAYABLE_WIDTH / 2 - MARGIN;
    const MAX_Y = OCEAN_DEPTH - FLOOR_RAISE - MARGIN; // au-dessus du sol invisible

    k.onUpdate(() => {
      localPlayer.pos.x = k.clamp(localPlayer.pos.x, MIN_X, MAX_X);
      if (localPlayer.pos.y > MAX_Y) {
        localPlayer.pos.y = MAX_Y;
        if (localPlayer.vel) localPlayer.vel.y = 0;
      }
    });

    // --- LOGIQUE DE LA CAMÉRA DYNAMIQUE ---
    const SKY_TOP = -1296;
    const WATER_LEVEL = 0;
    const TRANSITION = 500;
    const SKY_MARGIN = 150;

    k.onUpdate(() => {
      const t = k.clamp(
        1 - (localPlayer.pos.y - WATER_LEVEL) / TRANSITION,
        0,
        1,
      );
      const viewH = Math.abs(SKY_TOP) + SKY_MARGIN;
      const zoomSurface = k.height() / viewH;
      k.camScale(k.lerp(1, zoomSurface, t));

      const surfaceCenterY = (SKY_TOP + SKY_MARGIN) / 2;
      const camY = k.lerp(localPlayer.pos.y, surfaceCenterY, t);

      k.camPos(localPlayer.pos.x, camY);
    });
  });

  k.go("dive");
  return () => k.quit();
}
