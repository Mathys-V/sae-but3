import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/api';

export default function Leaderboard({ gameId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      const data = await fetchLeaderboard(gameId);
      // Correction 1 : Optional chaining (?.)
      if (data?.scores) {
        setScores(data.scores);
      }
      setLoading(false);
    }
    // Correction 2 : Gestion de l'erreur avec .catch()
    loadScores().catch(console.error);
  }, [gameId]);

  if (loading) return <p className="text-gray-400">Chargement des scores...</p>;
  if (scores.length === 0) return <p className="text-gray-500">Aucun score pour ce jeu.</p>;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4 mt-4">
      <h3 className="text-lg font-bold text-red-500 mb-3 flex justify-between">
        <span>Classement mondial</span>
        <span>Jeu : {gameId}</span>
      </h3>
      <ul className="space-y-2">
        {scores.map((score) => (
          <li key={score.rank} className="flex justify-between items-center bg-gray-800 p-2 rounded">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-yellow-500">#{score.rank}</span>
              <span className="text-white font-medium">{score.pseudo}</span>
            </div>
            <span className="text-green-400 font-mono">{score.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}