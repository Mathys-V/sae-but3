import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";

const AVATAR_COST = 50;

function AvatarActionButton({ isCurrent, isUnlocked, iconId, onSelect, onBuy, cost }) {
  if (isCurrent) {
    return (
      <span className="mt-1.5 text-[9px] bg-red-700 text-white px-2 py-0.5 font-bold shadow">
        ACTIF
      </span>
    );
  }
  if (isUnlocked) {
    return (
      <button
        type="button"
        onClick={() => onSelect(iconId)}
        className="pixel-btn !px-1.5 !py-0.5 !text-[9px] mt-1.5 w-full"
      >
        ÉQUIPER
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onBuy(iconId)}
      className="pixel-btn !px-1 !py-0.5 !text-[9px] !bg-amber-950 hover:!bg-amber-900 !text-amber-200 mt-1.5 w-full"
      title={`Acheter pour ${cost} Coins`}
    >
      🔒 {cost}
    </button>
  );
}
const ALL_AVATARS = Array.from({ length: 48 }, (_, i) => `Icon${i + 1}`);

function EvilSettings() {
  const navigate = useNavigate();
  const { user, role, isGuest, avatar, setAvatar, unlockedAvatars, unlockAvatar } = useAuthStore();
  const { coins, spendCoins } = useEconomyStore();

  useEffect(() => {
    document.title = "EvilJV | Paramètres & Profil";
  }, []);

  const [activeTab, setActiveTab] = useState("profil");
  const [volumeMaster, setVolumeMaster] = useState(80);
  const [volumeSFX, setVolumeSFX] = useState(100);

  const [keys, setKeys] = useState({
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
  });

  const [isListening, setIsListening] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    if (!isListening) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      setKeys((prevKeys) => ({
        ...prevKeys,
        [isListening]: e.code === "Space" ? "Space" : e.key.toUpperCase(),
      }));
      setIsListening(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isListening]);

  const handleSave = () => {
    setIsModalOpen(false);
    setFeedbackMsg("Configuration des touches enregistrée avec succès !");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleSelectAvatar = (iconId) => {
    setAvatar(iconId);
    setFeedbackMsg(`Avatar ${iconId} équipé avec succès !`);
    setTimeout(() => setFeedbackMsg(""), 2500);
  };

  const handleBuyAvatar = (iconId) => {
    if (coins < AVATAR_COST) {
      alert(`Fonds insuffisants : vous avez ${coins} Coins sur les ${AVATAR_COST} requis.`);
      return;
    }
    spendCoins(AVATAR_COST);
    unlockAvatar(iconId);
    setAvatar(iconId);
    setFeedbackMsg(`Avatar ${iconId} acheté et équipé pour ${AVATAR_COST} Coins !`);
    setTimeout(() => setFeedbackMsg(""), 2500);
  };

  return (
    <div className="pixel-page-dungeon -m-6 p-6 min-h-[calc(100vh-64px)] font-vcr">
      <main className="max-w-4xl mx-auto space-y-6">
        {/* Barre d'action supérieure */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="pixel-btn"
            title="Revenir à la page précédente"
          >
            <span>← RETOUR</span>
          </button>

          {/* Solde Coins en pixel art */}
          <div className="pixel-pill" title="Pièces démoniaques récoltées">
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
              alt="Coins"
              className="w-5 h-5 pixelated animate-pulse"
            />
            <span>{coins} COINS</span>
          </div>
        </div>

        {/* Bannière de Titre Décor Donjon */}
        <div className="pixel-banner p-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-vcr font-bold text-red-500 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            PARAMÈTRES & PROFIL JOUEUR
          </h1>
          <p className="text-sm text-gray-300 mt-1 tracking-wide">
            Personnalisez votre apparence, vos touches de jeu et votre environnement audio
          </p>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-950 text-emerald-200 border-2 border-emerald-600 text-sm font-bold text-center shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-fade-in">
            {feedbackMsg}
          </div>
        )}

        {/* Onglets Pixel Art Style Arcade / Inventaire */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`pixel-tab ${activeTab === "profil" ? "active" : ""}`}
          >
            <span>👤</span>
            <span>PROFIL & AVATARS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("controles")}
            className={`pixel-tab ${activeTab === "controles" ? "active" : ""}`}
          >
            <span>🎮</span>
            <span>TOUCHES CLAVIER</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sons")}
            className={`pixel-tab ${activeTab === "sons" ? "active" : ""}`}
          >
            <span>🔊</span>
            <span>SONS & VOLUME</span>
          </button>
        </div>

        {/* ========================================================
            ONGLET 1 : PROFIL & CATALOGUE D'AVATARS
            ======================================================== */}
        {activeTab === "profil" && (
          <div className="space-y-6">
            {/* Carte de prévisualisation du joueur */}
            <div className="pixel-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-gray-950 border-2 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)] shrink-0">
                  <img
                    src={`/assets/ui/Barre-de-Navigation/Icones_profil/${avatar || "Icon1"}.png`}
                    alt="Avatar actuel"
                    className="w-16 h-16 pixelated bg-gray-900"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-bold text-gray-100 tracking-wider">
                      {user || "Invité"}
                    </span>
                    {role === "admin" && (
                      <span className="text-xs bg-red-950 text-red-400 border border-red-700 px-2 py-0.5 font-bold">
                        ADMIN
                      </span>
                    )}
                    {isGuest && (
                      <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 font-bold">
                        INVITÉ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Avatar actuellement équipé : <span className="text-red-400 font-bold">{avatar || "Icon1"}</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Collection débloquée</p>
                <p className="text-2xl font-bold text-amber-300 mt-0.5">
                  {(unlockedAvatars || []).length} / {ALL_AVATARS.length}
                </p>
              </div>
            </div>

            {/* Grille du Catalogue des 48 Avatars */}
            <div className="pixel-panel p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-100">
                    CATALOGUE DES AVATARS PIXEL ART
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Sélectionnez votre avatar ou débloquez-en de nouveaux avec vos gains
                  </p>
                </div>
                <span className="text-xs text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2 py-1 self-start sm:self-auto">
                  Prix : {AVATAR_COST} Coins / avatar
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-950/90 border-2 border-black">
                {ALL_AVATARS.map((iconId) => {
                  const isUnlocked = (unlockedAvatars || []).includes(iconId) || role === "admin";
                  const isCurrent = (avatar || "Icon1") === iconId;

                  return (
                    <div
                      key={iconId}
                      className={`pixel-slot ${isCurrent ? "active" : ""}`}
                    >
                      <img
                        src={`/assets/ui/Barre-de-Navigation/Icones_profil/${iconId}.png`}
                        alt={iconId}
                        className={`w-10 h-10 pixelated ${!isUnlocked ? "filter grayscale brightness-50" : ""}`}
                      />
                      <span className="text-[10px] text-gray-400 mt-1 font-mono">
                        {iconId.replace("Icon", "#")}
                      </span>

                      <AvatarActionButton
                        isCurrent={isCurrent}
                        isUnlocked={isUnlocked}
                        iconId={iconId}
                        onSelect={handleSelectAvatar}
                        onBuy={handleBuyAvatar}
                        cost={AVATAR_COST}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ONGLET 2 : TOUCHES & CONTRÔLES DU CLAVIER
            ======================================================== */}
        {activeTab === "controles" && (
          <div className="pixel-panel p-6 space-y-6">
            <div className="border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-gray-100">
                CONFIGURATION DES TOUCHES DE JEU
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Cliquez sur une touche mécanique pour la réassigner à l'action souhaitée
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-950 p-4 border border-gray-800">
                <span className="text-sm font-bold text-gray-200">DÉPLACEMENT À GAUCHE</span>
                <button
                  type="button"
                  onClick={() => setIsListening("left")}
                  className={`pixel-key-btn ${isListening === "left" ? "listening" : ""}`}
                >
                  {isListening === "left" ? "APPUYEZ..." : keys.left}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-950 p-4 border border-gray-800">
                <span className="text-sm font-bold text-gray-200">DÉPLACEMENT À DROITE</span>
                <button
                  type="button"
                  onClick={() => setIsListening("right")}
                  className={`pixel-key-btn ${isListening === "right" ? "listening" : ""}`}
                >
                  {isListening === "right" ? "APPUYEZ..." : keys.right}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-950 p-4 border border-gray-800">
                <span className="text-sm font-bold text-gray-200">SAUTER / VALIDER</span>
                <button
                  type="button"
                  onClick={() => setIsListening("jump")}
                  className={`pixel-key-btn ${isListening === "jump" ? "listening" : ""}`}
                >
                  {isListening === "jump" ? "APPUYEZ..." : keys.jump}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="pixel-btn pixel-btn-red text-sm"
              >
                💾 ENREGISTRER LES TOUCHES
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            ONGLET 3 : SONS & ENVIRONNEMENT AUDIO
            ======================================================== */}
        {activeTab === "sons" && (
          <div className="pixel-panel p-6 space-y-6">
            <div className="border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-gray-100">
                RÉGLAGES AUDIO & MUSIQUES
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Ajustez les volumes sonores pour les mini-jeux et l'ambiance du donjon
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-950 p-4 border border-gray-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="master-volume-input" className="text-sm font-bold text-gray-200">
                    VOLUME GÉNÉRAL
                  </label>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {volumeMaster}%
                  </span>
                </div>
                <input
                  id="master-volume-input"
                  type="range"
                  min="0"
                  max="100"
                  value={volumeMaster}
                  onChange={(e) => setVolumeMaster(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-3 bg-gray-800 border border-black"
                />
              </div>

              <div className="bg-gray-950 p-4 border border-gray-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="sfx-volume-input" className="text-sm font-bold text-gray-200">
                    EFFETS SONORES (SFX)
                  </label>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {volumeSFX}%
                  </span>
                </div>
                <input
                  id="sfx-volume-input"
                  type="range"
                  min="0"
                  max="100"
                  value={volumeSFX}
                  onChange={(e) => setVolumeSFX(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer h-3 bg-gray-800 border border-black"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODALE DE CONFIRMATION (POP-UP RPG PIXEL ART)
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="pixel-panel p-6 max-w-md w-full space-y-4 border-2 border-red-800 shadow-[0_0_24px_rgba(220,38,38,0.7)] animate-fade-in">
            <h3 className="text-xl font-bold text-red-500 tracking-wider">
              CONFIRMER LES PARAMÈTRES
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Voulez-vous sauvegarder cette configuration ? Elle sera appliquée immédiatement à l'ensemble de vos parties.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="pixel-btn text-xs"
              >
                ANNULER
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="pixel-btn pixel-btn-red text-xs"
              >
                CONFIRMER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvilSettings;
