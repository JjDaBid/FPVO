
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tracks from './pages/Tracks';
import Cars from './pages/Cars';
import CompetitionCreate from './pages/CompetitionCreate';
import CompetitionSetup from './pages/CompetitionSetup';
import MyEvents from './pages/MyEvents';
import TournamentDetail from './pages/TournamentDetail';
import ResultEntry from './pages/ResultEntry';
import Notifications from './pages/Notifications';
import InvitationDetail from './pages/InvitationDetail';
import CompetitorProfile from './pages/CompetitorProfile';
import ConfirmModal from './components/ConfirmModal';
import data from '@/data';

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user } = data;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Inicio', icon: 'dashboard', path: '/' },
    { label: 'Mis Eventos', icon: 'calendar_month', path: '/my-events' },
    { label: 'Pistas', icon: 'map', path: '/tracks' },
    { label: 'Autos', icon: 'directions_car', path: '/cars' },
    { label: 'Notificaciones', icon: 'notifications', path: '/notifications', badge: 3 },
    { label: 'Perfil', icon: 'person', path: '/profile' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-background-dark">
      {/* DESKTOP SIDEBAR */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-[#232f48] bg-[#111722] p-6 hidden lg:flex flex-shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-primary/20 p-2 text-primary">
              <span className="material-symbols-outlined font-black" style={{ fontSize: '28px' }}>bolt</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-2xl font-black leading-none tracking-tighter italic">FPVO</h1>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Control Center</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-[#92a4c9] hover:bg-[#232f48] hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive(item.path) ? 'text-white' : 'group-hover:text-white'}`} style={{ fontSize: '24px' }}>
                  {item.icon}
                </span>
                <p className={`text-sm leading-normal ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                {item.badge && !isActive(item.path) && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/profile" className="flex items-center gap-3 rounded-xl bg-[#192233] p-3 border border-[#232f48] hover:border-primary/50 transition-all group">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 ring-1 ring-primary/30 group-hover:ring-primary" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-white text-sm font-bold truncate group-hover:text-primary transition-colors">{user.nickname}</p>
            <p className="text-[#0bda5e] text-xs font-medium truncate italic">● PRO</p>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLogoutModalOpen(true); }}
            className="ml-auto text-[#92a4c9] hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          </button>
        </Link>
      </aside>

      {/* MOBILE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background-dark/80 backdrop-blur-md border-b border-[#232f48] px-6 py-4 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary font-black">bolt</span>
          <h1 className="text-white text-xl font-black italic">FPVO</h1>
        </div>
        <button className="text-white h-10 w-10 flex items-center justify-center rounded-lg hover:bg-[#232f48]" onClick={() => setMobileMenuOpen(true)}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu} />
        <aside className={`absolute left-0 top-0 h-full w-80 bg-[#111722] border-r border-[#232f48] p-6 flex flex-col justify-between transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-black" style={{ fontSize: '28px' }}>bolt</span>
                <h1 className="text-white text-xl font-black italic tracking-tighter">FPVO</h1>
              </div>
              <button className="text-white hover:text-primary" onClick={closeMenu}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={closeMenu} className={`flex items-center gap-3 px-4 py-4 rounded-xl ${isActive(item.path) ? 'bg-primary text-white shadow-lg' : 'text-[#92a4c9]'}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <p className="text-base font-bold">{item.label}</p>
                </Link>
              ))}
            </nav>
          </div>
          <button 
            onClick={() => { setLogoutModalOpen(true); closeMenu(); }}
            className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4 border border-red-500/20 text-red-500 font-bold"
          >
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </button>
        </aside>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-y-auto pt-20 lg:pt-0">
        <div className="w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      <ConfirmModal 
        isOpen={logoutModalOpen}
        title="¿Cerrar sesión?"
        message="¿Estás seguro de que quieres cerrar tu sesión actual en FPVO? Tendrás que volver a ingresar tus credenciales."
        confirmLabel="Cerrar Sesión"
        type="danger"
        onConfirm={() => {
          setLogoutModalOpen(false);
          console.log("Logout confirmed");
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/competition-create" element={<CompetitionCreate />} />
          <Route path="/competition-setup" element={<CompetitionSetup />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/tournament-detail/:id" element={<TournamentDetail />} />
          <Route path="/result-entry" element={<ResultEntry />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/invitation/:id" element={<InvitationDetail />} />
          <Route path="/profile" element={<CompetitorProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
