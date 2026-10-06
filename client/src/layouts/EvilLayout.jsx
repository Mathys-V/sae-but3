import { Outlet, Link } from "react-router-dom";

function EvilLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* Barre de navigation Evil */}
      <header className="bg-gray-950 border-b border-red-900 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="text-red-600 font-bold text-2xl tracking-widest">
            EVIL<span className="text-gray-100">JV</span>
          </div>
          <nav className="flex gap-6 font-medium">
            <Link
              to="/evil"
              className="hover:text-red-500 flex items-center gap-2"
            >
              🏠 Accueil
            </Link>
            <Link
              to="/evil/jeux"
              className="hover:text-red-500 flex items-center gap-2"
            >
              🎮 Mes jeux
            </Link>
            <span className="text-yellow-500 flex items-center gap-2 cursor-not-allowed">
              🪙 Coins
            </span>
            <span className="text-gray-400 flex items-center gap-2 cursor-not-allowed">
              👥 Multijoueurs
            </span>
          </nav>
        </div>

        {/* Paramètres tout à droite */}
        <div>
          <Link
            to="/evil/parametres"
            className="hover:text-red-500 flex items-center gap-2 font-medium"
          >
            ⚙️ Paramètres
          </Link>
        </div>
      </header>

      {/* Contenu dynamique des pages */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet />
      </div>

      {/* Footer fixe */}
      <footer className="text-center p-4 text-sm text-gray-500 border-t border-gray-800 mt-auto">
        Projet étudiant SAE - Ceci n'est pas une plateforme officielle
      </footer>
    </div>
  );
}

export default EvilLayout;
