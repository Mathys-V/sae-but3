import { Link } from "react-router-dom";
import rouletteImage from "../assets/backgrounds/roulettebg.png";
import tableImage from "../assets/backgrounds/tablebg.png";
import "./CasinoIntro.css";

export default function CasinoIntro() {
  return (
    <main className="casino-intro">
      <audio
        className="casino-intro-audio"
        src="/assets/casino/soundtracks/Accueil%20casino.mp3"
        autoPlay
        loop
        aria-label="Musique d’accueil du casino"
      />
      <div className="casino-atmosphere" aria-hidden="true">
        <span>✦</span>
        <span>♦</span>
        <span>✧</span>
        <span>♠</span>
        <span>✦</span>
      </div>
      <img
        className="vegas-panel"
        src="/assets/casino/vegasPanel/vegasPanel.png"
        alt="Enseigne lumineuse Vegas"
      />

      <div className="casino-intro-content">
        <p className="casino-kicker">BIENVENUE À</p>
        <h1>
          LAS <span>PROBAS</span>
        </h1>
        <p className="casino-prompt">CHOISISSEZ VOTRE JEU</p>
        <div className="casino-games">
          <Link
            className="casino-game-link"
            to="/machine"
            style={{ "--game-image": `url("${rouletteImage}")` }}
          >
            <span className="casino-game-icon" aria-hidden="true">
              777
            </span>
            <span className="casino-game-copy">
              <b>MACHINE À SOUS</b>
            </span>
          </Link>
          <Link
            className="casino-game-link casino-blackjack-link"
            to="/blackjack"
            style={{ "--game-image": `url("${tableImage}")` }}
          >
            <span className="casino-game-icon cards-icon" aria-hidden="true">
              A♠
            </span>
            <span className="casino-game-copy">
              <b>BLACKJACK</b>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
