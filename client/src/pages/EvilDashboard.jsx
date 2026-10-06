import { Link } from "react-router-dom";
import { ressourcesBUT } from "../data/ressources.js";

function EvilDashboard() {
  // On récupère exactement les mêmes ressources débloquées que sur la page EvilGames
  const jeuxActifs = ressourcesBUT.BUT1.slice(0, 2);

  return (
    <main className="space-y-8 animate-fade-in">
      {/* Bandeau de bienvenue */}
      <div className="bg-red-900 text-white p-8 text-center rounded shadow-lg border border-red-700">
        <h1 className="text-5xl font-bold">Bienvenue sur evilJV</h1>
      </div>

      {/* Les 3 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded border border-gray-700 flex flex-col items-center">
          <div className="text-6xl mb-4">📖💡</div>
          <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center">
            Tutoriel
          </h2>
          <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded">
            Accéder
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700 flex flex-col items-center">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center">
            Monde de jeux
          </h2>
          <Link
            to="/evil/jeux"
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-center block"
          >
            Accéder
          </Link>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700 flex flex-col items-center relative">
          <div className="absolute -top-4 -right-4 text-4xl">🦆</div>
          <div className="text-6xl mb-4">🏅</div>
          <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center">
            Succès
          </h2>
          <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded">
            Accéder
          </button>
        </div>
      </div>

      {/* Section Jouons */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6">JOUONS !</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {jeuxActifs.map((cours) => (
            <Link
              to="/evil/jeux"
              key={cours.id}
              className="bg-gray-900 border border-gray-700 rounded overflow-hidden hover:border-red-500 transition-colors"
            >
              <div className="h-24 bg-blue-900 flex items-center justify-center text-3xl">
                🎮
              </div>
              <div className="p-2 text-xs text-gray-400 font-bold">
                {cours.id}
              </div>
              <div
                className="p-2 text-xs text-gray-500 truncate"
                title={cours.nom}
              >
                {cours.nom}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default EvilDashboard;
