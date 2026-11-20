// client/src/game/ihm/data/questionsHard.js
// 20 Cas d'Audit Ergonomique - Niveau 🔴 EXPERT (Can't Unsee : micro-design, ratios, rythme)
// H01-H08 conservent le rendu historique ; H09-H20 utilisent des scènes dédiées.

import { makeQuestion, makeSceneQuestion } from "./questionFactory.js";

const sq = makeSceneQuestion;

export const QUESTIONS_HARD = [
  makeQuestion({
    id: "H01", difficulty: "hard", category: "ergonomics", categoryLabel: "Micro-design & Centrage Optique",
    title: "Centrage optique du pictogramme de lecture", targetViewport: "desktop",
    instruction: "Pourquoi le pictogramme de lecture (triangle) doit-il être décalé de 2 à 3 pixels vers la droite dans son cercle ?",
    explanation: "Le centre de gravité géométrique d'un triangle n'est pas son milieu : pour l'œil humain, un centrage mathématique strict (50%/50%) semble trop à gauche. Une compensation optique vers la droite est indispensable pour équilibrer la forme.",
    type: "optical_centering", key: "opticallyCentered",
    data: {
      title: "Lecteur Multimédia (Audio / Vidéo)",
      caption: "Bouton d'action : Lancer la ressource",
    },
  }),
  makeQuestion({
    id: "H02", difficulty: "hard", category: "ergonomics", categoryLabel: "Géométrie & Rayons de Courbure",
    title: "Harmonie des rayons de courbure imbriqués (Nested Border Radius)", targetViewport: "desktop",
    instruction: "Quelle règle géométrique garantit des angles concentriques et harmonieux entre deux conteneurs arrondis imbriqués ?",
    explanation: "Pour conserver une concentricité fluide sans écrasement d'angle, le rayon intérieur doit respecter la formule R_intérieur = R_extérieur - padding. Conserver le même rayon crée un pincement inesthétique dans les coins.",
    type: "nested_border_radius", key: "proportionalRadius",
  }),
  makeQuestion({
    id: "H03", difficulty: "hard", category: "ergonomics", categoryLabel: "Micro-typographie & Tracking",
    title: "Interlettrage optique sur texte en majuscules", targetViewport: "desktop",
    instruction: "Comment optimiser la lisibilité d'un badge ou d'un bouton rédigé entièrement en lettres capitales ?",
    explanation: "Les lettres capitales présentent une emprise rectangulaire très dense. Un interlettrage accru (tracking-wider) aère le texte et évite que les lettres ne se touchent ou ne forment un bloc sombre uniforme.",
    type: "optical_tracking", key: "hasTracking",
    data: { badgeText: "MODULE PREMIUM" },
  }),
  makeQuestion({
    id: "H04", difficulty: "hard", category: "ergonomics", categoryLabel: "Rythme Vertical & Lisibilité",
    title: "Hauteur de ligne (Line-height) d'un paragraphe descriptif", targetViewport: "desktop",
    instruction: "Quelle hauteur de ligne offre le confort de lecture optimal pour un texte pédagogique de plusieurs lignes ?",
    explanation: "Un interligne d'environ 1.5 à 1.6 (leading-relaxed) offre l'espace nécessaire entre les lignes sans que les jambages descendants (p, y, q) ne heurtent les jambages montants (d, h, l).",
    type: "optical_line_height", key: "isRelaxed",
    data: {
      title: "Consigne d'évaluation SAE",
      text: "L'ergonomie des interfaces numériques exige une lisibilité optimale. Un espacement vertical adapté entre les lignes empêche les jambages de se chevaucher lors de la lecture prolongée de documents pédagogiques.",
    },
  }),
  makeQuestion({
    id: "H05", difficulty: "hard", category: "accessibility", categoryLabel: "Accessibilité WCAG AA",
    title: "Seuil de contraste subtil sur texte secondaire", targetViewport: "desktop",
    instruction: "Quel texte secondaire d'horodatage respecte le seuil strict de 4.5:1 exigé par le standard WCAG 2.1 AA sur fond sombre ?",
    explanation: "La norme WCAG AA impose un contraste d'au moins 4.5:1 pour le corps de texte standard. Une teinte trop sombre (ratio 3.1:1) échoue au critère d'accessibilité même si elle semble tolérable au premier coup d'œil.",
    type: "subtle_contrast", key: "isCompliant",
    data: { cardTitle: "Statut de soumission du dépôt Git" },
  }),
  makeQuestion({
    id: "H06", difficulty: "hard", category: "ergonomics", categoryLabel: "Lois de Gestalt & Proximité",
    title: "Loi de proximité appliquée aux titres de section", targetViewport: "desktop",
    instruction: "Selon la loi de proximité de Gestalt, comment espacer un titre intermédiaire par rapport aux paragraphes qui l'entourent ?",
    explanation: "Un titre doit toujours être plus proche du contenu qu'il introduit (marge inférieure réduite) que de la section précédente (marge supérieure plus grande). Un espacement équidistant crée une ambiguïté cognitive.",
    type: "gestalt_proximity", key: "isGrouped",
  }),
  makeQuestion({
    id: "H07", difficulty: "hard", category: "ergonomics", categoryLabel: "Alignement Typographique",
    title: "Alignement vertical d'une case à cocher sur texte multiligne", targetViewport: "desktop",
    instruction: "Où positionner la case à cocher lorsque le texte d'acceptation du règlement s'étend sur 3 lignes ?",
    explanation: "La case à cocher doit être calée en haut (items-start), alignée sur la première ligne de texte. Un centrage vertical automatique (items-center) la fait flotter au milieu du paragraphe.",
    type: "checkbox_multiline", key: "isTopAligned",
    data: {
      label: "J'atteste avoir pris connaissance du règlement des examens et m'engage à respecter les consignes de confidentialité et de propriété intellectuelle.",
    },
  }),
  makeQuestion({
    id: "H08", difficulty: "hard", category: "ergonomics", categoryLabel: "Lumière & Élévation",
    title: "Élévation et réalisme d'une ombre portée (Box-shadow)", targetViewport: "desktop",
    instruction: "Quelle technique d'ombre portée restitue fidèlement l'impression de profondeur d'une fenêtre de confirmation flottante ?",
    explanation: "Dans le monde physique, la lumière diffuse produit des ombres douces et nuancées. Une ombre multicouche diffuse avec lumière zénithale offre une élévation bien plus réaliste qu'une ombre plate découpée.",
    type: "elevation_shadow", key: "isDiffuse",
  }),

  /* H09 -> H20 : scènes uniques, aucune maquette n'est répétée d'une difficulté à l'autre. */
  sq({
    id: "H09", difficulty: "hard", category: "ergonomics", categoryLabel: "Affordance & Icônes",
    title: "Affordance d'une icône d'action", targetViewport: "desktop",
    instruction: "Quel traitement de l'icône signale qu'elle est interactive ?",
    explanation: "Une icône d'action doit porter un indice d'interactivité (soulignement, pointeur, libellé associé). Une icône nue, sans aucun signe distinctif, passe pour un simple décor.",
    key: "affordance", scene: "iconAffordance",
  }),
  sq({
    id: "H10", difficulty: "hard", category: "ergonomics", categoryLabel: "Échelle Typographique",
    title: "Écart hiérarchique entre titre et sous-titre", targetViewport: "desktop",
    instruction: "Quel rapport de taille crée une hiérarchie typographique lisible ?",
    explanation: "Un écart net entre le titre et son sous-titre (par exemple 18px contre 11px) rend la hiérarchie immédiate. Des tailles trop proches produisent un effet de 'presque identique' qui fatigue l'œil.",
    key: "scale", scene: "typeScale",
  }),
  sq({
    id: "H11", difficulty: "hard", category: "ergonomics", categoryLabel: "Temps Relatif",
    title: "Horodatage relatif d'une notification", targetViewport: "desktop",
    instruction: "Quelle forme de date rend l'actualité d'une notification immédiate ?",
    explanation: "Un temps relatif ('il y a 5 min') est compris instantanément. Une date absolue oblige à faire un calcul mental pour savoir si l'information est récente.",
    key: "relativeTime", scene: "notificationTime",
  }),
  sq({
    id: "H12", difficulty: "hard", category: "accessibility", categoryLabel: "État Lu / Non Lu",
    title: "Différenciation d'un message non lu", targetViewport: "desktop",
    instruction: "Quel traitement distingue un message non lu d'un message déjà consulté ?",
    explanation: "Le gras associé à une couleur suffisante signale l'état non lu. Une simple teinte grisée trop proche du fond rend la distinction imperceptible.",
    key: "readState", scene: "notificationRead",
  }),
  sq({
    id: "H13", difficulty: "hard", category: "accessibility", categoryLabel: "Contraste de l'Anneau de Focus",
    title: "Contraste 3:1 de l'anneau de focus sur fond sombre", targetViewport: "desktop",
    instruction: "Quel indicateur de focus clavier respecte l'exigence de contraste minimal de 3:1 avec l'arrière-plan ?",
    explanation: "L'indicateur de focus clavier doit lui-même contraster nettement avec le fond environnant. Un anneau ambre éclatant permet une détection immédiate au clavier, contrairement à un anneau invisible.",
    key: "focusRing", scene: "keyboardVisible",
  }),
  sq({
    id: "H14", difficulty: "hard", category: "ergonomics", categoryLabel: "Alignement Décimal",
    title: "Alignement décimal des données monétaires", targetViewport: "desktop",
    instruction: "Quel alignement permet de comparer des montants ayant un nombre de décimales différent ?",
    explanation: "L'alignement décimal (et non seulement le texte à droite) fait coïncider les virgules. Sans chiffres tabulaires ni alignement des décimales, '4,00 €' et '12,50 €' se lisent avec un décalage.",
    key: "decimal", scene: "decimalAlignment",
    data: {
      items: [
        { label: "R3.01", cost: "12,50 €" },
        { label: "R3.02", cost: "4,00 €" },
      ],
    },
  }),
  sq({
    id: "H15", difficulty: "hard", category: "ergonomics", categoryLabel: "Séparateurs & Rhythme",
    title: "Séparateur entre deux sections", targetViewport: "desktop",
    instruction: "Quel séparateur délimite deux sections sans alourdir la page ?",
    explanation: "Un filet de séparation discret mais visible suffit à marquer la frontière entre deux sections. Un trait trop pâle disparaît et laisse les deux blocs fusionner visuellement.",
    key: "divider", scene: "subtleDivider",
  }),
  sq({
    id: "H16", difficulty: "hard", category: "ergonomics", categoryLabel: "Grille de Base",
    title: "Alignement du texte sur la grille de base", targetViewport: "desktop",
    instruction: "Quel interligne aligne le texte sur une grille de base régulière ?",
    explanation: "Un interligne multiple de la grille de base (par exemple 24px) fait tomber chaque ligne sur un repère horizontal. Un interligne approximatif produit un rythme visuel irrégulier.",
    key: "baseline", scene: "baselineGrid",
  }),
  sq({
    id: "H17", difficulty: "hard", category: "ergonomics", categoryLabel: "Mouvement & Easing",
    title: "Courbe d'accélération d'une transition", targetViewport: "desktop",
    instruction: "Quelle courbe d'accélération rend l'ouverture d'un panneau naturelle ?",
    explanation: "Une sortie rapide puis décélération (ease-out) imite le mouvement physique et paraît fluide. Une accélération en fin de mouvement (ease-in) donne une impression de bras mécanique peu naturelle.",
    key: "easing", scene: "motionEasing",
  }),
  sq({
    id: "H18", difficulty: "hard", category: "ergonomics", categoryLabel: "Squelette & Micro-layout",
    title: "Espacement d'un squelette de chargement", targetViewport: "desktop",
    instruction: "Quel squelette respecte le rythme vertical de la future carte ?",
    explanation: "La hauteur et la marge du squelette doivent anticiper le contenu réel pour éviter un saut. Un écart trop faible provoque un décalage visible au moment du rendu.",
    key: "skeleton", scene: "loadingSkeleton",
  }),
  sq({
    id: "H19", difficulty: "hard", category: "ergonomics", categoryLabel: "Rayons Imbriqués (Carte Fille)",
    title: "Rayon de courbure d'une carte imbriquée", targetViewport: "desktop",
    instruction: "Quel rayon intérieur évite le pincement des angles dans une carte imbriquée ?",
    explanation: "Le rayon de la carte fille doit être inférieur à celui du parent, du montant du padding. Un rayon identique crée des coins qui se 'pincent' et trahissent un défaut de finition.",
    key: "radius", scene: "borderRhythm",
  }),
  sq({
    id: "H20", difficulty: "hard", category: "accessibility", categoryLabel: "Seuil de Contraste Subtil",
    title: "Contraste d'une métadonnée sur fond sombre", targetViewport: "desktop",
    instruction: "Quelle teinte de métadonnée atteint le seuil WCAG AA sur fond sombre ?",
    explanation: "Une métadonnée reste du texte : elle doit atteindre 4.5:1. Une teinte 'presque noire' sur fond sombre passe inaperçue et échoue au contraste, même si elle semble volontairement discrète.",
    key: "contrast", scene: "contrastThreshold",
  }),
];
