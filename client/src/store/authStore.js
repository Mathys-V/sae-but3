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

const DEFAULT_UNLOCKED = ['Icon1', 'Icon2', 'Icon3', 'Icon4', 'Icon5', 'Icon6'];

const initial = loadStoredAuth() || {
  user: null,
  token: null,
  role: null,
  userId: null,
  email: null,
  isGuest: false,
  avatar: 'Icon1',
  unlockedAvatars: DEFAULT_UNLOCKED,
};

export const useAuthStore = create((set) => ({
  user: initial.user,
  token: initial.token,
  role: initial.role,
  userId: initial.userId,
  email: initial.email,
  isGuest: Boolean(initial.isGuest),
  avatar: initial.avatar || (initial.role === 'admin' ? 'Icon48' : 'Icon1'),
  unlockedAvatars: initial.unlockedAvatars || DEFAULT_UNLOCKED,

  // Changement d'avatar actif
  setAvatar: (avatarName) => {
    set((state) => {
      const updated = { ...state, avatar: avatarName };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Erreur sauvegarde avatar :", e);
      }
      return { avatar: avatarName };
    });
  },

  // Déblocage d'un nouvel avatar (ex: achat boutique)
  unlockAvatar: (avatarName) => {
    set((state) => {
      const list = state.unlockedAvatars || DEFAULT_UNLOCKED;
      if (list.includes(avatarName)) return {};
      const updatedList = [...list, avatarName];
      const updated = { ...state, unlockedAvatars: updatedList };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Erreur sauvegarde nouvel avatar :", e);
      }
      return { unlockedAvatars: updatedList };
    });
  },

  // Connexion avec compte réel
  login: (arg1, maybeToken, maybeRole, maybeUserId, maybeEmail) => {
    let newState;
    if (typeof arg1 === 'object' && arg1 !== null) {
      const role = arg1.role || 'player';
      newState = {
        user: arg1.pseudo || arg1.user,
        token: arg1.access_token || arg1.token,
        role,
        userId: arg1.user_id || arg1.userId || null,
        email: arg1.email || null,
        isGuest: false,
        avatar: arg1.avatar || (role === 'admin' ? 'Icon48' : 'Icon1'),
        unlockedAvatars: arg1.unlockedAvatars || DEFAULT_UNLOCKED,
      };
    } else {
      const role = maybeRole || 'player';
      newState = {
        user: arg1,
        token: maybeToken || null,
        role,
        userId: maybeUserId || null,
        email: maybeEmail || null,
        isGuest: false,
        avatar: role === 'admin' ? 'Icon48' : 'Icon1',
        unlockedAvatars: DEFAULT_UNLOCKED,
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
      avatar: 'Icon1',
      unlockedAvatars: DEFAULT_UNLOCKED,
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
      avatar: 'Icon1',
      unlockedAvatars: DEFAULT_UNLOCKED,
    });
  },
}));
