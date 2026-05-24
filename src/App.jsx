import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { SpiralPetPage } from './pages/SpiralPetPage';
import { AlbumPage } from './pages/AlbumPage';
import { ProfilePage } from './pages/ProfilePage';
import { StorePage } from './pages/StorePage';
import { FloatingNav } from './components/ui/FloatingNav';
import { TopBar } from './components/ui/TopBar';
import { DayTransitionOverlay } from './components/ui/DayTransitionOverlay';
import { useGameStore } from './store/useGameStore';

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
        </Routes>
        <FloatingNav />
      </div>
    </Router>
  );
}
