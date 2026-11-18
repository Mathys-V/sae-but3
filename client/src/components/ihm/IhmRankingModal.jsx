// client/src/components/ihm/IhmRankingModal.jsx

export default function IhmRankingModal({ rankings, onPlayAgain, onBackToGames }) {
  // rankings: [{ rank, pseudo, avatar, score, avgTimeMs, coinsWon, isMe }]
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="pixel-panel p-6 max-w-xl w-full text-center space-y-6 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.6)] rounded">
        {/* En-tête Podium */}
        <div>
          <span className="text-3xl">🏆</span>
          <h2 className="text-2xl font-bold text-amber-400 uppercase tracking-widest mt-1">
            CLASSEMENT FINAL DU SALON
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Tous les participants départagés aux points et au temps de réaction en millisecondes
          </p>
        </div>

        {/* Liste des participants (Jusqu'à 4 joueurs) */}
        <div className="space-y-2.5">
          {rankings.map((player, idx) => {
            const isWinner = idx === 0;
            const rankBadges = ["🥇 1ER", "🥈 2E", "🥉 3E", "4E"];

            return (
              <div
                key={player.pseudo || idx}
                className={`p-3 border-2 flex items-center justify-between gap-3 transition-all rounded ${
                  isWinner
                    ? "bg-amber-950/80 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                    : player.isMe
                      ? "bg-red-950/70 border-red-500"
                      : "bg-gray-950/70 border-gray-800"
                }`}
              >
                {/* Rang et Avatar */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold w-14 text-left font-mono ${isWinner ? "text-amber-300" : "text-gray-400"}`}>
                    {rankBadges[idx] || `${idx + 1}E`}
                  </span>
                  <img
                    src={`/assets/ui/Barre-de-Navigation/Icones_profil/${player.avatar || "Icon1"}.png`}
                    alt={player.pseudo}
                    className="w-10 h-10 pixelated bg-gray-900 border border-gray-700 rounded shrink-0"
                  />
                  <div className="text-left">
                    <p className={`text-sm font-bold ${player.isMe ? "text-red-400" : "text-gray-100"}`}>
                      {player.pseudo} {player.isMe && <span className="text-xs text-amber-400 font-mono">(VOUS)</span>}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      Temps moy : {(player.avgTimeMs / 1000).toFixed(2)}s
                    </p>
                  </div>
                </div>

                {/* Score et Récompense */}
                <div className="text-right">
                  <p className="text-base font-bold text-amber-300 font-mono">{player.score} PTS</p>
                  <p className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1 font-mono">
                    <span>+{player.coinsWon}</span>
                    <img
                      src="/assets/ui/Barre-de-Navigation/sprites/coin-32.png"
                      alt="Coins"
                      className="w-3.5 h-3.5 pixelated inline"
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-800">
          <button
            type="button"
            onClick={onPlayAgain}
            className="pixel-btn w-full !bg-amber-700 hover:!bg-amber-600 !text-white !font-sans font-bold"
          >
            NOUVELLE PARTIE
          </button>
          <button
            type="button"
            onClick={onBackToGames}
            className="pixel-btn w-full !font-sans font-bold"
          >
            RETOUR AUX JEUX
          </button>
        </div>
      </div>
    </div>
  );
}
