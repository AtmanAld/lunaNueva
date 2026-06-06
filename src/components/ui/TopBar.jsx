
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

export function TopBar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  
  const userStars = useGameStore(state => state.userStars);
  const userName = useGameStore(state => state.userName);
  const userAvatar = useGameStore(state => state.userAvatar);
  const moonPhaseName = useGameStore(state => state.moonPhase?.name);
  const isMoonCelebrationActive = useGameStore(state => state.isMoonCelebrationActive);

  const isLocked = isMoonCelebrationActive || (isDashboard && moonPhaseName === "Luna Llena");

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 z-50 flex items-center justify-between px-6 transition-all duration-700 ease-in-out"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(4rem + env(safe-area-inset-top))',
        transform: isLocked ? 'translateY(-100%)' : 'translateY(0)',
        opacity: isLocked ? 0 : 1,
        pointerEvents: isLocked ? 'none' : 'auto'
      }}
    >
      {/* Lado Izquierdo: Avatar (Link al Perfil) y Nombre */}
      <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-container to-surface-container-high border justify-center items-center flex border-primary/30 shadow-[0_0_8px_rgba(220,184,255,0.2)] overflow-hidden">
          {userAvatar ? (
            <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">🌌</span>
          )}
        </div>
        <span className="font-display font-medium text-on-surface">{userName}</span>
      </Link>

      {/* Lado Derecho: Chip de Estrellas Activo */}
      <motion.div 
        key={`chip-${userStars}`}
        animate={userStars > 0 ? { 
          scale: [1, 1.15, 1],
          filter: [
            "drop-shadow(0 0 0px rgba(255,215,0,0))",
            "drop-shadow(0 0 15px rgba(255,215,0,0.8))",
            "drop-shadow(0 0 0px rgba(255,215,0,0))"
          ]
        } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)_inset] border border-white/5"
      >
        <motion.span
          key={`icon-${userStars}`}
          initial={{ scale: 0.5, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="text-xs filter drop-shadow-[0_0_8px_rgba(236,185,200,0.8)] shrink-0"
        >
          ⭐
        </motion.span>

        {/* Usamos un gemelo invisible para empujar el ancho orgánicamente y posicionamos el animado absoluto */}
        <div className="relative flex items-center justify-center">
          <span className="text-sm font-medium opacity-0 select-none pointer-events-none" aria-hidden="true">{userStars}</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={userStars}
              initial={{ y: -15, opacity: 0, position: 'absolute' }}
              animate={{ y: 0, opacity: 1, position: 'absolute' }}
              exit={{ y: 15, opacity: 0, position: 'absolute' }}
              transition={{ type: "tween", duration: 0.2 }}
              className="text-sm font-medium text-on-surface"
            >
              {userStars}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
