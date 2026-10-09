// Fonction utilitaire de butin (inchangée)
function spawnLoot(k, pos, lootType) {
  k.add([
    k.sprite("barrel-empty"),
    k.pos(pos),
    k.scale(0.5),
    k.area(),
    "loot",
    { type: lootType },
  ]);
}

// ==========================================
// 1. L'ANGUILLE (Nage aléatoire et pauses)
// ==========================================
export function spawnAnguille(k, startX, startY) {
  const speed = 100;

  const anguille = k.add([
    k.sprite("anguille-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    k.area(),
    k.body({ isStatic: true }),
    k.health(30),
    k.state("idle", ["idle", "walk", "hurt", "death"]),
    k.timer(),
    "enemy",
    "anguille",
    { dirX: 1, dirY: 0, damage: 15 },
  ]);

  // ÉTAT : PAUSE (Attend sur place)
  anguille.onStateEnter("idle", () => {
    anguille.use(k.sprite("anguille-idle"));
    anguille.play("idle");
    // Reprend sa route après 1 à 3 secondes
    anguille.wait(k.rand(1, 3), () => anguille.enterState("walk"));
  });

  // ÉTAT : NAGE (Vecteur aléatoire)
  anguille.onStateEnter("walk", () => {
    anguille.use(k.sprite("anguille-walk"));
    anguille.play("walk");

    // Génère une direction aléatoire (ex: va à gauche et légèrement en haut)
    anguille.dirX = k.rand(-1, 1);
    anguille.dirY = k.rand(-0.5, 0.5);
    anguille.flipX = anguille.dirX < 0;

    // Nage pendant 2 à 5 secondes avant de faire une pause
    anguille.wait(k.rand(2, 5), () => anguille.enterState("idle"));
  });

  anguille.onStateUpdate("walk", () => {
    anguille.move(speed * anguille.dirX, speed * anguille.dirY);

    // 👈 NOUVELLES LIMITES LARGES
    if (anguille.pos.x < -7800 || anguille.pos.x > 7800) {
      anguille.dirX *= -1;
      anguille.flipX = anguille.dirX < 0;
    }
  });

  // ÉTAT : DÉGÂTS ET MORT
  anguille.on("hurt", () => anguille.enterState("hurt"));
  anguille.onStateEnter("hurt", () => {
    anguille.use(k.sprite("anguille-hurt"));
    anguille.play("hurt");
    anguille.wait(0.3, () => anguille.enterState("walk"));
  });

  anguille.on("death", () => anguille.enterState("death"));
  anguille.onStateEnter("death", () => {
    anguille.use(k.sprite("anguille-death"));
    anguille.play("death");
    anguille.unuse("area");
    anguille.onAnimEnd("death", () => {
      spawnLoot(k, anguille.pos, "meat");
      k.destroy(anguille);
    });
  });

  anguille.enterState("idle");
  return anguille;
}

// ==========================================
// 2. LA MÉDUSE (Dérive lente)
// ==========================================
export function spawnMeduse(k, startX, startY) {
  const speed = 30; // Très lent

  const meduse = k.add([
    k.sprite("meduse-idle"),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 16, 16) }),
    k.body({ isStatic: true }),
    k.health(20),
    k.state("drift", ["drift", "hurt", "death"]),
    k.timer(),
    "enemy",
    "meduse",
    { dirX: 0, dirY: 0, damage: 10 },
  ]);

  meduse.onStateEnter("drift", () => {
    meduse.use(k.sprite("meduse-idle"));
    meduse.play("idle");
    // La méduse se laisse porter par le courant aléatoirement
    meduse.dirX = k.rand(-0.4, 0.4);
    meduse.dirY = k.rand(-0.8, 0.8);

    // Change de trajectoire toutes les 3 à 6 secondes
    meduse.wait(k.rand(3, 6), () => meduse.enterState("drift"));
  });

  meduse.onStateUpdate("drift", () => {
    meduse.move(speed * meduse.dirX, speed * meduse.dirY);
    // Petit effet de flottement vertical naturel
    meduse.pos.y += Math.sin(k.time() * 2) * 0.2;
  });

  // ÉTAT : DÉGÂTS ET MORT
  meduse.on("hurt", () => meduse.enterState("hurt"));
  meduse.onStateEnter("hurt", () => {
    meduse.use(k.sprite("meduse-hurt"));
    meduse.play("hurt");
    meduse.wait(0.3, () => meduse.enterState("drift"));
  });

  meduse.on("death", () => meduse.enterState("death"));
  meduse.onStateEnter("death", () => {
    meduse.use(k.sprite("meduse-death"));
    meduse.play("death");
    meduse.unuse("area");
    meduse.onAnimEnd("death", () => {
      spawnLoot(k, meduse.pos, "jelly");
      k.destroy(meduse);
    });
  });

  meduse.enterState("drift");
  return meduse;
}
// ==========================================
// 3. LA TORTUE (Lente, très résistante)
// ==========================================
export function spawnTortue(k, startX, startY) {
  const speed = 40; // Très lent

  const tortue = k.add([
    k.sprite("tortue-walk"),
    k.pos(startX, startY),
    k.scale(2.5), // Un peu plus grosse
    k.anchor("center"),
    k.area(),
    k.body({ isStatic: true }),
    k.health(100), // 👈 Tanky !
    k.state("walk", ["walk", "hurt", "death"]),
    k.timer(),
    "enemy",
    "tortue",
    { dirX: 1, damage: 20 },
  ]);

  tortue.onStateEnter("walk", () => {
    tortue.use(k.sprite("tortue-walk"));
    tortue.play("walk");
    tortue.dirX = k.chance(0.5) ? 1 : -1;
    tortue.flipX = tortue.dirX < 0;
  });

  tortue.onStateUpdate("walk", () => {
    tortue.move(speed * tortue.dirX, 0);
    // 👈 NOUVELLES LIMITES LARGES
    if (tortue.pos.x < -7800 || tortue.pos.x > 7800) {
      tortue.dirX *= -1;
      tortue.flipX = tortue.dirX < 0;
    }
  });

  tortue.on("hurt", () => tortue.enterState("hurt"));
  tortue.onStateEnter("hurt", () => {
    tortue.use(k.sprite("tortue-hurt"));
    tortue.play("hurt");
    k.wait(0.3, () => tortue.enterState("walk"));
  });

  tortue.on("death", () => tortue.enterState("death"));
  tortue.onStateEnter("death", () => {
    tortue.use(k.sprite("tortue-death"));
    tortue.play("death");
    tortue.unuse("area");
    tortue.onAnimEnd("death", () => {
      spawnLoot(k, tortue.pos, "meat");
      k.destroy(tortue);
    });
  });

  tortue.enterState("walk");
  return tortue;
}
