import { useState, useEffect } from "react";

function EvilSettings() {
  useEffect(() => {
    document.title = "EvilJV | Paramètres";
  }, []);

  const [activeTab, setActiveTab] = useState("controles");
  const [volumeMaster, setVolumeMaster] = useState(80);
  const [volumeSFX, setVolumeSFX] = useState(100);

  const [keys, setKeys] = useState({
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
  });

  const [isListening, setIsListening] = useState(null);

  // Nouvel état pour gérer l'affichage du pop-up de confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (isListening) {
      e.preventDefault();
      setKeys({
        ...keys,
        [isListening]: e.code === "Space" ? "Space" : e.key.toUpperCase(),
      });
      setIsListening(null);
    }
  };

  useEffect(() => {
    if (isListening) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isListening, keys]);

  // Fonction déclenchée lors de la confirmation finale
  const handleSave = () => {
    // Plus tard, c'est ici qu'on enverra les données au backend ou au store Zustand
    console.log("Nouvelle configuration sauvegardée :", {
      keys,
      volumeMaster,
      volumeSFX,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="space-y-8 max-w-3xl mx-auto relative">
        <div className="bg-blue-900 text-white p-6 text-center rounded shadow-lg">
          <h1 className="text-4xl font-bold">Paramètres du Système</h1>
        </div>

        {/* Boutons d'onglets internes */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("controles")}
            className={`py-3 px-6 font-bold border-b-2 transition-colors ${
              activeTab === "controles"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            🎮 Contrôles du Clavier
          </button>
          <button
            onClick={() => setActiveTab("sons")}
            className={`py-3 px-6 font-bold border-b-2 transition-colors ${
              activeTab === "sons"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            🔊 Sons & Audio
          </button>
        </div>

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

        {/* Bouton global de sauvegarde */}
        <div className="pt-6 border-t border-gray-800 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg transition-all"
          >
            Enregistrer les modifications
          </button>
        </div>
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
