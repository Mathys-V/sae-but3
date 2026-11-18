import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";

const AVATAR_COST = 50;
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
    console.log("Nouvelle configuration sauvegardée :", {
      keys,
      volumeMaster,
      volumeSFX,
    });
    setIsModalOpen(false);
  };

  const handleSelectAvatar = (iconId) => {
    setAvatar(iconId);
    setFeedbackMsg(`Avatar ${iconId} équipé avec succès !`);
    setTimeout(() => setFeedbackMsg(""), 2500);
  };

  const handleBuyAvatar = (iconId) => {
    if (coins < AVATAR_COST) {
      alert(`Vous n'avez pas assez de Coins (${coins}/${AVATAR_COST}). Jouez aux mini-jeux pour en gagner !`);
      return;
    }
    spendCoins(AVATAR_COST);
    unlockAvatar(iconId);
    setAvatar(iconId);
    setFeedbackMsg(`Avatar ${iconId} acheté et équipé pour ${AVATAR_COST} Coins !`);
    setTimeout(() => setFeedbackMsg(""), 2500);
  };

  return (
    <>
      <main className="space-y-8 max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 hover:text-white text-sm font-bold transition-all shadow-sm hover:shadow"
            title="Revenir à la page précédente"
          >
            <span>←</span>
            <span>Retour / Reprendre</span>
          </button>

          {/* Affichage rapide des Coins */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-amber-800 text-amber-300 text-sm font-bold shadow">
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
              alt="Coins"
              className="w-4 h-4 pixelated animate-pulse"
            />
            <span>{coins} Coins</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-950 via-gray-900 to-red-950 text-white p-6 text-center rounded border border-red-900 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-redden tracking-wider text-red-500">
            Paramètres & Profil Joueur
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Gérez votre identité, vos touches et les options de la plateforme EvilJV
          </p>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm font-bold text-center rounded shadow animate-fade-in">
            {feedbackMsg}
          </div>
        )}

        {/* Boutons d'onglets internes */}
        <div className="flex border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profil")}
            className={`py-3 px-6 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profil"
                ? "border-red-500 text-red-400 bg-red-950/20"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>👤</span>
            <span>Profil & Avatars</span>
          </button>
          <button
            onClick={() => setActiveTab("controles")}
            className={`py-3 px-6 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "controles"
                ? "border-red-500 text-red-400 bg-red-950/20"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>🎮</span>
            <span>Touches & Contrôles</span>
          </button>
          <button
            onClick={() => setActiveTab("sons")}
            className={`py-3 px-6 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "sons"
                ? "border-red-500 text-red-400 bg-red-950/20"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>🔊</span>
            <span>Sons & Audio</span>
          </button>
        </div>

        {/* Contenu : Onglet Profil & Avatars */}
        {activeTab === "profil" && (
          <div className="bg-gray-900 p-6 rounded border border-gray-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-950 border border-red-950 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={`/assets/ui/Barre-de-Navigation/Icones_profil/${avatar || "Icon1"}.png`}
                  alt="Avatar actuel"
                  className="w-16 h-16 pixelated border-2 border-red-600 rounded bg-gray-900 shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                />
                <div>
                  <h2 className="text-xl font-bold font-redden text-gray-100 flex items-center gap-2">
                    <span>{user || "Invité"}</span>
                    {role === "admin" && (
                      <span className="text-xs bg-red-950 text-red-400 border border-red-700 px-2 py-0.5 rounded font-sans">
                        Admin
                      </span>
                    )}
                    {isGuest && (
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-sans">
                        Invité
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Avatar actuellement sélectionné : <span className="text-red-400 font-bold">{avatar || "Icon1"}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Avatars débloqués</p>
                <p className="text-lg font-bold text-gray-100 font-mono">
                  {(unlockedAvatars || []).length} / {ALL_AVATARS.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-200 mb-2 flex items-center justify-between">
                <span>Catalogue des Avatars Pixel Art</span>
                <span className="text-xs text-amber-400 font-normal">
                  Prix : {AVATAR_COST} Coins par avatar verrouillé
                </span>
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Cliquez sur un avatar possédé pour l'équiper, ou débloquez-en de nouveaux grâce à vos gains !
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-950/70 border border-gray-800 rounded">
                {ALL_AVATARS.map((iconId) => {
                  const isUnlocked = (unlockedAvatars || []).includes(iconId) || role === "admin";
                  const isCurrent = (avatar || "Icon1") === iconId;

                  return (
                    <div
                      key={iconId}
                      className={`relative flex flex-col items-center justify-center p-2 rounded border transition-all ${
                        isCurrent
                          ? "border-red-500 bg-red-950/50 shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                          : isUnlocked
                            ? "border-gray-700 bg-gray-800/80 hover:border-gray-500 hover:bg-gray-800"
                            : "border-gray-800 bg-gray-950/60 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <img
                        src={`/assets/ui/Barre-de-Navigation/Icones_profil/${iconId}.png`}
                        alt={iconId}
                        className={`w-10 h-10 pixelated ${!isUnlocked ? "filter grayscale brightness-75" : ""}`}
                      />
                      <span className="text-[10px] text-gray-400 mt-1 font-mono">
                        {iconId.replace("Icon", "#")}
                      </span>

                      {isCurrent ? (
                        <span className="mt-1 text-[9px] bg-red-700 text-white px-1.5 py-0.5 rounded font-bold">
                          Actif
                        </span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleSelectAvatar(iconId)}
                          className="mt-1 text-[9px] bg-gray-700 hover:bg-gray-600 text-gray-200 px-1.5 py-0.5 rounded transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyAvatar(iconId)}
                          className="mt-1 text-[9px] bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-700 px-1 py-0.5 rounded transition flex items-center gap-0.5"
                          title={`Acheter pour ${AVATAR_COST} Coins`}
                        >
                          <span>🔒</span>
                          <span>{AVATAR_COST}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contenu : Onglet Contrôles */}
        {activeTab === "controles" && (
          <div className="bg-gray-800 p-6 rounded border border-gray-700 space-y-6">
            <h2 className="text-xl font-bold mb-4">
              Personnalisation des touches
            </h2>
            <p className="text-sm text-gray-400">
              Clique sur une touche pour la modifier, puis appuie sur la
              nouvelle touche de ton choix.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-900 p-4 rounded border border-gray-700">
                <span>Déplacement à Gauche</span>
                <button
                  onClick={() => setIsListening("left")}
                  className={`px-4 py-2 rounded font-mono font-bold transition-all ${
                    isListening === "left"
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
                >
                  {isListening === "left"
                    ? "Appuie sur une touche..."
                    : keys.left}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-900 p-4 rounded border border-gray-700">
                <span>Déplacement à Droite</span>
                <button
                  onClick={() => setIsListening("right")}
                  className={`px-4 py-2 rounded font-mono font-bold transition-all ${
                    isListening === "right"
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
                >
                  {isListening === "right"
                    ? "Appuie sur une touche..."
                    : keys.right}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-900 p-4 rounded border border-gray-700">
                <span>Sauter / Valider</span>
                <button
                  onClick={() => setIsListening("jump")}
                  className={`px-4 py-2 rounded font-mono font-bold transition-all ${
                    isListening === "jump"
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
                >
                  {isListening === "jump"
                    ? "Appuie sur une touche..."
                    : keys.jump}
                </button>
              </div>
            </div>

            {/* Bouton global de sauvegarde des touches */}
            <div className="pt-6 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg transition-all"
              >
                Enregistrer les touches
              </button>
            </div>
          </div>
        )}

        {/* Contenu : Onglet Sons */}
        {activeTab === "sons" && (
          <div className="bg-gray-800 p-6 rounded border border-gray-700 space-y-6">
            <h2 className="text-xl font-bold mb-4">Gestion du volume</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Volume Général ({volumeMaster}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumeMaster}
                  onChange={(e) => setVolumeMaster(e.target.value)}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Effets Sonores - SFX ({volumeSFX}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumeSFX}
                  onChange={(e) => setVolumeSFX(e.target.value)}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pop-up de confirmation (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-8 rounded-lg border border-red-700 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirmer les changements
            </h3>
            <p className="text-gray-400 mb-8">
              Êtes-vous sûr de vouloir sauvegarder ces nouveaux paramètres ? Ils
              s'appliqueront à toutes vos prochaines parties.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EvilSettings;
