// client/src/game/ihm/components/IhmCardViewer.jsx

import { CARD_RENDERERS } from "./IhmCardScenes.jsx";

const CARD_BASE_CLASS =
  "relative flex flex-col h-full bg-slate-900 border-2 rounded-lg transition-all shadow-lg overflow-hidden";

function cardBorderClass(isSelected, isCorrect) {
  if (!isSelected) return "border-slate-700 hover:border-slate-500";
  return isCorrect
    ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
    : "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]";
}

const VIEWPORT_CLASSES = {
  mobile:
    "max-w-[340px] mx-auto p-2.5 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 shadow-inner",
  tablet: "max-w-[540px] mx-auto w-full",
};

function EmptyCard() {
  return null;
}

function ResultStamp({ isCorrect }) {
  return (
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
  );
}

function CardHeader({ optionLabel, targetViewport, showResult, isCorrect }) {
  return (
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
  );
}

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
  const CardBody = CARD_RENDERERS[type] ?? EmptyCard;

  return (
    <div className={`${CARD_BASE_CLASS} ${cardBorderClass(isSelected, isCorrect)}`}>
      {/* Tampon d'inspection ergonomique (Impact visuel officiel après vote) */}
      {showResult && <ResultStamp isCorrect={isCorrect} />}

      {/* En-tête de la maquette (Style navigateur / smartphone moderne) */}
      <CardHeader
        optionLabel={optionLabel}
        targetViewport={targetViewport}
        showResult={showResult}
        isCorrect={isCorrect}
      />

      {/* Contenu Web Réaliste (Tolérant, dynamique et avec contrastes visuels frappants) */}
      <div className="p-3 sm:p-4 bg-slate-950 text-slate-100 min-h-[260px] flex-1 flex flex-col justify-center items-center overflow-hidden font-sans">
        <div className={`w-full ${VIEWPORT_CLASSES[targetViewport] ?? "w-full"}`}>
          <CardBody data={data} targetViewport={targetViewport} />
        </div>
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
