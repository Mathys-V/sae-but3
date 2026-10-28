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

  k.loadSprite(
    "diver-idle-boat",
    "/assets/plongee/player/player-idle-boat.png",
  );

  k.loadSprite("diver-walk", "/assets/plongee/player/player-walk.png", {
    sliceX: 8,
    sliceY: 1,
    anims: { walk: { from: 0, to: 7, loop: true, speed: 10 } },
  });

  k.loadSprite("diver-attack", "/assets/plongee/player/player-attack.png", {
    sliceX: 8,
    sliceY: 1,
    anims: { attack: { from: 0, to: 7, loop: false, speed: 12 } },
  });

  k.loadSprite(
    "diver-attack-underwater",
    "/assets/plongee/player/player-attack-underwater.png",
    {
      sliceX: 8,
      sliceY: 1,
      anims: { attack: { from: 0, to: 7, loop: false, speed: 12 } },
    },
  );

  // Ennemis (fishes & monsters)
  k.loadSprite("fish-small", "/assets/plongee/enemies/fishes/fish.png");
  k.loadSprite("mine", "/assets/plongee/enemies/monsters/mine.png");

  // Sons
  k.loadSound("bgm-dive", "/assets/plongee/sounds/watery_cave_loop.ogg");
  k.loadSound("sfx-attack", "/assets/plongee/sounds/sfx_attack.wav");
  k.loadSound("sfx-hit", "/assets/plongee/sounds/sfx_hit.wav");
  k.loadSound("sfx-hurt", "/assets/plongee/sounds/sfx_hurt.wav");
  k.loadSound("sfx-death", "/assets/plongee/sounds/sfx_death.wav");
  k.loadSound("sfx-loot", "/assets/plongee/sounds/sfx_loot.wav");
  k.loadSound("sfx-deposit", "/assets/plongee/sounds/sfx_deposit.wav");
  k.loadSound("sfx-gold", "/assets/plongee/sounds/sfx_gold.wav");

  // Items & Objets interactifs
  k.loadSprite("boat", "/assets/plongee/items/Boat.png");
  k.loadSprite("barrel-empty", "/assets/plongee/items/Fishbarrel3.png");
  k.loadSprite("barrel-full", "/assets/plongee/items/Fishbarrel4.png");

  // Sprites des butins pixel art 16x16
  k.loadSprite("loot-anguille-meat", "/assets/plongee/items/loots/loot_anguille_meat.png");
  k.loadSprite("loot-jelly-filament", "/assets/plongee/items/loots/loot_jelly_filament.png");
  k.loadSprite("loot-turtle-shell", "/assets/plongee/items/loots/loot_turtle_shell.png");
  k.loadSprite("loot-pieuvre-tentacle", "/assets/plongee/items/loots/loot_pieuvre_tentacle.png");
  k.loadSprite("loot-lantern", "/assets/plongee/items/loots/loot_lantern.png");
  k.loadSprite("loot-siren-scale", "/assets/plongee/items/loots/loot_siren_scale.png");
  k.loadSprite("loot-magic-pearl", "/assets/plongee/items/loots/loot_magic_pearl.png");
  k.loadSprite("loot-explosive-dust", "/assets/plongee/items/loots/loot_explosive_dust.png");
  k.loadSprite("loot-trident-tip", "/assets/plongee/items/loots/loot_trident_tip.png");
  k.loadSprite("loot-shark-tooth", "/assets/plongee/items/loots/loot_shark_tooth.png");
  k.loadSprite("loot-shark-king-tooth", "/assets/plongee/items/loots/loot_shark_king_tooth.png");

  // PNJ Pecheur Marchand
  k.loadSprite("fisherman-idle", "/assets/plongee/npc/Fisherman_idle.png", {
    sliceX: 4,
    sliceY: 1,
    anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } },
  });
  k.loadSprite("fisherman-hurt", "/assets/plongee/npc/Fisherman_hurt.png", {
    sliceX: 2,
    sliceY: 1,
    anims: { hurt: { from: 0, to: 1, loop: false, speed: 6 } },
  });

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

  // --- UI ---
  k.loadSprite("hp-bar", "/assets/plongee/ui/bar_fill_health.png", {
    sliceX: 17, // L'image contient 17 états (de vide à plein)
    sliceY: 1,
  });

  k.loadSprite("o2-bar", "/assets/plongee/ui/bar_fill_mana.png", {
    sliceX: 17, // L'image contient 17 états (de vide à plein)
    sliceY: 1,
  });
  k.loadSprite("depth-cursor", "/assets/plongee/ui/UI_Flat_IconArrow01a.png");

  // ==========================================
  // CHARGEMENT DES ENNEMIS (ZONE 1)
  // ⚠️ À MODIFIER : Ajuste le 'sliceX' et le 'to' selon le vrai nombre d'images de chaque fichier !
  // Exemple: si Attack.png a 6 images, met sliceX: 6 et to: 5.
  // ==========================================

  // --- ANGUILLE ---
  k.loadSprite(
    "anguille-idle",
    "/assets/plongee/enemies/fishes/anguille/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 6 } },
    },
  );
  k.loadSprite(
    "anguille-walk",
    "/assets/plongee/enemies/fishes/anguille/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 8 } },
    },
  );
  k.loadSprite(
    "anguille-attack",
    "/assets/plongee/enemies/fishes/anguille/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 12 } },
    },
  );
  k.loadSprite(
    "anguille-hurt",
    "/assets/plongee/enemies/fishes/anguille/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 10 } },
    },
  );
  k.loadSprite(
    "anguille-death",
    "/assets/plongee/enemies/fishes/anguille/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );

  // --- MEDUSE ---
  k.loadSprite(
    "meduse-idle",
    "/assets/plongee/enemies/fishes/meduse/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 5 } },
    },
  );
  k.loadSprite(
    "meduse-walk",
    "/assets/plongee/enemies/fishes/meduse/Walk.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { walk: { from: 0, to: 3, loop: true, speed: 6 } },
    },
  );
  k.loadSprite(
    "meduse-attack",
    "/assets/plongee/enemies/fishes/meduse/Attack.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { attack: { from: 0, to: 3, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "meduse-hurt",
    "/assets/plongee/enemies/fishes/meduse/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 10 } },
    },
  );
  k.loadSprite(
    "meduse-death",
    "/assets/plongee/enemies/fishes/meduse/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );

  // --- TORTUE ---
  k.loadSprite(
    "tortue-idle",
    "/assets/plongee/enemies/fishes/tortue/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 3 } },
    },
  );
  k.loadSprite(
    "tortue-walk",
    "/assets/plongee/enemies/fishes/tortue/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 4 } },
    },
  );
  k.loadSprite(
    "tortue-attack",
    "/assets/plongee/enemies/fishes/tortue/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );
  k.loadSprite(
    "tortue-hurt",
    "/assets/plongee/enemies/fishes/tortue/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 10 } },
    },
  );
  k.loadSprite(
    "tortue-death",
    "/assets/plongee/enemies/fishes/tortue/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 5 } },
    },
  );

  // --- NOUVEAUX REQUINS DE LA ZONE 3 (Sprites 64x64, 9 frames) ---
  k.loadSprite(
    "requin-boss-move",
    "/assets/plongee/enemies/monsters/requin-boss/spr_shark_move_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { move: { from: 0, to: 8, loop: true, speed: 8 } },
    },
  );
  k.loadSprite(
    "requin-boss-attack",
    "/assets/plongee/enemies/monsters/requin-boss/spr_shark_attack_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { attack: { from: 0, to: 8, loop: false, speed: 10 } },
    },
  );

  k.loadSprite(
    "requin-marteau-move",
    "/assets/plongee/enemies/monsters/requin-marteau/spr_hammerhead_shark_move_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { move: { from: 0, to: 8, loop: true, speed: 8 } },
    },
  );
  k.loadSprite(
    "requin-marteau-attack",
    "/assets/plongee/enemies/monsters/requin-marteau/spr_hammerhead_shark_attack_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { attack: { from: 0, to: 8, loop: false, speed: 10 } },
    },
  );

  k.loadSprite(
    "requin-tigre-move",
    "/assets/plongee/enemies/monsters/requin-tigre/spr_tiger_shark_move_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { move: { from: 0, to: 8, loop: true, speed: 8 } },
    },
  );
  k.loadSprite(
    "requin-tigre-attack",
    "/assets/plongee/enemies/monsters/requin-tigre/spr_tiger_shark_attack_strip9.png",
    {
      sliceX: 9,
      sliceY: 1,
      anims: { attack: { from: 0, to: 8, loop: false, speed: 10 } },
    },
  );

  // --- PIEUVRE (ZONE 2) ---
  k.loadSprite(
    "pieuvre-idle",
    "/assets/plongee/enemies/fishes/pieuvre/Idle.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { idle: { from: 0, to: 5, loop: true, speed: 5 } },
    },
  );
  k.loadSprite(
    "pieuvre-walk",
    "/assets/plongee/enemies/fishes/pieuvre/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 6 } },
    },
  );
  k.loadSprite(
    "pieuvre-attack",
    "/assets/plongee/enemies/fishes/pieuvre/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "pieuvre-hurt",
    "/assets/plongee/enemies/fishes/pieuvre/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "pieuvre-death",
    "/assets/plongee/enemies/fishes/pieuvre/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );

  // --- POISSON-LANTERNE (ZONE 2 & 3) ---
  k.loadSprite(
    "lanterne-idle",
    "/assets/plongee/enemies/fishes/poisson-lanterne/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } },
    },
  );
  k.loadSprite(
    "lanterne-walk",
    "/assets/plongee/enemies/fishes/poisson-lanterne/Walk.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { walk: { from: 0, to: 3, loop: true, speed: 5 } },
    },
  );
  k.loadSprite(
    "lanterne-attack",
    "/assets/plongee/enemies/fishes/poisson-lanterne/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "lanterne-hurt",
    "/assets/plongee/enemies/fishes/poisson-lanterne/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "lanterne-death",
    "/assets/plongee/enemies/fishes/poisson-lanterne/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );

  // --- MINES DES PROFONDEURS ---
  k.loadSprite("mine-big", "/assets/plongee/enemies/monsters/mine-big.png");

  // --- SIRÈNE ÉPÉE & BOUCLIER (ZONE 2) ---
  k.loadSprite(
    "sirene-epee-idle",
    "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } },
    },
  );
  k.loadSprite(
    "sirene-epee-walk",
    "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 6 } },
    },
  );
  k.loadSprite(
    "sirene-epee-attack",
    "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "sirene-epee-hurt",
    "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "sirene-epee-death",
    "/assets/plongee/enemies/monsters/sirene-epee-bouclier/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );

  // --- SIRÈNE BÂTON MAGIQUE (ZONE 2 & 3) ---
  k.loadSprite(
    "sirene-mage-idle",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } },
    },
  );
  k.loadSprite(
    "sirene-mage-walk",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 5 } },
    },
  );
  k.loadSprite(
    "sirene-mage-attack",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "sirene-mage-hurt",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "sirene-mage-death",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );
  k.loadSprite(
    "sirene-mage-projectile",
    "/assets/plongee/enemies/monsters/sirene-baton-magique/Projectile.png",
  );

  // --- POISSON EXPLOSIF (ZONE 2 & 3) ---
  k.loadSprite(
    "poisson-explosif-idle",
    "/assets/plongee/enemies/monsters/poisson-explosif/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 5 } },
    },
  );
  k.loadSprite(
    "poisson-explosif-walk",
    "/assets/plongee/enemies/monsters/poisson-explosif/Walk.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { walk: { from: 0, to: 3, loop: true, speed: 7 } },
    },
  );
  k.loadSprite(
    "poisson-explosif-attack",
    "/assets/plongee/enemies/monsters/poisson-explosif/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 10 } },
    },
  );
  k.loadSprite(
    "poisson-explosif-hurt",
    "/assets/plongee/enemies/monsters/poisson-explosif/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "poisson-explosif-death",
    "/assets/plongee/enemies/monsters/poisson-explosif/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );

  // --- MONSTRE À LA LANCE (ZONE 3) ---
  k.loadSprite(
    "monstre-lance-idle",
    "/assets/plongee/enemies/monsters/monstre-lance/Idle.png",
    {
      sliceX: 4,
      sliceY: 1,
      anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } },
    },
  );
  k.loadSprite(
    "monstre-lance-walk",
    "/assets/plongee/enemies/monsters/monstre-lance/Walk.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { walk: { from: 0, to: 5, loop: true, speed: 6 } },
    },
  );
  k.loadSprite(
    "monstre-lance-attack",
    "/assets/plongee/enemies/monsters/monstre-lance/Attack.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { attack: { from: 0, to: 5, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "monstre-lance-hurt",
    "/assets/plongee/enemies/monsters/monstre-lance/Hurt.png",
    {
      sliceX: 2,
      sliceY: 1,
      anims: { hurt: { from: 0, to: 1, loop: false, speed: 8 } },
    },
  );
  k.loadSprite(
    "monstre-lance-death",
    "/assets/plongee/enemies/monsters/monstre-lance/Death.png",
    {
      sliceX: 6,
      sliceY: 1,
      anims: { death: { from: 0, to: 5, loop: false, speed: 6 } },
    },
  );

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
