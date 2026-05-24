import { motion } from 'framer-motion';

export function GlassCard({ children, className = "", elevation = "low", delay = 0, ...props }) {
  // Tonal Layering logic instead of hard borders
  const elevations = {
    lowest: "bg-surface-container-lowest",
    low: "bg-surface-container-low",
    high: "bg-surface-container-high",
    highest: "bg-surface-container-highest shadow-[0_12px_40px_rgba(220,184,255,0.08)] backdrop-blur-xl"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`rounded-3xl ${elevations[elevation]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
