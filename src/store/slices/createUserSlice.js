export const createUserSlice = (set, get) => ({
  userName: "Amelia",
  userLevel: "Luna Nueva",
  userAvatar: "",
  userStars: 600,
  statistics: {
    totalStarsEarned: 600,
    totalStarsSpent: 0,
    totalMoney: 0,
    totalMoons: 0,
    totalTasksCompleted: 0
  },
  userLevels: [
    { id: 1, name: "Luna Nueva", minExp: 0, reward: 0 },
    { id: 2, name: "Luna Creciente", minExp: 10, reward: 50 },
    { id: 3, name: "Cuarto Creciente", minExp: 30, reward: 100 },
    { id: 4, name: "Gibosa Creciente", minExp: 60, reward: 150 },
    { id: 5, name: "Luna Llena", minExp: 100, reward: 300 },
    { id: 6, name: "Luna Azul", minExp: 160, reward: 500 },
    { id: 7, name: "Superluna", minExp: 250, reward: 1000 }
  ],
  updateProfile: (data) => set((state) => ({ ...state, ...data })),
  updateStars: (amount) => set((state) => {
    const newStars = Math.max(0, state.userStars + amount);
    
    // Si amount es positivo: Es ganancia pura (sube current, sube earned)
    // Si amount es negativo: Es un ajuste/reembolso (baja current, baja earned)
    // En NINGÚN caso aquí se toca totalStarsSpent.
    return { 
      userStars: newStars,
      statistics: { 
        ...state.statistics, 
        totalStarsEarned: Math.max(0, state.statistics.totalStarsEarned + amount)
      }
    };
  }),
  spendStars: (amount) => set((state) => {
    const absAmount = Math.abs(amount);
    if (state.userStars < absAmount) return state; // Seguridad

    return {
      userStars: state.userStars - absAmount,
      statistics: {
        ...state.statistics,
        totalStarsSpent: state.statistics.totalStarsSpent + absAmount
        // totalStarsEarned NO cambia porque ya se ganó anteriormente.
      }
    };
  }),
  updateTasks: (amount) => set((state) => ({
    statistics: { ...state.statistics, totalTasksCompleted: Math.max(0, state.statistics.totalTasksCompleted + amount) }
  })),
  updateMoney: (amount) => set((state) => ({
    statistics: { ...state.statistics, totalMoney: Math.max(0, state.statistics.totalMoney + amount) }
  }))
});
