import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SpiralMessage } from '../components/ui/SpiralMessage';
import { PageDepthWrapper, ActionModalOverlay } from '../components/ui/InteractiveModalSystem';
import { Settings, Pencil, Star, Wallet, Moon, BookOpen, Check, Undo2, Image, CloudUpload, Droplet, Cookie, Bath, Gamepad2, LogOut } from 'lucide-react';
import { supabase } from '../supabaseclient';

// --- ZUSTAND STORE ---
import { useGameStore } from '../store/useGameStore';

export function ProfilePage() {
  const [modalType, setModalType] = useState('idle'); // 'idle' | 'edit_main' | 'edit_config'

  const [tapCount, setTapCount] = useState(0);
  const [showDev, setShowDev] = useState(false);

  const handleSecretTap = () => {
    if (showDev) return;
    if (tapCount >= 2) {
      setShowDev(true);
      setTapCount(0);
    } else {
      setTapCount(prev => prev + 1);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const userName = useGameStore(state => state.userName);
  const petName = useGameStore(state => state.petName);
  const userAvatar = useGameStore(state => state.userAvatar);
  
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempPetName, setTempPetName] = useState(petName);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No estás autenticada en Supabase.");

      // Generar nombre único para forzar refresco de caché
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      useGameStore.getState().updateProfile({ userAvatar: publicUrl });
      // Eliminamos la alerta molesta, el cambio visual inmediato es suficiente feedback
      setModalType('idle');
    } catch (err) {
      console.error("Error al subir avatar:", err);
      // No mostramos alerta nativa, el spinner se detendrá y el usuario puede reintentar
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveConfig = () => {
    useGameStore.getState().updateProfile({ userName: tempUserName || userName });
    useGameStore.setState({ petName: tempPetName || petName });
    setModalType('idle');
  };

  const userLevel = useGameStore(state => state.userLevel);
  const statistics = useGameStore(state => state.statistics);
  const globalPages = useGameStore(state => state.pages);
  const needs = useGameStore(state => state.needs);

  const petNeeds = [
    { id: 'water', icon: Droplet, value: needs.water, color: "text-blue-300" },
    { id: 'food', icon: Cookie, value: needs.food, color: "text-amber-200" },
    { id: 'clean', icon: Bath, value: needs.clean, color: "text-teal-200" },
    { id: 'play', icon: Gamepad2, value: needs.play, color: "text-primary-fixed-dim" },
  ];

  const pagesUnlocked = globalPages.filter(p => p.state === 'unlocked').length;

  const userStatistics = [
    { id: 1, value: `${statistics.totalStarsEarned}`, label: "Estrellas Ganadas", icon: Star, colorClass: "text-primary-fixed-dim" },
    { id: 2, value: `$${statistics.totalMoney} MXN`, label: "Dinero", icon: Wallet, colorClass: "text-secondary" },
    { id: 3, value: `${statistics.totalMoons}`, label: "Lunas Completadas", icon: Moon, colorClass: "text-primary-fixed-dim" },
    { id: 4, value: `${statistics.totalTasksCompleted}`, label: "Tareas Completadas", icon: Check, colorClass: "text-secondary" }
  ];

  // Configuración del Modal 3D basado en la acción seleccionada
  const getModalConfig = () => {
    if (modalType === 'edit_main') {
      return {
        message: 'Sube aquí tu nueva foto de perfil o edita otras cosas.',
        video: "assets/videos/spiral_message.mp4",
        actions: (

          <div className="flex flex-col w-full gap-5 px-8 max-w-[340px] mx-auto mt-6 pb-4">
            {/* CONTENT: UPLOAD BOX */}
            <div className="w-full flex justify-center mb-2 relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                id="avatar-upload" 
                disabled={isUploading}
              />
              <label htmlFor="avatar-upload" className="w-full">
                <GlassCard className={`w-full aspect-[4/3] border-2 border-dashed border-primary-fixed/20 bg-surface-container/30 flex flex-col items-center justify-center gap-3 rounded-[2rem] p-6 text-center shadow-[0_0_30px_rgba(0,0,0,0.1)_inset] transition-colors ${isUploading ? 'opacity-50' : 'hover:bg-surface-container/50 cursor-pointer'}`}>
                  {isUploading ? (
                    <>
                      <span className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-1" />
                      <p className="text-primary-fixed text-[13px] font-medium tracking-wide">Subiendo magia...</p>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={42} strokeWidth={1.5} className="text-secondary/70 mb-1" />
                      <p className="text-on-surface-variant text-[13px] font-medium tracking-wide">Sube una imagen</p>
                      <Button as="span" variant="none" className="bg-surface-container border border-white/5 py-2.5 px-6 rounded-full flex items-center justify-center gap-2 text-on-surface font-medium text-[13px] hover:bg-surface-container-high transition-colors mt-2 shadow-sm pointer-events-none">
                        <Image size={16} className="opacity-80" /> <span className="mt-[2px]">Elegir archivo</span>
                      </Button>
                    </>
                  )}
                </GlassCard>
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 w-full">
              <Button onClick={() => setModalType('idle')} variant="modal_highlighted" className="mb-1">
                <Check size={18} /> Listo
              </Button>
              <Button onClick={() => setModalType('edit_config')} variant="modal_normal">
                <Settings size={18} /> Editar nombres
              </Button>
            </div>
          </div>
        )
      };
    }
    if (modalType === 'edit_config') {
      return {
        message: 'Cambia tu nombre, el mío y otras cosas.',
        video: "assets/videos/spiral_message.mp4",
        actions: (
          <div className="flex flex-col w-full gap-5 px-8 max-w-[340px] mx-auto mt-6 pb-4">
            {/* CONTENT: FORM */}
            <div className="w-full flex flex-col gap-4 mb-2 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-on-surface-variant text-[9px] uppercase tracking-[0.2em] font-bold pl-4">Tu Nombre</label>
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-[1.5rem] px-5 py-4 text-on-surface font-medium text-[15px] focus:outline-none focus:border-primary-fixed/30 focus:bg-surface-container transition-all placeholder:text-on-surface-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)_inset]"
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-on-surface-variant text-[9px] uppercase tracking-[0.2em] font-bold pl-4">Nombre de tu Mascota</label>
                <input
                  type="text"
                  value={tempPetName}
                  onChange={(e) => setTempPetName(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-[1.5rem] px-5 py-4 text-on-surface font-medium text-[15px] focus:outline-none focus:border-primary-fixed/30 focus:bg-surface-container transition-all placeholder:text-on-surface-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)_inset]"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <Button onClick={handleSaveConfig} variant="modal_highlighted" className="mb-1">
                <Check size={18} /> Guardar nombres
              </Button>
              <Button onClick={() => setModalType('edit_main')} variant="modal_normal">
                <Undo2 size={18} /> Regresar
              </Button>
            </div>
          </div>
        )
      };
    }
    return { message: "", video: null, actions: null };
  };

  const modalConfig = getModalConfig();

  return (
    <>
      <PageDepthWrapper isActive={modalType !== 'idle'} className="p-6 pt-8 pb-32 flex flex-col items-center">

        {/* 1. Header Hero (Foto de Perfil Estática) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex flex-col items-center mb-10 w-full mt-2">

          {/* Fondo de Brillo Estático (Aura) */}
          <div className="absolute top-4 w-60 h-60 bg-secondary/20 rounded-full blur-[70px] pointer-events-none" />

          {/* Contenedor Relativo para anclar el Pill Button */}
          <div className="relative z-10 mb-6">
            {/* Círculo Principal de la Foto */}
            <div className="w-48 h-48 rounded-full border-[5px] border-secondary shadow-[0_0_30px_rgba(236,185,200,0.2)] flex items-center justify-center bg-surface-container-highest overflow-hidden relative">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest to-surface-container opacity-80" />
                  <span className="relative z-10 text-on-surface-variant/50 text-xs font-display tracking-widest uppercase">Avatar</span>
                </>
              )}
            </div>

            {/* Edit Button (Pill en la parte inferior derecha con "recorte" visual) */}
            <button onClick={() => setModalType('edit_main')} className="absolute bottom-1 right-2 w-[3.25rem] h-[4.25rem] bg-primary-fixed text-on-primary-fixed rounded-[2rem] flex items-center justify-center border-[5px] border-background shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-transform z-20 cursor-pointer">
              <Pencil size={20} className="mb-1 ml-0.5 opacity-90 pointer-events-none" />
            </button>
          </div>

          {/* Textos: Nombre y Nivel */}
          <div className="text-center relative z-20 flex flex-col items-center">
            <h1 className="text-5xl font-display italic text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(220,184,255,0.2)] mb-3">{userName}</h1>
            <p 
              className="text-[11px] font-medium text-on-surface-variant uppercase tracking-[0.25em] cursor-default"
              onClick={handleSecretTap}
            >
              Nivel: {userLevel}
            </p>
          </div>
        </motion.div>

        {/* Lista Vertical de Estadísticas Históricas */}
        <div className="w-full flex flex-col gap-4 max-w-[340px] mb-8">
          {userStatistics.map((stat) => (
            <div key={stat.id} className="bg-surface-container-low border border-white/5 rounded-[2rem] p-6 pt-7 pb-7 shadow-[0_12px_30px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-3 transition-colors hover:bg-surface-container">
              <stat.icon size={22} strokeWidth={2.5} className={stat.colorClass} />
              <div className="flex flex-col items-center gap-2 mt-1">
                <span className="text-[28px] font-display text-on-surface drop-shadow-sm leading-none">{stat.value}</span>
                <span className="text-[9px] font-body text-on-surface-variant font-medium uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* BOTÓN DE CERRAR SESIÓN SIEMPRE VISIBLE */}
        <div className="w-full flex flex-col items-center gap-4 max-w-[340px] mt-4">
          <Button 
            variant="modal_normal" 
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="w-full bg-surface-container-highest/30 border border-white/5 py-4 rounded-[1.5rem] text-[12px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Cerrar Sesión
          </Button>
        </div>

        {/* 3. Zona de Pruebas (Debug) - OCULTA BAJO TAP SECRETO */}
        {showDev && (
          <div className="w-full flex flex-col items-center gap-4 max-w-[340px] mt-8 opacity-70 hover:opacity-100 transition-opacity p-4 border border-primary/20 rounded-3xl bg-primary/5">
            <div className="flex items-center justify-between w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Zona de Pruebas (Dev)</p>
              <button onClick={() => setShowDev(false)} className="text-[10px] font-bold uppercase text-on-surface-variant/50 hover:text-on-surface-variant">Cerrar</button>
            </div>
            
            {/* Indicadores de Necesidades (Movidos de SpiralPetPage) */}
            <div className="flex justify-between w-full px-6 py-4 bg-surface-container/30 rounded-[1.5rem] border border-white/5 mb-2">
              {petNeeds.map(need => (
                <div key={need.id} className="flex flex-col items-center gap-1">
                  <need.icon size={18} className={need.color} />
                  <span className="text-[11px] font-bold text-on-surface">{Math.round(need.value)}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="none" 
              onClick={() => useGameStore.setState({ lastResetDate: '2000-01-01' })}
              className="w-full bg-surface-container-highest/30 border border-white/5 py-4 rounded-[1.5rem] text-[12px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
            >
              Simular Día Pasado
            </Button>

            <Button 
              variant="none" 
              onClick={() => {
                const currentPage = useGameStore.getState().albumPage || 1;
                useGameStore.getState().setRewardState(currentPage, 'default');
                useGameStore.getState().resetRitualState();
                
                // Vaciar slots de la página actual y dejar pendingPlacementCard en null (cero tarjetas en mano)
                const currentSlots = useGameStore.getState().slots || [];
                const updatedSlots = currentSlots.map(s => {
                  if (s.pageId === currentPage) {
                    return { ...s, state: 'empty' };
                  }
                  return s;
                });
                
                useGameStore.setState({
                  slots: updatedSlots,
                  pendingPlacementCard: null
                });
                
                alert(`¡Ritual de la Página ${currentPage} reseteado manualmente con slots vacíos y cero tarjetas en mano!`);
              }}
              className="w-full bg-surface-container-highest/30 border border-white/5 py-4 rounded-[1.5rem] text-[12px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
            >
              <Undo2 size={14} className="inline mr-1 mb-0.5" /> Resetear Ritual (Manual)
            </Button>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mt-4">Spiral Degradación</p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button 
                variant="none" 
                onClick={() => useGameStore.getState().degradeNeedTest('water', 4)}
                className="bg-surface-container-highest/30 border border-white/5 py-3 rounded-[1rem] text-[11px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
              >
                Agua (-4 pts)
              </Button>
              <Button 
                variant="none" 
                onClick={() => useGameStore.getState().degradeNeedTest('food', 8)}
                className="bg-surface-container-highest/30 border border-white/5 py-3 rounded-[1rem] text-[11px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
              >
                Comida (-8 pts)
              </Button>
              <Button 
                variant="none" 
                onClick={() => useGameStore.getState().degradeNeedTest('play', 10)}
                className="bg-surface-container-highest/30 border border-white/5 py-3 rounded-[1rem] text-[11px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
              >
                Juego (-10 pts)
              </Button>
              <Button 
                variant="none" 
                onClick={() => useGameStore.getState().degradeNeedTest('clean', 24)}
                className="bg-surface-container-highest/30 border border-white/5 py-3 rounded-[1rem] text-[11px] text-on-surface-variant uppercase tracking-widest font-bold hover:bg-surface-container-highest/60 transition-all"
              >
                Baño (-24 pts)
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-2 w-full">
              <Button 
                variant="none" 
                onClick={() => {
                  useGameStore.setState((state) => ({
                    needs: { water: 100, food: 100, clean: 100, play: 100 },
                    lastDegradationTimestamp: Date.now()
                  }));
                  alert("¡Spiral ha sido curado! (Necesidades al 100%)");
                }}
                className="bg-primary/20 border border-primary/50 py-3 rounded-[1rem] text-[11px] text-primary-fixed uppercase tracking-widest font-bold hover:bg-primary/30 transition-all shadow-[0_0_15px_rgba(220,184,255,0.15)] w-full"
              >
                Curar a Spiral (Llenar al 100%)
              </Button>
            </div>

            {/* ZONA DE PRUEBAS DE CARTAS */}
            <div className="mt-8 pt-6 border-t border-primary/20 flex flex-col gap-3 w-full">
              <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em] font-bold text-center mb-2">Inyectar Cartas (Dev Only)</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button 
                    key={num}
                    variant="none" 
                    onClick={() => {
                      const slot = useGameStore.getState().slots.find(s => s.pageId === 1 && s.slotNum === num);
                      if(slot) {
                        useGameStore.setState({ pendingPlacementCard: slot });
                        alert(`¡Carta ${num} (${slot.title}) en mano! Ve al álbum para colocarla.`);
                      }
                    }}
                    className="bg-primary/10 border border-primary/30 py-2 px-4 rounded-lg text-[11px] text-primary-fixed uppercase tracking-widest font-bold hover:bg-primary/20 transition-all"
                  >
                    C{num}
                  </Button>
                ))}
              </div>
              <Button 
                variant="none" 
                onClick={() => {
                  const currentPage = useGameStore.getState().albumPage || 1;
                  const slots = useGameStore.getState().slots;
                  // Llenar los slots de la página actual
                  const updatedSlots = slots.map(s => s.pageId === currentPage ? { ...s, state: 'filled' } : s);
                  useGameStore.setState({ slots: updatedSlots });
                  // Resetear el estado de cobro para que isRitualReady vuelva a ser true
                  useGameStore.getState().setRewardState(currentPage, 'default');
                  useGameStore.getState().resetRitualState();
                  
                  alert(`¡Todas las cartas de la Página ${currentPage} están llenas! Ve al álbum para ver el ritual.`);
                }}
                className="mt-2 bg-secondary/10 border border-secondary/30 py-3 rounded-[1rem] text-[11px] text-secondary uppercase tracking-widest font-bold hover:bg-secondary/20 transition-all w-full"
              >
                Llenar Álbum (Forzar isRitualReady)
              </Button>
              <Button 
                variant="none" 
                onClick={() => {
                  useGameStore.setState({ pendingPlacementCard: null });
                  alert("¡Cartas quitadas de la mano!");
                }}
                className="mt-2 bg-error/10 border border-error/30 py-3 rounded-[1rem] text-[11px] text-error uppercase tracking-widest font-bold hover:bg-error/20 transition-all w-full"
              >
                Quitar carta de la mano
              </Button>
            </div>
          </div>
        )}

      </PageDepthWrapper>

      {/* Capa de modales */}
      <ActionModalOverlay isActive={modalType !== 'idle'}>
        <SpiralMessage message={modalConfig.message} video={modalConfig.video} isOverlayMode={true} delay={0} />
        {modalConfig.actions}
      </ActionModalOverlay>
    </>
  );
}
