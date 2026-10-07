// client/src/game/casino/init.js
import kaplay from "kaplay";
import { useEconomyStore } from "./economyStore";
import { SYMBOLS, BET_AMOUNT, tirerRouleaux, calculerGains } from "./logic";

export function initCasinoGame(canvasElement) {
  const k = kaplay({
    canvas: canvasElement,
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
        store.useFreeSpin();
      } else {
        store.deductBet(BET_AMOUNT);
      }

      uiResult.text = "🎰 Bonne chance... 🎰";
      uiResult.color = k.rgb(255, 255, 255);
      spinBtn.hidden = true;
      spinText.hidden = true;

      const resultat = tirerRouleaux();
      const gains = calculerGains(resultat);

      reels.forEach(r => r.isStopped = false);
      const spinAnim = k.loop(0.05, () => {
        if (!reels[0].isStopped) reels[0].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        if (!reels[1].isStopped) reels[1].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        if (!reels[2].isStopped) reels[2].text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      });

      k.wait(0.5, () => { reels[0].isStopped = true; reels[0].text = resultat[0]; });
      k.wait(1.0, () => { reels[1].isStopped = true; reels[1].text = resultat[1]; });
      k.wait(1.5, () => {
        reels[2].isStopped = true;
        reels[2].text = resultat[2];
        spinAnim.cancel();

        if (gains > 0) {
          store.addWinnings(gains);
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
  
  // On retourne l'instance pour pouvoir faire k.quit() dans React
  return k; 
}