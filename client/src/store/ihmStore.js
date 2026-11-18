// client/src/store/ihmStore.js
import { create } from "zustand";
import { IHM_QUESTIONS } from "../data/ihmQuestions";

const ROUND_TIME_LIMIT_MS = 15000; // 15 secondes par round en solo
const BASE_POINTS = 100;
const STREAK_BONUS = 25;
const MAX_SPEED_BONUS = 50;

export const useIhmStore = create((set, get) => ({
  questions: IHM_QUESTIONS,
  currentRoundIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  history: [],
  selectedOption: null, // "A" | "B" | null
  roundFeedback: null, // { isCorrect: boolean, pointsEarned: number, timeBonus: number } | null
  isGameOver: false,
  coinsEarned: 0,
  viewportMode: "desktop", // "mobile" | "tablet" | "desktop"

  setViewportMode: (mode) => set({ viewportMode: mode }),

  startSoloGame: () => {
    // Mélange optionnel des questions ou utilisation ordonnée
    set({
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
        isCorrect,
        pointsEarned,
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
      // Gain de pièces : 1 Coin par 30 points
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
