// client/src/game/ihm/components/IhmCardScenes.jsx

import { SceneRenderer } from "./IhmScenes.jsx";

function SceneCard({ data }) {
  return <SceneRenderer data={data} />;
}

function ProductGrid({ data, targetViewport }) {
  const items = data.items || [];

  if (targetViewport === "mobile") {
    if (data.fluid !== false) {
      return (
        <div className="w-full">
          <div className="flex flex-col gap-2.5 w-full">
            {items.map((it) => (
              <div
                key={it.name}
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
        </div>
      );
    }
    return (
      <div className="w-full">
        <div className="flex flex-row gap-3 w-full overflow-hidden">
          {items.map((it) => (
            <div
              key={it.name}
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
      </div>
    );
  }

  if (targetViewport === "tablet") {
    return (
      <div className="w-full">
        <div className={`grid gap-3 w-full ${data.fluid !== false ? "grid-cols-2" : "grid-cols-4"}`}>
          {items.map((it) => (
            <div
              key={it.name}
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
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {items.map((it) => (
          <div
            key={it.name}
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
    </div>
  );
}

function NavBar({ data, targetViewport }) {
  const links = data.links || [];

  if (targetViewport === "mobile") {
    if (data.hasBurger !== false) {
      return (
        <div className="w-full">
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
        </div>
      );
    }
    return (
      <div className="w-full">
        <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between overflow-hidden shadow-sm">
          <span className="font-bold text-indigo-400 text-sm shrink-0 mr-2">UnivWeb S3</span>
          <div className="flex gap-2 text-xs text-slate-400 overflow-hidden whitespace-nowrap">
            {links.map((l) => (
              <span key={l} className="shrink-0 px-1 py-0.5 bg-slate-700/50 rounded text-slate-300">
                {l}
              </span>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full">
      <nav className="w-full bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
        <span className="font-bold text-indigo-400 text-sm shrink-0">UnivWeb S3</span>
        <div className="flex gap-3 text-xs text-slate-300">
          {links.slice(0, 5).map((l) => (
            <span key={l} className="hover:text-white cursor-pointer">{l}</span>
          ))}
        </div>
      </nav>
    </div>
  );
}

function ButtonGroup({ data }) {
  return (
  <div className="w-full p-3.5 bg-slate-800 rounded-lg border border-slate-700 space-y-2.5">
    {data.hasSearch && (
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-400">
        <svg aria-hidden="true" className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-slate-400">Rechercher une ressource...</span>
      </div>
    )}
    <p className="text-xs text-slate-300 font-medium">Filtres et actions rapides :</p>
    <div className={`flex gap-2 ${data.wrap !== false ? "flex-wrap" : "flex-nowrap overflow-hidden"}`}>
      {(data.buttons || []).map((btn) => (
        <button
          key={btn}
          type="button"
          className="px-2.5 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded whitespace-nowrap shrink-0 border border-slate-600"
        >
          {btn}
        </button>
      ))}
    </div>
  </div>
  );
}

function ResponsiveTable({ data }) {
  return (
  <div className="w-full">
    <div className={`w-full border border-slate-700 rounded ${data.scrollable !== false ? "overflow-x-auto" : "overflow-hidden"}`}>
      <table className={`w-full text-xs text-left border-collapse ${data.scrollable === false ? "table-fixed" : ""}`}>
        <thead className="bg-slate-800 text-slate-200">
          <tr>
            {(data.headers || []).map((h) => (
              <th key={h} className="p-2 border-b border-slate-700 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data.rows || []).map((r) => (
            <tr key={r.join("|")} className="bg-slate-900/80 border-b border-slate-800">
              {r.map((cell) => (
                <td key={cell} className="p-2 whitespace-nowrap text-slate-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

function HeroBanner({ data, targetViewport }) {
  if (targetViewport === "mobile") {
    if (data.responsiveText !== false && data.stackOnMobile !== false) {
      return (
        <div className="w-full">
          <div className="w-full p-4 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-col items-center gap-2.5 text-center">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{data.title || "Titre Adapté"}</h3>
              <p className="text-xs text-slate-300">{data.subtitle || "Sous-titre parfaitement dimensionné"}</p>
            </div>
            <button type="button" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">
              {data.cta || "Commencer l'aventure"}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full">
        <div className="w-full p-3 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center gap-2 overflow-hidden">
          <div className="flex-1 space-y-0.5 min-w-0">
            <h3 className="text-2xl font-black text-white whitespace-nowrap">{data.title || "Titre Débordant"}</h3>
            <p className="text-xs text-slate-400 truncate">{data.subtitle}</p>
          </div>
          <button type="button" className="px-3 py-1 bg-indigo-600 text-white text-xs shrink-0 rounded">
            {data.cta || "Action"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full p-5 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-lg border border-indigo-900/50 flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">{data.title || "Titre de Présentation"}</h3>
          <p className="text-xs text-slate-300">{data.subtitle}</p>
        </div>
        <button type="button" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shrink-0">
          {data.cta || "En savoir plus"}
        </button>
      </div>
    </div>
  );
}

function ContrastCard({ data }) {
  const isHigh = data.highContrast ?? !(data.textColor?.includes("slate-400"));
  const title = data.title || "Alerte de Sécurité";
  const body = data.body || "Veuillez vérifier les informations de votre compte.";

  return (
    <div className="w-full p-5 bg-white rounded-lg shadow-md space-y-2.5 border border-slate-200">
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-bold ${isHigh ? "text-slate-950 font-black" : "text-slate-300 font-normal"}`}>
          {title}
        </h4>
      </div>
      <p className={`text-xs leading-relaxed ${isHigh ? "text-slate-800 font-medium" : "text-slate-300/80 font-light"}`}>
        {body}
      </p>
    </div>
  );
}

function FocusState({ data }) {
  const hasFocus = data.hasOutline ?? data.hasFocusRing ?? true;
  const label = data.label || "Champ actif au clavier";
  const placeholder = data.placeholder || "Appuyez sur Tab...";

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200">{label}</label>
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
}

function StatusAlert({ data }) {
  const hasIcon = data.hasIcon ?? data.withIcon ?? true;
  const isDanger = (data.color === "rose") || (data.message?.toLowerCase().includes("échec"));
  const message = data.message || "Statut de l'opération";

  return (
    <div
      className={`w-full p-4 rounded-lg border flex items-center gap-3 ${
        isDanger
          ? "bg-rose-950/70 border-rose-700 text-rose-100"
          : "bg-emerald-950/70 border-emerald-700 text-emerald-100"
      }`}
    >
      {hasIcon && (
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          isDanger ? "bg-rose-700 text-white" : "bg-emerald-700 text-white"
        }`}>
          {isDanger ? "✕" : "✓"}
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
}

function AltTextDemo({ data }) {
  const rawAlt = data.altText || data.alt;
  const hasGoodAlt = data.hasAlt ?? (rawAlt && rawAlt.length > 5 && !rawAlt.includes(".jpg") && !rawAlt.includes(".png"));
  const altDisplay = rawAlt || (hasGoodAlt ? "Histogramme détaillé des notes du S3" : "");
  const caption = data.caption || "Statistiques du projet";

  return (
    <div className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
      <div className="h-24 bg-slate-900 rounded border border-slate-700 flex flex-col items-center justify-center p-3 text-center">
        <span className="text-xs font-mono font-bold text-slate-300">
          {data.imageLabel || "🖼️ Schéma d'architecture technique"}
        </span>
        <div className="mt-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 font-bold">
            alt="{altDisplay}"
          </span>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 italic text-center">{caption}</p>
    </div>
  );
}

function LinkSemantics({ data }) {
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
}

function FormError({ data }) {
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
      {isAccessible && (
        <div className="p-2 bg-rose-950/60 border border-rose-700 rounded text-[11px] text-rose-300 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

function FormLabels({ data }) {
  const hasLabel = data.visibleLabels ?? data.hasLabel ?? false;
  const fields = Array.isArray(data.fields) && data.fields.length > 0
    ? data.fields
    : [
        { label: data.label || "Nom d'utilisateur IUT", placeholder: data.placeholder || "ex: jdupont" },
        { label: "Adresse e-mail étudiante", placeholder: "ex: jean.dupont@iut.fr" },
      ];

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {fields.map((f) => (
        <div key={f.label} className="space-y-1">
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
}

function InputTypes({ data }) {
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
      <div className="p-2 rounded border border-slate-700 bg-slate-900 text-[11px] font-mono flex items-center justify-between">
        <span className="text-slate-400">Attribut HTML5 :</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-bold">
          type="{typeAttr}"
        </span>
      </div>
    </div>
  );
}

function RequiredIndicator({ data }) {
  const hasAsterisk = data.hasAsterisk ?? true;
  const fields = Array.isArray(data.fields) && data.fields.length > 0
    ? data.fields
    : [data.label || "Mot de passe d'accès"];

  return (
    <div className="w-full max-w-sm mx-auto space-y-2.5">
      {hasAsterisk && (
        <span className="text-[11px] text-rose-400 font-mono block">
          * Champs obligatoires
        </span>
      )}
      {fields.map((f) => (
        <div key={f} className="space-y-1">
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
}

function SubmitState({ data }) {
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
    </div>
  );
}

function TouchTarget({ data }) {
  const isLarge = (data.size === "large") || (data.paddingClass?.includes("py-4"));
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
    </div>
  );
}

function ActionSpacing({ data }) {
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
    </div>
  );
}

function TypographyReadability({ data }) {
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
}

function CardHierarchy({ data }) {
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
}

function NumericAlignment({ data }) {
  return (
  <div className="w-full p-3 bg-slate-800 rounded border border-slate-700">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-slate-700 text-slate-400">
          <th className="text-left py-1">{(data.headers || [])[0] || "Élément de compte"}</th>
          <th className={`py-1 ${data.alignRight ? "text-right" : "text-left"}`}>
            {(data.headers || [])[1] || "Total"}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-700/50">
        {(data.items || []).map((it) => (
          <tr key={it.label} className="text-slate-200">
            <td className="py-1.5">{it.label}</td>
            <td className={`py-1.5 font-mono ${data.alignRight ? "text-right font-bold text-emerald-400" : "text-left text-slate-300"}`}>
              {it.cost}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

function OpticalCentering({ data }) {
  const isCentered = data.opticalCompensation ?? data.opticallyCentered ?? true;
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
      <span className="text-xs font-semibold text-slate-300">
        {data.title || "Lecteur Multimédia (Audio / Vidéo)"}
      </span>
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-900/40 flex items-center justify-center border border-indigo-400/30">
          <svg
            aria-hidden="true"
            className={`w-7 h-7 text-white fill-current transition-transform ${
              isCentered ? "translate-x-[2.5px]" : "translate-x-0"
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 font-mono">
        {data.caption || "Bouton d'action : Lancer la ressource"}
      </p>
    </div>
  );
}

function NestedBorderRadius({ data }) {
  const isProportional = data.proportionalRadius ?? data.nestedMath ?? true;
  return (
    <div className="w-full flex justify-center p-2">
      <div className="w-full max-w-[320px] p-3.5 bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-md">
        <div
          className={`p-3 bg-slate-900 border border-slate-700/80 transition-all ${
            isProportional ? "rounded-lg" : "rounded-2xl"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              SAE
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">Projet Web BUT 3</h4>
              <p className="text-[10px] text-slate-400">Ressource R3.01 - 4 crédits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpticalTracking({ data }) {
  const hasTracking = data.hasTracking ?? data.opticalTracking ?? true;
  return (
    <div className="w-full p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 ${
            hasTracking ? "tracking-widest" : "tracking-tighter"
          }`}
        >
          {data.badgeText || "MODULE PREMIUM"}
        </span>
        <span className="text-xs text-slate-400">Ressource R3.01</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">Développement Web Avancé</h4>
        <p className="text-xs text-slate-400 mt-1">
          Typographie en capitales avec compensation d'approche optique.
        </p>
      </div>
    </div>
  );
}

function OpticalLineHeight({ data }) {
  const isRelaxed = data.isRelaxed ?? data.opticalLineHeight ?? true;
  return (
    <div className="w-full p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-left">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          {data.title || "Consigne d'évaluation SAE"}
        </h4>
      </div>
      <p
        className={`text-xs text-slate-300 font-sans ${
          isRelaxed ? "leading-relaxed" : "leading-none"
        }`}
      >
        {data.text ||
          "L'ergonomie des interfaces numériques exige une lisibilité optimale. Un espacement vertical adapté entre les lignes empêche les jambages de se chevaucher lors de la lecture prolongée de documents pédagogiques."}
      </p>
    </div>
  );
}

function SubtleContrast({ data }) {
  const isCompliant = data.isCompliant ?? data.wcagPass ?? true;
  return (
    <div className="w-full p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-left">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-white">{data.cardTitle || "Statut de soumission"}</h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
          En ligne
        </span>
      </div>
      <p className="text-xs text-slate-200">
        Dernière modification enregistrée sur le serveur Git.
      </p>
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Horodatage :</span>
        <span className={`font-mono ${isCompliant ? "text-slate-300 font-medium" : "text-slate-600 font-normal"}`}>
          19/11/2026 à 14:32:00
        </span>
      </div>
    </div>
  );
}

function GestaltProximity({ data }) {
  const isGrouped = data.isGrouped ?? data.correctProximity ?? true;
  return (
    <div className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 text-left">
      <div className="text-xs text-slate-400 pb-2 border-b border-slate-800/80">
        Section 1 : Introduction générale aux IHM
      </div>
      <h4
        className={`text-xs font-bold text-amber-400 uppercase tracking-wide ${
          isGrouped ? "mt-5 mb-1" : "my-3.5"
        }`}
      >
        Section 2 : Critères de Bastien et Scapin
      </h4>
      <p className="text-xs text-slate-300 leading-snug">
        Le guidage et la charge de travail définissent la facilité d'apprentissage d'un outil web par l'étudiant.
      </p>
    </div>
  );
}

function CheckboxMultiline({ data }) {
  const isTopAligned = data.isTopAligned ?? data.topAligned ?? true;
  return (
    <div className="w-full p-4 bg-slate-900 rounded-xl border border-slate-800 text-left">
      <label
        className={`flex gap-3 cursor-pointer select-none ${
          isTopAligned ? "items-start" : "items-center"
        }`}
      >
        <input
          type="checkbox"
          defaultChecked
          disabled
          className={`w-4 h-4 rounded border-slate-600 text-indigo-600 bg-slate-800 shrink-0 ${
            isTopAligned ? "mt-0.5" : "mt-0"
          }`}
        />
        <span className="text-xs text-slate-300 leading-relaxed">
          {data.label ||
            "J'atteste avoir pris connaissance du règlement des examens et m'engage à respecter les consignes de confidentialité et de propriété intellectuelle."}
        </span>
      </label>
    </div>
  );
}

function ElevationShadow({ data }) {
  const isDiffuse = data.isDiffuse ?? data.realisticShadow ?? true;
  return (
    <div className="w-full p-4 bg-slate-950/70 rounded-xl flex items-center justify-center">
      <div
        className={`w-full max-w-[280px] p-4 bg-slate-800 rounded-xl border border-slate-700 ${
          isDiffuse
            ? "shadow-2xl shadow-indigo-950/80 border-t-slate-600"
            : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Fenêtre de confirmation</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Voulez-vous vraiment enregistrer cette configuration de cours ?
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="px-2.5 py-1 text-[11px] rounded bg-indigo-600 text-white font-medium">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export const CARD_RENDERERS = {
  scene: SceneCard,
  product_grid: ProductGrid,
  navbar: NavBar,
  button_group: ButtonGroup,
  responsive_table: ResponsiveTable,
  hero_banner: HeroBanner,
  contrast_card: ContrastCard,
  focus_state: FocusState,
  status_alert: StatusAlert,
  alt_text_demo: AltTextDemo,
  link_semantics: LinkSemantics,
  form_error: FormError,
  form_labels: FormLabels,
  input_types: InputTypes,
  required_indicator: RequiredIndicator,
  submit_state: SubmitState,
  touch_target: TouchTarget,
  action_spacing: ActionSpacing,
  typography_readability: TypographyReadability,
  card_hierarchy: CardHierarchy,
  numeric_alignment: NumericAlignment,
  optical_centering: OpticalCentering,
  nested_border_radius: NestedBorderRadius,
  optical_tracking: OpticalTracking,
  optical_line_height: OpticalLineHeight,
  subtle_contrast: SubtleContrast,
  gestalt_proximity: GestaltProximity,
  checkbox_multiline: CheckboxMultiline,
  elevation_shadow: ElevationShadow,
};
