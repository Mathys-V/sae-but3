import { useEffect, useRef } from "react";
import { initDivingGame } from "../game/plongee/init.js";

function DivingGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const quitGame = initDivingGame(canvasRef.current);
    return () => quitGame();
  }, []);

  return (
    // Les classes CSS ici empêchent le canvas de sortir de l'écran et de casser le footer
    <div className="w-full flex-1 min-h-0 flex justify-center items-center overflow-hidden p-4">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-4 border-cyan-900 block"
      ></canvas>
    </div>
  );
}

export default DivingGame;
