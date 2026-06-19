import { activityCatalog } from '../../data/activityCatalog';

export const createStoreSlice = (set, get) => ({
  // --- ESTADO GLOBAL DEL MODAL DE TIENDA ---
  activePurchaseItem: null,
  purchaseStep: 'idle', // 'idle' | 'confirm_affordable' | 'confirm_unaffordable' | 'detail_view'
  isDirectFlight: false,

  setPurchaseState: (step, item = null, qty = 1) => set({ purchaseStep: step, activePurchaseItem: item, purchaseQuantity: qty }),

  updatePurchaseQuantity: (newQty) => {
    const state = get();
    if (!state.activePurchaseItem) return;

    // 1. Regla de límite de stock (Máximo 10 a la vez)
    if (newQty > 10) {
      set({ purchaseQuantity: 1 });
      return;
    }

    // 2. Regla de presupuesto (No permitir si no alcanza)
    const nextPrice = (state.activePurchaseItem.price || 100) * newQty;
    if (state.userStars < nextPrice) {
      set({ purchaseQuantity: 1 });
      return;
    }

    // Si pasa ambas pruebas, guarda la cantidad
    set({ purchaseQuantity: newQty });
  },

  prepareDirectPurchase: (productId) => {
    const state = get();
    // 1. Encontrar el producto
    let product = state.catalog.find(p => String(p.id) === String(productId));
    if (!product) {
      const activityInfo = activityCatalog.find(a => String(a.activityID) === String(productId));
      if (activityInfo) {
        product = { ...activityInfo, category: 'Actividad' };
      }
    }

    // 2. Configurar el estado global del modal si se encuentra
    if (product) {
      const basePrice = product.price || 100;
      if (state.userStars >= basePrice) {
        set({ purchaseStep: 'confirm_affordable', activePurchaseItem: product, purchaseQuantity: 1, isDirectFlight: true });
      } else {
        set({ purchaseStep: 'confirm_unaffordable', activePurchaseItem: product, purchaseQuantity: 1, isDirectFlight: true });
      }
    }
  },

  categories: ["Mascota", "Magia", "Actividad"],
  catalog: [
    {
      id: 'agua',
      name: 'Botellita de agua',
      icon: '💧',
      price: 6,
      category: 'Mascota',
      description: 'Agua fresca para hidratar un poco a Spiral.',
      chips: ['Nivel 1', 'Hidrata 4 horas'],
      payload: { targetsNeed: 'water', amount: 4, quantity: 1, rewardStars: 2, idleReward: 2 }
    },
    {
      id: 'comida',
      name: 'Croquetas normales',
      icon: '🍖',
      price: 15,
      category: 'Mascota',
      description: 'Un puñado de croquetas nutritivas.',
      chips: ['Nivel 1', 'Sacia 8 horas'],
      payload: { targetsNeed: 'food', amount: 8, quantity: 1, rewardStars: 3, idleReward: 1 }
    },
    {
      id: 'jabob',
      name: 'Jabón neutro',
      icon: '🧼',
      price: 40,
      category: 'Mascota',
      description: 'Limpia la suciedad básica del pelaje.',
      chips: ['Nivel 1', 'Limpia 24 horas'],
      payload: { targetsNeed: 'clean', amount: 24, quantity: 1, rewardStars: 4, idleReward: 1 }
    },
    {
      id: 'juguete',
      name: 'Ratón de juguete',
      icon: '🐭',
      price: 15,
      category: 'Mascota',
      description: 'Un ratón clásico para corretear.',
      chips: ['Nivel 1', 'Divierte 10 horas'],
      payload: { targetsNeed: 'play', amount: 10, quantity: 1, rewardStars: 4, idleReward: 2 }
    },
    { id: 'polvo_lunar', name: 'Polvo Lunar', icon: '✨', price: 180, category: 'Magia', description: 'Polvo mágico para desbloquear casillas especiales o nuevas páginas.', chips: ['Premium', '1 uso', 'Funcional'], payload: { type: 'UNLOCK_TOOL' } },
    { id: 'reloj_cosmico', name: 'Reloj Cósmico', icon: '⏳', price: 50, category: 'Magia', description: 'Retrocede el tiempo del universo para forzar un nuevo día inmediatamente.', chips: ['Poder Cósmico', '1 uso', 'Límite 4/mes'], payload: { type: 'TIME_TRAVEL' } }
  ],
  purchaseItem: (productId, quantity = 1) => {
    const state = get();

    // Buscar en el catálogo de items primero
    let product = state.catalog.find(p => p.id === productId);

    // Si no está ahí, buscar en el catálogo de actividades
    if (!product) {
      const activityInfo = activityCatalog.find(a => a.activityID === productId);
      if (activityInfo) {
        product = { ...activityInfo, category: 'Actividad' };
      }
    }

    if (!product) return;

    const basePrice = product.price || 100;
    const totalPrice = basePrice * quantity;

    if (state.userStars < totalPrice) {
      state.setSpiralMessage("STORE_NOT_ENOUGH_STARS");
      return;
    }

    state.spendStars(totalPrice);

    // Clonamos el producto para inyectarle la cantidad correcta según la compra
    const purchasedProduct = {
      ...product,
      payload: {
        ...product.payload,
        quantity: (product.payload?.quantity || 1) * quantity
      }
    };

    if (product.payload?.type === 'TIME_TRAVEL') {
      set((s) => ({
        lastResetDate: '2000-01-01',
        activities: (s.activities || []).map(a => ({ ...a, periodStartDate: '2000-01-01' }))
      }));
      state.setEphemeralMessage("TIME_TRAVEL_SUCCESS");
    } else if (product.category === 'Mascota') {
      state.addPetItem(purchasedProduct);
      state.setEphemeralMessage("SPIRAL_FELIZ");
    } else if (product.category === 'Magia') {
      state.addCardToInventory(purchasedProduct);
      state.setEphemeralMessage("SPIRAL_FELIZ");
    } else {
      state.purchaseActivity(productId);
      state.setEphemeralMessage("STORE_ACTIVITY_BOUGHT");
    }
  }
});
