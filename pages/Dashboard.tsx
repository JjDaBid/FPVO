
import React from 'react';
import { Link } from 'react-router-dom';
import data from '@/data';

const Dashboard: React.FC = () => {
  const { user, news, events } = data;
  const nextEvent = events[0]; // Assuming first event is the main feature

  const stats = [
    { label: 'Carreras Totales', value: user.stats.totalRaces, change: '+2%', icon: 'flag', color: 'bg-[#0bda5e]/10', textColor: 'text-[#0bda5e]' },
    { label: 'Podios', value: user.stats.podiums, change: '+5%', icon: 'emoji_events', color: 'bg-[#0bda5e]/10', textColor: 'text-[#0bda5e]' },
    { label: 'Victorias', value: user.stats.wins, change: '0%', icon: 'workspace_premium', color: 'bg-white/5', textColor: 'text-[#92a4c9]' },
    { label: 'Rating de Seguridad', value: user.stats.safetyRating, change: '+0.1%', icon: 'security', color: 'bg-[#0bda5e]/10', textColor: 'text-[#0bda5e]' },
  ];

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      {/* PAGE HEADING & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-white">Bienvenido, {user.nickname}</h1>
          <p className="text-[#92a4c9] text-base font-normal">Aquí tienes el resumen de tu actividad y próximos eventos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#232f48] text-[#92a4c9] hover:text-white hover:bg-[#34425e] transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <Link to="/competition-create" className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            <span className="truncate">Crear Nueva Competencia</span>
          </Link>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl p-6 bg-[#192233] border border-[#232f48] shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start">
              <p className="text-[#92a4c9] text-sm font-medium">{stat.label}</p>
              <span className="material-symbols-outlined text-[#92a4c9]" style={{ fontSize: '20px' }}>{stat.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className={`${stat.textColor} text-sm font-medium ${stat.color} px-1.5 rounded`}>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: NEXT EVENT */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Próximo Evento</h2>
          <Link to="/my-events" className="text-primary text-sm font-medium hover:text-blue-400 transition-colors">Ver calendario completo -></Link>
        </div>
        <div className="p-0 @container">
          <div className="flex flex-col md:flex-row items-stretch justify-start rounded-xl overflow-hidden shadow-lg bg-[#192233] border border-[#232f48] group hover:border-primary/50 transition-all">
            <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-[#192233] to-transparent md:hidden z-10"></div>
              <div className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url("${nextEvent.image}")` }}></div>
              <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md animate-pulse">EN VIVO EN 2 DÍAS</div>
            </div>
            <div className="flex w-full md:w-3/5 grow flex-col justify-center gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-wider bg-[#232f48] px-2 py-1 rounded">{nextEvent.category}</span>
                  <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-wider bg-[#232f48] px-2 py-1 rounded">Ronda 4</span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-2">{nextEvent.title}</h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[#92a4c9]">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <p className="text-sm font-medium">{nextEvent.track}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#92a4c9]">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <p className="text-sm font-medium">{nextEvent.date} GMT</p>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-[#232f48]"></div>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <p className="text-[#92a4c9] text-xs font-medium uppercase">Estado de inscripción</p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0bda5e]"></span>
                    <p className="text-white text-sm font-bold">Confirmado (Coche #55)</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center rounded-lg h-10 px-6 bg-[#232f48] hover:bg-[#34425e] text-white text-sm font-bold transition-colors">
                    Ver Setup
                  </button>
                  <Link to={`/tournament-detail/${nextEvent.id}`} className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-colors leading-none">
                    Detalles del Evento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: NEWS & UPDATES GRID */}
      <div className="flex flex-col gap-4 pb-12">
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Novedades y Actualizaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard 
              key={item.id}
              image={item.image}
              tag={item.tag}
              tagColor={item.tagColor}
              time={item.time}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ image: string, tag: string, tagColor: string, time: string, title: string, desc: string }> = ({ image, tag, tagColor, time, title, desc }) => (
  <div className="group flex flex-col bg-[#192233] rounded-xl overflow-hidden border border-[#232f48] hover:border-primary/40 transition-all shadow-sm">
    <div className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${image}")` }}></div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-bold ${tagColor} uppercase tracking-wide`}>{tag}</span>
        <span className="text-xs text-[#92a4c9]">{time}</span>
      </div>
      <h4 className="text-white text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-[#92a4c9] text-sm leading-relaxed mb-4 flex-1">{desc}</p>
      <a className="text-white text-sm font-bold flex items-center gap-1 hover:text-primary transition-colors mt-auto" href="#">
        Leer más <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  </div>
);

export default Dashboard;
