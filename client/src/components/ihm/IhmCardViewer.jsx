// client/src/components/ihm/IhmCardViewer.jsx

export default function IhmCardViewer({
  variant,
  optionLabel,
  onSelect,
  isSelected,
  showResult,
  isCorrect,
  targetViewport = "desktop",
}) {
  const { type, data } = variant;

  return (
    <div
      className={`relative flex flex-col bg-slate-900 border-2 rounded-lg transition-all shadow-lg overflow-hidden ${
        isSelected
          ? isCorrect
            ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            : "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
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

      {/* Contenu Web Moderne Réaliste (Testé par le joueur) */}
      <div className="p-4 bg-slate-950 text-slate-100 min-h-[240px] flex flex-col justify-center overflow-hidden font-sans">
        {/* 1. GRILLE DE CARTES PRODUITS */}
        {type === "product_grid" && (
          <div className="w-full">
            {targetViewport === "mobile" ? (
              data.fluid ? (
                /* Option A Mobile : Liste verticale fluide, lisible et ergonomique */
                <div className="space-y-2 w-full">
                  <div className="flex flex-col gap-2.5 w-full">
                    {data.items.map((it, idx) => (
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
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
                    <span>✓</span>
                    <span>Affichage 1 colonne adapté à la largeur mobile (aucun débordement)</span>
                  </div>
                </div>
              ) : (
                /* Option B Mobile : Ligne rigide non responsive qui déborde */
                <div className="space-y-2 w-full">
                  <div className="flex flex-row gap-3 w-full overflow-hidden">
                    {data.items.map((it, idx) => (
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
                  <div className="text-[11px] text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Débordement horizontal masqué (cartes 2 et 3 tronquées sans scroll)</span>
                  </div>
                </div>
              )
            ) : (
              /* Vue Desktop / Tablette */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {data.items.map((it, idx) => (
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
              data.hasBurger ? (
                /* Option B Mobile : Menu burger avec tiroir tactile */
                <div className="space-y-2 w-full">
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
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
                    <span>✓</span>
                    <span>Menu burger adapté aux écrans tactiles étroits (375 px)</span>
                  </div>
                </div>
              ) : (
                /* Option A Mobile : Liens desktop tronqués sur petit écran */
                <div className="space-y-2 w-full">
                  <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between overflow-hidden shadow-sm">
                    <span className="font-bold text-indigo-400 text-sm shrink-0 mr-2">UnivWeb S3</span>
                    <div className="flex gap-2 text-xs text-slate-400 overflow-hidden whitespace-nowrap">
                      {data.links.map((l, i) => (
                        <span key={i} className="shrink-0 px-1 py-0.5 bg-slate-700/50 rounded text-slate-300">
                          {l}
                        </span>
                      ))}
                    </div>
                  </nav>
                  <div className="text-[11px] text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Liens de navigation tronqués sans menu responsive mobile</span>
                  </div>
                </div>
              )
            ) : (
              /* Vue Desktop */
              <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-indigo-400 text-sm shrink-0">UnivWeb S3</span>
                <div className="flex gap-3 text-xs text-slate-300">
                  {data.links.slice(0, 5).map((l, i) => (
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
            <p className="text-xs text-slate-300">Actions sur le dossier étudiant :</p>
            <div className={`flex gap-2 ${data.wrap ? "flex-wrap" : "flex-nowrap overflow-hidden"}`}>
              {data.buttons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded whitespace-nowrap shrink-0 border border-slate-600"
                >
                  {btn}
                </button>
              ))}
            </div>
            {targetViewport === "mobile" && (
              <p className={`text-[11px] ${data.wrap ? "text-emerald-400" : "text-rose-400"}`}>
                {data.wrap ? "✓ Flex-wrap : les boutons s'empilent sans déborder" : "⚠️ Flex-nowrap : bouton tronqué hors de l'écran"}
              </p>
            )}
          </div>
        )}

        {/* 4. TABLEAU DE NOTES RESPONSIVE */}
        {type === "responsive_table" && (
          <div className="w-full space-y-2">
            <div className={`w-full border border-slate-700 rounded ${data.scrollable ? "overflow-x-auto" : "overflow-hidden"}`}>
              <table className={`w-full text-xs text-left border-collapse ${!data.scrollable ? "table-fixed" : ""}`}>
                <thead className="bg-slate-800 text-slate-200">
                  <tr>
                    {data.headers.map((h, i) => (
                      <th key={i} className="p-2 border-b border-slate-700 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r, i) => (
                    <tr key={i} className="bg-slate-900/80 border-b border-slate-800">
                      {r.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 whitespace-nowrap text-slate-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {targetViewport === "mobile" && (
              <p className={`text-[11px] font-mono ${data.scrollable ? "text-emerald-400" : "text-rose-400"}`}>
                {data.scrollable ? "↔ Défilement horizontal fluide préservant la lisibilité" : "⚠️ Colonnes écrasées et contenu tronqué sans défilement"}
              </p>
            )}
          </div>
        )}

        {/* 5. BANNIÈRE HERO SECTION */}
        {type === "hero_banner" && (
          <div className="w-full">
            {targetViewport === "mobile" ? (
              data.stackOnMobile ? (
                <div className="w-full p-4 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-col items-center gap-3 text-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{data.title}</h3>
                    <p className="text-xs text-slate-300">{data.subtitle}</p>
                  </div>
                  <div className="w-full max-w-[200px] h-12 bg-indigo-800/60 rounded flex items-center justify-center text-indigo-300 font-mono text-xs border border-indigo-600">
                    [Illustration responsive]
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="w-full p-3 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center gap-2">
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <h3 className="text-xs font-bold text-white truncate">{data.title}</h3>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{data.subtitle}</p>
                    </div>
                    <div className="w-24 h-12 bg-indigo-800/60 rounded flex items-center justify-center text-indigo-300 font-mono text-[10px] shrink-0 border border-indigo-600">
                      [Illustration]
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-400">
                    ⚠️ Colonnes rigides 50/50 écrasant le texte sur mobile
                  </p>
                </div>
              )
            ) : (
              <div className="w-full p-4 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-bold text-white">{data.title}</h3>
                  <p className="text-xs text-slate-300">{data.subtitle}</p>
                </div>
                <div className="w-24 h-16 bg-indigo-800/60 rounded flex items-center justify-center text-indigo-300 font-mono text-xs shrink-0 border border-indigo-600">
                  [Illustration]
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CONTRASTE DE COULEURS WCAG */}
        {type === "contrast_card" && (
          <div className="w-full p-5 bg-white rounded-lg shadow space-y-2">
            <h4 className={`text-base font-bold ${data.textColor}`}>Module R3.01 - Développement Web</h4>
            <p className={`text-xs ${data.descColor}`}>
              Maîtrise de l'accessibilité numérique, des contrastes de couleurs et des normes WCAG 2.1 niveau AA.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-slate-500">
              {data.ratioLabel}
            </div>
          </div>
        )}

        {/* 7. FOCUS VISIBLE AU CLAVIER */}
        {type === "focus_state" && (
          <div className="w-full p-5 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center space-y-3">
            <span className="text-xs text-slate-400">Simulation de navigation clavier (Touche Tab appuyée) :</span>
            <button
              type="button"
              className={`px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded transition-all ${
                data.hasFocusRing ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-800 outline-none" : "outline-none"
              }`}
            >
              {data.label}
            </button>
            <p className={`text-[11px] font-mono ${data.hasFocusRing ? "text-emerald-400" : "text-rose-400"}`}>
              {data.hasFocusRing ? "✓ Anneau de focus visible (accessible clavier)" : "⚠️ Outline supprimé sans indicateur visible"}
            </p>
          </div>
        )}

        {/* 8. ALERTE DE STATUT ACCESSIBLE */}
        {type === "status_alert" && (
          <div className="w-full p-4 rounded-lg bg-emerald-900/90 border border-emerald-600 text-emerald-100 flex items-center gap-3">
            {data.withIcon && (
              <span className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                ✓
              </span>
            )}
            <div className="text-xs">
              {data.withPrefix && <strong className="font-bold mr-1">Succès :</strong>}
              <span>{data.message}</span>
            </div>
          </div>
        )}

        {/* 9. ATTRIBUT ALT DES IMAGES */}
        {type === "alt_text_demo" && (
          <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
            <div className="h-24 bg-slate-700 rounded flex flex-col items-center justify-center text-center p-2 text-slate-300">
              <span className="text-xs font-mono font-bold">[Image Schéma Technique]</span>
              <span className="text-[11px] text-amber-300 font-mono mt-1">alt="{data.altText}"</span>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center">{data.caption}</p>
          </div>
        )}

        {/* 10. LIENS D'ACTION EXPLICITES */}
        {type === "link_semantics" && (
          <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-slate-200">Ressources du cours S3 :</h4>
            <ul className="space-y-1.5 text-xs">
              {data.links.map((l, i) => (
                <li key={i} className="flex items-center gap-1.5 text-indigo-400 hover:underline cursor-pointer">
                  <span>🔗</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 11. MESSAGES D'ERREUR DE FORMULAIRE */}
        {type === "form_error" && (
          <div className="w-full max-w-sm mx-auto space-y-1.5">
            <label className="text-xs font-bold text-slate-200">{data.field}</label>
            <input
              type="text"
              readOnly
              value={data.value}
              className="w-full px-3 py-2 bg-slate-800 border-2 border-rose-500 rounded text-xs text-rose-200 font-mono"
            />
            {data.hasMessage ? (
              <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                <span>⚠️</span>
                <span>{data.errorText}</span>
              </p>
            ) : (
              <p className="text-[11px] text-rose-400 italic">
                (Aucun message explicatif pour corriger l'erreur)
              </p>
            )}
          </div>
        )}

        {/* 12. LABELS VS PLACEHOLDERS */}
        {type === "form_labels" && (
          <div className="w-full max-w-sm mx-auto space-y-1">
            {data.hasLabel ? (
              <label className="text-xs font-bold text-slate-200 block">{data.label}</label>
            ) : (
              <span className="text-[10px] text-rose-400 font-mono block">
                ⚠️ Absence de balise &lt;label&gt; permanente
              </span>
            )}
            <input
              type="text"
              placeholder={data.placeholder}
              readOnly
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500"
            />
          </div>
        )}

        {/* 13. TYPES D'INPUT HTML5 */}
        {type === "input_types" && (
          <div className="w-full max-w-sm mx-auto space-y-2">
            <label className="text-xs font-bold text-slate-200 block">{data.label}</label>
            <input
              type={data.inputType}
              inputMode={data.inputMode}
              placeholder="Ex : 62300"
              readOnly
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 font-mono"
            />
            <p className="text-[11px] text-amber-300 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
              💡 {data.helper}
            </p>
          </div>
        )}

        {/* 14. INDICATEUR DE CHAMPS REQUIS */}
        {type === "required_indicator" && (
          <div className="w-full max-w-sm mx-auto space-y-2">
            {data.legend && <span className="text-[11px] text-rose-400 font-mono block">{data.legend}</span>}
            <label className="text-xs font-bold text-slate-200 block">
              {data.label}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              readOnly
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200"
            />
          </div>
        )}

        {/* 15. BOUTON DE SOUMISSION / CHARGEMENT */}
        {type === "submit_state" && (
          <div className="w-full flex flex-col items-center justify-center p-4 space-y-2">
            <button
              type="button"
              disabled={data.loading}
              className={`px-5 py-2.5 rounded text-xs font-bold flex items-center gap-2 ${
                data.loading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow"
              }`}
            >
              {data.hasSpinner && (
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin inline-block" />
              )}
              <span>{data.text}</span>
            </button>
            <p className="text-[11px] text-slate-400">
              {data.loading ? "✓ Bouton désactivé (anti-double clic)" : "⚠️ Clics multiples non protégés"}
            </p>
          </div>
        )}

        {/* 16. TAILLE DE LA ZONE TACTILE (LOI DE FITTS) */}
        {type === "touch_target" && (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-800 rounded border border-slate-700 space-y-2">
            <span className="text-[11px] text-slate-400">Zone tactile du bouton (Écran smartphone) :</span>
            <button
              type="button"
              className={`bg-rose-700 text-white font-bold rounded flex items-center justify-center ${data.paddingClass}`}
            >
              {data.label}
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              {data.size === "standard" ? "Zone conforme ≥ 44x44px" : "Zone trop étroite (< 44px)"}
            </span>
          </div>
        )}

        {/* 17. ESPACEMENT DES ACTIONS */}
        {type === "action_spacing" && (
          <div className="w-full p-4 bg-slate-800 rounded border border-slate-700 space-y-3">
            <p className="text-xs text-slate-300">Confirmation de validation du module :</p>
            <div className={`flex ${data.spaced ? "justify-between" : "justify-start gap-1"}`}>
              <button type="button" className="px-3 py-2 bg-indigo-600 text-white rounded text-xs font-bold">
                {data.primaryText}
              </button>
              <button type="button" className="px-3 py-2 bg-rose-700 text-white rounded text-xs font-bold">
                {data.destructiveText}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {data.spaced ? "✓ Séparation claire entre validation et suppression" : "⚠️ Risque de clic erroné par proximité"}
            </p>
          </div>
        )}

        {/* 18. LISIBILITÉ TYPOGRAPHIQUE */}
        {type === "typography_readability" && (
          <div className="w-full p-4 bg-white text-slate-900 rounded shadow">
            <p className={`text-xs ${data.maxWidth} ${data.lineHeight} text-slate-800`}>
              {data.text}
            </p>
          </div>
        )}

        {/* 19. HIÉRARCHIE VISUELLE */}
        {type === "card_hierarchy" && (
          <div className="w-full p-4 bg-slate-800 rounded border border-slate-700 space-y-2">
            <span className={data.hasHierarchy ? "text-[10px] text-slate-400 font-mono uppercase" : "text-xs text-slate-200"}>
              {data.date}
            </span>
            <h4 className={data.hasHierarchy ? "text-sm font-bold text-white tracking-wide" : "text-xs font-normal text-slate-200"}>
              {data.title}
            </h4>
            <p className={data.hasHierarchy ? "text-xs text-slate-300 leading-relaxed" : "text-xs font-normal text-slate-200"}>
              {data.summary}
            </p>
          </div>
        )}

        {/* 20. ALIGNEMENT NUMÉRIQUE */}
        {type === "numeric_alignment" && (
          <div className="w-full p-3 bg-slate-800 rounded border border-slate-700">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-1">Service Cloud</th>
                  <th className={`py-1 ${data.alignRight ? "text-right" : "text-left"}`}>Coût mensuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.items.map((it, i) => (
                  <tr key={i} className="text-slate-200">
                    <td className="py-1.5">{it.label}</td>
                    <td className={`py-1.5 font-mono ${data.alignRight ? "text-right" : "text-left font-bold text-amber-300"}`}>
                      {it.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bouton de vote biseauté Pixel Art au bas de la carte */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex justify-center">
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
