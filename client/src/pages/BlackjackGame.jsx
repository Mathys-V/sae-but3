import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createDeck,
  isNaturalBlackjack,
  playDealer,
  scoreHand,
  settleHand,
  STARTING_BANKROLL,
} from "../game/casino/blackjackLogic.js";
import "./BlackjackGame.css";

function readBankroll() {
  try {
    const stored = window.localStorage.getItem("blackjack-bankroll");
    if (stored === null) return STARTING_BANKROLL;
    const saved = Number(stored);
    return Number.isFinite(saved) && saved >= 0 ? saved : STARTING_BANKROLL;
  } catch {
    return STARTING_BANKROLL;
  }
}

function Card({ card, hidden = false }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <span
      className={`blackjack-card${isRed ? " is-red" : ""}${hidden ? " is-hidden" : ""}`}
      aria-label={hidden ? "Carte cachée" : `${card.rank} ${card.suit}`}
    >
      {hidden ? (
        <span aria-hidden="true">★</span>
      ) : (
        <>
          <b>{card.rank}</b>
          <small>{card.suit}</small>
        </>
      )}
    </span>
  );
}

export default function BlackjackGame() {
  const [bankroll, setBankroll] = useState(readBankroll);
  const [wagerInput, setWagerInput] = useState("20");
  const wager = Number(wagerInput);
  const [roundWager, setRoundWager] = useState(0);
  const [shoe, setShoe] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState("ready");
  const [message, setMessage] = useState(
    "Choisissez votre mise et distribuez.",
  );

  function updateBankroll(amount) {
    setBankroll(amount);
    try {
      window.localStorage.setItem("blackjack-bankroll", String(amount));
    } catch {
      // The round still works when browser storage is unavailable.
    }
  }

  function finishRound(
    playerHand,
    dealerHand,
    remainingShoe,
    handWager,
    balanceBeforePayout = bankroll,
  ) {
    const outcome = settleHand(playerHand, dealerHand, handWager);
    const messages = {
      blackjack: `Blackjack ! Paiement 3:2 : +${handWager * 1.5} jetons.`,
      "dealer-blackjack": "Blackjack de la banque. Vous perdez la mise.",
      bust: "Plus de 21 : mise perdue.",
      win: `Gagné ! Vous recevez ${handWager * 2} jetons.`,
      push: "Égalité : votre mise est rendue.",
      loss: "La banque gagne. Mise perdue.",
    };
    setPlayer(playerHand);
    setDealer(dealerHand);
    setShoe(remainingShoe);
    setPhase("finished");
    setMessage(messages[outcome.result]);
    updateBankroll(balanceBeforePayout + outcome.payout);
  }

  function deal() {
    if (
      phase === "playing" ||
      !Number.isInteger(wager) ||
      wager < 2 ||
      wager % 2 !== 0 ||
      wager > bankroll
    )
      return;
    const deck = createDeck();
    const playerHand = [deck[0], deck[2]];
    const dealerHand = [deck[1], deck[3]];
    const remaining = deck.slice(4);
    const nextBankroll = bankroll - wager;
    setPlayer(playerHand);
    setDealer(dealerHand);
    setShoe(remaining);
    setRoundWager(wager);
    updateBankroll(nextBankroll);

    if (isNaturalBlackjack(playerHand) || isNaturalBlackjack(dealerHand)) {
      finishRound(playerHand, dealerHand, remaining, wager, nextBankroll);
      return;
    }
    setPhase("playing");
    setMessage("À vous de jouer.");
  }

  function hit() {
    if (phase !== "playing" || shoe.length === 0) return;
    const hand = [...player, shoe[0]];
    const remaining = shoe.slice(1);
    setPlayer(hand);
    setShoe(remaining);
    if (scoreHand(hand).total > 21)
      finishRound(hand, dealer, remaining, roundWager);
  }

  function stand() {
    if (phase !== "playing") return;
    const finalDealer = playDealer(dealer, shoe);
    finishRound(player, finalDealer.hand, finalDealer.shoe, roundWager);
  }

  function doubleDown() {
    if (
      phase !== "playing" ||
      player.length !== 2 ||
      bankroll < roundWager ||
      scoreHand(player).total >= 21 ||
      shoe.length === 0
    )
      return;
    const nextBankroll = bankroll - roundWager;
    const hand = [...player, shoe[0]];
    const remaining = shoe.slice(1);
    const doubledWager = roundWager * 2;
    updateBankroll(nextBankroll);
    setRoundWager(doubledWager);
    if (scoreHand(hand).total > 21) {
      finishRound(hand, dealer, remaining, doubledWager, nextBankroll);
      return;
    }
    const finalDealer = playDealer(dealer, remaining);
    finishRound(
      hand,
      finalDealer.hand,
      finalDealer.shoe,
      doubledWager,
      nextBankroll,
    );
  }

  function resetBankroll() {
    if (phase === "playing") return;
    setWagerInput("20");
    updateBankroll(STARTING_BANKROLL);
    setMessage("Nouvelle bankroll virtuelle : 500 jetons.");
  }

  const playerScore = scoreHand(player);
  const dealerScore = scoreHand(dealer);
  const dealerVisibleScore = scoreHand(
    dealer.length > 0 ? [dealer[0]] : [],
  ).total;
  const canDouble =
    phase === "playing" &&
    player.length === 2 &&
    bankroll >= roundWager &&
    playerScore.total < 21;

  return (
    <main className="blackjack-page">
      <audio
        className="blackjack-audio"
        src="/assets/casino/soundtracks/Casino%20Chill.mp3"
        autoPlay
        loop
        aria-label="Musique Casino Chill"
      />
      <p className="blackjack-kicker">LAS PROBAS · TABLE 67</p>
      <h1>BLACKJACK</h1>
      <section className="blackjack-table" aria-label="Table de blackjack">
        <div className="blackjack-seat">
          <h2>
            LA BANQUE{" "}
            <span>
              {phase === "playing" ? dealerVisibleScore : dealerScore.total}
            </span>
          </h2>
          <div className="blackjack-hand" aria-label="Main de la banque">
            {dealer.map((card, index) => (
              <Card
                key={`${card.suit}-${card.rank}-${index}`}
                card={card}
                hidden={phase === "playing" && index === 1}
              />
            ))}
          </div>
        </div>
        <div className="blackjack-table-mark" aria-hidden="true">
          ♠
        </div>
        <div className="blackjack-seat">
          <h2>
            VOTRE MAIN <span>{playerScore.total}</span>
          </h2>
          <div className="blackjack-hand" aria-label="Votre main">
            {player.map((card, index) => (
              <Card key={`${card.suit}-${card.rank}-${index}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      <p className="blackjack-status" role="status" aria-live="polite">
        {message}
      </p>
      <section
        className="blackjack-controls"
        aria-label="Commandes de la partie"
      >
        <label className="blackjack-balance">
          Jetons <b>{bankroll}</b>
        </label>
        <label className="blackjack-bet">
          Mise
          <input
            type="number"
            min="2"
            max={bankroll}
            step="2"
            value={wagerInput}
            disabled={phase === "playing"}
            onChange={(event) => setWagerInput(event.target.value)}
          />
        </label>
        <button
          onClick={deal}
          disabled={
            phase === "playing" ||
            !Number.isInteger(wager) ||
            wager < 2 ||
            wager % 2 !== 0 ||
            wager > bankroll ||
            bankroll <= 0
          }
        >
          Distribuer
        </button>
        <button
          onClick={hit}
          disabled={phase !== "playing" || playerScore.total >= 21}
        >
          Tirer
        </button>
        <button onClick={stand} disabled={phase !== "playing"}>
          Rester
        </button>
        <button onClick={doubleDown} disabled={!canDouble}>
          Doubler
        </button>
        <Link to="/casino">Retour au casino</Link>
      </section>
      {bankroll <= 0 && phase !== "playing" && (
        <div className="blackjack-empty">
          <p>Plus de jetons disponibles.</p>
          <button onClick={resetBankroll}>Recommencer avec 500 jetons</button>
        </div>
      )}
    </main>
  );
}
