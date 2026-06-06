import { collectionIndex } from '../../data/collectionIndex';
import { missionCatalog } from '../../data/missionCatalog';

/**
 * MISSION ENGINE SLICE (El Motor Reactivo)
 * Este slice vive "en el limbo" (MVP), aislado del resto de la app.
 * Su único trabajo es gestionar el estado de los nodos genéricos sin importar de qué trata la app.
 */
export const createEngineSlice = (set, get) => ({
  engineState: {
    collections: {}
  },

  /**
   * 1. INICIALIZADOR
   * Construye el estado inicial basado en collectionIndex si es la primera vez.
   */
  initEngine: () => {
    set((state) => {
      const currentCollections = state.engineState?.collections || {};
      const newCollections = { ...currentCollections };
      let hasChanges = false;

      collectionIndex.forEach(collection => {
        // Solo inicializamos si la colección no existe en memoria
        if (!newCollections[collection.collectionId]) {
          hasChanges = true;
          const initialNodesState = {};
          
          collection.nodes.forEach(node => {
            initialNodesState[node.nodeId] = {
              status: "active", // "active", "completed", "locked"
              progress: 0,
              cooldownRemaining: 0
            };
          });

          // Si es flujo lineal, ponemos el primer nodo como el activo
          const currentNodeId = collection.behavior.flow === "linear" && collection.nodes.length > 0 
            ? collection.nodes[0].nodeId 
            : null;

          newCollections[collection.collectionId] = {
            currentNodeId,
            nodesState: initialNodesState
          };
        }
      });

      if (hasChanges) {
        return {
          engineState: {
            ...state.engineState,
            collections: newCollections
          }
        };
      }
      return state;
    });
  },

  /**
   * 2. PROGRESO CONTINUO
   * Suma progreso a un nodo que requiere pasos múltiples.
   */
  addProgressToNode: (nodeId, collectionId, amount = 1) => {
    const state = get();
    const collectionData = state.engineState.collections[collectionId];
    if (!collectionData) return;

    const nodeState = collectionData.nodesState[nodeId];
    if (!nodeState || nodeState.status !== "active") return;

    const catalogNode = missionCatalog[nodeId];
    if (!catalogNode) return;

    const targetValue = catalogNode.execution.targetValue || 1;
    const newProgress = nodeState.progress + amount;

    if (newProgress >= targetValue) {
      // Si llegó a la meta, se completa automáticamente
      get().completeMission(nodeId, collectionId);
    } else {
      // Solo actualizamos el progreso
      set((state) => ({
        engineState: {
          ...state.engineState,
          collections: {
            ...state.engineState.collections,
            [collectionId]: {
              ...state.engineState.collections[collectionId],
              nodesState: {
                ...state.engineState.collections[collectionId].nodesState,
                [nodeId]: {
                  ...nodeState,
                  progress: newProgress
                }
              }
            }
          }
        }
      }));
    }
  },

  /**
   * 3. COMPLECIÓN Y NAVEGACIÓN
   * Marca el nodo como completado y aplica el cooldown. 
   * También avanza el puntero si la colección es lineal.
   */
  completeMission: (nodeId, collectionId) => {
    const state = get();
    const collectionData = state.engineState.collections[collectionId];
    if (!collectionData) return;

    const nodeState = collectionData.nodesState[nodeId];
    if (!nodeState || nodeState.status === "completed") return;

    const catalogNode = missionCatalog[nodeId];
    if (!catalogNode) return;

    const cooldownDays = catalogNode.execution.recurrence?.cooldownDays || 0;
    
    // Aquí es donde en el futuro haremos el broadcast de los 'outcomes' (estrellas, polvos)
    // para que el resto de la app los atrape y aplique a sus respectivas variables.
    // const outcomes = catalogNode.outcomes?.onComplete;

    // Lógica de avance lineal
    const collectionDef = collectionIndex.find(c => c.collectionId === collectionId);
    let newCurrentNodeId = collectionData.currentNodeId;
    
    if (collectionDef && collectionDef.behavior.flow === "linear" && collectionData.currentNodeId === nodeId) {
      // Busca a dónde debe apuntar ahora
      const nodeDef = collectionDef.nodes.find(n => n.nodeId === nodeId);
      if (nodeDef && nodeDef.next && nodeDef.next["default"]) {
        newCurrentNodeId = nodeDef.next["default"];
      } else {
        newCurrentNodeId = null; // Llegó al final del camino
      }
    }

    set((state) => ({
      engineState: {
        ...state.engineState,
        collections: {
          ...state.engineState.collections,
          [collectionId]: {
            ...state.engineState.collections[collectionId],
            currentNodeId: newCurrentNodeId,
            nodesState: {
              ...state.engineState.collections[collectionId].nodesState,
              [nodeId]: {
                ...nodeState,
                status: "completed",
                progress: catalogNode.execution.targetValue || 1,
                cooldownRemaining: cooldownDays
              }
            }
          }
        }
      }
    }));
  },

  /**
   * 4. LA FUNCIÓN "ONE TO RULE THEM ALL" (Reseteo Calendárico)
   * Resta 1 día de cooldown a todos los nodos completados. 
   * Si llega a 0, lo vuelve a activar.
   */
  resetCalendarDay: () => {
    set((state) => {
      const collections = state.engineState.collections;
      const newCollections = {};
      let hasChanges = false;

      for (const [collectionId, collectionData] of Object.entries(collections)) {
        const newNodesState = {};
        for (const [nodeId, nodeState] of Object.entries(collectionData.nodesState)) {
          if (nodeState.status === "completed" && nodeState.cooldownRemaining > 0) {
            hasChanges = true;
            const newCooldown = nodeState.cooldownRemaining - 1;
            
            newNodesState[nodeId] = {
              ...nodeState,
              cooldownRemaining: newCooldown,
              status: newCooldown === 0 ? "active" : "completed",
              progress: newCooldown === 0 ? 0 : nodeState.progress
            };
          } else {
            // Se queda igual
            newNodesState[nodeId] = nodeState;
          }
        }
        
        newCollections[collectionId] = {
          ...collectionData,
          nodesState: newNodesState
        };
      }

      if (hasChanges) {
        return {
          engineState: {
            ...state.engineState,
            collections: newCollections
          }
        };
      }
      return state; // Sin cambios, no forzamos re-render
    });
  }
});
