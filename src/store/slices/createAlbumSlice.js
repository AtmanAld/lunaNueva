import { ALBUM_PAGES, ALBUM_SLOTS } from '../../data/albumCatalog';

const generateRitualReward = () => {
  const rewardTypes = ['stars', 'agua', 'comida', 'jabob', 'juguete'];
  const chosenType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
  let amount = 0;
  let text = '';
  if (chosenType === 'stars') {
    amount = Math.floor(Math.random() * 66) + 1;
    text = `${amount} ⭐`;
  } else if (chosenType === 'agua') {
    amount = Math.floor(Math.random() * 5) + 1;
    text = `${amount} 💧`;
  } else if (chosenType === 'comida') {
    amount = Math.floor(Math.random() * 5) + 1;
    text = `${amount} 🍖`;
  } else if (chosenType === 'jabob') {
    amount = Math.floor(Math.random() * 5) + 1;
    text = `${amount} 🧼`;
  } else if (chosenType === 'juguete') {
    amount = Math.floor(Math.random() * 5) + 1;
    text = `${amount} 🐭`;
  }
  return { type: chosenType, amount, text };
};

const applyRitualReward = (get, reward) => {
  if (!reward) return;
  if (reward.type === 'stars') {
    get().updateStars(reward.amount);
  } else {
    const catalogProduct = get().catalog?.find(p => p.id === reward.type);
    if (catalogProduct) {
      const productToAdd = {
        ...catalogProduct,
        payload: {
          ...catalogProduct.payload,
          quantity: reward.amount
        }
      };
      get().addPetItem(productToAdd);
    }
  }
};

export const createAlbumSlice = (set, get) => ({
  albumPage: 1,
  ritualState: {
    phase: 'idle',
    step: 1,
    rewards: null
  },
  startClaimRitual: () => set((state) => {
    const reward1 = generateRitualReward();
    const reward2 = generateRitualReward();
    const reward3 = generateRitualReward();
    return {
      ritualState: {
        phase: 'active',
        step: 1,
        rewards: { reward1, reward2, reward3 }
      }
    };
  }),
  advanceRitualStep: () => set((state) => {
    const currentStep = state.ritualState.step;
    const rewards = state.ritualState.rewards;

    // Apply reward for current step immediately upon clicking the button
    if (currentStep === 1 && rewards?.reward1) {
      applyRitualReward(get, rewards.reward1);
    } else if (currentStep === 2 && rewards?.reward2) {
      applyRitualReward(get, rewards.reward2);
    } else if (currentStep === 3 && rewards?.reward3) {
      applyRitualReward(get, rewards.reward3);
    }

    return {
      ritualState: {
        ...state.ritualState,
        step: currentStep + 1
      }
    };
  }),
  resetRitualState: () => set({
    ritualState: {
      phase: 'idle',
      step: 1,
      rewards: null
    }
  }),
  pendingPlacementCard: null,
  unlockedPages: [1],
  pageRewardStates: {},
  filledSlots: [],
  albumItems: { polvo_lunar: 0 },
  setAlbumPage: (pageId) => set({ albumPage: pageId }),
  placePendingCard: (slotId) => set((state) => {
    const card = state.pendingPlacementCard;
    if (!card) return state;

    const slot = ALBUM_SLOTS.find(s => s.id === slotId);
    if (!slot) return state;

    // Verificar si es la casilla correcta
    if (slot.slotNum !== card.slotNum || slot.pageId !== card.pageId) {
      return state; // Retorna sin cambiar
    }

    return {
      filledSlots: Array.from(new Set([...(state.filledSlots || []), slotId])),
      pendingPlacementCard: null // Consumido!
    };
  }),
  unlockPage: (pageId) => set((state) => {
    const polvoCount = state.albumItems?.polvo_lunar || 0;
    if (polvoCount < 2) return state;

    const prevPageId = pageId - 1;
    if (prevPageId >= 1) {
      const prevSlots = ALBUM_SLOTS.filter(s => s.pageId === prevPageId);
      const isPrevComplete = prevSlots.length > 0 && prevSlots.every(s => (state.filledSlots || []).includes(s.id));
      if (!isPrevComplete) return state; // No desbloquear si el anterior no está completo
    }

    return {
      unlockedPages: Array.from(new Set([...(state.unlockedPages || [1]), pageId])),
      albumItems: { ...state.albumItems, polvo_lunar: polvoCount - 2 }
    };
  }),
  claimReward: (pageId, amount) => set((state) => {
    get().updateMoney(amount);
    const rewardType = amount === 400 ? 'claimed_400' : 'claimed_300';
    return {
      pageRewardStates: {
        ...(state.pageRewardStates || {}),
        [pageId]: rewardType
      }
    };
  }),
  setRewardState: (pageId, newState) => set((state) => ({
    pageRewardStates: {
      ...(state.pageRewardStates || {}),
      [pageId]: newState
    }
  })),
  addCardToInventory: (product) => set((state) => {
    if (product.payload?.type === 'UNLOCK_TOOL' || product.id === 'polvo_lunar') {
      const qtyToAdd = product.payload?.quantity || 1;
      return {
        albumItems: {
          ...state.albumItems,
          polvo_lunar: (state.albumItems?.polvo_lunar || 0) + qtyToAdd
        }
      };
    }
    return state;
  })
});
