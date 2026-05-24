import { ChevronRight } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
export function MenuAction({ icon: Icon, label, variant = 'primary', onClick }) {
  const variants = {
    primary: {
      text: "text-on-surface",
      circle: "bg-primary/10 text-primary-fixed-dim"
    },
    secondary: {
      text: "text-on-surface",
      circle: "bg-secondary/10 text-secondary"
    },
    danger: {
      text: "text-error",
      circle: "bg-error/10 text-error"
    }
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 pr-6 bg-surface-container-low rounded-[2rem] hover:bg-surface-container transition-colors active:scale-[0.98] focus:outline-none"
    >
      <div className="flex items-center gap-5">
        {/* Círculo interior encapsulando el ícono */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentVariant.circle} shadow-[0_2px_8px_rgba(0,0,0,0.2)]`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        
        {/* Leyenda sin serif */}
        <span className={`font-body font-medium text-[15px] tracking-wide ${currentVariant.text}`}>
          {label}
        </span>
      </div>
      
      {/* Indicador '>' para nueva pantalla */}
      <ChevronRight size={18} strokeWidth={2.5} className="text-on-surface-variant/40" />
    </button>
  );
}
