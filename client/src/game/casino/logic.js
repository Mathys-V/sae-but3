export const SYMBOLS = ["seven", "bell", "watermelon", "cherries", "grapes"];
export const BET_AMOUNT = 5;

const WEIGHTED_SYMBOLS = [
  "seven",
  "bell", "bell",
  "watermelon", "watermelon", "watermelon",
  "cherries", "cherries", "cherries", "cherries",
  "grapes", "grapes", "grapes", "grapes", "grapes",
];

export function tirerRouleaux() {
  return Array.from({ length: 3 }, () =>
    WEIGHTED_SYMBOLS[Math.floor(Math.random() * WEIGHTED_SYMBOLS.length)],
  );
}

export function calculerGains(resultat) {
  const counts = {};
  resultat.forEach((symbol) => {
    counts[symbol] = (counts[symbol] || 0) + 1;
  });

  if (counts.seven === 3) return 100;
  if (counts.bell === 3) return 50;
  if (counts.watermelon === 3) return 25;
  if (counts.cherries === 3) return 15;
  if (counts.grapes === 3) return 10;

  if (counts.seven === 2) return 20;
  if (counts.bell === 2) return 10;
  if (counts.watermelon === 2) return 5;
  if (counts.cherries === 2) return 4;
  if (counts.grapes === 2) return 4;

  return 0;
}
