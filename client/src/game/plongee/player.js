export function setupPlayer(k, startX, startY) {
  const player = k.add([
    k.sprite("diver-temp"),
    k.pos(startX, startY),
    k.area(),
    k.body(),
    k.anchor("center"),
    "player",
  ]);

  const speed = 400; // Vitesse augmentée pour bien voir le déplacement

  // Support complet des flèches et touches AZERTY/QWERTY
  k.onKeyDown(["left", "q", "a"], () => player.move(-speed, 0));
  k.onKeyDown(["right", "d"], () => player.move(speed, 0));
  k.onKeyDown(["up", "z", "w"], () => player.move(0, -speed));
  k.onKeyDown(["down", "s"], () => player.move(0, speed));

  return player;
}
