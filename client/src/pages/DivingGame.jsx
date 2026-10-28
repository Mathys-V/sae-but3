import { useEffect, useRef, useState } from "react";
import { initDivingGame } from "../game/plongee/core/init.js";
import DivingShopModal from "../components/DivingShopModal.jsx";
import DivingIntroModal from "../components/DivingIntroModal.jsx";
import { stats } from "../game/plongee/entities/stats.js";
import {
  PixelCoralTopLeft,
  PixelStarfishTopRight,
  PixelShellBottomLeft,
  PixelCrystalBottomRight,
  PixelAmbientSea,
  PixelTrophy,
} from "../components/DivingPixelDecor.jsx";

// Styles Pixel Art de l'Arcade Marine & Contraintes Viewport
import "./DivingGame.css";

/**
 * Convertit une durée en secondes en format mm:ss pour l'affichage rétro.
 * @param {number} seconds - Nombre total de secondes.
 * @returns {string} Durée formatée sous la forme "MM:SS".
 */
function formatTime(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Composant principal de la page du Jeu de Plongée (DivingGame).
 * Gère l'intégration de la borne d'arcade rétro, du canvas Kaplay, des modales
 * (Boutique, Guide des règles, Victoire) et des raccourcis clavier globaux.
 *
 * @returns {JSX.Element} Vue complète du jeu de plongée.
 */
function DivingGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [, setInventoryTick] = useState(0);
  const [isIntroOpen, setIsIntroOpen] = useState(() => {
    // Affiche le tutoriel des règles lors de la première session du joueur
    return !localStorage.getItem("plongee_intro_seen");
  });
  const [victoryData, setVictoryData] = useState(null);

  /**
   * Ferme le tutoriel d'introduction, mémorise la lecture et replace le focus sur le canvas.
   */
  const handleCloseIntro = () => {
    localStorage.setItem("plongee_intro_seen", "true");
    setIsIntroOpen(false);
    canvasRef.current?.focus();
  };

  // Initialisation du moteur Kaplay sur le canvas au montage du composant
  useEffect(() => {
    const quitGame = initDivingGame(canvasRef.current);
    return () => {
      if (typeof quitGame === "function") {
        quitGame();
      }
    };
  }, []);

  /**
   * Bascule entre le mode fenêtré standard et le mode plein écran natif de l'API Browser.
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Erreur plein écran : ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(err);
      });
    }
  };

  /**
   * Recentre la vue de la page sur le meuble d'arcade en cas de décalage de scroll.
   */
  const centerGame = () => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Synchronisation de l'état React avec l'événement standard fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Écoute des événements du moteur de jeu et des raccourcis clavier
  useEffect(() => {
    const handleOpenShop = () => setIsShopOpen(true);
    const handleInventoryUpdate = () => setInventoryTick((t) => t + 1);
    const handleVictory = (e) => {
      setVictoryData(e.detail || { time: stats.gameTimer });
    };

    /**
     * Traite les raccourcis clavier (Boutique via 'B', fermeture via 'Échap').
     * @param {KeyboardEvent} e - Événement clavier.
     */
    const handleKeyDown = (e) => {
      const isKeyB = e.key === "b" || e.key === "B";
      if (isKeyB && !isIntroOpen) {
        setIsShopOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (isIntroOpen) {
          handleCloseIntro();
        } else {
          setIsShopOpen(false);
          setVictoryData(null);
        }
      }
    };

    window.addEventListener("plongee-open-shop", handleOpenShop);
    window.addEventListener("plongee-inventory-updated", handleInventoryUpdate);
    window.addEventListener("plongee-victory", handleVictory);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("plongee-open-shop", handleOpenShop);
      window.removeEventListener("plongee-inventory-updated", handleInventoryUpdate);
      window.removeEventListener("plongee-victory", handleVictory);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isIntroOpen]);

  // Statistiques en temps réel pour l'étagère de butin du meuble d'arcade
  const bagCount = (stats.inventory || []).reduce(
    (sum, item) => sum + (item.qty || 1),
    0,
  );
  const barrelCount = (stats.barrelInventory || []).reduce(
    (sum, item) => sum + (item.qty || 1),
    0,
  );
  const coinsCount = stats.coins || 0;
  const damageLvl = stats.upgrades?.damageLevel || 1;
  const speedLvl = stats.upgrades?.speedLevel || 1;
  const o2Lvl = stats.upgrades?.o2Level || 1;
  const hpLvl = stats.upgrades?.hpLevel || 1;

  return (
    <div
      ref={containerRef}
      className={`diving-page-wrapper w-full flex flex-col items-center justify-center relative ${
        isFullscreen ? "h-screen fixed inset-0 z-50" : "flex-1 min-h-0"
      }`}
    >
      {/* Faune & Algues décoratives d'ambiance en arrière-plan marin Pixel Art */}
      {!isFullscreen && (
        <>
          <div className="ambient-decor ambient-left" aria-hidden="true">
            <PixelAmbientSea />
          </div>
          <div className="ambient-decor ambient-right" aria-hidden="true">
            <PixelAmbientSea flipped />
          </div>
        </>
      )}

      {/* Bouton plein écran flottant discret si plein écran actif */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="floating-fullscreen-btn stone-plaque-btn"
          title="Quitter le plein écran"
          aria-label="Quitter le mode plein écran"
        >
          <span>✕ Quitter [⛶]</span>
        </button>
      )}

      {/* ============================================================
          LE MEUBLE D'ARCADE MARIN (Strictement calibré sur l'écran)
          ============================================================ */}
      <div className={`arcade-cabinet-wrapper ${isFullscreen ? "is-fullscreen" : ""}`}>
        {/* 1. FRONTON EN PIERRE SCULPTÉE AVEC LES BOUTONS INTÉGRÉS */}
        {!isFullscreen && (
          <div className="arcade-top-arch">
            <button
              onClick={centerGame}
              className="stone-plaque-btn"
              title="Centrer la vue sur le meuble de jeu"
              aria-label="Centrer la vue sur le jeu"
            >
              <span aria-hidden="true">🎯</span>
              <span>Centrer</span>
            </button>

            <button
              onClick={() => setIsShopOpen(true)}
              className="stone-plaque-btn btn-gold"
              title="Ouvrir la Boutique du Pêcheur (Touche B)"
              aria-label="Ouvrir la boutique rapide du marchand (Touche B)"
            >
              <span aria-hidden="true">🛒</span>
              <span>Boutique [B]</span>
            </button>

            <button
              onClick={() => setIsIntroOpen(true)}
              className="stone-plaque-btn"
              title="Afficher le Guide & Règles du jeu"
              aria-label="Afficher le guide et les règles du jeu"
            >
              <span aria-hidden="true">📜</span>
              <span>Guide (?)</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="stone-plaque-btn"
              title="Passer en plein écran"
              aria-label="Basculer en mode plein écran"
            >
              <span aria-hidden="true">⛶</span>
              <span>Plein écran</span>
            </button>
          </div>
        )}

        {/* 2. LE CADRE EN PIERRE SCULPTÉE DE TEMPLE SOUS-MARIN & CANVAS */}
        <div className="arcade-main-frame">
          {/* Décorations coralliennes et étoiles de mer aux 4 coins (16-bit Pixel Art) */}
          {!isFullscreen && (
            <>
              {/* Coin Haut Gauche : Coraux ramifiés 16-bit */}
              <div className="arcade-coral-accent coral-top-left" aria-hidden="true">
                <PixelCoralTopLeft />
              </div>

              {/* Coin Haut Droit : Anémone et Étoile de mer 16-bit */}
              <div className="arcade-coral-accent coral-top-right" aria-hidden="true">
                <PixelStarfishTopRight />
              </div>

              {/* Coin Bas Gauche : Coquillages & Balanes 16-bit */}
              <div className="arcade-coral-accent coral-bottom-left" aria-hidden="true">
                <PixelShellBottomLeft />
              </div>

              {/* Coin Bas Droit : Cristaux d'améthyste & Algues 16-bit */}
              <div className="arcade-coral-accent coral-bottom-right" aria-hidden="true">
                <PixelCrystalBottomRight />
              </div>
            </>
          )}

          {/* L'ÉCRAN DE JEU ET LE CANVAS KAPLAY */}
          <div className="arcade-screen-viewport">
            <canvas
              ref={canvasRef}
              role="application"
              tabIndex={0}
              aria-label="Jeu de plongée sous-marine MesCoursJV. Contrôles : ZQSD ou Flèches pour nager, Clic gauche pour attaquer au harpon, E pour interagir sur la barque, B pour la boutique."
              className="arcade-game-canvas focus:outline-none"
            ></canvas>
          </div>
        </div>

        {/* 3. L'ÉTAGÈRE DE STATUT INFÉRIEURE / HOTBAR DU BUTIN (Image 1) */}
        {!isFullscreen && (
          <div className="arcade-bottom-shelf" aria-label="État de la cargaison et équipement">
            <div className="hotbar-slot hotbar-slot-gold" title="Pièces d'or récoltées">
              <span aria-hidden="true">🪙</span>
              <span>{coinsCount} Or</span>
            </div>

            <div
              className={`hotbar-slot ${bagCount > 0 ? "border-amber-500/80 text-amber-200" : ""}`}
              title="Butin dans le Sac Personnel (perdu si vous sombrez !)"
            >
              <span aria-hidden="true">🎒</span>
              <span>Sac: {bagCount}</span>
            </div>

            <div className="hotbar-slot hotbar-slot-barrel" title="Butin sécurisé dans le Tonneau">
              <span aria-hidden="true">🛢️</span>
              <span>Tonneau: {barrelCount}</span>
            </div>

            <div className="hotbar-slot hidden sm:flex" title="Niveau du Harpon">
              <span aria-hidden="true">🔱</span>
              <span>Harpon Niv.{damageLvl}</span>
            </div>

            <div className="hotbar-slot hidden sm:flex" title="Niveau des Palmes (Vitesse)">
              <span aria-hidden="true">🤿</span>
              <span>Palmes Niv.{speedLvl}</span>
            </div>

            <div className="hotbar-slot hidden md:flex" title="Bouteilles d'Oxygène">
              <span aria-hidden="true">🫧</span>
              <span>O2 Niv.{o2Lvl}</span>
            </div>

            <div className="hotbar-slot hidden md:flex" title="Combinaison de Plongée (PV)">
              <span aria-hidden="true">❤️</span>
              <span>PV Niv.{hpLvl}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'Introduction & Tutoriel */}
      <DivingIntroModal isOpen={isIntroOpen} onClose={handleCloseIntro} />

      {/* Modal Boutique PNJ */}
      <DivingShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

      {/* Modal Victoire Boss Final - Pixel Art 16-Bit */}
      {victoryData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="pixel-gold-frame p-6 sm:p-8 max-w-lg w-full text-center text-white space-y-6">
            <div className="flex justify-center" aria-hidden="true">
              <PixelTrophy width={96} height={96} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 pixel-font-title tracking-wider leading-tight">
              VICTOIRE ROYALE !
            </h2>
            <p className="text-amber-100/90 text-xs sm:text-sm pixel-font leading-relaxed">
              Tu as terrassé le redoutable <b>Boss Requin</b> et conquis les abysses !
            </p>

            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="pixel-card-gold p-3 flex flex-col items-center justify-center">
                <div className="text-[10px] sm:text-xs text-amber-200 pixel-font">Temps du Run</div>
                <div className="text-lg sm:text-xl font-bold text-yellow-300 pixel-font mt-1">
                  ⏱️ {formatTime(victoryData.time)}
                </div>
              </div>
              <div className="pixel-card-amber p-3 flex flex-col items-center justify-center">
                <div className="text-[10px] sm:text-xs text-amber-200 pixel-font">Trésor récolté</div>
                <div className="text-lg sm:text-xl font-bold text-amber-300 pixel-font mt-1">
                  🪙 {stats.coins || 0}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="stone-plaque-btn btn-gold w-full justify-center py-3 text-xs sm:text-sm font-bold"
              >
                Recommencer 🔄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DivingGame;
