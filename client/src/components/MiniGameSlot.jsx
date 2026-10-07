import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import { useEconomyStore } from "../store/economyStore";
import Leaderboard from "./Leaderboard.jsx";

// --- LOGIQUE MÉTIER ---
const SYMBOLS = ["7️⃣", "🔔", "🍉", "🍒", "☕"];

// NOUVEAU : Probabilités biaisées du casino !
// Total de 15 "billets" dans l'urne. 
// Le 7️⃣ a 1 chance sur 15 de tomber. Le ☕ a 5 chances sur 15.
const WEIGHTED_SYMBOLS = [
  "7️⃣", 
  "🔔", "🔔", 
  "🍉", "🍉", "🍉", 
  "🍒", "🍒", "🍒", "🍒", 
  "☕", "☕", "☕", "☕", "☕"
];

const BET_AMOUNT = 5;

function tirerRouleaux() {
  // On pioche maintenant dans l'urne truquée
  return [
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
  ];
}

function calculerGains(resultat) {
  const counts = {};
  resultat.forEach(sym => {
    counts[sym] = (counts[sym] || 0) + 1;
  });

  if (counts["7️⃣"] === 3) return 100;
  if (counts["🔔"] === 3) return 50;
  if (counts["🍉"] === 3) return 25;
  if (counts["🍒"] === 3) return 15;
  if (counts["☕"] === 3) return 10;

  if (counts["7️⃣"] === 2) return 20;
  if (counts["🔔"] === 2) return 10;
  if (counts["🍉"] === 2) return 5;
  if (counts["🍒"] === 2) return 4;
  if (counts["☕"] === 2) return 4;

  return 0;
}

// --- COMPOSANT REACT & KAPLAY ---
export default function MiniGameSlot() {
  const canvasRef = useRef(null);
  
  // On importe resetEconomy depuis notre store
  const { coins, paidSpins, freeSpins, resetEconomy } = useEconomyStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const k = kaplay({
      canvas: canvasRef.current,
      width: 800,
      height: 600,
      background: [25, 25, 35],
      letterbox: true,
    });

    k.scene("main", () => {
      const uiResult = k.add([
        k.text("TENTE TA CHANCE !", { size: 54 }),
        k.pos(k.width() / 2, 120),
        k.anchor("center"),
      ]);

      const reels = [];
      const espacement = 180;

      for (let i = 0; i < 3; i++) {
        const bg = k.add([
          k.rect(140, 180, { radius: 12 }),
          k.pos(k.width() / 2 - espacement + (i * espacement), k.height() / 2 + 30),
          k.anchor("center"),
          k.color(15, 15, 20),
          k.outline(6, k.rgb(80, 80, 90)),
        ]);
        
        const symbolText = k.add([
          k.text("❓", { size: 80 }),
          k.pos(bg.pos),
          k.anchor("center"),
        ]);
        
        symbolText.isStopped = true;
        reels.push(symbolText);
      }

      const spinBtn = k.add([
        k.rect(260, 80, { radius: 15 }),
        k.pos(k.width() / 2, k.height() - 80),
        k.anchor("center"),
        k.color(40, 160, 60),
        k.area(),
      ]);

      const spinText = k.add([
        k.text("JOUER (5🪙)", { size: 36 }),
        k.pos(spinBtn.pos),
        k.anchor("center"),
        k.color(255, 255, 255),
      ]);

      spinBtn.onHoverUpdate(() => {
        spinBtn.color = k.rgb(50, 200, 70);
        k.setCursor("pointer");
      });
      spinBtn.onHoverEnd(() => {
        spinBtn.color = k.rgb(40, 160, 60);
        k.setCursor("default");
      });

      spinBtn.onClick(() => {
        const store = useEconomyStore.getState();
        
        if (store.freeSpins === 0 && store.coins < BET_AMOUNT) {
          uiResult.text = "FAILLITE !";
          uiResult.color = k.rgb(255, 50, 50);
          return;
        }

        if (store.freeSpins > 0) {
          useEconomyStore.getState().useFreeSpin();
        } else {
          useEconomyStore.getState().deductBet(BET_AMOUNT);
        }

        uiResult.text = "🎰 Bonne chance... 🎰";
        uiResult.color = k.rgb(255, 255, 255);
        spinBtn.hidden = true;
        spinText.hidden = true;

        const resultat = tirerRouleaux();
        const gains = calculerGains(resultat);

        reels.forEach(r => r.isStopped = false);
        const spinAnim = k.loop(0.05, () => {
          // Pour l'animation purement visuelle, on garde les symboles classiques
          if (!reels[0].isStopped) reels[0].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          if (!reels[1].isStopped) reels[1].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          if (!reels[2].isStopped) reels[2].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        });

        k.wait(0.5, () => {
          reels[0].isStopped = true;
          reels[0].text = resultat[0];
        });

        k.wait(1.0, () => {
          reels[1].isStopped = true;
          reels[1].text = resultat[1];
        });

        k.wait(1.5, () => {
          reels[2].isStopped = true;
          reels[2].text = resultat[2];
          spinAnim.cancel();

          if (gains > 0) {
            useEconomyStore.getState().addWinnings(gains);
            uiResult.text = `GAGNÉ : +${gains} COINS !`;
            uiResult.color = k.rgb(50, 255, 50);
          } else {
            uiResult.text = "PERDU...";
            uiResult.color = k.rgb(200, 200, 200);
          }
          
          spinBtn.hidden = false;
          spinText.hidden = false;
        });
      });
    });

    k.go("main");

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
                // On affiche le score final
                alert(`Partie terminée ! Ton score de ${paidSpins} sera envoyé au Leaderboard.`);
                // On remet la "base de données locale" à 0 !
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

      {/* --- LEADERBOARD --- */}
      <div className="w-full mt-12">
        <h2 className="text-3xl font-bold text-center text-white mb-6">🔥 TOP 5 DES MEILLEURS JOUEURS 🔥</h2>
        <div className="max-w-3xl mx-auto">
          <Leaderboard gameId="casino" />
        </div>
      </div>
    </div>
  );
}