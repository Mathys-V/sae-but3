// client/src/components/ihm/IhmViewportSimulator.jsx

const VIEWPORT_CONFIGS = {
  mobile: {
    label: "📱 SMARTPHONE (375 px)",
    maxWidthClass: "max-w-[420px]",
    badgeBg: "bg-purple-950 text-purple-300 border-purple-600",
  },
  tablet: {
    label: "💻 TABLETTE (768 px)",
    maxWidthClass: "max-w-[768px]",
    badgeBg: "bg-blue-950 text-blue-300 border-blue-600",
  },
  desktop: {
    label: "🖥️ ORDINATEUR (Desktop)",
    maxWidthClass: "w-full max-w-5xl",
    badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-600",
  },
};

export default function IhmViewportSimulator({ targetViewport = "desktop", children }) {
  const vp = VIEWPORT_CONFIGS[targetViewport] || VIEWPORT_CONFIGS.desktop;

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      {/* Bandeau d'information du Contexte Imposé pour la manche */}
      <div className="flex items-center justify-between gap-3 w-full max-w-5xl px-4 py-2 bg-gray-950/95 border-2 border-black shadow-[inset_0_2px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-vcr text-amber-400 font-bold tracking-wider">
            📐 FORMAT D'ÉCRAN IMPOSÉ :
          </span>
          <span className={`text-xs font-vcr font-bold px-2.5 py-0.5 border ${vp.badgeBg}`}>
            {vp.label}
          </span>
        </div>

        <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
          La différence ergonomique est à observer dans ce format précis
        </span>
      </div>

      {/* Cadre de simulation centré avec la largeur fixée */}
      <div className={`w-full transition-all duration-300 mx-auto ${vp.maxWidthClass}`}>
        {children}
      </div>
    </div>
  );
}
