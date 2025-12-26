import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocument, useUserProfile } from '../hooks/useFirestore';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import ConfirmModal from '../components/ConfirmModal';

const InvitationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Invitation ID

  // Fetch Invite
  const { data: invitation, loading: loadingInvite } = useDocument('invitations', id || 'unknown');
  // Fetch User for Profile Data (need ID to join)
  const { profile: user } = useUserProfile();

  const [processing, setProcessing] = useState(false);

  // Fetch Tournament Details once we have the invitation
  // We can't use useDocument hook conditionally easily, so we just check inside render or logic?
  // Actually, hooks must run unconditionally. I'll rely on a second component or just fetch manually inside effect if I wanted perfect optimization, 
  // but useDocument handles null IDs gracefully typically? 
  // Let's use a conditional fetch component or cleaner: fetch inside handleAccept.
  // For display, I probably want to show tournament details.

  // Simpler: Just rely on invitation data if it has snapshots? 
  // `invitation` has `tournamentId`. 
  const tournamentId = invitation?.tournamentId;
  const { data: tournament, loading: loadingTourney } = useDocument(tournamentId ? 'tournaments' : null, tournamentId || 'skip');

  // Handlers
  const handleAccept = async () => {
    if (!user || !invitation || !tournament) return;
    setProcessing(true);
    try {
      // 1. Update Invitation Status
      await updateDoc(doc(db, 'invitations', id!), {
        status: 'accepted',
        respondedAt: new Date()
      });

      // 2. Add User to Tournament Participants
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        participants: arrayUnion(user.id)
      });

      alert("¡Has aceptado la invitación!");
      navigate(`/tournament/${tournamentId}`);

    } catch (e) {
      console.error(e);
      alert("Error al aceptar la invitación");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!invitation) return;
    if (!window.confirm("¿Seguro que quieres rechazar esta invitación?")) return;
    setProcessing(true);
    try {
      await updateDoc(doc(db, 'invitations', id!), {
        status: 'rejected',
        respondedAt: new Date()
      });
      navigate('/notifications');
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loadingInvite || loadingTourney) return <div className="p-10 text-center text-white">Cargando invitación...</div>;

  if (!invitation || !tournament) {
    return (
      <div className="p-10 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Invitación no disponible</h2>
        <button onClick={() => navigate('/notifications')} className="text-brand hover:underline">Volver</button>
      </div>
    );
  }

  if (invitation.status !== 'pending') {
    return (
      <div className="p-10 text-white text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-text-muted">history</span>
        </div>
        <h2 className="text-2xl font-bold">Esta invitación ya ha sido {invitation.status === 'accepted' ? 'aceptada' : 'rechazada'}</h2>
        <button onClick={() => navigate('/notifications')} className="text-brand hover:underline">Volver a Notificaciones</button>
      </div>
    );
  }

  // Prepare Display Data
  const inviteImage = tournament.image || 'https://placehold.co/1200x400';
  const senderName = invitation.senderName || 'Un organizador';

  return (
    <div className="flex flex-col min-h-screen bg-background-main pb-20 px-6 py-10">

      <div className="max-w-4xl mx-auto w-full">
        <button onClick={() => navigate('/notifications')} className="flex items-center gap-2 text-text-muted text-sm font-bold mb-6 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Invitaciones
        </button>

        <div className="bg-background-surface border border-border-default rounded-2xl overflow-hidden shadow-2xl">
          {/* Hero Image */}
          <div className="h-64 relative bg-cover bg-center" style={{ backgroundImage: `url("${inviteImage}")` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block bg-brand px-3 py-1 rounded text-xs font-black uppercase text-white mb-2 tracking-wider shadow-lg">Invitación Oficial</span>
              <h1 className="text-4xl font-black text-white italic uppercase drop-shadow-lg">{tournament.name}</h1>
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8">
            <div>
              <p className="text-xl text-white font-medium mb-1">Has sido invitado por <span className="text-brand font-bold">{senderName}</span></p>
              <p className="text-text-muted">Te están invitando a participar como piloto oficial en este torneo.</p>
            </div>

            {/* Tournament Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background-surface flex items-center justify-center text-brand">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold">Simulador</p>
                  <p className="text-white font-bold">{tournament.simulator?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background-surface flex items-center justify-center text-brand">
                  <span className="material-symbols-outlined">flag</span>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold">Carreras</p>
                  <p className="text-white font-bold">{tournament.config?.races?.length || 0} Rondas</p>
                </div>
              </div>
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background-surface flex items-center justify-center text-brand">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-bold">Grid</p>
                  <p className="text-white font-bold">{tournament.config?.pilotCount || 20} Pilotos</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border-default pt-8 flex flex-col md:flex-row gap-4">
              <button
                onClick={handleAccept}
                disabled={processing}
                className="flex-1 bg-brand hover:bg-brand-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2"
              >
                {processing ? 'Procesando...' : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span> Aceptar e Inscribirme
                  </>
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="md:w-40 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">cancel</span> Rechazar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvitationDetail;
