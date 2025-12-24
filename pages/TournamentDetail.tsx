
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '@/data';

const TournamentDetail: React.FC = () => {
  const { id } = useParams();
  const event = data.events.find(e => e.id === id) || data.events[0];
  const leaders = event.leaderboard || [];

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div className="flex min-w-72 flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">{event.title}</h1>
            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-green-500/20">{event.status}</span>
          </div>
          <p className="text-[#92a4c9] text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Ene 15 - Mar 30, 2024 • Sim Racing Hub - Temporada 5
          </p>
        </div>
        <Link to="/competition-setup" className="flex items-center gap-2 rounded-lg h-10 px-5 bg-[#232f48] hover:bg-[#2e3e5e] text-white text-sm font-bold transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Configuración</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-6 border border-[#232f48] bg-[#161e2c]">
          <p className="text-[#92a4c9] text-sm font-bold uppercase tracking-wider mb-2">Pilotos Inscritos</p>
          <p className="text-white text-3xl font-bold">{event.info.split(' ')[0]}</p>
        </div>
        <div className="rounded-xl p-6 border border-[#232f48] bg-[#161e2c]">
          <p className="text-[#92a4c9] text-sm font-bold uppercase tracking-wider mb-2">Carreras Completadas</p>
          <p className="text-white text-3xl font-bold">4 <span className="text-slate-400 text-lg font-medium">/ 10</span></p>
        </div>
        <div className="rounded-xl p-6 border border-[#232f48] bg-[#161e2c]">
          <p className="text-[#92a4c9] text-sm font-bold uppercase tracking-wider mb-2">Líder del Campeonato</p>
          <p className="text-white text-2xl font-bold truncate">{leaders[0]?.name || 'N/A'}</p>
          <p className="text-primary text-sm font-bold">{leaders[0]?.team || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Race Calendar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-white text-xl font-bold border-b border-[#232f48] pb-2">Calendario</h2>
          <div className="flex flex-col gap-4">
            <RaceCard title="GP Silverstone" date="15 Ene 2024" winner="L. Hamilton" completed={true} />
            <RaceCard title="GP Monza" date="29 Ene 2024" winner="M. Verstappen" completed={true} />
            <div className="group flex flex-col bg-[#161e2c] border-2 border-primary rounded-xl overflow-hidden shadow-lg shadow-primary/10">
              <div className="relative h-28 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url("${event.image}")` }}>
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-white rounded text-xs font-bold">Próxima Carrera</div>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-white font-black text-xl">{event.title}</h3>
                  <p className="text-primary-100 text-sm font-medium">{event.date} GMT</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <Link to="/result-entry" className="w-full text-center bg-primary hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors">
                  Ingresar Resultados
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="text-white text-xl font-bold border-b border-[#232f48] pb-2">Tabla de Posiciones</h2>
          <div className="bg-[#161e2c] border border-[#232f48] rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c2636] text-xs uppercase tracking-wider text-[#92a4c9] font-semibold">
                  <th className="px-6 py-4 text-center w-16">Pos</th>
                  <th className="px-6 py-4">Piloto / Equipo</th>
                  <th className="px-6 py-4 text-center hidden sm:table-cell">Victorias</th>
                  <th className="px-6 py-4 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232f48]">
                {leaders.map((pilot, idx) => (
                  <tr key={idx} className="group hover:bg-primary/10 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-center">
                      <div className={`size-8 mx-auto rounded-full font-bold flex items-center justify-center ${pilot.color}`}>{pilot.pos}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white group-hover:text-primary">{pilot.name}</p>
                        <p className="text-xs text-[#92a4c9]">{pilot.team}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell text-slate-300">{pilot.wins}</td>
                    <td className="px-6 py-4 text-right font-bold text-lg text-white">{pilot.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-[#1c2636] text-center border-t border-[#232f48]">
              <button className="text-sm font-bold text-primary hover:underline">Ver clasificación completa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RaceCard: React.FC<any> = ({ title, date, winner, completed }) => (
  <div className="group flex flex-col bg-[#161e2c] border border-[#232f48] rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
    <div className="relative h-24 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url("https://picsum.photos/400/100?random=${title}")` }}>
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs font-bold text-white flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px] text-green-400">check_circle</span> Finalizada
      </div>
      <div className="absolute bottom-2 left-3">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-slate-300 text-xs">{date}</p>
      </div>
    </div>
    <div className="p-3 flex justify-between items-center bg-[#1c2636]">
      <span className="text-sm font-medium text-slate-300">Ganador: {winner}</span>
      <button className="text-xs font-bold text-primary hover:text-primary/80">Ver Resultados</button>
    </div>
  </div>
);

export default TournamentDetail;
