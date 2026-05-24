export function Chip({ children, active = false, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-full font-medium text-[13px] tracking-wide transition-all duration-300 whitespace-nowrap
        ${active 
          ? 'bg-primary-fixed text-on-primary-fixed shadow-[0_2px_12px_rgba(220,184,255,0.2)]' 
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
