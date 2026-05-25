import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { CircularPagination } from '../components/ui/CircularPagination';
import { SpiralMessage } from '../components/ui/SpiralMessage';
import { PentacleRitualOverlay } from '../components/ui/PentacleRitualOverlay';
import { Plus, Lock, Undo2, Check, Unlock, CircleDollarSign, Medal, X } from 'lucide-react';
import { PageDepthWrapper, ActionModalOverlay } from '../components/ui/InteractiveModalSystem';

// --- CONEXIÓN ZUSTAND ---
import { useGameStore } from '../store/useGameStore';

export function AlbumPage() {
  // --- ZUSTAND STORE ---
  const currentPage = useGameStore(state => state.albumPage || 1);
  const setCurrentPage = useGameStore(state => state.setAlbumPage);
  const pendingPlacementCard = useGameStore(state => state.pendingPlacementCard);
  const placePendingCard = useGameStore(state => state.placePendingCard);
  const globalSlots = useGameStore(state => state.slots);
  const globalPages = useGameStore(state => state.pages);
  const unlockPage = useGameStore(state => state.unlockPage);
  const claimReward = useGameStore(state => state.claimReward);
  const setRewardState = useGameStore(state => state.setRewardState);
  const ephemeralMessage = useGameStore(state => state.ephemeralMessage);
  const setEphemeralMessage = useGameStore(state => state.setEphemeralMessage);
  const handleGlobalAction = useGameStore(state => state.handleGlobalAction);
  const ritualState = useGameStore(state => state.ritualState) || { phase: 'idle', step: 1, rewards: null };
  const startClaimRitualStore = useGameStore(state => state.startClaimRitual);
  const resetRitualState = useGameStore(state => state.resetRitualState);

  const polvoLunarCount = useGameStore(state => state.albumItems?.polvo_lunar || 0);
  const hasUnlockItem = polvoLunarCount >= 2;

  // --- ESTADOS LOCALES DE INTERACCIÓN ---
  const [activePageIdToUnlock, setActivePageIdToUnlock] = useState(null);
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [placingSlotId, setPlacingSlotId] = useState(null);

  const [localPrompt, setLocalPrompt] = useState(null);
  const [rewardPromptDismissed, setRewardPromptDismissed] = useState(false);
  const ritualPhase = ritualState.phase;

  // --- DERIVADOS REACTIVOS ---
  const albumPages = globalPages.map(page => {
    const pageSlots = globalSlots.filter(s => s.pageId === page.id);
    const filledTotal = pageSlots.filter(s => s.state === 'filled').length;
    const progress = (filledTotal / 5) * 100;
    const isSuperFullMoon = filledTotal === 5; // Completado 5/5

    return { ...page, progress, isSuperFullMoon };
  });

  const currentPageData = albumPages.find(p => p.id === currentPage);
  const slots = globalSlots.filter(s => s.pageId === currentPage);
  const isPageComplete = currentPageData?.progress === 100;
  const isRitualReady = isPageComplete && currentPageData?.rewardState === 'default';
  const isClaimed = currentPageData?.rewardState === 'claimed_300' || currentPageData?.rewardState === 'claimed_400';

  // Reacción inicial de Spiral al entrar
  useEffect(() => {
    setRewardPromptDismissed(false);
    if (pendingPlacementCard) {
      setEphemeralMessage("PENDING_PLACEMENT_REMINDER", { title: pendingPlacementCard.title });
    } else if (isRitualReady) {
      setEphemeralMessage("ALBUM_PENTACLE_COMPLETE");
    } else if (isClaimed) {
      setEphemeralMessage("ALBUM_PAGE_CLAIMED", { pageNum: currentPage });
    } else {
      const pageSlots = globalSlots.filter(s => s.pageId === currentPage);
      const filledCount = pageSlots.filter(s => s.state === 'filled').length;
      const key = `ALBUM_ENTRY_${filledCount}`;
      setEphemeralMessage(key, {
        pageNum: currentPage,
        pageTitle: currentPageData?.title || ''
      });
    }
  }, [currentPage, pendingPlacementCard, isRitualReady, isClaimed]);

  // Vértices del Pentáculo Map
  const positionMap = {
    1: 'top-[11%] left-[50%]',
    2: 'top-[40%] left-[88%]',
    3: 'top-[87%] left-[80%]',
    4: 'top-[87%] left-[20%]',
    5: 'top-[40%] left-[12%]'
  };

  // --- ACCIONES ---
  const startClaimRitual = () => {
    if (!isRitualReady || ritualPhase !== 'idle') return;
    
    // Inicia el desvanecimiento de UI sin consumir estados extra de React
    document.body.classList.add('ritual-ui-fadeout');
    
    // Espera 1.4s antes de lanzar el layer del ritual
    setTimeout(() => {
      startClaimRitualStore();
    }, 1400);
  };

  const handleRitualVideoEnded = () => {
    claimReward(currentPage, 300);
    resetRitualState();
    setEphemeralMessage("MOON_REWARD_CLAIMED");
    document.body.classList.remove('ritual-ui-fadeout');
  };

  const handleCloseCelebration = () => {
    setIsCorrectGuess(false);
    document.body.classList.remove('ritual-ui-fadeout'); // Por si acaso
    // Si al cerrar el modal de celebración el álbum de la página actual está 100% completado
    // y el premio no ha sido reclamado, disparamos el mensaje efímero de Spiral!
    const pageSlots = globalSlots.filter(s => s.pageId === currentPage);
    const isNowComplete = pageSlots.every(s => s.state === 'filled');
    if (isNowComplete && currentPageData?.rewardState === 'default') {
      setEphemeralMessage("ALBUM_PENTACLE_COMPLETE");
    }
  };

  const handleSlotClick = (slot) => {
    if (currentPageData?.state === 'locked') return;
    if (placingSlotId !== null) return; // Deshabilitar clics mientras se realiza el ritual de colocación

    if (slot.state === 'filled') {
      setSelectedSlotForDetail(slot);
      return;
    }

    if (pendingPlacementCard) {
      if (pendingPlacementCard.pageId === currentPage && pendingPlacementCard.slotNum === slot.slotNum) {
        // Adivinó correctamente! Iniciamos el ritual de brillo místico
        setPlacingSlotId(slot.id);

        // El clímax del brillo coincide con la aparición de la celebración
        setTimeout(() => {
          setIsCorrectGuess(slot);
          placePendingCard(slot.id);

          // Verificar si esta carta completa la página
          const filledSlotsCount = slots.filter(s => s.state === 'filled').length;
          const isCompletingPage = filledSlotsCount === 4; // Era 4, ahora con esta se completa

          if (!isCompletingPage) {
            setEphemeralMessage("MOON_REWARD_CLAIMED");
          }

          setPlacingSlotId(null);
        }, 1800);
      } else {
        // Error de adivinación
        setEphemeralMessage("WRONG_PENTAGRAM_GUESS");
      }
    } else {
      setLocalPrompt("Para conseguir cartas para esta casilla, ¡completa tus actividades diarias y celebra la Luna Llena! 🌕🐾");
    }
  };

  const handlePageClick = (page) => {
    if (page.state === 'locked') {
      setActivePageIdToUnlock(page.id);
      return;
    }
    setCurrentPage(page.id);
    if (!pendingPlacementCard) {
      setEphemeralMessage("ALBUM_PAGE_CHANGE", { pageNum: page.id });
    }
  };

  const confirmUnlockPage = () => {
    const prevPage = albumPages.find(p => p.id === activePageIdToUnlock - 1);
    const isPrevComplete = prevPage ? prevPage.isSuperFullMoon : true;

    if (hasUnlockItem && isPrevComplete) {
      unlockPage(activePageIdToUnlock);
      setCurrentPage(activePageIdToUnlock);
      setEphemeralMessage("ALBUM_PAGE_CHANGE", { pageNum: activePageIdToUnlock });
      setActivePageIdToUnlock(null);
    }
  };

  const handleClaimReward = () => {
    claimReward(currentPage, 300);
  };

  // --- DETALLES DE DIALOGO DE COMPLEMENTO ---
  const isEligibleFor400 = false;

  let messageText = currentPageData?.state === 'locked'
    ? `Miau... la página ${currentPage} está cerrada con un sello estelar.`
    : isPageComplete
      ? `¡Miau! La página ${currentPage} está completa al 100%. ¡Qué gran colección!`
      : `Miau, Amelia. Estamos en la página ${currentPage}. ¿Qué recuerdos guardaremos hoy?`;

  if (currentPageData?.state !== 'locked') {
    if (currentPageData?.rewardState === 'claimed_400' || currentPageData?.rewardState === 'claimed_300') {
      const rewardVal = currentPageData?.rewardState === 'claimed_400' ? 400 : 300;
      messageText = `¡Espléndido! Completaste y canjeaste toda la página ${currentPage} por $${rewardVal}. 💖`;
    }
  }

  const activeMessageText = ephemeralMessage?.text || null;

  return (
    <>
      <PageDepthWrapper isActive={activePageIdToUnlock !== null || selectedSlotForDetail !== null || isCorrectGuess !== false} className="relative w-full flex-1 min-h-[calc(100dvh-160px)] max-w-md mx-auto overflow-hidden">

        {/* ================= CAPA 1: UI FLOTANTE (TOP) ================= */}
        <div className="absolute top-0 left-0 w-full p-6 pt-8 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            {/* 1. Header Global */}
              <GlassCard
                elevation="low"
                delay={0}
                className="h-[86px] flex flex-col justify-center px-6 py-3 text-center border border-primary/10 rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden header-ui-fadeout"
              >
                {pendingPlacementCard ? (
                  <div className="relative z-10 flex items-center gap-3.5 text-left w-full">
                    {/* Glowing Thumbnail */}
                    <motion.div
                      animate={{
                        boxShadow: ["0 0 10px rgba(160, 115, 153, 0.4)", "0 0 25px rgba(251, 181, 255, 0.75)", "0 0 10px rgba(160, 115, 153, 0.4)"],
                        borderColor: ["rgba(160,115,153,0.3)", "rgba(251, 181, 255, 0.8)", "rgba(160,115,153,0.3)"]
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-9 h-12 bg-surface-container-lowest border rounded-lg flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg"
                    >
                      {pendingPlacementCard.image ? (
                        <img src={pendingPlacementCard.image} alt={pendingPlacementCard.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">✨</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Title & instructions */}
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-[#FBB5FF] bg-[#FBB5FF]/10 border border-[#FBB5FF]/30 uppercase mb-0.5 animate-pulse">
                        Carta en mano
                      </span>
                      <h2 className="text-lg sm:text-xl font-display text-primary-fixed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight tracking-wide truncate">
                        {pendingPlacementCard.title}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col justify-center w-full">
                    <h1 className="text-lg sm:text-xl font-display text-primary-fixed mb-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight tracking-wide whitespace-nowrap">
                      {currentPageData?.title || 'Colección Estelar'}
                    </h1>
                    <p className="text-on-surface-variant text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {currentPageData?.subtitle || 'Descubriendo misterios cósmicos...'}
                    </p>
                  </div>
                )}
              </GlassCard>
          </div>
        </div>

        {/* ================= CAPA 0: FONDO/ÁLBUM ABSOLUTO ================= */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="pointer-events-auto w-full">
            {/* 2. Capa de Cartas Activas */}
            <style>{`
          @keyframes respiracion {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.12); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          @keyframes destello {
            0% { opacity: 0.2; }
            50% { opacity: 0.9; }
            100% { opacity: 0.2; }
          }
          @keyframes giroLento {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .boton-mas {
            animation: respiracion 3s ease-in-out infinite, giroLento 12s linear infinite;
            will-change: transform, opacity;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .boton-respiracion {
            animation: respiracion 3s ease-in-out infinite;
            will-change: transform, opacity;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .cartas-brillo {
            animation: destello 3s ease-in-out infinite;
            will-change: opacity;
          }
          
          /* Ocultar UI de manera global suavemente */
          body.ritual-ui-fadeout div.fixed.top-0.left-0.right-0, 
          body.ritual-ui-fadeout div.fixed.bottom-6.w-full,
          body.ritual-ui-fadeout .header-ui-fadeout,
          body.ritual-ui-fadeout .pagination-ui-fadeout { 
            opacity: 0 !important; 
            pointer-events: none !important; 
            transition: opacity 1.4s ease-in-out !important; 
          }

          /* Quitar animaciones cuando el layer del ritual está activo (para ahorrar recursos) */
          ${ritualPhase === 'active' ? `
            .boton-mas, .boton-respiracion, .cartas-brillo { 
              animation: none !important; 
            }
          ` : ''}
        `}</style>
            <div
              className="rounded-[2rem] p-8 overflow-hidden relative z-10 mt-8"
              style={{ background: 'url("/Album Mágico/albumBackground.jpeg") center/cover no-repeat' }}
            >
              <div className="relative w-full aspect-[3/4] max-w-[400px] mx-auto">
                {slots.map((slot) => {
                  const mockupPositionMap = {
                    1: { top: '35%', left: '66.2%' },
                    2: { top: '61%', left: '102%' },
                    3: { top: '103%', left: '93%' },
                    4: { top: '103.4%', left: '39.4%' },
                    5: { top: '60.6%', left: '31%' }
                  };
                  const pos = mockupPositionMap[slot.slotNum] || { top: '50%', left: '50%' };
                  const angleMap = { 1: 0, 2: 10, 3: -12, 4: 11, 5: -11 };
                  const sizeMap = {
                    1: { w: '98px', h: '154px' },
                    2: { w: '98px', h: '154px' },
                    3: { w: '94px', h: '148px' },
                    4: { w: '94px', h: '148px' },
                    5: { w: '98px', h: '154px' }
                  };
                  const size = sizeMap[slot.slotNum] || { w: '82px', h: '132px' };

                  const isPlacing = placingSlotId === slot.id;
                  const hasBg = isClaimed && slot.state === 'filled';
                  const hasIcon = !isClaimed && slot.state === 'filled';

                  return (
                    <div
                      key={slot.id}
                      onClick={() => ritualPhase === 'idle' && handleSlotClick(slot)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] flex items-center justify-center cursor-pointer"
                      style={{
                        width: size.w,
                        height: size.h,
                        top: pos.top,
                        left: pos.left,
                        transform: `translate(-50%, -50%) rotate(${angleMap[slot.slotNum] || 0}deg)`,
                        border: (hasBg || (!hasIcon && !isPlacing)) ? '2px solid #421D43' : '2px solid rgba(82, 35, 84, 0.6)',
                        backgroundImage: hasBg ? `url("${slot.image}")` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!hasBg && hasIcon && isRitualReady && (
                        <div className="absolute inset-0 border-[4px] border-[#CD97E0] rounded-[4px] cartas-brillo pointer-events-none" />
                      )}

                      {hasBg ? null : (
                        <>
                          {/* SVG & Shine (Animated during placement) */}
                          {(hasIcon || isPlacing) && (
                            <motion.div
                              initial={isPlacing ? { scale: 0, opacity: 0 } : false}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={isPlacing ? { duration: 0.8, delay: 0.6, ease: "easeOut" } : { duration: 0 }}
                              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                            >
                              <div className="boton-respiracion relative w-full h-full flex items-center justify-center">
                                <img
                                  src="/tryShine2.png"
                                  alt=""
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] object-contain pointer-events-none opacity-80"
                                />
                                <div
                                  className="w-14 h-14 opacity-80 relative z-10"
                                  style={{
                                    backgroundColor: '#B47FC0',
                                    WebkitMaskImage: `url("${slot.bgSvg}")`,
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskImage: `url("${slot.bgSvg}")`,
                                    maskSize: 'contain',
                                    maskPosition: 'center',
                                    maskRepeat: 'no-repeat'
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}

                          {/* The + Icon (Shrinks and disappears during placement) */}
                          {(!hasIcon || isPlacing) && (
                            <motion.div
                              initial={false}
                              animate={isPlacing ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className={`absolute inset-0 flex items-center justify-center ${isPlacing ? '' : 'boton-mas'}`}
                            >
                              <Plus size={32} className="text-[#BEA1B8]" />
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Botón de Ritual Central */}
                {isRitualReady && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                    <div
                      onClick={startClaimRitual}
                      className="boton-mas cursor-pointer"
                      style={{ width: '90px', height: '90px' }}
                    >
                      <img 
                        src="/tryShine3.png" 
                        alt="Iniciar Ritual" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                )}

                {/* Giant Lock Overlay if Page is Locked */}
                {currentPageData?.state === 'locked' && (
                  <div className="absolute inset-0 bg-background/55 backdrop-blur-[3px] flex flex-col items-center justify-center rounded-[2rem] z-20">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 bg-surface-container-high/85 border border-primary/20 rounded-3xl flex flex-col items-center text-center shadow-2xl max-w-[200px]"
                    >
                      <Lock size={36} className="text-primary-fixed mb-3" />
                      <h3 className="text-sm font-display text-primary-fixed mb-1 uppercase tracking-wider">Bloqueado</h3>
                      <p className="text-[10px] text-on-surface-variant leading-snug">Se requiere abrir con Polvo Lunar.</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= CAPA 1: UI FLOTANTE (BOTTOM) ================= */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-2 z-20 pointer-events-none pagination-ui-fadeout transition-opacity duration-[1400ms]">
          <div className="pointer-events-auto">
            {/* 4. Paginación */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <CircularPagination
                pages={albumPages}
                activePageId={currentPage}
                onPageClick={handlePageClick}
              />
            </motion.div>
          </div>
        </div>
      </PageDepthWrapper>

      {/* 5. Spiral Message Bubble (Efímero / Flotante) */}
      <AnimatePresence>
        {activePageIdToUnlock === null && !isEligibleFor400 && selectedSlotForDetail === null && isCorrectGuess === false && activeMessageText && (
          <SpiralMessage
            key="spiral-ephemeral-album"
            className="pointer-events-none z-50"
            message={activeMessageText}
            video="assets/videos/spiral_message.mp4"
            delay={0.2}
          />
        )}
      </AnimatePresence>

      {/* 6. OVERLAY MÁGICO MULTI-ESTADO */}
      <ActionModalOverlay isActive={activePageIdToUnlock !== null || isEligibleFor400 || localPrompt !== null}>
        {/* Desbloqueo de Página */}
        {activePageIdToUnlock !== null && (() => {
          const prevPage = albumPages.find(p => p.id === activePageIdToUnlock - 1);
          const prevPageSlots = globalSlots.filter(s => s.pageId === activePageIdToUnlock - 1);
          const prevFilledCount = prevPageSlots.filter(s => s.state === 'filled').length;
          const prevProgressPct = (prevFilledCount / 5) * 100;
          const isPrevComplete = prevPage ? prevPage.isSuperFullMoon : true;
          const canUnlock = hasUnlockItem && isPrevComplete;

          return (
            <SpiralMessage
              message={
                canUnlock
                  ? `¡Excelente! Reuniste todos los requisitos para desbloquear la página ${activePageIdToUnlock}. ¿Realizamos el ritual de apertura? 🗝️✨`
                  : `¡Oh no!, aún no reúnes los requisitos para desbloquear la página ${activePageIdToUnlock}`
              }
              video="assets/videos/spiral_message.mp4"
              isOverlayMode={true}
              delay={0}
              actionButton={
                <div className="w-full flex flex-col gap-4 mt-2">
                  {/* Contenido Visual Interactivo y Temático de Requisitos */}
                  <div className="w-full flex flex-col gap-2.5 mt-2">
                    {/* Requisito 1: Página anterior completa */}
                    <GlassCard
                      elevation={isPrevComplete ? "lowest" : "low"}
                      className={`p-3.5 flex items-center justify-between transition-all duration-500 relative border backdrop-blur-lg rounded-2xl ${isPrevComplete
                        ? 'border-primary/20 opacity-80 !bg-surface-container-lowest/40'
                        : 'border-transparent !bg-surface-container-low/40'
                        }`}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl transition-all duration-700 origin-left pointer-events-none"
                        style={{
                          backgroundColor: `rgba(220, 184, 255, 0.08)`,
                          transform: isPrevComplete ? 'scaleX(1)' : 'scaleX(0)'
                        }}
                      />

                      <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${isPrevComplete
                          ? 'bg-gradient-to-br from-primary-fixed to-primary shadow-[0_0_12px_rgba(220,184,255,0.3)] border-transparent'
                          : 'bg-transparent border-[1.5px] border-outline-variant/50'
                          }`}>
                          {isPrevComplete && (
                            <svg className="w-4.5 h-4.5 text-on-primary-fixed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <div className="flex flex-col text-left min-w-0 mt-0.5">
                          <h4 className={`transition-colors text-[0.8rem] font-bold leading-snug truncate ${isPrevComplete ? 'text-on-surface-variant line-through' : 'text-on-surface'
                            }`}>
                            Completar página anterior
                          </h4>
                          <p className={`uppercase tracking-widest text-[0.58rem] font-medium transition-colors flex items-center gap-1.5 truncate ${isPrevComplete ? 'text-primary' : 'text-tertiary'
                            }`}>
                            <span>Álbum</span>
                            <span className="text-[8px] opacity-40">&bull;</span>
                            <span className="truncate">{prevPage?.title || `Página ${activePageIdToUnlock - 1}`}</span>
                          </p>
                        </div>
                      </div>

                      <div className={`relative z-10 flex items-center justify-center font-bold shrink-0 transition-all duration-300 ml-2 ${isPrevComplete ? 'opacity-40 grayscale' : 'text-primary-fixed-dim'
                        }`}>
                        <span className="flex items-center gap-1 text-[11px]">
                          {prevFilledCount}/5
                          <span className="text-[12px] opacity-80">📖</span>
                        </span>
                      </div>
                    </GlassCard>

                    {/* Requisito 2: Polvo lunar */}
                    <GlassCard
                      elevation={hasUnlockItem ? "lowest" : "low"}
                      className={`p-3.5 flex items-center justify-between transition-all duration-500 relative border backdrop-blur-lg rounded-2xl ${hasUnlockItem
                        ? 'border-primary/20 opacity-80 !bg-surface-container-lowest/40'
                        : 'border-transparent !bg-surface-container-low/40'
                        }`}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl transition-all duration-700 origin-left pointer-events-none"
                        style={{
                          backgroundColor: `rgba(220, 184, 255, 0.08)`,
                          transform: hasUnlockItem ? 'scaleX(1)' : 'scaleX(0)'
                        }}
                      />

                      <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${hasUnlockItem
                          ? 'bg-gradient-to-br from-primary-fixed to-primary shadow-[0_0_12px_rgba(220,184,255,0.3)] border-transparent'
                          : 'bg-transparent border-[1.5px] border-outline-variant/50'
                          }`}>
                          {hasUnlockItem && (
                            <svg className="w-4.5 h-4.5 text-on-primary-fixed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <div className="flex flex-col text-left min-w-0 mt-0.5">
                          <h4 className={`transition-colors text-[0.8rem] font-bold leading-snug truncate ${hasUnlockItem ? 'text-on-surface-variant line-through' : 'text-on-surface'
                            }`}>
                            Reunir polvo lunar
                          </h4>
                          <p className={`uppercase tracking-widest text-[0.58rem] font-medium transition-colors flex items-center gap-1.5 truncate ${hasUnlockItem ? 'text-primary' : 'text-tertiary'
                            }`}>
                            <span>Inventario</span>
                            <span className="text-[8px] opacity-40">&bull;</span>
                            <span>2 requeridos</span>
                          </p>
                        </div>
                      </div>

                      <div className={`relative z-10 flex items-center justify-center font-bold shrink-0 transition-all duration-300 ml-2 ${hasUnlockItem ? 'opacity-40 grayscale' : 'text-primary-fixed-dim'
                        }`}>
                        <span className="flex items-center gap-1 text-[11px]">
                          {polvoLunarCount}/2
                          <span className="text-[12px] opacity-80">✨</span>
                        </span>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex flex-col w-full gap-2.5 mt-1">
                    {canUnlock ? (
                      <>
                        <Button onClick={confirmUnlockPage} variant="modal_highlighted" className="w-full shadow-lg text-[11px] py-2.5">
                          <Unlock size={16} /> Desbloquear con 2 Polvos
                        </Button>
                        <Button onClick={() => setActivePageIdToUnlock(null)} variant="modal_normal" className="w-full text-[11px] py-2.5">
                          <Undo2 size={16} /> Regresar
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setActivePageIdToUnlock(null)} variant="modal_highlighted" className="w-full shadow-lg text-[11px] py-2.5">
                        <Undo2 size={16} /> Regresar
                      </Button>
                    )}
                  </div>
                </div>
              }
            />
          );
        })()}


        {/* Notificación de Casilla Vacía Regular */}
        {localPrompt !== null && (
          <>
            <SpiralMessage message={localPrompt} video="assets/videos/spiral_message.mp4" isOverlayMode={true} delay={0} />
            <div className="flex flex-col w-full max-w-xs px-4 gap-3 mt-6">
              <Button onClick={() => setLocalPrompt(null)} variant="modal_highlighted" className="w-full">
                <Check size={18} /> Entendido
              </Button>
            </div>
          </>
        )}      </ActionModalOverlay>

      {/* Modales de pantalla completa (Celebración y Detalle) posicionados de manera independiente */}
      <AnimatePresence>
        {isCorrectGuess !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center p-6 z-[100] overflow-hidden"
          >
            {/* Sparkles background animation wrapper */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, duration: 0.8 }}
              className="bg-surface-container-high border-2 border-primary-fixed shadow-[0_0_60px_#A07399] rounded-[2.5rem] flex flex-col items-center pt-4 pb-2.5 px-6 relative overflow-hidden"
            >
              {/* Card Title Header */}
              <h2 className="text-sm font-bold text-primary-fixed uppercase tracking-[0.25em] mb-2 text-center z-10">¡COLOCADA CON ÉXITO!</h2>

              {/* HD video / fallback image container */}
              <div className="w-[310px] h-[550px] bg-[rgba(20,10,25,0.7)] rounded-[1.25rem] border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner">
                {isCorrectGuess.video ? (
                  <video
                    src={isCorrectGuess.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img src={isCorrectGuess.image} alt={isCorrectGuess.title} className="w-64 h-64 object-contain drop-shadow-[0_0_15px_#A07399]" />
                )}

                {/* Floating shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
              </div>

              {/* Title & metadata */}
              <h3 className="text-lg font-display text-white mt-3.5 mb-1.5 tracking-wide">{isCorrectGuess.title}</h3>
              {isCorrectGuess.description && (
                <p className="text-[11px] text-[#BEA1B8]/80 text-center px-4 leading-relaxed max-w-[280px] font-sans font-medium mb-3 italic z-10">
                  "{isCorrectGuess.description}"
                </p>
              )}

              {/* Spinning decorative frame */}
              <motion.div
                className="absolute inset-2 border border-dashed border-[#BEA1B8]/20 rounded-[2.25rem] pointer-events-none z-0"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
              />
            </motion.div>

            {/* Click to close */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4"
            >
              <Button onClick={handleCloseCelebration} variant="modal_highlighted" className="px-10 flex items-center gap-2">
                <Check size={18} /> ¡Genial!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSlotForDetail !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center p-6 z-[100] overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-container-high border border-outline-variant/20 shadow-2xl rounded-[2.5rem] flex flex-col items-center pt-4 pb-2.5 px-6 relative overflow-hidden"
            >
              <h2 className="text-xs font-bold text-[#BEA1B8] uppercase tracking-[0.25em] mb-2 text-center z-10">CARTA COLOCADA</h2>

              {/* video / image container */}
              <div className="w-[310px] h-[550px] bg-[rgba(20,10,25,0.7)] rounded-[1.25rem] border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner">
                {selectedSlotForDetail.video ? (
                  <video
                    src={selectedSlotForDetail.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img src={selectedSlotForDetail.image} alt={selectedSlotForDetail.title} className="w-64 h-64 object-contain drop-shadow-[0_0_15px_#A07399]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
              </div>

              {/* Title & metadata */}
              <h3 className="text-lg font-display text-white mt-3.5 mb-1.5 tracking-wide">{selectedSlotForDetail.title}</h3>
              {selectedSlotForDetail.description && (
                <p className="text-[11px] text-[#BEA1B8]/80 text-center px-4 leading-relaxed max-w-[280px] font-sans font-medium mb-3 italic z-10">
                  "{selectedSlotForDetail.description}"
                </p>
              )}

              {/* Decorative Frame */}
              <motion.div
                className="absolute inset-2 border border-dashed border-[#BEA1B8]/20 rounded-[2.25rem] pointer-events-none z-0"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
              />
            </motion.div>

            {/* Click to close - Central Bottom Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 z-50"
            >
              <Button onClick={() => setSelectedSlotForDetail(null)} variant="modal_highlighted" className="px-10 flex items-center gap-2">
                <Check size={18} /> ¡Volver al Álbum!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- RITUAL DE COBRO: OVERLAY DEDICADO --- */}
      <PentacleRitualOverlay
        isActive={ritualPhase === 'active'}
        onVideoEnded={handleRitualVideoEnded}
      />
    </>
  );
}
