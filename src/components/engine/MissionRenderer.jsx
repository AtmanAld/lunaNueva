import { useGameStore } from '../../store/useGameStore';
import { selectMissionNode } from '../../store/slices/createEngineSlice';
import { GlassCard } from '../ui/GlassCard';
import { HoldToCompleteButton } from '../ui/HoldToCompleteButton';

// El componente interno para la tarjeta de Dashboard
function DashboardActivityCard({ nodeInfo }) {
  const { node, staticData } = nodeInfo;
  
  const isCompleted = node.status === 'completed';
  const isSpecial = staticData.id === 'm_consumir_polvo_lunar';
  
  const handleComplete = () => {
    // EN LA FASE 3: Aquí llamaremos a `engineSlice.completeMission()`
    console.log("Completado (Pendiente de enrutar al motor):", staticData.id);
  };

  // Derivamos el texto de duración o valor
  const displayCount = node.progress > 0 ? node.progress : staticData.execution.targetValue;
  
  const getPluralizedText = (count, unit) => {
    if (count === 1) return unit;
    if (unit && unit.endsWith('z')) return unit.slice(0, -1) + 'ces';
    return unit ? unit + 's' : '';
  };
  
  const durationText = `${displayCount} ${getPluralizedText(displayCount, staticData.meta.valueUnit || 'vez')}`;
  
  // Cálculo de estrellas desde outcomes
  const starsAmount = staticData.outcomes?.onComplete?.currencies?.find(c => c.type === 'stars')?.amount || 0;

  return (
    <GlassCard
      elevation={isCompleted ? "lowest" : "low"}
      className={`group transition-colors duration-500 relative border overflow-hidden !bg-surface-container/20 backdrop-blur-lg ${isCompleted ? 'border-primary/20 opacity-80' : 'border-transparent hover:!bg-surface-container/40'}`}
    >
      {/* El HoldToCompleteButton envuelve internamente el contenido, permitiendo que la barra de llenado se dibuje SOBRE el GlassCard pero DEBAJO del texto */}
      <HoldToCompleteButton 
        isCompleted={isCompleted} 
        onComplete={handleComplete}
        durationMs={6000} // 6 segundos de llenado lento
      >
        <div className="p-5 flex items-center justify-between w-full h-full pointer-events-none">
          <div className="relative z-10 flex items-center gap-4 flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${isCompleted || isSpecial ? 'bg-gradient-to-br from-primary-fixed to-primary shadow-[0_0_15px_rgba(220,184,255,0.4)] border-transparent' : 'bg-transparent border-[1.5px] border-outline-variant/50 group-hover:border-primary/50'}`}>
              {isCompleted ? (
                <svg className="w-5 h-5 text-on-primary-fixed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isSpecial ? (
                <span className="text-sm">✨</span>
              ) : null}
            </div>

            <div className="flex flex-col mt-0.5">
              <h4 className={`transition-colors text-[0.95rem] leading-snug mb-0.5 ${isCompleted ? 'text-on-surface-variant line-through' : 'text-on-surface group-hover:text-primary'}`}>
                {staticData.meta.title}
              </h4>
              <p className={`uppercase tracking-widest text-[0.62rem] font-medium transition-colors flex items-center gap-1.5 ${isCompleted || isSpecial ? 'text-primary' : 'text-tertiary'}`}>
                <span>{staticData.meta.category}</span>
                <span className="text-[10px] opacity-40">&bull;</span>
                <span>{durationText}</span>
              </p>
            </div>
          </div>

          <div className={`relative z-10 flex items-center justify-center font-bold transition-all duration-300 ${isCompleted ? 'opacity-40 grayscale' : 'text-primary-fixed-dim'}`}>
            <span className="flex items-center gap-1 text-[12px] leading-none">
              {isSpecial ? (
                <>
                  <span className="leading-none">+20</span>
                  <span className="text-[14px] leading-none -translate-y-[1.5px] select-none">🌙</span>
                </>
              ) : (
                <>
                  <span className="leading-none">{starsAmount}</span>
                  <span className="text-[14px] leading-none -translate-y-[1.5px] select-none">⭐</span>
                </>
              )}
            </span>
          </div>
        </div>
      </HoldToCompleteButton>
    </GlassCard>
  );
}

export function MissionRenderer({ nodeId, variant = "dashboard_activity" }) {
  const nodeInfo = useGameStore(state => selectMissionNode(state, nodeId));

  // Fallback seguro: si el nodo no existe en el catálogo, no se dibuja
  if (!nodeInfo || !nodeInfo.staticData) return null;

  switch (variant) {
    case "dashboard_activity":
      return <DashboardActivityCard nodeInfo={nodeInfo} />;
    
    default:
      console.warn(`Variante visual '${variant}' no implementada en MissionRenderer.`);
      return null;
  }
}
