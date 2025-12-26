import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useFirestore';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { profile: user } = useUserProfile();

  // Custom fetch for invitations
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const fetchInvites = async () => {
      try {
        const q = query(
          collection(db, 'invitations'),
          where('receiverId', '==', user.id),
          where('status', '==', 'pending')
        );
        const snaps = await getDocs(q);
        const invites: any[] = [];
        snaps.forEach(doc => invites.push({ id: doc.id, ...doc.data() }));
        invites.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setInvitations(invites);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [user]);

  const handleAccept = async (invite: any) => {
    if (!user) return;
    try {
      // 1. Mark as accepted
      await updateDoc(doc(db, 'invitations', invite.id), { status: 'accepted' });

      // 2. Add to tournament participants
      await updateDoc(doc(db, 'tournaments', invite.tournamentId), {
        participants: arrayUnion(user.id)
      });

      // 3. Remove locally
      setInvitations(prev => prev.filter(i => i.id !== invite.id));

      // 4. Redirect
      if (window.confirm("¡Invitación aceptada! ¿Quieres ir al torneo ahora?")) {
        navigate(`/tournament/${invite.tournamentId}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al procesar la invitación.");
    }
  };

  const handleReject = async (inviteId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres rechazar esta invitación?")) return;
    try {
      await updateDoc(doc(db, 'invitations', inviteId), { status: 'rejected' });
      setInvitations(prev => prev.filter(i => i.id !== inviteId));
    } catch (e) {
      console.error(e);
      alert("Error al rechazar.");
    }
  };

  if (loading) return <div className="p-10 text-center text-white">Cargando notificaciones...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background-main pb-20">

      {/* HEADER */}
      <div className="bg-background-secondary border-b border-border-default px-6 py-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white italic uppercase">Notificaciones</h1>
            <p className="text-text-muted text-sm font-bold">Tus alertas e invitaciones</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-4">

        {invitations.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border-default rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-text-muted opacity-50 mb-4">notifications_off</span>
            <h2 className="text-xl font-bold text-white mb-2">Sin Notificaciones</h2>
            <p className="text-text-muted">No tienes invitaciones pendientes ni alertas nuevas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {invitations.map(invite => (
              <div key={invite.id} className="bg-background-surface border border-border-default p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 hover:border-brand/50 transition-all shadow-lg group">
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <span className="material-symbols-outlined">emoji_events</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Invitación a Torneo</p>
                    <p className="text-text-muted text-sm">
                      <span className="font-bold text-white">{invite.senderName}</span> te invita a: <span className="font-bold text-brand italic">{invite.tournamentName}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">{invite.createdAt ? new Date(invite.createdAt.seconds * 1000).toLocaleDateString() : 'Reciente'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => handleAccept(invite)}
                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span> Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(invite.id)}
                    className="flex-1 md:flex-none bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default Notifications;
