import { useState, useRef, useEffect } from 'react';

export function HoldToCompleteButton({ 
  onComplete, 
  isCompleted, 
  durationMs = 6000, 
  children,
  className = "" 
}) {
  const [progress, setProgress] = useState(isCompleted ? 100 : 0);
  const [isHolding, setIsHolding] = useState(false);
  const startTimeRef = useRef(null);
  const requestRef = useRef(null);

  // Si se completa por un estado global o externamente
  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      setIsHolding(false);
    } else {
      setProgress(0);
    }
  }, [isCompleted]);

  const animate = (time) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    
    // Calcula porcentaje (0 a 100)
    const currentProgress = Math.min((elapsed / durationMs) * 100, 100);
    setProgress(currentProgress);

    if (currentProgress < 100) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Completado!
      setIsHolding(false);
      setProgress(100);
      if (onComplete) onComplete();
    }
  };

  const handlePointerDown = (e) => {
    // Solo permitir clic principal (izquierdo) o touch
    if (e.button && e.button !== 0) return;
    if (isCompleted) return;
    
    setIsHolding(true);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  };

  const handlePointerUpOrLeave = () => {
    if (isCompleted) return;
    setIsHolding(false);
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Regresa el progreso a 0 inmediatamente con la transición CSS
    setProgress(0);
  };

  // Prevenimos el menú contextual en móviles al dejar presionado
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`relative w-full h-full cursor-pointer touch-none select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      onContextMenu={handleContextMenu}
    >
      {/* Capa de Llenado Visual */}
      <div 
        className="absolute inset-0 bg-primary/20 origin-left z-0"
        style={{
          transform: `scaleX(${progress / 100})`,
          transition: isHolding ? 'none' : 'transform 0.3s ease-out'
        }}
      />
      {/* Contenido interactivo */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
