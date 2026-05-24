import { spiralCatalog } from "../../data/spiralCatalog";

// Helper para resolver variables en textos y configuraciones de botones
const resolveMessageVariables = (catalogEntry, storeState, extraData = {}) => {
  if (!catalogEntry) return null;

  let selectedText = Array.isArray(catalogEntry.text)
    ? catalogEntry.text[Math.floor(Math.random() * catalogEntry.text.length)]
    : catalogEntry.text;

  const fullData = { userName: storeState.userName || "Amelia", ...extraData };

  Object.keys(fullData).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    selectedText = selectedText.replace(regex, fullData[key]);
  });

  const resolvedActionConfig = (catalogEntry.actionConfig || []).map(action => {
    let resolvedData = action.data;
    if (typeof resolvedData === 'string') {
      Object.keys(fullData).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        resolvedData = resolvedData.replace(regex, fullData[key]);
      });
    }
    return { ...action, data: resolvedData };
  });

  return { text: selectedText, actionConfig: resolvedActionConfig };
};

export const createPetSlice = (set, get) => ({
  petName: "Spiral",
  needs: { water: 28, food: 56, clean: 72, play: 44 },
  complaintThresholds: { water: 24, food: 48, clean: 48, play: 36 },
  petInventory: [
    { id: 'agua', name: 'Botellita de agua', icon: '💧', quantity: 3, targetsNeed: 'water', amount: 4 },
    { id: 'comida', name: 'Croquetas normales', icon: '🍖', quantity: 3, targetsNeed: 'food', amount: 8 },
    { id: 'jabob', name: 'Jabón neutro', icon: '🧼', quantity: 3, targetsNeed: 'clean', amount: 24 },
    { id: 'juguete', name: 'Ratón de juguete', icon: '🐭', quantity: 3, targetsNeed: 'play', amount: 8 },
  ],
  // Novedad: Mensajes de Estado Derivado
  ephemeralMessage: null,
  spiralMessage: null,
  pendingReward: null,
  totalIdleStars: 0,

  lastDegradationTimestamp: null,

  // --- Lógica de Degradación ---
  checkNeedsDegradation: () => set((state) => {
    const now = Date.now();
    const lastTime = state.lastDegradationTimestamp || now;

    const diffMs = now - lastTime;
    const hoursPassed = diffMs / (1000 * 60 * 60);

    if (hoursPassed < 1) {
      if (!state.lastDegradationTimestamp) {
        return { lastDegradationTimestamp: now };
      }
      return state;
    }

    const pointsToDegrade = Math.floor(hoursPassed);
    const msToKeep = diffMs - (pointsToDegrade * 1000 * 60 * 60);
    const newTimestamp = now - msToKeep;

    // Calcular estrellas Idle
    let earnedIdleStars = 0;
    const IDLE_RATES = { water: 2, food: 1, clean: 1, play: 2 };

    Object.keys(IDLE_RATES).forEach(needKey => {
      const surplus = Math.max(0, state.needs[needKey] - state.complaintThresholds[needKey]);
      const rewardedHours = Math.min(pointsToDegrade, surplus);
      if (rewardedHours > 0) {
        earnedIdleStars += rewardedHours * IDLE_RATES[needKey];
      }
    });

    const newNeeds = {
      water: Math.max(0, state.needs.water - pointsToDegrade),
      food: Math.max(0, state.needs.food - pointsToDegrade),
      clean: Math.max(0, state.needs.clean - pointsToDegrade),
      play: Math.max(0, state.needs.play - pointsToDegrade)
    };

    const updates = {
      needs: newNeeds,
      lastDegradationTimestamp: newTimestamp
    };

    if (earnedIdleStars > 0) {
      updates.totalIdleStars = (state.totalIdleStars || 0) + earnedIdleStars;
    }

    return updates;
  }),

  // Botón de prueba para el perfil
  degradeNeedTest: (needKey, hours) => set((state) => {
    // Protección estricta: si el valor es NaN o no existe, forzamos el 100
    const rawVal = state.needs?.[needKey];
    const currentVal = Number.isFinite(rawVal) ? rawVal : 100;

    const newNeeds = {
      ...state.needs,
      [needKey]: Math.max(0, currentVal - hours)
    };

    return { needs: newNeeds };
  }),

  setEphemeralMessage: (catalogId, extraData = {}) => {
    const state = get();

    // Limpiamos cualquier temporizador previo
    if (state.ephemeralTimerId) {
      clearTimeout(state.ephemeralTimerId);
    }

    if (!catalogId) {
      set({ ephemeralMessage: null, ephemeralTimerId: null });
      return;
    }

    const catalogEntry = spiralCatalog[catalogId];
    if (!catalogEntry) return;

    const resolved = resolveMessageVariables(catalogEntry, state, extraData);

    // Estandarizamos: si no tiene botones y no especifica duración, le damos 4 segundos (4000ms)
    const hasButtons = resolved.actionConfig && resolved.actionConfig.length > 0;
    const duration = catalogEntry.duration || (hasButtons ? null : 4000);

    let newTimerId = null;
    if (duration) {
      newTimerId = setTimeout(() => {
        get().clearEphemeralMessage();
      }, duration);
    }

    set({
      ephemeralMessage: {
        id: catalogId,
        text: resolved.text,
        video: catalogEntry.video,
        duration: duration,
        actionConfig: resolved.actionConfig
      },
      ephemeralTimerId: newTimerId
    });
  },

  setSpiralMessage: (catalogId, extraData = {}) => {
    const state = get();
    if (!catalogId) {
      set({ spiralMessage: null });
      return;
    }
    const catalogEntry = spiralCatalog[catalogId];
    if (!catalogEntry) return;

    const resolved = resolveMessageVariables(catalogEntry, state, extraData);
    set({
      spiralMessage: {
        id: catalogId,
        text: resolved.text,
        video: catalogEntry.video,
        actionConfig: resolved.actionConfig
      }
    });
  },

  clearSpiralMessage: () => set({ spiralMessage: null }),

  clearEphemeralMessage: () => {
    const state = get();
    if (state.ephemeralTimerId) {
      clearTimeout(state.ephemeralTimerId);
    }
    set({ ephemeralMessage: null, ephemeralTimerId: null });
  },

  setPendingReward: (reward) => set({ pendingReward: reward }),
  clearPendingReward: () => set({ pendingReward: null }),

  clearIdleStars: () => set({ totalIdleStars: 0 }),

  usePetItem: (itemId) => set((state) => {
    const item = state.petInventory.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return state;

    const currentNeedValue = state.needs[item.targetsNeed];
    const threshold = state.complaintThresholds[item.targetsNeed];

    // Rechazo (Si la necesidad es estrictamente mayor al umbral de queja del State)
    if (currentNeedValue > threshold) {
      let fullMessageId = "SPIRAL_FELIZ";
      if (item.targetsNeed === 'water') fullMessageId = "NO_NEED_WATER";
      if (item.targetsNeed === 'food') fullMessageId = "NO_NEED_FOOD";
      if (item.targetsNeed === 'clean') fullMessageId = "NO_NEED_WASH";
      if (item.targetsNeed === 'play') fullMessageId = "NO_NEED_PLAY";

      get().setEphemeralMessage(fullMessageId, { itemName: item.name });
      return state;
    }

    const newInventory = state.petInventory.map(i =>
      i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
    );

    // ELIMINADO EL TOPE DE 100: Ahora puede subir indefinidamente
    const newNeeds = { ...state.needs, [item.targetsNeed]: currentNeedValue + item.amount };

    // 5. Preparar Mensaje de Éxito (Recompensa Pendiente)
    let messageId = "SPIRAL_FELIZ";
    if (item.targetsNeed === 'water') messageId = "THANKS_WATER";
    else if (item.targetsNeed === 'food') messageId = "THANKS_FOOD";
    else if (item.targetsNeed === 'clean') messageId = "THANKS_WASH";
    else if (item.targetsNeed === 'play') messageId = "THANKS_PLAY";

    const reward = item.rewardStars || 2;
    get().setPendingReward({ type: messageId, stars: reward });

    return {
      petInventory: newInventory,
      needs: newNeeds
    };
  }),

  addPetItem: (product) => set((state) => {
    const existing = state.petInventory.find(i => i.id === product.id);
    const addedQuantity = product.payload.quantity || 1;
    const rewardStars = product.payload.rewardStars || 0;
    const idleReward = product.payload.idleReward || 0;

    if (existing) {
      return {
        petInventory: state.petInventory.map(i =>
          i.id === product.id ? {
            ...i,
            quantity: i.quantity + addedQuantity,
            rewardStars: rewardStars,
            amount: product.payload.amount,
            targetsNeed: product.payload.targetsNeed,
            idleReward: idleReward
          } : i
        )
      };
    } else {
      return {
        petInventory: [...state.petInventory, {
          id: product.id,
          name: product.name,
          icon: product.icon,
          quantity: addedQuantity,
          targetsNeed: product.payload.targetsNeed,
          amount: product.payload.amount,
          rewardStars: rewardStars,
          idleReward: idleReward
        }]
      };
    }
  })
});
