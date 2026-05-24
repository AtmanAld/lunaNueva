import { motion } from 'framer-motion';

export function Button({ children, variant = "primary", className = "", ...props }) {
  // The 'No-Line' Rule: Rely on gradients and backdrop blurs
  const baseStyles = "px-6 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 outline-none";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary to-secondary text-on-primary-fixed shadow-[0_8px_24px_rgba(220,184,255,0.12)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(220,184,255,0.2)]",
    glass: "bg-surface-container-high/40 backdrop-blur-xl shadow-[0_0_0_1px_rgba(220,184,255,0.15)] text-on-surface hover:shadow-[0_0_12px_rgba(220,184,255,0.3)_inset,0_0_0_1px_rgba(220,184,255,0.4)]",
    ghost: "text-secondary hover:bg-surface-container-low",
    normal: "bg-surface-container-highest/50 text-on-surface border border-white/5 hover:bg-surface-container-highest transition-colors shadow-sm",
    none: "bg-transparent", // Fallback for raw overrides
    modal_highlighted: "bg-gradient-to-br from-primary to-secondary text-on-primary-fixed shadow-[0_0_24px_rgba(220,184,255,0.2)] hover:-translate-y-[2px] hover:shadow-[0_4px_32px_rgba(220,184,255,0.3)] !py-3.5 !rounded-full !text-[15px]",
    modal_normal: "bg-[#1E1A22] border border-[#231F26] text-[#EADDFF] shadow-lg hover:bg-[#2A2430] hover:border-[#352D3D] transition-colors !py-3.5 !rounded-full !text-[15px]" // El estilo "Mejor luego" ahora es global
  };

  return (
    <motion.button 
      whileTap={props.disabled ? undefined : { scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${props.disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
}
