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

  // États du cycle de jeu : "briefing" (écran d'accueil) | "playing" (en cours) | "results" (fin solo)
  const [gameState, setGameState] = useState("briefing");
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
  }, []);

  // Gestion du chronomètre par manche (actif uniquement quand gameState === "playing")
  useEffect(() => {
    if (
      gameState !== "playing" ||
      selectedOption !== null ||
      isGameOver ||
      (gameMode === "multi" && !inMultiBattle)
    ) {
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
  }, [gameState, currentRoundIndex, selectedOption, isGameOver, inMultiBattle, gameMode, submitAnswer]);

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

  // Démarrage de la partie Solo depuis l'écran de briefing
  const handleStartSolo = () => {
    startSoloGame();
    sessionStartTimeRef.current = Date.now();
    setGameState("playing");
  };

  // Choix d'une interface par le joueur
  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return;
    submitAnswer(opt, timeRemainingMs);
  };

  // Démarrage de la battle multijoueur (2 à 4 joueurs max)
  const handleStartMultiBattle = (players) => {
    setMultiPlayers(players);
    setInMultiBattle(true);
    startSoloGame();
    sessionStartTimeRef.current = Date.now();
    setGameState("playing");
  };

  // Fin de la battle multijoueur : calcul du classement final des 4 joueurs
  const handleFinishMultiBattle = () => {
    const totalTimeMs = Date.now() - sessionStartTimeRef.current;
    const myAvgTime = Math.round(totalTimeMs / 10);

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
      const randomScore = Math.floor(650 + Math.random() * 450);
      const randomTime = Math.floor(1800 + Math.random() * 1200);
      return {
        pseudo: p.pseudo,
        avatar: p.avatar,
        score: randomScore,
        avgTimeMs: randomTime,
        isMe: false,
      };
    });

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
            onClick={() => {
              if (gameState === "playing") {
                if (window.confirm("Voulez-vous quitter l'audit en cours et revenir au menu ?")) {
                  setGameState("briefing");
                  resetGame();
                }
              } else {
                navigate("/evil/jeux");
              }
            }}
            className="pixel-btn"
            title="Revenir au menu précédent"
          >
            <span>← {gameState === "playing" ? "QUITTER L'AUDIT" : "RETOUR AUX JEUX"}</span>
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

        {/* ========================================================
            1. ÉCRAN INTERMÉDIAIRE : SALLE DE BRIEFING (START SCREEN)
            ======================================================== */}
        {gameState === "briefing" && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            {/* Carte de Présentation & Règles du Jeu */}
            <div className="pixel-panel p-6 space-y-5 border-2 border-amber-600/80">
              <div className="text-center space-y-1 border-b border-gray-800 pb-4">
                <span className="text-3xl">🏛️</span>
                <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wider">
                  SALLE DE BRIEFING DE L'ARCHITECTE
                </h2>
                <p className="text-xs text-gray-300">
                  Préparez-vous à auditer les créations web du Semestre 3 (R3.01)
                </p>
              </div>

              {/* Les 4 Piliers du Gameplay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-950/80 border border-gray-800 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>📐</span>
                    <span>1 FORMAT IMPOSÉ PAR MANCHE</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Chaque manche impose son format (Mobile, Tablette ou Desktop). La différence ergonomique est à observer directement dans ce contexte !
                  </p>
                </div>

                <div className="p-3 bg-gray-950/80 border border-gray-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>⏱️</span>
                    <span>15 SECONDES & BONUS VITESSE</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Vous avez 15 secondes par manche. Plus vite vous débusquez le piège, plus vous remportez de points bonus !
                  </p>
                </div>

                <div className="p-3 bg-gray-950/80 border border-gray-800 space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>COMBOS DE SÉRIES (STREAK)</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Enchaînez les bonnes réponses consécutives pour débloquer +25 points supplémentaires par manche d'affilée.
                  </p>
                </div>

                <div className="p-3 bg-gray-950/80 border border-gray-800 space-y-1">
                  <div className="font-bold text-yellow-300 flex items-center gap-1.5">
                    <span>💰</span>
                    <span>GAINS DE COINS RÉELS</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Remportez des Coins Evil proportionnels à votre score pour débloquer de nouveaux avatars dans la boutique !
                  </p>
                </div>
              </div>

              {/* Sélecteur d'Onglets Solo / Multi */}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setGameMode("solo")}
                    className={`pixel-tab ${gameMode === "solo" ? "active" : ""}`}
                  >
                    <span>👤</span>
                    <span>MODE SOLO (20 MANCHES)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode("multi")}
                    className={`pixel-tab ${gameMode === "multi" ? "active" : ""}`}
                  >
                    <span>👥</span>
                    <span>MULTIJOUEUR (2 À 4 JOUEURS)</span>
                  </button>
                </div>

                {/* Action Mode Solo */}
                {gameMode === "solo" && (
                  <div className="text-center space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleStartSolo}
                      className="pixel-btn w-full !py-3.5 !bg-red-700 hover:!bg-red-600 !text-white text-base shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                      ⚔️ COMMENCER L'AUDIT SOLO (20 MANCHES)
                    </button>
                    <p className="text-[11px] text-gray-400">
                      Le chronomètre démarrera dès le clic. Les manches s'enchaîneront avec un retour pédagogique à chaque vote.
                    </p>
                  </div>
                )}

                {/* Action Mode Multijoueur */}
                {gameMode === "multi" && (
                  <IhmMultiLobby onStartBattle={handleStartMultiBattle} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            2. SCÈNE DE JEU EN COURS (MANCHES SOLO OU MULTI BATTLE)
            ======================================================== */}
        {gameState === "playing" && !isGameOver && (
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

            {/* Simulateur avec Format d'Écran Imposé pour cette manche */}
            <IhmViewportSimulator targetViewport={currentQ.targetViewport || "mobile"}>
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
            3. ÉCRAN DE FIN DE PARTIE SOLO (RÉCAPITULATIF & GAINS)
            ======================================================== */}
        {gameState === "playing" && isGameOver && (
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
                onClick={() => {
                  resetGame();
                  setGameState("briefing");
                }}
                className="pixel-btn w-full !bg-red-700 hover:!bg-red-600 !text-white"
              >
                RETOURNER AU BRIEFING
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
              setGameState("briefing");
              resetGame();
            }}
            onBackToGames={() => navigate("/evil/jeux")}
          />
        )}
      </main>
    </div>
  );
}
