// client/src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Par défaut, l'utilisateur n'est pas connecté
  token: null,
  
  // Fonction pour connecter l'utilisateur
  login: (pseudo, token) => set({ user: pseudo, token: token }),
  
  // Fonction pour se déconnecter
  logout: () => set({ user: null, token: null }),
}));