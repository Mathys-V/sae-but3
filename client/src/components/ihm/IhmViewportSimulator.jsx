// client/src/components/ihm/IhmViewportSimulator.jsx

const VIEWPORT_CONFIGS = {
  mobile: {
    label: "📱 SMARTPHONE (375 px)",
    badgeBg: "bg-purple-950 text-purple-300 border-purple-600",
    description: "Affichage mobile 375 px : observez la disposition des composants et la gestion des débordements",
  },
  tablet: {
    label: "💻 TABLETTE (768 px)",
    badgeBg: "bg-blue-950 text-blue-300 border-blue-600",
    description: "Affichage tablette 768 px : observez la flexibilité et l'organisation visuelle",
  },
  desktop: {
    label: "🖥️ ORDINATEUR (Desktop)",
    badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-600",
    description: "Affichage standard ordinateur : observez la lisibilité et les ratios d'accessibilité WCAG",
  },
};

export default function IhmViewportSimulator({ targetViewport = "desktop", children }) {
  const vp = VIEWPORT_CONFIGS[targetViewport] || VIEWPORT_CONFIGS.desktop;

  return (
    <div className="w-full flex flex-col items-center space-y-4 font-sans">
      {/* Bandeau d'information du Contexte Imposé pour la manche */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-5xl px-4 py-2.5 bg-gray-950/95 border-2 border-gray-800 rounded shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            📐 FORMAT D'ÉCRAN AUDITÉ :
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded border ${vp.badgeBg}`}>
            {vp.label}
          </span>
        </div>

        <span className="text-xs text-gray-400 font-mono hidden sm:inline">
          {vp.description}
        </span>
      </div>

      {/* Cadre de simulation centré pour accueillir les deux options côte à côte sans écrasement */}
      <div className="w-full max-w-5xl transition-all duration-300 mx-auto">
        {children}
      </div>
    </div>
  );
}
