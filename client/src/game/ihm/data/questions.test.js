// client/src/game/ihm/data/questions.test.js
// Tests de la banque de questions : lancés avec `node --test`.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { QUESTIONS_EASY } from "./questionsEasy.js";
import { QUESTIONS_MEDIUM } from "./questionsMedium.js";
import { QUESTIONS_HARD } from "./questionsHard.js";
import { generateSessionQuestions } from "./questionGenerator.js";

const ALL = [...QUESTIONS_EASY, ...QUESTIONS_MEDIUM, ...QUESTIONS_HARD];

/** Clés réellement consommées par les rendus historiques de IhmCardViewer. */
const LEGACY_RENDERER_KEYS = {
  product_grid: ["fluid"],
  contrast_card: ["highContrast"],
  navbar: ["hasBurger"],
  form_labels: ["visibleLabels"],
  touch_target: ["size"],
  status_alert: ["hasIcon"],
  button_group: ["wrap"],
  required_indicator: ["hasAsterisk"],
  link_semantics: ["explicit"],
  responsive_table: ["scrollable"],
  action_spacing: ["safeDistance"],
  input_types: ["semanticType"],
  focus_state: ["hasOutline"],
  submit_state: ["loadingFeedback"],
  hero_banner: ["responsiveText"],
  alt_text_demo: ["hasAlt"],
  form_error: ["accessible"],
  numeric_alignment: ["alignRight"],
  typography_readability: ["comfortable"],
  card_hierarchy: ["clearHierarchy"],
  optical_centering: ["opticallyCentered"],
  nested_border_radius: ["proportionalRadius"],
  optical_tracking: ["hasTracking"],
  optical_line_height: ["isRelaxed"],
  subtle_contrast: ["isCompliant"],
  gestalt_proximity: ["isGrouped"],
  checkbox_multiline: ["isTopAligned"],
  elevation_shadow: ["isDiffuse"],
};

function signature(q) {
  const visual = q.correctVariant.type === "scene" ? q.scene : q.correctVariant.type;
  return `${visual}::${q.targetViewport}::${q.variantKey}`;
}

test("la banque contient 80 questions réparties 20 / 40 / 20", () => {
  assert.equal(QUESTIONS_EASY.length, 20);
  assert.equal(QUESTIONS_MEDIUM.length, 40);
  assert.equal(QUESTIONS_HARD.length, 20);
  assert.equal(ALL.length, 80);
});

test("les identifiants sont uniques et cohérents avec la difficulté", () => {
  const ids = ALL.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of ALL) {
    const prefix = { easy: "E", medium: "M", hard: "H" }[q.difficulty];
    assert.ok(q.id.startsWith(prefix), `${q.id} ne correspond pas à ${q.difficulty}`);
  }
});

test("chaque question possède un énoncé, une explication et un discriminant effectif", () => {
  for (const q of ALL) {
    assert.ok(q.title && q.instruction && q.explanation, `${q.id} : texte manquant`);
    assert.ok(q.variantKey, `${q.id} : variantKey manquant`);
    const discriminator = q.correctVariant.type === "scene" ? "value" : q.variantKey;
    assert.notDeepEqual(
      q.correctVariant.data[discriminator],
      q.incorrectVariant.data[discriminator],
      `${q.id} : les deux variantes sont identiques`
    );
    assert.equal(q.correctVariant.type, q.incorrectVariant.type);
    if (q.correctVariant.type === "scene") {
      assert.ok(q.scene, `${q.id} : scène manquante`);
      assert.equal(q.correctVariant.data.keyName, q.variantKey);
      assert.equal(q.correctVariant.data.value, true);
      assert.equal(q.incorrectVariant.data.value, false);
    }
  }
});

test("aucune question ne partage le même mécanisme visuel (type/scène + viewport + flag)", () => {
  const seen = new Map();
  for (const q of ALL) {
    const sig = signature(q);
    assert.ok(!seen.has(sig), `Doublon visuel : ${q.id} et ${seen.get(sig)} (${sig})`);
    seen.set(sig, q.id);
  }
});

test("aucune paire de questions n'a des payloads strictement identiques", () => {
  for (let i = 0; i < ALL.length; i++) {
    for (let j = i + 1; j < ALL.length; j++) {
      const a = ALL[i];
      const b = ALL[j];
      const identical =
        JSON.stringify(a.correctVariant) === JSON.stringify(b.correctVariant) &&
        JSON.stringify(a.incorrectVariant) === JSON.stringify(b.incorrectVariant);
      assert.ok(!identical, `Payloads identiques : ${a.id} et ${b.id}`);
    }
  }
});

test("les énoncés sont tous différents", () => {
  const instructions = ALL.map((q) => q.instruction);
  assert.equal(new Set(instructions).size, instructions.length);
});

test("chaque scène utilisée existe dans le registre des rendus", () => {
  const source = readFileSync(new URL("../components/IhmScenes.jsx", import.meta.url), "utf8");
  const declared = new Set([...source.matchAll(/^ {2}([A-Za-z]\w*): \(d\) =>/gm)].map((m) => m[1]));
  for (const q of ALL.filter((q) => q.correctVariant.type === "scene")) {
    assert.ok(declared.has(q.scene), `${q.id} : scène "${q.scene}" absente du registre`);
  }
});

test("les flags des questions historiques sont lus par leur rendu", () => {
  for (const q of ALL.filter((q) => q.correctVariant.type !== "scene")) {
    const keys = LEGACY_RENDERER_KEYS[q.correctVariant.type];
    assert.ok(keys, `${q.id} : rendu inconnu "${q.correctVariant.type}"`);
    assert.ok(keys.includes(q.variantKey), `${q.id} : flag "${q.variantKey}" ignoré par ${q.correctVariant.type}`);
  }
});

test("une session tire 5 questions faciles, 10 moyennes et 5 difficiles sans répétition", () => {
  const session = generateSessionQuestions();
  assert.equal(session.length, 20);
  assert.equal(session.filter((q) => q.difficulty === "easy").length, 5);
  assert.equal(session.filter((q) => q.difficulty === "medium").length, 10);
  assert.equal(session.filter((q) => q.difficulty === "hard").length, 5);
  assert.equal(new Set(session.map((q) => q.sourceId)).size, 20);
  for (const q of session) {
    assert.ok(["A", "B"].includes(q.correctOption));
    assert.equal(q.variantA.isCorrect, q.correctOption === "A");
    assert.equal(q.variantB.isCorrect, q.correctOption === "B");
  }
});

test("prepareQuestion randomise le camp de la bonne réponse", () => {
  const original = Math.random;
  try {
    Math.random = () => 0.1;
    const first = generateSessionQuestions()[0];
    assert.equal(first.correctOption, "A");
    Math.random = () => 0.9;
    const second = generateSessionQuestions()[0];
    assert.equal(second.correctOption, "B");
  } finally {
    Math.random = original;
  }
});
