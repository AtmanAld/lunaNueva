import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalDateString } from '../utils/dateUtils';
import { createUserSlice } from './slices/createUserSlice';
import { createDashboardSlice } from './slices/createDashboardSlice';
import { createPetSlice } from './slices/createPetSlice';
import { createStoreSlice } from './slices/createStoreSlice';
import { createAlbumSlice } from './slices/createAlbumSlice';
import { createMessageSlice } from './slices/createMessageSlice';
import { createEngineSlice } from './slices/createEngineSlice';
export const useGameStore = create(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createDashboardSlice(...a),
      ...createPetSlice(...a),
      ...createStoreSlice(...a),
      ...createAlbumSlice(...a),
      ...createMessageSlice(...a),
      ...createEngineSlice(...a)
    }),
    {
      name: 'luna-nueva-storage',
      partialize: (state) => {
        // Excluimos del guardado local todo lo que sea "Configuración/Catálogo"
        // y los mensajes efímeros que no deben persistir entre sesiones.
        // `pendingReward` sí se guardará en "rest".
        const { catalog, categories, userLevels, ephemeralMessage, ambientMessage, spiralMessage, messageQueue, scopedEphemeralTimerIds, ...rest } = state;
        return rest;
      },
      migrate: (persistedState, version) => {
        let state = persistedState;

        if (version < 19) {
          // FORZAR NUEVO BALANCE + UMBRALES CORRECTOS (v19)
          state = {
            ...state,
            needs: { water: 28, food: 56, clean: 72, play: 44 },
            complaintThresholds: { water: 24, food: 48, clean: 48, play: 36 },
            petInventory: [
              { id: 'agua', name: 'Botellita de agua', icon: '💧', quantity: 3, targetsNeed: 'water', amount: 4 },
              { id: 'comida', name: 'Croquetas normales', icon: '🍖', quantity: 3, targetsNeed: 'food', amount: 8 },
              { id: 'jabob', name: 'Jabón neutro', icon: '🧼', quantity: 3, targetsNeed: 'clean', amount: 24 },
              { id: 'juguete', name: 'Ratón de juguete', icon: '🐭', quantity: 3, targetsNeed: 'play', amount: 8 },
            ]
          };
        }

        if (version < 20) {
          // NUEVO AJUSTE (v20): Umbrales específicos y necesidades al límite
          state = {
            ...state,
            needs: { water: 24, food: 24, clean: 48, play: 40 },
            complaintThresholds: { water: 24, food: 24, clean: 48, play: 40 }
          };
        }

        if (version < 21) {
          // SINCRONIZAR RECOMPENSAS (v21): Inyectar rewardStars y idleReward a items existentes
          const catalogRewards = {
            'agua': { rewardStars: 2, idleReward: 2 },
            'comida': { rewardStars: 3, idleReward: 2 },
            'jabob': { rewardStars: 4, idleReward: 2 },
            'juguete': { rewardStars: 4, idleReward: 6 }
          };

          state = {
            ...state,
            petInventory: (state.petInventory || []).map(item => {
              const rewards = catalogRewards[item.id];
              if (rewards) {
                return { ...item, ...rewards };
              }
              return item;
            })
          };
        }

        if (version < 24) {
          // MIGRACIÓN v24: Inicializar campos de la Luna para evitar NaN en sesiones viejas
          state = {
            ...state,
            moonPhase: {
              name: state.moonPhase?.name || "Luna Nueva",
              progressPoints: Number(state.moonPhase?.progressPoints) || 0,
              maxPoints: 100,
              givenCreciente: !!state.moonPhase?.givenCreciente,
              givenCuarto: !!state.moonPhase?.givenCuarto,
              givenGibosa: !!state.moonPhase?.givenGibosa
            },
            pendingPhaseReward: null
          };
        }

        if (version < 25) {
          // MIGRACIÓN v25: Inyectar metadatos (título y subtítulo) en las páginas existentes
          const pageMetadata = {
            1: { title: 'Le Saut de la Lune', subtitle: 'Donde el destino teje y el deseo danza.' },
            2: { title: 'Gatos y Misticismo', subtitle: 'Colección Equinoccio 2024' },
            3: { title: 'El Sello del Pentáculo', subtitle: 'Colección Luna Llena 2025' },
            4: { title: 'Nebulosas de Ensueño', subtitle: 'Colección Especial 2025' }
          };
          state = {
            ...state,
            pages: (state.pages || []).map(p => {
              const meta = pageMetadata[p.id];
              return meta ? { ...p, ...meta } : p;
            })
          };
        }

        if (version < 26) {
          // MIGRACIÓN v26: Inyectar headerBg en la página 1
          state = {
            ...state,
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, headerBg: '/Album Mágico/1/headerBG.jpg' };
              }
              return p;
            })
          };
        }

        if (version < 27) {
          // MIGRACIÓN v27: Inyectar headerBg dinámico (/Album Mágico/{id}/headerBG.jpg) en todas las páginas
          state = {
            ...state,
            pages: (state.pages || []).map(p => ({
              ...p,
              headerBg: `/Album Mágico/${p.id}/headerBG.jpg`
            }))
          };
        }

        if (version < 28) {
          // Reset y reconfiguración completa a la versión 28 (Nueva estructura Pentáculo y slots integrados)
          state = {
            ...state,
            albumPage: 1,
            pendingPlacementCard: null,
            pages: [
              { id: 1, state: 'unlocked', rewardState: 'default', title: 'Le Saut de la Lune', subtitle: 'Donde el destino teje y el deseo danza.', headerBg: '/Album Mágico/1/headerBG.jpg' },
              { id: 2, state: 'locked', rewardState: 'default', title: 'Gatos y Misticismo', subtitle: 'Colección Equinoccio 2024', headerBg: '/Album Mágico/2/headerBG.jpg' },
              { id: 3, state: 'locked', rewardState: 'default', title: 'El Sello del Pentáculo', subtitle: 'Colección Luna Llena 2025', headerBg: '/Album Mágico/3/headerBG.jpg' },
              { id: 4, state: 'locked', rewardState: 'default', title: 'Nebulosas de Ensueño', subtitle: 'Colección Especial 2025', headerBg: '/Album Mágico/4/headerBG.jpg' }
            ],
            slots: [
              // Página 1
              { id: 1, pageId: 1, slotNum: 1, state: 'empty', title: 'Creciente Lunar', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', video: '/Album Mágico/1/crecienteLunar.mp4', rarity: 'Especial' },
              { id: 2, pageId: 1, slotNum: 2, state: 'empty', title: 'Escoba de Bruja', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', video: '/Album Mágico/1/escobaDeBruja.mp4', rarity: 'Común' },
              { id: 3, pageId: 1, slotNum: 3, state: 'empty', title: 'El Gato Místico', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', video: '/Album Mágico/1/elGato.mp4', rarity: 'Común' },
              { id: 4, pageId: 1, slotNum: 4, state: 'empty', title: 'La Araña Tejedora', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', video: '/Album Mágico/1/laArana.mp4', rarity: 'Común' },
              { id: 5, pageId: 1, slotNum: 5, state: 'empty', title: 'Le Mat (El Loco)', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', video: '/Album Mágico/1/leMat.mp4', rarity: 'Común' },

              // Página 2 (Gatos y Misticismo)
              { id: 6, pageId: 2, slotNum: 1, state: 'empty', title: 'Gatito Familiar', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', rarity: 'Especial' },
              { id: 7, pageId: 2, slotNum: 2, state: 'empty', title: 'Caldero de Bruja', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', rarity: 'Común' },
              { id: 8, pageId: 2, slotNum: 3, state: 'empty', title: 'Hierbas Mágicas', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', rarity: 'Común' },
              { id: 9, pageId: 2, slotNum: 4, state: 'empty', title: 'Pócima de Amor', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', rarity: 'Común' },
              { id: 10, pageId: 2, slotNum: 5, state: 'empty', title: 'Libro de Hechizos', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', rarity: 'Común' },

              // Página 3 (El Sello del Pentáculo)
              { id: 11, pageId: 3, slotNum: 1, state: 'empty', title: 'Gran Ritual', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', rarity: 'Especial' },
              { id: 12, pageId: 3, slotNum: 2, state: 'empty', title: 'Cristal Amatista', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', rarity: 'Común' },
              { id: 13, pageId: 3, slotNum: 3, state: 'empty', title: 'Vela de Cera', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', rarity: 'Común' },
              { id: 14, pageId: 3, slotNum: 4, state: 'empty', title: 'Incienso Sagrado', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', rarity: 'Común' },
              { id: 15, pageId: 3, slotNum: 5, state: 'empty', title: 'Runas Nórdicas', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', rarity: 'Común' },

              // Página 4 (Nebulosas de Ensueño)
              { id: 16, pageId: 4, slotNum: 1, state: 'empty', title: 'Nebulosa Madre', image: '/Album Mágico/1/crecienteLunar.jpg', bgSvg: '/Album Mágico/1/crecienteLunar.svg', rarity: 'Especial' },
              { id: 17, pageId: 4, slotNum: 2, state: 'empty', title: 'Polvo de Cometa', image: '/Album Mágico/1/escobaDeBruja.jpg', bgSvg: '/Album Mágico/1/escobaDeBruja.svg', rarity: 'Común' },
              { id: 18, pageId: 4, slotNum: 3, state: 'empty', title: 'Estrella Binaria', image: '/Album Mágico/1/elGato.jpg', bgSvg: '/Album Mágico/1/elGato.svg', rarity: 'Común' },
              { id: 19, pageId: 4, slotNum: 4, state: 'empty', title: 'Agujero de Gusano', image: '/Album Mágico/1/laArana.jpg', bgSvg: '/Album Mágico/1/laArana.svg', rarity: 'Común' },
              { id: 20, pageId: 4, slotNum: 5, state: 'empty', title: 'Constelación Fénix', image: '/Album Mágico/1/leMat.jpg', bgSvg: '/Album Mágico/1/leMat.svg', rarity: 'Común' }
            ],
            albumItems: { polvo_lunar: state.albumItems?.polvo_lunar || 0 }
          };
        }

        if (version < 29) {
          // Migración a versión 29: Actualizar formatos de imagen de .png a .jpg en slots y pendingPlacementCard
          state = {
            ...state,
            slots: (state.slots || []).map(s => ({
              ...s,
              image: s.image ? s.image.replace('.png', '.jpg') : s.image
            })),
            pendingPlacementCard: state.pendingPlacementCard ? {
              ...state.pendingPlacementCard,
              image: state.pendingPlacementCard.image ? state.pendingPlacementCard.image.replace('.png', '.jpg') : state.pendingPlacementCard.image
            } : null
          };
        }

        if (version < 30) {
          // Migración a versión 30: Inyectar "El Gato Místico" como pendingPlacementCard y resetear su slot a vacío para testeo
          state = {
            ...state,
            slots: (state.slots || []).map(s => s.id === 3 ? { ...s, state: 'empty' } : s),
            pendingPlacementCard: {
              id: 3,
              pageId: 1,
              slotNum: 3,
              state: 'empty',
              title: 'El Gato Místico',
              image: '/Album Mágico/1/elGato.jpg',
              bgSvg: '/Album Mágico/1/elGato.svg',
              video: '/Album Mágico/1/elGato.mp4',
              rarity: 'Común'
            }
          };
        }

        if (version < 31) {
          // Migración a versión 31: Agregar la propiedad "description" a los slots existentes y pendingPlacementCard
          const descriptions = {
            1: 'Símbolo de la intuición, los nuevos comienzos, el crecimiento espiritual, el magnetismo, la expansión y la atracción de nueva abundancia.',
            2: 'Símbolo de magia empática para la fertilidad, enseñando a los cultivos a crecer para atraer la cosecha.',
            3: 'Guardián del hogar, símbolo de la luna, misterio, sensualidad y abundancia pacífica hogareña.',
            4: 'Símbolo de la diosa tejedora de destinos. Crea abundancia hilando de su propio cuerpo.',
            5: 'La libertad absoluta del deseo, la danza desinhibida y el salto hacia el placer desconocido.'
          };

          state = {
            ...state,
            slots: (state.slots || []).map(s => ({
              ...s,
              description: descriptions[s.id] || ''
            })),
            pendingPlacementCard: state.pendingPlacementCard ? {
              ...state.pendingPlacementCard,
              description: descriptions[state.pendingPlacementCard.id] || ''
            } : null
          };
        }

        if (version < 32) {
          // Migración a versión 32: Configurar "La Araña Tejedora" como pendingPlacementCard y resetear su slot a vacío para testeo
          state = {
            ...state,
            slots: (state.slots || []).map(s => s.id === 4 ? { ...s, state: 'empty' } : s),
            pendingPlacementCard: {
              id: 4,
              pageId: 1,
              slotNum: 4,
              title: 'La Araña Tejedora',
              image: '/Album Mágico/1/laArana.jpg',
              video: '/Album Mágico/1/laArana.mp4',
              description: 'Símbolo de la diosa tejedora de destinos. Crea abundancia hilando de su propio cuerpo.'
            }
          };
        }

        if (version < 33) {
          // Migración a versión 33: Configurar "Escoba de Bruja" como pendingPlacementCard y resetear slots 2 y 4 a vacío para pruebas continuas
          state = {
            ...state,
            slots: (state.slots || []).map(s => (s.id === 2 || s.id === 4) ? { ...s, state: 'empty' } : s),
            pendingPlacementCard: {
              id: 2,
              pageId: 1,
              slotNum: 2,
              title: 'Escoba de Bruja',
              image: '/Album Mágico/1/escobaDeBruja.jpg',
              video: '/Album Mágico/1/escobaDeBruja.mp4',
              description: 'Símbolo de magia empática para la fertilidad, enseñando a los cultivos a crecer para atraer la cosecha.'
            }
          };
        }

        if (version < 34) {
          // Migración a versión 34: Llenar slots 2, 3, 4 y 5 y poner "Creciente Lunar" (casilla 1) en mano como última carta
          state = {
            ...state,
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                if (s.id === 1) return { ...s, state: 'empty' };
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pendingPlacementCard: {
              id: 1,
              pageId: 1,
              slotNum: 1,
              title: 'Creciente Lunar',
              image: '/Album Mágico/1/crecienteLunar.jpg',
              video: '/Album Mágico/1/crecienteLunar.mp4',
              description: 'Símbolo de la intuición, los nuevos comienzos, el crecimiento espiritual, el magnetismo, la expansión y la atracción de nueva abundancia.'
            }
          };
        }

        if (version < 35) {
          // Migración a versión 35: Resetear el estado para re-probar el flujo limpio con Creciente Lunar en mano y slots 2, 3, 4, 5 llenos
          state = {
            ...state,
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                if (s.id === 1) return { ...s, state: 'empty' };
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) return { ...p, rewardState: 'default' };
              return p;
            }),
            pendingPlacementCard: {
              id: 1,
              pageId: 1,
              slotNum: 1,
              title: 'Creciente Lunar',
              image: '/Album Mágico/1/crecienteLunar.jpg',
              video: '/Album Mágico/1/crecienteLunar.mp4',
              description: 'Símbolo de la intuición, los nuevos comienzos, el crecimiento espiritual, el magnetismo, la expansión y la atracción de nueva abundancia.'
            }
          };
        }

        if (version < 36) {
          // Migración a versión 36: Llenar todos los slots 1-5 de la página 1 y resetear rewardState a 'default' para pruebas
          state = {
            ...state,
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) return { ...p, rewardState: 'default' };
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 38) {
          // Migración a versión 38: Resetear las actividades de la usuaria para usar el catálogo balanceado de 10 actividades.
          state = {
            ...state,
            activities: [
              { activityID: 1, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 2, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 3, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 4, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 5, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 6, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 7, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 8, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 9, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false },
              { activityID: 10, completions: 0, fullyCompleted: false, isUnlocked: true, isActive: true, usedForRitual: false }
            ],
            activitySets: [
              { id: 1, isUnlocked: true, isActive: true },
              { id: 2, isUnlocked: true, isActive: true },
              { id: 3, isUnlocked: true, isActive: true }
            ]
          };
        }

        if (version < 39) {
          // Migración a versión 39: Llenar todos los slots de la página 1 para habilitar el ritual (isRitualReady)
          state = {
            ...state,
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, state: 'unlocked', rewardState: 'default' };
              }
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 40) {
          // Migración a versión 40: Inicializar ritualState y asegurar slots de página 1 llenos para pruebas
          state = {
            ...state,
            ritualState: { phase: 'idle', step: 1, rewards: null },
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, state: 'unlocked', rewardState: 'default' };
              }
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 41) {
          // Migración a versión 41: Forzar slots de página 1 a llenos y pendingPlacementCard a null para dejar el ritual listo
          state = {
            ...state,
            ritualState: { phase: 'idle', step: 1, rewards: null },
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'filled' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, state: 'unlocked', rewardState: 'default' };
              }
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 42) {
          // Migración a versión 42: Vaciar slots de página 1 y dejar pendingPlacementCard en null (cero tarjetas en mano)
          state = {
            ...state,
            ritualState: { phase: 'idle', step: 1, rewards: null },
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'empty' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, state: 'unlocked', rewardState: 'default' };
              }
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 43) {
          // Migración a versión 43: Forzar todos los slots de la página 1 a vacíos y pendingPlacementCard a null (cero tarjetas en mano)
          state = {
            ...state,
            ritualState: { phase: 'idle', step: 1, rewards: null },
            slots: (state.slots || []).map(s => {
              if (s.pageId === 1) {
                return { ...s, state: 'empty' };
              }
              return s;
            }),
            pages: (state.pages || []).map(p => {
              if (p.id === 1) {
                return { ...p, state: 'unlocked', rewardState: 'default' };
              }
              return p;
            }),
            pendingPlacementCard: null
          };
        }

        if (version < 44) {
          // Migración a versión 44: Actualizar título, subtitulo y slots de la página 2
          const page2SlotsData = [
            { id: 6, pageId: 2, slotNum: 1, title: 'Luna Nueva', image: '/Album Mágico/2/lunaNueva.jpg', bgSvg: '/Album Mágico/2/lunaNueva.svg', video: '/Album Mágico/2/lunaNueva.mp4', rarity: 'Especial', description: 'Símbolo del vacío fértil, la siembra de semillas místicas y la preparación de la matriz para la nueva creación.' },
            { id: 7, pageId: 2, slotNum: 2, title: 'Diosa Espiral', image: '/Album Mágico/2/diosaEspiral.jpg', bgSvg: '/Album Mágico/2/diosaEspiral.svg', video: '/Album Mágico/2/diosaEspiral.mp4', rarity: 'Común', description: 'Silueta femenina con una espiral en el vientre. Representa la fuerza generadora y la abundancia en constante crecimiento.' },
            { id: 8, pageId: 2, slotNum: 3, title: 'El Loto', image: '/Album Mágico/2/elLoto.jpg', bgSvg: '/Album Mágico/2/elLoto.svg', video: '/Album Mágico/2/elLoto.mp4', rarity: 'Común', description: 'Representa el útero cósmico, la pureza divina femenina y el florecimiento del espíritu.' },
            { id: 9, pageId: 2, slotNum: 4, title: 'El Pentagrama', image: '/Album Mágico/2/elPentagrama.jpg', bgSvg: '/Album Mágico/2/elPentagrama.svg', video: '/Album Mágico/2/elPentagrama.mp4', rarity: 'Común', description: 'Estrella de cinco puntas entrelazada que apunta hacia arriba. Representa los cinco elementos: Tierra, Aire, Fuego, Agua y el Espíritu.' },
            { id: 10, pageId: 2, slotNum: 5, title: 'La Temperanza', image: '/Album Mágico/2/laTemperanza.jpg', bgSvg: '/Album Mágico/2/laTemperanza.svg', video: '/Album Mágico/2/laTemperanza.mp4', rarity: 'Común', description: 'La caricia curativa, el flujo de energías sutiles, el tantra y la mezcla fluida de auras y esencias.' }
          ];

          state = {
            ...state,
            pages: (state.pages || []).map(p => {
              if (p.id === 2) {
                return {
                  ...p,
                  title: 'Espiral de Loto',
                  subtitle: 'Donde el espíritu florece y la energía sana.'
                };
              }
              return p;
            }),
            slots: (state.slots || []).map(s => {
              if (s.pageId === 2) {
                const newData = page2SlotsData.find(d => d.slotNum === s.slotNum);
                return newData ? { ...s, ...newData } : s;
              }
              return s;
            }),
            pendingPlacementCard: state.pendingPlacementCard && state.pendingPlacementCard.pageId === 2
              ? (() => {
                  const p = state.pendingPlacementCard;
                  const newData = page2SlotsData.find(d => d.slotNum === p.slotNum);
                  return newData ? { ...p, ...newData } : p;
                })()
              : state.pendingPlacementCard
          };
        }

        if (version < 45) {
          // Migración a versión 45: Actualizar título, subtitulo y slots de la página 3
          const page3SlotsData = [
            { id: 11, pageId: 3, slotNum: 1, title: 'Luna Menguante', image: '/Album Mágico/3/lunaMenguante.jpg', bgSvg: '/Album Mágico/3/lunaMenguante.svg', video: '/Album Mágico/3/lunaMenguante.mp4', rarity: 'Especial', description: 'Símbolo de la anciana o la bruja sabia, la limpieza, el dejar ir y la sabiduría acumulada.' },
            { id: 12, pageId: 3, slotNum: 2, title: 'Runa Perthro', image: '/Album Mágico/3/runaPetro.jpg', bgSvg: '/Album Mágico/3/runaPetro.svg', video: '/Album Mágico/3/runaPetro.mp4', rarity: 'Común', description: 'Representa la copa del destino y el misterio del vientre; el lugar oscuro y seguro donde se gesta la magia femenina.' },
            { id: 13, pageId: 3, slotNum: 3, title: 'Ying Yang', image: '/Album Mágico/3/yingYang.jpg', bgSvg: '/Album Mágico/3/yingYang.svg', video: '/Album Mágico/3/yingYang.mp4', rarity: 'Común', description: 'Símbolo taoísta que denota el equilibrio perfecto entre la luz y la oscuridad, lo masculino y lo femenino.' },
            { id: 14, pageId: 3, slotNum: 4, title: 'Venus', image: '/Album Mágico/3/simboloVenus.jpg', bgSvg: '/Album Mágico/3/simboloVenus.svg', video: '/Album Mágico/3/simboloVenus.mp4', rarity: 'Común', description: 'Representa lo femenino, la atracción, el lujo, el amor, la belleza y la abundancia terrenal.' },
            { id: 15, pageId: 3, slotNum: 5, title: 'Tarot de Marsella: Le Chariot', image: '/Album Mágico/3/leChariot.jpg', bgSvg: '/Album Mágico/3/leChariot.svg', video: '/Album Mágico/3/leChariot.mp4', rarity: 'Común', description: 'La conquista del placer, el avance apasionado y el dominio instintivo sobre la propia sexualidad.' }
          ];

          state = {
            ...state,
            pages: (state.pages || []).map(p => {
              if (p.id === 3) {
                return {
                  ...p,
                  title: 'Venus oculta',
                  subtitle: 'Equilibrio, belleza y dominio instintivo.'
                };
              }
              return p;
            }),
            slots: (state.slots || []).map(s => {
              if (s.pageId === 3) {
                const newData = page3SlotsData.find(d => d.slotNum === s.slotNum);
                return newData ? { ...s, ...newData } : s;
              }
              return s;
            }),
            pendingPlacementCard: state.pendingPlacementCard && state.pendingPlacementCard.pageId === 3
              ? (() => {
                  const p = state.pendingPlacementCard;
                  const newData = page3SlotsData.find(d => d.slotNum === p.slotNum);
                  return newData ? { ...p, ...newData } : p;
                })()
              : state.pendingPlacementCard
          };
        }

        if (version < 46) {
          // Migración a versión 46: Rescate de la página 2 para usuarios que se quedaron atorados en v44
          const page2SlotsData = [
            { id: 6, pageId: 2, slotNum: 1, title: 'Luna Nueva', image: '/Album Mágico/2/lunaNueva.jpg', bgSvg: '/Album Mágico/2/lunaNueva.svg', video: '/Album Mágico/2/lunaNueva.mp4', rarity: 'Especial', description: 'Símbolo del vacío fértil, la siembra de semillas místicas y la preparación de la matriz para la nueva creación.' },
            { id: 7, pageId: 2, slotNum: 2, title: 'Diosa Espiral', image: '/Album Mágico/2/diosaEspiral.jpg', bgSvg: '/Album Mágico/2/diosaEspiral.svg', video: '/Album Mágico/2/diosaEspiral.mp4', rarity: 'Común', description: 'Silueta femenina con una espiral en el vientre. Representa la fuerza generadora y la abundancia en constante crecimiento.' },
            { id: 8, pageId: 2, slotNum: 3, title: 'El Loto', image: '/Album Mágico/2/elLoto.jpg', bgSvg: '/Album Mágico/2/elLoto.svg', video: '/Album Mágico/2/elLoto.mp4', rarity: 'Común', description: 'Representa el útero cósmico, la pureza divina femenina y el florecimiento del espíritu.' },
            { id: 9, pageId: 2, slotNum: 4, title: 'El Pentagrama', image: '/Album Mágico/2/elPentagrama.jpg', bgSvg: '/Album Mágico/2/elPentagrama.svg', video: '/Album Mágico/2/elPentagrama.mp4', rarity: 'Común', description: 'Estrella de cinco puntas entrelazada que apunta hacia arriba. Representa los cinco elementos: Tierra, Aire, Fuego, Agua y el Espíritu.' },
            { id: 10, pageId: 2, slotNum: 5, title: 'La Temperanza', image: '/Album Mágico/2/laTemperanza.jpg', bgSvg: '/Album Mágico/2/laTemperanza.svg', video: '/Album Mágico/2/laTemperanza.mp4', rarity: 'Común', description: 'La caricia curativa, el flujo de energías sutiles, el tantra y la mezcla fluida de auras y esencias.' }
          ];

          state = {
            ...state,
            pages: (state.pages || []).map(p => {
              if (p.id === 2) {
                return {
                  ...p,
                  title: 'Espiral de Loto',
                  subtitle: 'Donde el espíritu florece y la energía sana.'
                };
              }
              return p;
            }),
            slots: (state.slots || []).map(s => {
              if (s.pageId === 2) {
                const newData = page2SlotsData.find(d => d.slotNum === s.slotNum);
                return newData ? { ...s, ...newData } : s;
              }
              return s;
            }),
            pendingPlacementCard: state.pendingPlacementCard && state.pendingPlacementCard.pageId === 2
              ? (() => {
                  const p = state.pendingPlacementCard;
                  const newData = page2SlotsData.find(d => d.slotNum === p.slotNum);
                  return newData ? { ...p, ...newData } : p;
                })()
              : state.pendingPlacementCard
          };
        }

        if (version < 47) {
          // Migración a versión 47: Forzar reinicio masivo del día
          // Atrasamos las fechas al año 2000 para que cualquier fecha actual la sobrepase por completo.
          state = {
            ...state,
            lastResetDate: '2000-01-01',
            activities: (state.activities || []).map(a => ({
              ...a,
              periodStartDate: '2000-01-01'
            }))
          };
        }

        return state;
      },
      version: 47,
    }
  )
);
