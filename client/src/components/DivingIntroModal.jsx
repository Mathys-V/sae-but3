import { useEffect, useRef } from "react";

/**
 * Modal d'introduction et tutoriel débutant (WCAG 2.1 AA).
 * Explique le lore, les règles du sac vs tonneau, le marchand et les contrôles.
 *
 * @param {object} props - Propriétés du composant.
 * @param {boolean} props.isOpen - Indique si la boîte de dialogue est ouverte.
 * @param {() => void} props.onClose - Fonction de rappel appelée lors de la fermeture.
 * @returns {JSX.Element | null} Fenêtre modale du guide ou null si fermée.
 */
function DivingIntroModal({ isOpen, onClose }) {
  const okButtonRef = useRef(null);

  // Focus automatique sur le bouton OK à l'ouverture (WCAG 2.1 AA)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        okButtonRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fermeture au clavier via Échap, Entrée ou Espace
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-dialog-title"
      aria-describedby="intro-dialog-desc"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="pixel-modal-frame max-w-2xl w-full p-5 sm:p-6 text-white flex flex-col max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="text-center pb-4 border-b-2 border-black">
          <div className="text-3xl sm:text-4xl mb-1.5" aria-hidden="true">
            🤿 🌊
          </div>
          <h2
            id="intro-dialog-title"
            className="text-lg sm:text-xl font-bold text-cyan-300 pixel-font tracking-wider uppercase leading-tight"
          >
            Bienvenue dans les Abysses
          </h2>
          <p id="intro-dialog-desc" className="text-xs sm:text-sm text-cyan-100/90 mt-1 pixel-font">
            Plonge dans les profondeurs océaniques, récolte du butin et affronte les monstres marins !
          </p>
        </div>

        {/* Corps des explications */}
        <div className="py-4 space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed pixel-font">
          {/* Objectif principal */}
          <div className="pixel-card p-3.5">
            <h3 className="font-bold text-cyan-200 flex items-center gap-2 mb-1 text-xs sm:text-sm uppercase tracking-wide">
              <span aria-hidden="true">🎯</span> Objectif Ultime
            </h3>
            <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
              Descends à travers les 3 zones marines jusqu&apos;à <b>10 500 mètres</b> de profondeur pour défier et terrasser le redoutable <b>Boss Requin</b> !
            </p>
          </div>

          {/* Grille : Règles Clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sac personnel vs Tonneau */}
            <div className="pixel-card-amber p-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5 text-xs uppercase">
                  <span aria-hidden="true">🎒</span> Sac Personnel vs <span aria-hidden="true">🛢️</span> Tonneau
                </h3>
                <ul className="text-[11px] text-amber-100/90 space-y-1.5">
                  <li>
                    • Le butin récolté en plongeant va dans ton <b>sac personnel</b>.
                  </li>
                  <li className="text-red-300 font-bold">
                    ⚠️ <b>Attention :</b> si tu manques d&apos;air ou meurs en mer, ton sac est perdu !
                  </li>
                  <li>
                    • Remonte sur la barque et appuie sur <b>[E]</b> près du <b>Tonneau</b> pour y sécuriser ton butin. Le tonneau ne peut pas être perdu !
                  </li>
                </ul>
              </div>
            </div>

            {/* Le Pêcheur Marchand */}
            <div className="pixel-card-gold p-3 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-yellow-300 flex items-center gap-1.5 mb-1.5 text-xs uppercase">
                  <span aria-hidden="true">🎣</span> Le Pêcheur Marchand
                </h3>
                <ul className="text-[11px] text-yellow-100/90 space-y-1.5">
                  <li>
                    • Sur la barque, va voir le pêcheur à droite et appuie sur <b>[E]</b> (ou touche <b>[B]</b>).
                  </li>
                  <li>
                    • Il rachète la cargaison du <b>Tonneau</b> en échange de pièces d&apos;or 🪙.
                  </li>
                  <li>
                    • Achète-lui des améliorations : <b>Dégâts du Harpon</b>, <b>Palmes (Vitesse)</b>, <b>Bouteilles d&apos;O2</b> et <b>Combinaison (PV)</b>.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contrôles du jeu */}
          <div className="pixel-card p-3">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
              <span aria-hidden="true">🎮</span> Commandes du Clavier & Souris
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="pixel-card p-2">
                <div className="font-bold text-cyan-300 text-xs">Z, Q, S, D</div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  Nager / Sauter
                </div>
              </div>
              <div className="pixel-card p-2">
                <div className="font-bold text-amber-300 text-xs">Clic Gauche</div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  Coup de Harpon
                </div>
              </div>
              <div className="pixel-card p-2">
                <div className="font-bold text-emerald-300 text-xs">Touche E</div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  Tonneau / Pêcheur
                </div>
              </div>
              <div className="pixel-card p-2">
                <div className="font-bold text-yellow-300 text-xs">Touche B</div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  Boutique PNJ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de confirmation WCAG */}
        <div className="pt-3 border-t-2 border-black flex justify-center">
          <button
            ref={okButtonRef}
            onClick={onClose}
            className="stone-plaque-btn btn-gold w-full sm:w-auto min-w-[240px] justify-center py-2.5 px-6 text-xs sm:text-sm font-bold cursor-pointer"
            aria-label="Compris, fermer les explications et commencer le jeu"
          >
            <span>C&apos;est compris, à l&apos;eau ! 🌊</span>
            <span className="hidden sm:inline-block text-[10px] ml-2 opacity-80">
              [Entrée]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DivingIntroModal;
