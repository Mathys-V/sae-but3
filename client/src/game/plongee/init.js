import kaplay from "kaplay";
import { setupPlayer } from "./player.js";
import { setupOceanBoundaries } from "./map.js";
import { setupUI } from "./ui.js";
import { setupMultiplayer } from "./multiplayer.js";

export function initDivingGame(canvasElement) {
  const k = kaplay({
    canvas: canvasElement,
    width: 1024,
    height: 768,
    background: [15, 94, 156],
    global: false,
  });

  k.loadBean("diver-temp");

  k.scene("dive", () => {
    setupOceanBoundaries(k);

    // Ajout de bulles décoratives pour voir qu'on avance horizontalement
    for (let i = 0; i < 50; i++) {
      k.add([
        k.circle(4),
        k.pos(k.rand(-2000, 2000), k.rand(0, 5000)),
        k.color(255, 255, 255),
        k.opacity(0.3),
      ]);
    }

    const localPlayer = setupPlayer(k, k.width() / 2, 200);

    // Initialisation de l'UI (Jauge)
    setupUI(k, localPlayer);

    // Initialisation de la coquille multijoueur
    const network = setupMultiplayer(k, localPlayer);

    k.onUpdate(() => {
      k.camPos(localPlayer.pos);
      network.broadcastPosition(localPlayer.pos.x, localPlayer.pos.y);
    });
  });

  k.go("dive");

  return () => k.quit();
}
