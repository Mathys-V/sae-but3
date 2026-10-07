// client/src/pages/CasinoGame.jsx
import { useEffect, useRef } from "react";
import { useEconomyStore } from "../game/casino/economyStore";
import Leaderboard from "../components/Leaderboard.jsx";
import { initCasinoGame } from "../game/casino/init";

export default function CasinoGame() {
  const canvasRef = useRef(null);
  const { coins, paidSpins, freeSpins, resetEconomy } = useEconomyStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    // On lance le jeu et on récupère l'instance Kaplay
    const k = initCasinoGame(canvasRef.current);
    // Nettoyage quand on quitte la page
    return () => k.quit();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* COLONNE GAUCHE : TABLEAU DES GAINS */}
        <div className="w-full md:w-1/3 bg-gray-900 border-2 border-gray-700 rounded-xl p-6 shadow-lg h-fit">
          <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-gray-700 pb-4">
            🏆 Tableau des gains
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-400 font-bold mb-3 uppercase text-sm">Aligner 3 symboles</h3>
              <ul className="space-y-2 text-lg font-medium">
                <li className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="tracking-[0.5em]">7️⃣7️⃣7️⃣</span> <span className="text-yellow-400 font-bold">100 🪙</span>
                </li>
                <li className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="tracking-[0.5em]">🔔🔔🔔</span> <span className="text-yellow-400 font-bold">50 🪙</span>
                </li>
                <li className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="tracking-[0.5em]">🍉🍉🍉</span> <span className="text-yellow-400 font-bold">25 🪙</span>
                </li>
                <li className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="tracking-[0.5em]">🍒🍒🍒</span> <span className="text-yellow-400 font-bold">15 🪙</span>
                </li>
                <li className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span className="tracking-[0.5em]">☕☕☕</span> <span className="text-yellow-400 font-bold">10 🪙</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-bold mb-3 uppercase text-sm">Obtenir 2 symboles</h3>
              <ul className="space-y-2 text-md font-medium text-gray-300">
                <li className="flex justify-between items-center border-b border-gray-800 pb-1">
                  <span>Deux 7️⃣</span> <span className="text-yellow-500">20 🪙</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-1">
                  <span>Deux 🔔</span> <span className="text-yellow-500">10 🪙</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-1">
                  <span>Deux 🍉</span> <span className="text-yellow-500">5 🪙</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-1">
                  <span>Deux 🍒 ou ☕</span> <span className="text-yellow-500">4 🪙</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LE JEU */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex gap-4 flex-wrap">
              <div className="text-lg text-white font-bold bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                Banque: {coins} 🪙
              </div>
              <div className="text-lg text-white font-bold bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                Lancers gratuits: {freeSpins} 🎁
              </div>
              <div className="text-lg text-white font-bold bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-red-400">
                Score: {paidSpins} 🔥
              </div>
            </div>
            
            <button 
              onClick={() => {
                alert(`Partie terminée ! Ton score de ${paidSpins} sera envoyé au Leaderboard.`);
                resetEconomy();
              }}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
            >
              Encaisser & Quitter
            </button>
          </div>
          
          <div className="w-full aspect-[4/3] rounded-xl shadow-2xl border-4 border-gray-700 overflow-hidden bg-[#191923]">
            <canvas ref={canvasRef} className="w-full h-full block"></canvas>
          </div>
        </div>
      </div>

      <div className="w-full mt-12">
        <h2 className="text-3xl font-bold text-center text-white mb-6">🔥 TOP 5 DES MEILLEURS JOUEURS 🔥</h2>
        <div className="max-w-3xl mx-auto">
          <Leaderboard gameId="casino" />
        </div>
      </div>
    </div>
  );
}