// client/src/game/ihm/components/IhmCardViewer.jsx

export default function IhmCardViewer({
  variant,
  optionLabel,
  onSelect,
  isSelected,
  showResult,
  isCorrect,
  targetViewport = "desktop",
}) {
  const { type, data = {} } = variant;

  return (
    <div
      className={`relative flex flex-col h-full bg-slate-900 border-2 rounded-lg transition-all shadow-lg overflow-hidden ${
        isSelected
          ? isCorrect
            ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            : "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      {/* Tampon d'inspection ergonomique (Impact visuel officiel après vote) */}
      {showResult && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          <div
            className={`px-4 sm:px-6 py-2 border-4 rounded font-mono font-black text-lg sm:text-2xl tracking-widest uppercase shadow-2xl backdrop-blur-xs animate-stamp select-none ${
              isCorrect
                ? "border-emerald-500 text-emerald-400 bg-emerald-950/85 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                : "border-rose-500 text-rose-400 bg-rose-950/85 shadow-[0_0_25px_rgba(244,63,94,0.5)]"
            }`}
          >
            {isCorrect ? "✓ CONFORME" : "✗ REJETÉ"}
          </div>
        </div>
      )}

      {/* En-tête de la maquette (Style navigateur / smartphone moderne) */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-200 font-bold ml-1">
            Interface {optionLabel}
          </span>
          {targetViewport === "mobile" && (
            <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800">
              📱 375 px
            </span>
          )}
          {targetViewport === "tablet" && (
            <span className="text-[10px] text-blue-300 font-mono bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
              💻 768 px
            </span>
          )}
        </div>

        {showResult && (
          <span
            className={`text-xs font-sans font-bold px-2.5 py-0.5 rounded ${
              isCorrect
                ? "bg-emerald-950 text-emerald-300 border border-emerald-600"
                : "bg-rose-950 text-rose-300 border border-rose-600"
            }`}
          >
            {isCorrect ? "✓ ERGONOMIQUE" : "✗ PIÈGE DÉTECTÉ"}
          </span>
        )}
      </div>

      {/* Contenu Web Réaliste (Tolérant, dynamique et avec contrastes visuels frappants) */}
      <div className="p-4 bg-slate-950 text-slate-100 min-h-[250px] flex-1 flex flex-col justify-center overflow-hidden font-sans">
        {/* 1. GRILLE DE CARTES PRODUITS */}
        {type === "product_grid" && (
          <div className="w-full">
            {targetViewport === "mobile" ? (
              data.fluid !== false ? (
                /* Fluide en colonne */
                <div className="flex flex-col gap-2.5 w-full">
                  {(data.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          {it.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{it.name}</h4>
                        <p className="text-xs text-slate-400">{it.stock}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-sm font-bold text-emerald-400">{it.price}</span>
                        <button
                          type="button"
                          className="text-xs px-2.5 py-1 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-500"
                        >
                          Acheter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Rigide avec débordement sans scroll */
                <div className="flex flex-row gap-3 w-full overflow-hidden">
                  {(data.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-col justify-between w-[200px] shrink-0"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          {it.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{it.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{it.stock}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-700/60">
                        <span className="text-sm font-bold text-emerald-400">{it.price}</span>
                        <button
                          type="button"
                          className="text-xs px-2 py-1 bg-indigo-600 text-white font-medium rounded"
                        >
                          Acheter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : targetViewport === "tablet" ? (
              /* Vue Tablette 768px */
              <div className={`grid gap-3 w-full ${data.fluid !== false ? "grid-cols-2" : "grid-cols-4"}`}>
                {(data.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{it.tag}</span>
                      <h4 className="text-xs font-bold text-white mt-0.5 truncate">{it.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{it.stock}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
                      <span className="text-xs font-bold text-emerald-400">{it.price}</span>
                      <button
                        type="button"
                        className="text-[10px] px-2 py-0.5 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vue Desktop */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {(data.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{it.tag}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{it.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{it.stock}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/60">
                      <span className="text-sm font-bold text-emerald-400">{it.price}</span>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. BARRE DE NAVIGATION */}
        {type === "navbar" && (
          <div className="w-full">
            {targetViewport === "mobile" ? (
              data.hasBurger !== false ? (
                /* Menu burger responsive */
                <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between shadow-sm">
                  <span className="font-bold text-indigo-400 text-sm">UnivWeb S3</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <span>☰</span>
                    <span>Menu</span>
                  </button>
                </nav>
              ) : (
                /* Liens desktop tronqués sans burger */
                <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between overflow-hidden shadow-sm">
                  <span className="font-bold text-indigo-400 text-sm shrink-0 mr-2">UnivWeb S3</span>
                  <div className="flex gap-2 text-xs text-slate-400 overflow-hidden whitespace-nowrap">
                    {(data.links || []).map((l, i) => (
                      <span key={i} className="shrink-0 px-1 py-0.5 bg-slate-700/50 rounded text-slate-300">
                        {l}
                      </span>
                    ))}
                  </div>
                </nav>
              )
            ) : (
              /* Vue Desktop / Tablette */
              <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-indigo-400 text-sm shrink-0">UnivWeb S3</span>
                <div className="flex gap-3 text-xs text-slate-300">
                  {(data.links || []).slice(0, 5).map((l, i) => (
                    <span key={i} className="hover:text-white cursor-pointer">{l}</span>
                  ))}
                </div>
              </nav>
            )}
          </div>
        )}

        {/* 3. GROUPES DE BOUTONS D'ACTION */}
        {type === "button_group" && (
          <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
            <p className="text-xs text-slate-300 font-medium">Filtres et actions rapides :</p>
            <div className={`flex gap-2 ${data.wrap !== false ? "flex-wrap" : "flex-nowrap overflow-hidden"}`}>
              {(data.buttons || []).map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded whitespace-nowrap shrink-0 border border-slate-600"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. TABLEAU DE NOTES RESPONSIVE */}
        {type === "responsive_table" && (
          <div className="w-full">
            <div className={`w-full border border-slate-700 rounded ${data.scrollable !== false ? "overflow-x-auto" : "overflow-hidden"}`}>
              <table className={`w-full text-xs text-left border-collapse ${data.scrollable === false ? "table-fixed" : ""}`}>
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    {(data.headers || []).map((h, i) => (
                      <th key={i} className="p-2 border-b border-slate-700 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.rows || []).map((r, i) => (
                    <tr key={i} className="bg-slate-900/80 border-b border-slate-800">
                      {r.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 whitespace-nowrap text-slate-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. BANNIÈRE HERO SECTION */}
        {type === "hero_banner" && (
          <div className="w-full">
            {targetViewport === "mobile" ? (
              data.responsiveText !== false && data.stackOnMobile !== false ? (
                <div className="w-full p-4 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-col items-center gap-2.5 text-center">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{data.title || "Titre Adapté"}</h3>
                    <p className="text-xs text-slate-300">{data.subtitle || "Sous-titre parfaitement dimensionné"}</p>
                  </div>
                  <button type="button" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">
                    {data.cta || "Commencer l'aventure"}
                  </button>
                </div>
              ) : (
                <div className="w-full p-3 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center gap-2 overflow-hidden">
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <h3 className="text-2xl font-black text-white whitespace-nowrap">{data.title || "Titre Débordant"}</h3>
                    <p className="text-xs text-slate-400 truncate">{data.subtitle}</p>
                  </div>
                  <button type="button" className="px-3 py-1 bg-indigo-600 text-white text-xs shrink-0 rounded">
                    {data.cta || "Action"}
                  </button>
                </div>
              )
            ) : (
              <div className="w-full p-5 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{data.title || "Titre de Présentation"}</h3>
                  <p className="text-xs text-slate-300">{data.subtitle}</p>
                </div>
                <button type="button" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shrink-0">
                  {data.cta || "En savoir plus"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. CONTRASTE DE COULEURS WCAG (Forte lisibilité vs Illisible sur blanc) */}
        {type === "contrast_card" && (() => {
          const isHigh = data.highContrast ?? !(data.textColor && data.textColor.includes("slate-400"));
          const title = data.title || "Alerte de Sécurité";
          const body = data.body || "Veuillez vérifier les informations de votre compte.";

          return (
            <div className="w-full p-5 bg-white rounded-lg shadow-md space-y-2.5 border border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${isHigh ? "text-slate-950 font-black" : "text-slate-300 font-normal"}`}>
                  {title}
                </h4>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isHigh ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}>
                  {isHigh ? "Ratio 7.8:1 (WCAG AA)" : "Ratio 1.5:1 (Échec WCAG)"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isHigh ? "text-slate-800 font-medium" : "text-slate-300/80 font-light"}`}>
                {body}
              </p>
            </div>
          );
        })()}

        {/* 7. FOCUS VISIBLE AU CLAVIER */}
        {type === "focus_state" && (() => {
          const hasFocus = data.hasOutline ?? data.hasFocusRing ?? true;
          const label = data.label || "Champ actif au clavier";
          const placeholder = data.placeholder || "Appuyez sur Tab...";

          return (
            <div className="w-full max-w-sm mx-auto p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">{label}</label>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  hasFocus ? "bg-amber-950 text-amber-300 border border-amber-600" : "bg-slate-900 text-slate-500"
                }`}>
                  {hasFocus ? "Focus Actif (Tab)" : "Focus Silencieux"}
                </span>
              </div>
              <input
                type="text"
                readOnly
                placeholder={placeholder}
                className={`w-full px-3 py-2 bg-slate-900 text-xs text-white rounded transition-all ${
                  hasFocus
                    ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-800 border-amber-400"
                    : "border border-slate-700 outline-none ring-0"
                }`}
              />
            </div>
          );
        })()}

        {/* 8. ALERTE DE STATUT ACCESSIBLE (Icône + Texte vs Couleur seule) */}
        {type === "status_alert" && (() => {
          const hasIcon = data.hasIcon ?? data.withIcon ?? true;
          const isDanger = (data.color === "rose") || (data.message && data.message.toLowerCase().includes("échec"));
          const message = data.message || "Statut de l'opération";

          return (
            <div
              className={`w-full p-4 rounded-lg border flex items-center gap-3 ${
                isDanger
                  ? "bg-rose-950/70 border-rose-700 text-rose-100"
                  : "bg-emerald-950/70 border-emerald-700 text-emerald-100"
              }`}
            >
              {hasIcon ? (
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isDanger ? "bg-rose-700 text-white" : "bg-emerald-700 text-white"
                }`}>
                  {isDanger ? "✕" : "✓"}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono italic shrink-0">
                  [Sans icône]
                </span>
              )}
              <div className="text-xs leading-relaxed flex-1">
                <strong className="block font-bold mb-0.5">
                  {isDanger ? "Alerte Système :" : "Notification :"}
                </strong>
                <span>{message}</span>
              </div>
            </div>
          );
        })()}

        {/* 9. ATTRIBUT ALT DES IMAGES (Description détaillée vs Alt vide ou nom de fichier) */}
        {type === "alt_text_demo" && (() => {
          const rawAlt = data.altText || data.alt;
          const hasGoodAlt = data.hasAlt ?? (rawAlt && rawAlt.length > 5 && !rawAlt.includes(".jpg") && !rawAlt.includes(".png"));
          const altDisplay = rawAlt || (hasGoodAlt ? "Histogramme détaillé des notes du S3" : "");
          const caption = data.caption || "Statistiques du projet";

          return (
            <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
              <div className="h-24 bg-slate-900 rounded border border-slate-700 flex flex-col items-center justify-center p-3 text-center">
                <span className="text-xs font-mono font-bold text-slate-300">🖼️ [Image Schéma Pédagogique]</span>
                <div className="mt-2">
                  <span className={`text-[11px] font-mono px-2 py-1 rounded border ${
                    hasGoodAlt
                      ? "bg-emerald-950 text-emerald-300 border-emerald-600 font-bold"
                      : "bg-rose-950 text-rose-300 border-rose-600"
                  }`}>
                    alt="{altDisplay}"
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic text-center">{caption}</p>
            </div>
          );
        })()}

        {/* 10. LIENS D'ACTION EXPLICITES */}
        {type === "link_semantics" && (() => {
          const isExplicit = data.explicit ?? true;
          const title = data.title || "Programme pédagogique";
          const linkText = data.linkText || (isExplicit ? "Télécharger le programme officiel (PDF, 1.2 Mo)" : "Cliquez ici pour tout voir");

          return (
            <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-200">{title}</h4>
              <div className="p-3 bg-slate-900 rounded border border-slate-700/80">
                <span className="text-xs text-indigo-400 font-medium underline flex items-center gap-1.5 cursor-pointer">
                  <span>🔗</span>
                  <span>{linkText}</span>
                </span>
              </div>
            </div>
          );
        })()}

        {/* 11. MESSAGES D'ERREUR DE FORMULAIRE */}
        {type === "form_error" && (() => {
          const isAccessible = data.accessible ?? data.hasMessage ?? true;
          const fieldName = data.fieldName || data.field || "Identifiant";
          const errorMsg = data.errorMsg || data.errorText || "Ce champ est obligatoire et comporte une erreur.";

          return (
            <div className="w-full max-w-sm mx-auto space-y-2">
              <label className="text-xs font-bold text-slate-200 block">{fieldName}</label>
              <input
                type="text"
                readOnly
                value="donnée_invalide"
                className="w-full px-3 py-2 bg-slate-900 border-2 border-rose-500 rounded text-xs text-rose-200 font-mono"
              />
              {isAccessible ? (
                <div className="p-2 bg-rose-950/60 border border-rose-700 rounded text-[11px] text-rose-300 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono italic block">
                  [Aucun message d'aide affiché sous le champ]
                </span>
              )}
            </div>
          );
        })()}

        {/* 12. LABELS VS PLACEHOLDERS (Différence visible éclatante !) */}
        {type === "form_labels" && (() => {
          const hasLabel = data.visibleLabels ?? data.hasLabel ?? false;
          const fields = Array.isArray(data.fields) && data.fields.length > 0
            ? data.fields
            : [
                { label: data.label || "Nom d'utilisateur IUT", placeholder: data.placeholder || "ex: jdupont" },
                { label: "Adresse e-mail étudiante", placeholder: "ex: jean.dupont@iut.fr" },
              ];

          return (
            <div className="w-full max-w-sm mx-auto space-y-3">
              <div className="text-right">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  hasLabel ? "bg-emerald-950 text-emerald-300 border-emerald-600" : "bg-rose-950 text-rose-300 border-rose-600"
                }`}>
                  {hasLabel ? "✓ Labels Visibles" : "✗ Placeholders Seuls"}
                </span>
              </div>
              {fields.map((f, i) => (
                <div key={i} className="space-y-1">
                  {hasLabel && (
                    <label className="text-xs font-bold text-slate-200 block">
                      {f.label}
                    </label>
                  )}
                  <input
                    type="text"
                    readOnly
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 font-mono"
                  />
                </div>
              ))}
            </div>
          );
        })()}

        {/* 13. TYPES D'INPUT HTML5 (Indicateur du clavier mobile déclenché) */}
        {type === "input_types" && (() => {
          const isSemantic = data.semanticType ?? (data.type === "tel" || data.type === "email");
          const label = data.label || "Code de validation";
          const typeAttr = data.type || (isSemantic ? "tel" : "text");

          return (
            <div className="w-full max-w-sm mx-auto space-y-2.5">
              <label className="text-xs font-bold text-slate-200 block">{label}</label>
              <input
                type={typeAttr}
                readOnly
                placeholder="1234"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
              <div className="p-2 rounded border bg-slate-800 text-[11px] font-mono flex items-center justify-between">
                <span className="text-slate-400">Clavier mobile :</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  isSemantic
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : "bg-amber-950 text-amber-300 border border-amber-700"
                }`}>
                  {isSemantic ? "📱 Pavé Numérique / Spécialisé" : "📱 Clavier Texte Standard (AZERTY)"}
                </span>
              </div>
            </div>
          );
        })()}

        {/* 14. INDICATEUR DE CHAMPS REQUIS */}
        {type === "required_indicator" && (() => {
          const hasAsterisk = data.hasAsterisk ?? true;
          const fields = Array.isArray(data.fields) && data.fields.length > 0
            ? data.fields
            : [data.label || "Mot de passe d'accès"];

          return (
            <div className="w-full max-w-sm mx-auto space-y-2.5">
              {hasAsterisk ? (
                <span className="text-[11px] text-rose-400 font-mono block">
                  * Champs obligatoires
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono italic block">
                  [Aucune mention de champ obligatoire]
                </span>
              )}
              {fields.map((f, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">
                    {f} {hasAsterisk && <span className="text-rose-400 font-bold">*</span>}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    readOnly
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                  />
                </div>
              ))}
            </div>
          );
        })()}

        {/* 15. BOUTON DE SOUMISSION / CHARGEMENT */}
        {type === "submit_state" && (() => {
          const hasLoading = data.loadingFeedback ?? data.loading ?? true;
          const buttonText = data.buttonText || data.text || "Valider l'action";

          return (
            <div className="w-full flex flex-col items-center justify-center p-4 space-y-2.5">
              <button
                type="button"
                disabled={hasLoading}
                className={`px-5 py-2.5 rounded text-xs font-bold flex items-center gap-2 ${
                  hasLoading
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
                }`}
              >
                {hasLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin inline-block" />
                )}
                <span>{hasLoading ? "Traitement en cours..." : buttonText}</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                {hasLoading ? "Protection anti-double clic active" : "Aucun retour de chargement (cliquable à l'infini)"}
              </span>
            </div>
          );
        })()}

        {/* 16. TAILLE DE LA ZONE TACTILE (LOI DE FITTS) */}
        {type === "touch_target" && (() => {
          const isLarge = (data.size === "large") || (data.paddingClass && data.paddingClass.includes("py-4"));
          const label = data.label || "Supprimer";
          const icon = data.icon || "🗑️";

          return (
            <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
              <span className="text-[11px] text-slate-400">Simulation d'appui tactile sur smartphone :</span>
              <button
                type="button"
                className={`bg-rose-700 text-white font-bold rounded flex items-center justify-center gap-2 shadow transition-all ${
                  isLarge
                    ? "h-12 px-6 text-sm min-w-[200px]"
                    : "h-5 px-1.5 text-[9px] min-w-[50px]"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isLarge ? "bg-emerald-950 text-emerald-300 border-emerald-600" : "bg-rose-950 text-rose-300 border-rose-600"
              }`}>
                {isLarge ? "✓ Cible 48x48px (Conforme W3C)" : "⚠️ Cible 20x20px (Trop petite)"}
              </span>
            </div>
          );
        })()}

        {/* 17. ESPACEMENT DES ACTIONS CRITIQUES */}
        {type === "action_spacing" && (() => {
          const isSpaced = data.safeDistance ?? data.spaced ?? true;
          const confirmText = data.confirmText || data.primaryText || "Annuler";
          const destructiveText = data.destructiveText || "Supprimer";

          return (
            <div className="w-full p-4 bg-slate-800 rounded border border-slate-700 space-y-3">
              <p className="text-xs text-slate-300 font-medium">Confirmation d'action importante :</p>
              <div className={`flex items-center ${isSpaced ? "justify-between gap-4" : "justify-start gap-0.5"}`}>
                <button type="button" className="px-3 py-2 bg-slate-700 text-white rounded text-xs font-bold">
                  {confirmText}
                </button>
                <button type="button" className="px-3 py-2 bg-rose-700 text-white rounded text-xs font-bold">
                  {destructiveText}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                {isSpaced ? "✓ Marge de sécurité entre les deux boutons" : "⚠️ Boutons collés (risque de fausse manip)"}
              </span>
            </div>
          );
        })()}

        {/* 18. LISIBILITÉ TYPOGRAPHIQUE */}
        {type === "typography_readability" && (() => {
          const isComfortable = data.comfortable ?? true;
          const title = data.title || "Introduction au cours";
          const paragraph = data.paragraph || data.text || "Texte d'explication pédagogique...";

          return (
            <div className="w-full p-4 bg-white text-slate-900 rounded shadow">
              <h4 className="text-xs font-bold text-slate-900 mb-1">{title}</h4>
              <p className={`text-slate-800 ${
                isComfortable
                  ? "max-w-md text-xs leading-relaxed"
                  : "w-full text-[10px] leading-tight tracking-tighter"
              }`}>
                {paragraph}
              </p>
            </div>
          );
        })()}

        {/* 19. HIÉRARCHIE VISUELLE */}
        {type === "card_hierarchy" && (() => {
          const hasHierarchy = data.clearHierarchy ?? data.hasHierarchy ?? true;
          const category = data.category || "RESSOURCE S3";
          const title = data.title || "Projet de Développement Web";
          const date = data.date || "19 nov 2026";
          const author = data.author || data.summary || "Département Informatique";

          return (
            <div className="w-full p-4 bg-slate-800 rounded border border-slate-700 space-y-1.5">
              {hasHierarchy ? (
                <>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {category}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {author} • {date}
                  </p>
                </>
              ) : (
                <div className="text-xs text-slate-300 font-normal space-y-1">
                  <div>{category}</div>
                  <div>{title}</div>
                  <div>{author} - {date}</div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 20. ALIGNEMENT NUMÉRIQUE */}
        {type === "numeric_alignment" && (
          <div className="w-full p-3 bg-slate-800 rounded border border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-1">Élément de compte</th>
                  <th className={`py-1 ${data.alignRight ? "text-right" : "text-left"}`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {(data.items || []).map((it, i) => (
                  <tr key={i} className="text-slate-200">
                    <td className="py-1.5">{it.label}</td>
                    <td className={`py-1.5 font-mono ${data.alignRight ? "text-right font-bold text-emerald-400" : "text-left text-slate-300"}`}>
                      {it.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bouton de vote au bas de la carte (Calé en bas pour alignement parfait) */}
      <div className="mt-auto p-3 bg-slate-900/90 border-t border-slate-800 flex justify-center">
        <button
          type="button"
          onClick={() => onSelect(optionLabel)}
          disabled={showResult}
          className={`w-full py-2.5 px-4 font-sans font-bold text-sm uppercase tracking-wider transition-all rounded ${
            isSelected
              ? "bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.6)]"
              : "pixel-btn hover:brightness-110 !font-sans"
          }`}
        >
          {isSelected ? `✓ CHOIX ${optionLabel} SÉLECTIONNÉ` : `CHOISIR L'INTERFACE ${optionLabel}`}
        </button>
      </div>
    </div>
  );
}
