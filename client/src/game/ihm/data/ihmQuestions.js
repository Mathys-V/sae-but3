// client/src/data/ihmQuestions.js
// Banque de questions pour le mini-jeu "Duel d'IHM" (BUT 2 - Semestre 3 : Développement Web)

export const IHM_QUESTIONS = [
  // =========================================================================
  // 1. RESPONSIVE DESIGN & RUPTURES DE LAYOUT (CSS Grid, Flexbox, Breakpoints)
  // =========================================================================
  {
    id: 1,
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Grille de cartes produits sur smartphone",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quelle intégration permet un affichage propre sans débordement sur écran mobile (375px) ?",
    correctOption: "A",
    explanation:
      "L'option A utilise une grille fluide 'grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))' avec un espacement adaptatif. L'option B utilise une largeur fixe rigide (width: 320px par carte sans retour à la ligne) qui provoque un débordement horizontal indésirable.",
    variantA: {
      type: "product_grid",
      isCorrect: true,
      data: {
        fluid: true,
        items: [
          { name: "Grimoire Ancien", price: "24 €", stock: "En stock", tag: "Populaire" },
          { name: "Potion de Soin", price: "12 €", stock: "Stock limité", tag: "Promo" },
          { name: "Dague Runique", price: "45 €", stock: "En stock", tag: "Nouveau" },
        ],
      },
    },
    variantB: {
      type: "product_grid",
      isCorrect: false,
      data: {
        fluid: false,
        items: [
          { name: "Grimoire Ancien", price: "24 €", stock: "En stock", tag: "Populaire" },
          { name: "Potion de Soin", price: "12 €", stock: "Stock limité", tag: "Promo" },
          { name: "Dague Runique", price: "45 €", stock: "En stock", tag: "Nouveau" },
        ],
      },
    },
  },
  {
    id: 2,
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Barre de navigation principale",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quelle barre de navigation gère convenablement la réduction de largeur d'écran ?",
    correctOption: "B",
    explanation:
      "L'option B passe en menu hamburger avec tiroir latéral dès que la largeur passe sous le breakpoint mobile. L'option A conserve une ligne horizontale avec 'overflow: hidden' qui tronque silencieusement les derniers liens de navigation.",
    variantA: {
      type: "navbar",
      isCorrect: false,
      data: {
        hasBurger: false,
        links: ["Accueil", "Cours S3", "TPs & Projets", "Ressources", "Examens", "Contact"],
      },
    },
    variantB: {
      type: "navbar",
      isCorrect: true,
      data: {
        hasBurger: true,
        links: ["Accueil", "Cours S3", "TPs & Projets", "Ressources", "Examens", "Contact"],
      },
    },
  },
  {
    id: 3,
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Boutons d'action sur carte profil",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quel conteneur d'actions s'adapte sans casser la mise en page sur petit écran ?",
    correctOption: "A",
    explanation:
      "L'option A applique 'flex-wrap: wrap' avec 'gap: 0.5rem', permettant aux boutons de s'empiler naturellement. L'option B utilise 'nowrap' avec des largeurs incompressibles qui écrasent le texte des boutons.",
    variantA: {
      type: "button_group",
      isCorrect: true,
      data: {
        wrap: true,
        buttons: ["Modifier le profil", "Télécharger le bulletin", "Voir les notes"],
      },
    },
    variantB: {
      type: "button_group",
      isCorrect: false,
      data: {
        wrap: false,
        buttons: ["Modifier le profil", "Télécharger le bulletin", "Voir les notes"],
      },
    },
  },
  {
    id: 4,
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Tableau de notes et évaluations",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quel tableau d'évaluation reste consultable sans détruire le conteneur sur mobile ?",
    correctOption: "A",
    explanation:
      "L'option A enveloppe le tableau dans un conteneur avec défilement horizontal fluide ('overflow-x: auto') et en-tête lisible. L'option B n'a pas de défilement, ce qui comprime les colonnes au point de superposer les caractères.",
    variantA: {
      type: "responsive_table",
      isCorrect: true,
      data: {
        scrollable: true,
        headers: ["Module", "Épreuve", "Coeff", "Note", "Mention"],
        rows: [
          ["R3.01 Dév Web", "Contrôle TP", "3", "16.5 / 20", "Très Bien"],
          ["R3.02 Base Données", "Projet SQL", "4", "14.0 / 20", "Bien"],
        ],
      },
    },
    variantB: {
      type: "responsive_table",
      isCorrect: false,
      data: {
        scrollable: false,
        headers: ["Module", "Épreuve", "Coeff", "Note", "Mention"],
        rows: [
          ["R3.01 Dév Web", "Contrôle TP", "3", "16.5 / 20", "Très Bien"],
          ["R3.02 Base Données", "Projet SQL", "4", "14.0 / 20", "Bien"],
        ],
      },
    },
  },
  {
    id: 5,
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Bannière d'en-tête (Hero section)",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quelle bannière hiérarchise correctement le titre et l'image d'illustration sur mobile ?",
    correctOption: "B",
    explanation:
      "L'option B réorganise la disposition en colonne verticale ('flex-col') sur mobile avec une image redimensionnée proportionnellement. L'option A garde 2 colonnes rigides 50/50 où l'image compresse le texte en une colonne de 3 caractères de large.",
    variantA: {
      type: "hero_banner",
      isCorrect: false,
      data: {
        stackOnMobile: false,
        title: "Plateforme BUT Informatique S3",
        subtitle: "Accédez à tous vos modules et travaux pratiques en un seul clic.",
      },
    },
    variantB: {
      type: "hero_banner",
      isCorrect: true,
      data: {
        stackOnMobile: true,
        title: "Plateforme BUT Informatique S3",
        subtitle: "Accédez à tous vos modules et travaux pratiques en un seul clic.",
      },
    },
  },

  // =========================================================================
  // 2. ACCESSIBILITÉ NUMÉRIQUE & WCAG (Normes, Contrastes, Focus)
  // =========================================================================
  {
    id: 6,
    category: "accessibility",
    categoryLabel: "Accessibilité & WCAG",
    title: "Contraste du texte sur fond clair",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quelle carte respecte le ratio de contraste minimal WCAG AA (4.5:1 pour le texte courant) ?",
    correctOption: "A",
    explanation:
      "L'option A utilise un texte gris foncé (#1f2937) sur fond clair (#ffffff) offrant un ratio de contraste supérieur à 12:1. L'option B utilise un gris trop clair (#9ca3af) avec un ratio inférieur à 2.6:1, ce qui la rend illisible pour les personnes malvoyantes ou en plein soleil.",
    variantA: {
      type: "contrast_card",
      isCorrect: true,
      data: {
        textColor: "text-gray-900",
        descColor: "text-gray-700",
        ratioLabel: "Ratio : 12.6:1 (Conforme WCAG AAA)",
      },
    },
    variantB: {
      type: "contrast_card",
      isCorrect: false,
      data: {
        textColor: "text-gray-400",
        descColor: "text-gray-300",
        ratioLabel: "Ratio : 2.5:1 (Échec WCAG)",
      },
    },
  },
  {
    id: 7,
    category: "accessibility",
    categoryLabel: "Accessibilité & WCAG",
    title: "Indicateur d'état et focus au clavier",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quel bouton signale convenablement la sélection active pour les utilisateurs naviguant au clavier ?",
    correctOption: "B",
    explanation:
      "L'option B propose un anneau de focus bien contrasté ('ring-2 ring-blue-500 ring-offset-2'). L'option A supprime tout contour ('outline: none') sans alternative visuelle, laissant l'utilisateur au clavier dans l'incapacité de savoir où il se trouve.",
    variantA: {
      type: "focus_state",
      isCorrect: false,
      data: {
        hasFocusRing: false,
        label: "Confirmer l'inscription",
      },
    },
    variantB: {
      type: "focus_state",
      isCorrect: true,
      data: {
        hasFocusRing: true,
        label: "Confirmer l'inscription",
      },
    },
  },
  {
    id: 8,
    category: "accessibility",
    categoryLabel: "Accessibilité & WCAG",
    title: "Alerte de statut (Accessible aux daltoniens)",
    targetViewport: "tablet",
    viewportLabel: "💻 Vue Tablette (768 px)",
    instruction: "Quelle bannière de notification transmet l'information sans reposer uniquement sur la couleur ?",
    correctOption: "A",
    explanation:
      "L'option A combine une couleur verte, une icône explicite (coche) et un préfixe textuel 'Succès :'. L'option B n'utilise qu'un fond vert sans icône ni libellé de statut, ce qui est inaccessible pour les utilisateurs atteints de daltonisme (deutéranopie/protanopie).",
    variantA: {
      type: "status_alert",
      isCorrect: true,
      data: {
        withIcon: true,
        withPrefix: true,
        message: "Votre devoir R3.01 a été téléversé avec succès.",
      },
    },
    variantB: {
      type: "status_alert",
      isCorrect: false,
      data: {
        withIcon: false,
        withPrefix: false,
        message: "Votre devoir R3.01 a été téléversé avec succès.",
      },
    },
  },
  {
    id: 9,
    category: "accessibility",
    categoryLabel: "Accessibilité & WCAG",
    title: "Image informative et texte alternatif",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quelle fiche descriptive fournit une alternative textuelle accessible aux lecteurs d'écran ?",
    correctOption: "B",
    explanation:
      "L'option B possède un attribut 'alt=\"Diagramme des cas d utilisation du projet R3.01\"' clair et descriptif. L'option A utilise 'alt=\"image\"' ou 'alt=\"photo.png\"', ce qui n'apporte aucune valeur sémantique aux synthèses vocales.",
    variantA: {
      type: "alt_text_demo",
      isCorrect: false,
      data: {
        altText: "image_123.jpg",
        caption: "Figure 1 : Schéma d'architecture applicative",
      },
    },
    variantB: {
      type: "alt_text_demo",
      isCorrect: true,
      data: {
        altText: "Schéma d'architecture du serveur FastAPI et client React",
        caption: "Figure 1 : Schéma d'architecture applicative",
      },
    },
  },
  {
    id: 10,
    category: "accessibility",
    categoryLabel: "Accessibilité & WCAG",
    title: "Liens d'action et libellés explicites",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quel bloc de ressources propose des liens compréhensibles hors contexte ?",
    correctOption: "A",
    explanation:
      "L'option A explicite l'action : 'Télécharger le sujet du TP 3 (PDF, 420 Ko)'. L'option B répète de simples 'Cliquez ici', obligeant l'utilisateur de lecteur d'écran à deviner la destination de chaque lien.",
    variantA: {
      type: "link_semantics",
      isCorrect: true,
      data: {
        explicit: true,
        links: [
          "Consulter la documentation CSS Grid (MDN)",
          "Télécharger le corrigé du TP 2 (ZIP, 1.2 Mo)",
        ],
      },
    },
    variantB: {
      type: "link_semantics",
      isCorrect: false,
      data: {
        explicit: false,
        links: ["Pour voir la doc, cliquez ici", "Pour le corrigé, cliquez ici"],
      },
    },
  },

  // =========================================================================
  // 3. FORMULAIRES & VALIDATION UTILISATEUR (Expérience S3 Dév Web)
  // =========================================================================
  {
    id: 11,
    category: "forms",
    categoryLabel: "Formulaires Web",
    title: "Affichage des messages d'erreur de saisie",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quel formulaire guide le mieux l'utilisateur en cas d'erreur de validation ?",
    correctOption: "B",
    explanation:
      "L'option B affiche le message d'erreur directement sous le champ concerné avec une icône et une phrase explicative. L'option A colore simplement la bordure en rouge sans aucun texte explicatif.",
    variantA: {
      type: "form_error",
      isCorrect: false,
      data: {
        hasMessage: false,
        field: "Adresse email universitaire",
        value: "etudiant.univ",
      },
    },
    variantB: {
      type: "form_error",
      isCorrect: true,
      data: {
        hasMessage: true,
        field: "Adresse email universitaire",
        value: "etudiant.univ",
        errorText: "L'adresse doit comporter un nom de domaine valide (ex: @univ-artois.fr).",
      },
    },
  },
  {
    id: 12,
    category: "forms",
    categoryLabel: "Formulaires Web",
    title: "Labels de champs vs Placeholders uniques",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quelle intégration garantit que l'utilisateur sait toujours ce qu'il remplit ?",
    correctOption: "A",
    explanation:
      "L'option A conserve un <label> permanent au-dessus du champ. L'option B n'utilise qu'un placeholder : dès que l'utilisateur commence à taper, l'intitulé disparaît, empêchant toute relecture rapide.",
    variantA: {
      type: "form_labels",
      isCorrect: true,
      data: {
        hasLabel: true,
        label: "Numéro étudiant (INE)",
        placeholder: "Ex : 1234567890A",
      },
    },
    variantB: {
      type: "form_labels",
      isCorrect: false,
      data: {
        hasLabel: false,
        label: "",
        placeholder: "Numéro étudiant (INE)",
      },
    },
  },
  {
    id: 13,
    category: "forms",
    categoryLabel: "Formulaires Web",
    title: "Types d'input HTML5 sur appareil mobile",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quel champ de saisie déclenche automatiquement le pavé numérique virtuel sur smartphone ?",
    correctOption: "A",
    explanation:
      "L'option A utilise '<input type=\"tel\" inputmode=\"numeric\">', affichant directement le clavier numérique. L'option B utilise un '<input type=\"text\">' générique, forçant l'utilisateur à basculer manuellement son clavier mobile.",
    variantA: {
      type: "input_types",
      isCorrect: true,
      data: {
        inputType: "tel",
        inputMode: "numeric",
        helper: "Clavier numérique direct 0-9",
        label: "Code postal",
      },
    },
    variantB: {
      type: "input_types",
      isCorrect: false,
      data: {
        inputType: "text",
        inputMode: "text",
        helper: "Clavier alphabétique par défaut (nécessite clic ?123)",
        label: "Code postal",
      },
    },
  },
  {
    id: 14,
    category: "forms",
    categoryLabel: "Formulaires Web",
    title: "Indication des champs obligatoires",
    targetViewport: "tablet",
    viewportLabel: "💻 Vue Tablette (768 px)",
    instruction: "Quelle convention informe sans ambiguïté sur le caractère requis d'un champ ?",
    correctOption: "B",
    explanation:
      "L'option B affiche la mention explicite '(obligatoire)' ou un astérisque rouge accompagné d'une légende en tête de formulaire. L'option A ne donne aucun indice avant que l'utilisateur ne clique sur valider.",
    variantA: {
      type: "required_indicator",
      isCorrect: false,
      data: {
        indicated: false,
        label: "Mot de passe",
      },
    },
    variantB: {
      type: "required_indicator",
      isCorrect: true,
      data: {
        indicated: true,
        label: "Mot de passe *",
        legend: "* Champs requis",
      },
    },
  },
  {
    id: 15,
    category: "forms",
    categoryLabel: "Formulaires Web",
    title: "Bouton de soumission en cours de chargement",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quelle interface protège contre les doubles soumissions intempestives ?",
    correctOption: "A",
    explanation:
      "L'option A désactive le bouton ('disabled') et affiche un spinner de chargement avec le texte 'Envoi en cours...'. L'option B laisse le bouton actif et cliquable à volonté, risquant de déclencher plusieurs requêtes identiques.",
    variantA: {
      type: "submit_state",
      isCorrect: true,
      data: {
        loading: true,
        text: "Enregistrement...",
        hasSpinner: true,
      },
    },
    variantB: {
      type: "submit_state",
      isCorrect: false,
      data: {
        loading: false,
        text: "Enregistrer les modifications",
        hasSpinner: false,
      },
    },
  },

  // =========================================================================
  // 4. ERGONOMIE TACTILE & LOI DE FITTS (Zones de clic, Espacements)
  // =========================================================================
  {
    id: 16,
    category: "ergonomics",
    categoryLabel: "Ergonomie & Loi de Fitts",
    title: "Taille minimale de la zone de clic tactile",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quel bouton d'action respecte la norme recommandée de 44x44px sur écran tactile ?",
    correctOption: "B",
    explanation:
      "L'option B offre une zone de clic d'au moins 44x44px avec un padding confortable ('p-3'). L'option A est un minuscule lien texte de 12px avec 0px de padding, entraînant des erreurs de saisie fréquentes au doigt.",
    variantA: {
      type: "touch_target",
      isCorrect: false,
      data: {
        size: "small",
        paddingClass: "py-0.5 px-1 text-[11px]",
        label: "Supprimer",
      },
    },
    variantB: {
      type: "touch_target",
      isCorrect: true,
      data: {
        size: "standard",
        paddingClass: "py-2.5 px-4 text-sm min-h-[44px]",
        label: "Supprimer le fichier",
      },
    },
  },
  {
    id: 17,
    category: "ergonomics",
    categoryLabel: "Ergonomie & Loi de Fitts",
    title: "Espacement entre actions destructrices et positives",
    targetViewport: "mobile",
    viewportLabel: "📱 Vue Mobile (375 px)",
    instruction: "Quelle disposition prévient le déclenchement accidentel d'une action irréversible ?",
    correctOption: "A",
    explanation:
      "L'option A sépare nettement le bouton primaire positif (Continuer) et l'action destructrice (Annuler/Supprimer), avec une différenciation visuelle forte. L'option B colle deux boutons identiques côte à côte sans marge.",
    variantA: {
      type: "action_spacing",
      isCorrect: true,
      data: {
        spaced: true,
        primaryText: "Enregistrer le projet",
        destructiveText: "Supprimer le brouillon",
      },
    },
    variantB: {
      type: "action_spacing",
      isCorrect: false,
      data: {
        spaced: false,
        primaryText: "Enregistrer le projet",
        destructiveText: "Supprimer le brouillon",
      },
    },
  },
  {
    id: 18,
    category: "ergonomics",
    categoryLabel: "Ergonomie & Loi de Fitts",
    title: "Longueur de ligne et lisibilité typographique",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Vue Ordinateur (Desktop)",
    instruction: "Quelle mise en page de paragraphe garantit une lecture reposante et fluide ?",
    correctOption: "B",
    explanation:
      "L'option B limite la largeur du paragraphe ('max-w-prose' soit environ 65 à 75 caractères) avec un interligne aéré ('leading-relaxed'). L'option A étale le texte sur 1400px de large avec un interligne écrasé ('leading-none'), provoquant la perte de ligne lors de la lecture.",
    variantA: {
      type: "typography_readability",
      isCorrect: false,
      data: {
        maxWidth: "w-full",
        lineHeight: "leading-tight",
        text: "Le développement web en BUT 2 approfondit l'intégration d'architectures réactives, la manipulation de bases de données relationnelles et la mise en conformité des interfaces aux exigences d'accessibilité numérique du RGAA.",
      },
    },
    variantB: {
      type: "typography_readability",
      isCorrect: true,
      data: {
        maxWidth: "max-w-prose",
        lineHeight: "leading-relaxed",
        text: "Le développement web en BUT 2 approfondit l'intégration d'architectures réactives, la manipulation de bases de données relationnelles et la mise en conformité des interfaces aux exigences d'accessibilité numérique du RGAA.",
      },
    },
  },
  {
    id: 19,
    category: "ergonomics",
    categoryLabel: "Ergonomie & Loi de Fitts",
    title: "Hiérarchie visuelle d'une carte d'article",
    targetViewport: "tablet",
    viewportLabel: "💻 Vue Tablette (768 px)",
    instruction: "Quelle carte guide naturellement l'œil du titre vers l'action principale ?",
    correctOption: "A",
    explanation:
      "L'option A utilise une échelle typographique cohérente (Titre fort en gras, texte secondaire gris adouci, bouton d'action bien mis en valeur). L'option B affiche tout le texte avec la même taille et la même graisse, créant un bloc uniforme sans hiérarchie.",
    variantA: {
      type: "card_hierarchy",
      isCorrect: true,
      data: {
        hasHierarchy: true,
        title: "Introduction aux WebSockets et Socket.IO",
        date: "Publié le 18 novembre 2026",
        summary: "Découvrez comment établir des connexions bidirectionnelles en temps réel pour vos applications web.",
      },
    },
    variantB: {
      type: "card_hierarchy",
      isCorrect: false,
      data: {
        hasHierarchy: false,
        title: "Introduction aux WebSockets et Socket.IO",
        date: "Publié le 18 novembre 2026",
        summary: "Découvrez comment établir des connexions bidirectionnelles en temps réel pour vos applications web.",
      },
    },
  },
  {
    id: 20,
    category: "ergonomics",
    categoryLabel: "Ergonomie & Loi de Fitts",
    title: "Alignement des prix et colonnes numériques",
    targetViewport: "tablet",
    viewportLabel: "💻 Vue Tablette (768 px)",
    instruction: "Quel tableau facilite la comparaison visuelle rapide de valeurs numériques ?",
    correctOption: "B",
    explanation:
      "L'option B aligne les nombres et prix à droite ('text-right'), permettant d'aligner les unités, dizaines et centimes. L'option A centre ou aligne à gauche les montants, rendant la comparaison visuelle trompeuse.",
    variantA: {
      type: "numeric_alignment",
      isCorrect: false,
      data: {
        alignRight: false,
        items: [
          { label: "Hébergement Cloud", cost: "9,99 €" },
          { label: "Nom de domaine .fr", cost: "140,50 €" },
          { label: "Certificat SSL Wildcard", cost: "5,00 €" },
        ],
      },
    },
    variantB: {
      type: "numeric_alignment",
      isCorrect: true,
      data: {
        alignRight: true,
        items: [
          { label: "Hébergement Cloud", cost: "9,99 €" },
          { label: "Nom de domaine .fr", cost: "140,50 €" },
          { label: "Certificat SSL Wildcard", cost: "5,00 €" },
        ],
      },
    },
  },
];
