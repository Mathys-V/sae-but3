// client/src/game/casino/logic.js
export const SYMBOLS = ["7️⃣", "🔔", "🍉", "🍒", "☕"];
export const BET_AMOUNT = 5;

const WEIGHTED_SYMBOLS = [
  "7️⃣", 
  "🔔", "🔔", 
  "🍉", "🍉", "🍉", 
  "🍒", "🍒", "🍒", "🍒", 
  "☕", "☕", "☕", "☕", "☕"
];

export function tirerRouleaux() {
  return [
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
  ];
}

export function calculerGains(resultat) {
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