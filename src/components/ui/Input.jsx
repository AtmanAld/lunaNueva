import { useState } from 'react';
import { motion } from 'framer-motion';

export function Input({ className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Ghost Border */}
      <motion.div
        animate={{
          opacity: isFocused ? 1 : 0.15,
          boxShadow: isFocused ? "0 0 12px rgba(220,184,255,0.3)" : "none",
          borderColor: isFocused ? "var(--color-primary)" : "var(--color-outline-variant)"
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-xl border pointer-events-none"
      />
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded-xl outline-none placeholder:text-on-surface-variant transition-colors focus:bg-surface-container-low"
        {...props}
      />
    </div>
  );
}
