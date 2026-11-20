// client/src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const fetchAchievements = async (token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/games/achievements`, { headers });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erreur fetchAchievements :", error);
    return [];
  }
};

// Récupération des scores d'un mini-jeu
export const fetchLeaderboard = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/leaderboard/${gameId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des scores");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur API Leaderboard :", error);
    return null;
  }
};

// Connexion utilisateur (renvoie success + data ou success + error)
export const loginUser = async (pseudo, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Identifiants incorrects" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur de connexion :", error);
    return {
      success: false,
      error: "Impossible de joindre le serveur. Vérifiez que le backend FastAPI est démarré.",
    };
  }
};

// Inscription d'un nouvel utilisateur
export const registerUser = async (pseudo, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errMsg = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail || "Erreur lors de l'inscription";
      return { success: false, error: errMsg };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    return {
      success: false,
      error: "Impossible de joindre le serveur. Vérifiez que le backend FastAPI est démarré.",
    };
  }
};

// Récupération du profil actuel via token JWT
export const fetchCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetchCurrentUser :", error);
    return null;
  }
};

// Administration : liste des utilisateurs (avec recherche et pagination)
export const fetchAdminUsers = async (
  token,
  { skip = 0, limit = 50, search = "" } = {},
) => {
  try {
    const params = new URLSearchParams({ skip, limit });
    if (search.trim()) params.append("search", search.trim());

    const response = await fetch(`${API_URL}/admin/users?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Erreur lors de la récupération des utilisateurs",
      };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur fetchAdminUsers :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Administration : bannir ou débannir un joueur
export const toggleUserBan = async (token, userId, banned, reason = "") => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ banned, reason }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Erreur lors de la mise à jour du bannissement",
      };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur toggleUserBan :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Administration : promouvoir ou rétrograder un rôle
export const changeUserRole = async (token, userId, role) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Erreur lors du changement de rôle",
      };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur changeUserRole :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Administration : vue d'ensemble des statistiques & KPIs de rétention
export const fetchAdminOverviewStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Erreur stats overview" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur fetchAdminOverviewStats :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Administration : analyse de la rétention et des abandons par jeu
export const fetchAdminGameStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats/games`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Erreur stats games" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur fetchAdminGameStats :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Administration : activité horaire et répartition des abandons
export const fetchAdminRetentionStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats/retention`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Erreur stats retention" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erreur fetchAdminRetentionStats :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};

// Gameplay : enregistre une session et un score réels en base de données
export const recordGameSession = async (
  token,
  { game, score = 0, timeSeconds = 0, completed = true, status = "finished" } = {},
) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}/games/record-session`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        game_name: game,
        score,
        time_seconds: timeSeconds,
        completed,
        status,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Erreur enregistrement partie" };
    }
    return { success: true, data };
  } catch (error) {
    console.warn("Erreur réseau enregistrement session jeu :", error);
    return { success: false, error: "Impossible de joindre le serveur." };
  }
};
