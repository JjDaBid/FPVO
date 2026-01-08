import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocument, useCollection, useUserProfile } from '../hooks/useFirestore';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data
  const { data: tournament, loading } = useDocument('tournaments', id || 'unknown');
  const { data: tracks } = useCollection('tracks');
  const { data: cars } = useCollection('cars');
  const { data: allUsers } = useCollection('users');
  const { data: resultsData } = useCollection(`tournaments/${id}/results`);
  const { profile: currentUser } = useUserProfile();

  // State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [sendingInvite, setSendingInvite] = useState<string | null>(null);

  // Aggregation Logic (Now that we have resultsData)
  const standingsMap: Record<string, any> = {};
  (resultsData || []).forEach((r: any) => {
    const raceResults = r.standings || r.race || [];
    raceResults.forEach((entry: any) => {
      if (!entry.userId) return;
      if (!standingsMap[entry.userId]) {
        standingsMap[entry.userId] = {
          userId: entry.userId,
          nickname: entry.nickname || 'Piloto',
          points: 0,
          wins: 0,
          podiums: 0,
          races: 0
        };
      }
      standingsMap[entry.userId].points += (Number(entry.points) || 0);
      standingsMap[entry.userId].races += 1;
      if (entry.position === 1) standingsMap[entry.userId].wins += 1;
      if (entry.position <= 3) standingsMap[entry.userId].podiums += 1;
    });
  });
  const standings = Object.values(standingsMap).sort((a: any, b: any) => b.points - a.points);


  if (loading) return <div className="flex h-screen items-center justify-center bg-app-bg-main"><div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div></div>;

  if (!tournament) return (
    <div className="flex h-screen flex-col items-center justify-center bg-app-bg-main gap-4">
      <h2 className="text-2xl font-bold text-white">Torneo no encontrado</h2>
      <button onClick={() => navigate('/my-events')} className="text-brand hover:underline font-bold">Volver a Mis Eventos</button>
    </div>
  );

  // Helpers
  const getTrackName = (id: string) => tracks ? (tracks.find((t: any) => t.id === id)?.name || 'Pista Desconocida') : id;
  const getCarName = (id: string) => {
    const c = cars ? cars.find((x: any) => x.id === id) : null;
    return c ? `${c.brand} ${c.model}` : 'Coche Desconocido';
  };

  const getUserAvatar = (uid: string) => {
    const u = allUsers?.find((user: any) => user.id === uid);
    return u?.avatar || 'https://placehold.co/150?text=User';
  };

  const config = tournament.config || {};
  const races = config.races || [];
  const points = config.pointsSystem || [];
  const statusColor = tournament.status === 'active' ? 'text-[#0bda5e] bg-[#0bda5e]/10 border-[#0bda5e]/20' : 'text-slate-400 bg-slate-400/10 border-slate-400/20';

  // Invitation Logic
  const handleInvite = async (receiverId: string) => {
    if (!currentUser) {
      alert("Debes estar logueado para invitar.");
      return;
    }
    setSendingInvite(receiverId);
    try {
      await addDoc(collection(db, 'invitations'), {
        tournamentId: id,
        tournamentName: tournament.name,
        senderId: currentUser.id,
        senderName: currentUser.nickname || 'Un Organizador',
        receiverId: receiverId,
        status: 'pending',
        createdAt: serverTimestamp(),
        type: 'tournament_invite'
      });
      alert("Invitación enviada con éxito!");
    } catch (e) {
      console.error(e);
      alert("Error al enviar invitación");
    } finally {
      setSendingInvite(null);
    }
  };

  // Filter Users for Modal
  const potentialPilots = allUsers ? allUsers.filter((u: any) => u.id !== currentUser?.id).map((u: any) => ({
    ...u,
    isOnline: Math.random() > 0.6
  })).sort((a: any, b: any) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0)) : [];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 min-h-screen">

      {/* HEADER */}
      <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-2xl bg-background-surface">
        <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url("${tournament.image || 'https://placehold.co/1200x400'}")` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-background-surface/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${statusColor} backdrop-blur-md`}>
                {tournament.status || 'Estado Desconocido'}
              </span>
              <span className="text-text-muted text-sm font-bold uppercase tracking-wide">
                {tournament.simulator?.name || 'Simulador'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tight uppercase shadow-black drop-shadow-lg">
              {tournament.name}
            </h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/competition-setup', { state: { editMode: true, tournamentId: id } })}
              className="bg-background-secondary hover:bg-background-highlight border border-border-default text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">settings</span> Configuración
            </button>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">person_add</span> Invitar Pilotos
            </button>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="groups" value={config.pilotCount || 0} label="Pilotos" />
        <StatCard icon="flag" value={`${tournament.currentRound || 1}/${races.length}`} label="Ronda Actual" />
        <StatCard icon="emoji_events" value={points[0] || '-'} label="Pts Ganador" />
        <StatCard icon="calendar_month" value={tournament.createdAt ? new Date(tournament.createdAt.seconds * 1000).toLocaleDateString() : '-'} label="Fecha Inicio" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: CALENDAR */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border-default pb-4">
            <h2 className="text-2xl font-black italic text-white">CALENDARIO DE CARRERAS</h2>
            <span className="text-sm font-bold text-text-muted">{races.length} Eventos</span>
          </div>

          <div className="flex flex-col gap-4">
            {races.map((race: any, index: number) => (
              <div key={index} className="group bg-background-surface border border-border-default rounded-xl p-5 hover:border-brand/50 transition-all flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-xs font-bold text-text-muted uppercase">Ronda</span>
                  <span className="text-3xl font-black text-white italic">{index + 1}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors">
                    {getTrackName(race.trackId)}
                  </h3>
                  <p className="text-sm text-text-muted font-medium flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined text-[16px]">directions_car</span>
                    {getCarName(race.carId)}
                  </p>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="bg-background-secondary rounded-lg p-2 min-w-[70px]">
                    <p className="text-[10px] text-text-muted font-bold uppercase">Vueltas</p>
                    <p className="text-white font-bold">{race.laps}</p>
                  </div>
                  <div className="bg-background-secondary rounded-lg p-2 min-w-[70px]">
                    <p className="text-[10px] text-text-muted font-bold uppercase">Qualy</p>
                    <p className="text-white font-bold">{race.qualyTime}'</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/tournament/${id}/race/${race.id}`)}
                    className="text-brand hover:text-white font-bold text-sm flex items-center gap-1 transition-colors"
                  >
                    Detalles <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: STANDINGS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border-default pb-4">
            <h2 className="text-2xl font-black italic text-white">CLASIFICACIÓN</h2>
          </div>

          {standings.length > 0 ? (
            <div className="bg-background-surface border border-border-default rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-background-secondary border-b border-border-default">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase">Pos</th>
                    <th className="py-3 px-4 w-10"></th>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase">Piloto</th>
                    <th className="py-3 px-4 text-xs font-bold text-text-muted uppercase text-center">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {standings.map((p: any, i: number) => (
                    <tr key={i} className={`hover:bg-background-highlight transition-colors ${i === 0 ? 'bg-brand/5' : ''}`}>
                      <td className="py-3 px-4 text-center w-12">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-yellow-400 text-black' : i === 1 ? 'bg-gray-300 text-black' : i === 2 ? 'bg-amber-600 text-black' : 'text-text-muted bg-background-input'}`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 w-10 text-center">
                        <div className="w-8 h-8 rounded-full bg-cover bg-center bg-gray-700 mx-auto" style={{ backgroundImage: `url("${getUserAvatar(p.userId)}")` }}></div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white text-sm">{p.nickname}</p>
                        <div className="flex gap-2 text-[10px] text-text-muted mt-0.5">
                          {p.wins > 0 && <span className="text-yellow-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">emoji_events</span>{p.wins}</span>}
                          {p.podiums > 0 && <span className="text-gray-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">leaderboard</span>{p.podiums}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-white">{p.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {standings.length > 10 && (
                <div className="p-2 text-center border-t border-border-default">
                  <button className="text-xs font-bold text-text-muted hover:text-white uppercase">Ver Todos</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-background-surface border border-border-default rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-text-muted">leaderboard</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Tabla Vacía</h3>
              <p className="text-text-muted text-sm mb-6">Aún no se han registrado resultados para este torneo.</p>
              <button className="w-full bg-background-input hover:bg-background-highlight text-white border border-border-default py-2 rounded-lg font-bold text-sm transition-colors">
                Ver Tabla Completa
              </button>
            </div>
          )}

          {/* Points System Preview */}
          <div className="bg-background-surface border border-border-default rounded-xl p-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-border-default pb-2">Sistema de Puntuación</h3>
            <div className="grid grid-cols-5 gap-2">
              {points.slice(0, 10).map((p: any, i: number) => (
                <div key={i} className="flex flex-col items-center bg-background-secondary rounded p-1">
                  <span className="text-[10px] text-text-muted font-bold">#{i + 1}</span>
                  <span className="text-brand font-bold">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* INVITATION MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)}></div>
          <div className="relative bg-[#1a2332] w-full max-w-lg rounded-2xl border border-border-default shadow-2xl p-6 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white italic uppercase">Invitar Pilotos</h2>
              <button onClick={() => setInviteModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {potentialPilots.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-background-surface border border-transparent hover:border-brand/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center bg-background-secondary" style={{ backgroundImage: `url("${user.avatar || 'https://placehold.co/150?text=User'}")` }}></div>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0bda5e] rounded-full border-2 border-[#1a2332] shadow-[0_0_8px_#0bda5e]"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-bold">{user.nickname || 'Usuario'}</p>
                      <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                        {user.isOnline ? (
                          <span className="text-[#0bda5e] font-bold">Online</span>
                        ) : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvite(user.id)}
                    disabled={sendingInvite === user.id}
                    className="bg-brand/10 hover:bg-brand text-brand hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    {sendingInvite === user.id ? 'Enviando...' : 'Invitar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard: React.FC<{ icon: string, value: string | number, label: string }> = ({ icon, value, label }) => (
  <div className="bg-background-surface border border-border-default rounded-xl p-4 flex items-center gap-4 hover:border-brand/30 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  </div>
);

export default TournamentDetail;
