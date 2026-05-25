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
import { activityCatalog } from '../data/activityCatalog';

export function StorePage() {
  const globalStars = useGameStore(state => state.userStars);
  const purchaseItem = useGameStore(state => state.purchaseItem);
  const storeCategories = useGameStore(state => state.categories);
  const catalog = useGameStore(state => state.catalog);
  const globalActivities = useGameStore(state => state.activities);

  const [activeCategory, setActiveCategory] = useState('Mascota');

  // --- ESTADO GLOBAL DEL MODAL ---
  const buyStep = useGameStore(state => state.purchaseStep);
  const selectedProduct = useGameStore(state => state.activePurchaseItem);
  const purchaseQuantity = useGameStore(state => state.purchaseQuantity || 1);
  const setPurchaseState = useGameStore(state => state.setPurchaseState);
  const isDirectFlight = useGameStore(state => state.isDirectFlight);
  const navigate = useNavigate();

  // Mapeo de catálogo de Zustand al formato visual
  const mappedCatalog = (catalog || []).map(item => ({
    ...item,
    chips: (item.chips || []).map(c => typeof c === 'string' ? { text: c } : c)
  }));

  // Actividades bloqueadas como productos (Uniendo estado con catálogo)
  const purchasableActivities = (globalActivities || []).filter(a => !a.isUnlocked).map(act => {
    const catalogInfo = activityCatalog.find(ac => ac.activityID === act.activityID);
    if (!catalogInfo) return null;

    return {
      id: act.activityID,
      name: catalogInfo.title,
      icon: "🌟",
      price: catalogInfo.price || 200,
      category: "Actividad",
      description: catalogInfo.activityDetails || "Una nueva actividad para tu rutina.",
      detailMsg: catalogInfo.activityDetails || "Añade esta actividad para poder realizarla diariamente.",
      chips: [{ text: `Ganas ${catalogInfo.stars}⭐` }, { text: 'Actividad' }],
    };
  }).filter(Boolean);

  const allItems = [...mappedCatalog, ...purchasableActivities];

  // 1. FILTRAR CATEGORÍAS VACÍAS
  const availableCategories = (storeCategories || []).filter(cat =>
    allItems.some(item => item.category === cat)
  );

  // 2. Asegurarnos que la categoría activa sea válida (si la actual desaparece)
  const safeActiveCategory = availableCategories.includes(activeCategory)
    ? activeCategory
    : availableCategories[0] || 'Mascota';

  const filteredItems = allItems.filter(item => item.category === safeActiveCategory);

  // Sincronizar la categoría si el modal global se abre y tiene un producto
  useEffect(() => {
    if (buyStep !== 'idle' && selectedProduct && selectedProduct.category !== activeCategory) {
      setActiveCategory(selectedProduct.category);
    }
  }, [buyStep, selectedProduct, activeCategory]);

  // Alerta local (no lo necesitamos si usamos global setPurchaseState, solo actualizamos UI)
  const setPurchaseQuantityLocal = (qty) => {
    setPurchaseState(buyStep, selectedProduct, qty);
  };

  const handleBuyIntent = (item) => {
    useGameStore.setState({ isDirectFlight: false });
    if (globalStars >= item.price) {
      setPurchaseState('confirm_affordable', item, 1);
    } else {
      setPurchaseState('confirm_unaffordable', item, 1);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedProduct) return;
    const totalPrice = selectedProduct.price * purchaseQuantity;
    if (globalStars >= totalPrice) {
      purchaseItem(selectedProduct.id, purchaseQuantity);
      
      // Si el usuario quiere regresar automagicamente a Spiral:
      if (isDirectFlight) {
        navigate('/spiral');
      }
      setPurchaseState('idle');
    }
  };

  const handleDetail = () => setPurchaseState('detail_view', selectedProduct, purchaseQuantity);
  const handleBackToConfirm = () => setPurchaseState('confirm_affordable', selectedProduct, purchaseQuantity);
  const resetInteraction = () => setPurchaseState('idle');

  // Máquina de estados visual de la Gaveta 3D
  const getInteractionUI = () => {
    if (buyStep === 'confirm_unaffordable') {
      return {
        message: `Miau, No tienes suficientes estrellas para comprar ${selectedProduct?.name}. Necesitas ${selectedProduct?.price}⭐.`,
        video: "assets/videos/spiral_message.mp4",
        content: (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full mt-6 px-8 relative">
            <div className="absolute inset-x-4 top-0 h-px bg-white/5" />
            <Button onClick={resetInteraction} variant="none" className="w-full mt-6 py-3.5 bg-[#1E1A22] rounded-full border border-[#231F26] flex items-center justify-center gap-2 text-[#EADDFF] font-medium shadow-lg">
              <Undo2 size={18} /> Muy bien
            </Button>
          </motion.div>
        )
      };
    }

    if (buyStep === 'detail_view') {
      return {
        message: selectedProduct?.detailMsg || "Detalle increíble de este producto para ti.",
        video: "assets/videos/spiral_message.mp4",
        content: (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full mt-6 px-8 relative">
            <div className="absolute inset-x-4 top-0 h-px bg-white/5" />
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-6">
              <Button onClick={handleConfirmPurchase} variant="modal_highlighted" className="flex-1 !py-3.5 flex items-center justify-center gap-2">
                <Check size={18} /> Comprar por {selectedProduct?.price}⭐
              </Button>
              <Button onClick={handleBackToConfirm} variant="modal_normal" className="flex-1 !py-3.5 flex items-center justify-center gap-2">
                <Undo2 size={18} /> Regresar
              </Button>
            </div>
          </motion.div>
        )
      }
    }

    if (buyStep === 'confirm_affordable') {
      const totalPrice = selectedProduct?.price * purchaseQuantity;
      const isAffordable = globalStars >= totalPrice;
      // Solo sumamos "usos" si es de Mascotas
      const showUsageChip = selectedProduct?.category === 'Mascota';

      return {
        message: `Miau, ${selectedProduct?.description}\n¿Qué cantidad compramos?\nCostaría: ${totalPrice}⭐`,
        video: "assets/videos/spiral_message.mp4",
        content: (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full mt-4 px-2">

            {/* Imagen Grande y Chips (Estilo Burbuja Inventario) */}
            <div className="flex flex-col items-center w-full mb-8 pt-4 relative">
              <div className="absolute inset-x-8 top-0 h-px bg-white/5" />
              {selectedProduct?.category === 'Mascota' && (
                  <Chip text={`${(selectedProduct.payload?.amount || 0) * purchaseQuantity} usos totales`} variant="secondary" />
              )}

              {/* Icono Clicable para aumentar cantidad */}
              <motion.button
                onClick={() => setPurchaseQuantityLocal(purchaseQuantity + 1)}
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

              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs px-2">
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

            {/* Botones de Acción */}
            <div className="flex flex-col w-full gap-3 px-8">
              <Button onClick={handleConfirmPurchase} variant={isAffordable ? "modal_highlighted" : "modal_normal"} className={!isAffordable ? 'opacity-50 pointer-events-none' : ''}>
                <Check size={18} /> Comprar
              </Button>
              {selectedProduct?.category === 'Actividad' && (
                <Button onClick={handleDetail} variant="modal_normal">
                  <Search size={18} /> Detalle
                </Button>
              )}
              <Button onClick={resetInteraction} variant="modal_normal">
                <Undo2 size={18} /> Mejor luego
              </Button>
            </div>
          </motion.div>
        )
      };
    }

    return { message: "", video: null, content: null };
  };


  return (
    <>
      <PageDepthWrapper isActive={buyStep !== 'idle'} className="p-6 pt-6 pb-32 space-y-8 relative">

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
      <ActionModalOverlay isActive={buyStep !== 'idle'}>
        <SpiralMessage message={getInteractionUI().message} video={getInteractionUI().video} isOverlayMode={true} delay={0} />
        {getInteractionUI().content}
      </ActionModalOverlay>
    </>
  );
}
