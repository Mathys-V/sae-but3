import { stats, triggerNotification } from "./stats.js";

/**
 * Instancie et configure l'entité du joueur (plongeur) avec son modèle physique,
 * ses animations adaptatives (marche, nage, attaque), son système de survie (O2, PV),
 * la gestion des dégâts/i-frames et ses contrôles au clavier/souris.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale d'apparition (sur la barque ou dans l'eau).
 * @param {number} startY - Position Y initiale d'apparition.
 * @returns {import("kaplay").GameObj} L'entité joueur initialisée.
 */
export function setupPlayer(k, startX, startY) {
  const WATER_LEVEL = 0;

  const initialIsUnderwater = startY > WATER_LEVEL;
  const initialSprite = initialIsUnderwater ? "diver-idle" : "diver-idle-boat";

  const player = k.add([
    k.sprite(initialSprite),
    k.pos(startX, startY),
    k.scale(2),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 14, 14) }),
    k.body(),
    k.anchor("center"),
    "player",
  ]);

  if (initialIsUnderwater) {
    player.play("idle");
  }

  // Persistance de la direction du joueur
  let facingLeft = false;
  let isAttacking = false;
  let isInvincible = false;
  let invulnerableTimer = 0;
  let isDying = false;
  let currentAnim = initialIsUnderwater ? "idle" : "idle-boat";

  const setFacing = (left) => {
    facingLeft = left;
    player.flipX = left;
  };

  const isMoving = () => {
    return (
      k.isKeyDown("left") ||
      k.isKeyDown("right") ||
      k.isKeyDown("up") ||
      k.isKeyDown("down") ||
      k.isKeyDown("q") ||
      k.isKeyDown("d") ||
      k.isKeyDown("z") ||
      k.isKeyDown("s") ||
      k.isKeyDown("a") ||
      k.isKeyDown("w")
    );
  };

  const getTargetAnim = (moving, isUnderwater) => {
    if (moving) {
      return isUnderwater
        ? { anim: "swim", sprite: "diver-swim" }
        : { anim: "walk", sprite: "diver-walk" };
    }
    return isUnderwater
      ? { anim: "idle", sprite: "diver-idle" }
      : { anim: "idle-boat", sprite: "diver-idle-boat" };
  };

  const updateMovementAnimation = () => {
    if (isAttacking || isDying) return;

    const moving = isMoving();
    const isUnderwater = player.pos.y > WATER_LEVEL;
    const target = getTargetAnim(moving, isUnderwater);

    if (currentAnim !== target.anim) {
      player.use(k.sprite(target.sprite));
      if (target.anim !== "idle-boat") {
        player.play(target.anim);
      }
      currentAnim = target.anim;
    }

    player.flipX = facingLeft;
  };

  // SYSTÈME DE DÉGÂTS ET DE MORT CENTRALISÉ (Avec 1.0s d'invulnérabilité / i-frames)
  player.takeDamage = (amount, isSuffocation = false) => {
    if (isDying) return;

    if (isSuffocation) {
      stats.hp = Math.max(0, stats.hp - amount);
      if (stats.hp <= 0) {
        player.die();
      }
      return;
    }

    if (isInvincible) return;

    // Déclenchement d'1 seconde d'invulnérabilité pour éviter d'être enchaîné
    isInvincible = true;
    invulnerableTimer = 1.0;

    stats.hp = Math.max(0, stats.hp - amount);
    k.shake(amount > 20 ? 8 : 4);
    try {
      k.play("sfx-hurt", { volume: 0.8 });
    } catch {
      /* Audio error ignored */
    }

    player.color = k.rgb(255, 80, 80);
    k.wait(0.15, () => {
      player.color = k.rgb(255, 255, 255);
    });

    if (stats.hp <= 0) {
      player.die();
    }
  };

  player.die = () => {
    if (isDying) return;
    isDying = true;
    isInvincible = true;
    invulnerableTimer = 0;

    try {
      k.play("sfx-death", { volume: 0.9 });
    } catch {
      /* Audio error ignored */
    }

    // Réinitialisation survie et perte du butin personnel
    stats.hp = stats.maxHp;
    stats.o2 = stats.maxO2;
    stats.inventory = [];

    // Téléportation immédiate sur la barque au centre parfait (x = 0, y = -58)
    player.pos = k.vec2(0, -58);
    if (player.vel) {
      player.vel.x = 0;
      player.vel.y = 0;
    }
    player.gravityScale = 1;
    if (player.resetSolidsHistory) {
      player.resetSolidsHistory(0, -58);
    }

    currentAnim = "idle-boat";
    player.use(k.sprite("diver-idle-boat"));
    player.flipX = false;
    facingLeft = false;

    // Notification HUD centrale
    triggerNotification("( X ) Vous avez sombre ! Sac perdu...", [248, 113, 113], 3.5);

    // Régénération complète du Boss Requin en cas de mort du joueur (anti-suicide exploit)
    if (!stats.bossDefeated) {
      const bosses = k.get("requin-boss");
      for (const b of bosses) {
        if (b.hp && stats.bossMaxHp) {
          b.setHP(stats.bossMaxHp);
          stats.bossHp = stats.bossMaxHp;
          if (b.state !== "patrol") b.enterState("patrol");
        }
      }
      stats.bossActive = false;
    }

    let flashes = 0;
    const blinkLoop = k.loop(0.15, () => {
      if (!player.exists()) {
        blinkLoop.cancel();
        return;
      }
      player.opacity = player.opacity === 1 ? 0.35 : 1;
      flashes++;
      if (flashes >= 12) {
        blinkLoop.cancel();
        player.opacity = 1;
        isInvincible = false;
        isDying = false;
        updateMovementAnimation();
      }
    });

    window.dispatchEvent(new CustomEvent("plongee-inventory-updated"));
  };

  const updateInvulnerability = (dt) => {
    if (invulnerableTimer <= 0) return;
    invulnerableTimer -= dt;
    player.opacity = Math.floor(invulnerableTimer * 10) % 2 === 0 ? 0.35 : 1;

    if (invulnerableTimer <= 0) {
      invulnerableTimer = 0;
      isInvincible = false;
      player.opacity = 1;
    }
  };

  const updateEnvironmentAndVitals = (dt) => {
    if (player.pos.y > WATER_LEVEL) {
      player.gravityScale = 0;
      if (player.vel) {
        player.vel.x *= 0.9;
        player.vel.y *= 0.9;
      }
      stats.o2 = Math.max(0, stats.o2 - dt);
      if (stats.o2 <= 0) {
        player.takeDamage(12 * dt, true);
      }
    } else {
      player.gravityScale = 1;
      stats.o2 = Math.min(stats.maxO2, stats.o2 + dt * 25);
      stats.hp = Math.min(stats.maxHp, stats.hp + dt * 8);
    }
  };

  const checkBoatInteractions = (isOnBoat) => {
    if (!isOnBoat) return null;
    const barrels = k.get("inventory-barrel");
    const barrel = barrels.length > 0 ? barrels[0] : null;
    const fishermen = k.get("fisherman");
    const fisherman = fishermen.length > 0 ? fishermen[0] : null;

    const distBarrel = barrel ? Math.abs(player.pos.x - barrel.pos.x) : 999;
    const fishermanVisualX = fisherman ? fisherman.pos.x - 25 : 999;
    const distFisherman = fisherman ? Math.abs(player.pos.x - fishermanVisualX) : 999;

    if (distBarrel < 48 && distBarrel < distFisherman) {
      return "barrel";
    }
    if (distFisherman < 48 && distFisherman < distBarrel) {
      return "fisherman";
    }
    return null;
  };

  // GESTION DE LA PHYSIQUE, DE LA SURVIE ET DES INTERACTIONS SUR LE BATEAU
  k.onUpdate(() => {
    if (isDying) return;
    const dt = k.dt();

    updateInvulnerability(dt);

    const isOnBoat = player.pos.y <= WATER_LEVEL + 40 && Math.abs(player.pos.x) < 250;
    stats.isPlayerOnBoat = isOnBoat;

    updateEnvironmentAndVitals(dt);
    stats.currentInteraction = checkBoatInteractions(isOnBoat);

    player.flipX = facingLeft;
    updateMovementAnimation();
  });

  const handleMovement = (x, y) => {
    if (isDying) return;

    if (player.pos.y > WATER_LEVEL) {
      player.move(x, y);
    } else if (x !== 0) {
      player.move(x, 0);
    }

    if (!isAttacking) {
      if (x < 0) setFacing(true);
      if (x > 0) setFacing(false);
    }

    updateMovementAnimation();
  };

  // ÉTAPE 1 : COMBAT DE MÊLÉE (COUP DE HARPON / ESTOC)
  const attack = () => {
    if (isAttacking || isDying) return;
    isAttacking = true;

    try {
      k.play("sfx-attack", { volume: 0.65 });
    } catch {
      /* Audio error ignored */
    }

    const mousePos = k.toWorld ? k.toWorld(k.mousePos()) : k.mousePos();
    if (mousePos.x < player.pos.x) {
      setFacing(true);
    } else if (mousePos.x > player.pos.x) {
      setFacing(false);
    }

    const isUnderwater = player.pos.y > WATER_LEVEL;
    const attackSprite = isUnderwater
      ? "diver-attack-underwater"
      : "diver-attack";

    currentAnim = "attack";
    player.use(k.sprite(attackSprite));
    player.play("attack");
    player.flipX = facingLeft;

    const attackDir = facingLeft ? -1 : 1;
    const hitCenter = k.vec2(player.pos.x + attackDir * 35, player.pos.y);

    const hitTargets = new Set();

    const harpoonHitbox = k.add([
      k.rect(36, 18),
      k.pos(hitCenter),
      k.anchor("center"),
      k.area(),
      k.opacity(0),
      "harpoon",
    ]);

    const hitTarget = (target) => {
      if (!target || hitTargets.has(target)) return;
      hitTargets.add(target);
      try {
        k.play("sfx-hit", { volume: 0.75 });
      } catch {
        /* Audio error ignored */
      }
      if (target.is("enemy") && target.hurt) {
        target.hurt(stats.damage || 15);
      } else if (target.is("npc") && target.hurt) {
        target.hurt(0);
      }
    };

    harpoonHitbox.onCollide("enemy", hitTarget);
    harpoonHitbox.onCollide("npc", hitTarget);
    harpoonHitbox.onCollide("enemy-projectile", (proj) => {
      if (proj?.exists()) {
        try {
          k.play("sfx-hit", { volume: 0.75 });
        } catch {
          /* Audio error ignored */
        }
        k.destroy(proj);
      }
    });

    const enemies = k.get("enemy");
    for (const enemy of enemies) {
      if (enemy.pos && hitCenter.dist(enemy.pos) <= 35) {
        hitTarget(enemy);
      }
    }
    const npcs = k.get("npc");
    for (const npc of npcs) {
      if (npc.pos && hitCenter.dist(npc.pos) <= 35) {
        hitTarget(npc);
      }
    }

    k.wait(0.2, () => {
      if (harpoonHitbox.exists()) {
        k.destroy(harpoonHitbox);
      }
    });

    // Sécurité de fin d'animation d'attaque (0.35s)
    k.wait(0.35, () => {
      if (isAttacking) {
        isAttacking = false;
        currentAnim = null;
        updateMovementAnimation();
      }
    });
  };

  // Enregistrement unique de la fin d'animation de l'attaque pour éviter toute fuite d'écouteurs
  player.onAnimEnd((anim) => {
    if (anim === "attack") {
      isAttacking = false;
      currentAnim = null;
      updateMovementAnimation();
    }
  });

  k.onMousePress("left", attack);

  const depositBagIntoBarrel = (barrel) => {
    const personalItems = stats.inventory || [];
    if (personalItems.length === 0) {
      triggerNotification("( ! ) Sac vide : plongez pour recolter du butin !", [251, 191, 36], 3.0);
      return;
    }

    if (!stats.barrelInventory) stats.barrelInventory = [];

    for (const item of personalItems) {
      const existing = stats.barrelInventory.find((b) => b.id === item.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + (item.qty || 1);
      } else {
        stats.barrelInventory.push({ ...item });
      }
    }

    const count = personalItems.reduce((sum, i) => sum + (i.qty || 1), 0);
    stats.inventory = [];

    if (barrel) {
      barrel.use(k.sprite("barrel-full"));
      barrel.use(k.scale(2.8));
    }

    try {
      k.play("sfx-deposit", { volume: 0.8 });
    } catch {
      /* Audio error ignored */
    }

    triggerNotification(`( + ) ${count} butin(s) depose(s) dans le Tonneau !`, [56, 189, 248], 3.0);
    window.dispatchEvent(new CustomEvent("plongee-inventory-updated"));
  };

  // ÉTAPE 3 : INTERACTION AU TONNEAU ET AU MARCHAND (TOUCHE E)
  k.onKeyPress("e", () => {
    if (!stats.isPlayerOnBoat) return;

    if (stats.currentInteraction === "barrel") {
      const barrels = k.get("inventory-barrel");
      const barrel = barrels.length > 0 ? barrels[0] : null;
      depositBagIntoBarrel(barrel);
    } else if (stats.currentInteraction === "fisherman") {
      window.dispatchEvent(new CustomEvent("plongee-open-shop"));
    }
  });

  // COLLISIONS : Dégâts au contact des ennemis (premier contact & contact continu)
  const handleEnemyHit = (enemy) => {
    if (!enemy?.exists() || isInvincible || isDying) return;
    const enemyDmg = enemy.damage || 15;
    player.takeDamage(enemyDmg);

    if (enemy.pos && player.pos) {
      let pushDir = player.pos.sub(enemy.pos);
      if (pushDir.len() < 0.001) {
        pushDir = k.vec2(1, 0);
      } else {
        pushDir = pushDir.unit();
      }
      if (player.move) {
        player.move(pushDir.scale(220));
      }
    }
  };

  // Détection du premier contact
  player.onCollide("enemy", handleEnemyHit);

  // Détection du contact continu (si le mob colle au joueur après la fin de la frame d'invincibilité)
  player.onCollideUpdate("enemy", handleEnemyHit);

  // COLLISIONS : Ramassage des loots
  player.onCollide("loot", (lootObj) => {
    if (lootObj.collect) {
      lootObj.collect();
    }
  });

  // COMMANDES DE DÉPLACEMENT
  k.onKeyDown(["left", "q", "a"], () => handleMovement(-stats.speed, 0));
  k.onKeyDown(["right", "d"], () => handleMovement(stats.speed, 0));
  k.onKeyDown(["down", "s"], () => handleMovement(0, stats.speed));

  k.onKeyDown(["up", "z", "w"], () => {
    handleMovement(0, -stats.speed);

    if (player.pos.y > WATER_LEVEL && player.pos.y < WATER_LEVEL + 40) {
      player.jump(650);
    }
    if (player.isGrounded()) {
      player.jump(500);
    }
  });

  k.onKeyRelease(
    ["left", "right", "up", "down", "q", "d", "z", "s", "a", "w"],
    () => {
      updateMovementAnimation();
    },
  );

  return player;
}
