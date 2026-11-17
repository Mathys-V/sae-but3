import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ressourcesBUT } from "../data/ressources.js";

/**
 * Composant de carte de ressource / mini-jeu (le profil du bloc de jeu).
 * Met en valeur les jeux dotés d'assets dédiés (fond d'ambiance, sprite pixel art, tag).
 */
function CourseCard({ cours }) {
  const hasGame = Boolean(cours.path);

  return (
    <div
      className={`relative rounded-lg border overflow-hidden p-3.5 flex flex-col justify-between min-h-[9.5rem] transition-all duration-300 group shadow-md ${
        hasGame
          ? "border-cyan-500/60 bg-slate-900/90 hover:border-cyan-400 hover:shadow-cyan-900/30 hover:shadow-lg"
          : "bg-gray-800 border-gray-700 hover:border-gray-600"
      }`}
      style={
        cours.bgImage
          ? {
              backgroundImage: `linear-gradient(to right, rgba(8, 18, 35, 0.72) 0%, rgba(12, 28, 52, 0.45) 55%, rgba(12, 28, 52, 0.2) 100%), url(${cours.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Sprite ou illustration du jeu dans le coin supérieur droit */}
      {cours.spriteIcon && (
        <div className="absolute top-2 right-2 pointer-events-none opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300">
          <img
            src={cours.spriteIcon}
            alt={cours.nom}
            className="w-16 h-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] [image-rendering:pixelated]"
          />
        </div>
      )}

      {/* En-tête : Badge identifiant & Titre du cours */}
      <div className="relative z-10 pr-14">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-gray-700/80 text-cyan-300 border border-gray-600/50">
            {cours.id}
          </span>
          {cours.tag && (
            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
              {cours.tag}
            </span>
          )}
        </div>
        <div className="font-bold text-sm text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] line-clamp-2 leading-snug group-hover:text-cyan-200 transition-colors">
          {cours.nom}
        </div>
      </div>

      {/* Bas de carte : Progression & Bouton d'accès */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/60 bg-slate-950/40 -mx-3.5 -mb-3.5 px-3.5 pb-2.5 rounded-b-lg relative z-10 backdrop-blur-[2px]">
        <span className="text-xs text-gray-200 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">0 % terminé</span>
        <Link
          to={cours.path ? cours.path : `/evil/jeux/${cours.id}`}
          className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-200 ${
            hasGame
              ? "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md hover:shadow-cyan-500/40"
              : "text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
          }`}
        >
          <span>▶</span>
          <span>Lancer</span>
        </Link>
      </div>
    </div>
  );
}

function EvilGames() {
  // Ressources BUT 1
  const jeuxBUT1 = ressourcesBUT.BUT1.slice(0, 6);

  // Ressources BUT 2 (Déverrouillées pour le développement)
  const jeuxBUT2 = ressourcesBUT.BUT2.slice(0, 3);

  // Ressources BUT 3 : inclut en priorité le jeu de plongée R5.A.06
  const divingGame = ressourcesBUT.BUT3.find((c) => c.id === "R5.A.06");
  const otherBUT3 = ressourcesBUT.BUT3.filter((c) => c.id !== "R5.A.06").slice(0, 2);
  const jeuxBUT3 = divingGame ? [divingGame, ...otherBUT3] : ressourcesBUT.BUT3.slice(0, 3);

  useEffect(() => {
    document.title = "EvilJV | Mes Jeux";
  }, []);

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
            <CourseCard key={cours.id} cours={cours} />
          ))}
        </div>
      </section>

      {/* BUT 2 - Déverrouillé pour le dev */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            But 2 : complétez toutes les ressources
          </h2>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold">
            🔓 Déverrouillé (Dev)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jeuxBUT2.map((cours) => (
            <CourseCard key={cours.id} cours={cours} />
          ))}
        </div>
      </section>

      {/* BUT 3 - Déverrouillé pour le dev */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            But 3 : complétez toutes les ressources
          </h2>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-semibold">
            🔓 Déverrouillé (Dev)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jeuxBUT3.map((cours) => (
            <CourseCard key={cours.id} cours={cours} />
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
