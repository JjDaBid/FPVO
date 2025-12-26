
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile, useCollection } from '../hooks/useFirestore';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard: React.FC = () => {
  const { profile: user, loading: loadingUser } = useUserProfile();
  const { data: news, loading: loadingNews } = useCollection('news');
  const { data: events, loading: loadingEvents } = useCollection('events');

  // Sort events or filter for next event if needed. Assuming 'events' collection has all.
  const nextEvent = events.length > 0 ? events[0] : null;

  const [realStats, setRealStats] = useState({ totalRaces: 0, wins: 0, podiums: 0, tournamentWins: 0 });
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!user) return;

    // 1. Unread Notifications Listener
    const qN = query(collection(db, 'invitations'), where('receiverId', '==', user.id), where('status', '==', 'pending'));
    const unsub = onSnapshot(qN, (snap) => setUnreadNotifs(snap.size));

    // 2. Calculate Stats
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

        let r = 0, w = 0, p = 0, tWins = 0;

        for (const tDoc of Array.from(uniqueTournaments.values())) {
          const rSnaps = await getDocs(collection(db, `tournaments/${tDoc.id}/results`));
          const tPoints: Record<string, number> = {};

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

            // Sum points to determine tournament winner
            standingsData.forEach((e: any) => {
              if (e.userId) {
                tPoints[e.userId] = (tPoints[e.userId] || 0) + (Number(e.points) || 0);
              }
            });
          });

          // Check tournament winner (who has most points accumulated)
          const sortedIds = Object.keys(tPoints).sort((a, b) => tPoints[b] - tPoints[a]);
          if (sortedIds.length > 0 && sortedIds[0] === user.id && rSnaps.size > 0) {
            tWins++;
          }
        }
        setRealStats({ totalRaces: r, wins: w, podiums: p, tournamentWins: tWins });
      } catch (e) {
        console.error("Error calculating stats:", e);
      }
    };
    fetchStats();

    return () => unsub();
  }, [user]);

  if (loadingUser || loadingNews || loadingEvents) {
    return <div className="p-8 text-app-text-title">Cargando dashboard...</div>;
  }

  // Fallback if no user data yet
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-app-bg-surface border border-app-border mx-auto max-w-2xl mt-10">
        <div className="bg-app-status-error/10 p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-app-status-error text-4xl">warning</span>
        </div>
        <h2 className="text-xl font-bold text-app-text-title mb-2">No se encontró información del piloto</h2>
        <p className="text-app-text-body mb-6 max-w-md">
          Parece que tu cuenta de usuario no tiene un perfil de piloto asociado en nuestra base de datos. Esto puede suceder si el registro no se completó correctamente.
        </p>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-lg bg-app-btn-secondary text-app-text-body font-bold hover:bg-app-btn-secondary-hover transition-colors">
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Torneos Ganados', value: realStats.tournamentWins, change: '🏆', icon: 'emoji_events', color: 'bg-yellow-500/10', textColor: 'text-yellow-500' },
    { label: 'Carreras Totales', value: realStats.totalRaces, change: '🏁', icon: 'flag', color: 'bg-blue-500/10', textColor: 'text-blue-500' },
    { label: 'Victorias', value: realStats.wins, change: '🥇', icon: 'workspace_premium', color: 'bg-green-500/10', textColor: 'text-green-500' },
    { label: 'Podios', value: realStats.podiums, change: '🥈', icon: 'leaderboard', color: 'bg-orange-500/10', textColor: 'text-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* HERO HERO HEADER */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden -mt-8 md:-mt-10 lg:-mt-12 rounded-b-[40px] shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/HeroFPVO.jpg')] bg-cover bg-top bg-no-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#101622] via-[#101622]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101622] via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(19,91,236,0.3)] animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span className="text-xs font-bold text-brand tracking-wider uppercase drop-shadow-lg">Panel de Control</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-sans italic leading-[0.9] tracking-tighter text-white animate-fade-in-up delay-100">
              BIENVENIDO A PISTA, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 drop-shadow-[0_0_30px_rgba(19,91,236,0.6)]">
                {user.nickname?.toUpperCase()}
              </span>
            </h1>

            <p className="text-lg text-gray-300 font-medium max-w-xl leading-relaxed animate-fade-in-up delay-200 border-l-4 border-brand pl-6">
              Gestiona tu carrera profesional, revisa tus próximas competencias y mantente al día con las últimas noticias del SimRacing.
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-300 pt-4">
              <Link to="/competition-create" className="group relative flex items-center justify-center gap-3 bg-brand text-white px-8 py-3 rounded-none skew-x-[-10deg] hover:bg-brand-hover transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(19,91,236,0.4)]">
                <span className="skew-x-[10deg] font-black italic text-lg tracking-wider">NUEVA CARRERA</span>
                <span className="material-symbols-outlined filled skew-x-[10deg] group-hover:translate-x-1 transition-transform">add_circle</span>
              </Link>

              <Link to="/notifications" className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-none skew-x-[-10deg] border border-white/20 hover:bg-white/10 transition-all bg-black/20 backdrop-blur-sm">
                <span className="skew-x-[10deg] font-bold text-lg tracking-wide flex items-center gap-2">
                  NOTIFICACIONES
                  {unreadNotifs > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{unreadNotifs}</span>}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-20 relative z-20 space-y-12 pb-12">
        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl p-6 bg-app-bg-surface/90 backdrop-blur-md border border-app-border shadow-xl hover:border-brand/50 transition-all hover:-translate-y-1 group">
              <div className="flex justify-between items-start">
                <p className="text-app-text-body text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-app-text-body" style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-app-text-title text-3xl font-black italic">{stat.value}</p>
                <p className={`${stat.textColor} text-sm font-black ${stat.color} px-2 py-0.5 rounded-full`}>{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION: NEXT EVENT */}
        {nextEvent && (
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-app-text-title text-3xl font-black italic leading-tight tracking-[-0.015em]">PRÓXIMO EVENTO</h2>
                <p className="text-app-text-body mt-1">Tu próxima cita en la pista</p>
              </div>
              <Link to="/my-events" className="text-brand text-sm font-bold hover:text-brand-hover transition-colors flex items-center gap-1 uppercase tracking-wide">
                Ver calendario completo <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="p-0 @container">
              <div className="flex flex-col md:flex-row items-stretch justify-start rounded-2xl overflow-hidden shadow-2xl bg-app-bg-surface border border-app-border group hover:border-brand/50 transition-all">
                <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-app-bg-surface to-transparent md:hidden z-10"></div>
                  <div className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url("${nextEvent.image}")` }}></div>
                  <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-black italic px-3 py-1.5 rounded-sm shadow-lg animate-pulse uppercase tracking-wider">En Vivo: 2 Días</div>

                  {/* Overlay details on image for desktop */}
                  <div className="hidden md:flex absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex-col gap-1">
                    <p className="text-white font-bold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand">location_on</span>
                      {nextEvent.track}
                    </p>
                  </div>
                </div>

                <div className="flex w-full md:w-1/2 grow flex-col justify-center gap-6 p-6 md:p-8 relative">
                  {/* Decorative bg element */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl italic select-none pointer-events-none text-white truncate max-w-full">
                    RACE
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-brand text-[10px] font-black uppercase tracking-widest border border-brand/30 px-2 py-1 rounded bg-brand/5">{nextEvent.category}</span>
                      <span className="text-app-text-muted text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Ronda 4</span>
                    </div>
                    <h3 className="text-app-text-title text-3xl md:text-4xl font-black italic leading-none tracking-tight mb-4">{nextEvent.title}</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-app-text-body md:hidden">
                        <span className="material-symbols-outlined text-sm text-brand">location_on</span>
                        <p className="text-sm font-bold">{nextEvent.track}</p>
                      </div>
                      <div className="flex items-center gap-2 text-app-text-body">
                        <span className="material-symbols-outlined text-sm text-brand">schedule</span>
                        <p className="text-sm font-medium"><span className="text-white font-bold">{nextEvent.date}</span> GMT</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/5"></div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <p className="text-app-text-body text-xs font-bold uppercase tracking-wider">Estado</p>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                        <p className="text-white text-sm font-bold italic">Confirmado (Coche #55)</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center rounded-lg h-10 px-6 bg-app-btn-secondary hover:bg-white hover:text-black text-app-text-title text-sm font-bold transition-colors uppercase tracking-wide">
                        Setup
                      </button>
                      <Link to={`/tournament/${nextEvent.id}`} className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center rounded-lg h-10 px-6 bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-lg shadow-brand/20 transition-all uppercase tracking-wide transform hover:-translate-y-0.5">
                        Ir al Evento
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: NEWS & UPDATES GRID */}
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-app-text-title text-3xl font-black italic leading-tight tracking-[-0.015em]">PADDOCK NEWS</h2>
              <p className="text-app-text-body mt-1">Actualizaciones del mundo motor</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item: any) => (
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
    </div>
  );
};

const NewsCard: React.FC<{ image: string, tag: string, tagColor: string, time: string, title: string, desc: string }> = ({ image, tag, tagColor, time, title, desc }) => (
  <div className="group flex flex-col bg-app-bg-surface rounded-xl overflow-hidden border border-app-border hover:border-brand/40 transition-all shadow-sm">
    <div className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${image}")` }}></div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs font-bold ${tagColor} uppercase tracking-wide`}>{tag}</span>
        <span className="text-xs text-app-text-body">{time}</span>
      </div>
      <h4 className="text-app-text-title text-lg font-bold mb-2 leading-tight group-hover:text-brand transition-colors">{title}</h4>
      <p className="text-app-text-body text-sm leading-relaxed mb-4 flex-1">{desc}</p>
      <a className="text-app-text-title text-sm font-bold flex items-center gap-1 hover:text-brand transition-colors mt-auto" href="#">
        Leer más <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  </div>
);

export default Dashboard;
