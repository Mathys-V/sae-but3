import { useState, useEffect, useRef } from "react";
import { stats } from "../game/plongee/entities/stats.js";

/**
 * Définition et comportement des améliorations disponibles dans la boutique du Pêcheur.
 */
const UPGRADE_DEFINITIONS = {
  damage: {
    levelKey: "damageLevel",
    costMultiplier: 30,
    apply: (upgrades) => {
      stats.damage = (stats.damage || 15) + 5;
      stats.upgrades = { ...upgrades, damageLevel: upgrades.damageLevel + 1 };
      return `Amélioration Harpon achetée : niveau ${upgrades.damageLevel + 1}, dégâts : ${stats.damage}.`;
    },
  },
  speed: {
    levelKey: "speedLevel",
    costMultiplier: 25,
    apply: (upgrades) => {
      stats.speed = (stats.speed || 250) + 35;
      stats.upgrades = { ...upgrades, speedLevel: upgrades.speedLevel + 1 };
      return `Amélioration Palmes achetée : niveau ${upgrades.speedLevel + 1}, vitesse : ${stats.speed}.`;
    },
  },
  o2: {
    levelKey: "o2Level",
    costMultiplier: 20,
    apply: (upgrades) => {
      stats.maxO2 = (stats.maxO2 || 60) + 15;
      stats.o2 = stats.maxO2;
      stats.upgrades = { ...upgrades, o2Level: upgrades.o2Level + 1 };
      return `Amélioration Oxygène achetée : niveau ${upgrades.o2Level + 1}, O2 max : ${stats.maxO2}s.`;
    },
  },
  hp: {
    levelKey: "hpLevel",
    costMultiplier: 20,
    apply: (upgrades) => {
      stats.maxHp = (stats.maxHp || 100) + 20;
      stats.hp = stats.maxHp;
      stats.upgrades = { ...upgrades, hpLevel: upgrades.hpLevel + 1 };
      return `Amélioration Combinaison achetée : niveau ${upgrades.hpLevel + 1}, PV max : ${stats.maxHp}.`;
    },
  },
};

/**
 * Modale de commerce avec le Pêcheur Marchand (WCAG 2.1 AA).
 * Permet la vente du contenu du tonneau commun et l'achat d'améliorations d'équipement.
 *
 * @param {object} props - Propriétés du composant.
 * @param {boolean} props.isOpen - État d'ouverture de la modale.
 * @param {() => void} props.onClose - Fonction de rappel pour la fermeture.
 * @returns {JSX.Element | null} Modale de la boutique ou null si fermée.
 */
function DivingShopModal({ isOpen, onClose }) {
  const [, setTick] = useState(0);
  const [srMessage, setSrMessage] = useState("");
  const closeButtonRef = useRef(null);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    const handleUpdate = () => refresh();
    window.addEventListener("plongee-inventory-updated", handleUpdate);
    return () => {
      window.removeEventListener("plongee-inventory-updated", handleUpdate);
    };
  }, []);

  // Déplacement accessible du focus sur le bouton de fermeture à l'ouverture (WCAG 2.1.2)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUpgrades = stats.upgrades || {
    damageLevel: 1,
    speedLevel: 1,
    o2Level: 1,
    hpLevel: 1,
  };
  const upgrades = currentUpgrades;

  const costDamage = currentUpgrades.damageLevel * 30;
  const costSpeed = currentUpgrades.speedLevel * 25;
  const costO2 = currentUpgrades.o2Level * 20;
  const costHp = currentUpgrades.hpLevel * 20;

  const barrelItems = stats.barrelInventory || [];
  const totalBarrelValue = barrelItems.reduce(
    (acc, item) => acc + (item.value || 10) * (item.qty || 1),
    0,
  );

  const personalBagItems = stats.inventory || [];
  const isOnBoat = stats.isPlayerOnBoat !== false;

  /**
   * Rachète l'ensemble de la cargaison présente dans le tonneau de la barque.
   */
  const handleSellBarrel = () => {
    if (!isOnBoat || totalBarrelValue <= 0) return;
    const gained = totalBarrelValue;
    stats.coins = (stats.coins || 0) + gained;
    stats.barrelInventory = [];
    refresh();
    setSrMessage(
      `Vente réussie : ${gained} pièces d'or ajoutées. Solde actuel : ${stats.coins} or.`,
    );
    window.dispatchEvent(new CustomEvent("plongee-play-sound", { detail: "sfx-gold" }));
    window.dispatchEvent(new CustomEvent("plongee-inventory-updated"));
  };

  /**
   * Achète une amélioration d'équipement permanente si le solde d'or le permet.
   * @param {"damage" | "speed" | "o2" | "hp"} type - Type de l'amélioration achetée.
   */
  const buyUpgrade = (type) => {
    if (!isOnBoat) return;
    const def = UPGRADE_DEFINITIONS[type];
    if (!def) return;

    const currentLevel = currentUpgrades[def.levelKey] || 1;
    const cost = currentLevel * def.costMultiplier;
    if ((stats.coins || 0) < cost) return;

    stats.coins -= cost;
    const feedback = def.apply(currentUpgrades);
    refresh();
    setSrMessage(feedback);
    window.dispatchEvent(new CustomEvent("plongee-play-sound", { detail: "sfx-gold" }));
  };

  return (
    <dialog
      open
      aria-labelledby="shop-modal-title"
      aria-describedby="shop-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 animate-fade-in w-full h-full max-w-none max-h-none border-none m-0"
    >
      {/* Zone accessible aux lecteurs d'écran (WCAG 4.1.3 Live Region) */}
      <div role="status" aria-live="polite" className="sr-only">
        {srMessage}
      </div>

      <div className="pixel-modal-frame w-full max-w-xl text-white flex flex-col max-h-[85vh] overflow-hidden">
        {/* En-tête compact et accessible */}
        <div className="flex justify-between items-center bg-[#0c2234] px-4 py-3 border-b-2 border-black shrink-0">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="text-2xl">
              🎣
            </span>
            <div>
              <h2
                id="shop-modal-title"
                className="text-base sm:text-lg font-bold text-cyan-300 pixel-font tracking-wide leading-tight uppercase"
              >
                Le Pêcheur Marchand
              </h2>
              <p id="shop-modal-desc" className="text-[11px] text-slate-300 pixel-font">
                Rachat du tonneau commun & améliorations d'équipement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              aria-label={`Solde d'or : ${stats.coins || 0} pièces`}
              className="pixel-card-gold text-amber-200 font-bold px-3 py-1 text-xs sm:text-sm flex items-center gap-1.5 pixel-font"
            >
              <span aria-hidden="true">🪙</span>
              <span>{stats.coins || 0} Or</span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Fermer la boutique (Touche Échap)"
              className="stone-plaque-btn px-2.5 py-1 text-xs"
              title="Fermer (Échap)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Corps défilable */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 flex-1 text-sm">
          {/* Alerte si le joueur consulte le menu en pleine mer */}
          {!isOnBoat && (
            <div
              role="alert"
              className="pixel-card-amber p-2.5 text-xs text-amber-200 pixel-font flex items-center gap-2"
            >
              <span aria-hidden="true" className="text-base">
                ⚓
              </span>
              <span>
                <strong>Mode consultation :</strong> Tu es en mer ! Remonte sur la barque près du tonneau pour déposer tes butins et auprès du pêcheur pour commercer.
              </span>
            </div>
          )}

          {/* Section 1 : Le Tonneau Commun */}
          <div className="pixel-card p-3">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-300 pixel-font flex items-center gap-1.5 uppercase">
                <span aria-hidden="true">📦</span> Tonneau de la Barque ({barrelItems.length} type{barrelItems.length > 1 ? "s" : ""})
              </h3>
              <button
                onClick={handleSellBarrel}
                disabled={!isOnBoat || totalBarrelValue <= 0}
                aria-label={`Vendre la cargaison du tonneau au pêcheur pour ${totalBarrelValue} pièces d'or`}
                className={`stone-plaque-btn text-[11px] py-1 px-2.5 ${
                  isOnBoat && totalBarrelValue > 0
                    ? "btn-gold cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <span>Vendre (+{totalBarrelValue} 🪙)</span>
              </button>
            </div>

            {barrelItems.length === 0 ? (
              <p className="text-xs text-slate-300 italic pixel-font">
                Le tonneau est vide. Ramène des créatures de tes plongées et dépose-les dans le tonneau avec <strong>(E)</strong> sur la barque !
              </p>
            ) : (
              <ul
                aria-label="Contenu du tonneau"
                className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1 list-none p-0 m-0"
              >
                {barrelItems.map((item, idx) => (
                  <li
                    key={item.id || item.name || idx}
                    className="pixel-card p-1.5 flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-1">
                      <div className="font-semibold text-white truncate pixel-font text-[11px]">{item.name}</div>
                      <div className="text-[10px] text-amber-300 pixel-font">{item.value || 10} 🪙 /u</div>
                    </div>
                    <span className="bg-slate-800 text-cyan-300 font-bold px-1.5 py-0.5 text-[10px] shrink-0 border border-slate-700 pixel-font">
                      x{item.qty || 1}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {personalBagItems.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-cyan-900/50 text-[11px] text-cyan-200 pixel-font flex items-center gap-1.5">
                <span aria-hidden="true">🎒</span>
                <span>
                  Tu as <strong>{personalBagItems.reduce((acc, i) => acc + (i.qty || 1), 0)} butin(s)</strong> dans ton sac personnel. Approche-toi du tonneau sur la barque et appuie sur <strong>(E)</strong> pour les déposer.
                </span>
              </div>
            )}
          </div>

          {/* Section 2 : Améliorations Permanentes */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-cyan-300 pixel-font mb-2 flex items-center gap-1.5 uppercase">
              <span aria-hidden="true">⚡</span> Équipement & Améliorations du Pêcheur
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Harpon */}
              <div className="pixel-card p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-xs pixel-font">
                      ⚔️ Harpon d'estoc
                    </span>
                    <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-200 px-1.5 py-0.5 border border-cyan-700 pixel-font">
                      Niv. {upgrades.damageLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pixel-font">
                    Dégâts : <span className="text-amber-300 font-bold">{stats.damage}</span> (+5 niv. suivant)
                  </p>
                </div>
                <button
                  onClick={() => buyUpgrade("damage")}
                  disabled={!isOnBoat || stats.coins < costDamage}
                  aria-label={`Améliorer le harpon au niveau ${upgrades.damageLevel + 1} pour ${costDamage} pièces d'or`}
                  className={`stone-plaque-btn text-[11px] py-1.5 px-2.5 mt-2 flex justify-between items-center ${
                    isOnBoat && stats.coins >= costDamage
                      ? "btn-gold cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span>Améliorer</span>
                  <span className="font-bold">{costDamage} 🪙</span>
                </button>
              </div>

              {/* Vitesse */}
              <div className="pixel-card p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-xs pixel-font">
                      🏊 Palmes de Nage
                    </span>
                    <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-200 px-1.5 py-0.5 border border-cyan-700 pixel-font">
                      Niv. {upgrades.speedLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pixel-font">
                    Vitesse : <span className="text-amber-300 font-bold">{stats.speed}</span> (+35 niv. suivant)
                  </p>
                </div>
                <button
                  onClick={() => buyUpgrade("speed")}
                  disabled={!isOnBoat || stats.coins < costSpeed}
                  aria-label={`Améliorer les palmes au niveau ${upgrades.speedLevel + 1} pour ${costSpeed} pièces d'or`}
                  className={`stone-plaque-btn text-[11px] py-1.5 px-2.5 mt-2 flex justify-between items-center ${
                    isOnBoat && stats.coins >= costSpeed
                      ? "btn-gold cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span>Améliorer</span>
                  <span className="font-bold">{costSpeed} 🪙</span>
                </button>
              </div>

              {/* Oxygène */}
              <div className="pixel-card p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-xs pixel-font">
                      🫁 Bouteilles d'O2
                    </span>
                    <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-200 px-1.5 py-0.5 border border-cyan-700 pixel-font">
                      Niv. {upgrades.o2Level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pixel-font">
                    O2 max : <span className="text-amber-300 font-bold">{stats.maxO2}s</span> (+15s niv. suivant)
                  </p>
                </div>
                <button
                  onClick={() => buyUpgrade("o2")}
                  disabled={!isOnBoat || stats.coins < costO2}
                  aria-label={`Améliorer les bouteilles d'oxygène au niveau ${upgrades.o2Level + 1} pour ${costO2} pièces d'or`}
                  className={`stone-plaque-btn text-[11px] py-1.5 px-2.5 mt-2 flex justify-between items-center ${
                    isOnBoat && stats.coins >= costO2
                      ? "btn-gold cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span>Améliorer</span>
                  <span className="font-bold">{costO2} 🪙</span>
                </button>
              </div>

              {/* Combinaison / PV */}
              <div className="pixel-card p-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-xs pixel-font">
                      ❤️ Combinaison / PV
                    </span>
                    <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-200 px-1.5 py-0.5 border border-cyan-700 pixel-font">
                      Niv. {upgrades.hpLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pixel-font">
                    PV max : <span className="text-amber-300 font-bold">{stats.maxHp}</span> (Soin +20 PV)
                  </p>
                </div>
                <button
                  onClick={() => buyUpgrade("hp")}
                  disabled={!isOnBoat || stats.coins < costHp}
                  aria-label={`Améliorer la combinaison au niveau ${upgrades.hpLevel + 1} pour ${costHp} pièces d'or`}
                  className={`stone-plaque-btn text-[11px] py-1.5 px-2.5 mt-2 flex justify-between items-center ${
                    isOnBoat && stats.coins >= costHp
                      ? "btn-gold cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span>Améliorer & Soigner</span>
                  <span className="font-bold">{costHp} 🪙</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page accessible */}
        <div className="bg-[#0c2234] px-4 py-2.5 border-t-2 border-black flex justify-between items-center text-xs text-slate-300 shrink-0 pixel-font">
          <span className="text-[11px]">Sur la barque : <strong>(E)</strong> pour interagir avec le tonneau ou le pêcheur.</span>
          <button
            onClick={onClose}
            aria-label="Fermer le menu et retourner au jeu"
            className="stone-plaque-btn py-1 px-3 text-xs"
          >
            Retour au jeu
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default DivingShopModal;
