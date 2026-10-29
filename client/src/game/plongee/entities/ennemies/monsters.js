import { spawnLootItem } from "../items.js";
import { stats } from "../stats.js";

// ==========================================
// EFFETS VISUELS D'IMPACT / DÉGÂTS UNIVERSELS PIXEL ART
// (Fournit un retour d'impact spectaculaire sur TOUS les monstres)
// ==========================================
/**
 * Déclenche des particules d'impact rouges et un flash blanc lors d'un coup réussi.
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").Vec2} pos - Coordonnées mondiales du point d'impact.
 */
export function spawnDamageHitFX(k, pos) {
  if (!pos) return;
  // Particules d'éclaboussures de dégâts rouges en pixel art
  for (let i = 0; i < 6; i++) {
    const fx = k.add([
      k.rect(k.rand(3, 5), k.rand(3, 5)),
      k.pos(pos.add(k.rand(-14, 14), k.rand(-14, 14))),
      k.color(220, 38, 38),
      k.opacity(0.9),
      k.z(60),
    ]);
    const vel = k.vec2(k.rand(-70, 70), k.rand(-90, -20));
    fx.onUpdate(() => {
      fx.pos = fx.pos.add(vel.scale(k.dt()));
      fx.opacity -= 2.2 * k.dt();
      if (fx.opacity <= 0) k.destroy(fx);
    });
  }

  // Éclair blanc d'impact pixelisé immédiat
  const flash = k.add([
    k.rect(14, 14),
    k.pos(pos),
    k.anchor("center"),
    k.color(255, 255, 255),
    k.opacity(0.85),
    k.z(61),
  ]);
  flash.onUpdate(() => {
    flash.opacity -= 8 * k.dt();
    if (flash.opacity <= 0) k.destroy(flash);
  });
}

/**
 * Met à jour le sprite et l'animation d'une entité en préservant ou en ajustant son orientation (flipX).
 * Résout le comportement par défaut de Kaplay qui réinitialise flipX à false lors de obj.use(k.sprite(...)).
 *
 * @param {import("kaplay").GameObj} obj - Entité cible.
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {string} spriteName - Nom de l'asset sprite à appliquer.
 * @param {string} [animName] - Nom de l'animation à jouer.
 * @param {boolean} [forcedFlipX] - Orientation horizontale forcée (ex: face au joueur).
 */
export function setEntitySprite(obj, k, spriteName, animName, forcedFlipX = undefined) {
  if (!obj?.exists()) return;
  const targetFlip = forcedFlipX !== undefined ? forcedFlipX : obj.flipX;
  obj.use(k.sprite(spriteName));
  obj.flipX = targetFlip;
  if (animName) {
    obj.play(animName);
  }
}

// ==========================================
// 1. LE BOSS REQUIN - BOSS FINAL UNIQUE
// Sprite : requin-boss (64x64, 9 frames)
// Habitat : Zone 3 strictly (7 050 m à 11 800 m)
// ==========================================
/**
 * Fait apparaître le Boss Requin, ennemi ultime des abysses (600 PV).
 * Possède des mécanismes de patrouille, de poursuite, de charge dévastatrice
 * et une réinitialisation automatique complète si le joueur quitte la zone ou meurt.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du boss requin.
 */
export function spawnBossRequin(k, startX, startY, player) {
  const PATROL_SPEED = 140;
  const CHASE_SPEED = 240;
  const CHARGE_SPEED = 460;
  const ZONE3_MIN_Y = 7050;
  const ZONE3_MAX_Y = 11800;

  stats.bossHp = 600;
  stats.bossMaxHp = 600;
  stats.bossActive = false;
  stats.bossDefeated = false;

  let isCharging = false;
  let chargeDir = k.vec2(0, 0);

  const boss = k.add([
    k.sprite("requin-boss-move"),
    k.pos(startX, startY),
    k.scale(4.2), // Boss Géant impressionnant
    k.anchor("center"),
    k.rotate(0),
    // Hitbox resserrée sur le torse du boss requin
    k.area({ shape: new k.Rect(k.vec2(0, 0), 48, 22) }),
    k.body({ isStatic: true }),
    k.health(600),
    k.state("patrol", ["patrol", "chase", "charge", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "boss",
    "requin-boss",
    {
      dirX: 1,
      damage: 32,
      chargeDamage: 42,
      attackCooldown: false,
    },
  ]);

  boss.play("move");

  boss.onUpdate(() => {
    stats.bossHp = boss.hp();

    // Régénération complète et reset du Boss si le joueur quitte la Zone 3 ou meurt (anti-suicide exploit)
    const isPlayerInZone3 =
      player?.pos?.y >= ZONE3_MIN_Y - 100 &&
      !stats.bossDefeated;

    if (!isPlayerInZone3 && !stats.bossDefeated) {
      if (boss.hp() < stats.bossMaxHp) {
        boss.setHP(stats.bossMaxHp);
        stats.bossHp = stats.bossMaxHp;
      }
      if (boss.state !== "patrol") {
        boss.enterState("patrol");
      }
    }

    // La barre de vie du Boss n'apparaît que lorsqu'il est à l'écran / proche du joueur en Zone 3
    const isOnScreen =
      isPlayerInZone3 &&
      Math.abs(boss.pos.x - player.pos.x) < 560 &&
      Math.abs(boss.pos.y - player.pos.y) < 420;

    if (isOnScreen) {
      stats.bossActive = !stats.bossDefeated;
    } else {
      stats.bossActive = false;
    }
  });

  // ÉTAT : PATROUILLE MENAÇANTE
  boss.onStateEnter("patrol", () => {
    setEntitySprite(boss, k, "requin-boss-move", "move", boss.dirX < 0);
  });

  boss.onStateUpdate("patrol", () => {
    boss.move(PATROL_SPEED * boss.dirX, 0);

    if (boss.pos.x < -7200 || boss.pos.x > 7200) {
      boss.dirX *= -1;
      boss.flipX = boss.dirX < 0;
    }

    boss.pos.y = k.clamp(boss.pos.y, ZONE3_MIN_Y, ZONE3_MAX_Y);

    if (player?.pos?.y >= 7000 && boss.pos.dist(player.pos) < 850) {
      boss.enterState("chase");
    }
  });

  // ÉTAT : POURSUITE ACTIVE DU JOUEUR
  boss.onStateEnter("chase", () => {
    setEntitySprite(boss, k, "requin-boss-move", "move");

    boss.wait(k.rand(2.5, 4.0), () => {
      if (boss.state === "chase" && player?.pos?.y >= 7000 && boss.pos.dist(player.pos) < 750) {
        boss.enterState("charge");
      }
    });
  });

  boss.onStateUpdate("chase", () => {
    if (!boss.exists()) return;
    if (!player?.pos || player.pos.y < 7000) {
      boss.enterState("patrol");
      return;
    }

    const dist = boss.pos.dist(player.pos);
    let dir = player.pos.sub(boss.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    boss.move(dir.scale(CHASE_SPEED));
    boss.flipX = dir.x < 0;

    boss.pos.y = k.clamp(boss.pos.y, ZONE3_MIN_Y, ZONE3_MAX_Y);

    if (dist < 110 && !boss.attackCooldown) {
      boss.enterState("attack");
    }
  });

  // ÉTAT : CHARGE DÉVASTATRICE
  boss.onStateEnter("charge", () => {
    let faceCharge = boss.flipX;
    if (player?.pos?.y >= 7000) {
      const dir = player.pos.sub(boss.pos);
      chargeDir = dir.len() < 0.001 ? k.vec2(1, 0) : dir.unit();
      faceCharge = chargeDir.x < 0;
      isCharging = true;

      boss.wait(1.1, () => {
        isCharging = false;
        if (boss.state !== "death" && boss.exists()) {
          boss.enterState("chase");
        }
      });
    } else {
      boss.enterState("chase");
    }
    setEntitySprite(boss, k, "requin-boss-attack", "attack", faceCharge);
  });

  boss.onStateUpdate("charge", () => {
    if (!boss.exists()) return;
    if (isCharging) {
      boss.move(chargeDir.scale(CHARGE_SPEED));
      boss.pos.y = k.clamp(boss.pos.y, ZONE3_MIN_Y, ZONE3_MAX_Y);
      if (player?.pos && boss.pos.dist(player.pos) < 130) {
        player.takeDamage?.(boss.chargeDamage || 42);
      }
    }
  });

  // ÉTAT : ATTAQUE MORSURE
  boss.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < boss.pos.x : boss.flipX;
    setEntitySprite(boss, k, "requin-boss-attack", "attack", facePlayer);
    boss.attackCooldown = true;

    if (player?.pos && boss.pos.dist(player.pos) < 135) {
      player.takeDamage?.(boss.damage);
    }

    boss.wait(0.65, () => {
      if (boss.state !== "death" && boss.exists()) {
        boss.enterState("chase");
      }
    });

    boss.wait(1.8, () => {
      boss.attackCooldown = false;
    });
  });

  // ÉTAT : DÉGÂTS REÇUS (Flash rouge & blanc vif, impact de bulles/sang, recul)
  boss.on("hurt", () => {
    if (boss.state === "death" || !boss.exists()) return;
    spawnDamageHitFX(k, boss.pos);
    k.shake(6);

    boss.color = k.rgb(255, 60, 60);
    boss.wait(0.12, () => {
      if (boss.exists()) boss.color = k.rgb(255, 200, 200);
    });
    boss.wait(0.25, () => {
      if (boss.exists()) boss.color = k.rgb(255, 255, 255);
    });

    if (player?.pos) {
      let pushDir = boss.pos.sub(player.pos);
      if (pushDir.len() >= 0.001) {
        pushDir = pushDir.unit();
        boss.pos = boss.pos.add(pushDir.scale(15));
      }
    }
  });

  // ÉTAT : MORT DU BOSS FINAL -> VICTOIRE !
  boss.on("death", () => boss.enterState("death"));
  boss.onStateEnter("death", () => {
    boss.untag("enemy");
    boss.unuse("area");
    k.shake(16);
    spawnDamageHitFX(k, boss.pos);

    stats.bossActive = false;
    stats.bossDefeated = true;
    stats.isTimerRunning = false;
    stats.finalTime = stats.gameTimer;

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;

      const dropPos = boss.pos ? k.vec2(boss.pos.x, boss.pos.y) : null;
      k.destroy(boss);

      if (dropPos) {
        spawnLootItem(k, dropPos, "shark_king_tooth");
        spawnLootItem(k, dropPos.add(-40, 20), "shark_tooth");
        spawnLootItem(k, dropPos.add(40, -20), "shark_tooth");
      }

      // Événement victoire vers React
      window.dispatchEvent(
        new CustomEvent("plongee-victory", {
          detail: { time: stats.finalTime },
        }),
      );
    };

    // Animation dynamique : le requin géant se renverse et sombre dans les abysses
    let deathTimer = 0;
    const deathDuration = 1.6;
    boss.onUpdate(() => {
      if (!boss.exists() || boss.state !== "death") return;
      deathTimer += k.dt();
      boss.angle = k.lerp(0, 180, Math.min(1, deathTimer * 1.8));
      boss.pos.y += 35 * k.dt();
      boss.opacity = Math.max(0, 1 - deathTimer / deathDuration);

      if (deathTimer >= deathDuration) {
        finishDeath();
      }
    });

    boss.wait(deathDuration + 0.1, finishDeath);
  });

  boss.enterState("patrol");
  return boss;
}

// ==========================================
// 1b & 1c. REQUINS PRÉDATEURS DE LA ZONE 3 (Factory commune Anti-Duplication)
// ==========================================
/**
 * Usine générique de fabrication des requins prédateurs de la Zone 3.
 * Factorise la logique de patrouille, de poursuite agressive et d'attaque pour éliminer la duplication.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @param {object} config - Configuration spécifique de l'espèce de requin.
 * @returns {import("kaplay").GameObj} Entité requin instanciée.
 */
function createZone3Shark(k, startX, startY, player, config) {
  const {
    speciesTag,
    moveSprite,
    attackSprite,
    hp,
    damage,
    patrolSpeed,
    chaseSpeed,
    aggroDist,
  } = config;
  const MIN_Y = 7050;
  const MAX_Y = 11800;

  const requin = k.add([
    k.sprite(moveSprite),
    k.pos(startX, startY),
    k.scale(2.4),
    k.anchor("center"),
    k.rotate(0),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 40, 18) }),
    k.body({ isStatic: true }),
    k.health(hp),
    k.state("patrol", ["patrol", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "requin",
    speciesTag,
    { dirX: 1, damage, attackCooldown: false },
  ]);

  requin.play("move");

  requin.onStateEnter("patrol", () => {
    setEntitySprite(requin, k, moveSprite, "move", requin.dirX < 0);
  });

  requin.onStateUpdate("patrol", () => {
    if (!requin.exists()) return;
    requin.move(patrolSpeed * requin.dirX, 0);

    if (requin.pos.x < -7800 || requin.pos.x > 7800) {
      requin.dirX *= -1;
      requin.flipX = requin.dirX < 0;
    }

    requin.pos.y = k.clamp(requin.pos.y, MIN_Y, MAX_Y);

    if (player?.pos?.y >= 7000 && requin.pos.dist(player.pos) < aggroDist) {
      requin.enterState("chase");
    }
  });

  requin.onStateEnter("chase", () => {
    setEntitySprite(requin, k, moveSprite, "move");
  });

  requin.onStateUpdate("chase", () => {
    if (!requin.exists()) return;
    if (!player?.pos || player.pos.y < 7000) {
      requin.enterState("patrol");
      return;
    }

    const dist = requin.pos.dist(player.pos);
    if (dist < 80 && !requin.attackCooldown) {
      requin.enterState("attack");
      return;
    }

    let dir = player.pos.sub(requin.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    requin.move(dir.scale(chaseSpeed));
    requin.flipX = dir.x < 0;
    requin.pos.y = k.clamp(requin.pos.y, MIN_Y, MAX_Y);
  });

  requin.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < requin.pos.x : requin.flipX;
    setEntitySprite(requin, k, attackSprite, "attack", facePlayer);
    requin.attackCooldown = true;

    if (player?.pos && requin.pos.dist(player.pos) < 90) {
      player?.takeDamage?.(requin.damage);
    }

    requin.wait(0.65, () => {
      if (requin.state !== "death" && requin.exists()) {
        requin.enterState("chase");
      }
    });

    requin.wait(1.6, () => {
      requin.attackCooldown = false;
    });
  });

  requin.on("hurt", () => {
    if (requin.state === "death" || !requin.exists()) return;
    spawnDamageHitFX(k, requin.pos);
    k.shake(4);

    requin.color = k.rgb(255, 60, 60);
    requin.wait(0.12, () => {
      if (requin.exists()) requin.color = k.rgb(255, 200, 200);
    });
    requin.wait(0.24, () => {
      if (requin.exists()) requin.color = k.rgb(255, 255, 255);
    });

    if (player?.pos) {
      let pushDir = requin.pos.sub(player.pos);
      if (pushDir.len() >= 0.001) {
        pushDir = pushDir.unit();
        requin.pos = requin.pos.add(pushDir.scale(18));
      }
    }
  });

  requin.on("death", () => requin.enterState("death"));
  requin.onStateEnter("death", () => {
    requin.untag("enemy");
    requin.unuse("area");
    k.shake(6);
    spawnDamageHitFX(k, requin.pos);

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = requin.pos ? k.vec2(requin.pos.x, requin.pos.y) : null;
      k.destroy(requin);
      if (dropPos) spawnLootItem(k, dropPos, "shark_tooth");
    };

    let deathTimer = 0;
    const deathDuration = 1.1;
    requin.onUpdate(() => {
      if (!requin.exists() || requin.state !== "death") return;
      deathTimer += k.dt();
      requin.angle = k.lerp(0, 180, Math.min(1, deathTimer * 2));
      requin.pos.y += 40 * k.dt();
      requin.opacity = Math.max(0, 1 - deathTimer / deathDuration);

      if (deathTimer >= deathDuration) {
        finishDeath();
      }
    });

    requin.wait(deathDuration + 0.1, finishDeath);
  });

  requin.enterState("patrol");
  return requin;
}

/**
 * Fait apparaître un Requin-Marteau blindé dans la Zone 3.
 * Titan très résistant (170 PV) qui traque le plongeur à portée d'aggro.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du requin-marteau.
 */
export function spawnRequinMarteau(k, startX, startY, player) {
  return createZone3Shark(k, startX, startY, player, {
    speciesTag: "requin-marteau",
    moveSprite: "requin-marteau-move",
    attackSprite: "requin-marteau-attack",
    hp: 170,
    damage: 20,
    patrolSpeed: 85,
    chaseSpeed: 175,
    aggroDist: 600,
  });
}

/**
 * Fait apparaître un Requin-Tigre traqueur féroce dans la Zone 3.
 * Prédateur très rapide et agressif avec une longue portée de détection.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du requin-tigre.
 */
export function spawnRequinTigre(k, startX, startY, player) {
  return createZone3Shark(k, startX, startY, player, {
    speciesTag: "requin-tigre",
    moveSprite: "requin-tigre-move",
    attackSprite: "requin-tigre-attack",
    hp: 100,
    damage: 24,
    patrolSpeed: 125,
    chaseSpeed: 255,
    aggroDist: 650,
  });
}

// ==========================================
// 2. SIRÈNE ÉPÉE & BOUCLIER (Zone 2 - Guerrière Robuste : Équilibrée & Défensive)
// ==========================================
/**
 * Fait apparaître une Guerrière Sirène avec épée et bouclier dans la Zone 2.
 * Ennemi de mêlée équilibré combinant défense et attaques d'estoc.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de la sirène guerrière.
 */
export function spawnSireneEpee(k, startX, startY, player) {
  const PATROL_SPEED = 65;
  const CHASE_SPEED = 155;
  const MIN_Y = 3050;
  const MAX_Y = 6950;
  const AGGRO_DIST = 550;

  const sirene = k.add([
    k.sprite("sirene-epee-idle"),
    k.pos(startX, startY),
    k.scale(2.2),
    k.anchor("center"),
    // Hitbox ajustée à la sirène (16x30 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 16, 30) }),
    k.body({ isStatic: true }),
    k.health(80), // Protégée par son bouclier
    k.state("idle", ["idle", "walk", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "sirene-epee",
    { dirX: 1, damage: 18 },
  ]);

  sirene.onStateEnter("idle", () => {
    setEntitySprite(sirene, k, "sirene-epee-idle", "idle");
    sirene.wait(k.rand(1, 2.5), () => {
      if (sirene.state === "idle") sirene.enterState("walk");
    });
  });

  sirene.onStateUpdate("idle", () => {
    if (player?.pos?.y >= 3000 && player?.pos?.y <= 7000) {
      if (sirene.pos.dist(player.pos) < AGGRO_DIST) {
        sirene.enterState("chase");
      }
    }
  });

  sirene.onStateEnter("walk", () => {
    sirene.dirX = k.chance(0.5) ? 1 : -1;
    setEntitySprite(sirene, k, "sirene-epee-walk", "walk", sirene.dirX < 0);
    sirene.wait(k.rand(2, 4), () => {
      if (sirene.state === "walk") sirene.enterState("idle");
    });
  });

  sirene.onStateUpdate("walk", () => {
    sirene.move(PATROL_SPEED * sirene.dirX, 0);

    if (sirene.pos.x < -7800 || sirene.pos.x > 7800) {
      sirene.dirX *= -1;
      sirene.flipX = sirene.dirX < 0;
    }

    sirene.pos.y = k.clamp(sirene.pos.y, MIN_Y, MAX_Y);

    if (player?.pos?.y >= 3000 && player?.pos?.y <= 7000) {
      if (sirene.pos.dist(player.pos) < AGGRO_DIST) {
        sirene.enterState("chase");
      }
    }
  });

  // ÉTAT : POURSUITE AGGRESSIVE
  sirene.onStateEnter("chase", () => {
    setEntitySprite(sirene, k, "sirene-epee-walk", "walk");
  });

  sirene.onStateUpdate("chase", () => {
    if (!sirene.exists()) return;
    if (!player?.pos || player.pos.y < 3000 || player.pos.y > 7000) {
      sirene.enterState("walk");
      return;
    }

    const dist = sirene.pos.dist(player.pos);
    if (dist < 75) {
      sirene.enterState("attack");
      return;
    }

    let dir = player.pos.sub(sirene.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    sirene.move(dir.scale(CHASE_SPEED));
    sirene.flipX = dir.x < 0;
    sirene.pos.y = k.clamp(sirene.pos.y, MIN_Y, MAX_Y);
  });

  sirene.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < sirene.pos.x : sirene.flipX;
    setEntitySprite(sirene, k, "sirene-epee-attack", "attack", facePlayer);
    if (player?.pos && sirene.pos.dist(player.pos) < 85) {
      player?.takeDamage?.(sirene.damage);
    }
    sirene.wait(0.6, () => {
      if (sirene.state !== "death" && sirene.exists()) {
        sirene.enterState("chase");
      }
    });
  });

  sirene.on("hurt", () => {
    if (sirene.state === "death" || !sirene.exists()) return;
    spawnDamageHitFX(k, sirene.pos);
    sirene.enterState("hurt");
  });

  sirene.onStateEnter("hurt", () => {
    setEntitySprite(sirene, k, "sirene-epee-hurt", "hurt");
    sirene.wait(0.25, () => {
      if (sirene.state !== "death" && sirene.exists()) {
        sirene.enterState("chase");
      }
    });
  });

  sirene.on("death", () => sirene.enterState("death"));
  sirene.onStateEnter("death", () => {
    sirene.untag("enemy");
    setEntitySprite(sirene, k, "sirene-epee-death", "death");
    sirene.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = sirene.pos ? k.vec2(sirene.pos.x, sirene.pos.y) : null;
      k.destroy(sirene);
      if (dropPos) spawnLootItem(k, dropPos, "siren_scale");
    };

    sirene.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    sirene.wait(0.8, finishDeath);
  });

  sirene.enterState("idle");
  return sirene;
}

// ==========================================
// 3. PROJECTILE MAGIQUE DE LA SIRÈNE MAGE
// Vitesse modérée (160 px/s) pour laisser le temps d'esquiver
// ==========================================
/**
 * Instancie une orbe magique guidée tirée par une Sirène Mage.
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").Vec2} startPos - Origine du tir.
 * @param {import("kaplay").Vec2} targetPos - Position cible du joueur.
 * @param {number} [damage=22] - Dégâts infligés au joueur à l'impact.
 * @returns {import("kaplay").GameObj | null} Entité du projectile ou null si paramètres invalides.
 */
export function spawnSireneProjectile(k, startPos, targetPos, damage = 22) {
  if (!startPos || !targetPos) return null;
  let dir = targetPos.sub(startPos);
  if (dir.len() < 0.001) {
    dir = k.vec2(1, 0);
  } else {
    dir = dir.unit();
  }
  const SPEED = 160;

  const proj = k.add([
    k.sprite("sirene-mage-projectile"),
    k.pos(startPos),
    k.scale(3.5),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 6, 6) }),
    k.color(210, 140, 255),
    k.outline(1, k.rgb(255, 230, 255)),
    k.z(45),
    "enemy-projectile",
    {
      dir,
      damage,
      aliveTime: 0,
      exploded: false,
    },
  ]);

  proj.onUpdate(() => {
    if (!proj.exists()) return;
    proj.aliveTime += k.dt();
    proj.move(proj.dir.scale(SPEED));
    // Ondulation aquatique visible
    proj.pos.y += Math.sin(proj.aliveTime * 8) * 0.35;

    // Disparaît après 3.5 secondes
    if (proj.aliveTime > 3.5) {
      k.destroy(proj);
    }
  });

  proj.onCollide("player", (p) => {
    if (!proj.exists() || proj.exploded) return;
    proj.exploded = true;
    p?.takeDamage?.(damage);
    k.destroy(proj);
  });

  return proj;
}

// ==========================================
// 3. SIRÈNE MAGE (Zone 2 & Zone 3 - Canon de verre : Fragile au corps-à-corps, Sorts puissants à distance)
// ==========================================
/**
 * Fait apparaître une Sirène Mage capable d'attaquer à distance dans les Zones 2 ou 3.
 * Canon de verre à faible constitution projetant des orbes magiques.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de la sirène mage.
 */
export function spawnSireneMage(k, startX, startY, player) {
  const PATROL_SPEED = 50;
  const CHASE_SPEED = 115;
  const minY = startY < 7000 ? 3050 : 7050;
  const maxY = startY < 7000 ? 6950 : 11800;
  const AGGRO_DIST = 550;

  const mage = k.add([
    k.sprite("sirene-mage-idle"),
    k.pos(startX, startY),
    k.scale(2.2),
    k.anchor("center"),
    // Hitbox resserrée (16x30 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 16, 30) }),
    k.body({ isStatic: true }),
    k.health(42), // Fragile en PV
    k.state("idle", ["idle", "walk", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "sirene-mage",
    { dirX: 1, damage: 10, projectileDamage: 25 },
  ]);

  mage.onStateEnter("idle", () => {
    setEntitySprite(mage, k, "sirene-mage-idle", "idle");
    mage.wait(k.rand(1.5, 3), () => {
      if (mage.state === "idle" && mage.exists()) mage.enterState("walk");
    });
  });

  mage.onStateUpdate("idle", () => {
    if (!mage.exists()) return;
    if (player?.pos?.y >= minY && player?.pos?.y <= maxY) {
      if (mage.pos.dist(player.pos) < AGGRO_DIST) {
        mage.enterState("chase");
      }
    }
  });

  mage.onStateEnter("walk", () => {
    mage.dirX = k.chance(0.5) ? 1 : -1;
    setEntitySprite(mage, k, "sirene-mage-walk", "walk", mage.dirX < 0);
    mage.wait(k.rand(2, 4), () => {
      if (mage.state === "walk" && mage.exists()) mage.enterState("idle");
    });
  });

  mage.onStateUpdate("walk", () => {
    if (!mage.exists()) return;
    mage.move(PATROL_SPEED * mage.dirX, 0);

    if (mage.pos.x < -7800 || mage.pos.x > 7800) {
      mage.dirX *= -1;
      mage.flipX = mage.dirX < 0;
    }

    mage.pos.y = k.clamp(mage.pos.y, minY, maxY);

    if (player?.pos?.y >= minY && player?.pos?.y <= maxY) {
      if (mage.pos.dist(player.pos) < AGGRO_DIST) {
        mage.enterState("chase");
      }
    }
  });

  mage.onStateEnter("chase", () => {
    setEntitySprite(mage, k, "sirene-mage-walk", "walk");
  });

  mage.onStateUpdate("chase", () => {
    if (!mage.exists()) return;
    if (!player?.pos || player.pos.y < minY || player.pos.y > maxY) {
      mage.enterState("walk");
      return;
    }

    const dist = mage.pos.dist(player.pos);
    if (dist < 200) {
      mage.enterState("attack");
      return;
    }

    let dir = player.pos.sub(mage.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    mage.move(dir.scale(CHASE_SPEED));
    mage.flipX = dir.x < 0;
    mage.pos.y = k.clamp(mage.pos.y, minY, maxY);
  });

  mage.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < mage.pos.x : mage.flipX;
    setEntitySprite(mage, k, "sirene-mage-attack", "attack", facePlayer);

    // Incantation avec délai visible (0.35s) : le projectile se charge et part à vitesse modérée
    mage.wait(0.35, () => {
      if (mage.state !== "attack" && mage.state !== "death" && !mage.exists()) return;
      if (player?.pos && mage.exists()) {
        const attackDir = mage.flipX ? -1 : 1;
        const staffPos = mage.pos.add(attackDir * 24, -10);
        spawnSireneProjectile(k, staffPos, player.pos, mage.projectileDamage || 25);
      }
    });

    mage.wait(0.95, () => {
      if (mage.state !== "death" && mage.exists()) {
        mage.enterState("chase");
      }
    });
  });

  mage.on("hurt", () => {
    if (mage.state === "death" || !mage.exists()) return;
    spawnDamageHitFX(k, mage.pos);
    mage.enterState("hurt");
  });

  mage.onStateEnter("hurt", () => {
    setEntitySprite(mage, k, "sirene-mage-hurt", "hurt");
    mage.wait(0.25, () => {
      if (mage.state !== "death" && mage.exists()) {
        mage.enterState("chase");
      }
    });
  });

  mage.on("death", () => mage.enterState("death"));
  mage.onStateEnter("death", () => {
    mage.untag("enemy");
    setEntitySprite(mage, k, "sirene-mage-death", "death");
    mage.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = mage.pos ? k.vec2(mage.pos.x, mage.pos.y) : null;
      k.destroy(mage);
      if (dropPos) spawnLootItem(k, dropPos, "magic_pearl");
    };

    mage.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    mage.wait(0.8, finishDeath);
  });

  mage.enterState("idle");
  return mage;
}

// ==========================================
// 4. LE POISSON EXPLOSIF (Zone 2 & Zone 3 - Kamikaze : Très peu de PV, Dégâts d'explosion dévastateurs)
// ==========================================
/**
 * Fait apparaître un Poisson Explosif kamikaze dans les Zones 2 ou 3.
 * Créature fragile qui s'approche rapidement et s'autodétruit en infligeant 35 dégâts.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du poisson explosif.
 */
export function spawnPoissonExplosif(k, startX, startY, player) {
  const DRIFT_SPEED = 25;
  const CHASE_SPEED = 140;
  const minY = startY < 7000 ? 3050 : 7050;
  const maxY = startY < 7000 ? 6950 : 11800;
  const AGGRO_DIST = 450;

  const poisson = k.add([
    k.sprite("poisson-explosif-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    // Hitbox resserrée (16x12 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 16, 12) }),
    k.body({ isStatic: true }),
    k.health(25), // Très fragile : neutralisable avant qu'il n'explose
    k.state("drift", ["drift", "chase", "explode", "hurt", "death"]),
    k.timer(),
    "enemy",
    "poisson-explosif",
    { dirX: 1, dirY: 0, damage: 35 }, // Punitif en cas de détonation
  ]);

  poisson.onStateEnter("drift", () => {
    poisson.dirX = k.rand(-0.6, 0.6);
    poisson.dirY = k.rand(-0.3, 0.3);
    setEntitySprite(poisson, k, "poisson-explosif-walk", "walk", poisson.dirX < 0);
    poisson.wait(k.rand(3, 6), () => {
      if (poisson.state === "drift") poisson.enterState("drift");
    });
  });

  poisson.onStateUpdate("drift", () => {
    poisson.move(DRIFT_SPEED * poisson.dirX, DRIFT_SPEED * poisson.dirY);

    if (poisson.pos.x < -7800 || poisson.pos.x > 7800) {
      poisson.dirX *= -1;
      poisson.flipX = poisson.dirX < 0;
    }

    poisson.pos.y = k.clamp(poisson.pos.y, minY, maxY);

    if (player?.pos?.y >= minY && player?.pos?.y <= maxY) {
      if (poisson.pos.dist(player.pos) < AGGRO_DIST) {
        poisson.enterState("chase");
      }
    }
  });

  poisson.onStateEnter("chase", () => {
    setEntitySprite(poisson, k, "poisson-explosif-walk", "walk");
  });

  poisson.onStateUpdate("chase", () => {
    if (!poisson.exists()) return;
    if (!player?.pos || player.pos.y < minY || player.pos.y > maxY) {
      poisson.enterState("drift");
      return;
    }

    const dist = poisson.pos.dist(player.pos);
    if (dist < 45) {
      poisson.enterState("explode");
      return;
    }

    let dir = player.pos.sub(poisson.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    poisson.move(dir.scale(CHASE_SPEED));
    poisson.flipX = dir.x < 0;
    poisson.pos.y = k.clamp(poisson.pos.y, minY, maxY);
  });

  poisson.onStateEnter("explode", () => {
    poisson.untag("enemy");
    const facePlayer = player?.pos ? player.pos.x < poisson.pos.x : poisson.flipX;
    setEntitySprite(poisson, k, "poisson-explosif-death", "death", facePlayer);
    k.shake(6);

    if (player?.pos && poisson.pos.dist(player.pos) < 85) {
      player?.takeDamage?.(poisson.damage);
    }

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = poisson.pos ? k.vec2(poisson.pos.x, poisson.pos.y) : null;
      k.destroy(poisson);
      if (dropPos) spawnLootItem(k, dropPos, "explosive_dust");
    };

    poisson.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    poisson.wait(0.8, finishDeath);
  });

  poisson.on("hurt", () => {
    if (poisson.state === "death" || poisson.state === "explode" || !poisson.exists()) return;
    spawnDamageHitFX(k, poisson.pos);
    poisson.enterState("hurt");
  });

  poisson.onStateEnter("hurt", () => {
    setEntitySprite(poisson, k, "poisson-explosif-hurt", "hurt");
    poisson.wait(0.2, () => {
      if (poisson.state !== "death" && poisson.state !== "explode" && poisson.exists()) {
        poisson.enterState("chase");
      }
    });
  });

  poisson.on("death", () => {
    if (poisson.state === "death" || poisson.state === "explode" || !poisson.exists()) return;
    poisson.enterState("explode");
  });

  poisson.enterState("drift");
  return poisson;
}

// ==========================================
// 5. MONSTRE À LA LANCE (Zone 3 - Lancier Abyssal Lourd : Vitesse mesurée, Dégâts d'estoc mortels)
// ==========================================
/**
 * Fait apparaître un Lancier Abyssal Lourd dans la Zone 3.
 * Guerrier d'élite muni d'un trident infligeant de lourds dégâts au corps-à-corps.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du lancier abyssal.
 */
export function spawnMonstreLance(k, startX, startY, player) {
  const PATROL_SPEED = 65;
  const CHASE_SPEED = 165;
  const MIN_Y = 7050;
  const MAX_Y = 11800;
  const AGGRO_DIST = 550;

  const lancier = k.add([
    k.sprite("monstre-lance-idle"),
    k.pos(startX, startY),
    k.scale(2.2),
    k.anchor("center"),
    // Hitbox resserrée (20x26 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 20, 26) }),
    k.body({ isStatic: true }),
    k.health(95),
    k.state("idle", ["idle", "walk", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "monstre-lance",
    { dirX: 1, damage: 32 }, // Frappe lourde et transperçante
  ]);

  lancier.onStateEnter("idle", () => {
    setEntitySprite(lancier, k, "monstre-lance-idle", "idle");
    lancier.wait(k.rand(1, 3), () => {
      if (lancier.state === "idle" && lancier.exists()) lancier.enterState("walk");
    });
  });

  lancier.onStateUpdate("idle", () => {
    if (!lancier.exists()) return;
    if (player?.pos?.y >= MIN_Y && player?.pos?.y <= MAX_Y) {
      if (lancier.pos.dist(player.pos) < AGGRO_DIST) {
        lancier.enterState("chase");
      }
    }
  });

  lancier.onStateEnter("walk", () => {
    lancier.dirX = k.chance(0.5) ? 1 : -1;
    setEntitySprite(lancier, k, "monstre-lance-walk", "walk", lancier.dirX < 0);
    lancier.wait(k.rand(2, 4), () => {
      if (lancier.state === "walk" && lancier.exists()) lancier.enterState("idle");
    });
  });

  lancier.onStateUpdate("walk", () => {
    if (!lancier.exists()) return;
    lancier.move(PATROL_SPEED * lancier.dirX, 0);

    if (lancier.pos.x < -7800 || lancier.pos.x > 7800) {
      lancier.dirX *= -1;
      lancier.flipX = lancier.dirX < 0;
    }

    lancier.pos.y = k.clamp(lancier.pos.y, MIN_Y, MAX_Y);

    if (player?.pos?.y >= MIN_Y && player?.pos?.y <= MAX_Y) {
      if (lancier.pos.dist(player.pos) < AGGRO_DIST) {
        lancier.enterState("chase");
      }
    }
  });

  lancier.onStateEnter("chase", () => {
    setEntitySprite(lancier, k, "monstre-lance-walk", "walk");
  });

  lancier.onStateUpdate("chase", () => {
    if (!lancier.exists()) return;
    if (!player?.pos || player.pos.y < MIN_Y || player.pos.y > MAX_Y) {
      lancier.enterState("walk");
      return;
    }

    const dist = lancier.pos.dist(player.pos);
    if (dist < 85) {
      lancier.enterState("attack");
      return;
    }

    let dir = player.pos.sub(lancier.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    lancier.move(dir.scale(CHASE_SPEED));
    lancier.flipX = dir.x < 0;
    lancier.pos.y = k.clamp(lancier.pos.y, MIN_Y, MAX_Y);
  });

  lancier.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < lancier.pos.x : lancier.flipX;
    setEntitySprite(lancier, k, "monstre-lance-attack", "attack", facePlayer);

    if (player?.pos && lancier.pos.dist(player.pos) < 95) {
      player?.takeDamage?.(lancier.damage);
    }

    lancier.wait(0.6, () => {
      if (lancier.state !== "death" && lancier.exists()) {
        lancier.enterState("chase");
      }
    });
  });

  lancier.on("hurt", () => {
    if (lancier.state === "death" || !lancier.exists()) return;
    spawnDamageHitFX(k, lancier.pos);
    lancier.enterState("hurt");
  });

  lancier.onStateEnter("hurt", () => {
    setEntitySprite(lancier, k, "monstre-lance-hurt", "hurt");
    lancier.wait(0.25, () => {
      if (lancier.state !== "death" && lancier.exists()) {
        lancier.enterState("chase");
      }
    });
  });

  lancier.on("death", () => lancier.enterState("death"));
  lancier.onStateEnter("death", () => {
    lancier.untag("enemy");
    setEntitySprite(lancier, k, "monstre-lance-death", "death");
    lancier.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = lancier.pos ? k.vec2(lancier.pos.x, lancier.pos.y) : null;
      k.destroy(lancier);
      if (dropPos) spawnLootItem(k, dropPos, "trident_tip");
    };

    lancier.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    lancier.wait(0.8, finishDeath);
  });

  lancier.enterState("idle");
  return lancier;
}

// ==========================================
// 6. LA PIEUVRE (Zone 2 - Colosse Tentaculaire : Beaucoup de PV, Vitesse mesurée, Dégâts contrôlés)
// ==========================================
/**
 * Fait apparaître une Pieuvre géante dans la Zone 2.
 * Colosse tentaculaire doté d'une grande réserve de points de vie (75 PV).
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de la pieuvre géante.
 */
export function spawnPieuvre(k, startX, startY, player) {
  const PATROL_SPEED = 55;
  const CHASE_SPEED = 130;
  const MIN_Y = 3050;
  const MAX_Y = 6950;
  const AGGRO_DIST = 550;

  const pieuvre = k.add([
    k.sprite("pieuvre-idle"),
    k.pos(startX, startY),
    k.scale(2.2),
    k.anchor("center"),
    // Hitbox resserrée (22x20 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 22, 20) }),
    k.body({ isStatic: true }),
    k.health(115), // Gros réservoir de points de vie
    k.state("idle", ["idle", "walk", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "pieuvre",
    { dirX: 1, dirY: 0, damage: 14 },
  ]);

  pieuvre.onStateEnter("idle", () => {
    setEntitySprite(pieuvre, k, "pieuvre-idle", "idle");
    pieuvre.wait(k.rand(1, 3), () => {
      if (pieuvre.state === "idle" && pieuvre.exists()) pieuvre.enterState("walk");
    });
  });

  pieuvre.onStateUpdate("idle", () => {
    if (!pieuvre.exists()) return;
    if (player?.pos?.y >= MIN_Y && player?.pos?.y <= MAX_Y) {
      if (pieuvre.pos.dist(player.pos) < AGGRO_DIST) {
        pieuvre.enterState("chase");
      }
    }
  });

  pieuvre.onStateEnter("walk", () => {
    pieuvre.dirX = k.rand(-1, 1);
    pieuvre.dirY = k.rand(-0.4, 0.4);
    setEntitySprite(pieuvre, k, "pieuvre-walk", "walk", pieuvre.dirX < 0);
    pieuvre.wait(k.rand(2, 4), () => {
      if (pieuvre.state === "walk" && pieuvre.exists()) pieuvre.enterState("idle");
    });
  });

  pieuvre.onStateUpdate("walk", () => {
    if (!pieuvre.exists()) return;
    pieuvre.move(PATROL_SPEED * pieuvre.dirX, PATROL_SPEED * pieuvre.dirY);

    if (pieuvre.pos.x < -7800 || pieuvre.pos.x > 7800) {
      pieuvre.dirX *= -1;
      pieuvre.flipX = pieuvre.dirX < 0;
    }

    pieuvre.pos.y = k.clamp(pieuvre.pos.y, MIN_Y, MAX_Y);

    if (player?.pos?.y >= MIN_Y && player?.pos?.y <= MAX_Y) {
      if (pieuvre.pos.dist(player.pos) < AGGRO_DIST) {
        pieuvre.enterState("chase");
      }
    }
  });

  pieuvre.onStateEnter("chase", () => {
    setEntitySprite(pieuvre, k, "pieuvre-walk", "walk");
  });

  pieuvre.onStateUpdate("chase", () => {
    if (!pieuvre.exists()) return;
    if (!player?.pos || player.pos.y < MIN_Y || player.pos.y > MAX_Y) {
      pieuvre.enterState("walk");
      return;
    }

    const dist = pieuvre.pos.dist(player.pos);
    if (dist < 75) {
      pieuvre.enterState("attack");
      return;
    }

    let dir = player.pos.sub(pieuvre.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    pieuvre.move(dir.scale(CHASE_SPEED));
    pieuvre.flipX = dir.x < 0;
    pieuvre.pos.y = k.clamp(pieuvre.pos.y, MIN_Y, MAX_Y);
  });

  pieuvre.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < pieuvre.pos.x : pieuvre.flipX;
    setEntitySprite(pieuvre, k, "pieuvre-attack", "attack", facePlayer);
    if (player?.pos && pieuvre.pos.dist(player.pos) < 85) {
      player?.takeDamage?.(pieuvre.damage);
    }
    pieuvre.wait(0.6, () => {
      if (pieuvre.state !== "death" && pieuvre.exists()) {
        pieuvre.enterState("chase");
      }
    });
  });

  pieuvre.on("hurt", () => {
    if (pieuvre.state === "death" || !pieuvre.exists()) return;
    spawnDamageHitFX(k, pieuvre.pos);
    pieuvre.enterState("hurt");
  });

  pieuvre.onStateEnter("hurt", () => {
    setEntitySprite(pieuvre, k, "pieuvre-hurt", "hurt");
    pieuvre.wait(0.25, () => {
      if (pieuvre.state !== "death" && pieuvre.exists()) {
        pieuvre.enterState("chase");
      }
    });
  });

  pieuvre.on("death", () => pieuvre.enterState("death"));
  pieuvre.onStateEnter("death", () => {
    pieuvre.untag("enemy");
    setEntitySprite(pieuvre, k, "pieuvre-death", "death");
    pieuvre.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = pieuvre.pos ? k.vec2(pieuvre.pos.x, pieuvre.pos.y) : null;
      k.destroy(pieuvre);
      if (dropPos) spawnLootItem(k, dropPos, "pieuvre_tentacle");
    };

    pieuvre.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    pieuvre.wait(0.8, finishDeath);
  });

  pieuvre.enterState("idle");
  return pieuvre;
}

// ==========================================
// 7. LE POISSON-LANTERNE (Zone 2 & 3 - Chasseur Véloce des Abysses : Très Rapide, Moins de Dégâts)
// ==========================================
/**
 * Fait apparaître un Poisson-Lanterne dans les Zones 2 ou 3.
 * Chasseur rapide des ténèbres abyssales guidé par sa bioluminescence.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité du poisson-lanterne.
 */
export function spawnPoissonLanterne(k, startX, startY, player) {
  const PATROL_SPEED = 85;
  const CHASE_SPEED = 215;
  const minY = startY < 7000 ? 3050 : 7050;
  const maxY = startY < 7000 ? 6950 : 11800;
  const AGGRO_DIST = 550;

  const lanterne = k.add([
    k.sprite("lanterne-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    // Hitbox resserrée (20x14 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 20, 14) }),
    k.body({ isStatic: true }),
    k.health(45),
    k.state("idle", ["idle", "walk", "chase", "attack", "hurt", "death"]),
    k.timer(),
    "enemy",
    "poisson-lanterne",
    { dirX: 1, damage: 13 },
  ]);

  lanterne.onStateEnter("idle", () => {
    setEntitySprite(lanterne, k, "lanterne-idle", "idle");
    lanterne.wait(k.rand(1, 3), () => {
      if (lanterne.state === "idle" && lanterne.exists()) lanterne.enterState("walk");
    });
  });

  lanterne.onStateUpdate("idle", () => {
    if (!lanterne.exists()) return;
    if (player?.pos?.y >= minY && player?.pos?.y <= maxY) {
      if (lanterne.pos.dist(player.pos) < AGGRO_DIST) {
        lanterne.enterState("chase");
      }
    }
  });

  lanterne.onStateEnter("walk", () => {
    lanterne.dirX = k.chance(0.5) ? 1 : -1;
    setEntitySprite(lanterne, k, "lanterne-walk", "walk", lanterne.dirX < 0);
    lanterne.wait(k.rand(2, 5), () => {
      if (lanterne.state === "walk" && lanterne.exists()) lanterne.enterState("idle");
    });
  });

  lanterne.onStateUpdate("walk", () => {
    if (!lanterne.exists()) return;
    lanterne.move(PATROL_SPEED * lanterne.dirX, 0);

    if (lanterne.pos.x < -7800 || lanterne.pos.x > 7800) {
      lanterne.dirX *= -1;
      lanterne.flipX = lanterne.dirX < 0;
    }

    lanterne.pos.y = k.clamp(lanterne.pos.y, minY, maxY);

    if (player?.pos?.y >= minY && player?.pos?.y <= maxY) {
      if (lanterne.pos.dist(player.pos) < AGGRO_DIST) {
        lanterne.enterState("chase");
      }
    }
  });

  lanterne.onStateEnter("chase", () => {
    setEntitySprite(lanterne, k, "lanterne-walk", "walk");
  });

  lanterne.onStateUpdate("chase", () => {
    if (!lanterne.exists()) return;
    if (!player?.pos || player.pos.y < minY || player.pos.y > maxY) {
      lanterne.enterState("walk");
      return;
    }

    const dist = lanterne.pos.dist(player.pos);
    if (dist < 65) {
      lanterne.enterState("attack");
      return;
    }

    let dir = player.pos.sub(lanterne.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    lanterne.move(dir.scale(CHASE_SPEED));
    lanterne.flipX = dir.x < 0;
    lanterne.pos.y = k.clamp(lanterne.pos.y, minY, maxY);
  });

  lanterne.onStateEnter("attack", () => {
    const facePlayer = player?.pos ? player.pos.x < lanterne.pos.x : lanterne.flipX;
    setEntitySprite(lanterne, k, "lanterne-attack", "attack", facePlayer);
    if (player?.pos && lanterne.pos.dist(player.pos) < 75) {
      player?.takeDamage?.(lanterne.damage);
    }
    lanterne.wait(0.6, () => {
      if (lanterne.state !== "death" && lanterne.exists()) {
        lanterne.enterState("chase");
      }
    });
  });

  lanterne.on("hurt", () => {
    if (lanterne.state === "death" || !lanterne.exists()) return;
    spawnDamageHitFX(k, lanterne.pos);
    lanterne.enterState("hurt");
  });

  lanterne.onStateEnter("hurt", () => {
    setEntitySprite(lanterne, k, "lanterne-hurt", "hurt");
    lanterne.wait(0.25, () => {
      if (lanterne.state !== "death" && lanterne.exists()) {
        lanterne.enterState("chase");
      }
    });
  });

  lanterne.on("death", () => lanterne.enterState("death"));
  lanterne.onStateEnter("death", () => {
    lanterne.untag("enemy");
    setEntitySprite(lanterne, k, "lanterne-death", "death");
    lanterne.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = lanterne.pos ? k.vec2(lanterne.pos.x, lanterne.pos.y) : null;
      k.destroy(lanterne);
      if (dropPos) spawnLootItem(k, dropPos, "lantern");
    };

    lanterne.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    lanterne.wait(0.8, finishDeath);
  });

  lanterne.enterState("idle");
  return lanterne;
}

// ==========================================
// 8. MINES NAVALES FLOTTANTES (Dangers 100% Fixes)
// ==========================================
/**
 * Instancie une mine navale statique explosive.
 * Déclenche une secousse d'écran et des dégâts majeurs au contact du joueur.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {boolean} [isBig=false] - Indique s'il s'agit d'une mine lourde (45 dégâts au lieu de 25).
 * @returns {import("kaplay").GameObj} Entité de la mine navale.
 */
export function spawnMine(k, startX, startY, isBig = false) {
  const spriteName = isBig ? "mine-big" : "mine";
  const damage = isBig ? 45 : 25;

  const mine = k.add([
    k.sprite(spriteName),
    k.pos(startX, startY),
    k.scale(isBig ? 1.5 : 2),
    k.anchor("center"),
    // Hitbox resserrée au corps de la mine
    k.area({ shape: new k.Rect(k.vec2(0, 0), isBig ? 32 : 18, isBig ? 32 : 18) }),
    k.body({ isStatic: true }),
    "enemy",
    "naval-mine",
    { damage, isExploded: false },
  ]);

  mine.onCollide("player", (p) => {
    if (mine.isExploded || !mine.exists()) return;
    mine.isExploded = true;
    mine.untag("enemy");
    p?.takeDamage?.(damage);
    k.shake(isBig ? 10 : 5);
    k.destroy(mine);
  });

  return mine;
}
