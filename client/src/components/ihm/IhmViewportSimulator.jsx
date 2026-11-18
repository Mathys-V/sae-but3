// client/src/components/ihm/IhmViewportSimulator.jsx
import { useIhmStore } from "../../store/ihmStore";

const VIEWPORTS = [
  { id: "mobile", label: "Mobile", icon: "📱", widthLabel: "375 px", maxWidthClass: "max-w-[375px]" },
  { id: "tablet", label: "Tablette", icon: "💻", widthLabel: "768 px", maxWidthClass: "max-w-[768px]" },
  { id: "desktop", label: "Desktop", icon: "🖥️", widthLabel: "100%", maxWidthClass: "w-full" },
];

export default function IhmViewportSimulator({ children }) {
  const { viewportMode, setViewportMode } = useIhmStore();

  const currentVp = VIEWPORTS.find((v) => v.id === viewportMode) || VIEWPORTS[2];

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      {/* Barre de contrôle du Viewport en style Pixel Art Arcade */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-5xl px-3 py-2 bg-gray-950/90 border-2 border-black shadow-[inset_0_2px_0_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-vcr text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
            <span>📐</span>
            <span>SIMULATEUR RESPONSIVE :</span>
          </span>
          <span className="text-xs font-mono text-gray-400 bg-gray-900 px-2 py-0.5 border border-gray-800">
            {currentVp.label} ({currentVp.widthLabel})
          </span>
        </div>

        {/* Boutons de bascule 375px / 768px / Desktop */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Sélecteur de taille d'écran">
          {VIEWPORTS.map((vp) => {
            const isActive = viewportMode === vp.id;
            return (
              <button
                key={vp.id}
                type="button"
                onClick={() => setViewportMode(vp.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-vcr font-bold transition-all ${
                  isActive
                    ? "bg-red-700 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_2px_0_#450a0a]"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                }`}
                title={`Simuler un affichage ${vp.label} (${vp.widthLabel})`}
              >
                <span>{vp.icon}</span>
                <span>{vp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cadre de simulation avec largeur dynamique */}
      <div
        className={`w-full transition-all duration-300 ease-out mx-auto ${currentVp.maxWidthClass}`}
      >
        {children}
      </div>
    </div>
  );
}
