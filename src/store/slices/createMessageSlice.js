import { spiralCatalog } from "../../data/spiralCatalog";

export const resolveMessageVariablesNew = (catalogEntry, storeState, extraData = {}) => {
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

export const createMessageSlice = (set, get) => ({
  messageQueue: [],
  scopedEphemeralTimerIds: {},

  enqueueMessage: (source, catalogId, extraData = {}, scope = 'global') => {
    const state = get();
    const catalogEntry = spiralCatalog[catalogId];
    if (!catalogEntry) return;

    const resolved = resolveMessageVariablesNew(catalogEntry, state, extraData);

    set((state) => {
      const newQueue = state.messageQueue.filter(req => req.source !== source);
      newQueue.push({
        source,
        catalogId,
        id: catalogId, // Agregado para UI
        extraData,
        scope,
        priority: catalogEntry.priority || 1,
        text: resolved.text, // Agregado para UI
        video: catalogEntry.video || null,
        actionConfig: resolved.actionConfig || [],
        timestamp: Date.now()
      });
      return { messageQueue: newQueue };
    });
  },

  dequeueMessage: (source) => {
    set((state) => ({
      messageQueue: state.messageQueue.filter(req => req.source !== source)
    }));
  },

  setScopedEphemeralMessage: (source, catalogId, extraData = {}, scope = 'global') => {
    const state = get();
    
    if (state.scopedEphemeralTimerIds[source]) {
      clearTimeout(state.scopedEphemeralTimerIds[source]);
    }

    if (!catalogId) {
      get().dequeueMessage(source);
      set(state => ({ scopedEphemeralTimerIds: { ...state.scopedEphemeralTimerIds, [source]: null } }));
      return;
    }

    const catalogEntry = spiralCatalog[catalogId];
    if (!catalogEntry) return;

    const hasButtons = catalogEntry.actionConfig && catalogEntry.actionConfig.length > 0;
    const duration = catalogEntry.duration || (hasButtons ? null : 4000);

    get().enqueueMessage(source, catalogId, extraData, scope);

    let newTimerId = null;
    if (duration) {
      newTimerId = setTimeout(() => {
        get().dequeueMessage(source);
      }, duration);
    }

    set(state => ({
      scopedEphemeralTimerIds: { ...state.scopedEphemeralTimerIds, [source]: newTimerId }
    }));
  }
});

// Selector PURO: Se ejecuta recibiendo el state completo. 
// Esto asegura que Zustand rastree state.messageQueue y despierte a la UI.
export const selectActiveMessage = (state, currentScope = 'global') => {
  const { messageQueue } = state;
  if (!messageQueue || messageQueue.length === 0) return null;

  const validRequests = messageQueue.filter(req => 
    req.scope === 'global' || req.scope === currentScope
  );

  if (validRequests.length === 0) return null;

  // Ordenar por prioridad (descendente) y luego por timestamp (más reciente primero)
  validRequests.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return b.timestamp - a.timestamp;
  });

  // IMPORTANTE: Devolvemos la referencia exacta almacenada en el estado.
  // Si devolvemos un objeto nuevo {}, Zustand pensará que el estado cambió
  // en CADA render, causando un bucle infinito que crashea el navegador (pantalla negra).
  return validRequests[0];
};
