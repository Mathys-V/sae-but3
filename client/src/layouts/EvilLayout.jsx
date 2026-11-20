import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEconomyStore } from "../game/casino/economyStore";
import rouletteBackground from "../assets/backgrounds/roulettebg.png";
import flamingoBackground from "../assets/backgrounds/flamingobg.png";
import tableBackground from "../assets/backgrounds/tablebg.png";

function getPageBackground(pathname) {
  if (pathname === "/casino") return flamingoBackground;
  if (pathname === "/blackjack") return tableBackground;
  return rouletteBackground;
}

function UserProfileBadge({ user, isGuest, role, avatar }) {
  if (!user) return null;
  return (
    <div className="pixel-profile-frame hidden sm:flex">
      <img
        src={`/assets/ui/Barre-de-Navigation/Icones_profil/${avatar || "Icon1"}.png`}
        alt="Avatar du joueur"
        className="w-7 h-7 pixelated border border-gray-700 bg-gray-950 shadow"
      />
      <div className="flex flex-col leading-tight pr-1">
        <span className="font-vcr text-sm font-bold text-gray-100 tracking-wide">
          {user}
        </span>
        {isGuest && (
          <span className="text-[10px] text-gray-400 font-sans">
            Invité
          </span>
        )}
        {role === "admin" && (
          <span className="text-[10px] text-red-400 font-sans font-bold">
            Admin
          </span>
        )}
      </div>
    </div>
  );
}

const BACKGROUND_BY_ROUTE = {
  "/evil": "/assets/ui/fonds_site/exterieur_chateau.jpg",
  "/evil/jeux": "/assets/ui/fonds_site/interieur_chateau.jpg",
  "/evil/admin": "/assets/ui/fonds_site/salle_trone_chateau_admin.jpg",
  "/evil/parametres": "/assets/ui/fonds_site/alchimiste_chateau_option.jpg",
  "/evil/jeux/ihm-clash": "/assets/ui/fonds_site/atelier_architecte_ihm.png",
  "/evil/jeux/plongee": "/assets/ui/fonds_site/odyssee.png",
};

function getCastleBackgroundStyle(pathname) {
  const bgImage = BACKGROUND_BY_ROUTE[pathname];
  if (!bgImage) return undefined;
  return {
    backgroundImage: `linear-gradient(rgba(10, 10, 16, 0.30), rgba(5, 5, 8, 0.40)), url("${bgImage}")`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  };
}

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
  const castleBgStyle = getCastleBackgroundStyle(location.pathname);
  const hasCustomBg = isCasino || Boolean(castleBgStyle);
  const pageBackground = getPageBackground(location.pathname);
  const casinoIntroBackground = location.pathname === "/casino";

  return (
    <div
      className={`min-h-screen ${hasCustomBg ? "" : "bg-gray-950"} casino-layout text-gray-100 font-sans flex flex-col`}
      style={castleBgStyle}
    >
      {/* Barre de navigation Décor de Donjon Pixel Art */}
      <header className="navbar-dungeon px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo EvilJV avec Crâne Pixelisé et Titre Redden */}
          <Link
            to="/evil"
            className="flex items-center gap-2.5 group transition-transform active:scale-95 shrink-0"
            title="Accueil Evil MesCours"
          >
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/skull.png"
              alt="Logo EvilJV"
              className="w-8 h-8 sm:w-9 sm:h-9 pixelated drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform"
            />
            <span className="font-redden text-xl sm:text-2xl text-red-500 tracking-wider group-hover:text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              EVIL JV
            </span>
          </Link>

          {/* Navigation principale en Vraie Police Pixel lisible */}
          <nav className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
                className="w-5 h-5 pixelated"
              />
              <span className="hidden sm:inline">Mes jeux</span>
            </Link>

            {/* Solde de Coins dynamique */}
            <div
              className="pixel-pill"
              title="Pièces démoniaques récoltées"
            >
              <img
                src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
                alt="Coins"
                className="w-5 h-5 pixelated animate-pulse"
              />
              <span className="font-bold text-amber-200">{coins}</span>
              <span className="hidden md:inline text-xs text-amber-500 uppercase tracking-wider">
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
                className="w-5 h-5 pixelated grayscale opacity-70"
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
                  className="w-5 h-5 pixelated drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]"
                />
                <span>Modération</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Profil, Paramètres & Déconnexion tout à droite */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cadre Profil Utilisateur Pixel Art avec Avatar */}
          <UserProfileBadge
            user={user}
            isGuest={isGuest}
            role={role}
            avatar={avatar}
          />

          {/* Bouton Paramètres / Options */}
          <Link
            to="/evil/parametres"
            className={`pixel-btn ${location.pathname === "/evil/parametres" ? "active" : ""}`}
            title="Paramètres & Profil"
          >
            <img
              src="/assets/ui/Barre-de-Navigation/sprites/gear-32.png"
              alt="Engrenage"
              className="w-5 h-5 pixelated"
            />
            <span className="hidden md:inline">Options</span>
          </Link>

          {/* Déconnexion ou Connexion */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="pixel-btn text-gray-300 hover:text-red-300"
              title="Se déconnecter"
            >
              <span>Quitter</span>
            </button>
          ) : (
            <Link
              to="/connexionMCJV"
              className="pixel-btn pixel-btn-red"
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
