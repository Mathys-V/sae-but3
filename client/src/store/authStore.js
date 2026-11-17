// client/src/store/authStore.js
import { create } from 'zustand';

const STORAGE_KEY = 'evil_mescours_auth';

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initial = loadStoredAuth() || {
  user: null,
  token: null,
  role: null,
  userId: null,
  email: null,
  isGuest: false,
};

export const useAuthStore = create((set) => ({
  user: initial.user,
  token: initial.token,
  role: initial.role,
  userId: initial.userId,
  email: initial.email,
  isGuest: Boolean(initial.isGuest),

  // Connexion avec compte réel
  login: (arg1, maybeToken, maybeRole, maybeUserId, maybeEmail) => {
    let newState;
    if (typeof arg1 === 'object' && arg1 !== null) {
      newState = {
        user: arg1.pseudo || arg1.user,
        token: arg1.access_token || arg1.token,
        role: arg1.role || 'player',
        userId: arg1.user_id || arg1.userId || null,
        email: arg1.email || null,
        isGuest: false,
      };
    } else {
      newState = {
        user: arg1,
        token: maybeToken || null,
        role: maybeRole || 'player',
        userId: maybeUserId || null,
        email: maybeEmail || null,
        isGuest: false,
      };
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Erreur lors de la sauvegarde locale de session :", e);
    }

    set(newState);
  },

  // Connexion en tant qu'invité (sans compte en base)
  loginAsGuest: (customPseudo = null) => {
    const guestId = Math.floor(1000 + Math.random() * 9000);
    const guestPseudo = customPseudo?.trim() || `Invité_${guestId}`;
    const newState = {
      user: guestPseudo,
      token: null,
      role: 'player',
      userId: null,
      email: null,
      isGuest: true,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Erreur lors de la sauvegarde du mode invité :", e);
    }

    set(newState);
  },

  // Déconnexion
  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Erreur de suppression de la session locale :", e);
    }

    set({
      user: null,
      token: null,
      role: null,
      userId: null,
      email: null,
      isGuest: false,
    });
  },
}));
