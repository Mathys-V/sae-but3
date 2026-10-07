import { create } from 'zustand';

export const useEconomyStore = create((set) => ({
  coins: 0,
  freeSpins: 10,
  paidSpins: 0, // Le vrai score pour le Leaderboard
  
  // Actions
  deductBet: (amount) => set((state) => ({ 
    coins: state.coins - amount,
    paidSpins: state.paidSpins + 1 // On augmente le score à chaque lancer payant !
  })),
  
  addWinnings: (amount) => set((state) => ({ coins: state.coins + amount })),
  useFreeSpin: () => set((state) => ({ freeSpins: Math.max(0, state.freeSpins - 1) })),
  
  resetEconomy: () => set({ coins: 0, freeSpins: 10, paidSpins: 0 })
}));