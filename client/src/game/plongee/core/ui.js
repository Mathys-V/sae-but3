import { stats } from "../entities/stats.js";

export function setupUI(k, player) {
  const MAX_DEPTH = 6000;

  // --- 1. JAUGE DE PROFONDEUR ---
  k.add([
    k.rect(15, 300),
    k.pos(20, 50),
    k.color(0, 0, 0),
    k.opacity(0.5),
    k.fixed(),
    k.z(100), // 👈 PREMIER PLAN
  ]);

  const cursor = k.add([
    k.sprite("depth-cursor"),
    // On le place juste à gauche de la jauge noire (qui est à X=20)
    k.pos(15, 50),
    k.anchor("right"), // 👈 Le point de pivot est à la pointe droite de la flèche
    k.scale(1.5), // À ajuster selon si tu la trouves trop petite ou trop grande
    k.fixed(),
    k.z(101),
  ]);

  const depthText = k.add([
    k.text("0m", { size: 16 }),
    k.pos(45, 50),
    k.fixed(),
    k.z(100),
  ]);

  // --- 2. BARRES DE SURVIE (Sprites) ---
  k.add([k.text("O2", { size: 16 }), k.pos(80, 20), k.fixed(), k.z(100)]);
  const o2Bar = k.add([
    k.sprite("o2-bar", { frame: 16 }),
    k.pos(115, 15),
    k.scale(2.5),
    k.fixed(),
    k.z(100), // 👈 PREMIER PLAN
  ]);

  k.add([k.text("HP", { size: 16 }), k.pos(80, 50), k.fixed(), k.z(100)]);
  const hpBar = k.add([
    k.sprite("hp-bar", { frame: 16 }),
    k.pos(115, 45),
    k.scale(2.5),
    k.fixed(),
    k.z(100), // 👈 PREMIER PLAN
  ]);

  // --- 3. MISE À JOUR DYNAMIQUE ---
  k.onUpdate(() => {
    const depthRatio = Math.max(0, Math.min(player.pos.y / MAX_DEPTH, 1));
    const currentY = 50 + depthRatio * 292;
    cursor.pos.y = currentY;
    depthText.pos.y = currentY - 4;

    // 👈 Divisé par 20 ! 6000 pixels = 300 mètres de profondeur max.
    depthText.text = `${Math.floor(player.pos.y / 20)}m`;

    const o2Frame = Math.round((stats.o2 / stats.maxO2) * 16);
    const hpFrame = Math.round((stats.hp / stats.maxHp) * 16);

    o2Bar.frame = Math.max(0, Math.min(16, o2Frame));
    hpBar.frame = Math.max(0, Math.min(16, hpFrame));
  });
}
