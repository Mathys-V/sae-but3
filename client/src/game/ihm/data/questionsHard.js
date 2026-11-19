// client/src/game/ihm/data/questionsHard.js
// 20 Cas d'Audit Ergonomique - Niveau 🔴 EXPERT (Inspiration Can't Unsee : Micro-design, Centrage Optique & Ratios au Pixel)

export const QUESTIONS_HARD = [
  {
    id: "H01",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Micro-design & Centrage Optique",
    title: "Centrage optique du pictogramme de lecture",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi le pictogramme de lecture (triangle) doit-il être décalé de 2 à 3 pixels vers la droite dans son cercle ?",
    explanation: "Le centre de gravité géométrique d'un triangle n'est pas son milieu : pour l'œil humain, un centrage mathématique strict (50%/50%) semble trop à gauche. Une compensation optique vers la droite est indispensable pour équilibrer la forme.",
    correctVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: true,
        title: "Lecteur Multimédia (Audio / Vidéo)",
        caption: "Bouton d'action : Lancer la ressource",
      },
    },
    incorrectVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: false,
        title: "Lecteur Multimédia (Audio / Vidéo)",
        caption: "Bouton d'action : Lancer la ressource",
      },
    },
  },
  {
    id: "H02",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Géométrie & Rayons de Courbure",
    title: "Harmonie des rayons de courbure imbriqués (Nested Border Radius)",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle règle géométrique garantit des angles concentriques et harmonieux entre deux conteneurs arrondis imbriqués ?",
    explanation: "Pour conserver une concentricité fluide sans écrasement d'angle, le rayon intérieur doit respecter la formule R_intérieur = R_extérieur - padding. Conserver le même rayon crée un pincement inesthétique dans les coins.",
    correctVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: true,
      },
    },
    incorrectVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: false,
      },
    },
  },
  {
    id: "H03",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Micro-typographie & Tracking",
    title: "Interlettrage optique sur texte en majuscules",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Comment optimiser la lisibilité d'un badge ou d'un bouton rédigé entièrement en lettres capitales ?",
    explanation: "Les lettres capitales présentent une emprise rectangulaire très dense. Un interlettrage accru (tracking-wider) aère le texte et évite que les lettres ne se touchent ou ne forment un bloc sombre uniforme.",
    correctVariant: {
      type: "optical_tracking",
      data: {
        hasTracking: true,
        badgeText: "MODULE PREMIUM",
      },
    },
    incorrectVariant: {
      type: "optical_tracking",
      data: {
        hasTracking: false,
        badgeText: "MODULE PREMIUM",
      },
    },
  },
  {
    id: "H04",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Rythme Vertical & Lisibilité",
    title: "Hauteur de ligne (Line-height) d'un paragraphe descriptif",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle hauteur de ligne offre le confort de lecture optimal pour un texte pédagogique de plusieurs lignes ?",
    explanation: "Un interligne d'environ 1.5 à 1.6 (leading-relaxed) offre l'espace nécessaire entre les lignes sans que les jambages descendants (p, y, q) ne heurtent les jambages montants (d, h, l).",
    correctVariant: {
      type: "optical_line_height",
      data: {
        isRelaxed: true,
        title: "Consigne d'évaluation SAE",
        text: "L'ergonomie des interfaces numériques exige une lisibilité optimale. Un espacement vertical adapté entre les lignes empêche les jambages de se chevaucher lors de la lecture prolongée de documents pédagogiques.",
      },
    },
    incorrectVariant: {
      type: "optical_line_height",
      data: {
        isRelaxed: false,
        title: "Consigne d'évaluation SAE",
        text: "L'ergonomie des interfaces numériques exige une lisibilité optimale. Un espacement vertical adapté entre les lignes empêche les jambages de se chevaucher lors de la lecture prolongée de documents pédagogiques.",
      },
    },
  },
  {
    id: "H05",
    difficulty: "hard",
    category: "accessibility",
    categoryLabel: "Accessibilité WCAG AA",
    title: "Seuil de contraste subtil sur texte secondaire",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel texte secondaire d'horodatage respecte le seuil strict de 4.5:1 exigé par le standard WCAG 2.1 AA sur fond sombre ?",
    explanation: "La norme WCAG AA impose un contraste d'au moins 4.5:1 pour le corps de texte standard. Une teinte trop sombre (ratio 3.1:1) échoue au critère d'accessibilité même si elle semble tolérable au premier coup d'œil.",
    correctVariant: {
      type: "subtle_contrast",
      data: {
        isCompliant: true,
        cardTitle: "Statut de soumission du dépôt Git",
      },
    },
    incorrectVariant: {
      type: "subtle_contrast",
      data: {
        isCompliant: false,
        cardTitle: "Statut de soumission du dépôt Git",
      },
    },
  },
  {
    id: "H06",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Lois de Gestalt & Proximité",
    title: "Loi de proximité appliquée aux titres de section",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Selon la loi de proximité de Gestalt, comment espacer un titre intermédiaire par rapport aux paragraphes qui l'entourent ?",
    explanation: "Un titre doit toujours être plus proche du contenu qu'il introduit (marge inférieure réduite) que de la section précédente (marge supérieure plus grande). Un espacement équidistant crée une ambiguïté cognitive.",
    correctVariant: {
      type: "gestalt_proximity",
      data: {
        isGrouped: true,
      },
    },
    incorrectVariant: {
      type: "gestalt_proximity",
      data: {
        isGrouped: false,
      },
    },
  },
  {
    id: "H07",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Alignement Typographique",
    title: "Alignement vertical d'une case à cocher sur texte multiligne",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Où positionner la case à cocher lorsque le texte d'acceptation du règlement s'étend sur 3 lignes ?",
    explanation: "La case à cocher doit être calée en haut (items-start), alignée sur la première ligne de texte. Un centrage vertical automatique (items-center) la fait flotter au milieu du paragraphe.",
    correctVariant: {
      type: "checkbox_multiline",
      data: {
        isTopAligned: true,
        label: "J'atteste avoir pris connaissance du règlement des examens et m'engage à respecter les consignes de confidentialité et de propriété intellectuelle.",
      },
    },
    incorrectVariant: {
      type: "checkbox_multiline",
      data: {
        isTopAligned: false,
        label: "J'atteste avoir pris connaissance du règlement des examens et m'engage à respecter les consignes de confidentialité et de propriété intellectuelle.",
      },
    },
  },
  {
    id: "H08",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Lumière & Élévation",
    title: "Élévation et réalisme d'une ombre portée (Box-shadow)",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle technique d'ombre portée restitue fidèlement l'impression de profondeur d'une fenêtre de confirmation flottante ?",
    explanation: "Dans le monde physique, la lumière diffuse produit des ombres douces et nuancées. Une ombre multicouche diffuse avec lumière zénithale offre une élévation bien plus réaliste qu'une ombre plate découpée.",
    correctVariant: {
      type: "elevation_shadow",
      data: {
        isDiffuse: true,
      },
    },
    incorrectVariant: {
      type: "elevation_shadow",
      data: {
        isDiffuse: false,
      },
    },
  },
  {
    id: "H09",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Micro-design & Centrage Optique",
    title: "Centrage optique d'une icône Flèche dans un bouton d'action",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi une flèche d'action orientée vers la droite nécessite-t-elle un léger décalage optique ?",
    explanation: "La pointe de la flèche ayant moins de masse visuelle que sa tige, la flèche semble visuellement trop à gauche lorsqu'elle est positionnée au centre géométrique strict du bouton.",
    correctVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: true,
        title: "Bouton d'avancement de séquence",
        caption: "Bouton d'action : Étape suivante",
      },
    },
    incorrectVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: false,
        title: "Bouton d'avancement de séquence",
        caption: "Bouton d'action : Étape suivante",
      },
    },
  },
  {
    id: "H10",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Géométrie & Rayons de Courbure",
    title: "Rayons de courbure proportionnels sur conteneur de carte",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle interface évite le pincement anguleux des bordures imbriquées ?",
    explanation: "Lorsque deux rectangles arrondis sont séparés par une marge intérieure (padding), leurs rayons doivent différer de la valeur de ce padding pour préserver la courbure parallèle.",
    correctVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: true,
      },
    },
    incorrectVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: false,
      },
    },
  },
  {
    id: "H11",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Micro-typographie & Tracking",
    title: "Espacement des caractères sur badge de statut",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle typographie évite l'agglutinement visuel des lettres majuscules sur un badge compact ?",
    explanation: "Sur des petits corps de texte en capitales (10-11px), les lettres ont tendance à se fondre. Un léger espacement optique garantit la distinction nette de chaque glyphe.",
    correctVariant: {
      type: "optical_tracking",
      data: {
        hasTracking: true,
        badgeText: "STATUT VALIDÉ",
      },
    },
    incorrectVariant: {
      type: "optical_tracking",
      data: {
        hasTracking: false,
        badgeText: "STATUT VALIDÉ",
      },
    },
  },
  {
    id: "H12",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Rythme Vertical & Lisibilité",
    title: "Interligne d'une consigne de projet web",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi une hauteur de ligne compacte (leading-none) fatigue-t-elle l'œil sur un paragraphe descriptif ?",
    explanation: "Sans espacement vertical suffisant, l'œil de l'utilisateur a des difficultés à revenir au début de la ligne suivante sans sauter involontairement de paragraphe.",
    correctVariant: {
      type: "optical_line_height",
      data: {
        isRelaxed: true,
        title: "Énoncé du TP Noté",
        text: "Le développement d'un jeu sérieux pour la pédagogie universitaire demande d'accorder une importance cruciale à la charge cognitive et à l'ergonomie visuelle des étudiants auditeurs.",
      },
    },
    incorrectVariant: {
      type: "optical_line_height",
      data: {
        isRelaxed: false,
        title: "Énoncé du TP Noté",
        text: "Le développement d'un jeu sérieux pour la pédagogie universitaire demande d'accorder une importance cruciale à la charge cognitive et à l'ergonomie visuelle des étudiants auditeurs.",
      },
    },
  },
  {
    id: "H13",
    difficulty: "hard",
    category: "accessibility",
    categoryLabel: "Accessibilité WCAG 2.4.11",
    title: "Contraste 3:1 de l'anneau de focus sur fond sombre",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel indicateur de focus clavier respecte l'exigence de contraste minimal de 3:1 avec l'arrière-plan ?",
    explanation: "L'indicateur de focus clavier doit lui-même contraster nettement avec le fond environnant. Un anneau bleu ciel ou ambre éclatant avec offset permet une détection immédiate au clavier.",
    correctVariant: {
      type: "focus_state",
      data: {
        hasVisibleFocus: true,
        label: "Identifiant étudiant universitaire",
      },
    },
    incorrectVariant: {
      type: "focus_state",
      data: {
        hasVisibleFocus: false,
        label: "Identifiant étudiant universitaire",
      },
    },
  },
  {
    id: "H14",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Alignement Numérique & Données",
    title: "Alignement décimal des données monétaires",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi les montants et devises doivent-ils être alignés à droite dans un tableau ?",
    explanation: "L'alignement à droite permet d'aligner verticalement les unités, les dizaines et les décimales, ce qui permet à l'œil d'estimer instantanément l'ordre de grandeur d'une valeur sans avoir à lire tous les chiffres.",
    correctVariant: {
      type: "numeric_alignment",
      data: {
        alignRight: true,
        items: [
          { label: "Cotisation BDE & Services", cost: "45,00 €" },
          { label: "Fournitures pédagogiques", cost: "128,50 €" },
          { label: "Caution matériel vidéo", cost: "350,00 €" },
        ],
      },
    },
    incorrectVariant: {
      type: "numeric_alignment",
      data: {
        alignRight: false,
        items: [
          { label: "Cotisation BDE & Services", cost: "45,00 €" },
          { label: "Fournitures pédagogiques", cost: "128,50 €" },
          { label: "Caution matériel vidéo", cost: "350,00 €" },
        ],
      },
    },
  },
  {
    id: "H15",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Lois de Gestalt & Proximité",
    title: "Proximité du message explicatif avec sa section",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle disposition relie sans ambiguïté le titre à son texte explicatif ?",
    explanation: "En réduisant l'espacement sous le titre et en augmentant l'espacement au-dessus, on applique le principe de proximité qui regroupe cognitivement les éléments liés.",
    correctVariant: {
      type: "gestalt_proximity",
      data: {
        isGrouped: true,
      },
    },
    incorrectVariant: {
      type: "gestalt_proximity",
      data: {
        isGrouped: false,
      },
    },
  },
  {
    id: "H16",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Alignement Typographique",
    title: "Positionnement de la case à cocher sur charte informatique",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi une case à cocher ne doit-elle jamais être centrée verticalement sur un texte long ?",
    explanation: "Centrer la case la positionne en face du milieu du texte, loin du point de départ de lecture (le coin supérieur gauche), ce qui perturbe le balayage visuel.",
    correctVariant: {
      type: "checkbox_multiline",
      data: {
        isTopAligned: true,
        label: "J'accepte les conditions d'utilisation des postes informatiques du département MMI et le respect des règles de sécurité réseau.",
      },
    },
    incorrectVariant: {
      type: "checkbox_multiline",
      data: {
        isTopAligned: false,
        label: "J'accepte les conditions d'utilisation des postes informatiques du département MMI et le respect des règles de sécurité réseau.",
      },
    },
  },
  {
    id: "H17",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Lumière & Élévation",
    title: "Ombre portée douce et lumière zénithale sur modale",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel rendu d'ombre confère la meilleure impression d'objet flottant au-dessus du plan de l'écran ?",
    explanation: "Une ombre diffuse avec une dégradation progressive et une fine bordure claire supérieure reproduit l'éclairage zénithal naturel, favorisant une séparation visuelle agréable.",
    correctVariant: {
      type: "elevation_shadow",
      data: {
        isDiffuse: true,
      },
    },
    incorrectVariant: {
      type: "elevation_shadow",
      data: {
        isDiffuse: false,
      },
    },
  },
  {
    id: "H18",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Micro-design & Centrage Optique",
    title: "Centrage optique du chiffre 1 dans une pastille circulaire",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Pourquoi le chiffre 1 requiert-il un ajustement optique dans une pastille de notification ronde ?",
    explanation: "Le glyphe du chiffre 1 possède un empattement asymétrique à gauche et une hampe verticale droite. Un centrage mécanique le fait paraître décalé vers la gauche.",
    correctVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: true,
        title: "Badge d'alerte non lue",
        caption: "Notification prioritaire",
      },
    },
    incorrectVariant: {
      type: "optical_centering",
      data: {
        opticallyCentered: false,
        title: "Badge d'alerte non lue",
        caption: "Notification prioritaire",
      },
    },
  },
  {
    id: "H19",
    difficulty: "hard",
    category: "ergonomics",
    categoryLabel: "Géométrie & Rayons de Courbure",
    title: "Rayon de courbure des cartes enfants dans un panneau de cours",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Comment éviter que l'arrondi intérieur ne paraisse trop 'pointu' ou trop 'écrasé' par rapport au cadre extérieur ?",
    explanation: "En soustrayant le padding au rayon externe, les arcs de cercle restent parallèles, garantissant un espacement constant et harmonieux tout le long du coin.",
    correctVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: true,
      },
    },
    incorrectVariant: {
      type: "nested_border_radius",
      data: {
        proportionalRadius: false,
      },
    },
  },
  {
    id: "H20",
    difficulty: "hard",
    category: "accessibility",
    categoryLabel: "Accessibilité WCAG AA",
    title: "Contraste de texte de métadonnée sur fond sombre",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle valeur de gris pour un sous-titre de carte garantit la conformité avec le ratio de contraste AA (4.5:1) ?",
    explanation: "Le gris #94a3b8 (slate-400) assure un ratio de 4.6:1 sur fond sombre, tandis que #64748b (slate-500) tombe à 3.2:1 et exclut les personnes malvoyantes.",
    correctVariant: {
      type: "subtle_contrast",
      data: {
        isCompliant: true,
        cardTitle: "Date limite de rendu de la SAE",
      },
    },
    incorrectVariant: {
      type: "subtle_contrast",
      data: {
        isCompliant: false,
        cardTitle: "Date limite de rendu de la SAE",
      },
    },
  },
];
