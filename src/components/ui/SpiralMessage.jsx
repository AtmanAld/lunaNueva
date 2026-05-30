import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, Store, ChevronRight, Star, Settings, Undo2 } from 'lucide-react';

import { Button } from './Button';

const ICON_MAP = {
  check: Check,
  cancel: X,
  back: ArrowLeft,
  store: Store,
  next: ChevronRight,
  star: Star,
  settings: Settings,
  undo: Undo2
};

export function SpiralMessage({
  message,
  actionConfig = [],
  onAction = null,
  delay = 0,
  isOverlayMode = false,
  actionButton = null,
  video = null,
  variant = 'default', // 'default' | 'bubble-only'
  tailPosition = 'bottom-left', // 'bottom-left' | 'top-center'
  disabled = false,
  bgImage = null,
  centerContent = false, // Propiedad agregada para no indentar (mejora V4)
  className = ''
}) {
  // Separamos el string para animar en ráfaga (typewriter)
  const characters = Array.from(message || "");

  const isBubbleOnly = variant === 'bubble-only';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } }}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`w-full max-w-sm mx-auto px-4 flex flex-col items-center gap-3 pointer-events-none ${isOverlayMode ? 'relative z-10' : 'fixed bottom-28 left-0 right-0 z-40'
        } ${className}`}
    >
      <div className={`flex items-end gap-3 w-full pointer-events-auto ${isBubbleOnly ? 'justify-center' : ''}`}>
        {/* Columna de Avatar con VIDEO dinámico (Opcional) */}
        {!isBubbleOnly && (
          <div className="flex flex-col items-center shrink-0 mb-1">
            <div className="w-[3.5rem] h-[3.5rem] rounded-[1.25rem] bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary-fixed/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {video ? (
                <video
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest text-center leading-tight">Arte<br />Spiral</span>
              )}
            </div>
          </div>
        )}

        {/* Burbuja de Mensaje */}
        <div 
          className={`relative px-5 py-3.5 rounded-[1.5rem] shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-white/5 flex-1 z-10 flex flex-col justify-center ${!bgImage ? 'bg-surface-container-high' : ''} ${isBubbleOnly ? 'text-center max-w-[320px]' : 'rounded-bl-[4px]'}`}
          style={bgImage ? { backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          {/* Colita de la burbuja (Tail) */}
          {tailPosition === 'bottom-left' && (
            <div className="absolute -left-1.5 bottom-3 w-4 h-4 bg-surface-container-high rounded-[2px] border-b border-l border-white/5 rotate-45 -z-10" />
          )}
          {tailPosition === 'top-center' && (
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 bg-surface-container-high rounded-[2px] border-t border-l border-white/5 rotate-45 -z-10" />
          )}

          <p className="text-on-surface text-[0.82rem] font-medium leading-relaxed tracking-wide min-h-[1.5rem]">
            {!isBubbleOnly && <span className="text-primary-fixed drop-shadow-[0_0_8px_rgba(220,184,255,0.3)] font-bold mr-2 italic">Spiral:</span>}
            {characters.map((char, index) => (
              <motion.span
                key={`${message}-char-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: index * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
          </p>
        </div>
      </div>

      {/* Custom Action Button (from AlbumPage for example) */}
      {actionButton && (
        <div className={`w-full ${isBubbleOnly || centerContent ? 'flex justify-center' : 'pl-[3.75rem]'} pointer-events-auto flex gap-2 flex-wrap`}>
          {actionButton}
        </div>
      )}

      {/* Botones de Acción Condicionales */}
      {actionConfig && actionConfig.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: disabled ? 0 : 1, scale: disabled ? 0.95 : 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className={`w-full ${isBubbleOnly || centerContent ? 'px-8 max-w-[340px] mx-auto' : 'pl-[4.25rem]'} ${disabled ? 'pointer-events-none' : 'pointer-events-auto'} flex flex-col gap-3 mt-1`}
        >
          {actionConfig.map((action, idx) => {
            const Icon = action.icon ? ICON_MAP[action.icon] : null;
            const isModalButton = action.variant && action.variant.startsWith('modal_');
            return (
              <Button
                key={idx}
                onClick={() => !disabled && onAction && onAction(action)}
                variant={isModalButton ? action.variant : ((action.variant === 'primary' || action.variant === 'highlighted') ? 'primary' : 'normal')}
                className={isModalButton ? "w-full mb-1" : "w-full py-2.5 rounded-[1.5rem] font-bold tracking-widest uppercase text-[10px]"}
              >
                {Icon && <Icon size={isModalButton ? 18 : 16} strokeWidth={2.5} className={isModalButton ? "mr-1 mb-0.5 inline-block" : ""} />}
                {action.label}
              </Button>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
