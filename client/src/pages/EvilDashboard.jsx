import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ressourcesBUT } from "../data/ressources.js";
import { useAuthStore } from "../store/authStore.js";
import LoginForm from "../components/LoginForm.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

// Import des icônes et fonds
import bookIcon from "../assets/icons/book.png";
import portalIcon from "../assets/icons/portal.png";
import medalIcon from "../assets/icons/medal.png";
import libraryBg from "../assets/librarybg.jpg";
import spaceBg from "../assets/spacebg.jpg";
import treasureBg from "../assets/treasurebg.jpg";

function EvilDashboard() {
  // 1. TOUS LES HOOKS EN PREMIER (Règle d'or de React)
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = "EvilJV - Dashboard";
  }, []);

  // 2. LES CONDITIONS (return anticipés) ENSUITE
  // Si le joueur n'est PAS connecté, on bloque l'accès et on affiche le formulaire
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoginForm />
      </div>
    );
  }

  // 3. LE RESTE DU COMPOSANT
  // On récupère exactement les mêmes ressources débloquées que sur la page EvilGames
  const jeuxActifs = ressourcesBUT.BUT1.slice(0, 2);


  return (
    <main className="space-y-8 animate-fade-in">
      {/* Titre EvilJV centré et imposant */}
      <div className="w-full text-center mb-12 flex justify-center items-center">
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-redden tracking-widest leading-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] select-none">
          EvilJV
        </h1>
      </div>

      {/* Les 3 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Tutoriel */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 shadow-lg">
          <Link
            to="/evil/jeux/tutoriel"
            className="relative w-full h-52 bg-cover bg-center flex items-center justify-center overflow-hidden border-b border-gray-700/80 cursor-pointer block"
            style={{ backgroundImage: `url(${libraryBg})` }}
          >
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-300" />
            <img
              src={bookIcon}
              alt="Tutoriel"
              className="relative z-10 w-32 h-32 md:w-36 md:h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out group-hover:scale-115"
            />
          </Link>
          <div className="p-4 flex flex-col items-center flex-1 justify-between">
            <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center text-white">
              Tutoriel
            </h2>
            <Link
              to="/evil/jeux/tutoriel"
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-center block text-white font-medium transition-colors"
            >
              Accéder
            </Link>
          </div>
        </div>

        {/* Carte Monde de jeux */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 shadow-lg">
          <Link
            to="/evil/jeux"
            className="relative w-full h-52 bg-cover bg-center flex items-center justify-center overflow-hidden border-b border-gray-700/80 cursor-pointer block"
            style={{ backgroundImage: `url(${spaceBg})` }}
          >
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-300" />
            <img
              src={portalIcon}
              alt="Monde de jeux"
              className="relative z-10 w-32 h-32 md:w-36 md:h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out group-hover:scale-115"
            />
          </Link>
          <div className="p-4 flex flex-col items-center flex-1 justify-between">
            <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center text-white">
              Monde de jeux
            </h2>
            <Link
              to="/evil/jeux"
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-center block text-white font-medium transition-colors"
            >
              Accéder
            </Link>
          </div>
        </div>

        {/* Carte Succès */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 shadow-lg">
          <div
            className="relative w-full h-52 bg-cover bg-center flex items-center justify-center overflow-hidden border-b border-gray-700/80 cursor-pointer"
            style={{ backgroundImage: `url(${treasureBg})` }}
          >
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-300" />
            <img
              src={medalIcon}
              alt="Succès"
              className="relative z-10 w-32 h-32 md:w-36 md:h-36 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out group-hover:scale-115"
            />
          </div>
          <div className="p-4 flex flex-col items-center flex-1 justify-between">
            <h2 className="text-xl font-bold mb-4 w-full border-b border-gray-700 pb-2 text-center text-white">
              Succès
            </h2>
            <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-white font-medium transition-colors">
              Accéder
            </button>
          </div>
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
      
      {/* Section Leaderboard */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">🏆 MEILLEURS JOUEURS</h2>
        <Leaderboard gameId="sae-mission-2" />
      </div>
    </main>
  );
}

export default EvilDashboard;