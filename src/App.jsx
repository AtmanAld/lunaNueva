import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseclient';
import { DashboardPage } from './pages/DashboardPage';
import { SpiralPetPage } from './pages/SpiralPetPage';
import { AlbumPage } from './pages/AlbumPage';
import { ProfilePage } from './pages/ProfilePage';
import { StorePage } from './pages/StorePage';
import { LoginPage } from './pages/LoginPage';
import { FloatingNav } from './components/ui/FloatingNav';
import { TopBar } from './components/ui/TopBar';
import { DayTransitionOverlay } from './components/ui/DayTransitionOverlay';
import { useGameStore } from './store/useGameStore';
import { hydrateStoreFromSupabase, startSupabaseSync } from './services/supabaseSync';

function NavigationHandler() {
  const navigate = useNavigate();
  const pendingNavigation = useGameStore(state => state.pendingNavigation);
  const clearNavigation = useGameStore(state => state.clearNavigation);

  useEffect(() => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
      clearNavigation();
    }
  }, [pendingNavigation, navigate, clearNavigation]);

  return null;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual al cargar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await hydrateStoreFromSupabase(session.user.id);
        startSupabaseSync(session.user.id);
      }
      setSession(session);
      setIsLoading(false);
    });

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Nota: Si el login vino desde LoginPage, el setSession causará el renderizado
      // de la app principal (Dashboard) que ya fue hidratado en LoginPage.
      if (!session) {
        setSession(null);
      } else if (!isLoading) {
        // En caso de que se pierda y recupere la sesión
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoading]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"></div>;
  }

  // Si no hay sesión, renderizar solo la pantalla de Login (sin NavBar ni TopBar)
  if (!session) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  // App principal (Protegida)
  return (
    <Router>
      <NavigationHandler />
      <DayTransitionOverlay />
      {/* pt-16 dinámico asignado para el espaciado correcto bajo la TopBar fija con notch/safe-area */}
      <div 
        className="min-h-screen bg-background text-on-surface font-body pb-24 selection:bg-primary/30"
        style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }}
      >
        <TopBar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/spiral" element={<SpiralPetPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingNav />
      </div>
    </Router>
  );
}
