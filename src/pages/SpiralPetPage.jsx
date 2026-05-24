import { motion, AnimatePresence } from 'framer-motion';
import { SpiralMessage } from '../components/ui/SpiralMessage';
import { Button } from '../components/ui/Button';
import { Droplet, Cookie, Bath, Gamepad2 } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';

// --- ZUSTAND STORE ---
import { useGameStore } from '../store/useGameStore';

// --- DATA ---
import { spiralCatalog } from '../data/spiralCatalog';

const PET_NEEDS_CONFIG = [
  { id: 'water', restoresLabel: 'Sed', icon: Droplet, color: "text-blue-300", bg: "bg-blue-300" },
  { id: 'food', restoresLabel: 'Hambre', icon: Cookie, color: "text-amber-200", bg: "bg-amber-200" },
  { id: 'clean', restoresLabel: 'Higiene', icon: Bath, color: "text-teal-200", bg: "bg-teal-200" },
  { id: 'play', restoresLabel: 'Juego', icon: Gamepad2, color: "text-primary", bg: "bg-primary" },
];

export function SpiralPetPage() {
  // --- ZUSTAND STORE ---
  const globalNeeds = useGameStore(state => state.needs);
  const inventory = useGameStore(state => state.petInventory);
  const usePetItem = useGameStore(state => state.usePetItem);
  const ephemeralMessage = useGameStore(state => state.ephemeralMessage);
  const pendingReward = useGameStore(state => state.pendingReward);
  const totalIdleStars = useGameStore(state => state.totalIdleStars);
  const setEphemeralMessage = useGameStore(state => state.setEphemeralMessage);
  const clearEphemeralMessage = useGameStore(state => state.clearEphemeralMessage);
  const clearPendingReward = useGameStore(state => state.clearPendingReward);
  const checkNeedsDegradation = useGameStore(state => state.checkNeedsDegradation);
  const handleGlobalAction = useGameStore(state => state.handleGlobalAction);
  const updateStars = useGameStore(state => state.updateStars);
  const complaintThresholds = useGameStore(state => state.complaintThresholds);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const [transitionVideo, setTransitionVideo] = useState(null);

  // 2. REVISAR DEGRADACIÓN: Se ejecuta al entrar y cuando cambian las necesidades
  useEffect(() => {
    checkNeedsDegradation();
    setEphemeralMessage(null); // Limpieza de efímeros al entrar
  }, [checkNeedsDegradation, globalNeeds, setEphemeralMessage]);

  // --- LÓGICA DEL ESTADO DERIVADO (Fondo de Spiral) ---
  // Calcular el ID del ambiente basado en las necesidades
  const ambientId = useMemo(() => {
    if (globalNeeds.water <= complaintThresholds.water) return "SPIRAL_SED";
    if (globalNeeds.food <= complaintThresholds.food) return "SPIRAL_HAMBRE";
    if (globalNeeds.clean <= complaintThresholds.clean) return "SPIRAL_SUCIO";
    if (globalNeeds.play <= complaintThresholds.play) return "SPIRAL_JUGAR";
    return "SPIRAL_FELIZ";
  }, [globalNeeds, complaintThresholds]);

  // El fondo derivado ahora tiene 3 capas de prioridad locales
  const [onDemandBg, setOnDemandBg] = useState(null); // Ej: "Confirmar Agua"

  // Limpiamos onDemandBg si se monta/desmonta (al salir de la página)
  useEffect(() => {
    return () => setOnDemandBg(null);
  }, []);

  const backgroundSpiral = useMemo(() => {
    // Prioridad 1 Local: Mensaje de confirmación on-demand (Botones)
    if (onDemandBg) {
      const entry = spiralCatalog[onDemandBg.id];
      if (entry) {
        let text = Array.isArray(entry.text) ? entry.text[Math.floor(Math.random() * entry.text.length)] : entry.text;
        // Inject itemName or itemId context if passed
        text = text.replace('{{itemName}}', onDemandBg.extraData?.itemName || "");

        // Reemplazar también en los botones (ej. para CONFIRM_WATER -> USE_PET_ITEM -> agua)
        const actionConfig = entry.actionConfig?.map(ac => ({
          ...ac,
          data: typeof ac.data === 'string' && ac.data.includes('{{itemId}}')
            ? ac.data.replace('{{itemId}}', onDemandBg.extraData?.itemId || "")
            : ac.data
        })) || [];

        return { ...entry, id: onDemandBg.id, text, actionConfig };
      }
    }

    // Prioridad 2: Recompensa pendiente (Si salimos sin cobrar, nos espera)
    if (pendingReward) {
      const entry = spiralCatalog[pendingReward.type];
      if (entry) {
        let text = Array.isArray(entry.text) ? entry.text[Math.floor(Math.random() * entry.text.length)] : entry.text;
        text = text.replace('{{stars}}', pendingReward.stars);
        // Resolver configuración de botones con la cantidad de estrellas
        const actionConfig = entry.actionConfig?.map(ac => ({
          ...ac,
          data: typeof ac.data === 'string' ? ac.data.replace('{{stars}}', pendingReward.stars) : ac.data
        })) || [];
        return { ...entry, id: pendingReward.type, text, actionConfig };
      }
    }

    // Prioridad 3: Estrellas Idle acumuladas
    if (totalIdleStars > 0) {
      const entry = spiralCatalog["IDLE_REWARDS"];
      if (entry) {
        let text = Array.isArray(entry.text) ? entry.text[Math.floor(Math.random() * entry.text.length)] : entry.text;
        text = text.replace('{{stars}}', totalIdleStars);
        // Resolver configuración de botones con la cantidad de estrellas
        const actionConfig = entry.actionConfig?.map(ac => ({
          ...ac,
          data: typeof ac.data === 'string' ? ac.data.replace('{{stars}}', totalIdleStars) : ac.data
        })) || [];
        return { ...entry, id: "IDLE_REWARDS", text, actionConfig };
      }
    }

    // Prioridad 4: Necesidades de Spiral (Fondo Normal Ambiental)
    const entry = spiralCatalog[ambientId];
    if (entry) {
      let text = Array.isArray(entry.text) ? entry.text[Math.floor(Math.random() * entry.text.length)] : entry.text;
      text = text.replace(/\{\{userName\}\}/g, useGameStore.getState().userName || "Amelia");
      return { ...entry, id: ambientId, text };
    }

    return null;
  }, [onDemandBg, pendingReward, ambientId, totalIdleStars]);

  const activeMessage = isTransitioning 
    ? { text: transitionText, video: transitionVideo, actionConfig: [] } 
    : (ephemeralMessage || backgroundSpiral);

  // Mapeamos el estado global a la configuración visual
  const petNeeds = PET_NEEDS_CONFIG.map(config => ({
    ...config,
    value: globalNeeds[config.id] ?? 100 // Fallback
  }));

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [recentlyUsedItemId, setRecentlyUsedItemId] = useState(null);
  const [glowingNeedId, setGlowingNeedId] = useState(null);

  // --- SINCRONIZACIÓN DE MENSAJE Y SELECCIÓN ---
  useEffect(() => {
    // Si el mensaje efímero o el onDemand desaparecen, deseleccionamos el ítem
    if (!ephemeralMessage && !onDemandBg) {
      setSelectedItemId(null);
    }
  }, [ephemeralMessage, onDemandBg]);

  // --- LÓGICA DE INTERACCIÓN REACTIVA ---
  const handleItemSelect = (item) => {
    // 1. Marcar el ítem visualmente
    setSelectedItemId(item.id);

    // 2. Si no hay stock, ir a la tienda (Efímero)
    if (item.quantity === 0) {
      setEphemeralMessage("GO_TO_STORE_NO_ITEM", { itemId: item.id });
      return;
    }

    // 3. Obtener el estado actual de la necesidad y su umbral
    const targetNeedId = item.targetsNeed;
    const currentNeed = petNeeds.find(n => n.id === targetNeedId);
    const threshold = complaintThresholds[targetNeedId] || 100;

    // 4. Determinar si Spiral acepta o rechaza
    if (currentNeed && currentNeed.value > threshold) {
      // RECHAZO: Spiral está satisfecho (Este SÍ es efímero, tapa al fondo 4s)
      let refusalId = "SPIRAL_FELIZ";
      if (targetNeedId === 'water') refusalId = "NO_NEED_WATER";
      else if (targetNeedId === 'food') refusalId = "NO_NEED_FOOD";
      else if (targetNeedId === 'clean') refusalId = "NO_NEED_WASH";
      else if (targetNeedId === 'play') refusalId = "NO_NEED_PLAY";

      setEphemeralMessage(refusalId, { itemName: item.name });
    } else {
      // CONFIRMACIÓN: Spiral quiere el ítem (Este ES FONDO TEMPORAL, espera interacción)
      let confirmId = "SPIRAL_FELIZ";
      if (targetNeedId === 'water') confirmId = "CONFIRM_WATER";
      else if (targetNeedId === 'food') confirmId = "CONFIRM_FOOD";
      else if (targetNeedId === 'clean') confirmId = "CONFIRM_WASH";
      else if (targetNeedId === 'play') confirmId = "CONFIRM_PLAY";

      // Borramos posibles efímeros previos y ponemos el fondo en espera
      useGameStore.getState().clearEphemeralMessage();
      setOnDemandBg({ id: confirmId, extraData: { itemId: item.id } });
    }
  };

  const [activeStars, setActiveStars] = useState([]); // [{ id, x, y, amount }]

  const handleActionClick = (e, action) => {
    if (action.type === 'UPDATE_STARS' || action.type === 'CLAIM_IDLE_STARS') {
      const startX = e?.clientX || window.innerWidth / 2;
      const startY = e?.clientY || window.innerHeight / 2;

      let amount = 5;
      if (action.type === 'CLAIM_IDLE_STARS') {
        amount = useGameStore.getState().totalIdleStars || 0;
      } else {
        amount = parseInt(String(action.data).replace(/[^0-9]/g, '')) || 5;
      }

      // 2. Crear la estrella en el aire
      const starId = Date.now();
      setActiveStars(prev => [...prev, { id: starId, x: startX, y: startY, amount }]);

      // 3. Programar la suma real de estrellas tras el vuelo (800ms aprox)
      setTimeout(() => {
        if (action.type === 'CLAIM_IDLE_STARS') {
          handleGlobalAction(action);
        } else {
          updateStars(amount);
          clearPendingReward(); // ¡COBRADO! Ya no hay pendiente
        }
        setActiveStars(prev => prev.filter(s => s.id !== starId));
      }, 800);

    } else if (action.type === 'USE_PET_ITEM') {
      const itemId = action.data;
      const item = inventory.find(i => i.id === itemId);

      // Efectos visuales
      setRecentlyUsedItemId(itemId);
      setTimeout(() => setRecentlyUsedItemId(null), 300);
      setGlowingNeedId(item.targetsNeed);
      setTimeout(() => setGlowingNeedId(null), 1500);
      setSelectedItemId(null);

      // Borramos el fondo on-demand para que el "Gracias" pueda emerger
      setOnDemandBg(null);

      // Acción Real (Esto creará el pendingReward invisiblemente)
      usePetItem(itemId);
    } else if (action.type === 'NAVIGATE_STORE' || action.type === 'NAVIGATE_EDIT_NAMES') {
      setTransitionText(activeMessage?.text || "");
      setTransitionVideo(activeMessage?.video || null);
      setIsTransitioning(true);
      setSelectedItemId(null);
      handleGlobalAction(action);
    } else if (action.type === 'CANCEL') {
      setSelectedItemId(null);
      setOnDemandBg(null);
      clearEphemeralMessage();
    }
  };

  // Componente interno para la estrella que vuela
  const TravelingStar = ({ star }) => (
    <motion.div
      initial={{ left: star.x, top: star.y, opacity: 1, scale: 1 }}
      animate={{
        left: window.innerWidth - 60, // Hacia el contador de estrellas
        top: 30,
        opacity: [1, 1, 0.5, 0],
        scale: [1, 1.5, 0.8]
      }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      className="fixed z-[9999] pointer-events-none text-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
      style={{ position: 'fixed' }}
    >
      ⭐
    </motion.div>
  );

  // --- RENDER ZERO-SCROLL INMERSIVO (Variante 2) ---
  return (
    <div className="h-[calc(100dvh-10rem)] pt-3 px-4 flex flex-col items-center w-full overflow-hidden relative">

      {/* Estrellas viajeras (Capa superior) */}
      <AnimatePresence>
        {activeStars.map(star => (
          <TravelingStar key={star.id} star={star} />
        ))}
      </AnimatePresence>

      {/* Glow de fondo global (centrado para evitar cortes en los bordes) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,184,255,0.06),transparent_60%)] pointer-events-none" />

      {/* 1. VISOR MAGICO (Arte en la parte superior) */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex-none w-full flex items-center justify-center relative z-10"
      >
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-primary blur-[70px] absolute mix-blend-screen pointer-events-none"
          />
          <div className="w-[280px] h-[280px] rounded-full bg-surface-container-highest shadow-[0_12px_40px_rgba(220,184,255,0.25)] flex items-center justify-center relative overflow-hidden backdrop-blur-md border border-white/10">
            {activeMessage?.video ? (
              <video
                key={activeMessage?.video}
                src={activeMessage?.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-on-surface-variant/40 font-display text-xs tracking-widest uppercase relative z-10">Arte Spiral</span>
            )}
          </div>
        </div>
      </motion.div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-start text-center w-full min-h-[8rem] pointer-events-none mt-1.5">
        <h2 className="text-xl sm:text-2xl text-primary-fixed mb-2 drop-shadow-[0_0_24px_rgba(220,184,255,0.3)] italic font-display tracking-tight leading-none">Spiral</h2>

        <div className="flex flex-col items-center justify-center gap-1 pointer-events-auto w-full">
          <SpiralMessage
            variant="bubble-only"
            tailPosition="top-center"
            isOverlayMode={true}
            message={activeMessage?.text}
            actionConfig={[...(activeMessage?.actionConfig || [])].sort((a, b) => {
              if (a.variant === 'highlighted') return 1;
              if (b.variant === 'highlighted') return -1;
              return 0;
            })}
            onAction={(action) => handleActionClick(null, action)}
            delay={0}
          />
        </div>
      </div>
      {/* CONTENEDOR INFERIOR (Monitor + Dock) */}
      <div className="w-full flex-none flex flex-col items-center mt-auto pb-2 relative z-30">



        {/* 4. DOCK MÁGICO DE ÍTEMS (Flotando abajo) */}
        <div className="w-full max-w-[340px]">
          <div className="grid grid-cols-4 gap-3 bg-surface-container-low/50 backdrop-blur-xl border border-white/5 p-3 rounded-[1.75rem] shadow-[0_-12px_40px_rgba(0,0,0,0.4)]">
            {inventory.map(item => {
              const isSelected = selectedItemId === item.id;
              const isPopping = recentlyUsedItemId === item.id;
              const isGlowingNeedAction = glowingNeedId === item.targetsNeed;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className="flex flex-col items-center justify-center gap-2 transition-all relative overflow-visible group"
                >
                  {/* Efecto Glow cuando se alimenta a Spiral con este item */}
                  <AnimatePresence>
                    {isGlowingNeedAction && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.8, 2.5] }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-primary/40 rounded-full blur-xl pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      scale: isSelected ? 1.15 : 1,
                      y: isSelected ? -4 : 0
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`relative w-11 h-11 rounded-full flex items-center justify-center text-2xl mb-1 border transition-colors duration-500 ${isSelected ? 'bg-primary/20 border-primary/40 shadow-[0_15px_35px_rgba(220,184,255,0.4)]' : 'bg-surface-container-high border-white/5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:bg-surface-container-highest'}`}
                  >
                    <span className={`filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isSelected || isGlowingNeedAction ? 'scale-110' : ''}`}>{item.icon}</span>

                    {/* Badge Animado de Cantidad */}
                    <motion.span
                      animate={isPopping ? { scale: [1, 2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`inventory-badge ${Number(item.quantity) === 0 ? 'is-empty' : ''}`}
                    >
                      {item.quantity}
                    </motion.span>
                  </motion.div>


                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
