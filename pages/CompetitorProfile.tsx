import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserProfile } from '../hooks/useFirestore';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CompetitorProfile: React.FC = () => {
  const { profile: user, loading } = useUserProfile();
  const [realStats, setRealStats] = useState({ totalRaces: 0, wins: 0, podiums: 0, incidentsPerRace: 0, winRate: "0%" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    team: '',
    country: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Calculate Stats (Logic from Dashboard)
    const fetchStats = async () => {
      try {
        // 1. Get tournaments I participate in
        const qPart = query(collection(db, 'tournaments'), where('participants', 'array-contains', user.id));
        const snapPart = await getDocs(qPart);

        // 2. Get tournaments I created
        const qOwned = query(collection(db, 'tournaments'), where('createdBy', '==', user.id));
        const snapOwned = await getDocs(qOwned);

        // 3. Get tournaments I created (Legacy 'userId' field)
        const qOwnedLegacy = query(collection(db, 'tournaments'), where('userId', '==', user.id));
        const snapOwnedLegacy = await getDocs(qOwnedLegacy);

        // 4. Merge unique tournaments
        const uniqueTournaments = new Map();
        snapPart.docs.forEach(d => uniqueTournaments.set(d.id, d));
        snapOwned.docs.forEach(d => uniqueTournaments.set(d.id, d));
        snapOwnedLegacy.docs.forEach(d => uniqueTournaments.set(d.id, d));

        let r = 0, w = 0, p = 0;

        for (const tDoc of Array.from(uniqueTournaments.values())) {
          const rSnaps = await getDocs(collection(db, `tournaments/${tDoc.id}/results`));

          rSnaps.forEach(rDoc => {
            const data = rDoc.data();
            const standingsData = data.standings || data.race || [];

            // Check for my entry in this race
            const myEntry = standingsData.find((e: any) => e.userId === user.id);

            if (myEntry) {
              r++;
              if (Number(myEntry.position) === 1) w++;
              if (Number(myEntry.position) <= 3) p++;
            }
          });
        }

        const winRate = r > 0 ? ((w / r) * 100).toFixed(1) + '%' : "0%";
        // Note: incidentsPerRace is hard to calculate without incident data in results, keeping default or 0 for now
        setRealStats({ totalRaces: r, wins: w, podiums: p, incidentsPerRace: 0, winRate });
      } catch (e) {
        console.error("Error calculating stats:", e);
      }
    };
    fetchStats();

    // Initialize form data
    setFormData({
      name: user.name || '',
      nickname: user.nickname || '',
      team: user.team || '',
      country: user.country || '',
      avatar: user.avatar || ''
    });
  }, [user]);

  const handleEditClick = () => {
    setFormData({
      name: user.name || '',
      nickname: user.nickname || '',
      team: user.team || '',
      country: user.country || '',
      avatar: user.avatar || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: formData.name,
        nickname: formData.nickname,
        team: formData.team,
        country: formData.country,
        avatar: formData.avatar
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando perfil...</div>;

  if (!user) return <div className="p-8 text-white">Usuario no encontrado.</div>;

  // Safe defaults for display (updated with realStats)
  const safeUser = {
    name: user.name || 'Sin Nombre',
    avatar: user.avatar || 'https://placehold.co/150',
    team: user.team || 'Piloto Privado',
    country: user.country || 'Global',
    class: user.class || 'Rookie',
    rating: user.rating || 1000,
    stats: realStats,
    eloHistory: user.eloHistory || [],
    trophies: user.trophies || []
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#192233] border border-[#232f48] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#232f48] flex justify-between items-center bg-[#111722]">
              <h3 className="text-white text-xl font-bold">Editar Perfil</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#92a4c9] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-[#92a4c9] text-sm font-bold mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0d1219] border border-[#232f48] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  placeholder="Tu nombre real"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#92a4c9] text-sm font-bold mb-2">Nickname</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full bg-[#0d1219] border border-[#232f48] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="Tu apodo de piloto"
                  />
                </div>
                <div>
                  <label className="block text-[#92a4c9] text-sm font-bold mb-2">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#0d1219] border border-[#232f48] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                    placeholder="Ej. México"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#92a4c9] text-sm font-bold mb-2">Equipo (Team)</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full bg-[#0d1219] border border-[#232f48] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  placeholder="Nombre de tu escudería"
                />
              </div>
              <div>
                <label className="block text-[#92a4c9] text-sm font-bold mb-2">URL del Avatar</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-[#0d1219] border border-[#232f48] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  placeholder="https://..."
                />
                <p className="text-xs text-[#586a8a] mt-1">Recomendamos usar una imagen cuadrada.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg bg-[#232f48] text-white font-bold hover:bg-[#2f3e5c] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-brand text-white font-bold hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <div className="bg-[#111722] border border-[#232f48] rounded-xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>
          <div className="relative z-10 mb-4">
            <div className="bg-center bg-no-repeat bg-cover rounded-xl size-32 shadow-xl ring-4 ring-[#232f48]" style={{ backgroundImage: `url("${safeUser.avatar}")` }}></div>
            <div className="absolute -bottom-2 -right-2 bg-[#111722] rounded-full p-1.5 border border-[#232f48] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0bda5e] text-[20px]">check_circle</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold leading-tight mb-1">{safeUser.name}</h1>
          <p className="text-brand font-bold text-sm mb-4">@{user.nickname}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#92a4c9] text-sm font-medium">{safeUser.team}</span>
            <span className="text-[#232f48]">•</span>
            <span className="text-[#92a4c9] text-sm">{safeUser.country}</span>
          </div>
          <div className="flex gap-3 w-full mb-6">
            <button
              onClick={handleEditClick}
              className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Editar Perfil
            </button>
            <button className="flex-1 h-10 bg-[#232f48] hover:bg-[#2f3e5c] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">Compartir</button>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        {/* Elo Card */}
        <div className="bg-[#111722] border border-[#232f48] rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-lg font-bold">Rating Endure-Elo</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">{safeUser.rating}</span>
                <div className="flex items-center text-[#0bda5e] bg-[#0bda5e]/10 px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="text-sm font-bold ml-1">+12</span>
                </div>
              </div>
              <p className="text-[#92a4c9] text-sm mt-1">Top 5% Global • Clase {safeUser.class}</p>
            </div>
            <div className="w-full md:w-1/2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeUser.eloHistory}>
                  <defs>
                    <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
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
          <StatBox label="Victorias" val={safeUser.stats.wins} sub={`${safeUser.stats.winRate} Winrate`} icon="emoji_events" />
          <StatBox label="Podios" val={safeUser.stats.podiums} sub="Finales en Top 3" icon="podium" />
          <StatBox label="Carreras" val={safeUser.stats.totalRaces} sub="Completadas" icon="flag" />
          <StatBox label="Seguridad" val={safeUser.stats.incidentsPerRace} sub="Incidentes/Race" icon="shield" />
        </div>

        {/* Trophies */}
        <div className="bg-[#111722] border border-[#232f48] rounded-xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[#232f48] bg-[#1c2433]">
            <h3 className="text-white font-bold text-lg">Trofeos</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeUser.trophies.map((t: any, i: number) => (
              <Trophy key={i} name={t.name} desc={t.desc} color={t.color} />
            ))}
            {safeUser.trophies.length === 0 && (
              <div className="col-span-3 text-center text-[#92a4c9] py-4">Aún no has ganado trofeos.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatBox: React.FC<any> = ({ label, val, sub, icon }) => (
  <div className="bg-[#111722] border border-[#232f48] rounded-xl p-5 hover:border-primary/50 transition-colors group">
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
