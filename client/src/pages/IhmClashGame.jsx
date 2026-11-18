// client/src/pages/IhmClashGame.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";
import { useIhmStore } from "../store/ihmStore";
import { recordGameSession } from "../services/api";
import IhmViewportSimulator from "../components/ihm/IhmViewportSimulator";
import IhmCardViewer from "../components/ihm/IhmCardViewer";
import IhmMultiLobby from "../components/ihm/IhmMultiLobby";
import IhmRankingModal from "../components/ihm/IhmRankingModal";

const TIMER_TOTAL_MS = 15000;

export default function IhmClashGame() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { coins, earnCoins } = useEconomyStore();

  const {
    questions,
    currentRoundIndex,
    score,
    streak,
    maxStreak,
    history,
    selectedOption,
    roundFeedback,
    isGameOver,
    coinsEarned,
    startSoloGame,
    submitAnswer,
    nextRound,
    resetGame,
  } = useIhmStore();

  const [gameMode, setGameMode] = useState("solo"); // "solo" | "multi"
  const [inMultiBattle, setInMultiBattle] = useState(false);
  const [multiPlayers, setMultiPlayers] = useState([]);
  const [multiRankings, setMultiRankings] = useState(null);

  // Chronomètre de manche
  const [timeRemainingMs, setTimeRemainingMs] = useState(TIMER_TOTAL_MS);
  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(0);

  // Titre du document
  useEffect(() => {
    document.title = "EvilJV | Duel d'IHM (BUT 2 S3)";
    startSoloGame();
    sessionStartTimeRef.current = Date.now();
  }, [startSoloGame]);

  // Gestion du chronomètre par manche
  useEffect(() => {
    if (selectedOption !== null || isGameOver || (gameMode === "multi" && !inMultiBattle)) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 100;
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, TIMER_TOTAL_MS - elapsed);
      setTimeRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        submitAnswer("A", 0);
      }
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentRoundIndex, selectedOption, isGameOver, inMultiBattle, gameMode, submitAnswer]);

  // Enregistrement de la télémétrie en fin de partie solo
  useEffect(() => {
    if (isGameOver && coinsEarned > 0) {
      earnCoins(coinsEarned);
      const totalSeconds = Math.max(10, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
      recordGameSession(token, {
        game: "Duel d'IHM (UX Clash)",
        score,
        timeSeconds: totalSeconds,
        completed: true,
        status: "finished",
      });
    }
  }, [isGameOver, coinsEarned, earnCoins, score, token]);

  const currentQ = questions[currentRoundIndex] || questions[0];
  const timerRatio = Math.max(0, timeRemainingMs / TIMER_TOTAL_MS);

  // Choix du joueur
  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return;
    submitAnswer(opt, timeRemainingMs);
  };

  // Démarrage de la battle multijoueur (4 joueurs max)
  const handleStartMultiBattle = (players) => {
    setMultiPlayers(players);
    setInMultiBattle(true);
    startSoloGame();
  };

  // Fin de la battle multijoueur : calcul du classement final des 4 joueurs
  const handleFinishMultiBattle = () => {
    const totalTimeMs = Date.now() - sessionStartTimeRef.current;
    const myAvgTime = Math.round(totalTimeMs / 10);

    // Simulation des résultats pour les 3 autres camarades
    const simulatedScores = multiPlayers.map((p) => {
      if (p.isMe) {
        return {
          pseudo: p.pseudo,
          avatar: p.avatar,
          score,
          avgTimeMs: myAvgTime,
          isMe: true,
        };
      }
      // Scores réalistes basés sur les 10 manches
      const randomScore = Math.floor(600 + Math.random() * 500);
      const randomTime = Math.floor(1800 + Math.random() * 1200);
      return {
        pseudo: p.pseudo,
        avatar: p.avatar,
        score: randomScore,
        avgTimeMs: randomTime,
        isMe: false,
      };
    });

    // Tri par score décroissant, puis par temps de réaction croissant (départage au millième)
    simulatedScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.avgTimeMs - b.avgTimeMs;
    });

    const coinRewards = [100, 60, 40, 20];
    const finalRankings = simulatedScores.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      coinsWon: coinRewards[idx] || 10,
    }));

    const myResult = finalRankings.find((r) => r.isMe);
    if (myResult) {
      earnCoins(myResult.coinsWon);
      recordGameSession(token, {
        game: "Duel d'IHM (UX Clash)",
        score: myResult.score,
        timeSeconds: Math.round(totalTimeMs / 1000),
        completed: true,
        status: "finished",
      });
    }

    setMultiRankings(finalRankings);
  };

  return (
    <div className="-m-6 p-4 sm:p-6 min-h-[calc(100vh-64px)] font-vcr">
      <main className="max-w-5xl mx-auto space-y-5">
        {/* Barre supérieure : Retour & Solde de Coins */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/evil/jeux")}
            className="pixel-btn"
            title="Revenir au catalogue des jeux"
          >
            <span>← RETOUR AUX JEUX</span>
          </button>

          <div className="pixel-pill" title="Pièces démoniaques récoltées">
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
              alt="Coins"
              className="w-5 h-5 pixelated animate-pulse"
            />
            <span>{coins} COINS</span>
          </div>
        </div>

        {/* Bannière de Titre Donjon Pixel Art */}
        <div className="pixel-banner p-4 text-center">
          <h1 className="text-xl sm:text-2xl font-vcr font-bold text-red-500 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            ⚔️ DUEL D'IHM : BUT 2 S3 DÉVELOPPEMENT WEB
          </h1>
          <p className="text-xs text-gray-300 mt-1 tracking-wide">
            Évaluez 2 interfaces réelles : identifiez la version la plus responsive, accessible et ergonomique !
          </p>
        </div>

        {/* Sélecteur de Mode (Solo vs Multijoueur 4 Joueurs) */}
        {!inMultiBattle && !isGameOver && (
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGameMode("solo");
                resetGame();
              }}
              className={`pixel-tab ${gameMode === "solo" ? "active" : ""}`}
            >
              <span>👤</span>
              <span>MODE SOLO (20 ROUNDS)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setGameMode("multi");
                resetGame();
              }}
              className={`pixel-tab ${gameMode === "multi" ? "active" : ""}`}
            >
              <span>👥</span>
              <span>MULTIJOUEUR (2 À 4 JOUEURS MAX)</span>
            </button>
          </div>
        )}

        {/* ========================================================
            MODE MULTIJOUEUR : LOBBY SALON
            ======================================================== */}
        {gameMode === "multi" && !inMultiBattle && !multiRankings && (
          <IhmMultiLobby onStartBattle={handleStartMultiBattle} />
        )}

        {/* ========================================================
            SCÈNE DE JEU EN COURS (SOLO OU BATTLE MULTI)
            ======================================================== */}
        {((gameMode === "solo" && !isGameOver) || (gameMode === "multi" && inMultiBattle)) && (
          <div className="space-y-4 animate-fade-in">
            {/* Tableau de Bord Pixel Art (HUD Arcade) */}
            <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
              {/* Manche en cours */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase">MANCHE :</span>
                <span className="text-base font-bold text-amber-300">
                  {currentRoundIndex + 1} / {gameMode === "multi" ? 10 : questions.length}
                </span>
              </div>

              {/* Score et Streak Combo */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 uppercase">SCORE :</span>
                  <span className="text-base font-bold text-emerald-400">{score} PTS</span>
                </div>

                {streak > 1 && (
                  <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 border border-amber-600 animate-pulse">
                    🔥 COMBO x{streak} (+{streak * 25} PTS)
                  </span>
                )}
              </div>

              {/* Jauge du Compte à Rebours (15 secondes) */}
              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] text-gray-300 font-mono">
                  <span>CHRONO :</span>
                  <span className="font-bold text-amber-400">{(timeRemainingMs / 1000).toFixed(1)}s</span>
                </div>
                <div className="w-full h-3 bg-gray-900 border border-gray-700 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      timerRatio > 0.5 ? "bg-emerald-500" : timerRatio > 0.25 ? "bg-amber-500" : "bg-red-600"
                    }`}
                    style={{ width: `${timerRatio * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Consigne Pédagogique du Round */}
            <div className="pixel-panel p-4 text-center space-y-1 border-2 border-amber-600/70">
              <span className="text-[11px] text-amber-400 uppercase tracking-widest font-bold">
                [{currentQ.categoryLabel}] — {currentQ.title}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-100">
                {currentQ.instruction}
              </h2>
            </div>

            {/* Simulateur de Viewport avec les deux interfaces concurrentes */}
            <IhmViewportSimulator>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <IhmCardViewer
                  variant={currentQ.variantA}
                  optionLabel="A"
                  onSelect={handleSelectOption}
                  isSelected={selectedOption === "A"}
                  showResult={selectedOption !== null}
                  isCorrect={currentQ.correctOption === "A"}
                />

                <IhmCardViewer
                  variant={currentQ.variantB}
                  optionLabel="B"
                  onSelect={handleSelectOption}
                  isSelected={selectedOption === "B"}
                  showResult={selectedOption !== null}
                  isCorrect={currentQ.correctOption === "B"}
                />
              </div>
            </IhmViewportSimulator>

            {/* Panneau de Révélation et Feedback Pédagogique */}
            {roundFeedback && (
              <div
                className={`pixel-panel p-5 space-y-3 animate-fade-in border-2 ${
                  roundFeedback.isCorrect ? "border-emerald-600 bg-emerald-950/40" : "border-rose-600 bg-rose-950/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{roundFeedback.isCorrect ? "🎉" : "⚠️"}</span>
                    <div>
                      <h3 className={`text-base font-bold ${roundFeedback.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                        {roundFeedback.isCorrect
                          ? `EXCELLENT CHOIX ! (+${roundFeedback.pointsEarned} PTS)`
                          : `PIÈGE ERGONOMIQUE DÉTECTÉ (La bonne réponse était l'interface ${roundFeedback.correctOption})`}
                      </h3>
                      {roundFeedback.isCorrect && roundFeedback.timeBonus > 0 && (
                        <p className="text-[11px] text-amber-300 font-mono">
                          ⚡ Bonus rapidité : +{roundFeedback.timeBonus} pts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bouton de progression */}
                  <button
                    type="button"
                    onClick={() => {
                      if (gameMode === "multi" && currentRoundIndex >= 9) {
                        handleFinishMultiBattle();
                      } else {
                        nextRound();
                      }
                    }}
                    className="pixel-btn !bg-red-700 hover:!bg-red-600 !text-white text-sm whitespace-nowrap"
                  >
                    {currentRoundIndex + 1 >= (gameMode === "multi" ? 10 : questions.length)
                      ? "VOIR LES RÉSULTATS →"
                      : "MANCHE SUIVANTE →"}
                  </button>
                </div>

                <div className="text-xs text-gray-200 leading-relaxed font-sans bg-gray-950/80 p-3 border border-gray-800">
                  <strong className="text-amber-400 font-vcr block mb-1">
                    🔍 ANALYSE ERGONOMIQUE (BUT 2 S3 DÉV WEB) :
                  </strong>
                  {roundFeedback.explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ÉCRAN DE FIN DE PARTIE SOLO (RÉCAPITULATIF & GAINS)
            ======================================================== */}
        {gameMode === "solo" && isGameOver && (
          <div className="pixel-panel p-8 max-w-xl mx-auto text-center space-y-6 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.5)] animate-fade-in">
            <span className="text-4xl">👑</span>
            <div>
              <h2 className="text-2xl font-bold text-amber-400 uppercase tracking-widest">
                AUDIT IHM TERMINÉ !
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Félicitations, vous avez complété l'ensemble des 20 cas d'études ergonomiques de S3 !
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-950/80 border border-gray-800">
              <div>
                <span className="text-[10px] text-gray-400 uppercase">SCORE TOTAL</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{score} PTS</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase">MEILLEUR COMBO</span>
                <p className="text-xl font-bold text-amber-300 mt-1">x{maxStreak}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase">RÉUSSITE</span>
                <p className="text-xl font-bold text-gray-100 mt-1">
                  {history.filter((h) => h.isCorrect).length} / {questions.length}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/70 border border-amber-700 flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-amber-300">RÉCOMPENSE EARNED :</span>
              <span className="text-base font-bold text-white flex items-center gap-1">
                +{coinsEarned}
                <img
                  src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
                  alt="Coins"
                  className="w-4 h-4 pixelated inline"
                />
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetGame}
                className="pixel-btn w-full !bg-red-700 hover:!bg-red-600 !text-white"
              >
                REJOUER LE DEVOIR
              </button>
              <button
                type="button"
                onClick={() => navigate("/evil/jeux")}
                className="pixel-btn w-full"
              >
                CATALOGUE DES JEUX
              </button>
            </div>
          </div>
        )}

        {/* Modale de Classement Final Multijoueur */}
        {multiRankings && (
          <IhmRankingModal
            rankings={multiRankings}
            onPlayAgain={() => {
              setMultiRankings(null);
              setInMultiBattle(false);
              resetGame();
            }}
            onBackToGames={() => navigate("/evil/jeux")}
          />
        )}
      </main>
    </div>
  );
}
