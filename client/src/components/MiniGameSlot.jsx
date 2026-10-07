import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import { useEconomyStore } from "../store/economyStore";

// --- LOGIQUE MÉTIER (Isolée pour le futur mode multijoueur) ---
const SYMBOLS = ["7️⃣", "🔔", "🍉", "🍒", "☕"];
const BET_AMOUNT = 5;

// Fonction universelle de tirage
function tirerRouleaux() {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ];
}

// Algorithme de calcul des gains (Bénéfices x Mise)
function calculerGains(resultat) {
  // 3 symboles identiques
  if (resultat[0] === resultat[1] && resultat[1] === resultat[2]) {
    switch (resultat[0]) {
      case "7️⃣": return BET_AMOUNT * 20; // Jackpot: 100 coins
      case "🔔": return BET_AMOUNT * 10; // 50 coins
      case "🍉": return BET_AMOUNT * 5;  // 25 coins
      case "🍒": return BET_AMOUNT * 3;  // 15 coins
      case "☕": return BET_AMOUNT * 2;  // 10 coins
      default: return 0;
    }
  }
  // Récompense mineure pour 2 cerises alignées
  if ((resultat[0] === "🍒" && resultat[1] === "🍒") || 
      (resultat[1] === "🍒" && resultat[2] === "🍒")) {
    return BET_AMOUNT * 1; // Remboursement
  }
  
  return 0;
}

// --- COMPOSANT REACT & KAPLAY ---
export default function MiniGameSlot() {
  const canvasRef = useRef(null);
  
  // On récupère juste l'état initial pour l'UI React (hors canvas) si besoin
  const { coins, freeSpins } = useEconomyStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const k = kaplay({
      canvas: canvasRef.current,
      width: 800,
      height: 600,
      background: [30, 30, 40],
      letterbox: true,
    });

    k.scene("main", () => {
      // Affichage des stats (On lit directement getState() pour avoir la valeur en temps réel dans Kaplay)
      const uiCoins = k.add([
        k.text(`Coins: ${useEconomyStore.getState().coins}`, { size: 32 }),
        k.pos(20, 20),
        k.color(255, 215, 0),
      ]);

      const uiSpins = k.add([
        k.text(`Lancers gratuits: ${useEconomyStore.getState().freeSpins}`, { size: 24 }),
        k.pos(20, 60),
        k.color(150, 200, 255),
      ]);

      const uiResult = k.add([
        k.text("Tente ta chance !", { size: 48 }),
        k.pos(k.width() / 2, 120),
        k.anchor("center"),
      ]);

      // Les 3 rectangles des rouleaux
      const reels = [];
      for (let i = 0; i < 3; i++) {
        const bg = k.add([
          k.rect(120, 150, { radius: 8 }),
          k.pos(k.width() / 2 - 150 + (i * 150), k.height() / 2),
          k.anchor("center"),
          k.color(20, 20, 20),
          k.outline(4, k.rgb(100, 100, 100)),
        ]);
        
        const symbolText = k.add([
          k.text("❓", { size: 64 }),
          k.pos(bg.pos),
          k.anchor("center"),
        ]);
        
        reels.push(symbolText);
      }

      // Bouton SPIN
      const spinBtn = k.add([
        k.rect(200, 60, { radius: 10 }),
        k.pos(k.width() / 2, k.height() - 100),
        k.anchor("center"),
        k.color(50, 150, 50),
        k.area(),
      ]);

      k.add([
        k.text("JOUER", { size: 32 }),
        k.pos(spinBtn.pos),
        k.anchor("center"),
        k.color(255, 255, 255),
      ]);

      // Logique au clic sur Jouer
      spinBtn.onClick(() => {
        const store = useEconomyStore.getState();
        
        // Vérification de défaite / manque d'argent
        if (store.freeSpins === 0 && store.coins < BET_AMOUNT) {
          uiResult.text = "FAILLITE !";
          uiResult.color = k.rgb(255, 50, 50);
          return;
        }

        // Déduction de la mise
        if (store.freeSpins > 0) {
          useEconomyStore.getState().useFreeSpin();
        } else {
          useEconomyStore.getState().deductBet(BET_AMOUNT);
        }

        uiResult.text = "Tournoiement...";
        uiResult.color = k.rgb(255, 255, 255);

        // Tirage et calcul
        const resultat = tirerRouleaux();
        const gains = calculerGains(resultat);

        // Effet visuel temporaire (simulation d'animation)
        k.wait(0.5, () => {
          reels[0].text = resultat[0];
          reels[1].text = resultat[1];
          reels[2].text = resultat[2];

          if (gains > 0) {
            useEconomyStore.getState().addWinnings(gains);
            uiResult.text = `GAGNÉ : +${gains} COINS !`;
            uiResult.color = k.rgb(50, 255, 50);
          } else {
            uiResult.text = "PERDU...";
            uiResult.color = k.rgb(200, 200, 200);
          }

          // Mise à jour de l'UI
          uiCoins.text = `Coins: ${useEconomyStore.getState().coins}`;
          uiSpins.text = `Lancers gratuits: ${useEconomyStore.getState().freeSpins}`;
        });
      });
    });

    k.go("main");

    return () => {
      k.quit();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* HUD React par-dessus le jeu pour le bouton encaisser */}
      <div className="w-full max-w-4xl flex justify-between mb-4">
        <div className="text-white font-bold">Joueur: {coins} 🪙</div>
        <button 
          onClick={() => alert(`Score final encaissé : ${coins} ! (À lier au Leaderboard)`)}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold"
        >
          Encaisser & Quitter
        </button>
      </div>
      <canvas ref={canvasRef} className="rounded-lg shadow-2xl border-4 border-gray-700"></canvas>
    </div>
  );
}