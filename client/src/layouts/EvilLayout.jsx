import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";
import rouletteBackground from "../assets/backgrounds/roulettebg.png";
import flamingoBackground from "../assets/backgrounds/flamingobg.png";
import tableBackground from "../assets/backgrounds/tablebg.png";

function EvilLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDiving = location.pathname.includes("/plongee");
  const { user, role, isGuest, avatar, logout } = useAuthStore();
  const { coins } = useEconomyStore();

  const handleLogout = () => {
    logout();
    navigate("/connexionMCJV");
  };

  const isCasino = ["/casino", "/machine", "/blackjack"].includes(location.pathname);
  
  // Évite les ternaires imbriquées pour la clarté et SonarCloud
  let pageBackground = rouletteBackground;
  if (location.pathname === "/casino") {
    pageBackground = flamingoBackground;
  } else if (location.pathname === "/blackjack") {
    pageBackground = tableBackground;
  }
  const casinoIntroBackground = location.pathname === "/casino";

  return (
    <div className={`min-h-screen ${isCasino ? "" : "bg-gray-950"} casino-layout text-gray-100 font-sans flex flex-col`}>
      {/* Barre de navigation Pixel Art Evil */}
      <header className="bg-gray-950/95 border-b-2 border-red-950/80 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm shadow-lg shadow-black/60">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo EvilJV avec Crâne Pixelisé */}
          <Link
            to="/evil"
            className="flex items-center gap-2 group transition-transform active:scale-95"
            title="Accueil Evil MesCours"
          >
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/skull.png"
              alt="Logo EvilJV"
              className="w-7 h-7 sm:w-8 sm:h-8 pixelated drop-shadow-[0_0_8px_rgba(220,38,38,0.7)] group-hover:scale-110 transition-transform"
            />
            <span className="font-redden text-lg sm:text-xl text-red-500 tracking-wider group-hover:text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              EVIL JV
            </span>
          </Link>

          {/* Navigation principale */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/evil"
              className={`pixel-btn ${location.pathname === "/evil" ? "active" : ""}`}
            >
              <span>Accueil</span>
            </Link>

            <Link
              to="/evil/jeux"
              className={`pixel-btn ${location.pathname.startsWith("/evil/jeux") ? "active" : ""}`}
            >
              <img
                src="/assets/ui/Barre-de-Navigation/sprites/gamepad-32.png"
                alt="Manette"
                className="w-4 h-4 pixelated"
              />
              <span className="hidden sm:inline">Mes jeux</span>
            </Link>

            {/* Solde de Coins dynamique */}
            <div
              className="pixel-pill bg-amber-950/40 border-amber-900/60 text-amber-300 text-xs"
              title="Pièces démoniaques récoltées"
            >
              <img
                src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
                alt="Coins"
                className="w-4 h-4 pixelated animate-pulse"
              />
              <span className="font-bold text-amber-200">{coins}</span>
              <span className="hidden md:inline text-[10px] text-amber-500 uppercase tracking-wider">
                Coins
              </span>
            </div>

            {/* Multijoueur */}
            <span
              className="pixel-btn opacity-60 cursor-not-allowed text-gray-400 hidden sm:inline-flex"
              title="Salon Multijoueur (Bientôt disponible)"
            >
              <img
                src="/assets/ui/Barre-de-Navigation/sprites/multiplayer-32.png"
                alt="Multijoueurs"
                className="w-4 h-4 pixelated grayscale opacity-70"
              />
              <span className="hidden lg:inline">Multijoueurs</span>
            </span>

            {/* Onglet d'Administration & Modération si l'utilisateur est admin */}
            {role === "admin" && (
              <Link
                to="/evil/admin"
                className={`pixel-btn pixel-btn-red ${location.pathname === "/evil/admin" ? "active" : ""}`}
                title="Panneau de modération et statistiques"
              >
                <img
                  src="/assets/ui/Barre-de-Navigation/sprites/shield-32.png"
                  alt="Bouclier"
                  className="w-4 h-4 pixelated drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                />
                <span>Modération</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Profil, Paramètres & Déconnexion tout à droite */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge Profil Utilisateur avec Avatar Pixel Art */}
          {user && (
            <div className="flex items-center gap-2 bg-gray-900/90 border border-red-950/70 px-2 py-1 rounded shadow-inner">
              <img
                src={`/assets/ui/Barre-de-Navigation/Icones_profil/${avatar || "Icon1"}.png`}
                alt="Avatar du joueur"
                className="w-6 h-6 pixelated border border-gray-700 rounded bg-gray-950 shadow"
              />
              <div className="flex flex-col leading-none">
                <span className="font-redden text-xs text-gray-200 tracking-wide">
                  {user}
                </span>
                {isGuest && (
                  <span className="text-[9px] text-gray-400 font-sans">
                    Invité
                  </span>
                )}
                {role === "admin" && (
                  <span className="text-[9px] text-red-400 font-sans font-bold">
                    Admin
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bouton Paramètres */}
          <Link
            to="/evil/parametres"
            className={`pixel-btn ${location.pathname === "/evil/parametres" ? "active" : ""}`}
            title="Paramètres de jeu"
          >
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/gear-32.png"
              alt="Engrenage"
              className="w-4 h-4 pixelated"
            />
            <span className="hidden md:inline">Options</span>
          </Link>

          {/* Déconnexion ou Connexion */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="pixel-btn text-xs hover:text-red-300"
              title="Se déconnecter"
            >
              <span>Quitter</span>
            </button>
          ) : (
            <Link
              to="/connexionMCJV"
              className="pixel-btn pixel-btn-red text-xs"
            >
              <span>Connexion</span>
            </Link>
          )}
        </div>
      </header>

      {/* Contenu dynamique des pages */}
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
      <footer className={`${location.pathname === "/casino" ? "casino-intro-footer" : ""} bg-gray-950 text-center p-3 text-xs text-gray-500 border-t border-gray-900 shrink-0 font-mono`}>
        Projet étudiant SAE - Evil MesCoursJV
      </footer>
    </div>
  );
}

export default EvilLayout;
