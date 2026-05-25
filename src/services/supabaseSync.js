import { supabase } from '../supabaseclient';
import { useGameStore } from '../store/useGameStore';

let syncSubscription = null;
let debounceTimer = null;

export const hydrateStoreFromSupabase = async (userId) => {
  console.log("Iniciando hidratación desde Supabase para:", userId);

  try {
    const [
      { data: profile },
      { data: gameState },
      { data: moonPhase },
      { data: pet },
      { data: inventory },
      { data: activitySets },
      { data: activities },
      { data: album },
      { data: albumSlots }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('game_state').select('*').eq('user_id', userId).single(),
      supabase.from('moon_phase').select('*').eq('user_id', userId).single(),
      supabase.from('pet').select('*').eq('user_id', userId).single(),
      supabase.from('inventory').select('*').eq('user_id', userId),
      supabase.from('activity_sets').select('*').eq('user_id', userId),
      supabase.from('activities').select('*').eq('user_id', userId),
      supabase.from('album').select('*').eq('user_id', userId),
      supabase.from('album_slots').select('*').eq('user_id', userId)
    ]);

    const stateToUpdate = {};

    // 1. Profile
    if (profile) {
      stateToUpdate.userName = profile.user_name || 'Bruja Novata';
      stateToUpdate.userLevel = profile.user_level || '1';
      stateToUpdate.userAvatar = profile.user_avatar || null;
    }

    // 2. Game State
    if (gameState) {
      stateToUpdate.userStars = gameState.user_stars ?? 0;
      stateToUpdate.totalIdleStars = gameState.total_idle_stars ?? 0;
      stateToUpdate.lastResetDate = gameState.last_reset_date || new Date().toISOString();
      stateToUpdate.pendingPhaseReward = gameState.pending_phase_reward || null;
      stateToUpdate.hasMoonBeenRenewedToday = gameState.has_moon_been_renewed_today || false;
      stateToUpdate.lastDegradationTimestamp = gameState.last_degradation_timestamp 
        ? new Date(gameState.last_degradation_timestamp).getTime() 
        : Date.now();
      stateToUpdate.ritualState = gameState.ritual_state || { phase: 'idle', step: 1, rewards: null };
      stateToUpdate.pendingPlacementCard = gameState.pending_placement_card || null;
      
      stateToUpdate.statistics = {
        totalStarsEarned: gameState.total_stars_earned ?? 0,
        totalStarsSpent: gameState.total_stars_spent ?? 0,
        totalTasksCompleted: gameState.total_tasks_completed ?? 0,
        totalMoney: gameState.total_money ?? 0,
        totalMoons: gameState.total_moons ?? 0
      };
    }

    // 3. Moon Phase
    if (moonPhase) {
      stateToUpdate.moonPhase = {
        name: gameState?.moon_name || "Luna Nueva", // Fallback if missing
        progressPoints: moonPhase.progress_points ?? 0,
        maxPoints: 100, // Hardcoded max
        givenCreciente: moonPhase.given_creciente || false,
        givenCuarto: moonPhase.given_cuarto || false,
        givenGibosa: moonPhase.given_gibosa || false,
        givenFullMoonReward: moonPhase.given_full_moon_reward || false
      };
      
      // Determine name based on points logic if missing from state
      if (!stateToUpdate.moonPhase.name || stateToUpdate.moonPhase.name === "Luna Nueva") {
        const pts = stateToUpdate.moonPhase.progressPoints;
        if (pts >= 100) stateToUpdate.moonPhase.name = "Luna Llena";
        else if (pts >= 74 || stateToUpdate.moonPhase.givenGibosa) stateToUpdate.moonPhase.name = "Gibosa Creciente";
        else if (pts >= 49 || stateToUpdate.moonPhase.givenCuarto) stateToUpdate.moonPhase.name = "Cuarto Creciente";
        else if (pts >= 25 || stateToUpdate.moonPhase.givenCreciente) stateToUpdate.moonPhase.name = "Luna Creciente";
        else stateToUpdate.moonPhase.name = "Luna Nueva";
      }
    }

    // 4. Pet
    if (pet) {
      stateToUpdate.petName = pet.pet_name || 'Spiral';
      stateToUpdate.needs = {
        food: pet.food ?? 100,
        water: pet.water ?? 100,
        play: pet.play ?? 100,
        clean: pet.clean ?? 100
      };
    }

    // 5. Inventory
    if (inventory && inventory.length > 0) {
      stateToUpdate.petInventory = inventory.map(item => ({
        id: item.item_type,
        quantity: item.quantity
        // Name, icon, etc will be resolved by the frontend catalog where needed,
        // or we just preserve existing if possible. Let's merge with catalog.
      }));
      // We must merge with static catalog to get `name`, `icon`, `targetsNeed`
      const catalog = useGameStore.getState().catalog || [];
      stateToUpdate.petInventory = stateToUpdate.petInventory.map(invItem => {
         const catItem = catalog.find(c => c.id === invItem.id);
         return catItem ? { ...catItem, quantity: invItem.quantity } : invItem;
      });
    }

    // 6. Activity Sets
    if (activitySets && activitySets.length > 0) {
      stateToUpdate.activitySets = activitySets.map(set => ({
        id: set.set_id,
        isUnlocked: set.is_unlocked,
        isActive: set.is_active
      }));
    }

    // 7. Activities
    if (activities && activities.length > 0) {
      stateToUpdate.activities = activities.map(act => ({
        activityID: act.activity_id,
        isUnlocked: act.is_unlocked,
        isActive: act.is_active,
        completions: act.completions,
        fullyCompleted: act.fully_completed,
        periodStartDate: act.period_start_date,
        usedForRitual: act.used_for_ritual
      }));
    }

    // 8. Album Pages
    if (album && album.length > 0) {
      // Frontend expects `id`, `state` ('locked'/'unlocked'), `rewardState`
      // We must merge with existing pages array to not lose static title/images
      const currentPages = useGameStore.getState().pages || [];
      stateToUpdate.pages = currentPages.map(cp => {
         const serverPage = album.find(a => a.page_number === cp.id);
         if (serverPage) {
           return {
             ...cp,
             state: serverPage.is_unlocked ? 'unlocked' : 'locked',
             rewardState: serverPage.reward_state || 'default'
           };
         }
         return cp;
      });
    }

    // 9. Album Slots
    if (albumSlots) {
      const serverSlotIds = albumSlots.map(s => s.slot_id);
      const currentSlots = useGameStore.getState().slots || [];
      stateToUpdate.slots = currentSlots.map(slot => ({
         ...slot,
         state: serverSlotIds.includes(slot.id) ? 'filled' : 'empty'
      }));
    }

    // Inject into Zustand
    useGameStore.setState(stateToUpdate);
    console.log("✅ Hidratación completada con éxito!");
    return true;

  } catch (error) {
    console.error("❌ Error durante la hidratación de Supabase:", error);
    return false;
  }
};

export const startSupabaseSync = (userId) => {
  if (syncSubscription) {
    syncSubscription(); // Unsubscribe prev if any
  }

  // Subscribe to all changes
  syncSubscription = useGameStore.subscribe((state, prevState) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      // 2 seconds debounce
      try {
        console.log("Sincronizando estado en segundo plano hacia Supabase...");
        
        // We push the full state just like in the manual button. 
        // In a more complex app, we would deep-diff to avoid unnecessary queries.
        
        // 1. Profile
        await supabase.from('profiles').upsert({
          id: userId,
          email: state.userEmail || '', // Assuming email is fetched earlier
          user_name: state.userName || 'Bruja Novata',
          user_level: String(state.userLevel || 1),
          user_avatar: state.userAvatar || null
        });

        // 2. Game State
        await supabase.from('game_state').upsert({
          user_id: userId,
          user_stars: state.userStars || 0,
          total_stars_earned: state.statistics?.totalStarsEarned || 0,
          total_stars_spent: state.statistics?.totalStarsSpent || 0,
          total_tasks_completed: state.statistics?.totalTasksCompleted || 0,
          total_idle_stars: state.totalIdleStars || 0,
          total_money: state.statistics?.totalMoney || 0,
          total_moons: state.statistics?.totalMoons || 0,
          last_reset_date: state.lastResetDate || new Date().toISOString(),
          pending_phase_reward: state.pendingPhaseReward || null,
          has_moon_been_renewed_today: state.hasMoonBeenRenewedToday || false,
          last_degradation_timestamp: state.lastDegradationTimestamp ? new Date(state.lastDegradationTimestamp).toISOString() : new Date().toISOString(),
          ritual_state: state.ritualState || null,
          pending_placement_card: state.pendingPlacementCard || null
        });

        // 3. Moon Phase
        await supabase.from('moon_phase').upsert({
          user_id: userId,
          progress_points: state.moonPhase?.progressPoints || 0,
          given_creciente: state.moonPhase?.givenCreciente || false,
          given_cuarto: state.moonPhase?.givenCuarto || false,
          given_gibosa: state.moonPhase?.givenGibosa || false,
          given_full_moon_reward: state.moonPhase?.givenFullMoonReward || false
        });

        // 4. Pet
        await supabase.from('pet').upsert({
          user_id: userId,
          pet_name: state.petName || 'Spiral',
          food: state.needs?.food || 100,
          water: state.needs?.water || 100,
          play: state.needs?.play || 100,
          clean: state.needs?.clean || 100
        });

        // 5. Inventory
        if (state.petInventory && state.petInventory.length > 0) {
          await supabase.from('inventory').delete().eq('user_id', userId);
          const inventoryToInsert = state.petInventory.map(item => ({
            user_id: userId,
            item_type: item.id,
            quantity: item.quantity
          }));
          await supabase.from('inventory').insert(inventoryToInsert);
        }

        // 6. Activity Sets
        if (state.activitySets && state.activitySets.length > 0) {
          await supabase.from('activity_sets').delete().eq('user_id', userId);
          const setsToInsert = state.activitySets.map(set => ({
            user_id: userId,
            set_id: set.id,
            is_unlocked: set.isUnlocked,
            is_active: set.isActive
          }));
          await supabase.from('activity_sets').insert(setsToInsert);
        }

        // 7. Activities
        if (state.activities && state.activities.length > 0) {
          await supabase.from('activities').delete().eq('user_id', userId);
          const activitiesToInsert = state.activities.map(act => ({
            user_id: userId,
            activity_id: act.activityID,
            is_unlocked: act.isUnlocked,
            is_active: act.isActive,
            completions: act.completions || 0,
            fully_completed: act.fullyCompleted || false,
            period_start_date: act.periodStartDate,
            used_for_ritual: act.usedForRitual || false
          }));
          await supabase.from('activities').insert(activitiesToInsert);
        }

        // 8. Album Pages
        if (state.pages && state.pages.length > 0) {
          await supabase.from('album').delete().eq('user_id', userId);
          const albumPagesToInsert = state.pages.map(p => ({
            user_id: userId,
            page_number: p.id,
            is_unlocked: p.state === 'unlocked',
            reward_state: p.rewardState || 'default'
          }));
          await supabase.from('album').insert(albumPagesToInsert);
        }

        // 9. Album Slots
        if (state.slots && state.slots.length > 0) {
          await supabase.from('album_slots').delete().eq('user_id', userId);
          const filledSlots = state.slots.filter(s => s.state === 'filled');
          if (filledSlots.length > 0) {
            const slotsToInsert = filledSlots.map(s => ({
              user_id: userId,
              slot_id: s.id
            }));
            await supabase.from('album_slots').insert(slotsToInsert);
          }
        }
        
        console.log("✅ Sync completado.");

      } catch (err) {
        console.error("❌ Error en Background Sync:", err);
      }
    }, 2000); // 2 second debounce
  });
};
