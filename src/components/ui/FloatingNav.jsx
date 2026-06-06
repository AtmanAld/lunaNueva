import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Cat, BookHeart, User, ShoppingBag } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export function FloatingNav() {
  const location = useLocation();
  const path = location.pathname;
  const isDashboard = path === '/';
  
  const moonPhaseName = useGameStore(state => state.moonPhase?.name);
  const isMoonCelebrationActive = useGameStore(state => state.isMoonCelebrationActive);

  const isLocked = isMoonCelebrationActive || (isDashboard && moonPhaseName === "Luna Llena");

  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/spiral', icon: Cat, label: 'Mascota' },
    { to: '/album', icon: BookHeart, label: 'Álbum' },
    { to: '/store', icon: ShoppingBag, label: 'Tienda' }
  ];

  return (
    <div 
      className="fixed bottom-6 w-full flex justify-center z-50 pointer-events-none px-4 transition-all duration-700 ease-in-out"
      style={{
        transform: isLocked ? 'translateY(150px)' : 'translateY(0)',
        opacity: isLocked ? 0 : 1,
      }}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center justify-between px-6 py-4 rounded-[2rem] bg-surface-container-highest/60 backdrop-blur-2xl shadow-[0_12px_40px_rgba(21,18,25,0.8)] border border-primary/10 w-full max-w-sm pointer-events-auto"
      >
        {links.map((link) => {
          const isActive = path === link.to;
          const Icon = link.icon;
          
          return (
            <Link key={link.to} to={link.to} className="relative flex flex-col items-center justify-center group outline-none">
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-all duration-300 ${isActive ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(220,184,255,0.6)]' : 'text-on-surface-variant group-hover:text-primary/70'}`}
              />
              {isActive && (
                <motion.div 
                  layoutId="navIndicator"
                  className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(220,184,255,1)]"
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
