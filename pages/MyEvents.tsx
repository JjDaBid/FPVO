
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import data from '@/data';

const MyEvents: React.FC = () => {
  const { events } = data;
  const [activeTab, setActiveTab] = useState<'pilot' | 'organizer'>('pilot');
  const navigate = useNavigate();

  // Simulated organizer events (filter or mock)
  const organizerEvents = events.filter(e => e.type === 'tournament' || e.type === 'league');
  const displayEvents = activeTab === 'pilot' ? events : organizerEvents;

  return (
    <div className="layout-container flex h-full grow flex-col px-4 md:px-10 lg:px-20 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Mis Eventos</h1>
          <p className="text-[#92a4c9] text-base font-normal leading-normal max-w-2xl">
            Gestiona tus inscripciones próximas, revisa el estado de tus carreras y accede a los detalles de competición.
          </p>
        </div>
        <Link to="/competition-create" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary hover:bg-primary-hover transition-colors text-white gap-2 text-sm font-bold shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span className="truncate">Crear Nuevo Evento</span>
        </Link>
      </div>

      <div className="mb-6 border-b border-[#324467]">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('pilot')}
            className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 transition-all ${activeTab === 'pilot' ? 'border-b-primary text-white font-bold' : 'border-b-transparent text-[#92a4c9] font-medium hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">sports_motorsports</span>
            <p className="text-sm leading-normal tracking-[0.015em]">Como Piloto</p>
          </button>
          <button 
            onClick={() => setActiveTab('organizer')}
            className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 transition-all ${activeTab === 'organizer' ? 'border-b-primary text-white font-bold' : 'border-b-transparent text-[#92a4c9] font-medium hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[20px]">flag</span>
            <p className="text-sm leading-normal tracking-[0.015em]">Como Organizador</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayEvents.map(event => (
          <EventCard 
            key={event.id}
            id={event.id}
            status={event.status} 
            statusColor={
              event.statusTag === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
              event.statusTag === 'upcoming' ? 'bg-amber-500/20 text-amber-400' :
              'bg-primary/20 text-primary'
            }
            image={event.image}
            category={event.category} 
            title={event.title}
            date={event.date} 
            track={event.track} 
            pilots={event.info} 
            duration={event.meta}
            action={activeTab === 'organizer' ? 'Gestionar' : event.action}
            isInvite={event.isInvite}
            isOrganizer={activeTab === 'organizer'}
            onClick={() => navigate(`/tournament-detail/${event.id}`)}
          />
        ))}
        {displayEvents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4 bg-[#192233] rounded-xl border-2 border-dashed border-[#232f48]">
            <span className="material-symbols-outlined text-5xl text-[#232f48]">history</span>
            <p className="text-[#92a4c9] text-lg">No tienes eventos registrados en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard: React.FC<any> = ({ id, status, statusColor, image, category, title, date, track, pilots, duration, action, isInvite, isOrganizer, onClick }) => (
  <div className={`group flex flex-col bg-[#1e293b] rounded-xl overflow-hidden border border-[#232f48] hover:border-primary/50 transition-all duration-300 relative ${isInvite ? 'border-l-4 border-l-primary' : ''}`}>
    <div className="absolute top-3 left-3 z-10 flex gap-2">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/5 ${statusColor}`}>
        {status}
      </span>
      {isOrganizer && (
        <span className="bg-primary/40 text-white text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest border border-white/10">Admin</span>
      )}
    </div>
    <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url("${image}")` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-90"></div>
      <div className="absolute bottom-3 left-4 right-4">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{category}</p>
        <h3 className="text-white text-xl font-bold leading-tight line-clamp-2">{title}</h3>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#92a4c9] text-lg">calendar_today</span>
          <div className="flex flex-col"><span className="text-[10px] text-[#92a4c9] uppercase font-bold">Fecha</span><span className="text-sm text-white font-medium truncate">{date}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#92a4c9] text-lg">location_on</span>
          <div className="flex flex-col"><span className="text-[10px] text-[#92a4c9] uppercase font-bold">Circuito</span><span className="text-sm text-white font-medium truncate">{track}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#92a4c9] text-lg">group</span>
          <div className="flex flex-col"><span className="text-[10px] text-[#92a4c9] uppercase font-bold">Info</span><span className="text-sm text-white font-medium truncate">{pilots}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#92a4c9] text-lg">timer</span>
          <div className="flex flex-col"><span className="text-[10px] text-[#92a4c9] uppercase font-bold">Meta</span><span className="text-sm text-white font-medium truncate">{duration}</span></div>
        </div>
      </div>
      <div className="h-px bg-[#232f48] w-full my-1"></div>
      <button 
        onClick={onClick}
        className={`flex-1 h-10 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${isOrganizer ? 'bg-surface-dark-highlight hover:bg-[#2f3e5c]' : 'bg-primary hover:bg-primary-hover shadow-primary/20'}`}
      >
        {isOrganizer && <span className="material-symbols-outlined text-sm">edit</span>}
        {action}
      </button>
    </div>
  </div>
);

export default MyEvents;
