import { Outlet, Link, useLocation } from "react-router-dom";
import rouletteBackground from "../assets/backgrounds/roulettebg.png";
import flamingoBackground from "../assets/backgrounds/flamingobg.png";
import tableBackground from "../assets/backgrounds/tablebg.png";

function EvilLayout() {
  const location = useLocation();
  const isDiving = location.pathname.includes("/plongee");
  const isCasino = ["/casino", "/machine", "/blackjack"].includes(location.pathname);
  const pageBackground = location.pathname === "/casino"
    ? flamingoBackground
    : location.pathname === "/blackjack"
      ? tableBackground
      : rouletteBackground;
  const casinoIntroBackground = location.pathname === "/casino";

  return (
    <div className={`min-h-screen ${isCasino ? "" : "bg-gray-900"} casino-layout text-gray-100 font-sans flex flex-col`}>
      {/* Barre de navigation Evil */}
      <header className="bg-gray-950 border-b border-red-900 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 font-medium">
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

      {/* Contenu dynamique des pages (Pleine largeur sans marge pour le jeu de plongée) */}
      <div
        className={`flex-1 w-full ${isDiving ? "p-0 overflow-hidden flex flex-col min-h-0" : isCasino ? "casino-page-stage" : "max-w-7xl mx-auto p-6"}`}
        style={isCasino ? {
          backgroundImage: casinoIntroBackground
            ? `linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 42%)), url("${pageBackground}")`
            : `url("${pageBackground}")`,
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        } : undefined}
      >
        {isCasino ? <div className="max-w-7xl mx-auto p-6"><Outlet /></div> : <Outlet />}
      </div>

      {/* Footer fixe visible sur toutes les pages */}
      <footer className={`${location.pathname === "/casino" ? "casino-intro-footer" : ""} bg-gray-900 text-center p-3 text-xs text-gray-500 border-t border-gray-800 shrink-0`}>
        Projet étudiant SAE - Ceci n'est pas une plateforme officielle
      </footer>
    </div>
  );
}

export default EvilLayout;
