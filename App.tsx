
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Tracks from './pages/Tracks';
import Cars from './pages/Cars';
import CompetitionCreate from './pages/CompetitionCreate';
import CompetitionSetup from './pages/CompetitionSetup';
import MyEvents from './pages/MyEvents';
import TournamentDetail from './pages/TournamentDetail';
import RaceDetail from './pages/RaceDetail';
import ResultEntry from './pages/ResultEntry';
import Notifications from './pages/Notifications';
import InvitationDetail from './pages/InvitationDetail';
import CompetitorProfile from './pages/CompetitorProfile';
import Simulators from './pages/Simulators';
import LandingPage from './pages/LandingPage';
import ConfirmModal from './components/ConfirmModal';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

import { useUserProfile } from './hooks/useFirestore';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center bg-app-bg-main text-app-text-title">Cargando...</div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { profile } = useUserProfile();
  const [notificationCount, setNotificationCount] = useState(0);

  React.useEffect(() => {
    if (!profile?.id) return;
    const q = query(
      collection(db, 'invitations'),
      where('receiverId', '==', profile.id),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setNotificationCount(snap.size);
    });
    return () => unsubscribe();
  }, [profile?.id]);

  // Create a default user object if profile is loading or missing
  const user = profile || {
    nickname: 'Cargando...',
    avatar: 'https://placehold.co/150', // Default placeholder
    class: '...'
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Inicio', icon: 'dashboard', path: '/dashboard' },
    { label: 'Mis Eventos', icon: 'calendar_month', path: '/my-events' },
    { label: 'Pistas', icon: 'map', path: '/tracks' },
    { label: 'Autos', icon: 'directions_car', path: '/cars' },
    { label: 'Simuladores', icon: 'sports_esports', path: '/simulators' },
    { label: 'Notificaciones', icon: 'notifications', path: '/notifications', badge: notificationCount },
    { label: 'Perfil', icon: 'person', path: '/profile' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    setLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-app-bg-main">
      {/* DESKTOP SIDEBAR */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-app-border bg-app-bg-secondary p-6 hidden lg:flex flex-shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-center py-2">
            <img src="/LogoFPVO.png" alt="FPVO Logo" className="h-12 w-auto object-contain" />
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                  ? 'bg-brand text-app-text-title shadow-lg shadow-brand/10'
                  : 'text-app-text-body hover:bg-app-bg-surface hover:text-app-text-title'
                  }`}
              >
                <div className="relative">
                  <span className={`material-symbols-outlined transition-colors ${isActive(item.path) ? 'text-app-text-title' : 'text-app-text-muted group-hover:text-app-text-title'}`} style={{ fontSize: '24px' }}>{item.icon}</span>
                  {item.badge && item.badge > 0 && !isActive(item.path) && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-app-status-error border-2 border-app-bg-secondary"></span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-bold tracking-wide text-sm">{item.label}</span>
                  {item.badge && item.badge > 0 && !isActive(item.path) && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-app-status-error text-[10px] font-bold text-white px-1.5">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          {/* SEED BUTTON FOR DEMO */}


          <div className="flex items-center gap-3 rounded-xl bg-app-bg-surface p-3 border border-app-border hover:border-brand/50 transition-all group relative">
            <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 ring-1 ring-brand/30 group-hover:ring-brand" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-app-text-title text-sm font-bold truncate group-hover:text-brand transition-colors">{user.nickname}</p>
                <p className="text-app-status-success text-xs font-medium truncate italic">● PRO</p>
              </div>
            </Link>
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="ml-auto text-app-text-muted hover:text-app-status-error transition-colors p-1"
              title="Cerrar Sesión"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-app-border bg-app-bg-secondary px-6 py-4 lg:hidden">
        <div className="flex items-center justify-center py-2">
          <img src="/LogoFPVO.png" alt="FPVO Logo" className="h-10 w-auto object-contain" />
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="text-app-text-title">
          <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>menu</span>
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeMenu}></div>
          <div className="absolute right-0 top-0 h-full w-64 bg-app-bg-secondary p-6 shadow-2xl transition-transform border-l border-app-border flex flex-col justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black italic text-app-text-title">MENÚ</h2>
                <button onClick={closeMenu} className="text-app-text-muted hover:text-app-text-title">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                      ? 'bg-brand text-app-text-title shadow-lg'
                      : 'text-app-text-body hover:bg-app-bg-surface hover:text-app-text-title'
                      }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{item.icon}</span>
                    <p className="font-bold">{item.label}</p>
                    {item.badge && !isActive(item.path) && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-app-status-error text-[10px] font-bold text-app-text-title">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 rounded-xl bg-app-bg-surface p-3 border border-app-border">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-app-text-title text-sm font-bold truncate">{user.nickname}</p>
                  <button
                    onClick={() => { setLogoutModalOpen(true); closeMenu(); }}
                    className="text-app-status-error text-xs font-bold text-left hover:underline uppercase tracking-wide mt-1">
                    Cerrar Sesión
                  </button>
                </div>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-app-bg-main pt-20 lg:pt-0 scroll-smooth">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* LOGOUT CONFIRM MODAL */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        title="¿Cerrar sesión?"
        message="¿Estás seguro de que deseas salir? Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmLabel="Cerrar Sesión"
        type="danger"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-events" element={<MyEvents />} />
                  <Route path="/competition-create" element={<CompetitionCreate />} />
                  <Route path="/competition-setup" element={<CompetitionSetup />} />
                  <Route path="/tournament/:id" element={<TournamentDetail />} />
                  <Route path="/tournament/:tournamentId/race/:raceId" element={<RaceDetail />} />
                  <Route path="/tournament/:tournamentId/race/:raceId/results" element={<ResultEntry />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/invitation/:id" element={<InvitationDetail />} />
                  <Route path="/tracks" element={<Tracks />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/simulators" element={<Simulators />} />
                  <Route path="/profile" element={<CompetitorProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
