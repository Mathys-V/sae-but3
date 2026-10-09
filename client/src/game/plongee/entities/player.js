import { stats } from "./stats.js";

export function setupPlayer(k, startX, startY) {
  const WATER_LEVEL = 0;

  const player = k.add([
    k.sprite("diver-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 12, 12) }),
    k.body(),
    k.anchor("center"),
    "player",
  ]);

  player.play("idle");

  let isSwimming = false;

  // GESTION DE LA PHYSIQUE ET DE LA SURVIE
  k.onUpdate(() => {
    const dt = k.dt();

    if (player.pos.y > WATER_LEVEL) {
      // 1. SOUS L'EAU
      player.gravityScale = 0;
      if (player.vel) {
        player.vel.x *= 0.9;
        player.vel.y *= 0.9;
      }

      // Consommation d'O2 (1 point par seconde)
      stats.o2 = Math.max(0, stats.o2 - dt);

      // Si on a encore de l'air, la vie remonte TRES lentement (+0.5 HP/sec)
      if (stats.o2 > 0) {
        stats.hp = Math.min(stats.maxHp, stats.hp + dt * 0.5);
      } else {
        // Noyade : perd 10 HP/sec
        stats.hp -= 10 * dt;
      }
    } else {
      // 2. SUR LA BARQUE / SURFACE
      player.gravityScale = 1;

      // Recharge très rapide de l'oxygène (+20/sec)
      stats.o2 = Math.min(stats.maxO2, stats.o2 + dt * 20);

      // Recharge rapide de la vie (+5 HP/sec)
      stats.hp = Math.min(stats.maxHp, stats.hp + dt * 5);
    }

    // 3. GESTION DE LA MORT
    if (stats.hp <= 0) {
      stats.inventory = [];
      stats.hp = stats.maxHp;
      stats.o2 = stats.maxO2;
      k.go("dive");
    }
  });

  const handleMovement = (x, y) => {
    if (player.pos.y > WATER_LEVEL) {
      player.move(x, y);
    } else if (x !== 0) {
      player.move(x, 0);
    }

    if (x < 0) player.flipX = true;
    if (x > 0) player.flipX = false;

    if (!isSwimming) {
      player.use(k.sprite("diver-swim"));
      player.play("swim");
      isSwimming = true;
    }
  };

  // On utilise stats.speed pour que la boutique puisse l'améliorer plus tard
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
      if (
        !k.isKeyDown("left") &&
        !k.isKeyDown("right") &&
        !k.isKeyDown("up") &&
        !k.isKeyDown("down") &&
        !k.isKeyDown("q") &&
        !k.isKeyDown("d") &&
        !k.isKeyDown("z") &&
        !k.isKeyDown("s") &&
        !k.isKeyDown("a") &&
        !k.isKeyDown("w")
      ) {
        player.use(k.sprite("diver-idle"));
        player.play("idle");
        isSwimming = false;
      }
    },
  );

  return player;
}
