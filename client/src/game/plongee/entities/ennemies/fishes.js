import { spawnLootItem } from "../items.js";
import { spawnDamageHitFX } from "./monsters.js";

// Limites d'habitat de la Zone 1 (Surface à 3 000 m)
const ZONE1_MIN_Y = 60;
const ZONE1_MAX_Y = 2950;

// ==========================================
// 1. L'ANGUILLE (Harceleur agile & rapide, PV modérés, Dégâts légers)
// ==========================================
/**
 * Fait apparaître une Anguille électrique dans la Zone 1.
 * Harceleur rapide qui patrouille paisiblement puis poursuit le joueur lorsqu'elle est attaquée.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de l'anguille.
 */
export function spawnAnguille(k, startX, startY, player) {
  const PATROL_SPEED = 110;
  const CHASE_SPEED = 225;

  const anguille = k.add([
    k.sprite("anguille-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    // Hitbox ajustée au corps élancé de l'anguille (36x11 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 28, 10) }),
    k.body({ isStatic: true }),
    k.health(28),
    k.state("idle", ["idle", "walk", "chase", "hurt", "death"]),
    k.timer(),
    "enemy",
    "anguille",
    { dirX: 1, dirY: 0, damage: 8 },
  ]);

  // ÉTAT : PAUSE (Attend paisiblement sur place)
  anguille.onStateEnter("idle", () => {
    anguille.use(k.sprite("anguille-idle"));
    anguille.play("idle");
    anguille.wait(k.rand(1, 3), () => {
      if (anguille.state === "idle") anguille.enterState("walk");
    });
  });

  // ÉTAT : PATROUILLE PAISIBLE
  anguille.onStateEnter("walk", () => {
    anguille.use(k.sprite("anguille-walk"));
    anguille.play("walk");

    anguille.dirX = k.rand(-1, 1);
    anguille.dirY = k.rand(-0.4, 0.4);
    anguille.flipX = anguille.dirX < 0;

    anguille.wait(k.rand(2, 5), () => {
      if (anguille.state === "walk") anguille.enterState("idle");
    });
  });

  anguille.onStateUpdate("walk", () => {
    anguille.move(PATROL_SPEED * anguille.dirX, PATROL_SPEED * anguille.dirY);

    if (anguille.pos.x < -7800 || anguille.pos.x > 7800) {
      anguille.dirX *= -1;
      anguille.flipX = anguille.dirX < 0;
    }

    // Reste strictement dans son habitat (Zone 1)
    anguille.pos.y = k.clamp(anguille.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  // ÉTAT : POURSUITE AGGRESSIVE (Déclenché uniquement si attaquée)
  anguille.onStateEnter("chase", () => {
    anguille.use(k.sprite("anguille-walk"));
    anguille.play("walk");
  });

  anguille.onStateUpdate("chase", () => {
    if (!anguille.exists()) return;
    if (!player || !player.pos) {
      anguille.enterState("idle");
      return;
    }

    // Si le joueur sort de la Zone 1 (remonte sur la barque ou descend en Zone 2), l'anguille ne peut pas le suivre
    const isPlayerInHabitat = player.pos.y >= 0 && player.pos.y <= 3000;
    if (!isPlayerInHabitat) {
      anguille.enterState("walk");
      return;
    }

    let dir = player.pos.sub(anguille.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    anguille.move(dir.scale(CHASE_SPEED));
    anguille.flipX = dir.x < 0;

    // Reste dans la Zone 1
    anguille.pos.y = k.clamp(anguille.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  // ÉTAT : DÉGÂTS ET MORT
  anguille.on("hurt", () => {
    if (anguille.state === "death" || !anguille.exists()) return;
    spawnDamageHitFX(k, anguille.pos);
    anguille.enterState("hurt");
  });

  anguille.onStateEnter("hurt", () => {
    anguille.use(k.sprite("anguille-hurt"));
    anguille.play("hurt");
    anguille.wait(0.25, () => {
      if (anguille.state !== "death" && anguille.exists()) {
        anguille.enterState("chase");
      }
    });
  });

  anguille.on("death", () => anguille.enterState("death"));
  anguille.onStateEnter("death", () => {
    anguille.untag("enemy");
    anguille.use(k.sprite("anguille-death"));
    anguille.play("death");
    anguille.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = anguille.pos ? k.vec2(anguille.pos.x, anguille.pos.y) : null;
      k.destroy(anguille);
      if (dropPos) spawnLootItem(k, dropPos, "anguille_meat");
    };

    anguille.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    anguille.wait(0.8, finishDeath);
  });

  anguille.enterState("idle");
  return anguille;
}

// ==========================================
// 2. LA MÉDUSE (Dérive lente toxique, peu de PV, piqûre urticante)
// ==========================================
/**
 * Fait apparaître une Méduse dérivante dans la Zone 1.
 * Entité flottante et urticante qui dérive verticalement et inflige des dégâts au contact.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de la méduse.
 */
export function spawnMeduse(k, startX, startY, player) {
  const DRIFT_SPEED = 28;
  const CHASE_SPEED = 85;

  const meduse = k.add([
    k.sprite("meduse-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    // Hitbox resserrée (14x18 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 14, 18) }),
    k.body({ isStatic: true }),
    k.health(20),
    k.state("drift", ["drift", "chase", "hurt", "death"]),
    k.timer(),
    "enemy",
    "meduse",
    { dirX: 0, dirY: 0, damage: 10 },
  ]);

  meduse.onStateEnter("drift", () => {
    meduse.use(k.sprite("meduse-idle"));
    meduse.play("idle");
    meduse.dirX = k.rand(-0.4, 0.4);
    meduse.dirY = k.rand(-0.6, 0.6);

    meduse.wait(k.rand(3, 6), () => {
      if (meduse.state === "drift") meduse.enterState("drift");
    });
  });

  meduse.onStateUpdate("drift", () => {
    meduse.move(DRIFT_SPEED * meduse.dirX, DRIFT_SPEED * meduse.dirY);
    meduse.pos.y += Math.sin(k.time() * 2) * 0.2;
    meduse.pos.y = k.clamp(meduse.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  // ÉTAT : POURSUITE AGGRESSIVE
  meduse.onStateEnter("chase", () => {
    meduse.use(k.sprite("meduse-walk"));
    meduse.play("walk");
  });

  meduse.onStateUpdate("chase", () => {
    if (!meduse.exists()) return;
    if (!player || !player.pos) {
      meduse.enterState("drift");
      return;
    }

    const isPlayerInHabitat = player.pos.y >= 0 && player.pos.y <= 3000;
    if (!isPlayerInHabitat) {
      meduse.enterState("drift");
      return;
    }

    let dir = player.pos.sub(meduse.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(0, 1);
    } else {
      dir = dir.unit();
    }
    meduse.move(dir.scale(CHASE_SPEED));
    meduse.pos.y = k.clamp(meduse.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  // ÉTAT : DÉGÂTS ET MORT
  meduse.on("hurt", () => {
    if (meduse.state === "death" || !meduse.exists()) return;
    spawnDamageHitFX(k, meduse.pos);
    meduse.enterState("hurt");
  });

  meduse.onStateEnter("hurt", () => {
    meduse.use(k.sprite("meduse-hurt"));
    meduse.play("hurt");
    meduse.wait(0.25, () => {
      if (meduse.state !== "death" && meduse.exists()) {
        meduse.enterState("chase");
      }
    });
  });

  meduse.on("death", () => meduse.enterState("death"));
  meduse.onStateEnter("death", () => {
    meduse.untag("enemy");
    meduse.use(k.sprite("meduse-death"));
    meduse.play("death");
    meduse.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = meduse.pos ? k.vec2(meduse.pos.x, meduse.pos.y) : null;
      k.destroy(meduse);
      if (dropPos) spawnLootItem(k, dropPos, "jelly_filament");
    };

    meduse.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    meduse.wait(0.8, finishDeath);
  });

  meduse.enterState("drift");
  return meduse;
}

// ==========================================
// 3. LA TORTUE (Super Tank Zone 1 : Beaucoup de PV, Lente, Dégâts modérés)
// ==========================================
/**
 * Fait apparaître une Tortue marine dans la Zone 1.
 * Entité défensive ultra-résistante (130 PV) dotée d'une carapace solide.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {import("kaplay").GameObj} player - Référence du joueur cible.
 * @returns {import("kaplay").GameObj} Entité de la tortue.
 */
export function spawnTortue(k, startX, startY, player) {
  const PATROL_SPEED = 35;
  const CHASE_SPEED = 110;

  const tortue = k.add([
    k.sprite("tortue-walk"),
    k.pos(startX, startY),
    k.scale(2.5),
    k.anchor("center"),
    // Hitbox resserrée sur la carapace (24x12 px réels)
    k.area({ shape: new k.Rect(k.vec2(0, 0), 24, 12) }),
    k.body({ isStatic: true }),
    k.health(130), // Véritable tank à haute résistance
    k.state("walk", ["walk", "chase", "hurt", "death"]),
    k.timer(),
    "enemy",
    "tortue",
    { dirX: 1, damage: 12 }, // Dégâts adoucis pour équilibrer ses PV élevés
  ]);

  tortue.onStateEnter("walk", () => {
    tortue.use(k.sprite("tortue-walk"));
    tortue.play("walk");
    tortue.dirX = k.chance(0.5) ? 1 : -1;
    tortue.flipX = tortue.dirX < 0;
  });

  tortue.onStateUpdate("walk", () => {
    tortue.move(PATROL_SPEED * tortue.dirX, 0);
    if (tortue.pos.x < -7800 || tortue.pos.x > 7800) {
      tortue.dirX *= -1;
      tortue.flipX = tortue.dirX < 0;
    }
    tortue.pos.y = k.clamp(tortue.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  // ÉTAT : CHARGE / POURSUITE LORSQU'ATTAQUÉE
  tortue.onStateEnter("chase", () => {
    tortue.use(k.sprite("tortue-walk"));
    tortue.play("walk");
  });

  tortue.onStateUpdate("chase", () => {
    if (!tortue.exists()) return;
    if (!player || !player.pos) {
      tortue.enterState("walk");
      return;
    }

    const isPlayerInHabitat = player.pos.y >= 0 && player.pos.y <= 3000;
    if (!isPlayerInHabitat) {
      tortue.enterState("walk");
      return;
    }

    let dir = player.pos.sub(tortue.pos);
    if (dir.len() < 0.001) {
      dir = k.vec2(1, 0);
    } else {
      dir = dir.unit();
    }
    tortue.move(dir.scale(CHASE_SPEED));
    tortue.flipX = dir.x < 0;
    tortue.pos.y = k.clamp(tortue.pos.y, ZONE1_MIN_Y, ZONE1_MAX_Y);
  });

  tortue.on("hurt", () => {
    if (tortue.state === "death" || !tortue.exists()) return;
    spawnDamageHitFX(k, tortue.pos);
    tortue.enterState("hurt");
  });

  tortue.onStateEnter("hurt", () => {
    tortue.use(k.sprite("tortue-hurt"));
    tortue.play("hurt");
    tortue.wait(0.25, () => {
      if (tortue.state !== "death" && tortue.exists()) {
        tortue.enterState("chase");
      }
    });
  });

  tortue.on("death", () => tortue.enterState("death"));
  tortue.onStateEnter("death", () => {
    tortue.untag("enemy");
    tortue.use(k.sprite("tortue-death"));
    tortue.play("death");
    tortue.unuse("area");

    let destroyed = false;
    const finishDeath = () => {
      if (destroyed) return;
      destroyed = true;
      const dropPos = tortue.pos ? k.vec2(tortue.pos.x, tortue.pos.y) : null;
      k.destroy(tortue);
      if (dropPos) spawnLootItem(k, dropPos, "turtle_shell");
    };

    tortue.onAnimEnd((anim) => {
      if (anim === "death") finishDeath();
    });
    tortue.wait(1.0, finishDeath);
  });

  tortue.enterState("walk");
  return tortue;
}
