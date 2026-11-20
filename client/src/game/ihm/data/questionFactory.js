// client/src/game/ihm/data/questionFactory.js
// Fabrique commune : une seule source de données par question, les deux variantes
// sont dérivées automatiquement. Cela supprime la duplication des objets
// correctVariant / incorrectVariant dans les trois banques de questions.

export const VIEWPORTS = {
  mobile: "📱 Mobile 375px",
  tablet: "💻 Tablette 768px",
  desktop: "🖥️ Desktop",
};

/**
 * Construit une question à partir d'une seule description de maquette.
 *
 * @param {object} q
 * @param {string} q.id identifiant unique (E01, M01, H01, ...)
 * @param {"easy"|"medium"|"hard"} q.difficulty
 * @param {string} q.category
 * @param {string} q.categoryLabel
 * @param {string} q.title
 * @param {"mobile"|"tablet"|"desktop"} q.targetViewport
 * @param {string} q.instruction
 * @param {string} q.explanation
 * @param {string} q.type type de rendu (legacy ou "scene")
 * @param {string} q.key nom du champ discriminant (unicité garantie par les tests)
 * @param {*} q.good valeur du discriminant pour la variante conforme
 * @param {*} q.bad valeur du discriminant pour la variante non conforme
 * @param {object} [q.data] données communes aux deux variantes
 * @param {string} [q.scene] nom de scène lorsque type === "scene"
 * @param {object} [q.goodExtra] champs supplémentaires de la variante conforme
 * @param {object} [q.badExtra] champs supplémentaires de la variante piège
 */
export function makeQuestion({
  id,
  difficulty,
  category,
  categoryLabel,
  title,
  targetViewport,
  instruction,
  explanation,
  type,
  key,
  good = true,
  bad = false,
  data = {},
  scene,
  goodExtra = {},
  badExtra = {},
}) {
  const common = scene
    ? { ...data, scene, keyName: key, value: true, ...goodExtra }
    : { ...data, [key]: good, ...goodExtra };

  const wrong = scene
    ? { ...data, scene, keyName: key, value: false, ...badExtra }
    : { ...data, [key]: bad, ...badExtra };

  return {
    id,
    difficulty,
    category,
    categoryLabel,
    title,
    targetViewport,
    viewportLabel: VIEWPORTS[targetViewport] ?? VIEWPORTS.desktop,
    instruction,
    explanation,
    variantKey: key,
    ...(scene ? { scene } : {}),
    correctVariant: { type, data: common },
    incorrectVariant: { type, data: wrong },
  };
}

/**
 * Raccourci pour les questions utilisant le moteur de scènes.
 */
export function makeSceneQuestion(config) {
  return makeQuestion({ ...config, type: "scene" });
}
