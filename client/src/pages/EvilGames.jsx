import { ressourcesBUT } from "../data/ressources.js";

function EvilGames() {
  // On récupère 2 ressources par année pour la maquette
  const jeuxBUT1 = ressourcesBUT.BUT1.slice(0, 2);
  const jeuxBUT2 = ressourcesBUT.BUT2.slice(0, 2);
  const jeuxBUT3 = ressourcesBUT.BUT3.slice(0, 2);

  return (
    <main className="space-y-8">
      <div className="bg-blue-900 text-white p-6 text-center rounded shadow-lg">
        <h1 className="text-4xl font-bold">Mes jeux</h1>
      </div>

      {/* BUT 1 - Débloqué */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          But 1 : complétez toutes les ressources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jeuxBUT1.map((cours) => (
            <div
              key={cours.id}
              className="bg-gray-800 rounded border border-gray-700 p-3 flex flex-col justify-between h-32"
            >
              <div className="font-bold text-sm text-gray-300">
                {cours.id} - {cours.nom}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">0 % terminé</span>
                <button className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  ▶ Lancer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUT 2 - Verrouillé */}
      <section className="relative bg-gray-800/50 p-6 rounded border border-gray-700 opacity-60 grayscale">
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/50 backdrop-blur-sm rounded">
          <h2 className="text-4xl font-bold text-white flex items-center gap-4">
            🔒 But 2 : verrouillé
          </h2>
        </div>
        {/* Contenu visible en filigrane sous le cadenas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jeuxBUT2.map((cours) => (
            <div
              key={cours.id}
              className="bg-gray-800 rounded border border-gray-700 p-3 flex flex-col justify-between h-32 opacity-50"
            >
              <div className="font-bold text-sm text-gray-300">
                {cours.id} - {cours.nom}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Bloqué</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUT 3 - Verrouillé */}
      <section className="relative bg-gray-800/50 p-6 rounded border border-gray-700 opacity-60 grayscale">
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/50 backdrop-blur-sm rounded">
          <h2 className="text-4xl font-bold text-white flex items-center gap-4">
            🔒 But 3 : verrouillé
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jeuxBUT3.map((cours) => (
            <div
              key={cours.id}
              className="bg-gray-800 rounded border border-gray-700 p-3 flex flex-col justify-between h-32 opacity-50"
            >
              <div className="font-bold text-sm text-gray-300">
                {cours.id} - {cours.nom}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Bloqué</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Widgets du bas */}
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <h3 className="font-bold mb-2">CHRONOLOGIE</h3>
          <p className="text-gray-500 text-sm text-center py-4">
            Aucune activité ne nécessite d'action
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded border border-red-900/50 relative overflow-hidden">
          <h3 className="font-bold mb-2 text-red-500">
            CALENDRIER DE LA CORRUPTION
          </h3>
          <p className="text-center text-lg py-8 font-mono">
            Les joueurs ont X jours pour compléter le jeu sinon tout l'IUT est
            corrompu !
          </p>
        </div>
      </div>
    </main>
  );
}

export default EvilGames;
