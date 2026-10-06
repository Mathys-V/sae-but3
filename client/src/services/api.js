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

// Fonction pour envoyer les identifiants au serveur
export const loginUser = async (pseudo, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo, password }),
    });
    
    if (!response.ok) {
      throw new Error("Identifiants incorrects");
    }
    
    return await response.json(); // Renvoie { access_token, token_type, pseudo }
  } catch (error) {
    console.error("Erreur de connexion :", error);
    return null; // Retourne null si la connexion échoue
  }
};