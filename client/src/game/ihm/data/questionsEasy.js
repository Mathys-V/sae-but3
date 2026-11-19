// client/src/game/ihm/data/questionsEasy.js
// 20 Cas d'Audit Ergonomique - Niveau 🟢 FACILE (Erreurs flagrantes et bon sens)

export const QUESTIONS_EASY = [
  {
    id: "E01",
    difficulty: "easy",
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Grille de produits sur mobile",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quelle grille s'adapte sans couper les produits sur mobile ?",
    explanation: "Une grille responsive empile les éléments en colonne ou autorise un scroll fluide. Les conteneurs rigides avec masquage coupent les contenus sans avertissement.",
    correctVariant: {
      type: "product_grid",
      data: {
        fluid: true,
        items: [
          { name: "Grimoire Ancien", price: "24 €", stock: "En stock", tag: "Populaire" },
          { name: "Potion de Soin", price: "12 €", stock: "Stock limité", tag: "Promo" },
          { name: "Dague Runique", price: "45 €", stock: "En stock", tag: "Nouveau" },
        ],
      },
    },
    incorrectVariant: {
      type: "product_grid",
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
    id: "E02",
    difficulty: "easy",
    category: "accessibility",
    categoryLabel: "Accessibilité & Contrastes",
    title: "Contraste du texte sur carte d'alerte",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel bloc de texte respecte le ratio minimal de contraste WCAG (4.5:1) ?",
    explanation: "Un texte gris très clair sur fond blanc a un ratio inférieur à 2:1, le rendant illisible pour les personnes malvoyantes. La version contrastée assure une lisibilité universelle.",
    correctVariant: {
      type: "contrast_card",
      data: {
        highContrast: true,
        title: "Alerte Sécurité Compte",
        body: "Une connexion suspecte a été détectée depuis un nouvel appareil. Veuillez vérifier votre activité récente.",
      },
    },
    incorrectVariant: {
      type: "contrast_card",
      data: {
        highContrast: false,
        title: "Alerte Sécurité Compte",
        body: "Une connexion suspecte a été détectée depuis un nouvel appareil. Veuillez vérifier votre activité récente.",
      },
    },
  },
  {
    id: "E03",
    difficulty: "easy",
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Menu de navigation sur smartphone",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quelle barre de navigation permet d'accéder à tous les liens sur smartphone ?",
    explanation: "Sur smartphone, le menu hamburger regroupe l'arborescence dans un tiroir accessible. La barre rigide coupe silencieusement les derniers liens hors de l'écran.",
    correctVariant: {
      type: "navbar",
      data: {
        hasBurger: true,
        links: ["Accueil", "Cours S3", "TPs & Projets", "Ressources", "Examens", "Contact"],
      },
    },
    incorrectVariant: {
      type: "navbar",
      data: {
        hasBurger: false,
        links: ["Accueil", "Cours S3", "TPs & Projets", "Ressources", "Examens", "Contact"],
      },
    },
  },
  {
    id: "E04",
    difficulty: "easy",
    category: "forms",
    categoryLabel: "Formulaires & Entrées",
    title: "Labels de formulaire vs Placeholders",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel formulaire reste clair une fois que l'utilisateur commence à saisir ?",
    explanation: "Les placeholders disparaissent dès la première frappe, laissant l'utilisateur sans repère. Des labels visibles au-dessus des champs sont essentiels en ergonomie cognitive.",
    correctVariant: {
      type: "form_labels",
      data: {
        visibleLabels: true,
        fields: [
          { label: "Nom d'utilisateur IUT", placeholder: "ex: jdupont" },
          { label: "Adresse e-mail étudiante", placeholder: "ex: jean.dupont@iut.fr" },
        ],
      },
    },
    incorrectVariant: {
      type: "form_labels",
      data: {
        visibleLabels: false,
        fields: [
          { label: "Nom d'utilisateur IUT", placeholder: "ex: jdupont" },
          { label: "Adresse e-mail étudiante", placeholder: "ex: jean.dupont@iut.fr" },
        ],
      },
    },
  },
  {
    id: "E05",
    difficulty: "easy",
    category: "ergonomics",
    categoryLabel: "Ergonomie Tactile",
    title: "Cible tactile du bouton de suppression",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quelle taille de bouton respecte la recommandation tactile minimale de 44x44px ?",
    explanation: "Un bouton de 20px est quasiment impossible à cibler avec le pouce et engendre des clics accidentels. La taille de 48px garantit un déclenchement fiable.",
    correctVariant: {
      type: "touch_target",
      data: {
        size: "large",
        icon: "🗑️",
        label: "Supprimer le projet",
      },
    },
    incorrectVariant: {
      type: "touch_target",
      data: {
        size: "small",
        icon: "🗑️",
        label: "Supprimer le projet",
      },
    },
  },
  {
    id: "E06",
    difficulty: "easy",
    category: "accessibility",
    categoryLabel: "Accessibilité Visuelle",
    title: "Indicateur d'état d'un serveur (Couleur seule)",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel message d'alerte reste compréhensible pour un utilisateur daltonien ?",
    explanation: "La règle WCAG 1.4.1 interdit de transmettre l'information par la couleur seule. Une icône explicite (croix, coche) ou un mot clé doit toujours accompagner la teinte.",
    correctVariant: {
      type: "status_alert",
      data: {
        hasIcon: true,
        color: "rose",
        message: "Échec de connexion à la base de données PostgreSQL (Serveur injoignable).",
      },
    },
    incorrectVariant: {
      type: "status_alert",
      data: {
        hasIcon: false,
        color: "rose",
        message: "Échec de connexion à la base de données PostgreSQL (Serveur injoignable).",
      },
    },
  },
  {
    id: "E07",
    difficulty: "easy",
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Boutons d'actions groupés sur mobile",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Comment gérer 3 boutons de commande sur un écran étroit ?",
    explanation: "Avec 'flex-wrap: wrap', les boutons s'empilent proprement sur plusieurs lignes. Sans retour à la ligne ('nowrap'), les textes sont tronqués ou écrasés.",
    correctVariant: {
      type: "button_group",
      data: {
        wrap: true,
        buttons: ["Modifier la note", "Télécharger le bulletin", "Consulter l'historique"],
      },
    },
    incorrectVariant: {
      type: "button_group",
      data: {
        wrap: false,
        buttons: ["Modifier la note", "Télécharger le bulletin", "Consulter l'historique"],
      },
    },
  },
  {
    id: "E08",
    difficulty: "easy",
    category: "forms",
    categoryLabel: "Formulaires & Ergonomie",
    title: "Indication des champs obligatoires",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle présentation informe clairement des champs requis avant soumission ?",
    explanation: "L'astérisque rouge normalisé avec légende explicite évite la frustration de soumettre un formulaire incomplet et de découvrir les erreurs après coup.",
    correctVariant: {
      type: "required_indicator",
      data: {
        hasAsterisk: true,
        fields: ["Identifiant étudiant", "Mot de passe", "Numéro INE"],
      },
    },
    incorrectVariant: {
      type: "required_indicator",
      data: {
        hasAsterisk: false,
        fields: ["Identifiant étudiant", "Mot de passe", "Numéro INE"],
      },
    },
  },
  {
    id: "E09",
    difficulty: "easy",
    category: "accessibility",
    categoryLabel: "Accessibilité & Sémantique",
    title: "Intitulé explicite des liens hypertextes",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel libellé de lien est conforme pour les lecteurs d'écran ?",
    explanation: "Les liens 'Cliquez ici' ou 'En savoir plus' sont des anti-patterns majeurs. Les utilisateurs de lecteurs d'écran naviguent de lien en lien et ont besoin d'un texte porteur de sens autonome.",
    correctVariant: {
      type: "link_semantics",
      data: {
        explicit: true,
        title: "Programme officiel BUT 2 Informatique",
        linkText: "Télécharger le syllabus complet du S3 (PDF 1.4 Mo)",
      },
    },
    incorrectVariant: {
      type: "link_semantics",
      data: {
        explicit: false,
        title: "Programme officiel BUT 2 Informatique",
        linkText: "Cliquez ici pour tout voir",
      },
    },
  },
  {
    id: "E10",
    difficulty: "easy",
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Tableau de bord de notes sur mobile",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quelle intégration de tableau évite de casser la largeur de la page ?",
    explanation: "Un conteneur avec défilement horizontal contrôlé ('overflow-x: auto') permet de consulter les 5 colonnes sans forcer toute la page web à déborder.",
    correctVariant: {
      type: "responsive_table",
      data: {
        scrollable: true,
        headers: ["Module", "Épreuve", "Coeff", "Note", "Mention"],
        rows: [
          ["R3.01 Dév Web", "Contrôle TP", "3", "16.5 / 20", "Très Bien"],
          ["R3.02 Base Données", "Projet SQL", "4", "14.0 / 20", "Bien"],
        ],
      },
    },
    incorrectVariant: {
      type: "responsive_table",
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
    id: "E11",
    difficulty: "easy",
    category: "ergonomics",
    categoryLabel: "Ergonomie Cognitive",
    title: "Espacement entre boutons d'action critique",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle disposition prévient les clics accidentels de suppression définitive ?",
    explanation: "Placer 'Supprimer définitivement' collé à 'Annuler' sans marge de sécurité provoque des destructions de données par erreur de pointage.",
    correctVariant: {
      type: "action_spacing",
      data: {
        safeDistance: true,
        confirmText: "Annuler",
        destructiveText: "Supprimer mon compte",
      },
    },
    incorrectVariant: {
      type: "action_spacing",
      data: {
        safeDistance: false,
        confirmText: "Annuler",
        destructiveText: "Supprimer mon compte",
      },
    },
  },
  {
    id: "E12",
    difficulty: "easy",
    category: "forms",
    categoryLabel: "Formulaires & Mobiles",
    title: "Clavier virtuel pour saisie d'un code PIN",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quel attribut HTML déclenche directement le clavier numérique sur smartphone ?",
    explanation: "Utiliser inputmode='numeric' (ou type='tel') ouvre immédiatement le pavé à 10 chiffres sur mobile, évitant à l'utilisateur de basculer manuellement son clavier.",
    correctVariant: {
      type: "input_types",
      data: {
        semanticType: true,
        label: "Code secret (4 chiffres)",
        type: "tel",
      },
    },
    incorrectVariant: {
      type: "input_types",
      data: {
        semanticType: false,
        label: "Code secret (4 chiffres)",
        type: "text",
      },
    },
  },
  {
    id: "E13",
    difficulty: "easy",
    category: "accessibility",
    categoryLabel: "Accessibilité & Clavier",
    title: "Indicateur de focus au clavier",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle interface permet à un utilisateur naviguant avec 'Tab' de savoir où il se trouve ?",
    explanation: "Supprimer la bordure de focus ('outline: none') sans alternative visuelle est une violation grave des normes d'accessibilité (WCAG 2.4.7).",
    correctVariant: {
      type: "focus_state",
      data: {
        hasOutline: true,
        label: "Recherche dans la documentation",
        placeholder: "Entrez un mot-clé...",
      },
    },
    incorrectVariant: {
      type: "focus_state",
      data: {
        hasOutline: false,
        label: "Recherche dans la documentation",
        placeholder: "Entrez un mot-clé...",
      },
    },
  },
  {
    id: "E14",
    difficulty: "easy",
    category: "forms",
    categoryLabel: "Formulaires & Feedback",
    title: "Feedback visuel lors de l'enregistrement",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel bouton empêche les doubles soumissions involontaires ?",
    explanation: "Afficher un état de chargement ('En cours...') et désactiver le bouton pendant la requête évite les doubles débits ou inscriptions répétées.",
    correctVariant: {
      type: "submit_state",
      data: {
        loadingFeedback: true,
        buttonText: "Valider l'inscription",
      },
    },
    incorrectVariant: {
      type: "submit_state",
      data: {
        loadingFeedback: false,
        buttonText: "Valider l'inscription",
      },
    },
  },
  {
    id: "E15",
    difficulty: "easy",
    category: "responsive",
    categoryLabel: "Responsive Design",
    title: "Titre principal de bannière (Hero) sur smartphone",
    targetViewport: "mobile",
    viewportLabel: "📱 Mobile 375px",
    instruction: "Quelle taille de typographie s'adapte à un écran étroit de 375px ?",
    explanation: "Une taille fixe rigide (ex: font-size: 54px) déborde du viewport mobile. L'utilisation d'unités fluides ('clamp' ou classes responsive text-2xl sm:text-4xl) préserve le cadrage.",
    correctVariant: {
      type: "hero_banner",
      data: {
        responsiveText: true,
        title: "Bienvenue sur EvilJV",
        subtitle: "La plateforme de révision gamifiée du BUT Informatique",
        cta: "Commencer l'aventure",
      },
    },
    incorrectVariant: {
      type: "hero_banner",
      data: {
        responsiveText: false,
        title: "Bienvenue sur EvilJV",
        subtitle: "La plateforme de révision gamifiée du BUT Informatique",
        cta: "Commencer l'aventure",
      },
    },
  },
  {
    id: "E16",
    difficulty: "easy",
    category: "accessibility",
    categoryLabel: "Accessibilité & Images",
    title: "Texte alternatif d'un graphique de notes",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle balise image permet à un non-voyant de comprendre le visuel ?",
    explanation: "Un attribut alt explicite décrivant le contenu de l'image est obligatoire. Un alt vide ou absent ('alt=\"\"' ou 'alt=\"image\"') rend le graphique inaccessible.",
    correctVariant: {
      type: "alt_text_demo",
      data: {
        hasAlt: true,
        src: "/assets/ui/chart.png",
        alt: "Histogramme montrant la moyenne de la promo en Développement Web : 13.8 / 20",
        caption: "Statistiques de réussite du semestre 3",
      },
    },
    incorrectVariant: {
      type: "alt_text_demo",
      data: {
        hasAlt: false,
        src: "/assets/ui/chart.png",
        alt: "image1.jpg",
        caption: "Statistiques de réussite du semestre 3",
      },
    },
  },
  {
    id: "E17",
    difficulty: "easy",
    category: "forms",
    categoryLabel: "Formulaires & Erreurs",
    title: "Message d'erreur sur champ erroné",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Où doit s'afficher l'erreur pour une correction immédiate par l'étudiant ?",
    explanation: "Le message d'erreur doit être placé directement sous le champ concerné avec un texte d'aide précis. Un simple contour rouge sans explication laisse l'utilisateur perplexe.",
    correctVariant: {
      type: "form_error",
      data: {
        accessible: true,
        fieldName: "Mot de passe",
        errorMsg: "Le mot de passe doit contenir au moins 8 caractères dont un chiffre.",
      },
    },
    incorrectVariant: {
      type: "form_error",
      data: {
        accessible: false,
        fieldName: "Mot de passe",
        errorMsg: "",
      },
    },
  },
  {
    id: "E18",
    difficulty: "easy",
    category: "ergonomics",
    categoryLabel: "Hiérarchie Visuelle",
    title: "Alignement des montants financiers dans un tableau",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quel alignement permet de comparer rapidement des chiffres et montants ?",
    explanation: "Les données numériques et monétaires doivent toujours être alignées à droite pour que les unités, dizaines et décimales soient verticalement alignées.",
    correctVariant: {
      type: "numeric_alignment",
      data: {
        alignRight: true,
        headers: ["Service", "Tarif mensuel"],
        items: [
          { label: "Hébergement Cloud VM2", cost: "12,50 €" },
          { label: "Nom de domaine .fr", cost: "8,90 €" },
          { label: "Certificat SSL Wildcard", cost: "149,00 €" },
        ],
      },
    },
    incorrectVariant: {
      type: "numeric_alignment",
      data: {
        alignRight: false,
        headers: ["Service", "Tarif mensuel"],
        items: [
          { label: "Hébergement Cloud VM2", cost: "12,50 €" },
          { label: "Nom de domaine .fr", cost: "8,90 €" },
          { label: "Certificat SSL Wildcard", cost: "149,00 €" },
        ],
      },
    },
  },
  {
    id: "E19",
    difficulty: "easy",
    category: "ergonomics",
    categoryLabel: "Ergonomie & Typographie",
    title: "Largeur de ligne et lisibilité d'un article",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle mise en page textuelle respecte la règle ergonomique des 60-80 caractères par ligne ?",
    explanation: "Une ligne de texte qui s'étale sur 1900px de large fatigue l'œil lors des retours à la ligne. Un conteneur limité (max-w-prose ou max-w-2xl) garantit un confort de lecture optimal.",
    correctVariant: {
      type: "typography_readability",
      data: {
        comfortable: true,
        title: "Introduction aux architectures RESTful",
        paragraph: "Les API REST reposent sur l'utilisation standard des verbes HTTP (GET, POST, PUT, DELETE) et des statuts normalisés. Elles permettent une communication découplée entre client et serveur.",
      },
    },
    incorrectVariant: {
      type: "typography_readability",
      data: {
        comfortable: false,
        title: "Introduction aux architectures RESTful",
        paragraph: "Les API REST reposent sur l'utilisation standard des verbes HTTP (GET, POST, PUT, DELETE) et des statuts normalisés. Elles permettent une communication découplée entre client et serveur.",
      },
    },
  },
  {
    id: "E20",
    difficulty: "easy",
    category: "ergonomics",
    categoryLabel: "Hiérarchie Visuelle",
    title: "Carte d'actualité universitaire",
    targetViewport: "desktop",
    viewportLabel: "🖥️ Desktop",
    instruction: "Quelle carte guide l'œil du lecteur dans un ordre naturel d'importance ?",
    explanation: "Une bonne hiérarchie visuelle met en évidence la catégorie en sur-titre, un grand titre lisible en gras, puis les métadonnées (auteur, date) en teinte adoucie.",
    correctVariant: {
      type: "card_hierarchy",
      data: {
        clearHierarchy: true,
        category: "DÉVELOPPEMENT WEB S3",
        title: "Remise des projets de mini-jeux EvilJV",
        author: "Département Informatique",
        date: "19 novembre 2026",
      },
    },
    incorrectVariant: {
      type: "card_hierarchy",
      data: {
        clearHierarchy: false,
        category: "DÉVELOPPEMENT WEB S3",
        title: "Remise des projets de mini-jeux EvilJV",
        author: "Département Informatique",
        date: "19 novembre 2026",
      },
    },
  },
];
