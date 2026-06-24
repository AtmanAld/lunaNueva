import { activityCatalog, activitySetsCatalog } from '../../data/activityCatalog';
import { getLocalDateString, isChronologicallyNewDay, calculateDaysDifference } from '../../utils/dateUtils';
import { ALBUM_PAGES, ALBUM_SLOTS } from '../../data/albumCatalog';

export const createDashboardSlice = (set, get) => ({
  moonPhase: {
    name: "Luna Nueva",
    progressPoints: 0,
    maxPoints: 100,
    givenCreciente: false,
    givenCuarto: false,
    givenGibosa: false,
    givenFullMoonReward: false
  },
  isMoonCelebrationActive: false,
  hasMoonBeenRenewedToday: false,
  pendingPhaseReward: null,
  clearPendingPhaseReward: () => set({ pendingPhaseReward: null }),
  lastResetDate: getLocalDateString(),
  pendingNavigation: null, // Sistema de navegación limpia desde el Store
  // El estado solo guarda lo que CAMBIA (progreso y personalización)
  activitySets: activitySetsCatalog.map(s => ({ id: s.id, isUnlocked: true, isActive: true })),
  activities: activityCatalog.map(a => ({
    activityID: a.activityID,
    completions: 0,
    fullyCompleted: false,
    isUnlocked: true,
    isActive: true,
    usedForRitual: false,
    periodStartDate: getLocalDateString()
  })),
  startNewDay: () => set((state) => {
    const today = getLocalDateString();
    const resetActivities = state.activities.map(act => {
      const catalogInfo = activityCatalog.find(ac => Number(ac.activityID) === Number(act.activityID));
      const intervalDays = catalogInfo ? (catalogInfo.intervalCompletions || 1) : 1;
      const daysPassed = calculateDaysDifference(act.periodStartDate, today);

      if (daysPassed >= intervalDays) {
        return {
          ...act,
          completions: 0,
          fullyCompleted: false,
          usedForRitual: false,
          periodStartDate: today
        };
      }
      return { ...act, usedForRitual: false };
    });
    // NOTA: NO reseteamos moonPhase aquí. La luna acumula puntos a lo largo de los días.
    return { activities: resetActivities, lastResetDate: today, hasMoonBeenRenewedToday: false };
  }),
  claimMoonReward: () => {
    // AUN NO CODIFICAMOS EL PASO A LUNA NUEVA, se queda igual por ahora como pidió el usuario.
    console.log("Recoger Carta Mágica clickeado, esperando a la siguiente fase de desarrollo.");
  },
  toggleActivity: (id) => {
    const state = get();
    const targetId = Number(id);
    const act = state.activities.find(a => Number(a.activityID) === targetId);
    if (!act) return;

    // Buscamos la info estática en el catálogo
    const catalogInfo = activityCatalog.find(ac => Number(ac.activityID) === targetId);
    if (!catalogInfo) return;

    let newCompletions = act.completions;
    let newFullyCompleted = act.fullyCompleted;

    // 1. Aplicar cambios a la actividad
    const updatedActivities = state.activities.map(a => {
      if (Number(a.activityID) !== targetId) return a;
      let tempComp = a.completions;
      let tempFull = a.fullyCompleted;

      if (tempFull) {
        tempFull = false;
        tempComp = 0;
      } else {
        tempComp += 1;
        if (tempComp >= catalogInfo.maxCompletions) tempFull = true;
      }
      newCompletions = tempComp;
      newFullyCompleted = tempFull;
      return { ...a, completions: tempComp, fullyCompleted: tempFull };
    });

    // 2. Lógica Acumulativa de Puntos de Luna (Defensiva)
    const completionsDiff = newCompletions - act.completions;
    const pointsDelta = completionsDiff * (Number(catalogInfo.phasePoints) || 0);
    const currentPoints = Number(state.moonPhase?.progressPoints) || 0;
    const newPoints = Math.max(0, Math.min(state.moonPhase.maxPoints || 100, currentPoints + pointsDelta));

    const getPhaseName = (pts, phaseState) => {
      if (pts >= 100) return "Luna Llena";
      if (pts >= 74 || phaseState.givenGibosa) return "Gibosa Creciente";
      if (pts >= 49 || phaseState.givenCuarto) return "Cuarto Creciente";
      if (pts >= 25 || phaseState.givenCreciente) return "Luna Creciente";
      return "Luna Nueva";
    };

    const newPhaseName = getPhaseName(newPoints, state.moonPhase);

    let newMoonPhase = {
      ...state.moonPhase,
      progressPoints: newPoints,
      name: newPhaseName
    };

    // 3. Chequear Cruce de Fases y Recompensas
    let starsToGive = 0;
    let highestPhase = null;

    if (newPoints >= 25 && !newMoonPhase.givenCreciente) {
      newMoonPhase.givenCreciente = true;
      starsToGive += 10;
      highestPhase = 'LUNA_CRECIENTE';
    }
    if (newPoints >= 49 && !newMoonPhase.givenCuarto) {
      newMoonPhase.givenCuarto = true;
      starsToGive += 20;
      highestPhase = 'LUNA_CUARTO_CRECIENTE';
    }
    if (newPoints >= 74 && !newMoonPhase.givenGibosa) {
      newMoonPhase.givenGibosa = true;
      starsToGive += 30;
      highestPhase = 'LUNA_GIBOSA_CRECIENTE';
    }
    if (newPoints >= 100 && !newMoonPhase.givenFullMoonReward) {
      newMoonPhase.givenFullMoonReward = true;
      starsToGive += 60;
      highestPhase = 'LUNA_LLENA';
    }

    let pendingPhaseReward = state.pendingPhaseReward;
    if (starsToGive > 0) {
      pendingPhaseReward = { phase: highestPhase, stars: starsToGive };
    }

    // 4. Estrellas y Tareas normales por la actividad
    const isGain = completionsDiff > 0;
    const starsToAdd = isGain ? catalogInfo.stars : -(catalogInfo.stars * catalogInfo.maxCompletions);
    const tasksToAdd = isGain ? 1 : -catalogInfo.maxCompletions;

    // ACTUALIZAMOS EL ESTADO PRIMERO para evitar conflictos con otras llamadas
    set({
      activities: updatedActivities,
      moonPhase: newMoonPhase,
      pendingPhaseReward
    });

    // LUEGO llamamos a los otros slices que hacen sus propios set()
    get().updateStars(starsToAdd);
    get().updateTasks(tasksToAdd);

    // 5. Mensajes de Spiral y Recompensa Final
    if (newPoints >= (state.moonPhase.maxPoints || 100) && currentPoints < (state.moonPhase.maxPoints || 100)) {
      get().setSpiralMessage("DASHBOARD_FULL_MOON", { stars: 60 });
    } else if (!pendingPhaseReward) {
      const messageId = isGain
        ? (catalogInfo.maxCompletions > 1 ? "ACTIVITY_COMPLETE_MULTIPLE" : "ACTIVITY_COMPLETE_SINGLE")
        : (catalogInfo.maxCompletions > 1 ? "ACTIVITY_CANCEL_MULTIPLE" : "ACTIVITY_CANCEL_SINGLE");
      get().setEphemeralMessage(messageId, { stars: catalogInfo.stars });
    }
  },
  useMoonDust: () => {
    const state = get();
    const polvoCount = state.albumItems?.polvo_lunar || 0;
    if (polvoCount <= 0) return;

    const updatedAlbumItems = {
      ...state.albumItems,
      polvo_lunar: polvoCount - 1
    };

    const currentPoints = Number(state.moonPhase?.progressPoints) || 0;
    const newPoints = Math.max(0, Math.min(state.moonPhase.maxPoints || 100, currentPoints + 20));

    const getPhaseName = (pts, phaseState) => {
      if (pts >= 100) return "Luna Llena";
      if (pts >= 74 || phaseState.givenGibosa) return "Gibosa Creciente";
      if (pts >= 49 || phaseState.givenCuarto) return "Cuarto Creciente";
      if (pts >= 25 || phaseState.givenCreciente) return "Luna Creciente";
      return "Luna Nueva";
    };

    const newPhaseName = getPhaseName(newPoints, state.moonPhase);

    let newMoonPhase = {
      ...state.moonPhase,
      progressPoints: newPoints,
      name: newPhaseName
    };

    let starsToGive = 0;
    let highestPhase = null;

    if (newPoints >= 25 && !newMoonPhase.givenCreciente) {
      newMoonPhase.givenCreciente = true;
      starsToGive += 10;
      highestPhase = 'LUNA_CRECIENTE';
    }
    if (newPoints >= 49 && !newMoonPhase.givenCuarto) {
      newMoonPhase.givenCuarto = true;
      starsToGive += 20;
      highestPhase = 'LUNA_CUARTO_CRECIENTE';
    }
    if (newPoints >= 74 && !newMoonPhase.givenGibosa) {
      newMoonPhase.givenGibosa = true;
      starsToGive += 30;
      highestPhase = 'LUNA_GIBOSA_CRECIENTE';
    }
    if (newPoints >= 100 && !newMoonPhase.givenFullMoonReward) {
      newMoonPhase.givenFullMoonReward = true;
      starsToGive += 60;
      highestPhase = 'LUNA_LLENA';
    }

    let pendingPhaseReward = state.pendingPhaseReward;
    if (starsToGive > 0) {
      pendingPhaseReward = { phase: highestPhase, stars: starsToGive };
    }

    set({
      albumItems: updatedAlbumItems,
      moonPhase: newMoonPhase,
      pendingPhaseReward
    });

    if (newPoints >= (state.moonPhase.maxPoints || 100) && currentPoints < (state.moonPhase.maxPoints || 100)) {
      get().setSpiralMessage("DASHBOARD_FULL_MOON", { stars: 60 });
    } else if (!pendingPhaseReward) {
      get().setEphemeralMessage("MOON_DUST_USED");
    }
  },
  claimMoonReward: () => {
    const state = get();

    // Si ya hay una carta pendiente de colocar, no permitimos reclamar otra
    // para evitar el edge case de sobreescritura y pérdida de la carta vieja.
    if (state.pendingPlacementCard) {
      const catalogSlot = ALBUM_SLOTS.find(s => s.pageId === state.pendingPlacementCard.pageId && s.slotNum === state.pendingPlacementCard.slotNum);
      state.setSpiralMessage("PENDING_PLACEMENT_WARNING", { title: catalogSlot?.title || "Carta" });
      return;
    }

    // Utiliza la última página desbloqueada en lugar de la que estaba mirando la usuaria
    const { pageId: activePageId } = get().getLatestUnlockedPageStatus();

    // 1. Obtener slots de la página activa
    const pageSlots = ALBUM_SLOTS.filter(s => s.pageId === activePageId);
    const commonSlots = pageSlots.filter(s => s.slotNum >= 2 && s.slotNum <= 5);
    const filledCommonSlots = commonSlots.filter(s => (state.filledSlots || []).includes(s.id));

    let selectedSlot = null;
    const allCommonsFilled = filledCommonSlots.length === 4;

    if (allCommonsFilled) {
      const specialSlot = pageSlots.find(s => s.slotNum === 1);
      if (specialSlot && !(state.filledSlots || []).includes(specialSlot.id)) {
        selectedSlot = specialSlot;
      }
    } else {
      const emptyCommons = commonSlots.filter(s => !(state.filledSlots || []).includes(s.id));
      if (emptyCommons.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCommons.length);
        selectedSlot = emptyCommons[randomIndex];
      }
    }

    if (!selectedSlot) return;

    // Si sí hay un slot para colocar la tarjeta
    const pendingCard = {
      id: selectedSlot.id,
      pageId: selectedSlot.pageId,
      slotNum: selectedSlot.slotNum
    };

    const updatedActivities = state.activities.map(a => {
      if (a.completions > 0) {
        return { ...a, usedForRitual: true };
      }
      return a;
    });

    set({
      hasMoonBeenRenewedToday: true,
      pendingPlacementCard: pendingCard,
      activities: updatedActivities,
      moonPhase: {
        name: "Luna Nueva",
        progressPoints: 0,
        maxPoints: 100,
        givenCreciente: false,
        givenCuarto: false,
        givenGibosa: false,
        givenFullMoonReward: false
      }
    });

    state.setSpiralMessage("MOON_REWARD_CLAIMED_NEW", { title: selectedSlot.title });
  },
  resetMoonAfterClaim: () => {
    const state = get();
    set({
      moonPhase: {
        ...state.moonPhase,
        name: "Luna Nueva",
        progressPoints: 0,
        givenCreciente: false,
        givenCuarto: false,
        givenGibosa: false,
        givenFullMoonReward: false
      }
    });
  },
  processEngineOutcomes: (nodeId, outcomes) => {
    const state = get();
    if (!outcomes) return;

    let pointsDelta = 0;
    let starsToAdd = 0;

    if (outcomes.points) {
      const moonPoints = outcomes.points.find(p => p.type === 'moon_points');
      if (moonPoints) pointsDelta = moonPoints.amount;
    }

    if (outcomes.currencies) {
      const stars = outcomes.currencies.find(c => c.type === 'stars');
      if (stars) starsToAdd = stars.amount;
    }

    const currentPoints = Number(state.moonPhase?.progressPoints) || 0;
    const newPoints = Math.max(0, Math.min(state.moonPhase.maxPoints || 100, currentPoints + pointsDelta));

    const getPhaseName = (pts, phaseState) => {
      if (pts >= 100) return "Luna Llena";
      if (pts >= 74 || phaseState.givenGibosa) return "Gibosa Creciente";
      if (pts >= 49 || phaseState.givenCuarto) return "Cuarto Creciente";
      if (pts >= 25 || phaseState.givenCreciente) return "Luna Creciente";
      return "Luna Nueva";
    };

    const newPhaseName = getPhaseName(newPoints, state.moonPhase);

    let newMoonPhase = {
      ...state.moonPhase,
      progressPoints: newPoints,
      name: newPhaseName
    };

    let starsToGive = 0;
    let highestPhase = null;

    if (newPoints >= 25 && !newMoonPhase.givenCreciente) {
      newMoonPhase.givenCreciente = true;
      starsToGive += 10;
      highestPhase = 'LUNA_CRECIENTE';
    }
    if (newPoints >= 49 && !newMoonPhase.givenCuarto) {
      newMoonPhase.givenCuarto = true;
      starsToGive += 20;
      highestPhase = 'LUNA_CUARTO_CRECIENTE';
    }
    if (newPoints >= 74 && !newMoonPhase.givenGibosa) {
      newMoonPhase.givenGibosa = true;
      starsToGive += 30;
      highestPhase = 'LUNA_GIBOSA_CRECIENTE';
    }
    if (newPoints >= 100 && !newMoonPhase.givenFullMoonReward) {
      newMoonPhase.givenFullMoonReward = true;
      starsToGive += 60;
      highestPhase = 'LUNA_LLENA';
    }

    let pendingPhaseReward = state.pendingPhaseReward;
    if (starsToGive > 0) {
      pendingPhaseReward = { phase: highestPhase, stars: starsToGive };
    }

    set({
      moonPhase: newMoonPhase,
      pendingPhaseReward
    });

    if (starsToAdd > 0) get().updateStars(starsToAdd);
    // Asumimos 1 completion = 1 task por ahora
    get().updateTasks(1);

    if (newPoints >= (state.moonPhase.maxPoints || 100) && currentPoints < (state.moonPhase.maxPoints || 100)) {
      get().setSpiralMessage("DASHBOARD_FULL_MOON", { stars: 60 });
    } else if (!pendingPhaseReward) {
      get().setEphemeralMessage("ACTIVITY_COMPLETE_SINGLE", { stars: starsToAdd });
    }

    console.log(`🌉 [Bridge] Outcomes procesados para ${nodeId}: +${starsToAdd} ⭐, +${pointsDelta} 🌙. Fase lunar actual: ${newPhaseName} (${newPoints}%)`);
  },
  updateActivity: (id, data) => set((state) => ({
    activities: state.activities.map(a => a.activityID === id ? { ...a, ...data } : a)
  })),
  resetDailyActivities: () => get().startNewDay(),
  addActivity: (id, data) => set((state) => ({
    activities: [...state.activities, { activityID: id, ...data }]
  })),
  toggleActivityVisibility: (id) => set((state) => ({
    activities: state.activities.map(a => a.activityID === id ? { ...a, isActive: !a.isActive } : a)
  })),
  purchaseActivity: (id) => set((state) => ({
    activities: state.activities.map(a => a.activityID === id ? { ...a, isUnlocked: true } : a)
  })),
  updateActivitySet: (id, setID) => set((state) => ({
    activities: state.activities.map(a => a.activityID === id ? { ...a, setID } : a)
  })),
  isDayTransitioning: false,
  isReviewDay: false,
  isNewDay: false,

  verifyGameState: () => {
    // 0. Inicializar Mission Engine si es la primera vez
    get().initEngine?.();

    set((state) => {
      const today = getLocalDateString();

      // 1. Sincronizar nuevas actividades del catálogo que no estén en el estado
      const existingIds = state.activities.map(a => a.activityID);
      const newActivitiesFromCatalog = activityCatalog
        .filter(ac => !existingIds.includes(ac.activityID))
        .map(ac => ({
          activityID: ac.activityID,
          completions: 0,
          fullyCompleted: false,
          isUnlocked: true,
          isActive: true,
          usedForRitual: false,
          periodStartDate: getLocalDateString()
        }));

      let nextStateUpdates = {};
      if (newActivitiesFromCatalog.length > 0) {
        nextStateUpdates.activities = [...state.activities, ...newActivitiesFromCatalog];
      }

      // 2. Si hoy es cronológicamente después del último reset
      if (isChronologicallyNewDay(state.lastResetDate, today)) {
        // El dashboard ahora dependerá de estos booleanos para calcular su fondo
        return { ...nextStateUpdates, isNewDay: true };
      }
      return { ...nextStateUpdates, isNewDay: false, isReviewDay: false };
    });
  },
  getLatestUnlockedPageStatus: () => {
    const state = get();
    const unlocked = state.unlockedPages || [1];
    const pageId = unlocked[unlocked.length - 1] || 1;
    const slotsOfPage = ALBUM_SLOTS.filter(s => s.pageId === pageId);
    const isFull = slotsOfPage.length > 0 && slotsOfPage.every(s => (state.filledSlots || []).includes(s.id));
    return { isFull, pageId };
  },

  handleGlobalAction: (action) => {
    if (action.type === 'START_NEW_DAY') {
      // 1. Iniciar transición visual
      set({ isDayTransitioning: true });

      // 2. A la mitad de la transición (cuando la pantalla está totalmente oscura/cubierta), resetear datos
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        get().startNewDay();
        set({ isNewDay: false, isReviewDay: false });
        get().clearEphemeralMessage();
      }, 3500);

      // 3. Finalizar la transición para revelar el nuevo día
      setTimeout(() => {
        set({ isDayTransitioning: false });
      }, 8000);

    } else if (action.type === 'CLAIM_MOON_REWARD') {
      get().claimMoonReward();
    } else if (action.type === 'NAVIGATE_ALBUM' || action.type === 'GO_TO_ALBUM') {
      set({ pendingNavigation: '/album' });
      get().clearSpiralMessage();
      get().clearEphemeralMessage();
    } else if (action.type === 'ACCEPT_DUST_LOAN') {
      const state = get();
      const currentDust = state.albumItems?.polvo_lunar || 0;
      const needed = 2 - currentDust;
      if (needed > 0) {
        const storeItems = state.storeItems || [];
        const polvoItem = storeItems.find(i => i.id === 'polvo_lunar');
        const polvoPrice = polvoItem ? polvoItem.price : 180;

        const cost = needed * polvoPrice;
        state.updateStars(-cost);
        set({
          albumItems: {
            ...state.albumItems,
            polvo_lunar: currentDust + needed
          }
        });
      }
      set({ pendingNavigation: '/album' });
      state.dequeueMessage('dash_full_moon_blocker');
      get().clearSpiralMessage();
      get().clearEphemeralMessage();
    } else if (action.type === 'REVIEW_PREVIOUS_DAY') {
      set({ isReviewDay: true });
    } else if (action.type === 'CLAIM_IDLE_STARS') {
      const stars = get().totalIdleStars || 0;
      if (stars > 0) {
        get().updateStars(stars);
        get().clearIdleStars();
      }
    } else if (action.type === 'NAVIGATE_STORE') {
      if (action.data) {
        get().prepareDirectPurchase(action.data);
      }
      set({ pendingNavigation: '/store' });
      get().clearSpiralMessage();
      get().clearEphemeralMessage();
    } else if (action.type === 'NAVIGATE_EDIT_NAMES') {
      set({ pendingNavigation: '/profile' });
      get().clearSpiralMessage();
      get().clearEphemeralMessage();
    } else if (action.type === 'CANCEL') {
      get().clearSpiralMessage();
      get().clearEphemeralMessage();
    }
  },
  clearNavigation: () => set({ pendingNavigation: null })
});
