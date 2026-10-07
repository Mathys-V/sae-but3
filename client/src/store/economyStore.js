import { create } from 'zustand';

export const useEconomyStore = create((set) => ({
  coins: 500,
  freeSpins: 5,
  
  // Actions pour modifier l'économie
  deductBet: (amount) => set((state) => ({ coins: state.coins - amount })),
  addWinnings: (amount) => set((state) => ({ coins: state.coins + amount })),
  useFreeSpin: () => set((state) => ({ freeSpins: Math.max(0, state.freeSpins - 1) })),
  
  // Pour réinitialiser si le joueur fait faillite
  resetEconomy: () => set({ coins: 500, freeSpins: 5 })
}));