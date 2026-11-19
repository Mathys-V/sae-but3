// client/src/pages/IhmClashGame.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";
import {
  useIhmStore,
  IhmViewportSimulator,
  IhmCardViewer,
  IhmMultiLobby,
  IhmRankingModal,
} from "../game/ihm";
import { recordGameSession } from "../services/api";

const TIMER_TOTAL_MS = 15000;

export default function IhmClashGame() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { coins, addWinnings, earnCoins = addWinnings } = useEconomyStore();

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

  // États du cycle de jeu : "briefing" (écran d'accueil) | "playing" (en cours)
  const [gameState, setGameState] = useState("briefing");
  const [gameMode, setGameMode] = useState("solo"); // "solo" | "multi"
  const [inMultiBattle, setInMultiBattle] = useState(false);
  const [multiPlayers, setMultiPlayers] = useState([]);
  const [multiRankings, setMultiRankings] = useState(null);

  // Filtre d'analyse pour la revue finale des 20 cas d'audit
  const [reviewFilter, setReviewFilter] = useState("all"); // "all" | "correct" | "incorrect"

  // Chronomètre de manche
  const [timeRemainingMs, setTimeRemainingMs] = useState(TIMER_TOTAL_MS);
  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(0);
  const hasRecordedRef = useRef(false);

  // Titre du document
  useEffect(() => {
    document.title = "EvilJV | L'Oeil Critique - Développement Web";
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

  // Enregistrement de la télémétrie en fin de partie solo (une seule fois par session terminée)
  useEffect(() => {
    if (isGameOver && coinsEarned > 0 && !hasRecordedRef.current) {
      hasRecordedRef.current = true;
      const awardCoins = earnCoins || addWinnings;
      if (typeof awardCoins === "function") {
        awardCoins(coinsEarned);
      }
      const totalSeconds = Math.max(10, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
      void recordGameSession(token, {
        game: "L'Oeil Critique",
        score,
        timeSeconds: totalSeconds,
        completed: true,
        status: "finished",
      });
    }
  }, [isGameOver, coinsEarned, earnCoins, addWinnings, score, token]);

  const currentQ = questions[currentRoundIndex] || questions[0];
  const timerRatio = Math.max(0, timeRemainingMs / TIMER_TOTAL_MS);

  // Démarrage de la partie Solo depuis l'écran de briefing
  const handleStartSolo = () => {
    hasRecordedRef.current = false;
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
    hasRecordedRef.current = false;
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
      const awardCoins = earnCoins || addWinnings;
      if (typeof awardCoins === "function") {
        awardCoins(myResult.coinsWon);
      }
      void recordGameSession(token, {
        game: "L'Oeil Critique",
        score: myResult.score,
        timeSeconds: Math.round(totalTimeMs / 1000),
        completed: true,
        status: "finished",
      });
    }

    setMultiRankings(finalRankings);
  };

  // Filtrage de la revue des 20 questions
  const filteredHistory = history.filter((item) => {
    if (reviewFilter === "correct") return item.isCorrect;
    if (reviewFilter === "incorrect") return !item.isCorrect;
    return true;
  });

  return (
    <div className="-m-6 p-4 sm:p-6 min-h-[calc(100vh-64px)] font-sans text-gray-100">
      <main className="max-w-5xl mx-auto space-y-4">
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
            className="pixel-btn !font-sans font-bold"
            title="Revenir au menu précédent"
          >
            <span>← {gameState === "playing" ? "QUITTER L'AUDIT" : "RETOUR AUX JEUX"}</span>
          </button>

          <div className="pixel-pill !font-sans font-bold" title="Pièces démoniaques récoltées">
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
              alt="Coins"
              className="w-5 h-5 pixelated animate-pulse"
            />
            <span className="font-mono">{coins} COINS</span>
          </div>
        </div>

        {/* ========================================================
            1. ÉCRAN INTERMÉDIAIRE : SALLE DE BRIEFING (START SCREEN)
            ======================================================== */}
        {gameState === "briefing" && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pt-2">
            {/* Carte de Présentation Épurée & Directe */}
            <div className="pixel-panel p-6 space-y-5 border-2 border-amber-600/80 shadow-lg">
              <div className="text-center space-y-1 border-b border-gray-800 pb-4">
                <span className="text-3xl">👁️</span>
                <h1 className="text-xl sm:text-2xl font-bold text-amber-400 uppercase tracking-wider font-sans">
                  L'OEIL CRITIQUE
                </h1>
                <p className="text-xs sm:text-sm text-gray-300">
                  Comparez 2 interfaces et choisissez celle qui respecte les bonnes pratiques du web.
                </p>
              </div>

              {/* Les 3 Règles Clés Épurées */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                    <span>📐</span>
                    <span>1 FORMAT IMPOSÉ</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Mobile (375px), Tablette ou Desktop selon la manche.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span>⚡</span>
                    <span>DIFFICULTÉ PROGRESSIVE</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    5 faciles, 10 moyennes et 5 expertes tirées parmi 80 cas.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded space-y-1">
                  <div className="font-bold text-yellow-300 flex items-center gap-1.5 font-mono">
                    <span>💰</span>
                    <span>GAINS DE COINS</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Remportez des pièces pour débloquer de nouveaux avatars.
                  </p>
                </div>
              </div>

              {/* Sélecteur d'Onglets Solo / Multi */}
              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setGameMode("solo")}
                    className={`pixel-tab !font-sans font-bold ${gameMode === "solo" ? "active" : ""}`}
                  >
                    <span>👤</span>
                    <span>MODE SOLO (20 MANCHES)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode("multi")}
                    className={`pixel-tab !font-sans font-bold ${gameMode === "multi" ? "active" : ""}`}
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
                      className="pixel-btn w-full !py-3.5 !bg-red-700 hover:!bg-red-600 !text-white text-base font-bold !font-sans shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                      ▶ DÉMARRER L'AUDIT (20 MANCHES)
                    </button>
                    <p className="text-xs text-gray-400 font-sans">
                      Chaque manche propose 2 interfaces. Identifiez la plus ergonomique sans vous faire piéger !
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
          <div className="space-y-4 animate-fade-in font-sans">
            {/* HUD Arcade & Contexte d'Audit Unifié (Bandeau Unique Épuré) */}
            <div className="pixel-panel p-3.5 space-y-2.5 border-2 border-amber-600/70 shadow-md">
              {/* Ligne 1 : Statuts de la partie */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-gray-900 border border-gray-700 text-amber-300">
                    MANCHE {currentRoundIndex + 1} / {gameMode === "multi" ? 10 : questions.length}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-xs text-gray-400 uppercase">SCORE :</span>
                    <span className="text-sm font-bold text-emerald-400">{score} PTS</span>
                  </div>
                  {streak > 1 && (
                    <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600 animate-pulse font-mono">
                      🔥 COMBO x{streak}
                    </span>
                  )}
                </div>

                {/* Chronomètre et jauge animée (Urgence visuelle < 3s, barre élargie) */}
                <div
                  className={`flex items-center gap-3 px-3 py-1 rounded transition-all duration-200 ${
                    timeRemainingMs <= 3000 && selectedOption === null
                      ? "bg-red-950/80 border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"
                      : "bg-gray-900/90 border border-gray-700/80"
                  }`}
                >
                  <span
                    className={`text-sm sm:text-base font-mono font-black min-w-[50px] text-right ${
                      timeRemainingMs <= 3000 && selectedOption === null
                        ? "text-red-400 font-black animate-pulse"
                        : "text-amber-400"
                    }`}
                  >
                    {(timeRemainingMs / 1000).toFixed(1)}s
                  </span>
                  <div className="w-44 sm:w-64 md:w-80 h-3.5 bg-gray-950 border border-gray-700 rounded overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-100 ${
                        timerRatio > 0.5
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                          : timerRatio > 0.25
                          ? "bg-gradient-to-r from-amber-600 to-amber-400"
                          : "bg-gradient-to-r from-red-700 to-red-500"
                      }`}
                      style={{ width: `${timerRatio * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ligne 2 : Contexte d'Audit compact & Consigne */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-800 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 uppercase">
                    {currentQ.categoryLabel}
                  </span>
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border uppercase ${
                    currentQ.difficulty === 'easy'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : currentQ.difficulty === 'hard'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {currentQ.difficulty === 'easy' ? '🟢 Facile' : currentQ.difficulty === 'hard' ? '🔴 Expert' : '🟡 Moyen'}
                  </span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                    currentQ.targetViewport === 'mobile' ? 'bg-purple-950 text-purple-300 border-purple-700' :
                    currentQ.targetViewport === 'tablet' ? 'bg-blue-950 text-blue-300 border-blue-700' :
                    'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {currentQ.targetViewport === 'mobile' ? '📱 Mobile 375px' : currentQ.targetViewport === 'tablet' ? '💻 Tablette 768px' : '🖥️ Desktop'}
                  </span>
                  <span className="text-gray-300">
                    Composant : <strong className="text-white">{currentQ.title}</strong>
                  </span>
                </div>

                <span className="text-gray-300 font-medium italic sm:text-right">
                  Identifiez l'interface conforme aux standards ergonomiques
                </span>
              </div>
            </div>

            {/* Simulateur avec les 2 Maquettes A et B (Directement visibles sans bloc intermédiaire) */}
            <div key={currentRoundIndex} className="animate-fade-in">
              <IhmViewportSimulator targetViewport={currentQ.targetViewport || "mobile"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                  <IhmCardViewer
                    variant={currentQ.variantA}
                    targetViewport={currentQ.targetViewport || "mobile"}
                    optionLabel="A"
                    onSelect={handleSelectOption}
                    isSelected={selectedOption === "A"}
                    showResult={selectedOption !== null}
                    isCorrect={currentQ.correctOption === "A"}
                  />

                  <IhmCardViewer
                    variant={currentQ.variantB}
                    targetViewport={currentQ.targetViewport || "mobile"}
                    optionLabel="B"
                    onSelect={handleSelectOption}
                    isSelected={selectedOption === "B"}
                    showResult={selectedOption !== null}
                    isCorrect={currentQ.correctOption === "B"}
                  />
                </div>
              </IhmViewportSimulator>
            </div>

            {/* Panneau de Révélation et Feedback Pédagogique (affiché UNIQUEMENT après vote) */}
            {roundFeedback && (
              <div
                className={`pixel-panel p-5 space-y-3 animate-fade-in border-2 rounded ${
                  roundFeedback.isCorrect ? "border-emerald-600 bg-emerald-950/40" : "border-rose-600 bg-rose-950/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{roundFeedback.isCorrect ? "🎉" : "⚠️"}</span>
                    <div>
                      <h3 className={`text-base font-bold ${roundFeedback.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                        {roundFeedback.isCorrect
                          ? `EXCELLENT CHOIX ! (+${roundFeedback.pointsEarned} PTS)`
                          : `PIÈGE ERGONOMIQUE DÉTECTÉ (Bonne réponse : Interface ${roundFeedback.correctOption})`}
                      </h3>
                      {roundFeedback.isCorrect && roundFeedback.timeBonus > 0 && (
                        <p className="text-xs text-amber-300 font-mono mt-0.5">
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
                    className="pixel-btn !bg-red-700 hover:!bg-red-600 !text-white text-sm font-bold !font-sans whitespace-nowrap"
                  >
                    {currentRoundIndex + 1 >= (gameMode === "multi" ? 10 : questions.length)
                      ? "VOIR LES RÉSULTATS →"
                      : "MANCHE SUIVANTE →"}
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans bg-gray-950/90 p-3.5 border border-gray-800 rounded">
                  <strong className="text-amber-400 block mb-1 font-bold">
                    💡 EXPLICATION DE LA RÉPONSE :
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
          <div className="space-y-6 animate-fade-in font-sans">
            {/* Carte de Résumé des Performances */}
            <div className="pixel-panel p-8 max-w-2xl mx-auto text-center space-y-6 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.5)] rounded">
              <span className="text-4xl">👑</span>
              <div>
                <h2 className="text-2xl font-bold text-amber-400 uppercase tracking-widest font-sans">
                  L'OEIL CRITIQUE TERMINÉ !
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Félicitations, vous avez complété l'ensemble des 20 cas d'études ergonomiques de S3 !
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-950/80 border border-gray-800 rounded">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-mono">SCORE TOTAL</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{score} PTS</p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-mono">MEILLEUR COMBO</span>
                  <p className="text-2xl font-bold text-amber-300 mt-1 font-mono">x{maxStreak}</p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-mono">RÉUSSITE</span>
                  <p className="text-2xl font-bold text-gray-100 mt-1 font-mono">
                    {history.filter((h) => h.isCorrect).length} / {questions.length}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-950/70 border border-amber-700 rounded flex items-center justify-center gap-2">
                <span className="text-sm font-bold text-amber-300">RÉCOMPENSE EARNED :</span>
                <span className="text-base font-bold text-white flex items-center gap-1 font-mono">
                  +{coinsEarned}
                  <img
                    src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
                    alt="Coins"
                    className="w-4 h-4 pixelated inline"
                  />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetGame();
                    setGameState("briefing");
                  }}
                  className="pixel-btn w-full !bg-red-700 hover:!bg-red-600 !text-white !font-sans font-bold"
                >
                  RETOURNER AUX EXPLICATIONS
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/evil/jeux")}
                  className="pixel-btn w-full !font-sans font-bold"
                >
                  CATALOGUE DES JEUX
                </button>
              </div>
            </div>

            {/* ========================================================
                4. REVUE COMPLÈTE DES 20 CAS D'AUDIT (À TÊTE REPOSÉE)
                ======================================================== */}
            <div className="pixel-panel p-6 space-y-5 border-2 border-gray-700 rounded text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 font-sans">
                    <span>📋</span>
                    <span>REVUE DÉTAILLÉE DES 20 CAS D'AUDIT</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Analysez à tête reposée chaque cas d'étude, votre vote et l'explication ergonomique détaillée.
                  </p>
                </div>

                {/* Filtres par statut */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setReviewFilter("all")}
                    className={`px-3 py-1.5 rounded border transition-all ${
                      reviewFilter === "all"
                        ? "bg-amber-600 text-white border-amber-500 font-bold"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Tous ({history.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("correct")}
                    className={`px-3 py-1.5 rounded border transition-all ${
                      reviewFilter === "correct"
                        ? "bg-emerald-700 text-white border-emerald-500 font-bold"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    ✓ Réussis ({history.filter((h) => h.isCorrect).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("incorrect")}
                    className={`px-3 py-1.5 rounded border transition-all ${
                      reviewFilter === "incorrect"
                        ? "bg-rose-700 text-white border-rose-500 font-bold"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    ✗ Pièges ({history.filter((h) => !h.isCorrect).length})
                  </button>
                </div>
              </div>

              {/* Liste des questions auditées */}
              <div className="space-y-3.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item.round}
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      item.isCorrect
                        ? "bg-emerald-950/20 border-emerald-800/80"
                        : "bg-rose-950/25 border-rose-800/80"
                    }`}
                  >
                    {/* En-tête de la question */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/60 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-amber-300">
                          Manche {item.round} / 20
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800 text-purple-300">
                          {item.viewportLabel || "Standard"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          [{item.categoryLabel}]
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          item.difficulty === 'easy'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : item.difficulty === 'hard'
                            ? 'bg-rose-950 text-rose-300 border-rose-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                        }`}>
                          {item.difficulty === 'easy' ? '🟢 Facile' : item.difficulty === 'hard' ? '🔴 Expert' : '🟡 Moyen'}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded font-mono ${
                            item.isCorrect
                              ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                              : "bg-rose-900 text-rose-300 border border-rose-700"
                          }`}
                        >
                          {item.isCorrect ? `✓ Réussi (+${item.pointsEarned} pts)` : "✗ Piège rencontré"}
                        </span>
                      </div>
                    </div>

                    {/* Comparaison Choix Joueur vs Bonne Réponse */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div
                        className={`p-2 rounded border ${
                          item.isCorrect
                            ? "bg-emerald-950/40 border-emerald-700 text-emerald-200"
                            : "bg-rose-950/40 border-rose-700 text-rose-200"
                        }`}
                      >
                        Votre choix : <strong className="font-bold">Interface {item.chosenOption}</strong>
                      </div>
                      <div className="p-2 rounded border bg-gray-900/80 border-gray-700 text-gray-200">
                        Bonne réponse : <strong className="font-bold text-amber-300">Interface {item.correctOption}</strong>
                      </div>
                    </div>

                    {/* Explication pédagogique */}
                    <div className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-gray-950/80 p-3 rounded border border-gray-800/80">
                      <strong className="text-amber-400 block mb-1 font-bold">
                        💡 EXPLICATION DE LA RÉPONSE :
                      </strong>
                      {item.explanation}
                    </div>
                  </div>
                ))}

                {filteredHistory.length === 0 && (
                  <div className="p-6 text-center text-xs text-gray-400 bg-gray-950/40 rounded border border-gray-800">
                    Aucun cas correspondant à ce filtre.
                  </div>
                )}
              </div>

              {/* Boutons de navigation dupliqués en bas pour éviter de devoir remonter la page */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    resetGame();
                    setGameState("briefing");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="pixel-btn w-full !bg-red-700 hover:!bg-red-600 !text-white !font-sans font-bold"
                >
                  RETOURNER AUX EXPLICATIONS
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/evil/jeux")}
                  className="pixel-btn w-full !font-sans font-bold"
                >
                  CATALOGUE DES JEUX
                </button>
              </div>
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
