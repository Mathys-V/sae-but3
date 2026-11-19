// client/src/game/ihm/data/questionGenerator.js
import { QUESTIONS_EASY } from "./questionsEasy";
import { QUESTIONS_MEDIUM } from "./questionsMedium";
import { QUESTIONS_HARD } from "./questionsHard";

/**
 * Algorithme de tirage aléatoire sans remise (Fisher-Yates shuffle)
 */
function sampleWithoutReplacement(array, count) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone.slice(0, count);
}

/**
 * Prépare une question en randomisant la position de la bonne réponse (A ou B)
 * pour empêcher toute mémorisation par cœur.
 */
function prepareQuestion(rawQ, displayIndex) {
  // 50% de chance d'attribuer la bonne réponse à l'interface A ou B
  const isATheWinner = Math.random() < 0.5;
  const correctOption = isATheWinner ? "A" : "B";

  const variantA = isATheWinner
    ? { ...rawQ.correctVariant, isCorrect: true }
    : { ...rawQ.incorrectVariant, isCorrect: false };

  const variantB = isATheWinner
    ? { ...rawQ.incorrectVariant, isCorrect: false }
    : { ...rawQ.correctVariant, isCorrect: true };

  return {
    id: displayIndex + 1,
    sourceId: rawQ.id,
    difficulty: rawQ.difficulty,
    category: rawQ.category,
    categoryLabel: rawQ.categoryLabel,
    title: rawQ.title,
    targetViewport: rawQ.targetViewport,
    viewportLabel: rawQ.viewportLabel,
    instruction: rawQ.instruction,
    correctOption,
    explanation: rawQ.explanation,
    variantA,
    variantB,
  };
}

/**
 * Génère une session de jeu progressive de 20 manches :
 * - 5 manches FACILES (tirées au sort parmi 20)
 * - 10 manches MOYENNES (tirées au sort parmi 40)
 * - 5 manches DIFFICILES (tirées au sort parmi 20)
 */
export function generateSessionQuestions({
  easyCount = 5,
  mediumCount = 10,
  hardCount = 5,
} = {}) {
  const selectedEasy = sampleWithoutReplacement(QUESTIONS_EASY, easyCount);
  const selectedMedium = sampleWithoutReplacement(QUESTIONS_MEDIUM, mediumCount);
  const selectedHard = sampleWithoutReplacement(QUESTIONS_HARD, hardCount);

  const rawSession = [...selectedEasy, ...selectedMedium, ...selectedHard];

  return rawSession.map((q, idx) => prepareQuestion(q, idx));
}

// Exportation globale pour compatibilité et tests
export const ALL_QUESTIONS_POOL = [
  ...QUESTIONS_EASY,
  ...QUESTIONS_MEDIUM,
  ...QUESTIONS_HARD,
];
