import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Envoltorio para darle el efecto de "Profundidad 3D" a la página (se encoge y se oscurece).
 */
export function PageDepthWrapper({ isActive, children, className = "" }) {
  return (
    <motion.div
      className={`origin-top ${className}`}
      animate={{ 
        scale: isActive ? 0.92 : 1, 
        filter: isActive ? 'brightness(0.35) saturate(0.8)' : 'brightness(1) saturate(1)'
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Capa superior (Modal) que se desliza desde abajo respetando la barra de navegación (pb-32).
 */
export function ActionModalOverlay({ isActive, children }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-32 bg-black/30 backdrop-blur-[2px] pointer-events-auto"
        >
          {/* El contenedor interior que desliza */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full relative flex flex-col items-center"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
