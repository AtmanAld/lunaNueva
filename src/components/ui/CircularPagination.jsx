import { Lock, Check } from 'lucide-react';

export function CircularPagination({ pages = [], activePageId = 1, onPageClick }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {pages.map((page) => {
        const isLocked = page.state === 'locked';
        const isActive = page.id === activePageId;
        const isClaimed = page.rewardState === 'claimed_400' || page.rewardState === 'claimed_300';

        return (
          <div
            key={page.id}
            className="flex flex-col items-center gap-3 group"
          >
            {/* El Círculo (Vaso de líquido estelar) */}
            <button
              onClick={() => onPageClick?.(page)}
              className={`
                w-10 h-10 rounded-full relative overflow-hidden flex items-center justify-center transition-all duration-500 shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                ${isLocked
                  ? 'bg-surface-container-lowest border border-outline-variant/10 cursor-pointer hover:border-outline-variant/30'
                  : isActive
                    ? `bg-surface-container border ${isClaimed ? 'border-[#C292A1]/80 shadow-[0_0_15px_rgba(194,146,161,0.35)]' : page.isSuperFullMoon ? 'border-[#E1D5E7]/40 shadow-[0_2px_8px_rgba(225,213,231,0.15)]' : 'border-primary/40 shadow-[0_0_12px_rgba(106,74,139,0.2)]'}`
                    : `bg-surface-container border ${isClaimed ? 'border-[#C292A1]/40 shadow-[0_0_8px_rgba(194,146,161,0.15)]' : 'border-white/5 hover:border-primary/20 hover:bg-surface-container-high'}`
                }
              `}
            >
              {isLocked ? (
                <Lock size={16} className="text-on-surface-variant opacity-60" />
              ) : (
                <>
                  {/* Capa de Relleno Líquido "Informativo-Visual" (El % de tarjetas) */}
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out z-0 ${
                      isClaimed
                        ? 'bg-[#C292A1]/65 shadow-[0_0_12px_rgba(194,146,161,0.4)]'
                        : page.isSuperFullMoon
                        ? 'bg-[#E1D5E7]/35 shadow-[0_2px_8px_rgba(225,213,231,0.15)]'
                        : 'bg-primary/30'
                    }`}
                    style={{ width: `${page.progress || 0}%` }}
                  />
                  {/* Destello sutil de completitud si el vaso está lleno al 100% */}
                  {page.progress >= 100 && (
                    <div className={`absolute inset-0 z-10 animate-pulse ${isClaimed || page.isSuperFullMoon ? 'bg-[#E1D5E7]/20' : 'bg-primary/20'}`} />
                  )}
                  {isClaimed && (
                    <Check size={16} className="text-[#120F16] stroke-[3.5] z-20 drop-shadow-[0_1px_2px_rgba(225,213,231,0.6)]" />
                  )}
                </>
              )}
            </button>

            {/* Número de la Página Abajo */}
            <span className={`
              text-[11px] font-medium tracking-widest uppercase transition-colors
              ${isActive
                ? (isClaimed ? 'text-[#C292A1] drop-shadow-[0_0_6px_rgba(194,146,161,0.4)]' : 'text-primary')
                : isLocked
                  ? 'text-on-surface-variant/40'
                  : (isClaimed ? 'text-[#C292A1]/70' : 'text-on-surface-variant group-hover:text-on-surface')
              }
            `}>
              {String(page.id).padStart(2, '0')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
