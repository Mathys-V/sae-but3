import kaplay from "kaplay";
import { setupPlayer } from "../entities/player.js";
import { setupOceanBoundaries } from "../world/map.js";
import { setupUI } from "./ui.js";
import { setupSolids } from "../obstacles/solids.js";
import { populateOcean } from "../world/levelManager.js";
import { stats } from "../entities/stats.js";

/**
 * Initialise l'instance du moteur Kaplay, charge l'ensemble des spritesheets, sons et polices,
 * puis instancie la scène principale de plongée ("dive") avec la physique, la caméra et les écouteurs.
 *
 * @param {HTMLCanvasElement} canvasElement - Élément canvas HTML cible pour le rendu Kaplay.
 * @returns {() => void} Fonction de destruction et de nettoyage complet du moteur de jeu.
 */
export function initDivingGame(canvasElement) {
  const k = kaplay({
    canvas: canvasElement,
    width: 1024,
    height: 768,
    background: [25, 116, 186],
    global: false,
    font: "Silkscreen",
  });

  k.setGravity(1400);
  k.debug.inspect = false; // pour le debug : montre les hitboxes et les points d'ancrage

  // ==========================================
  // 1. CHARGEMENT CONFIGURÉ DES ASSETS (Anti-Duplication SonarQube)
  // ==========================================

  // Environnements
  k.loadSprite("bg-surface", "/assets/plongee/env/backgrounds/surface_ocean_jour.png");
  k.loadSprite("bg-zone2", "/assets/plongee/env/backgrounds/background_profondeur2.png");
  k.loadSprite("midground-zone2", "/assets/plongee/env/backgrounds/midground_profondeur2.png");
  k.loadSprite("bg-zone3", "/assets/plongee/env/backgrounds/orig_profondeur3.png");

  // Sons
  const SOUND_EFFECTS = [
    ["bgm-dive", "/assets/plongee/sounds/watery_cave_loop.ogg"],
    ["sfx-attack", "/assets/plongee/sounds/sfx_attack.wav"],
    ["sfx-hit", "/assets/plongee/sounds/sfx_hit.wav"],
    ["sfx-hurt", "/assets/plongee/sounds/sfx_hurt.wav"],
    ["sfx-death", "/assets/plongee/sounds/sfx_death.wav"],
    ["sfx-loot", "/assets/plongee/sounds/sfx_loot.wav"],
    ["sfx-deposit", "/assets/plongee/sounds/sfx_deposit.wav"],
    ["sfx-gold", "/assets/plongee/sounds/sfx_gold.wav"],
  ];
  for (const [name, path] of SOUND_EFFECTS) {
    k.loadSound(name, path);
  }

  // Items & Décors statiques
  const STATIC_SPRITES = [
    ["boat", "/assets/plongee/items/Boat.png"],
    ["barrel-empty", "/assets/plongee/items/Fishbarrel3.png"],
    ["barrel-full", "/assets/plongee/items/Fishbarrel4.png"],
    ["diver-idle-boat", "/assets/plongee/player/player-idle-boat.png"],
    ["fish-small", "/assets/plongee/enemies/fishes/fish.png"],
    ["mine", "/assets/plongee/enemies/monsters/mine.png"],
    ["mine-big", "/assets/plongee/enemies/monsters/mine-big.png"],
    ["bouee", "/assets/plongee/items/bouee_de_mer.png"],
    ["chain", "/assets/plongee/items/chain.png"],
    ["rock-fond1", "/assets/plongee/items/rocher-fond1.png"],
    ["rock-fond2", "/assets/plongee/items/rocher-fond2.png"],
    ["rock-fond3", "/assets/plongee/items/rocher-fond3.png"],
    ["rock-under1", "/assets/plongee/items/rocher-fond-sous-map1.png"],
    ["rock-under2", "/assets/plongee/items/rocher-fond-sous-map2.png"],
    ["depth-cursor", "/assets/plongee/ui/UI_Flat_IconArrow01a.png"],
    ["sirene-mage-projectile", "/assets/plongee/enemies/monsters/sirene-baton-magique/Projectile.png"],
  ];
  for (const [name, path] of STATIC_SPRITES) {
    k.loadSprite(name, path);
  }

  // Sprites des butins pixel art 16x16
  const LOOT_ITEMS = [
    "anguille-meat", "jelly-filament", "turtle-shell", "pieuvre-tentacle",
    "lantern", "siren-scale", "magic-pearl", "explosive-dust",
    "trident-tip", "shark-tooth", "shark-king-tooth",
  ];
  for (const itemKey of LOOT_ITEMS) {
    k.loadSprite(`loot-${itemKey}`, `/assets/plongee/items/loots/loot_${itemKey.replaceAll("-", "_")}.png`);
  }

  // Barres d'interface multi-états
  k.loadSprite("hp-bar", "/assets/plongee/ui/bar_fill_health.png", { sliceX: 17, sliceY: 1 });
  k.loadSprite("o2-bar", "/assets/plongee/ui/bar_fill_mana.png", { sliceX: 17, sliceY: 1 });

  // Table déclarative des spritesheets animées pour éviter la duplication de code
  const ANIMATED_SPRITES = [
    // Joueur
    ["diver-swim", "/assets/plongee/player/player-swiming.png", 7, "swim", 6, 8, true],
    ["diver-idle", "/assets/plongee/player/player-idle.png", 6, "idle", 5, 4, true],
    ["diver-walk", "/assets/plongee/player/player-walk.png", 8, "walk", 7, 10, true],
    ["diver-attack", "/assets/plongee/player/player-attack.png", 8, "attack", 7, 12, false],
    ["diver-attack-underwater", "/assets/plongee/player/player-attack-underwater.png", 8, "attack", 7, 12, false],
    // PNJ Marchand
    ["fisherman-idle", "/assets/plongee/npc/Fisherman_idle.png", 4, "idle", 3, 4, true],
    ["fisherman-hurt", "/assets/plongee/npc/Fisherman_hurt.png", 2, "hurt", 1, 6, false],
    // Faune Zone 1
    ["anguille-idle", "/assets/plongee/enemies/fishes/anguille/Idle.png", 4, "idle", 3, 6, true],
    ["anguille-walk", "/assets/plongee/enemies/fishes/anguille/Walk.png", 6, "walk", 5, 8, true],
    ["anguille-attack", "/assets/plongee/enemies/fishes/anguille/Attack.png", 6, "attack", 5, 12, false],
    ["anguille-hurt", "/assets/plongee/enemies/fishes/anguille/Hurt.png", 2, "hurt", 1, 10, false],
    ["anguille-death", "/assets/plongee/enemies/fishes/anguille/Death.png", 6, "death", 5, 8, false],
    ["meduse-idle", "/assets/plongee/enemies/fishes/meduse/Idle.png", 4, "idle", 3, 5, true],
    ["meduse-walk", "/assets/plongee/enemies/fishes/meduse/Walk.png", 4, "walk", 3, 6, true],
    ["meduse-attack", "/assets/plongee/enemies/fishes/meduse/Attack.png", 4, "attack", 3, 8, false],
    ["meduse-hurt", "/assets/plongee/enemies/fishes/meduse/Hurt.png", 2, "hurt", 1, 10, false],
    ["meduse-death", "/assets/plongee/enemies/fishes/meduse/Death.png", 6, "death", 5, 6, false],
    ["tortue-idle", "/assets/plongee/enemies/fishes/tortue/Idle.png", 4, "idle", 3, 3, true],
    ["tortue-walk", "/assets/plongee/enemies/fishes/tortue/Walk.png", 6, "walk", 5, 4, true],
    ["tortue-attack", "/assets/plongee/enemies/fishes/tortue/Attack.png", 6, "attack", 5, 6, false],
    ["tortue-hurt", "/assets/plongee/enemies/fishes/tortue/Hurt.png", 2, "hurt", 1, 10, false],
    ["tortue-death", "/assets/plongee/enemies/fishes/tortue/Death.png", 6, "death", 5, 5, false],
    // Requins Zone 3
    ["requin-boss-move", "/assets/plongee/enemies/monsters/requin-boss/spr_shark_move_strip9.png", 9, "move", 8, 8, true],
    ["requin-boss-attack", "/assets/plongee/enemies/monsters/requin-boss/spr_shark_attack_strip9.png", 9, "attack", 8, 10, false],
    ["requin-marteau-move", "/assets/plongee/enemies/monsters/requin-marteau/spr_hammerhead_shark_move_strip9.png", 9, "move", 8, 8, true],
    ["requin-marteau-attack", "/assets/plongee/enemies/monsters/requin-marteau/spr_hammerhead_shark_attack_strip9.png", 9, "attack", 8, 10, false],
    ["requin-tigre-move", "/assets/plongee/enemies/monsters/requin-tigre/spr_tiger_shark_move_strip9.png", 9, "move", 8, 8, true],
    ["requin-tigre-attack", "/assets/plongee/enemies/monsters/requin-tigre/spr_tiger_shark_attack_strip9.png", 9, "attack", 8, 10, false],
    // Monstres Zone 2
    ["pieuvre-idle", "/assets/plongee/enemies/fishes/pieuvre/Idle.png", 6, "idle", 5, 5, true],
    ["pieuvre-walk", "/assets/plongee/enemies/fishes/pieuvre/Walk.png", 6, "walk", 5, 6, true],
    ["pieuvre-attack", "/assets/plongee/enemies/fishes/pieuvre/Attack.png", 6, "attack", 5, 8, false],
    ["pieuvre-hurt", "/assets/plongee/enemies/fishes/pieuvre/Hurt.png", 2, "hurt", 1, 8, false],
    ["pieuvre-death", "/assets/plongee/enemies/fishes/pieuvre/Death.png", 6, "death", 5, 6, false],
    ["lanterne-idle", "/assets/plongee/enemies/fishes/poisson-lanterne/Idle.png", 4, "idle", 3, 4, true],
    ["lanterne-walk", "/assets/plongee/enemies/fishes/poisson-lanterne/Walk.png", 4, "walk", 3, 5, true],
    ["lanterne-attack", "/assets/plongee/enemies/fishes/poisson-lanterne/Attack.png", 6, "attack", 5, 8, false],
    ["lanterne-hurt", "/assets/plongee/enemies/fishes/poisson-lanterne/Hurt.png", 2, "hurt", 1, 8, false],
    ["lanterne-death", "/assets/plongee/enemies/fishes/poisson-lanterne/Death.png", 6, "death", 5, 6, false],
    ["sirene-epee-idle", "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Idle.png", 4, "idle", 3, 4, true],
    ["sirene-epee-walk", "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Walk.png", 6, "walk", 5, 6, true],
    ["sirene-epee-attack", "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Attack.png", 6, "attack", 5, 8, false],
    ["sirene-epee-hurt", "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Hurt.png", 2, "hurt", 1, 8, false],
    ["sirene-epee-death", "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Death.png", 6, "death", 5, 6, false],
    ["sirene-mage-idle", "/assets/plongee/enemies/monsters/sirene-baton-magique/Idle.png", 4, "idle", 3, 4, true],
    ["sirene-mage-walk", "/assets/plongee/enemies/monsters/sirene-baton-magique/Walk.png", 6, "walk", 5, 5, true],
    ["sirene-mage-attack", "/assets/plongee/enemies/monsters/sirene-baton-magique/Attack.png", 6, "attack", 5, 8, false],
    ["sirene-mage-hurt", "/assets/plongee/enemies/monsters/sirene-baton-magique/Hurt.png", 2, "hurt", 1, 8, false],
    ["sirene-mage-death", "/assets/plongee/enemies/monsters/sirene-baton-magique/Death.png", 6, "death", 5, 6, false],
    ["poisson-explosif-idle", "/assets/plongee/enemies/monsters/poisson-explosif/Idle.png", 4, "idle", 3, 5, true],
    ["poisson-explosif-walk", "/assets/plongee/enemies/monsters/poisson-explosif/Walk.png", 4, "walk", 3, 7, true],
    ["poisson-explosif-attack", "/assets/plongee/enemies/monsters/poisson-explosif/Attack.png", 6, "attack", 5, 10, false],
    ["poisson-explosif-hurt", "/assets/plongee/enemies/monsters/poisson-explosif/Hurt.png", 2, "hurt", 1, 8, false],
    ["poisson-explosif-death", "/assets/plongee/enemies/monsters/poisson-explosif/Death.png", 6, "death", 5, 8, false],
    ["monstre-lance-idle", "/assets/plongee/enemies/monsters/monstre-lance/Idle.png", 4, "idle", 3, 4, true],
    ["monstre-lance-walk", "/assets/plongee/enemies/monsters/monstre-lance/Walk.png", 6, "walk", 5, 6, true],
    ["monstre-lance-attack", "/assets/plongee/enemies/monsters/monstre-lance/Attack.png", 6, "attack", 5, 8, false],
    ["monstre-lance-hurt", "/assets/plongee/enemies/monsters/monstre-lance/Hurt.png", 2, "hurt", 1, 8, false],
    ["monstre-lance-death", "/assets/plongee/enemies/monsters/monstre-lance/Death.png", 6, "death", 5, 6, false],
  ];

  for (const [name, path, sliceX, animName, to, speed, loop] of ANIMATED_SPRITES) {
    k.loadSprite(name, path, {
      sliceX,
      sliceY: 1,
      anims: { [animName]: { from: 0, to, loop, speed } },
    });
  }

  k.scene("dive", () => {
    k.play("bgm-dive", { loop: true, volume: 0.5 });
    setupOceanBoundaries(k);

    // Spawn parfaitement centré sur le plancher du bateau
    const localPlayer = setupPlayer(k, 0, -58);

    // Fait apparaître toute la faune de l'océan (Zones 1, 2, 3)
    populateOcean(k, localPlayer);
    setupUI(k, localPlayer);
    setupSolids(k, localPlayer); // doit être appelé AVANT la caméra et le filet

    // Filet de sécurité : le joueur ne peut jamais sortir de la zone
    const PLAYABLE_WIDTH = 16000; // même valeur que terrain.js
    const OCEAN_DEPTH = 12000;
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
      if (!localPlayer || !localPlayer.pos) return;
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

      if (Number.isFinite(localPlayer.pos.x) && Number.isFinite(camY)) {
        k.camPos(localPlayer.pos.x, camY);
      }
    });
  });

  // Écouteur global pour déclencher des effets sonores depuis l'UI React (ex: boutique)
  const handleGlobalSound = (e) => {
    try {
      if (e.detail) k.play(e.detail, { volume: 0.75 });
    } catch {
      /* Audio playback error ignored */
    }
  };
  window.addEventListener("plongee-play-sound", handleGlobalSound);

  // Synchronisation visuelle du sprite du Tonneau (plein vs vide) lors des ventes ou dépôts
  const handleInventoryUpdated = () => {
    const barrels = k.get("inventory-barrel");
    if (barrels.length > 0) {
      const isFull = stats.barrelInventory && stats.barrelInventory.length > 0;
      barrels[0].use(k.sprite(isFull ? "barrel-full" : "barrel-empty"));
      barrels[0].use(k.scale(2.8));
    }
  };
  window.addEventListener("plongee-inventory-updated", handleInventoryUpdated);

  k.go("dive");
  return () => {
    window.removeEventListener("plongee-play-sound", handleGlobalSound);
    window.removeEventListener(
      "plongee-inventory-updated",
      handleInventoryUpdated,
    );
    k.quit();
  };
}
