import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollection, useUserProfile } from '../hooks/useFirestore';

const MyEvents: React.FC = () => {
  const navigate = useNavigate();
  const { data: tournaments, loading } = useCollection('tournaments');

  // --- State ---
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'finished'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const { profile: currentUser } = useUserProfile();

  // --- Filtering Logic ---
  const filteredEvents = (tournaments || []).filter((t: any) => {
    // 0. Access Control (Owner or Participant)
    if (!currentUser) return false;
    const isOwner = t.createdBy === currentUser.id || t.userId === currentUser.id;
    const isParticipant = t.participants?.includes(currentUser.id);

    if (!isOwner && !isParticipant) return false;

    // 1. Status Filter
    // Note: If status doesn't strictly match, default 'active' events are shown in 'active' tab
    const status = t.status || 'active';
    if (status !== activeTab) return false;

    // 2. Search Filter
    if (searchTerm && !t.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    return true;
  });

  // --- Pagination Logic ---
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-app-bg-main">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  const tabDetails = {
    active: { label: 'En Curso', icon: 'play_circle', emptyTitle: 'Sin Torneos Activos', emptyMsg: 'No estás participando en torneos activos actualmente.' },
    upcoming: { label: 'Próximos', icon: 'calendar_clock', emptyTitle: 'Sin Próximos Eventos', emptyMsg: 'No tienes eventos programados para el futuro.' },
    finished: { label: 'Terminados', icon: 'flag', emptyTitle: 'Historial Vacío', emptyMsg: 'Aún no has completado ningún torneo.' }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-main">

      {/* HEADER & CONTROLS */}
      <div className="bg-background-secondary border-b border-border-default px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">MIS EVENTOS</h1>
              <p className="text-[#92a4c9]">Gestiona y visualiza el estado de tus competiciones.</p>
            </div>
            <button
              onClick={() => navigate('/competition-create')}
              className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Nuevo Torneo
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-background-main p-2 rounded-xl border border-border-default">

            {/* Tabs */}
            <div className="flex bg-background-surface rounded-lg p-1">
              {(Object.keys(tabDetails) as Array<keyof typeof tabDetails>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab ? 'bg-background-highlight text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tabDetails[tab].icon}</span>
                  {tabDetails[tab].label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
              <input
                type="text"
                placeholder="Buscar evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-surface border border-border-default rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand placeholder-text-muted"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT: GRID */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((event: any) => (
              <div
                key={event.id}
                onClick={() => navigate(`/tournament/${event.id}`)} // Assuming detail page route
                className="group flex flex-col bg-background-surface rounded-xl overflow-hidden border border-border-default hover:border-brand/50 transition-all cursor-pointer shadow-lg hover:shadow-brand/10"
              >
                {/* Image Header */}
                <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url("${event.image || 'https://placehold.co/400x200?text=Event'}")` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold leading-tight group-hover:text-brand transition-colors line-clamp-1">{event.name}</h3>
                    <p className="text-xs text-[#92a4c9] font-medium uppercase tracking-wider mt-1">{event.config?.races?.length || 0} Carreras • {event.simulator?.name || 'Simulador'}</p>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white backdrop-blur-md ${activeTab === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 border border-gray-500/30'}`}>
                      {tabDetails[activeTab].label}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border-default">
                    <div className="text-center">
                      <span className="block text-xl font-bold text-white">{event.config?.pilotCount || 0}</span>
                      <span className="text-[10px] uppercase text-text-muted font-bold">Pilotos</span>
                    </div>
                    <div className="text-center border-l border-border-default">
                      <span className="block text-xl font-bold text-white">{event.currentRound || 1}</span>
                      <span className="text-[10px] uppercase text-text-muted font-bold">Ronda</span>
                    </div>
                    <div className="text-center border-l border-border-default">
                      <span className="block text-xl font-bold text-white">{event.config?.pointsSystem?.[0] || 25}</span>
                      <span className="text-[10px] uppercase text-text-muted font-bold">Pts 1º</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {/* Mock Avatars */}
                      {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-background-highlight border border-background-surface"></div>)}
                      <span className="text-[10px] text-text-muted pl-4">+Invitar</span>
                    </div>
                    <button className="text-sm font-bold text-brand hover:text-white transition-colors flex items-center">
                      Gestionar <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border-default rounded-3xl bg-background-surface/30">
            <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-text-muted opacity-50">{tabDetails[activeTab].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{tabDetails[activeTab].emptyTitle}</h3>
            <p className="text-text-muted max-w-md">{tabDetails[activeTab].emptyMsg}</p>
            {activeTab === 'active' && (
              <button onClick={() => navigate('/competition-create')} className="mt-6 text-brand font-bold hover:underline">Crear un Torneo Nuevo</button>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION FOOTER */}
      {totalItems > 0 && (
        <div className="border-t border-border-default bg-background-secondary py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Items per page */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted font-medium">Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-background-surface border border-border-default rounded-md px-2 py-1 text-sm text-white font-bold focus:outline-none focus:border-brand"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
              <span className="text-sm text-text-muted ml-2">
                Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} de {totalItems}
              </span>
            </div>

            {/* Page Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-background-surface border border-border-default text-white hover:border-brand disabled:opacity-50 disabled:hover:border-border-default transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Simple sliding window logic or just show all if small count. showing all for simplicity as requested 'numbered buttons'
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-brand text-white' : 'bg-background-surface text-text-muted hover:text-white'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-background-surface border border-border-default text-white hover:border-brand disabled:opacity-50 disabled:hover:border-border-default transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyEvents;
