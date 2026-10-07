import { useEffect, useRef, useState } from "react";
import { initDivingGame } from "../game/plongee/core/init.js";

function DivingGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const quitGame = initDivingGame(canvasRef.current);
    return () => quitGame();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Erreur plein écran : ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const centerGame = () => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      // On passe en flex-col pour empiler les boutons au-dessus du jeu
      className={`w-full flex flex-col items-center bg-slate-950 overflow-hidden ${
        isFullscreen
          ? "h-screen justify-center relative"
          : "h-[calc(100vh-4rem)] pt-4"
      }`}
    >
      {/* Conteneur des boutons, placé HORS du cadre de l'image */}
      <div
        className={`flex gap-2 z-20 ${
          isFullscreen
            ? "absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity" // En plein écran, flotte discrètement
            : "w-full max-w-[1024px] justify-end mb-2 px-4" // Mode normal : aligné au-dessus du cadre à droite
        }`}
      >
        {/* Le bouton Centrer n'existe que si on N'EST PAS en plein écran */}
        {!isFullscreen && (
          <button
            onClick={centerGame}
            className="bg-cyan-900 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow-md border border-cyan-500/50"
          >
            Centrer 🎯
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="bg-cyan-900 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow-md border border-cyan-500/50"
        >
          {isFullscreen ? "Quitter" : "Plein écran ⛶"}
        </button>
      </div>

      {/* Conteneur du jeu */}
      <div className="flex-1 w-full min-h-0 flex justify-center items-center pb-4">
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-full w-auto h-auto object-contain block ${
            isFullscreen
              ? "" // Plus de bordure en plein écran, le jeu prend tout l'espace
              : "rounded-lg shadow-2xl border-4 border-cyan-900" // Bordure présente en mode normal
          }`}
        ></canvas>
      </div>
    </div>
  );
}

export default DivingGame;
