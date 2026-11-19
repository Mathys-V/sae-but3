// client/src/game/ihm/store/ihmStore.js
import { create } from "zustand";
import { generateSessionQuestions } from "../data/questionGenerator";

const ROUND_TIME_LIMIT_MS = 15000; // 15 secondes par round en solo
const BASE_POINTS = 100;
const STREAK_BONUS = 25;
const MAX_SPEED_BONUS = 50;

export const useIhmStore = create((set, get) => ({
  questions: generateSessionQuestions(),
  currentRoundIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  history: [],
  selectedOption: null, // "A" | "B" | null
  roundFeedback: null,
  isGameOver: false,
  coinsEarned: 0,
  viewportMode: "desktop",

  setViewportMode: (mode) => set({ viewportMode: mode }),

  startSoloGame: () => {
    // Génération dynamique d'une session progressive (5 faciles, 10 moyennes, 5 difficiles) avec A/B aléatoire
    const freshQuestions = generateSessionQuestions();
    set({
      questions: freshQuestions,
      currentRoundIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      history: [],
      selectedOption: null,
      roundFeedback: null,
      isGameOver: false,
      coinsEarned: 0,
      viewportMode: "desktop",
    });
  },

  submitAnswer: (chosenOption, timeRemainingMs) => {
    const state = get();
    if (state.selectedOption !== null || state.isGameOver) return;

    const currentQuestion = state.questions[state.currentRoundIndex];
    if (!currentQuestion) return;

    const isCorrect = chosenOption === currentQuestion.correctOption;
    let pointsEarned = 0;
    let timeBonus = 0;
    let newStreak = 0;

    if (isCorrect) {
      newStreak = state.streak + 1;
      const speedRatio = Math.max(0, Math.min(1, timeRemainingMs / ROUND_TIME_LIMIT_MS));
      timeBonus = Math.round(speedRatio * MAX_SPEED_BONUS);
      pointsEarned = BASE_POINTS + (newStreak - 1) * STREAK_BONUS + timeBonus;
    }

    const newScore = state.score + pointsEarned;
    const newMaxStreak = Math.max(state.maxStreak, newStreak);

    const feedback = {
      isCorrect,
      chosenOption,
      correctOption: currentQuestion.correctOption,
      pointsEarned,
      timeBonus,
      streak: newStreak,
      explanation: currentQuestion.explanation,
    };

    const newHistory = [
      ...state.history,
      {
        round: state.currentRoundIndex + 1,
        questionId: currentQuestion.id,
        difficulty: currentQuestion.difficulty || "medium",
        title: currentQuestion.title,
        categoryLabel: currentQuestion.categoryLabel,
        targetViewport: currentQuestion.targetViewport,
        viewportLabel: currentQuestion.viewportLabel,
        chosenOption,
        correctOption: currentQuestion.correctOption,
        isCorrect,
        pointsEarned,
        timeBonus,
        explanation: currentQuestion.explanation,
      },
    ];

    set({
      selectedOption: chosenOption,
      roundFeedback: feedback,
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
      history: newHistory,
    });
  },

  nextRound: () => {
    const state = get();
    const nextIndex = state.currentRoundIndex + 1;

    if (nextIndex >= state.questions.length) {
      // Fin de la partie solo (20 manches)
      const coins = Math.max(5, Math.floor(state.score / 30));
      set({
        isGameOver: true,
        coinsEarned: coins,
        selectedOption: null,
        roundFeedback: null,
      });
    } else {
      set({
        currentRoundIndex: nextIndex,
        selectedOption: null,
        roundFeedback: null,
      });
    }
  },

  resetGame: () => {
    get().startSoloGame();
  },
}));
