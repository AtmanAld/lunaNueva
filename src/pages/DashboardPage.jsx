import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { SpiralMessage } from '../components/ui/SpiralMessage';
import { PageDepthWrapper, ActionModalOverlay } from '../components/ui/InteractiveModalSystem';
import { Check, X, ArrowLeft, Store, ChevronRight, Star } from 'lucide-react';

const ICON_MAP = {
  check: Check,
  cancel: X,
  back: ArrowLeft,
  store: Store,
  next: ChevronRight,
  star: Star
};

// --- ZUSTAND STORE ---
import { useGameStore } from '../store/useGameStore';
import { selectActiveMessage } from '../store/slices/createMessageSlice';
import { spiralCatalog } from '../data/spiralCatalog';
import { activityCatalog } from '../data/activityCatalog';
import { getLocalDateString, isChronologicallyNewDay } from '../utils/dateUtils';

// --- AUXILIARY COMPONENT FOR THE MATHEMATICAL MOON PLACEHOLDER (PREPARED FOR VIDEO WRAPPER) ---
function DynamicMoon({ progress, phaseName, celebrationActive, onAnimationStateChange }) {
  const videoRef = useRef(null);
  const lastPhaseRef = useRef(phaseName);
  const lastProgressRef = useRef(progress);
  const celebrationActiveRef = useRef(celebrationActive);

  const phaseTimes = {
    "Luna Nueva": 0.0,
    "Luna Creciente": 1.75,
    "Cuarto Creciente": 3.43,
    "Gibosa Creciente": 5.18,
    "Luna Llena": 7.0
  };

  const phaseImages = {
    "Luna Nueva": "/lunaNueva.png",
    "Luna Creciente": "/lunaCreciente.png",
    "Cuarto Creciente": "/cuartoCreciente.png",
    "Gibosa Creciente": "/crecienteGibosa.png",
    "Luna Llena": "/lunaLlena.png"
  };

  const targetTime = phaseTimes[phaseName] ?? 0.0;

  // Guardamos la fase real que muestra la imagen de fondo estática
  const [displayedPhase, setDisplayedPhase] = useState(phaseName);
  const [showVideo, setShowVideo] = useState(false);

  const currentImage = phaseImages[displayedPhase] ?? "/lunaNueva.png";

  useEffect(() => {
    celebrationActiveRef.current = celebrationActive;
  }, [celebrationActive]);

  useEffect(() => {
    lastProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    // Si la celebración estaba activa y termina (pasa de true a false),
    // y el video está en pantalla (showVideo === true), es momento de ocultarlo y mostrar la estática
    if (!celebrationActive && showVideo) {
      setDisplayedPhase(phaseName);
      setShowVideo(false);
    }
  }, [celebrationActive, showVideo, phaseName]);

  useEffect(() => {
    // Si la fase es idéntica a la anterior (carga inicial o navegación),
    // nos aseguramos de sincronizar la imagen estática al instante sin usar el video.
    if (lastPhaseRef.current === phaseName) {
      setDisplayedPhase(phaseName);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      setDisplayedPhase(phaseName);
      lastPhaseRef.current = phaseName;
      return;
    }

    const prevTime = phaseTimes[lastPhaseRef.current] ?? 0.0;

    // Si la fase cambió a una posterior (avanzó), reproducir la animación suavemente
    if (targetTime > prevTime) {
      let animationFrameId;

      // El fondo se queda mostrando la fase anterior (displayedPhase NO cambia aún)
      setShowVideo(true);
      video.currentTime = prevTime;

      if (onAnimationStateChange) onAnimationStateChange(true);

      const checkTime = () => {
        if (video.currentTime >= targetTime) {
          video.pause();
          video.currentTime = targetTime;

          // Si no hay una celebración activa, actualizamos la imagen de fondo y ocultamos el video.
          // Si la hay, lo dejamos visible y se ocultará cuando celebrationActive pase a false.
          if (!celebrationActiveRef.current) {
            setDisplayedPhase(phaseName);
            setShowVideo(false);
          }

          if (onAnimationStateChange) onAnimationStateChange(false);
        } else {
          animationFrameId = requestAnimationFrame(checkTime);
        }
      };

      video.play().catch(() => {
        video.currentTime = targetTime;
        setDisplayedPhase(phaseName);
        setShowVideo(false);
        if (onAnimationStateChange) onAnimationStateChange(false);
      });
      animationFrameId = requestAnimationFrame(checkTime);

      lastPhaseRef.current = phaseName;

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      // Si la fase retrocedió, cambiamos instantáneamente la imagen de fondo sin animación
      video.pause();
      video.currentTime = targetTime;
      setShowVideo(false);
      setDisplayedPhase(phaseName);
      lastPhaseRef.current = phaseName;
    }
  }, [phaseName, onAnimationStateChange]);

  return (
    <div className="w-full h-full bg-[#151219]/30 backdrop-blur-[4px] rounded-full select-none relative overflow-hidden flex items-center justify-center">
      {/* Imagen Estática de Fondo (Sigue mostrando la fase anterior durante la transición) */}
      <img
        src={currentImage}
        alt={displayedPhase}
        className="absolute inset-0 w-full h-full object-cover rounded-full transition-transform duration-300"
        style={{ transform: 'scale(1.55)' }}
      />

      {/* Video de Transición Sobrepuesto (Solo se activa al cambiar de fase) */}
      <video
        ref={videoRef}
        src="/moonVideo.mp4"
        className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-150 ${showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{ transform: 'scale(1.55)' }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}

export function DashboardPage() {
  const globalActivities = useGameStore(state => state.activities);
  const globalMoonPhase = useGameStore(state => state.moonPhase);
  const lastResetDate = useGameStore(state => state.lastResetDate);
  const hasMoonBeenRenewedToday = useGameStore(state => state.hasMoonBeenRenewedToday);
  const isDayTransitioning = useGameStore(state => state.isDayTransitioning);
  const toggleActivity = useGameStore(state => state.toggleActivity);
  const enqueueMessage = useGameStore(state => state.enqueueMessage);
  const dequeueMessage = useGameStore(state => state.dequeueMessage);
  const setScopedEphemeralMessage = useGameStore(state => state.setScopedEphemeralMessage);
  const storeHandleGlobalAction = useGameStore(state => state.handleGlobalAction);
  const verifyGameState = useGameStore(state => state.verifyGameState);
  const pendingPhaseReward = useGameStore(state => state.pendingPhaseReward);
  const clearPendingPhaseReward = useGameStore(state => state.clearPendingPhaseReward);
  const pendingPlacementCard = useGameStore(state => state.pendingPlacementCard);
  const updateStars = useGameStore(state => state.updateStars);
  const useMoonDust = useGameStore(state => state.useMoonDust);
  const polvoLunarCount = useGameStore(state => state.albumItems?.polvo_lunar || 0);

  const [isAnimatingReward, setIsAnimatingReward] = useState(false);
  const [activeStarParticles, setActiveStarParticles] = useState([]);
  const [isMoonVideoPlaying, setIsMoonVideoPlaying] = useState(false);

  // --- LÓGICA DE RENOVACIÓN DE LUNA (CELEBRACIÓN Y CARTA) ---
  // Recuperar estado persistido en Zustand en el montaje para que si recargan la app en esta pantalla se mantenga exactamente igual
  const isPersistedCelebration = useGameStore(state => state.isMoonCelebrationActive);

  const [isRenewingMoon, setIsRenewingMoon] = useState(!!isPersistedCelebration);
  const [renewalVideoActive, setRenewalVideoActive] = useState(false);
  const [showRenewalCard, setShowRenewalCard] = useState(!!isPersistedCelebration);
  const [showRenewalMessage, setShowRenewalMessage] = useState(!!isPersistedCelebration);

  const handleGlobalAction = (action) => {
    if (action.type === 'CLAIM_MOON_REWARD') {
      // 1. Ejecutar la acción del store inmediatamente para que resbale a Luna Nueva y limpie DASHBOARD_FULL_MOON
      storeHandleGlobalAction(action);

      // 2. Bloquear la UI globalmente en el store
      useGameStore.setState({ isMoonCelebrationActive: true });

      // 3. Disparar celebración local
      setIsRenewingMoon(true);
      setRenewalVideoActive(true);
      setShowRenewalCard(true);
      setShowRenewalMessage(false);
    } else if (action.type === 'GO_TO_ALBUM') {
      // 4. Limpiar mensaje/celebración e ir al álbum
      useGameStore.setState({ isMoonCelebrationActive: false });
      setIsRenewingMoon(false);
      setRenewalVideoActive(false);
      setShowRenewalCard(false);
      setShowRenewalMessage(false);
      useGameStore.setState({ pendingNavigation: '/album' });
    } else if (action.type === 'RENEW_MOON_LATER') {
      // 5. Limpiar mensaje/celebración y volver al estado normal
      useGameStore.setState({ isMoonCelebrationActive: false });
      setIsRenewingMoon(false);
      setRenewalVideoActive(false);
      setShowRenewalCard(false);
      setShowRenewalMessage(false);
    } else {
      storeHandleGlobalAction(action);
    }
  };

  const handleRenewalVideoEnded = () => {
    setRenewalVideoActive(false);
    setShowRenewalMessage(true);
  };

  // Generamos partículas de polvo de luna mágicas flotando hacia abajo (Optimizado a 18 partículas para máximo rendimiento)
  const renewalParticles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2.5,
      duration: 2.0 + Math.random() * 1.5,
      size: 3 + Math.random() * 5,
      x: (Math.random() - 0.5) * 200,
      y: 180 + Math.random() * 240,
      color: i % 2 === 0 ? '#DCB8FF' : '#FFD700'
    }));
  }, []);

  const isFullMoonLocked = globalMoonPhase.name === "Luna Llena" && !pendingPhaseReward;
  const isHidingUI = isAnimatingReward || isMoonVideoPlaying || isRenewingMoon || isFullMoonLocked;

  useEffect(() => {
    if (pendingPhaseReward && !isAnimatingReward) {
      setIsAnimatingReward(true);
      const totalStars = pendingPhaseReward.stars;
      const phase = pendingPhaseReward.phase;

      // 1. Mostrar mensaje de Spiral INMEDIATAMENTE
      const phaseToId = {
        "LUNA_CRECIENTE": "REWARD_LUNA_CRECIENTE",
        "LUNA_CUARTO_CRECIENTE": "REWARD_LUNA_CUARTO_CRECIENTE",
        "LUNA_GIBOSA_CRECIENTE": "REWARD_LUNA_GIBOSA_CRECIENTE"
      };
      const msgId = phaseToId[phase];
      if (msgId) {
        setScopedEphemeralMessage('dash_phase_reward', msgId, { stars: totalStars }, 'dashboard');
      }

      // 2. Esperar 4 segundos (mientras el mensaje es efímero) y luego lanzar estrellas
      setTimeout(() => {
        const starCount = Math.floor(totalStars / 5);
        const particles = Array.from({ length: starCount }).map((_, i) => ({
          id: i,
          delay: i * 0.3,
          x: (Math.random() - 0.5) * 160,
          y: -180 - Math.random() * 120
        }));
        setActiveStarParticles(particles);

        // Programamos los incrementos de +5 sincronizados con el vuelo
        particles.forEach((star) => {
          setTimeout(() => {
            updateStars(5);
            // Hacer que la luna brille con cada impacto
            setIsElementPulsing(true);
            if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
            pulseTimeout.current = setTimeout(() => setIsElementPulsing(false), 1500);
          }, (star.delay * 1000) + 1400);
        });

        // Cleanup final después de que terminen de volar las estrellas
        const animationDuration = (starCount * 300) + 1600;
        setTimeout(() => {
          setIsAnimatingReward(false);
          setActiveStarParticles([]);
          clearPendingPhaseReward();
        }, animationDuration);

      }, 4000); // El retraso de 4 segundos solicitado
    }
  }, [pendingPhaseReward, isAnimatingReward, updateStars, clearPendingPhaseReward, setScopedEphemeralMessage]);

  // 2. Verificar estado del juego (Nuevo día, etc.) al montar
  useEffect(() => {
    verifyGameState();
  }, [verifyGameState]);

  // --- LÓGICA DEL ESTADO DERIVADO (Fondo del Dashboard) ---
  const isReviewDay = useGameStore(state => state.isReviewDay);
  
  // Calcular en tiempo real (instantáneo) si es un nuevo día cronológico para evitar desfasajes en el primer render (montaje)
  const today = getLocalDateString();
  const isNewDay = useMemo(() => {
    return isChronologicallyNewDay(lastResetDate, today);
  }, [lastResetDate, today]);

  // ORQUESTACIÓN DE MENSAJES (NUEVO ENGINE)
  // 1. Fondo Día de Revisión (Prioridad 1)
  useEffect(() => {
    if (isReviewDay) {
      enqueueMessage('dash_ambient', 'REVIEW_DAY_WAITING', {}, 'dashboard');
    } else {
      dequeueMessage('dash_ambient');
    }
  }, [isReviewDay, enqueueMessage, dequeueMessage]);

  // 2. Modales Bloqueantes (Prioridad 5 y 4)
  useEffect(() => {
    if (isNewDay && !isDayTransitioning && !isReviewDay) {
      enqueueMessage('dash_new_day', 'NEW_DAY_PROMPT', {}, 'dashboard');
    } else {
      dequeueMessage('dash_new_day');
    }
  }, [isNewDay, isDayTransitioning, isReviewDay, enqueueMessage, dequeueMessage]);

  useEffect(() => {
    if (isFullMoonLocked && !isPersistedCelebration) {
      enqueueMessage('dash_full_moon', 'DASHBOARD_FULL_MOON', {}, 'dashboard');
    } else {
      dequeueMessage('dash_full_moon');
    }
  }, [isFullMoonLocked, isPersistedCelebration, enqueueMessage, dequeueMessage]);

  useEffect(() => {
    if (showRenewalMessage) {
      enqueueMessage('dash_renewal', 'RENEW_MOON_PROMPT', {}, 'dashboard');
    } else {
      dequeueMessage('dash_renewal');
    }
  }, [showRenewalMessage, enqueueMessage, dequeueMessage]);

  useEffect(() => {
    // Caso C/D: Tienes carta en mano y no hay celebración activa tapando
    if (pendingPlacementCard && !showRenewalMessage && !isRenewingMoon) {
      enqueueMessage('dash_pending_card', 'PENDING_CARD_PROMPT', {}, 'dashboard');
    } else {
      dequeueMessage('dash_pending_card');
    }
  }, [pendingPlacementCard, showRenewalMessage, isRenewingMoon, enqueueMessage, dequeueMessage]);

  // 3. Efímero de Cambio de Fase Normal
  useEffect(() => {
    if (!isReviewDay && !isNewDay && !isDayTransitioning) {
      const phaseToId = {
        "Luna Nueva": "LUNA_NUEVA",
        "Luna Creciente": "LUNA_CRECIENTE",
        "Cuarto Creciente": "LUNA_CUARTO_CRECIENTE",
        "Gibosa Creciente": "LUNA_GIBOSA_CRECIENTE"
      };
      const msgId = phaseToId[globalMoonPhase.name];
      if (msgId) {
        setScopedEphemeralMessage('dash_phase_change', msgId, {}, 'dashboard');
      }
    }
  }, [isReviewDay, isNewDay, isDayTransitioning, globalMoonPhase.name, setScopedEphemeralMessage]);

  // Mensaje final: El Selector Puro
  const activeMessage = useGameStore(state => selectActiveMessage(state, 'dashboard'));

  // Regla de pluralización (Blueprint)
  const getPluralizedText = (count, unit) => {
    if (count === 1) return unit;
    if (unit.endsWith('z')) return unit.slice(0, -1) + 'ces';
    return unit + 's';
  };

  // Mapeamos el estado global a la configuración visual que espera el componente
  const mappedActivities = globalActivities.filter(a => a.isActive).map(act => {
    const catalogInfo = activityCatalog.find(ac => ac.activityID === act.activityID);
    if (!catalogInfo) return null;

    const type = catalogInfo.maxCompletions > 1 ? 'multiple' : 'single';

    // Si ya empezó, mostramos cuántas lleva. Si está en 0, mostramos su valor base.
    const displayCount = act.completions > 0 ? act.completions : catalogInfo.value;
    const durationText = `${displayCount} ${getPluralizedText(displayCount, catalogInfo.valueUnit)}`;

    return {
      id: act.activityID,
      title: catalogInfo.title,
      category: catalogInfo.category,
      duration: durationText,
      stars: catalogInfo.stars,
      type: type,
      completed: act.fullyCompleted,
      completions: act.completions,
      maxCompletions: catalogInfo.maxCompletions,
      usedForRitual: act.usedForRitual
    };
  }).filter(Boolean);

  const freeActivities = [
    ...(polvoLunarCount > 0 ? [{
      id: 'special_moon_dust',
      title: 'Consumir polvo lunar',
      category: 'Mágico',
      duration: `${polvoLunarCount}`,
      stars: 20,
      type: 'special',
      completed: false,
      completions: 0,
      maxCompletions: 1,
      usedForRitual: false
    }] : []),
    ...mappedActivities.filter(act => !act.usedForRitual)
  ];
  const usedActivities = mappedActivities.filter(act => act.usedForRitual);

  const elementPhase = {
    name: globalMoonPhase.name,
    message: activeMessage?.text || ""
  };

  const [isElementPulsing, setIsElementPulsing] = useState(false);
  const pulseTimeout = useRef(null);

  // --- LÓGICA DE INTERACCIÓN REACTIVA (TOGGLE) ---
  const completeActivity = (act) => {
    if (act.id === 'special_moon_dust') {
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      setIsElementPulsing(true);
      pulseTimeout.current = setTimeout(() => setIsElementPulsing(false), 1500);
      useMoonDust();
      return;
    }

    if (act.usedForRitual) return;
    let isCanceling = false;
    const actuales = act.completions || 0;

    if (act.type === 'single' && act.completed) {
      isCanceling = true;
    } else if (act.type === 'multiple' && actuales >= act.maxCompletions) {
      isCanceling = true;
    }

    // 1. Latido del Elemento (solo si avanza positivamente)
    if (!isCanceling) {
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      setIsElementPulsing(true);
      pulseTimeout.current = setTimeout(() => setIsElementPulsing(false), 1500);
    }

    // 2. Acción real en Zustand
    toggleActivity(act.id);
  };

  // ¿Debemos mostrar el modal? (DASHBOARD_FULL_MOON se quita para que salga con botones abajo pero sin bloquear)
  const modalMessageIds = ["NEW_DAY_PROMPT"];
  const isModalActive = modalMessageIds.includes(activeMessage?.id);

  return (
    <>
      {/* Asimetría Intencional Decorativa - Fondo (Fijo al viewport) */}
      <div className="fixed top-0 right-[-20%] w-[120%] h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-20" />

      <AnimatePresence>
        {isAnimatingReward && activeStarParticles.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            {activeStarParticles.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0, scale: 0, x: 0, y: 50 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.8],
                  x: [0, star.x, star.x * 1.5],
                  y: [50, star.y, star.y - 200]
                }}
                transition={{
                  duration: 1.5,
                  delay: star.delay,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeOut"
                }}
                className="absolute text-4xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]"
              >
                ⭐
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Partículas de Polvo de Luna Mágica en Renovación (Optimizadas con Animación CSS 3D Acelerada por GPU) */}
      <AnimatePresence>
        {isRenewingMoon && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            <style>{`
              @keyframes magicalLunarDust {
                0% {
                  transform: translate3d(0, 0, 0) scale(0.4);
                  opacity: 0;
                }
                15% {
                  opacity: 0.9;
                }
                85% {
                  opacity: 0.9;
                }
                100% {
                  transform: translate3d(var(--particle-x), var(--particle-y), 0) scale(0.3);
                  opacity: 0;
                }
              }
            `}</style>
            {renewalParticles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full will-change-transform"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                  left: '50%',
                  top: '25%',
                  '--particle-x': `${p.x}px`,
                  '--particle-y': `${p.y}px`,
                  animation: `magicalLunarDust ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
                  animationDelay: `${p.delay}s`
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <PageDepthWrapper
        isActive={isModalActive}
        className={`p-6 space-y-8 relative w-full transition-[padding] duration-500 ${activeMessage ? 'pb-56' : 'pb-32'}`}
      >
        {/* 1. Header Global Enmarcado */}
        <motion.div
          key={`header-${lastResetDate}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHidingUI ? 0 : 1,
            y: isHidingUI ? -20 : 0,
            scale: isHidingUI ? 0.95 : 1
          }}
          transition={{
            delay: isHidingUI ? 0 : (isDayTransitioning ? 7.5 : 0),
            duration: 0.6,
            ease: "easeInOut"
          }}
          className={`mb-8 mt-2 space-y-1 relative mix-blend-plus-lighter z-10 text-center ${isHidingUI ? 'pointer-events-none' : ''}`}
        >
          <h1 className="text-lg sm:text-xl font-display text-primary drop-shadow-[0_0_12px_rgba(220,184,255,0.4)] leading-tight tracking-wide">
            {globalMoonPhase.name}
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-secondary font-medium">
            {Math.round(globalMoonPhase.progressPoints)}%
          </p>
        </motion.div>

        {/* Arte Dinámico (Elemento) */}
        <div className="sticky top-28 w-full flex items-center justify-center pointer-events-none z-0 mb-10 -mt-4">
          <motion.div
            key={`moon-${lastResetDate}`}
            initial={{ opacity: 0, y: isDayTransitioning ? 150 : 20, scale: isDayTransitioning ? 0.9 : 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: isDayTransitioning ? 7.0 : 0.2, duration: isDayTransitioning ? 1.2 : 0.8, ease: "easeOut" }}
            className="w-full flex items-center justify-center flex-col"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-full flex items-center justify-center"
            >
              <motion.div
                animate={isElementPulsing ? { scale: [1, 1.4, 1], opacity: [0.2, 0.8, 0.2] } : { scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-56 h-56 bg-primary rounded-full blur-[80px]"
              />

              {/* Orbe Lunar Dinámico */}
              <div className="w-56 h-56 rounded-full shadow-[0_12px_50px_rgba(220,184,255,0.25)] flex items-center justify-center relative overflow-hidden pointer-events-auto">
                <DynamicMoon
                  progress={isRenewingMoon ? 0 : globalMoonPhase.progressPoints}
                  phaseName={isRenewingMoon ? "Luna Nueva" : globalMoonPhase.name}
                  celebrationActive={isAnimatingReward}
                  onAnimationStateChange={setIsMoonVideoPlaying}
                />

                {/* Video de Renovación sobrepuesto */}
                <AnimatePresence>
                  {renewalVideoActive && (
                    <motion.video
                      key="moon-renew-video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src="/moonRenew.mp4"
                      className="absolute inset-0 w-full h-full object-cover rounded-full z-30 pointer-events-none"
                      style={{ transform: 'scale(1.55)' }}
                      autoPlay
                      muted
                      playsInline
                      onEnded={handleRenewalVideoEnded}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Carta Mágica Revelada con Efecto Flip 3D */}
            <AnimatePresence>
              {showRenewalCard && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mt-4 z-20 pointer-events-auto"
                  style={{ perspective: 1000 }}
                >
                  <motion.div
                    animate={{ rotateY: renewalVideoActive ? 0 : 180 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-[8.2rem] h-[11.4rem]"
                  >
                    {/* CARA TRASERA: El enorme "?" */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 w-full h-full rounded-2xl border-2 border-primary/20 shadow-[0_15px_35px_rgba(220,184,255,0.2)] bg-gradient-to-br from-[#2a1b3d] to-[#151219] p-2 flex flex-col items-center justify-center"
                    >
                      <div className="w-full h-full rounded-xl border border-primary-fixed/10 flex flex-col items-center justify-center relative overflow-hidden bg-[#151219]/60">
                        {/* Brillos místicos en el fondo de la carta */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,184,255,0.15)_0%,transparent_70%)] animate-pulse" />

                        <span className="text-5xl font-display font-light text-primary-fixed drop-shadow-[0_0_15px_rgba(220,184,255,0.4)] select-none">
                          ?
                        </span>
                      </div>
                    </div>

                    {/* CARA FRONTAL: La carta revelada dinámicamente */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-primary-fixed/40 shadow-[0_15px_35px_rgba(220,184,255,0.4)] bg-[#151219]/80 backdrop-blur-md p-2 flex flex-col justify-between"
                    >
                      <div className="w-full h-[82%] rounded-xl overflow-hidden relative">
                        <img
                          src={pendingPlacementCard?.image || "/Album Mágico/1/laArana.jpg"}
                          alt={pendingPlacementCard?.title || "La Araña"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151219]/80 via-transparent to-transparent" />
                      </div>
                      <div className="text-center font-display text-[9px] tracking-[0.2em] text-primary-fixed uppercase py-1 select-none">
                        {pendingPlacementCard?.title || "La Araña"}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Lista Animada */}
        <motion.div
          animate={{
            opacity: isHidingUI ? 0 : 1,
            y: isHidingUI ? 40 : 0
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
          className={`space-y-6 relative z-10 ${isHidingUI ? 'pointer-events-none' : ''}`}
        >
          {freeActivities.map((act, i) => {
            const isSpecial = act.type === 'special';
            const fillOpacityLevel = !isSpecial && (act.completed || (act.type === 'multiple' && act.completions >= 1)) ? 10 : 0;
            const showCheckmark = !isSpecial && (act.completed || (act.type === 'multiple' && act.completions >= 1));
            const cardDelay = (isDayTransitioning ? 7.6 : 0.4) + i * 0.15;

            return (
              <GlassCard
                key={`${act.id}-${lastResetDate}`}
                elevation={act.completed ? "lowest" : "low"}
                delay={cardDelay}
                className={`p-5 flex items-center justify-between group cursor-pointer transition-colors duration-500 relative border !bg-surface-container/20 backdrop-blur-lg ${act.completed ? 'border-primary/20 opacity-80' : 'border-transparent hover:!bg-surface-container/40'}`}
                onClick={() => completeActivity(act)}
              >
                <div
                  className="absolute inset-0 rounded-3xl transition-all duration-700 origin-left"
                  style={{
                    backgroundColor: `rgba(220, 184, 255, ${fillOpacityLevel / 100})`,
                    transform: fillOpacityLevel > 0 ? 'scaleX(1)' : 'scaleX(0)'
                  }}
                />

                <div className="relative z-10 flex items-center gap-4 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${showCheckmark || isSpecial ? 'bg-gradient-to-br from-primary-fixed to-primary shadow-[0_0_15px_rgba(220,184,255,0.4)] border-transparent' : 'bg-transparent border-[1.5px] border-outline-variant/50 group-hover:border-primary/50'}`}>
                    {showCheckmark ? (
                      <svg className="w-5 h-5 text-on-primary-fixed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isSpecial ? (
                      <span className="text-sm">✨</span>
                    ) : null}
                  </div>

                  <div className="flex flex-col mt-0.5">
                    <h4 className={`transition-colors text-[0.95rem] leading-snug mb-0.5 ${act.completed ? 'text-on-surface-variant line-through' : 'text-on-surface group-hover:text-primary'}`}>
                      {act.title}
                    </h4>
                    <p className={`uppercase tracking-widest text-[0.62rem] font-medium transition-colors flex items-center gap-1.5 ${showCheckmark || isSpecial ? 'text-primary' : 'text-tertiary'}`}>
                      <span>{act.category}</span>
                      <span className="text-[10px] opacity-40">&bull;</span>
                      <span>{act.duration}</span>
                    </p>
                  </div>
                </div>

                <div className={`relative z-10 flex items-center justify-center font-bold transition-all duration-300 ${act.completed ? 'opacity-40 grayscale' : 'text-primary-fixed-dim'}`}>
                  <span className="flex items-center gap-1 text-[12px] leading-none">
                    {isSpecial ? (
                      <>
                        <span className="leading-none">+20</span>
                        <span className="text-[14px] leading-none -translate-y-[1.5px] select-none">🌙</span>
                      </>
                    ) : (
                      <>
                        <span className="leading-none">
                          {act.type === 'multiple' && act.completions > 0 ? act.stars * act.completions : act.stars}
                        </span>
                        <span className="text-[14px] leading-none -translate-y-[1.5px] select-none">⭐</span>
                      </>
                    )}
                  </span>
                </div>
              </GlassCard>
            );
          })}

          {usedActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 mb-4"
            >
              <h3 className="text-[1.1rem] font-display font-medium text-primary drop-shadow-[0_0_10px_rgba(220,184,255,0.2)]">
                Actividades usadas
              </h3>
              <p className="text-[0.78rem] text-on-surface-variant/80 mt-1 leading-relaxed">
                Estas actividades fueron usadas para el ritual de luna llena, se restablecerán mañana, por ahora, no puedes usarlas más.
              </p>
            </motion.div>
          )}

          {usedActivities.map((act, i) => {
            const cardDelay = 0.3 + i * 0.1;
            return (
              <GlassCard
                key={`used-${act.id}-${lastResetDate}`}
                elevation="lowest"
                delay={cardDelay}
                className="py-3 px-5 flex items-center justify-between pointer-events-none border border-primary/20 opacity-80 !bg-surface-container/20 backdrop-blur-lg rounded-3xl"
              >
                <div className="relative z-10 flex items-center gap-4 flex-1">
                  {/* Círculo que semeja Luna Llena (sin palomita, lila/blanco brillante) */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-fixed-dim via-primary-fixed to-[#ffffff] shadow-[0_0_12px_rgba(220,184,255,0.6)] border-transparent shrink-0" />
                  
                  {/* Nombre de la actividad en gris sin tachar */}
                  <span className="text-[0.95rem] text-on-surface-variant font-medium">
                    {act.title}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      </PageDepthWrapper>

      {/* Mensaje de Spiral (Solo se muestra aquí si NO es un modal, libre del wrapper) */}
      <AnimatePresence>
        {!isModalActive && activeMessage && !isMoonVideoPlaying && !renewalVideoActive && (
          <SpiralMessage
            key={`spiral-${lastResetDate}-${activeMessage.id || activeMessage.text}`}
            message={activeMessage.text}
            actionConfig={activeMessage.actionConfig || []}
            onAction={handleGlobalAction}
            video={activeMessage.video}
            bgImage="/bgSpiralBubble.png"
            delay={isDayTransitioning ? 8.0 : 0.6}
            disabled={isAnimatingReward}
            className={isRenewingMoon ? "!bottom-8" : ""}
          />
        )}
      </AnimatePresence>

      {/* Capa de modales Interactivos */}
      <ActionModalOverlay isActive={isModalActive}>
        <SpiralMessage
          message={activeMessage?.text || ""}
          isOverlayMode={true}
          delay={0}
          video={activeMessage?.video}
          bgImage="/bgSpiralBubble.png"
        />
        <div className="flex flex-col w-full gap-3 px-8 max-w-[340px] mx-auto mt-6 pb-4">
          {activeMessage?.actionConfig?.map((action, idx) => {
            const Icon = action.icon ? ICON_MAP[action.icon] : null;
            return (
              <button
                key={idx}
                onClick={() => handleGlobalAction(action)}
                className={`w-full py-3 rounded-[1.5rem] font-bold tracking-widest uppercase text-[11px] transition-all flex items-center justify-center gap-2 ${(action.variant === 'primary' || action.variant === 'highlighted')
                  ? 'bg-primary-fixed text-on-primary-fixed shadow-lg hover:scale-[1.02]'
                  : 'bg-surface-container-highest/50 text-on-surface border border-white/5 hover:bg-surface-container-highest'
                  }`}
              >
                {Icon && <Icon size={16} strokeWidth={2.5} />}
                {action.label}
              </button>
            );
          })}
        </div>
      </ActionModalOverlay>
    </>
  );
}
