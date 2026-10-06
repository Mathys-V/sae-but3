// client/src/services/api.js

const API_URL = "http://localhost:8000/api"; // L'adresse de ton serveur FastAPI

// Fonction pour récupérer les scores d'un mini-jeu spécifique
export const fetchLeaderboard = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/leaderboard/${gameId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur API :", error);
    return null;
  }
};