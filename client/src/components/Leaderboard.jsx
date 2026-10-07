export default function Leaderboard({ gameId }) {
  // Fausses données pour simuler la base de données en attendant l'API
  const mockScores = [
    { rank: 1, pseudo: "SuperFeet", score: 124 },
    { rank: 2, pseudo: "KilianLeBoss", score: 89 },
    { rank: 3, pseudo: "IUT_Master", score: 45 },
    { rank: 4, pseudo: "R1.06_Fan", score: 12 },
    { rank: 5, pseudo: "Looser", score: 2 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-6 shadow-lg">
      <h3 className="text-xl font-bold text-red-500 mb-4 flex justify-between items-center border-b border-gray-700 pb-2">
        <span>Classement mondial</span>
        <span className="text-sm text-gray-400 font-normal">Jeu : {gameId}</span>
      </h3>
      
      <ul className="space-y-3">
        {mockScores.map((score) => (
          <li key={score.rank} className="flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-700 hover:border-red-500 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-yellow-500">#{score.rank}</span>
              <span className="text-white font-bold text-lg">{score.pseudo}</span>
            </div>
            <span className="text-green-400 font-mono text-xl">{score.score} lancers</span>
          </li>
        ))}
      </ul>
    </div>
  );
}