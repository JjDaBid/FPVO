import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocument, useCollection } from '../hooks/useFirestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ConfirmModal from '../components/ConfirmModal';

const ResultEntry: React.FC = () => {
  const { tournamentId, raceId } = useParams<{ tournamentId: string, raceId: string }>();
  const navigate = useNavigate();

  // --- Data Fetching ---
  const { data: tournament, loading: loadingT } = useDocument('tournaments', tournamentId || 'unknown');
  const { data: existingResults, loading: loadingR } = useDocument(`tournaments/${tournamentId}/results`, `race_${raceId}`);
  const { data: allUsers } = useCollection('users');

  // --- State ---
  const [activeTab, setActiveTab] = useState<'practice' | 'qualy' | 'race'>('race');

  // Data Structure: { race: [{pos:1, userId: '...', time: '...'}, ...], qualy: [...], practice: [...] }
  const [sessionData, setSessionData] = useState<any>({
    practice: [],
    qualy: [],
    race: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // --- Effects ---

  // Load Existing Data
  useEffect(() => {
    if (existingResults) {
      setSessionData({
        practice: existingResults.practice || [],
        qualy: existingResults.qualy || [],
        race: existingResults.standings || existingResults.race || [] // Backward compat with 'standings'
      });
    }
  }, [existingResults]);

  // Initialize Forms if empty
  useEffect(() => {
    if (tournament && !loadingT) {
      const pilotCount = tournament.config?.pilotCount || 10;
      setSessionData((prev: any) => {
        const newData = { ...prev };
        ['practice', 'qualy', 'race'].forEach(key => {
          if (!newData[key] || newData[key].length === 0) {
            newData[key] = Array.from({ length: pilotCount }).map((_, i) => ({
              position: i + 1,
              userId: '',
              time: '',
              points: tournament.config?.pointsSystem?.[i] || 0
            }));
          }
        });
        return newData;
      });
    }
  }, [tournament, loadingT]);

  // --- Helpers ---
  const invitedIds = tournament?.config?.invitedUsers || [];
  const participants = tournament?.participants || [];
  const ownerId = tournament?.createdBy || tournament?.userId;

  const validIds = new Set([...invitedIds, ...participants]);
  if (ownerId) validIds.add(ownerId);

  // If no restrictions (no owner, no invites), show all. Otherwise filter.
  const availableDrivers = allUsers ? allUsers.filter((u: any) => validIds.size === 0 || validIds.has(u.id)) : [];

  const raceConfig = tournament?.config?.races.find((r: any) => r.id === Number(raceId));

  // --- Handlers ---
  const updateRow = (index: number, field: string, value: any) => {
    setSessionData((prev: any) => {
      const currentList = [...prev[activeTab]];
      currentList[index] = { ...currentList[index], [field]: value };

      // Auto-fill nickname if user changes
      if (field === 'userId') {
        const user = availableDrivers.find((u: any) => u.id === value);
        currentList[index].nickname = user?.nickname || 'Unknown';
      }

      return { ...prev, [activeTab]: currentList };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resultRef = doc(db, 'tournaments', tournamentId!, 'results', `race_${raceId}`);
      await setDoc(resultRef, {
        raceId: Number(raceId),
        trackId: raceConfig?.trackId || '',
        updatedAt: new Date(),
        practice: sessionData.practice,
        qualy: sessionData.qualy,
        race: sessionData.race,
        standings: sessionData.race, // Maintain 'standings' field for query simplicity if needed
        isFinished: true
      });
      navigate(`/tournament/${tournamentId}/race/${raceId}`);
    } catch (e) {
      console.error(e);
      alert("Error al guardar");
    } finally {
      setIsSaving(false);
      setModalOpen(false);
    }
  };

  if (loadingT || loadingR) return <div className="p-10 text-center text-white">Cargando...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background-main pb-20">

      {/* HEADER */}
      <div className="bg-background-secondary border-b border-border-default px-6 py-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white italic uppercase">Resultados: Ronda {raceId}</h1>
            <p className="text-text-muted text-sm font-bold">{raceConfig?.trackId || 'Pista Desconocida'}</p>
          </div>
          <div className="flex gap-2 bg-background-main p-1 rounded-lg border border-border-default">
            {['practice', 'qualy', 'race'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-md text-sm font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
              >
                {tab === 'qualy' ? 'Clasificación' : tab === 'race' ? 'Carrera' : 'Práctica'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8">
        <div className="bg-background-surface border border-border-default rounded-xl overflow-hidden">
          <div className="p-4 bg-background-secondary border-b border-border-default flex justify-between items-center">
            <h2 className="font-bold text-white uppercase tracking-wider">
              {activeTab === 'qualy' ? 'Tiempos de Clasificación' : activeTab === 'race' ? 'Posiciones Finales' : 'Tiempos de Práctica'}
            </h2>
            <span className="text-xs text-text-muted font-bold">Total: {sessionData[activeTab].length} Pilotos</span>
          </div>

          <div className="divide-y divide-border-default">
            {sessionData[activeTab].map((row: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-4 hover:bg-background-highlight transition-colors">
                {/* Position Label */}
                <div className={`w-8 h-8 rounded flex items-center justify-center font-black ${row.position <= 3 ? 'bg-white text-black' : 'text-text-muted bg-background-input'}`}>
                  {row.position}
                </div>

                {/* Driver Select */}
                <div className="flex-1 w-full">
                  <select
                    value={row.userId}
                    onChange={e => updateRow(idx, 'userId', e.target.value)}
                    className="w-full bg-background-input border border-border-default rounded-lg px-3 py-2 text-white font-bold focus:border-brand outline-none"
                  >
                    <option value="">-- Seleccionar Piloto --</option>
                    {availableDrivers.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.nickname || u.email}</option>
                    ))}
                  </select>
                </div>

                {/* Extra Fields based on Tab */}
                {activeTab !== 'race' && (
                  <div className="w-full md:w-32">
                    <input
                      type="text"
                      placeholder="1:24.500"
                      value={row.time || ''}
                      onChange={e => updateRow(idx, 'time', e.target.value)}
                      className="w-full bg-background-input border border-border-default rounded-lg px-3 py-2 text-white font-mono text-right focus:border-brand outline-none"
                    />
                  </div>
                )}

                {activeTab === 'race' && (
                  <div className="w-full md:w-20 text-right">
                    <span className="text-brand font-black text-lg">+{row.points}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={() => navigate(-1)} className="flex-1 bg-transparent border border-border-default text-text-muted hover:text-white font-bold py-3 rounded-xl transition-all">Cancelar</button>
          <button onClick={() => setModalOpen(true)} className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl shadow-lg shadow-brand/20 transition-all">Guardar Todo</button>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="¿Guardar Cambios?"
        message="Se actualizarán los resultados para esta sesión. Esto afectará las estadísticas del torneo."
        confirmLabel="Guardar"
        onConfirm={handleSave}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default ResultEntry;
