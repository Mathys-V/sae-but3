export function setupUI(k, player) {
  const MAX_DEPTH = 6000; // Doit correspondre à la profondeur de ta map

  // 1. Fond noir semi-transparent de la jauge (Fixe à gauche)
  k.add([
    k.rect(15, 300),
    k.pos(20, 50),
    k.color(0, 0, 0),
    k.opacity(0.5),
    k.fixed(),
  ]);

  // 2. Le curseur rouge de profondeur
  const cursor = k.add([
    k.rect(25, 8),
    k.pos(15, 50),
    k.color(220, 38, 38),
    k.fixed(),
  ]);

  // 3. Texte informatif de la profondeur
  const depthText = k.add([
    k.text("0m", { size: 16 }),
    k.pos(45, 50),
    k.fixed(),
  ]);

  k.onUpdate(() => {
    // Calcul de la position du joueur par rapport au fond (0 à 1)
    const depthRatio = Math.max(0, Math.min(player.pos.y / MAX_DEPTH, 1));

    // Le curseur descend le long des 300px de la jauge
    const currentY = 50 + depthRatio * 292;
    cursor.pos.y = currentY;

    // Mise à jour du texte (1 unité Kaplay = environ 10cm pour l'échelle visuelle)
    depthText.pos.y = currentY - 4;
    depthText.text = `${Math.floor(player.pos.y / 10)}m`;
  });
}
