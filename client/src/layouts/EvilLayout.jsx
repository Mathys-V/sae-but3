import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function EvilLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDiving = location.pathname.includes("/plongee");
  const { user, role, isGuest, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/connexionMCJV");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* Barre de navigation Evil */}
      <header className="bg-gray-950 border-b border-red-900 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 font-medium">
            <Link
              to="/evil"
              className="hover:text-red-500 flex items-center gap-2"
            >
              Accueil
            </Link>
            <Link
              to="/evil/jeux"
              className="hover:text-red-500 flex items-center gap-2"
            >
              Mes jeux
            </Link>
            <span className="text-yellow-500 flex items-center gap-2 cursor-not-allowed">
              Coins
            </span>
            <span className="text-gray-400 flex items-center gap-2 cursor-not-allowed">
              Multijoueurs
            </span>

            {/* Onglet d'Administration & Modération si l'utilisateur est admin */}
            {role === "admin" && (
              <Link
                to="/evil/admin"
                className="hover:bg-red-900/60 bg-red-950/70 text-red-400 hover:text-red-200 border border-red-700/80 px-2.5 py-1 rounded-md text-sm font-bold flex items-center gap-1.5 transition"
              >
                <span>🛡️</span>
                <span>Modération</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Profil & Paramètres tout à droite */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300 bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700">
              <span>👤</span>
              <span className="font-semibold text-gray-100">{user}</span>
              {isGuest && (
                <span className="bg-gray-700 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">
                  Invité
                </span>
              )}
              {role === "admin" && (
                <span className="bg-yellow-950 text-yellow-400 border border-yellow-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  Admin
                </span>
              )}
            </div>
          )}

          <Link
            to="/evil/parametres"
            className="hover:text-red-500 flex items-center gap-1.5 font-medium text-sm text-gray-300"
          >
            ⚙️ Paramètres
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-red-400 text-xs text-gray-400 hover:underline transition"
              title="Se déconnecter"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              to="/connexionMCJV"
              className="text-xs text-red-400 hover:underline"
            >
              Connexion
            </Link>
          )}
        </div>
      </header>

      {/* Contenu dynamique des pages (Pleine largeur sans marge pour le jeu de plongée) */}
      <div
        className={`flex-1 w-full ${
          isDiving
            ? "p-0 overflow-hidden flex flex-col min-h-0"
            : "max-w-7xl mx-auto p-6"
        }`}
      >
        <Outlet />
      </div>

      {/* Footer fixe visible sur toutes les pages */}
      <footer className="text-center p-3 text-xs text-gray-500 border-t border-gray-800 shrink-0">
        Projet étudiant SAE - Ceci n'est pas une plateforme officielle
      </footer>
    </div>
  );
}

export default EvilLayout;
