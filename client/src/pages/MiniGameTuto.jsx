import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import kaplay from "kaplay";

function MiniGameTuto() {
  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = "EvilJV | Tutoriel";

    const k = kaplay({
      canvas: canvasRef.current,
      width: 800,
      height: 600,
      // On retire letterbox: true pour éviter que Kaplay déforme le terrain à cause des murs hors-champ
      background: [15, 23, 42],
      global: false,
    });

    k.scene("main", () => {
      k.setGravity(1600);

      // Le joueur
      const player = k.add([
        k.rect(40, 40),
        k.color(220, 38, 38),
        k.pos(k.width() / 2, k.height() / 2),
        k.area(),
        k.body(),
      ]);

      // Sol (touche désormais parfaitement les bords)
      k.add([
        k.rect(k.width(), 48),
        k.color(22, 163, 74),
        k.pos(0, k.height() - 48),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      // Mur invisible gauche (affiné à 10px pour limiter l'impact)
      k.add([
        k.rect(10, k.height()),
        k.pos(-10, 0),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      // Mur invisible droit
      k.add([
        k.rect(10, k.height()),
        k.pos(k.width(), 0),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      // Plafond invisible
      k.add([
        k.rect(k.width(), 10),
        k.pos(0, -10),
        k.area(),
        k.body({ isStatic: true }),
      ]);

      k.onKeyPress("space", () => {
        if (player.isGrounded()) {
          player.jump(700);
        }
      });

      k.onKeyDown("left", () => player.move(-300, 0));
      k.onKeyDown("right", () => player.move(300, 0));
    });

    k.go("main");

    return () => {
      k.quit();
    };
  }, []);

  return (
    // Remplacement de w-screen/h-screen par w-full pour respecter le Layout parent
    <main className="w-full flex flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-1">
          Tutoriel : Contrôles de base
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Flèches Gauche/Droite pour bouger - Espace pour sauter
        </p>
      </div>

      {/* C'est Tailwind qui se charge du responsive et du centrage exact */}
      <div className="w-full max-w-[800px] mb-8">
        <canvas
          ref={canvasRef}
          className="w-full h-auto aspect-[4/3] border-4 border-gray-700 rounded shadow-2xl shadow-red-900/20 block"
        ></canvas>
      </div>

      <Link
        to="/evil"
        className="px-6 py-2 border border-red-700 text-red-500 hover:bg-red-950 transition-colors rounded font-bold"
      >
        Quitter le jeu
      </Link>
    </main>
  );
}

export default MiniGameTuto;
