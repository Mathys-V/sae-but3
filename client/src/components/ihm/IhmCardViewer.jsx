// client/src/components/ihm/IhmCardViewer.jsx

export default function IhmCardViewer({ variant, optionLabel, onSelect, isSelected, showResult, isCorrect }) {
  const { type, data } = variant;

  return (
    <div
      className={`relative flex flex-col bg-slate-900 border-2 transition-all shadow-lg ${
        isSelected
          ? isCorrect
            ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            : "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      {/* En-tête de la maquette (Style navigateur / fenêtre moderne) */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-300 font-bold ml-1">
            Interface {optionLabel}
          </span>
        </div>

        {showResult && (
          <span
            className={`text-xs font-vcr font-bold px-2 py-0.5 rounded ${
              isCorrect ? "bg-emerald-950 text-emerald-300 border border-emerald-600" : "bg-rose-950 text-rose-300 border border-rose-600"
            }`}
          >
            {isCorrect ? "✓ ERGONOMIQUE" : "✗ PIÈGE DÉTECTÉ"}
          </span>
        )}
      </div>

      {/* Contenu Web Moderne Réaliste (Testé par le joueur) */}
      <div className="p-4 bg-slate-950 text-slate-100 min-h-[220px] flex flex-col justify-center overflow-hidden">
        {type === "product_grid" && (
          <div className={data.fluid ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full" : "flex flex-row gap-3 w-full overflow-hidden"}>
            {data.items.map((it, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg bg-slate-800 border border-slate-700 flex flex-col justify-between ${
                  !data.fluid ? "w-[240px] shrink-0" : ""
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{it.tag}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{it.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{it.stock}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/60">
                  <span className="text-sm font-bold text-emerald-400">{it.price}</span>
                  <button type="button" className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500">
                    Acheter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "navbar" && (
          <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
            <span className="font-bold text-indigo-400 text-sm shrink-0">UnivWeb S3</span>
            {data.hasBurger ? (
              <div className="flex items-center">
                <div className="hidden sm:flex gap-3 text-xs text-slate-300">
                  {data.links.slice(0, 4).map((l, i) => (
                    <span key={i} className="hover:text-white cursor-pointer">{l}</span>
                  ))}
                </div>
                <button type="button" className="sm:hidden px-2 py-1 bg-slate-700 text-white rounded text-xs flex items-center gap-1">
                  <span>☰</span>
                  <span>Menu</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-4 text-xs text-slate-300 overflow-hidden whitespace-nowrap">
                {data.links.map((l, i) => (
                  <span key={i} className="shrink-0">{l}</span>
                ))}
              </div>
            )}
          </nav>
        )}

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
          </div>
        )}

        {type === "responsive_table" && (
          <div className={`w-full ${data.scrollable ? "overflow-x-auto" : "overflow-hidden"}`}>
            <table className="w-full text-xs text-left border-collapse border border-slate-700">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  {data.headers.map((h, i) => (
                    <th key={i} className="p-2 border border-slate-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => (
                  <tr key={i} className="bg-slate-900/80">
                    {r.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 border border-slate-700 whitespace-nowrap text-slate-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {type === "hero_banner" && (
          <div className={`w-full p-4 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex ${data.stackOnMobile ? "flex-col sm:flex-row" : "flex-row"} items-center gap-4`}>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-bold text-white">{data.title}</h3>
              <p className="text-xs text-slate-300">{data.subtitle}</p>
            </div>
            <div className="w-24 h-16 bg-indigo-800/60 rounded flex items-center justify-center text-indigo-300 font-mono text-xs shrink-0 border border-indigo-600">
              [Illustration]
            </div>
          </div>
        )}

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
          </div>
        )}

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

        {type === "alt_text_demo" && (
          <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
            <div className="h-24 bg-slate-700 rounded flex flex-col items-center justify-center text-center p-2 text-slate-300">
              <span className="text-xs font-mono font-bold">[Image Schéma Technique]</span>
              <span className="text-[10px] text-amber-300 font-mono mt-1">alt="{data.altText}"</span>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center">{data.caption}</p>
          </div>
        )}

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

        {type === "form_error" && (
          <div className="w-full max-w-sm mx-auto space-y-1.5">
            <label className="text-xs font-bold text-slate-200">{data.field}</label>
            <input
              type="text"
              readOnly
              value={data.value}
              className="w-full px-3 py-2 bg-slate-800 border-2 border-rose-500 rounded text-xs text-rose-200 font-mono"
            />
            {data.hasMessage && (
              <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                <span>⚠️</span>
                <span>{data.errorText}</span>
              </p>
            )}
          </div>
        )}

        {type === "form_labels" && (
          <div className="w-full max-w-sm mx-auto space-y-1">
            {data.hasLabel && <label className="text-xs font-bold text-slate-200 block">{data.label}</label>}
            <input
              type="text"
              placeholder={data.placeholder}
              readOnly
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500"
            />
          </div>
        )}

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
            <p className="text-[10px] text-amber-400 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
              💡 {data.helper}
            </p>
          </div>
        )}

        {type === "required_indicator" && (
          <div className="w-full max-w-sm mx-auto space-y-2">
            {data.legend && <span className="text-[10px] text-rose-400 font-mono block">{data.legend}</span>}
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

        {type === "submit_state" && (
          <div className="w-full flex flex-col items-center justify-center p-4">
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
          </div>
        )}

        {type === "touch_target" && (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-800 rounded border border-slate-700 space-y-2">
            <span className="text-[11px] text-slate-400">Zone tactile du bouton (Écran smartphone) :</span>
            <button
              type="button"
              className={`bg-rose-700 text-white font-bold rounded flex items-center justify-center ${data.paddingClass}`}
            >
              {data.label}
            </button>
          </div>
        )}

        {type === "action_spacing" && (
          <div className="w-full p-4 bg-slate-800 rounded border border-slate-700 space-y-3">
            <p className="text-xs text-slate-300">Confirmation de validation du module :</p>
            <div className={`flex ${data.spaced ? "justify-between" : "justify-start gap-0.5"}`}>
              <button type="button" className="px-3 py-2 bg-indigo-600 text-white rounded text-xs font-bold">
                {data.primaryText}
              </button>
              <button type="button" className="px-3 py-2 bg-rose-700 text-white rounded text-xs font-bold">
                {data.destructiveText}
              </button>
            </div>
          </div>
        )}

        {type === "typography_readability" && (
          <div className="w-full p-4 bg-white text-slate-900 rounded shadow">
            <p className={`text-xs ${data.maxWidth} ${data.lineHeight} text-slate-800`}>
              {data.text}
            </p>
          </div>
        )}

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
          className={`w-full py-2.5 px-4 font-vcr font-bold text-sm uppercase tracking-wider transition-all ${
            isSelected
              ? "bg-amber-600 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_2px_0_#78350f]"
              : "pixel-btn hover:brightness-110"
          }`}
        >
          {isSelected ? `✓ CHOIX ${optionLabel} SÉLECTIONNÉ` : `CHOISIR L'INTERFACE ${optionLabel}`}
        </button>
      </div>
    </div>
  );
}
