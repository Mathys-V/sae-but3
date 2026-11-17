export const STARTING_BANKROLL = 500;

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createDeck(random = Math.random) {
  const deck = SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

export function scoreHand(cards) {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.rank === "A") {
      total += 11;
      aces += 1;
    } else {
      total += ["J", "Q", "K"].includes(card.rank) ? 10 : Number(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0 };
}

export function isNaturalBlackjack(cards) {
  return cards.length === 2 && scoreHand(cards).total === 21;
}

export function playDealer(dealerHand, shoe) {
  const hand = [...dealerHand];
  const remaining = [...shoe];
  while (scoreHand(hand).total < 17 && remaining.length > 0) {
    hand.push(remaining.shift());
  }
  return { hand, shoe: remaining };
}

// payout is the total amount returned, including the original wager.
export function settleHand(playerHand, dealerHand, wager) {
  const playerScore = scoreHand(playerHand).total;
  const dealerScore = scoreHand(dealerHand).total;
  const playerNatural = isNaturalBlackjack(playerHand);
  const dealerNatural = isNaturalBlackjack(dealerHand);

  if (playerNatural && dealerNatural) return { result: "push", payout: wager };
  if (playerNatural) return { result: "blackjack", payout: wager * 2.5 };
  if (dealerNatural) return { result: "dealer-blackjack", payout: 0 };
  if (playerScore > 21) return { result: "bust", payout: 0 };
  if (dealerScore > 21 || playerScore > dealerScore) return { result: "win", payout: wager * 2 };
  if (playerScore === dealerScore) return { result: "push", payout: wager };
  return { result: "loss", payout: 0 };
}
