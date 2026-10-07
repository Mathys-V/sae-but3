import kaplay from "kaplay";
import { setupPlayer } from "./player.js";
import { setupOceanBoundaries } from "./map.js";
import { setupUI } from "./ui.js";

export function initDivingGame(canvasElement) {
  const k = kaplay({
    canvas: canvasElement,
    width: 1024,
    height: 768,
    background: [25, 116, 186],
    global: false,
  });

  k.setGravity(1400);

  // --- 1. CHARGEMENT DES ASSETS ---
  k.loadSprite("bg-surface", "/assets/plongee/env/surface_ocean_jour.png");
  k.loadSprite("bg-zone2", "/assets/plongee/env/background_profondeur2.png");
  k.loadSprite(
    "midground-zone2",
    "/assets/plongee/env/midground_profondeur2.png",
  );
  k.loadSprite("bg-zone3", "/assets/plongee/env/orig_profondeur3.png");

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

  k.loadSprite("fish-small", "/assets/plongee/enemies/fish.png");
  k.loadSprite("mine", "/assets/plongee/enemies/mine.png");

  k.loadSound("bgm-dive", "/assets/plongee/sounds/watery_cave_loop.ogg");

  k.scene("dive", () => {
    k.play("bgm-dive", { loop: true, volume: 0.5 });
    setupOceanBoundaries(k);
    const localPlayer = setupPlayer(k, 0, 150);
    setupUI(k, localPlayer);

    // --- LOGIQUE DE LA CAMÉRA DYNAMIQUE (Proposée par l'autre IA) ---
    const SKY_TOP = -1296;
    const WATER_LEVEL = 0;
    const TRANSITION = 500; // Distance sous la surface où le dézoom commence
    const SKY_MARGIN = 150; // Marge d'eau visible sous la surface

    k.onUpdate(() => {
      // t = 0 en profondeur, 1 à la surface
      const t = k.clamp(
        1 - (localPlayer.pos.y - WATER_LEVEL) / TRANSITION,
        0,
        1,
      );

      // Zoom pour voir du haut du ciel jusqu'à un peu sous l'eau
      const viewH = Math.abs(SKY_TOP) + SKY_MARGIN;
      const zoomSurface = k.height() / viewH;
      k.camScale(k.lerp(1, zoomSurface, t));

      // Centre de la caméra : joueur en profondeur -> milieu ciel/eau en surface
      const surfaceCenterY = (SKY_TOP + SKY_MARGIN) / 2;
      const camY = k.lerp(localPlayer.pos.y, surfaceCenterY, t);

      k.camPos(localPlayer.pos.x, camY);
    });
  });

  k.go("dive");
  return () => k.quit();
}
