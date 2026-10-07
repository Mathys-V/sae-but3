export function setupPlayer(k, startX, startY) {
  const WATER_LEVEL = 0;

  const player = k.add([
    k.sprite("diver-idle"),
    k.pos(startX, startY),
    k.scale(2), // NOUVEAU : On double la taille du joueur pour mieux le voir
    k.area({ shape: new k.Rect(k.vec2(0, 0), 12, 12) }), // Hitbox carrée propre et réduite
    k.body(),
    k.anchor("center"),
    "player",
  ]);

  player.play("idle");

  const speed = 250;
  let isSwimming = false;

  // GESTION DE LA PHYSIQUE EAU vs AIR
  k.onUpdate(() => {
    if (player.pos.y > WATER_LEVEL) {
      // 1. SOUS L'EAU : On désactive la gravité
      player.gravityScale = 0;

      // On applique une friction naturelle pour qu'il "glisse" un peu dans l'eau quand on lâche les touches
      if (player.vel) {
        player.vel.x *= 0.9;
        player.vel.y *= 0.9;
      }
    } else {
      // 2. DANS LES AIRS : La gravité reprend le dessus (il retombe ou se pose sur le radeau)
      player.gravityScale = 1;
    }
  });

  const handleMovement = (x, y) => {
    // Si on est dans l'eau, on peut aller dans toutes les directions
    if (player.pos.y > WATER_LEVEL) {
      player.move(x, y);
    } else if (x !== 0) {
      // Si on est en l'air (ou sur le radeau), on ne peut bouger que de gauche à droite
      player.move(x, 0);
    }

    // Gestion du retournement visuel
    if (x < 0) player.flipX = true;
    if (x > 0) player.flipX = false;

    if (!isSwimming) {
      player.use(k.sprite("diver-swim"));
      player.play("swim");
      isSwimming = true;
    }
  };

  // Mouvements ZQSD / Flèches
  k.onKeyDown(["left", "q", "a"], () => handleMovement(-speed, 0));
  k.onKeyDown(["right", "d"], () => handleMovement(speed, 0));
  k.onKeyDown(["down", "s"], () => handleMovement(0, speed));

  // LE SAUT DE DAUPHIN (Touche Haut)
  k.onKeyDown(["up", "z", "w"], () => {
    handleMovement(0, -speed);

    // Si on nage très vite vers le haut et qu'on touche presque la surface... on SAUTE !
    if (player.pos.y > WATER_LEVEL && player.pos.y < WATER_LEVEL + 40) {
      player.jump(650); // Pousse le joueur hors de l'eau
    }
    // Permet aussi de sauter si on est debout sur le radeau
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
