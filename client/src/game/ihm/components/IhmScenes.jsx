// client/src/game/ihm/components/IhmScenes.jsx
// Scènes de maquettes utilisées par les niveaux MOYEN et EXPERT.
// Chaque scène reçoit `data.value` (true = conforme, false = piège) et
// `data.keyName` (mécanisme d'erreur, utilisé par les tests d'unicité).

const panel = "w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2.5 text-left";
const chip = "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700";
const goodText = "text-emerald-300";
const badText = "text-rose-300";

function FakeButton({ children, tone = "indigo" }) {
  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-bold rounded ${
        tone === "rose" ? "bg-rose-700 text-white" : "bg-indigo-600 text-white"
      }`}
    >
      {children}
    </span>
  );
}

function Line({ text, value, good, bad }) {
  return (
    <div className={`text-[11px] font-mono ${value ? goodText : badText}`}>
      {text} : {value ? good : bad}
    </div>
  );
}

const SCENE_RENDERERS = {
  /* 1. Onglets — débordement vs retour à la ligne */
  tabsOverflow: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-400 uppercase tracking-wider">Paramètres du module</span>
      <div className={`flex gap-1.5 ${d.value ? "overflow-x-auto pb-1" : "overflow-hidden"}`}>
        {(d.labels || ["Général", "Étudiants", "Notes", "Planning", "Soutenances"]).map((l, i) => (
          <span key={i} className="shrink-0 px-2 py-1 text-[10px] rounded bg-slate-900 text-slate-200">
            {l}
          </span>
        ))}
      </div>
    </div>
  ),
  tabsWrap: (d) => (
    <div className={panel}>
      <div className="flex gap-1.5">
        {(d.labels || ["Cours", "TP", "Projets", "Examens", "Ressources"]).map((l, i) => (
          <span
            key={i}
            className={`px-2 py-1 text-[10px] rounded bg-slate-900 text-slate-200 ${
              d.value ? "whitespace-nowrap" : "truncate max-w-[45px]"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  ),

  /* 2. Fil d'Ariane */
  breadcrumbTruncate: (d) => (
    <div className={panel}>
      <div className="text-[11px] text-slate-300 flex flex-wrap items-center gap-1">
        {(d.steps || ["Accueil", "R3.01", "SAE", "Rendu final"]).map((s, i) => (
          <span key={i} className={d.value ? "" : "truncate max-w-[55px] inline-block"}>
            {i > 0 && <span className="text-slate-600 mr-1">›</span>}
            {s}
          </span>
        ))}
      </div>
    </div>
  ),
  breadcrumbSeparator: (d) => (
    <div className={panel}>
      <div className="text-[11px] text-slate-300 flex items-center gap-1">
        {(d.steps || ["Accueil", "Ressources", "R3.01"]).map((s, i) => (
          <span key={i}>
            {i > 0 && <span className={d.value ? "text-slate-500 mx-1" : "text-slate-900 mx-0"}>›</span>}
            {s}
          </span>
        ))}
      </div>
    </div>
  ),

  /* 3. Infobulles */
  tooltipTrigger: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-200">Mot de passe</span>
        <span className={`w-5 h-5 rounded-full text-center text-[11px] leading-5 ${d.value ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-500"}`}>
          ?
        </span>
        {d.value && <span className={chip}>12 caractères min.</span>}
      </div>
    </div>
  ),
  tooltipDelay: (d) => (
    <div className={panel}>
      <FakeButton>Supprimer le cours</FakeButton>
      <Line
        text="Aide"
        value={d.value}
        good="affichée immédiatement au survol"
        bad="absente (délai de 3 s)"
      />
    </div>
  ),

  /* 4. Pagination */
  paginationTotal: (d) => (
    <div className={panel}>
      <div className="text-[11px] text-slate-300">Résultats de recherche</div>
      <Line text="Information" value={d.value} good="24 résultats — page 2/5" bad="page 2" />
    </div>
  ),
  paginationControls: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <FakeButton>← Préc.</FakeButton>
        <span className="text-[11px] text-slate-300">2 / 5</span>
        <FakeButton>Suiv. →</FakeButton>
      </div>
      {!d.value && <span className="text-[10px] text-rose-300">Boutons icônes sans intitulé</span>}
    </div>
  ),

  /* 5. Fenêtre modale */
  modalClose: (d) => (
    <div className={panel}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-white">Confirmation</span>
        {d.value && <span className="text-rose-300 text-sm">✕</span>}
      </div>
      <p className="text-[11px] text-slate-300">Voulez-vous vraiment supprimer ce projet ?</p>
    </div>
  ),
  modalTrap: (d) => (
    <div className={panel}>
      <span className="text-xs font-bold text-white">Modale de partage</span>
      <FakeButton>Copier le lien</FakeButton>
      <Line text="Focus clavier" value={d.value} good="resté dans la modale" bad="perdu derrière la modale" />
    </div>
  ),

  /* 6. Écran de chargement */
  skeletonShimmer: (d) => (
    <div className={panel}>
      <div className={`h-3 w-2/3 rounded bg-slate-700 ${d.value ? "animate-pulse" : ""}`} />
      <div className={`h-3 w-full rounded bg-slate-700 ${d.value ? "animate-pulse" : ""}`} />
      <div className={`h-3 w-1/2 rounded bg-slate-700 ${d.value ? "animate-pulse" : ""}`} />
    </div>
  ),
  skeletonLayout: (d) => (
    <div className={panel}>
      <div className={`h-16 rounded bg-slate-700 ${d.value ? "mb-3" : ""}`} />
      <div className="h-3 w-3/4 rounded bg-slate-700" />
    </div>
  ),

  /* 7. État vide */
  emptyAction: (d) => (
    <div className={panel}>
      <div className="text-2xl text-center text-slate-600">📭</div>
      <p className="text-[11px] text-slate-300 text-center">Aucun rendu pour le moment.</p>
      {d.value && (
        <div className="flex justify-center">
          <FakeButton>Déposer un rendu</FakeButton>
        </div>
      )}
    </div>
  ),
  emptyHint: (d) => (
    <div className={panel}>
      <p className="text-[11px] text-slate-300 text-center">Aucun résultat.</p>
      <Line text="Conseil" value={d.value} good="Essayez d'élargir votre recherche" bad=" texte absent" />
    </div>
  ),

  /* 8. Notifications toast */
  toastRole: (d) => (
    <div className={panel}>
      <div className={`p-2 rounded text-[11px] ${d.value ? "bg-emerald-950/70 text-emerald-200 border border-emerald-700" : "bg-slate-900 text-slate-300"}`}>
        Sauvegarde effectuée.
        {d.value && <span className={chip + " ml-2"}>role="status"</span>}
      </div>
    </div>
  ),
  toastDismiss: (d) => (
    <div className={panel}>
      <div className="p-2 rounded text-[11px] bg-indigo-950/60 text-indigo-200 flex justify-between">
        <span>Nouveau message reçu.</span>
        {d.value ? <span>✕</span> : <span className="text-slate-500">—</span>}
      </div>
    </div>
  ),

  /* 9. Dépôt de fichiers */
  uploadConstraints: (d) => (
    <div className={panel}>
      <div className="border border-dashed border-slate-600 rounded p-3 text-center text-[11px] text-slate-300">
        Glissez votre fichier ici
      </div>
      <Line text="Contraintes" value={d.value} good="PDF, 5 Mo maximum" bad="non indiquées" />
    </div>
  ),
  uploadDrag: (d) => (
    <div className={panel}>
      <div className={`border border-dashed rounded p-3 text-center text-[11px] ${d.value ? "border-indigo-500 bg-indigo-950/40 text-indigo-200" : "border-slate-600 text-slate-300"}`}>
        Glissez votre fichier ici
      </div>
      <FakeButton>Parcourir</FakeButton>
    </div>
  ),

  /* 10. Curseur */
  sliderValue: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Volume de la vidéo</span>
      <div className="h-1.5 w-full rounded bg-slate-700 relative">
        <div className="w-1/2 h-1.5 rounded bg-indigo-500" />
        <div className="w-3 h-3 rounded-full bg-white absolute top-[-5px] left-1/2" />
      </div>
      <Line text="Valeur" value={d.value} good="50 % affiché" bad="non affichée" />
    </div>
  ),
  sliderTicks: (d) => (
    <div className={panel}>
      <div className="h-1.5 w-full rounded bg-slate-700" />
      <div className="flex justify-between text-[10px] text-slate-400">
        {(d.ticks || ["0", "25", "50", "75", "100"]).map((t, i) => (
          <span key={i}>{d.value ? t : i % 2 === 0 ? t : ""}</span>
        ))}
      </div>
    </div>
  ),

  /* 11. Sélecteur de date */
  dateFormat: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Date de soutenance</span>
      <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-white">
        {d.value ? "JJ/MM/AAAA (ex : 21/11/2026)" : "21/11/26"}
      </div>
    </div>
  ),
  dateKeyboard: (d) => (
    <div className={panel}>
      <div className="p-2 rounded bg-slate-900 text-[11px] font-mono text-white">21/11/2026</div>
      <Line text="Clavier" value={d.value} good="flèches + saisie directe" bad="souris uniquement" />
    </div>
  ),

  /* 12. Autocomplétion */
  autocompleteHighlight: (d) => (
    <div className={panel}>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">Rechercher un étudiant…</div>
      {(d.suggestions || ["Jean Dupont", "Jean Martin", "Jeanne Durand"]).map((s, i) => (
        <div key={i} className="text-[11px] text-slate-300">
          {d.value ? s.replace("Jean", "[Jean]") : s}
        </div>
      ))}
    </div>
  ),
  autocompleteCount: (d) => (
    <div className={panel}>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">Rechercher un étudiant…</div>
      <Line text="Résultats" value={d.value} good="3 suggestions trouvées" bad="liste sans compteur" />
    </div>
  ),

  /* 13. Badges de notification */
  badgeCount: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🔔</span>
        {d.value && <span className="text-[10px] bg-rose-600 text-white rounded-full px-1.5">3</span>}
      </div>
      <span className="text-[10px] text-slate-400">Notifications</span>
    </div>
  ),
  badgeLabel: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🔔</span>
        <span className={`text-[10px] ${d.value ? "text-slate-200" : "text-slate-600"}`}>
          {d.value ? "3 nouveaux messages" : "•••"}
        </span>
      </div>
    </div>
  ),

  /* 14. Barre de progression */
  progressPercent: (d) => (
    <div className={panel}>
      <div className="h-2 w-full rounded bg-slate-700">
        <div className="w-3/5 h-2 rounded bg-indigo-500" />
      </div>
      <Line text="Avancement" value={d.value} good="60 % — 12/20 questions" bad="barre seule" />
    </div>
  ),
  progressEta: (d) => (
    <div className={panel}>
      <div className="h-2 w-full rounded bg-slate-700">
        <div className="w-3/5 h-2 rounded bg-indigo-500" />
      </div>
      <Line text="Temps" value={d.value} good="environ 3 min restantes" bad="aucune estimation" />
    </div>
  ),

  /* 15. Tri de tableau */
  tableSortIcon: (d) => (
    <div className={panel}>
      <div className="grid grid-cols-2 text-[11px] border-b border-slate-700 pb-1 text-slate-300">
        <span>Étudiant</span>
        <span className="text-right">
          Note {d.value ? <span className="text-amber-300">▲</span> : <span className="text-slate-600">▲</span>}
        </span>
      </div>
      <div className="grid grid-cols-2 text-[11px] text-slate-300 pt-1">
        <span>Dupont</span><span className="text-right">14</span>
      </div>
    </div>
  ),
  tableSortActive: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Colonne active :</span>
      <Line text="Indication" value={d.value} good="fond + icône de tri" bad="aucune" />
    </div>
  ),

  /* 16. Groupe d'avatars */
  avatarOverflow: (d) => (
    <div className={panel}>
      <div className="flex -space-x-2">
        {(d.people || ["AD", "JM", "CD", "ML"]).map((p, i) => (
          <span key={i} className="w-7 h-7 rounded-full bg-indigo-700 text-white text-[10px] flex items-center justify-center border-2 border-slate-800">
            {p}
          </span>
        ))}
        {d.value && (
          <span className="w-7 h-7 rounded-full bg-slate-600 text-white text-[10px] flex items-center justify-center border-2 border-slate-800">
            +4
          </span>
        )}
      </div>
    </div>
  ),
  avatarNames: (d) => (
    <div className={panel}>
      <div className="flex gap-2">
        <span className="w-7 h-7 rounded-full bg-indigo-700 text-white text-[10px] flex items-center justify-center">AD</span>
        <span className={`text-[11px] ${d.value ? "text-slate-200" : "text-slate-600"}`}>
          {d.value ? "Alice Dupont" : "AD"}
        </span>
      </div>
    </div>
  ),

  /* 17. Saisie de tags */
  tagRemove: (d) => (
    <div className={panel}>
      <div className="flex flex-wrap gap-1.5">
        {(d.tags || ["R3.01", "Web", "SAE"]).map((t, i) => (
          <span key={i} className="px-2 py-1 text-[10px] rounded bg-slate-900 text-slate-200">
            {t} {d.value && <span className="text-rose-400">✕</span>}
          </span>
        ))}
      </div>
    </div>
  ),
  tagHint: (d) => (
    <div className={panel}>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">Ajouter un mot-clé…</div>
      <Line text="Aide" value={d.value} good="Entrée pour valider" bad="absente" />
    </div>
  ),

  /* 18. Indicateur d'étapes */
  stepperCurrent: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-1.5">
        {(d.steps || ["Panier", "Livraison", "Paiement"]).map((s, i) => (
          <span key={i} className={`px-2 py-1 text-[10px] rounded ${i === 1 ? (d.value ? "bg-indigo-600 text-white font-bold" : "bg-slate-700 text-slate-400") : "bg-slate-900 text-slate-500"}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  ),
  stepperSteps: (d) => (
    <div className={panel}>
      <Line text="Progression" value={d.value} good="Étape 2 sur 3" bad="étape 2 seulement" />
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded ${i < 2 ? "bg-indigo-500" : "bg-slate-700"}`} />
        ))}
      </div>
    </div>
  ),

  /* 19. Bascule de thème */
  themeIcon: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{d.value ? "🌙" : "☀️"}</span>
        <span className="text-[11px] text-slate-300">
          {d.value ? "Mode sombre" : "Bouton sans icône"}
        </span>
      </div>
    </div>
  ),
  themeLabel: (d) => (
    <div className={panel}>
      <div className="flex items-center gap-2">
        <span className="text-lg">🌙</span>
        <span className={`text-[11px] ${d.value ? "text-slate-200" : "text-slate-600"}`}>
          {d.value ? "Activer le mode sombre" : "Basculer"}
        </span>
      </div>
    </div>
  ),

  /* 20. Recherche */
  searchHighlight: (d) => (
    <div className={panel}>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">Requête : « ergonomie »</div>
      {(d.results || ["Guide d'ergonomie", "Ergonomie cognitive", "Tests utilisateurs"]).map((r, i) => (
        <div key={i} className="text-[11px] text-slate-300">
          {d.value ? r.replace(/ergonomie/gi, "[ergonomie]") : r}
        </div>
      ))}
    </div>
  ),
  searchCount: (d) => (
    <div className={panel}>
      <Line text="Résultats" value={d.value} good="12 résultats pour « ergonomie »" bad="12" />
    </div>
  ),

  /* 21. Centre de notifications */
  notificationTime: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Nouveau commentaire</span>
      <Line text="Date" value={d.value} good="il y a 5 min" bad="19/11/2026" />
    </div>
  ),
  notificationRead: (d) => (
    <div className={panel}>
      <span className={`text-[11px] ${d.value ? "font-bold text-white" : "text-slate-500"}`}>
        Nouveau commentaire
      </span>
      <span className="text-[10px] text-slate-400">Il y a 5 min</span>
    </div>
  ),

  /* 22. Aide en ligne */
  inlineHelp: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Identifiant étudiant</span>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">jdupont2026</div>
      <Line text="Aide" value={d.value} good="Format attendu affiché" bad="absente" />
    </div>
  ),
  inlineExample: (d) => (
    <div className={panel}>
      <Line text="Exemple" value={d.value} good="ex : jdupont2026" bad="ex : ..." />
    </div>
  ),

  /* 23. Raccourcis clavier */
  keyboardShortcut: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Enregistrer</span>
      {d.value && <span className={chip}>Ctrl + S</span>}
    </div>
  ),
  keyboardVisible: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Touche Tab</span>
      <div className={`h-0.5 w-full mt-1 ${d.value ? "bg-amber-400" : "bg-transparent"}`} />
      <Line text="Focus" value={d.value} good="anneau visible" bad="aucun anneau" />
    </div>
  ),

  /* 24. Résumé d'erreurs */
  errorSummary: (d) => (
    <div className={panel}>
      <div className={`p-2 rounded text-[11px] ${d.value ? "bg-rose-950/70 text-rose-200 border border-rose-700" : "bg-slate-900 text-slate-300"}`}>
        2 erreurs dans le formulaire
        {d.value && <span className="text-[10px] block mt-1">• Email invalide • Mot de passe court</span>}
      </div>
    </div>
  ),
  errorInline: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Email</span>
      <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-200">adresse_invalide</div>
      <Line text="Message" value={d.value} good="« Format attendu : nom@iut.fr »" bad="« Erreur »" />
    </div>
  ),

  /* 25. Densité de liste */
  listDensity: (d) => (
    <div className={panel}>
      {(d.rows || ["R3.01 Développement Web", "R3.02 Base de données", "R3.04 Qualité"]).map((r, i) => (
        <div key={i} className={`text-[11px] text-slate-300 bg-slate-900 rounded px-2 ${d.value ? "py-2 mb-1.5" : "py-0.5 mb-0.5"}`}>
          {r}
        </div>
      ))}
    </div>
  ),
  listZebra: (d) => (
    <div className={panel}>
      {(d.rows || ["Groupe A", "Groupe B", "Groupe C"]).map((r, i) => (
        <div key={i} className={`text-[11px] text-slate-300 px-2 py-1 ${d.value && i % 2 === 1 ? "bg-slate-900/70" : ""}`}>
          {r}
        </div>
      ))}
    </div>
  ),

  /* 26. Détails subtils (expert) */
  subtleDivider: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Section A</span>
      <div className={`my-2 h-px ${d.value ? "bg-slate-600" : "bg-slate-800"}`} />
      <span className="text-[11px] text-slate-300">Section B</span>
    </div>
  ),
  baselineGrid: (d) => (
    <div className={panel}>
      <span className={`text-[11px] text-slate-300 ${d.value ? "leading-6" : "leading-[13px]"}`}>
        Alignement sur la grille de base : les lignes de texte se superposent aux lignes horizontales de la grille.
      </span>
    </div>
  ),
  iconAffordance: (d) => (
    <div className={panel}>
      <div className="flex gap-3">
        <span className="text-lg text-slate-300">✏️</span>
        <span className={`text-[11px] ${d.value ? "text-slate-200 underline decoration-dotted" : "text-slate-500"}`}>
          Modifier
        </span>
      </div>
    </div>
  ),
  motionEasing: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Ouverture du panneau</span>
      <div className={`h-2 w-2 rounded-full bg-indigo-500 mt-2 ${d.value ? "transition-transform duration-300 ease-out translate-x-16" : "transition-transform duration-300 ease-in translate-x-16"}`} />
    </div>
  ),
  loadingSkeleton: (d) => (
    <div className={panel}>
      <div className={`h-8 rounded bg-slate-700 ${d.value ? "mb-2" : "mb-0.5"}`} />
      <div className="h-2 w-1/2 rounded bg-slate-700" />
    </div>
  ),
  typeScale: (d) => (
    <div className={panel}>
      <span className={`font-bold text-slate-100 ${d.value ? "text-lg" : "text-sm"}`}>Titre de la ressource</span>
      <span className="text-[11px] text-slate-400 block">Sous-titre secondaire</span>
    </div>
  ),
  borderRhythm: (d) => (
    <div className={panel}>
      <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
        <span className="text-[11px] text-slate-300">Carte parent</span>
        <div className={`mt-2 p-2 bg-slate-800 ${d.value ? "rounded-lg" : "rounded-xl"} border border-slate-700`}>
          <span className="text-[11px] text-slate-200">Carte imbriquée</span>
        </div>
      </div>
    </div>
  ),
  contrastThreshold: (d) => (
    <div className={panel}>
      <span className="text-[11px] text-slate-300">Métadonnée de soumission</span>
      <span className={`text-[11px] font-mono ${d.value ? "text-slate-200" : "text-slate-700"}`}>
        19/11/2026 à 14:32
      </span>
    </div>
  ),
  decimalAlignment: (d) => (
    <div className={panel}>
      <div className="grid grid-cols-2 text-[11px] border-b border-slate-700 pb-1 text-slate-400">
        <span>Montant</span>
        <span className={d.value ? "text-right" : "text-left"}>Total</span>
      </div>
      {(d.items || [{ label: "R3.01", cost: "12,50 €" }, { label: "R3.02", cost: "4,00 €" }]).map((it, i) => (
        <div key={i} className={`grid grid-cols-2 text-[11px] text-slate-200 pt-1 ${d.value ? "font-mono tabular-nums" : ""}`}>
          <span>{it.label}</span>
          <span className={d.value ? "text-right" : "text-left"}>{it.cost}</span>
        </div>
      ))}
    </div>
  ),
};

export function SceneRenderer({ data }) {
  const render = SCENE_RENDERERS[data.scene];
  if (!render) {
    return <div className="text-xs text-rose-300">Scène inconnue : {String(data.scene)}</div>;
  }
  return render(data);
}
