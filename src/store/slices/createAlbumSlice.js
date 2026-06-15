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
  pages: [
    { 
      id: 1, 
      state: 'unlocked', 
      rewardState: 'default',
      title: 'Le Saut de la Lune',
      subtitle: 'Donde el destino teje y el deseo danza.'
    },
    { 
      id: 2, 
      state: 'locked', 
      rewardState: 'default',
      title: 'Espiral de Loto',
      subtitle: 'Donde el espíritu florece y la energía sana.'
    },
    { 
      id: 3, 
      state: 'locked', 
      rewardState: 'default',
      title: 'Venus oculta',
      subtitle: 'Equilibrio, belleza y dominio instintivo.'
    },
    { 
      id: 4, 
      state: 'locked', 
      rewardState: 'default',
      title: 'Nebulosas de Ensueño',
      subtitle: 'Colección Especial 2025'
    }
  ],
  slots: [
    // Página 1
    { id: 1, pageId: 1, slotNum: 1, state: 'empty', title: 'Creciente Lunar', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', video: '/Album Mágico/1/crecienteLunar.mp4', rarity: 'Especial', description: 'Símbolo de la intuición, los nuevos comienzos, el crecimiento espiritual, el magnetismo, la expansión y la atracción de nueva abundancia.' },
    { id: 2, pageId: 1, slotNum: 2, state: 'empty', title: 'Escoba de Bruja', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', video: '/Album Mágico/1/escobaDeBruja.mp4', rarity: 'Común', description: 'Símbolo de magia empática para la fertilidad, enseñando a los cultivos a crecer para atraer la cosecha.' },
    { id: 3, pageId: 1, slotNum: 3, state: 'empty', title: 'El Gato Místico', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', video: '/Album Mágico/1/elGato.mp4', rarity: 'Común', description: 'Guardián del hogar, símbolo de la luna, misterio, sensualidad y abundancia pacífica hogareña.' },
    { id: 4, pageId: 1, slotNum: 4, state: 'empty', title: 'La Araña Tejedora', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', video: '/Album Mágico/1/laArana.mp4', rarity: 'Común', description: 'Símbolo de la diosa tejedora de destinos. Crea abundancia hilando de su propio cuerpo.' },
    { id: 5, pageId: 1, slotNum: 5, state: 'empty', title: 'Le Mat (El Loco)', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', video: '/Album Mágico/1/leMat.mp4', rarity: 'Común', description: 'La libertad absoluta del deseo, la danza desinhibida y el salto hacia el placer desconocido.' },

    // Página 2 (Gatos y Misticismo)
    { id: 6, pageId: 2, slotNum: 1, state: 'empty', title: 'Luna Nueva', image: '/Album Mágico/2/lunaNueva.jpg', bgSvg: '/Album Mágico/2/lunaNueva.svg', video: '/Album Mágico/2/lunaNueva.mp4', rarity: 'Especial', description: 'Símbolo del vacío fértil, la siembra de semillas místicas y la preparación de la matriz para la nueva creación.' },
    { id: 7, pageId: 2, slotNum: 2, state: 'empty', title: 'Diosa Espiral', image: '/Album Mágico/2/diosaEspiral.jpg', bgSvg: '/Album Mágico/2/diosaEspiral.svg', video: '/Album Mágico/2/diosaEspiral.mp4', rarity: 'Común', description: 'Silueta femenina con una espiral en el vientre. Representa la fuerza generadora y la abundancia en constante crecimiento.' },
    { id: 8, pageId: 2, slotNum: 3, state: 'empty', title: 'El Loto', image: '/Album Mágico/2/elLoto.jpg', bgSvg: '/Album Mágico/2/elLoto.svg', video: '/Album Mágico/2/elLoto.mp4', rarity: 'Común', description: 'Representa el útero cósmico, la pureza divina femenina y el florecimiento del espíritu.' },
    { id: 9, pageId: 2, slotNum: 4, state: 'empty', title: 'El Pentagrama', image: '/Album Mágico/2/elPentagrama.jpg', bgSvg: '/Album Mágico/2/elPentagrama.svg', video: '/Album Mágico/2/elPentagrama.mp4', rarity: 'Común', description: 'Estrella de cinco puntas entrelazada que apunta hacia arriba. Representa los cinco elementos: Tierra, Aire, Fuego, Agua y el Espíritu.' },
    { id: 10, pageId: 2, slotNum: 5, state: 'empty', title: 'La Temperanza', image: '/Album Mágico/2/laTemperanza.jpg', bgSvg: '/Album Mágico/2/laTemperanza.svg', video: '/Album Mágico/2/laTemperanza.mp4', rarity: 'Común', description: 'La caricia curativa, el flujo de energías sutiles, el tantra y la mezcla fluida de auras y esencias.' },

    // Página 3 (Venus oculta)
    { id: 11, pageId: 3, slotNum: 1, state: 'empty', title: 'Luna Menguante', image: '/Album Mágico/3/lunaMenguante.jpg', bgSvg: '/Album Mágico/3/lunaMenguante.svg', video: '/Album Mágico/3/lunaMenguante.mp4', rarity: 'Especial', description: 'Símbolo de la anciana o la bruja sabia, la limpieza, el dejar ir y la sabiduría acumulada.' },
    { id: 12, pageId: 3, slotNum: 2, state: 'empty', title: 'Runa Perthro', image: '/Album Mágico/3/runaPetro.jpg', bgSvg: '/Album Mágico/3/runaPetro.svg', video: '/Album Mágico/3/runaPetro.mp4', rarity: 'Común', description: 'Representa la copa del destino y el misterio del vientre; el lugar oscuro y seguro donde se gesta la magia femenina.' },
    { id: 13, pageId: 3, slotNum: 3, state: 'empty', title: 'Ying Yang', image: '/Album Mágico/3/yingYang.jpg', bgSvg: '/Album Mágico/3/yingYang.svg', video: '/Album Mágico/3/yingYang.mp4', rarity: 'Común', description: 'Símbolo taoísta que denota el equilibrio perfecto entre la luz y la oscuridad, lo masculino y lo femenino.' },
    { id: 14, pageId: 3, slotNum: 4, state: 'empty', title: 'Venus', image: '/Album Mágico/3/simboloVenus.jpg', bgSvg: '/Album Mágico/3/simboloVenus.svg', video: '/Album Mágico/3/simboloVenus.mp4', rarity: 'Común', description: 'Representa lo femenino, la atracción, el lujo, el amor, la belleza y la abundancia terrenal.' },
    { id: 15, pageId: 3, slotNum: 5, state: 'empty', title: 'Tarot de Marsella: Le Chariot', image: '/Album Mágico/3/leChariot.jpg', bgSvg: '/Album Mágico/3/leChariot.svg', video: '/Album Mágico/3/leChariot.mp4', rarity: 'Común', description: 'La conquista del placer, el avance apasionado y el dominio instintivo sobre la propia sexualidad.' },

    // Página 4 (Nebulosas de Ensueño)
    { id: 16, pageId: 4, slotNum: 1, state: 'empty', title: 'Nebulosa Madre', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', rarity: 'Especial', description: '' },
    { id: 17, pageId: 4, slotNum: 2, state: 'empty', title: 'Polvo de Cometa', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', rarity: 'Común', description: '' },
    { id: 18, pageId: 4, slotNum: 3, state: 'empty', title: 'Estrella Binaria', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', rarity: 'Común', description: '' },
    { id: 19, pageId: 4, slotNum: 4, state: 'empty', title: 'Agujero de Gusano', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', rarity: 'Común', description: '' },
    { id: 20, pageId: 4, slotNum: 5, state: 'empty', title: 'Constelación Fénix', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', rarity: 'Común', description: '' },
  ],
  albumItems: { polvo_lunar: 0 },
  setAlbumPage: (pageId) => set({ albumPage: pageId }),
  placePendingCard: (slotId) => set((state) => {
    const card = state.pendingPlacementCard;
    if (!card) return state;

    const slot = state.slots.find(s => s.id === slotId);
    if (!slot) return state;

    // Verificar si es la casilla correcta
    if (slot.slotNum !== card.slotNum || slot.pageId !== card.pageId) {
      return state; // Retorna sin cambiar
    }

    return {
      slots: state.slots.map(s => s.id === slotId ? { ...s, state: 'filled' } : s),
      pendingPlacementCard: null // Consumido!
    };
  }),
  unlockPage: (pageId) => set((state) => {
    const polvoCount = state.albumItems?.polvo_lunar || 0;
    if (polvoCount < 2) return state;

    const prevPageId = pageId - 1;
    if (prevPageId >= 1) {
      const prevSlots = state.slots.filter(s => s.pageId === prevPageId);
      const isPrevComplete = prevSlots.length > 0 && prevSlots.every(s => s.state === 'filled');
      if (!isPrevComplete) return state; // No desbloquear si el anterior no está completo
    }

    return {
      pages: state.pages.map(p => p.id === pageId ? { ...p, state: 'unlocked' } : p),
      albumItems: { ...state.albumItems, polvo_lunar: polvoCount - 2 }
    };
  }),
  claimReward: (pageId, amount) => set((state) => {
    get().updateMoney(amount);
    const rewardType = amount === 400 ? 'claimed_400' : 'claimed_300';
    return {
      pages: state.pages.map(p => p.id === pageId ? { ...p, rewardState: rewardType } : p)
    };
  }),
  setRewardState: (pageId, newState) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? { ...p, rewardState: newState } : p)
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
