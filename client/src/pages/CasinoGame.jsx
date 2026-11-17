import { useEffect, useRef, useState } from "react";
import { useEconomyStore } from "../game/casino/economyStore.js";
import {
  BET_AMOUNT,
  SYMBOLS,
  calculerGains,
  tirerRouleaux,
} from "../game/casino/logic.js";
import Leaderboard from "../components/Leaderboard.jsx";
import slotSheet from "../assets/slot.png";
import "./CasinoGame.css";

const SYMBOL_SPRITES = {
  seven: { x: 3, y: 3, label: "7" },
  bell: { x: 1, y: 64, label: "cloche" },
  cherries: { x: 1, y: 98, label: "cerises" },
  grapes: { x: 1, y: 130, label: "raisins" },
  watermelon: { x: 1, y: 195, label: "pastèque" },
};

const REEL_NEIGHBORS = {
  seven: ["watermelon", "grapes"],
  bell: ["grapes", "watermelon"],
  watermelon: ["bell", "seven"],
  cherries: ["watermelon", "bell"],
  grapes: ["cherries", "seven"],
};

const THREE_SYMBOL_PRIZES = [
  { symbol: "seven", prize: 100 },
  { symbol: "bell", prize: 50 },
  { symbol: "watermelon", prize: 25 },
  { symbol: "cherries", prize: 15 },
  { symbol: "grapes", prize: 10 },
];

const TWO_SYMBOL_PRIZES = [
  { symbol: "seven", prize: 20 },
  { symbol: "bell", prize: 10 },
  { symbol: "watermelon", prize: 5 },
  { symbol: "cherries", prize: 4 },
  { symbol: "grapes", prize: 4 },
];

function SlotSymbol({ symbol, spinning = false, small = false }) {
  const sprite = SYMBOL_SPRITES[symbol] ?? SYMBOL_SPRITES.seven;
  const spriteScale = small ? 0.8 : 1.5;
  return (
    <span
      className={`slot-symbol${spinning ? " is-spinning" : ""}${small ? " small" : ""}`}
      style={{
        "--slot-sheet": `url("${slotSheet}")`,
        backgroundPosition: `${-sprite.x * spriteScale + (small ? 2 : 4)}px ${-sprite.y * spriteScale + (small ? 1 : 2)}px`,
      }}
      role="img"
      aria-label={sprite.label}
    />
  );
}

function PrizeLine({ symbol, count, prize }) {
  return (
    <li className="flex items-center justify-between gap-2 rounded bg-gray-800 px-2 py-1.5">
      <span className="flex items-center gap-1.5 text-gray-200">
        {Array.from({ length: count }, (_, index) => (
          <SlotSymbol key={`${symbol}-${index}`} symbol={symbol} small />
        ))}
        <span className="text-sm">{count === 3 ? "× 3" : "× 2"}</span>
      </span>
      <span className="shrink-0 font-bold text-amber-300">{prize} coins</span>
    </li>
  );
}

export default function CasinoGame() {
  const { coins, paidSpins, freeSpins, resetEconomy } = useEconomyStore();
  const [reels, setReels] = useState(["watermelon", "seven", "seven"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState(
    "Choisis ton tour et tente le jackpot !",
  );
  const spinLock = useRef(false);
  const animationRef = useRef(null);
  const stopTimersRef = useRef([]);

  useEffect(() => {
    document.title = "EvilJV | Casino";
    return () => {
      window.clearInterval(animationRef.current);
      stopTimersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  function spin() {
    if (spinLock.current) return;

    const economy = useEconomyStore.getState();
    if (economy.freeSpins <= 0 && economy.coins < BET_AMOUNT) {
      setMessage(
        "Plus assez de coins. Reviens après avoir renfloué ta banque.",
      );
      return;
    }

    spinLock.current = true;
    setIsSpinning(true);
    setMessage("Les rouleaux tournent…");
    stopTimersRef.current = [];

    if (economy.freeSpins > 0) {
      economy.useFreeSpin();
    } else {
      economy.deductBet(BET_AMOUNT);
    }

    const result = tirerRouleaux();
    const stopped = [false, false, false];
    setReels(
      Array.from(
        { length: 3 },
        () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ),
    );
    animationRef.current = window.setInterval(() => {
      setReels((current) =>
        current.map((symbol, index) =>
          stopped[index]
            ? symbol
            : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ),
      );
    }, 90);

    [850, 1450, 2050].forEach((delay, index) => {
      const timer = window.setTimeout(() => {
        stopped[index] = true;
        setReels((current) =>
          current.map((symbol, reelIndex) =>
            reelIndex === index ? result[index] : symbol,
          ),
        );

        if (index === 2) {
          window.clearInterval(animationRef.current);
          const winnings = calculerGains(result);
          if (winnings > 0) {
            useEconomyStore.getState().addWinnings(winnings);
            setMessage(`Gagné ! +${winnings} coins`);
          } else {
            setMessage("Perdu… retente ta chance !");
          }
          setIsSpinning(false);
          spinLock.current = false;
        }
      }, delay);
      stopTimersRef.current.push(timer);
    });
  }

  function startNewGame() {
    if (spinLock.current) return;
    resetEconomy();
    setReels(["watermelon", "seven", "seven"]);
    setMessage("Nouvelle partie : 10 tours gratuits !");
  }

  const cannotAfford = freeSpins <= 0 && coins < BET_AMOUNT;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 text-white sm:p-6">
      <audio
        className="casino-intro-audio"
        src="/assets/casino/soundtracks/casino%20machine.mp3"
        autoPlay
        loop
        aria-label="Musique de la machine à sous"
      />
      <header className="rounded-xl border border-rose-900/70 bg-gradient-to-r from-gray-950 via-rose-950 to-gray-950 p-5 text-center shadow-xl">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
          EvilJV arcade
        </p>
        <h1 className="text-3xl font-black sm:text-4xl">Casino des probas</h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(360px,1.2fr)]">
        <section className="order-2 rounded-xl border-2 border-gray-700 bg-gray-900 p-4 shadow-xl lg:order-1 sm:p-6">
          <h2 className="mb-4 border-b border-gray-700 pb-3 text-center text-xl font-black text-amber-200 sm:text-2xl">
            Tableau des gains
          </h2>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Trois symboles identiques
          </h3>
          <ul className="mb-6 space-y-2">
            {THREE_SYMBOL_PRIZES.map(({ symbol, prize }) => (
              <PrizeLine
                key={`triple-${symbol}`}
                symbol={symbol}
                count={3}
                prize={prize}
              />
            ))}
          </ul>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Deux symboles identiques
          </h3>
          <ul className="space-y-2">
            {TWO_SYMBOL_PRIZES.map(({ symbol, prize }) => (
              <PrizeLine
                key={`double-${symbol}`}
                symbol={symbol}
                count={2}
                prize={prize}
              />
            ))}
          </ul>
          <p className="mt-5 border-t border-gray-800 pt-3 text-center text-xs text-gray-500">
            Chaque tour coûte {BET_AMOUNT} coins après les tours gratuits.
          </p>
        </section>

        <section className="order-1 flex flex-col items-center rounded-xl border border-gray-700 bg-gray-950 p-4 shadow-2xl lg:order-2 sm:p-6">
          <div className="mb-4 flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="rounded-lg border border-amber-700/70 bg-gray-900 px-3 py-2 text-sm font-bold sm:text-base">
              Banque <span className="text-amber-300">${coins}</span>
            </div>
            <div className="rounded-lg border border-emerald-800 bg-gray-900 px-3 py-2 text-sm font-bold sm:text-base">
              Gratuits <span className="text-emerald-300">{freeSpins}</span>
            </div>
            <div className="rounded-lg border border-rose-900 bg-gray-900 px-3 py-2 text-sm font-bold sm:text-base">
              Score <span className="text-rose-300">{paidSpins}</span>
            </div>
          </div>

          <div className="flex w-full justify-center overflow-hidden rounded-lg border border-gray-700 px-2 py-3 sm:py-5">
            <div className="slot-machine" aria-label="Machine à sous">
              <svg
                className="slot-machine-art"
                viewBox="60 26 136 216"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <image href={slotSheet} x="0" y="0" width="256" height="256" />
              </svg>
              <div className="slot-price-sign">{BET_AMOUNT} coins par tour</div>
              <div className="slot-bank-display" aria-live="polite">
                ${coins}
              </div>
              <div className="slot-reel-window" aria-label="Résultat du lancer">
                {reels.map((symbol, index) => (
                  <div className="slot-reel" key={index}>
                    <div className="slot-reel-cell">
                      <SlotSymbol
                        symbol={REEL_NEIGHBORS[symbol][0]}
                        spinning={isSpinning}
                      />
                    </div>
                    <div className="slot-reel-cell is-result">
                      <SlotSymbol symbol={symbol} spinning={isSpinning} />
                    </div>
                    <div className="slot-reel-cell">
                      <SlotSymbol
                        symbol={REEL_NEIGHBORS[symbol][1]}
                        spinning={isSpinning}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="slot-spin-button"
                onClick={spin}
                disabled={isSpinning || cannotAfford}
                aria-label={
                  isSpinning
                    ? "Les rouleaux tournent"
                    : `Lancer pour ${BET_AMOUNT} coins`
                }
              >
                {isSpinning ? "TOURNE…" : freeSpins > 0 ? "GRATUIT" : "LANCER"}
              </button>
            </div>
          </div>

          <p
            className="slot-result-message mt-3"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
          <button
            type="button"
            onClick={startNewGame}
            disabled={isSpinning}
            className="mt-2 rounded-lg border border-rose-800 bg-rose-950 px-4 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Nouvelle partie
          </button>
        </section>
      </div>
    </main>
  );
}
