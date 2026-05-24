import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SpiralMessage } from './SpiralMessage';
import './PentacleRitualOverlay.css';
import { useGameStore } from '../../store/useGameStore';
import { spiralCatalog } from '../../data/spiralCatalog';

/**
 * Interactive screen overlay that handles the multi-step reward ritual.
 * Plays seven video steps in sequence (rewardStep1 to rewardStep7), prompting
 * the player with a magical Spiral dialog at the end of each video to advance.
 */
export function PentacleRitualOverlay({ isActive, onVideoEnded }) {
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'video' | 'fadeout'
  const [showBubble, setShowBubble] = useState(false);
  const videoRef = useRef(null);

  const userName = useGameStore(state => state.userName) || 'Amelia';
  const ritualState = useGameStore(state => state.ritualState) || { phase: 'idle', step: 1, rewards: null };
  const currentStep = ritualState.step;
  const advanceRitualStep = useGameStore(state => state.advanceRitualStep);

  // Dynamic step config resolver
  const resolveStepConfig = (step, name, rewards) => {
    const catalogEntry = spiralCatalog[`RITUAL_STEP_${step}`];
    if (!catalogEntry) return null;

    let rewardText = '';
    if (step === 1 && rewards?.reward1) rewardText = rewards.reward1.text;
    if (step === 2 && rewards?.reward2) rewardText = rewards.reward2.text;
    if (step === 3 && rewards?.reward3) rewardText = rewards.reward3.text;

    const replacements = {
      userName: name,
      rewardText: rewardText || 'un objeto estelar'
    };

    let message = Array.isArray(catalogEntry.text) ? catalogEntry.text[0] : catalogEntry.text;
    Object.entries(replacements).forEach(([key, val]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      message = message.replace(regex, val);
    });

    const actionConfig = (catalogEntry.actionConfig || []).map(action => {
      let label = action.label || '';
      let data = action.data || '';
      Object.entries(replacements).forEach(([key, val]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        label = label.replace(regex, val);
        if (typeof data === 'string') {
          data = data.replace(regex, val);
        }
      });
      return { ...action, label, data };
    });

    return {
      message,
      actionConfig,
      video: catalogEntry.video || 'assets/videos/spiral_message.mp4'
    };
  };

  const currentStepConfig = resolveStepConfig(currentStep, userName, ritualState.rewards) || { message: '', actionConfig: [] };

  useEffect(() => {
    if (isActive && phase === 'hidden') {
      setPhase('video');
      setShowBubble(false);
    }

    if (!isActive && phase !== 'hidden') {
      setPhase('hidden');
    }
  }, [isActive, phase]);

  const handleVideoEnd = () => {
    // When the current video ends, show the Spiral message bubble to request interaction
    setShowBubble(true);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || showBubble) return;

    const time = videoRef.current.currentTime;

    if (currentStep === 1 && time >= 7.56) {
      videoRef.current.pause();
      setShowBubble(true);
    } else if (currentStep === 6 && time >= 6.19) {
      videoRef.current.pause();
      setShowBubble(true);
    }
  };

  const handleNextStep = (action) => {
    setShowBubble(false);
    if (action?.type === 'ADVANCE_RITUAL') {
      advanceRitualStep();
    } else if (action?.type === 'COMPLETE_RITUAL') {
      // Finished all 7 steps
      setPhase('fadeout');
      setTimeout(() => {
        setPhase('hidden');
        useGameStore.getState().resetRitualState();
        onVideoEnded?.();
      }, 600);
    } else {
      // Fallback
      if (currentStep < 7) {
        advanceRitualStep();
      } else {
        setPhase('fadeout');
        setTimeout(() => {
          setPhase('hidden');
          useGameStore.getState().resetRitualState();
          onVideoEnded?.();
        }, 600);
      }
    }
  };

  if (phase === 'hidden') return null;

  const showVideo = phase === 'video' || phase === 'fadeout';
  const isFadingOut = phase === 'fadeout';

  return (
    <div className={`ritual-overlay ${isFadingOut ? 'ritual-overlay--fadeout' : ''}`}>
      {/* Background layer */}
      <div className="ritual-bg ritual-bg--visible" />

      {/* Video Container */}
      {showVideo && (
        <div className="ritual-video-container ritual-video-container--visible" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <video
            key={currentStep}
            ref={videoRef}
            src={`/Album Mágico/rewardStep${currentStep}.mp4`}
            autoPlay
            playsInline
            className={currentStep === 1 ? 'ritual-video ritual-video--step1' : 'ritual-video'}
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      )}

      {/* Centered $300 display with animations on step 7 */}
      {currentStep === 7 && showBubble && (
        <>
          <ConfettiEffect />
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 90, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          >
            <span className="text-7xl font-extrabold tracking-widest bg-gradient-to-r from-[#E1D5E7] via-[#C292A1] to-[#6A4A8B] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(194,146,161,0.65)]">
              $300
            </span>
          </motion.div>
        </>
      )}

      {/* Spiral message bubble overlay */}
      {showBubble && (
        <div className="absolute inset-x-0 bottom-16 z-50 flex justify-center items-center px-4">
          <SpiralMessage
            message={currentStepConfig.message}
            actionConfig={currentStepConfig.actionConfig}
            onAction={handleNextStep}
            isOverlayMode={true}
            video={currentStepConfig.video}
            variant={(currentStep === 5 || currentStep === 6) ? 'bubble-only' : 'default'}
            tailPosition={(currentStep === 5 || currentStep === 6) ? 'top-center' : 'bottom-left'}
          />
        </div>
      )}
      {/* Botón de Debugging para Saltarse el Ritual */}
      {currentStep <= 5 && (
        <button
          onClick={() => {
            setPhase('fadeout');
            setTimeout(() => {
              setPhase('hidden');
              useGameStore.getState().resetRitualState();
              onVideoEnded?.();
            }, 600);
          }}
          className="absolute top-8 right-6 z-[9999] bg-[#FF3B30] text-white px-4 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-lg opacity-60 hover:opacity-100 transition-all"
        >
          Skip Ritual
        </button>
      )}

    </div>
  );
}

function ConfettiEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#E1D5E7', '#C292A1', '#6A4A8B', '#FFF0FF', '#D8B4F8', '#FFD6EC', '#D4AF37'];
    const shapes = ['rect', 'circle', 'streamer'];

    // Generar 80 partículas (serpentinas y confetti)
    const generated = Array.from({ length: 80 }).map((_, i) => {
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const duration = 4.0 + Math.random() * 3.5; // 4s a 7.5s para caída elegante
      const delay = Math.random() * 2.5; // retraso escalonado
      const sizeScale = 0.5 + Math.random() * 0.9;
      const rotation = Math.random() * 360;

      return {
        id: i,
        left: `${left}%`,
        color,
        shape,
        duration: `${duration}s`,
        delay: `${delay}s`,
        sizeScale,
        rotation: `${rotation}deg`
      };
    });

    setParticles(generated);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((p) => {
        let style = {
          left: p.left,
          backgroundColor: p.color,
          animationDuration: p.duration,
          animationDelay: p.delay,
          transform: `rotate(${p.rotation}) scale(${p.sizeScale})`,
        };

        let shapeClass = '';
        if (p.shape === 'rect') {
          shapeClass = 'w-3.5 h-6 rounded-[2px]';
        } else if (p.shape === 'circle') {
          shapeClass = 'w-3 h-3 rounded-full';
        } else {
          // Streamer (Serpentina) larga y delgada
          shapeClass = 'w-1.5 h-16 rounded-full opacity-80';
        }

        return (
          <div
            key={p.id}
            className={`confetti-particle ${shapeClass}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
