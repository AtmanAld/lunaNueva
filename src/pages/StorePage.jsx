import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { Undo2, Check, Search } from 'lucide-react';
import { SpiralMessage } from '../components/ui/SpiralMessage';
import { PageDepthWrapper, ActionModalOverlay } from '../components/ui/InteractiveModalSystem';

// --- ZUSTAND STORE ---
import { useGameStore } from '../store/useGameStore';
import { selectActiveMessage } from '../store/slices/createMessageSlice';

export function StorePage() {
  const globalStars = useGameStore(state => state.userStars);
  const purchaseItem = useGameStore(state => state.purchaseItem);
  const storeCategories = useGameStore(state => state.categories);
  const catalog = useGameStore(state => state.catalog);

  const [activeCategory, setActiveCategory] = useState('Mascota');

  // --- ESTADO GLOBAL DEL MODAL ---
  const buyStep = useGameStore(state => state.purchaseStep);
  const selectedProduct = useGameStore(state => state.activePurchaseItem);
  const purchaseQuantity = useGameStore(state => state.purchaseQuantity || 1);
  const setPurchaseState = useGameStore(state => state.setPurchaseState);
  const updatePurchaseQuantity = useGameStore(state => state.updatePurchaseQuantity);
  const isDirectFlight = useGameStore(state => state.isDirectFlight);
  const navigate = useNavigate();

  // --- MOTOR DE MENSAJES ---
  const activeMessage = useGameStore(state => selectActiveMessage(state, 'store'));

  // --- LÍMITES TEMPORALES (Opción 1: LocalStorage Nativo) ---
  const [timeTravelLimits, setTimeTravelLimits] = useState(() => {
    try {
      const saved = localStorage.getItem('timeTravelLimits');
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.month === currentMonth) {
          return parsed;
        }
      }
      return { month: currentMonth, count: 0 };
    } catch {
      return { month: new Date().toISOString().slice(0, 7), count: 0 };
    }
  });

  // Mapeo de catálogo de Zustand al formato visual
  const mappedCatalog = (catalog || []).map(item => ({
    ...item,
    chips: (item.chips || []).map(c => typeof c === 'string' ? { text: c } : c)
  }));

  const allItems = [...mappedCatalog];

  // 1. FILTRAR CATEGORÍAS VACÍAS Y LÍMITES
  const availableCategories = (storeCategories || []).filter(cat =>
    allItems.some(item => {
      if (item.category !== cat) return false;
      if (item.payload?.type === 'TIME_TRAVEL' && timeTravelLimits.count >= 4) return false;
      return true;
    })
  );

  // 2. Asegurarnos que la categoría activa sea válida (si la actual desaparece)
  const safeActiveCategory = availableCategories.includes(activeCategory)
    ? activeCategory
    : availableCategories[0] || 'Mascota';

  const filteredItems = allItems.filter(item => {
    if (item.category !== safeActiveCategory) return false;
    // Ocultar si llegó al límite
    if (item.payload?.type === 'TIME_TRAVEL' && timeTravelLimits.count >= 4) return false;
    return true;
  });

  // Sincronizar la categoría si el modal global se abre y tiene un producto
  useEffect(() => {
    if (buyStep !== 'idle' && selectedProduct && selectedProduct.category !== activeCategory) {
      setActiveCategory(selectedProduct.category);
    }
  }, [buyStep, selectedProduct, activeCategory]);



  const handleBuyIntent = (item) => {
    useGameStore.setState({ isDirectFlight: false });
    if (globalStars >= item.price) {
      setPurchaseState('confirm_affordable', item, 1);
      useGameStore.getState().enqueueMessage('store', 'STORE_CONFIRM_ITEM');
    } else {
      setPurchaseState('confirm_unaffordable', item, 1);
      useGameStore.getState().enqueueMessage('store', 'STORE_CONFIRM_UNAFFORDABLE');
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedProduct) return;
    const totalPrice = selectedProduct.price * purchaseQuantity;
    if (globalStars >= totalPrice) {
      purchaseItem(selectedProduct.id, purchaseQuantity);
      
      if (selectedProduct.payload?.type === 'TIME_TRAVEL') {
        const newLimits = { ...timeTravelLimits, count: timeTravelLimits.count + purchaseQuantity };
        setTimeTravelLimits(newLimits);
        localStorage.setItem('timeTravelLimits', JSON.stringify(newLimits));
      }

      // Si el usuario quiere regresar automagicamente a Spiral:
      if (isDirectFlight) {
        navigate('/spiral');
      }
      setPurchaseState('idle');
      useGameStore.getState().dequeueMessage('store');
    }
  };

  const resetInteraction = () => {
    setPurchaseState('idle');
    useGameStore.getState().dequeueMessage('store');
  };

  const handleGlobalAction = (action) => {
    switch (action.type) {
      case 'STORE_BUY':
        handleConfirmPurchase();
        break;
      case 'STORE_CANCEL':
        resetInteraction();
        break;
    }
  };

  const totalPrice = selectedProduct ? selectedProduct.price * purchaseQuantity : 0;
  const showUsageChip = selectedProduct?.category === 'Mascota';
  return (
    <>
      <PageDepthWrapper isActive={!!activeMessage} className="p-6 pt-6 pb-32 space-y-8 relative">

        {/* 1. Header Global Enmarcado */}
          <GlassCard 
            elevation="low" 
            delay={0}
            className="p-6 py-5 text-center bg-surface-container-low border border-primary/10 rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            <div className="relative z-10">
              <h1 className="text-lg sm:text-xl font-display text-primary-fixed mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight tracking-wide whitespace-nowrap">
                Tienda Astral
              </h1>
              <p className="text-on-surface-variant text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Bienes y reliquias celestiales
              </p>
            </div>
          </GlassCard>

        {/* 2. Chips de Filtro */}
        <div className="flex justify-center gap-3 pb-2">
          {availableCategories.map((cat, i) => (
            <motion.div key={cat} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="snap-start">
              <Chip
                active={safeActiveCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Chip>
            </motion.div>
          ))}
        </div>

        {/* 3. Cuadrícula de Objetos */}
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item, i) => (
            <GlassCard
              key={item.name}
              elevation="low"
              delay={0.2 + (i * 0.05)}
              onClick={() => handleBuyIntent(item)}
              className="cursor-pointer group flex flex-col p-3 border border-outline-variant/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] h-full hover:bg-surface-container hover:border-primary/20 transition-colors"
            >
              {/* Inner Square Placeholder */}
              <div className="w-full aspect-[1/1.1] bg-surface-container-lowest rounded-xl flex items-center justify-center relative mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)_inset] overflow-hidden group-hover:shadow-[0_4px_16px_rgba(220,184,255,0.1)_inset] transition-shadow">
                {item.tag && (
                  <span className="absolute top-2 right-2 bg-on-surface/10 text-on-surface-variant text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full z-10 backdrop-blur-md">
                    {item.tag}
                  </span>
                )}
                <span className="text-5xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] grayscale group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
              </div>

              <span className="font-medium text-sm leading-tight text-on-surface mb-1 px-1">{item.name}</span>

              <div className="flex items-center gap-1.5 mb-4 px-1">
                <span className="text-xs text-secondary drop-shadow-[0_0_8px_rgba(236,185,200,0.4)]">⭐</span>
                <span className={`font-medium text-[13px] tracking-wide ${globalStars >= item.price ? 'text-on-surface-variant/90' : 'text-error'}`}>{item.price}</span>
              </div>

              <button
                className={`w-full py-2.5 rounded-full text-xs font-medium tracking-wide transition-colors mt-auto border border-white/5 active:scale-95 flex items-center justify-center gap-1 bg-surface-container-highest text-primary-fixed group-hover:bg-primary-fixed group-hover:text-on-primary-fixed`}
              >
                Comprar
              </button>
            </GlassCard>
          ))}
        </div>
      </PageDepthWrapper>

      {/* GAVETA 3D DE TRANSACCIONES */}
      <ActionModalOverlay isActive={!!activeMessage}>
        {activeMessage && (
          <SpiralMessage 
            message={activeMessage.text} 
            bgImage="/bgSpiralBubble.png" 
            video={activeMessage.video} 
            isOverlayMode={true} 
            centerContent={true}
            delay={0}
            actionConfig={activeMessage.actionConfig}
            onAction={handleGlobalAction}
            actionButton={
              activeMessage.id === 'STORE_CONFIRM_ITEM' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full px-8 max-w-[340px] mx-auto">
                  <div className="flex flex-col items-center w-full mb-8 pt-4 relative">
                    <div className="absolute inset-x-8 top-0 h-px bg-white/5" />
                    
                    {/* Icono Clicable para aumentar cantidad */}
                    <motion.button
                      onClick={() => updatePurchaseQuantity(purchaseQuantity + 1)}
                      whileTap={{ scale: 1.15 }}
                      className="relative w-24 h-24 rounded-full bg-surface-container-high border border-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center text-5xl my-6 group hover:bg-surface-container-highest cursor-pointer focus:outline-none"
                    >
                      <span className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">{selectedProduct?.icon}</span>
                      {/* Badge Animado de Cantidad */}
                      <motion.span
                        key={purchaseQuantity}
                        initial={{ scale: 1.5, backgroundColor: "#DCB8FF" }}
                        animate={{ scale: 1, backgroundColor: "#1D192B" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1D192B] border-2 border-[#1E1A22] text-[#EADDFF] flex items-center justify-center text-sm font-bold shadow-lg z-10"
                      >
                        {purchaseQuantity}
                      </motion.span>
                    </motion.button>

                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs px-2 mt-2">
                      {/* Badge Animado de Costo */}
                      <motion.span
                        key={`cost-${totalPrice}`}
                        initial={{ scale: 1.2, backgroundColor: "#EADDFF", color: "#1D192B" }}
                        animate={{ scale: 1, backgroundColor: "rgba(51,45,65,0.8)", color: "#EADDFF" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="px-3 py-1 rounded-full border border-primary/30 shadow-[0_0_10px_rgba(220,184,255,0.2)] text-[11px] uppercase font-bold tracking-wider flex items-center gap-1"
                      >
                        {totalPrice} ⭐
                      </motion.span>

                      {showUsageChip && (
                        <span className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/10 shadow-sm text-[10px] uppercase font-bold tracking-wider text-on-surface-variant flex items-center gap-1">
                          {purchaseQuantity > 1 ? `${purchaseQuantity} usos` : '1 uso'}
                        </span>
                      )}
                      {selectedProduct?.chips?.map((chip, index) => {
                        const chipText = typeof chip === 'string' ? chip : chip.text;
                        return (
                          <span key={chipText || index} className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/10 shadow-sm text-[10px] uppercase font-bold tracking-wider text-on-surface-variant flex items-center gap-1">
                            {chipText}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : activeMessage.id === 'STORE_CONFIRM_UNAFFORDABLE' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full px-8 max-w-[340px] mx-auto mb-4">
                  <div className="w-full h-px bg-white/5" />
                </motion.div>
              ) : null
            }
          />
        )}
      </ActionModalOverlay>
    </>
  );
}
