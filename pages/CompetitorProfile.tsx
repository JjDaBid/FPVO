
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import data from '@/data';

const CompetitorProfile: React.FC = () => {
  const { user } = data;

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <div className="bg-surface-dark border border-[#232f48] rounded-xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>
          <div className="relative z-10 mb-4">
            <div className="bg-center bg-no-repeat bg-cover rounded-xl size-32 shadow-xl ring-4 ring-[#232f48]" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
            <div className="absolute -bottom-2 -right-2 bg-background-dark rounded-full p-1.5 border border-[#232f48] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0bda5e] text-[20px] filled">check_circle</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold leading-tight mb-1">{user.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#92a4c9] text-sm font-medium">{user.team}</span>
            <span className="text-[#232f48]">•</span>
            <span className="text-[#92a4c9] text-sm">{user.country}</span>
          </div>
          <div className="flex gap-3 w-full mb-6">
            <button className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">Desafiar</button>
            <button className="flex-1 h-10 bg-[#232f48] hover:bg-[#2f3e5c] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">Invitar</button>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        {/* Elo Card */}
        <div className="bg-surface-dark border border-[#232f48] rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-lg font-bold">Rating Endure-Elo</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">{user.rating}</span>
                <div className="flex items-center text-[#0bda5e] bg-[#0bda5e]/10 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="text-sm font-bold ml-1">+12</span>
                </div>
              </div>
              <p className="text-[#92a4c9] text-sm mt-1">Top 5% Global • Clase {user.class}</p>
            </div>
            <div className="w-full md:w-1/2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={user.eloHistory}>
                  <defs>
                    <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="elo" stroke="#135bec" fillOpacity={1} fill="url(#colorElo)" strokeWidth={3} />
                  <Tooltip contentStyle={{ backgroundColor: '#192233', border: '1px solid #232f48', borderRadius: '8px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Victorias" val={user.stats.wins} sub={`${user.stats.winRate} Winrate`} icon="emoji_events" />
          <StatBox label="Podios" val={user.stats.podiums} sub="Finales en Top 3" icon="podium" />
          <StatBox label="Carreras" val={user.stats.totalRaces} sub="Completadas" icon="flag" />
          <StatBox label="Seguridad" val={user.stats.incidentsPerRace} sub="Incidentes/Race" icon="shield" />
        </div>

        {/* Trophies */}
        <div className="bg-surface-dark border border-[#232f48] rounded-xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#232f48] bg-[#1c2433]">
            <h3 className="text-white font-bold text-lg">Trofeos</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.trophies.map((t, i) => (
              <Trophy key={i} name={t.name} desc={t.desc} color={t.color} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatBox: React.FC<any> = ({ label, val, sub, icon }) => (
  <div className="bg-surface-dark border border-[#232f48] rounded-xl p-5 hover:border-primary/50 transition-colors group">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[#92a4c9] text-xs font-bold uppercase">{label}</p>
      <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="text-white text-3xl font-bold">{val}</p>
    <p className="text-[#92a4c9] text-xs mt-1">{sub}</p>
  </div>
);

const Trophy: React.FC<any> = ({ name, desc, color }) => (
  <div className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-[#232f48]/50 rounded-lg transition-colors">
    <div className={`size-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
      <span className="material-symbols-outlined text-white text-[24px]">workspace_premium</span>
    </div>
    <div>
      <p className="text-white font-bold text-sm">{name}</p>
      <p className="text-[#92a4c9] text-xs">{desc}</p>
    </div>
  </div>
);

export default CompetitorProfile;
