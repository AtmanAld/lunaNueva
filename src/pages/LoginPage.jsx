import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { supabase } from '../supabaseclient';
import { LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hydrateStoreFromSupabase, startSupabaseSync } from '../services/supabaseSync';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);

  const [fetchedAvatar, setFetchedAvatar] = useState(null);
  const [displayedAvatar, setDisplayedAvatar] = useState(null);
  const [isAnimatingSwap, setIsAnimatingSwap] = useState(false);

  // Efecto para buscar el avatar en Supabase
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (email.length > 5 && email.includes('@')) {
        const { data } = await supabase
          .from('profiles')
          .select('user_avatar')
          .eq('email', email)
          .single();

        if (data && data.user_avatar) {
          setFetchedAvatar(data.user_avatar);
        } else {
          setFetchedAvatar(null);
        }
      } else {
        setFetchedAvatar(null);
      }
    };

    const timeoutId = setTimeout(fetchUserAvatar, 500); // Debounce de 500ms
    return () => clearTimeout(timeoutId);
  }, [email]);

  // Efecto para animar el cambio cuando el avatar cambia de verdad
  useEffect(() => {
    if (fetchedAvatar !== displayedAvatar) {
      setIsAnimatingSwap(true);
      const timeout = setTimeout(() => {
        setDisplayedAvatar(fetchedAvatar);
        setIsAnimatingSwap(false);
      }, 300); // 300ms es el tiempo exacto cuando la escala llega a 0
      return () => clearTimeout(timeout);
    }
  }, [fetchedAvatar, displayedAvatar]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña");
      return;
    }

    setError('');
    setIsLoading(true);

    navigate('/', { replace: true });
    setIsExiting(true);

    setTimeout(async () => {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setIsExiting(false);
        setIsLoading(false);
        setError("Email o contraseña incorrectos");
      } else if (data?.user) {
        // Autenticación exitosa. Hidratamos Zustand ANTES de navegar al dashboard
        setIsHydrating(true);
        setIsLoading(false);
        
        await hydrateStoreFromSupabase(data.user.id);
        
        // Empezar la sincronización en background
        startSupabaseSync(data.user.id);

        // ¡Listo! Ahora sí montamos el dashboard que ya tendrá los datos
        navigate('/', { replace: true });
      }
    }, 600);
  };

  // Si estamos hidratando, ocultamos la UI por completo y dejamos el video y un mensaje
  if (isHydrating) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
        {/* Video de Fondo Animado (se mantiene) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30 scale-[1.25]"
          >
            <source src="/appBG.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/90" />
        </div>
        
        {/* Orbe de luz tenue */}
        <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-fixed font-display italic tracking-widest text-lg drop-shadow-md">
            Sincronizando el Coven...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      {/* Video de Fondo Animado */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 scale-[1.25]"
        >
          <source src="/appBG.mp4" type="video/mp4" />
        </video>
        {/* Capa de mezcla oscura para no deslumbrar y mantener la vibra "Coven" */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/90" />
      </div>

      <div className="absolute top-0 right-[-20%] w-[120%] h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Replicamos el PageDepthWrapper de Dashboard */}
      <div className="p-6 relative z-10 w-full h-full flex flex-col items-center">

        {/* HEADER INVISIBLE: Simula exactamente el espacio del título de la fase lunar del Dashboard */}
        <div className="mb-8 mt-2 space-y-1 relative z-10 text-center opacity-0 pointer-events-none select-none">
          <h1 className="text-lg sm:text-xl font-display leading-tight tracking-wide">
            Fase Lunar Placeholder
          </h1>
          <p className="text-xs sm:text-sm tracking-widest font-medium">
            100%
          </p>
        </div>

        {/* Orbe Lunar Flotante - Alineado geométricamente con Dashboard */}
        <div className="sticky top-28 w-full flex items-center justify-center pointer-events-none z-0 mb-0 -mt-4">
          <motion.div
            animate={isExiting ? { scale: 0, opacity: 0 } : { y: [0, -10, 0] }}
            transition={
              isExiting
                ? { duration: 0.5, ease: "backIn" }
                : { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }
            className="relative flex flex-col items-center justify-center w-full"
          >
            <div
              className="absolute w-56 h-56 bg-primary rounded-full blur-[80px]"
              style={{ opacity: 0.2 }}
            />

            <motion.div
              animate={{ scale: isAnimatingSwap ? 0 : 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-56 h-56 rounded-full shadow-[0_12px_50px_rgba(220,184,255,0.25)] flex items-center justify-center relative overflow-hidden pointer-events-auto"
            >
              {displayedAvatar ? (
                <img
                  src={displayedAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#151219]/30 backdrop-blur-[4px] relative overflow-hidden flex items-center justify-center">
                  <img
                    src="/lunaLlena.png"
                    alt="Luna Llena"
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                    style={{ transform: 'scale(1.55)' }}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* GlassCard del Formulario libremente debajo */}
        <motion.div
          animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full max-w-[340px] z-10"
        >
          <GlassCard className="w-full border border-white/5 !bg-surface-container/20 p-6 pt-7 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-lg relative mt-2">

            <div className="text-center mb-5">
              <h1 className="text-4xl font-display italic text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(220,184,255,0.2)] mb-0.5">MyCoven</h1>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.1em] px-2 leading-relaxed opacity-80">
                Email y contraseña para entrar
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-[1.5rem] px-5 py-3.5 text-on-surface font-medium text-[15px] focus:outline-none focus:border-primary-fixed/40 focus:bg-surface-container transition-all placeholder:text-on-surface-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)_inset]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-[1.5rem] px-5 py-3.5 text-on-surface font-medium text-[15px] focus:outline-none focus:border-primary-fixed/40 focus:bg-surface-container transition-all placeholder:text-on-surface-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)_inset]"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-error text-[11px] text-center flex items-center justify-center gap-1.5 font-medium bg-error/10 py-1.5 rounded-xl border border-error/20 mt-1">
                      <AlertCircle size={12} /> {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2">
                <Button
                  type="submit"
                  variant="modal_highlighted"
                  className="w-full py-3.5 text-[15px] flex justify-center shadow-[0_0_20px_rgba(220,184,255,0.3)] relative overflow-hidden group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full" />
                      Entrando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn size={18} /> Entrar
                    </span>
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </div>
            </form>

          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
