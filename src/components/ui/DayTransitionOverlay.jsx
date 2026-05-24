import { useGameStore } from '../../store/useGameStore';
import { useEffect, useState, useRef } from 'react';

export function DayTransitionOverlay() {
  const isTransitioning = useGameStore(state => state.isDayTransitioning);
  const [shouldRender, setShouldRender] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isTransitioning) {
      setShouldRender(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(err => console.log("Video play failed:", err));
      }
    } else {
      // Pequeño retardo para el fadeOut final antes de desmontar
      const timeout = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  useEffect(() => {
    // Si se monta y está la transición activa, reproducir
    if (shouldRender && videoRef.current && isTransitioning) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  }, [shouldRender, isTransitioning]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden bg-black"
      style={{
        animation: isTransitioning ? 'fadeIn 0.3s forwards' : 'fadeOut 0.8s forwards'
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>

      <video
        ref={videoRef}
        src="/newDay.mp4"
        className="w-full h-full object-cover"
        style={{
          transform: 'scale(1.15)',
          transformOrigin: 'top center'
        }}
        muted
        playsInline
        autoPlay
      />
    </div>
  );
}
