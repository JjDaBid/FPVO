import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { useCollection, useUserProfile } from '../hooks/useFirestore';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Interfaces for complex state
interface RaceConfig {
  id: number;
  trackId: string;
  carId: string;
  practiceTime: string;
  qualyTime: string;
  laps: string;
}

const CompetitionSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const editId = location.state?.tournamentId || null;

  // --- Data Loading ---
  const { data: tracksData } = useCollection('tracks');
  const { data: carsData } = useCollection('cars');
  const { data: usersData } = useCollection('users');
  const { data: simulatorsData } = useCollection('simulators');
  const { profile: user } = useUserProfile();

  const displaySimulators = simulatorsData;


  // --- State Management ---
  const [section, setSection] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState<{ image: string, title: string } | null>(null);

  // SECTION 1: Event Details
  const [eventDetails, setEventDetails] = useState({
    name: '',
    type: 'Torneo', // Default
    simulatorId: '',
  });

  // SECTION 2: Configuration
  // A. Pilots
  const [pilotConfig, setPilotConfig] = useState<{ count: number, invited: string[] }>({
    count: 10,
    invited: []
  });

  // B. Scoring
  const [pointsSystem, setPointsSystem] = useState<number[]>([]);

  // C. Calendar
  const [raceCount, setRaceCount] = useState(1);
  const [races, setRaces] = useState<RaceConfig[]>([]);

  // Filter available tracks/cars by simulatorId
  const availableTracks = React.useMemo(() => {
    return tracksData.filter((t: any) => t.simulatorId === eventDetails.simulatorId);
  }, [tracksData, eventDetails.simulatorId]);

  const availableCars = React.useMemo(() => {
    return carsData.filter((c: any) => c.simulatorId === eventDetails.simulatorId);
  }, [carsData, eventDetails.simulatorId]);


  useEffect(() => {
    if (editMode && editId) {
      const loadTournament = async () => {
        setIsLoadingEdit(true);
        try {
          const docRef = doc(db, 'tournaments', editId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setEventDetails({
              name: data.name || '',
              type: data.type || 'Torneo', // Assuming type exists or default
              simulatorId: data.simulator?.id || '',
            });

            if (data.config) {
              setPilotConfig({
                count: data.config.pilotCount || 10,
                invited: data.config.invitedUsers || []
              });
              setPointsSystem(data.config.pointsSystem || []);

              if (data.config.races) {
                setRaces(data.config.races);
                setRaceCount(data.config.races.length);
              }
            }
          }
        } catch (error) {
          console.error("Error loading tournament for edit:", error);
          alert("Error al cargar el torneo para editar.");
        } finally {
          setIsLoadingEdit(false);
        }
      };
      loadTournament();
    }
  }, [editMode, editId]);

  // Initialize/Update Points System when pilot count changes
  useEffect(() => {
    if (isLoadingEdit) return; // Don't override while loading
    // Standard F1-like system mock as default or empty array
    setPointsSystem(prev => {
      const newPoints = [...prev];
      if (newPoints.length < pilotConfig.count) {
        // Fill remaining with 0 or continue pattern
        for (let i = newPoints.length; i < pilotConfig.count; i++) newPoints.push(0);
      } else if (newPoints.length > pilotConfig.count) {
        newPoints.length = pilotConfig.count;
      }
      return newPoints;
    });
  }, [pilotConfig.count, isLoadingEdit]);

  // Initialize/Update Races when count changes
  useEffect(() => {
    if (isLoadingEdit) return; // Don't override while loading
    setRaces(prev => {
      const newRaces = [...prev];
      if (newRaces.length < raceCount) {
        for (let i = newRaces.length; i < raceCount; i++) {
          newRaces.push({
            id: i + 1,
            trackId: '', // Default to empty
            carId: '',     // Default to empty
            practiceTime: '0',
            qualyTime: '0',
            laps: '0'
          });
        }
      } else if (newRaces.length > raceCount) {
        newRaces.length = raceCount;
      }
      return newRaces;
    });
  }, [raceCount, isLoadingEdit]); // removed tracksData/carsData deps as we no longer default to [0]

  // --- Handlers ---
  // ... (Previous handlers remain same, just ensure they exist or are re-declared if overwritten scope was huge)
  // Since I am replacing the top block down to 'const handleInviteToggle', I need to stop before handlers if possible
  // BUT handlers rely on state which I re-declared.
  // Wait, I am replacing lines 18 to 186 basically.

  const handleInviteToggle = (userId: string) => {
    setPilotConfig(prev => {
      const isInvited = prev.invited.includes(userId);
      if (isInvited) return { ...prev, invited: prev.invited.filter(id => id !== userId) };
      return { ...prev, invited: [...prev.invited, userId] };
    });
  };

  const handlePointChange = (positionIndex: number, value: string) => {
    const newPoints = [...pointsSystem];
    newPoints[positionIndex] = parseInt(value) || 0;
    setPointsSystem(newPoints);
  };

  const updateRace = (index: number, field: keyof RaceConfig, value: string) => {
    const newRaces = [...races];
    newRaces[index] = { ...newRaces[index], [field]: value };
    setRaces(newRaces);
  };

  const openPreview = (type: 'track' | 'car', id: string) => {
    if (!id) return;
    if (type === 'track') {
      const item = tracksData.find((t: any) => t.id === id);
      if (item) setExpandedPreview({ image: item.imageUrl || 'https://placehold.co/800x400', title: item.name });
    } else {
      const item = carsData.find((c: any) => c.id === id);
      if (item) setExpandedPreview({ image: item.image || 'https://placehold.co/800x400', title: `${item.brand} ${item.model}` });
    }
  };

  const handleNext = () => {
    if (!eventDetails.name) return alert("El nombre del torneo es obligatorio");
    if (!eventDetails.simulatorId) return alert("Selecciona un simulador");
    setSection(2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tournamentData = {
        ...eventDetails,
        simulator: displaySimulators.find(s => s.id === eventDetails.simulatorId) || {},
        config: {
          pilotCount: pilotConfig.count,
          invitedUsers: pilotConfig.invited,
          pointsSystem,
          races,
        },
        status: 'active', // Keep active or existing status? For now update keeps active
        updatedAt: new Date(),
        // createdBy: user?.id || null, // Don't overwrite creator
      };

      if (editMode && editId) {
        const docRef = doc(db, 'tournaments', editId);
        await updateDoc(docRef, tournamentData);
        console.log("Tournament updated:", editId);
      } else {
        const newDocData = { ...tournamentData, createdAt: new Date(), createdBy: user?.id || null };
        const docRef = await addDoc(collection(db, 'tournaments'), newDocData);
        console.log("Tournament created:", docRef.id);
      }

      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert("Error al guardar el torneo");
    } finally {
      setIsSaving(false);
    }
  };

  // Safe checks for empty data
  if (!tracksData || !carsData || !usersData) {
    return <div className="text-white p-10 text-center">Cargando recursos...</div>;
  }

  if (isLoadingEdit) {
    return <div className="text-white p-10 text-center">Cargando datos del torneo...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#101622] min-h-screen text-white">

      {/* HEADER */}
      <div className="bg-[#0d1219] border-b border-[#1e293b] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => section === 2 ? setSection(1) : navigate(-1)} className="text-[#64748b] hover:text-white flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-bold text-sm">Atrás</span>
          </button>
          <h1 className="text-xl font-black italic tracking-wide text-white">{editMode ? 'EDITAR TORNEO' : 'NUEVO TORNEO'}</h1>
          <div className="w-20"></div>
        </div>

        {/* STEPS */}
        <div className="max-w-6xl mx-auto px-6 pb-0 flex gap-8">
          <button onClick={() => setSection(1)} className={`pb-3 border-b-2 px-2 text-sm font-bold uppercase tracking-wider transition-colors ${section === 1 ? 'border-[#135bec] text-white' : 'border-transparent text-[#64748b]'}`}>1. Detalles del Evento</button>
          <button onClick={handleNext} className={`pb-3 border-b-2 px-2 text-sm font-bold uppercase tracking-wider transition-colors ${section === 2 ? 'border-[#135bec] text-white' : 'border-transparent text-[#64748b]'}`}>2. Configuración</button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

          {/* SECTION 1: DETAILS */}
          {section === 1 && (
            <div className="space-y-10 animate-fade-in">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider">Nombre del Torneo</label>
                  <input
                    type="text"
                    value={eventDetails.name}
                    onChange={e => setEventDetails({ ...eventDetails, name: e.target.value })}
                    className="w-full bg-[#0b0f15] border border-[#1e293b] rounded-xl p-4 text-lg font-bold text-white focus:outline-none focus:border-[#135bec] placeholder-[#64748b]"
                    placeholder="Ej. Campeonato de Verano 2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider">Tipo de Competición</label>
                  <select
                    value={eventDetails.type}
                    onChange={e => setEventDetails({ ...eventDetails, type: e.target.value })}
                    className="w-full bg-[#0b0f15] border border-[#1e293b] rounded-xl p-4 text-lg font-bold text-white focus:outline-none focus:border-[#135bec] appearance-none"
                  >
                    <option>Torneo</option>
                    <option>Liga</option>
                    <option>Copa</option>
                    <option>Evento Único</option>
                  </select>
                </div>
              </div>

              {/* Simulators */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider">Simulador</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displaySimulators.map(sim => (
                    <div
                      key={sim.id}
                      onClick={() => setEventDetails({ ...eventDetails, simulatorId: sim.id })}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative group ${eventDetails.simulatorId === sim.id ? 'border-[#135bec] ring-2 ring-[#135bec]/30' : 'border-[#1e293b] hover:border-[#64748b]'}`}
                    >
                      <div className="h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${sim.image})` }}>
                        <div className={`absolute inset-0 bg-black/40 transition-colors ${eventDetails.simulatorId === sim.id ? 'bg-[#135bec]/20' : ''}`}></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-white font-bold text-center text-sm">{sim.name}</p>
                      </div>
                      {eventDetails.simulatorId === sim.id && (
                        <div className="absolute top-2 right-2 bg-[#135bec] text-white rounded-full p-1"><span className="material-symbols-outlined text-sm">check</span></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CONFIGURATION */}
          {section === 2 && (
            <div className="space-y-12 animate-fade-in">

              {/* A. PILOTS */}
              <div className="bg-[#192233] border border-[#1e293b] rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1e293b]">
                  <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]"><span className="material-symbols-outlined">groups</span></div>
                  <h2 className="text-xl font-black italic">A. Pilotos ({pilotConfig.count})</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div>
                    <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider block mb-3">Número de Pilotos</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min="2" max="50"
                        value={pilotConfig.count}
                        onChange={e => setPilotConfig({ ...pilotConfig, count: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-[#0b0f15] rounded-lg appearance-none cursor-pointer accent-[#135bec]"
                      />
                      <span className="text-2xl font-black text-white w-12 text-center">{pilotConfig.count}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider block mb-3">Invitar Pilotos Conectados</label>
                    <div className="bg-[#0b0f15] rounded-xl border border-[#1e293b] h-48 overflow-y-auto p-2 space-y-1">
                      {usersData.length > 0 ? usersData.map((u: any) => (
                        <div key={u.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1f2a3f] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0d1219] flex items-center justify-center text-xs font-bold text-[#64748b]">
                              {u.nickname ? u.nickname[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{u.nickname || 'Unknown'}</p>
                              <p className="text-xs text-[#135bec]">• Online</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleInviteToggle(u.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${pilotConfig.invited.includes(u.id) ? 'bg-[#135bec] text-white' : 'bg-[#0d1219] text-[#64748b] hover:text-white'}`}
                          >
                            {pilotConfig.invited.includes(u.id) ? 'Invitado' : 'Invitar'}
                          </button>
                        </div>
                      )) : (
                        <p className="text-center text-[#64748b] text-sm py-10">No hay usuarios activos para invitar.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* B. SCORING */}
              <div className="bg-[#192233] border border-[#1e293b] rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1e293b]">
                  <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]"><span className="material-symbols-outlined">emoji_events</span></div>
                  <h2 className="text-xl font-black italic">B. Sistema de Puntuación</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: Math.min(pilotConfig.count, 20) }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#64748b] uppercase">Posición {i + 1}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={pointsSystem[i] || 0}
                          onChange={e => handlePointChange(i, e.target.value)}
                          className="w-full bg-[#0b0f15] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-bold text-center focus:border-[#135bec] focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b] font-bold">PTS</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#64748b] mt-4">* Configura los puntos para cada posición. (Máx. visible: primeros 20)</p>
              </div>

              {/* C. CALENDAR */}
              <div className="bg-[#192233] border border-[#1e293b] rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1e293b]">
                  <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]"><span className="material-symbols-outlined">calendar_month</span></div>
                  <h2 className="text-xl font-black italic">C. Calendario de Carreras</h2>
                </div>

                <div className="mb-8 max-w-xs">
                  <label className="text-sm font-bold text-[#64748b] uppercase tracking-wider block mb-3">Número de Carreras</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => raceCount > 1 && setRaceCount(c => c - 1)} className="w-10 h-10 rounded-lg bg-[#0b0f15] hover:bg-[#1f2a3f] text-white flex items-center justify-center font-bold text-xl transition-colors">-</button>
                    <span className="text-2xl font-black text-white w-12 text-center">{raceCount}</span>
                    <button onClick={() => setRaceCount(c => c + 1)} className="w-10 h-10 rounded-lg bg-[#0b0f15] hover:bg-[#1f2a3f] text-white flex items-center justify-center font-bold text-xl transition-colors">+</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {races.map((race, idx) => (
                    <div key={race.id} className="bg-[#0b0f15] border border-[#1e293b] rounded-xl p-5 hover:border-[#64748b] transition-colors">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Race Header */}
                        <div className="flex items-center gap-4 md:w-32 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#135bec] text-white flex items-center justify-center font-black italic shadow-lg shadow-[#135bec]/20">
                            {race.id}
                          </div>
                          <span className="font-bold text-[#64748b] uppercase tracking-wider text-sm md:hidden">Carrera {race.id}</span>
                        </div>

                        {/* Configs */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Track */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-[#64748b]">Pista</label>
                            <div className="relative flex items-center">
                              <select
                                value={race.trackId}
                                onChange={e => updateRace(idx, 'trackId', e.target.value)}
                                className="w-full bg-[#0d1219] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white font-bold focus:border-[#135bec] focus:outline-none pr-10"
                              >
                                <option value="">Seleccionar...</option>
                                {availableTracks.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                              {race.trackId && (
                                <button
                                  onClick={() => openPreview('track', race.trackId)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#135bec]/20 text-[#135bec] rounded-md px-2 py-1 text-xs font-bold hover:bg-[#135bec]/30 transition-colors"
                                >
                                  VER
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Car */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-[#64748b]">Coche</label>
                            <div className="relative flex items-center">
                              <select
                                value={race.carId}
                                onChange={e => updateRace(idx, 'carId', e.target.value)}
                                className="w-full bg-[#0d1219] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white font-bold focus:border-[#135bec] focus:outline-none pr-10"
                              >
                                <option value="">Seleccionar...</option>
                                {availableCars.map((c: any) => <option key={c.id} value={c.id}>{c.brand} {c.model}</option>)}
                              </select>
                              {race.carId && (
                                <button
                                  onClick={() => openPreview('car', race.carId)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#135bec]/20 text-[#135bec] rounded-md px-2 py-1 text-xs font-bold hover:bg-[#135bec]/30 transition-colors"
                                >
                                  VER
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Times */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-[#64748b]">Práctica / Qualy (min)</label>
                            <div className="flex gap-2">
                              <input type="number" placeholder="P" value={race.practiceTime} onChange={e => updateRace(idx, 'practiceTime', e.target.value)} className="w-full bg-[#0d1219] border border-[#1e293b] rounded-lg px-2 py-2 text-sm font-bold text-center text-white focus:border-[#135bec] focus:outline-none" />
                              <input type="number" placeholder="Q" value={race.qualyTime} onChange={e => updateRace(idx, 'qualyTime', e.target.value)} className="w-full bg-[#0d1219] border border-[#1e293b] rounded-lg px-2 py-2 text-sm font-bold text-center text-white focus:border-[#135bec] focus:outline-none" />
                            </div>
                          </div>

                          {/* Laps */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-[#64748b]">Vueltas</label>
                            <input type="number" value={race.laps} onChange={e => updateRace(idx, 'laps', e.target.value)} className="w-full bg-[#0d1219] border border-[#1e293b] rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#135bec] focus:outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#192233] border-t border-[#1e293b] p-4 sticky bottom-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xs text-[#64748b]">
            <p className="font-bold text-white uppercase tracking-wider">{section === 1 ? 'CONFIGURANDO DETALLES' : 'FINALIZANDO CONFIGURACIÓN'}</p>
            {section === 2 && <p>{raceCount} Carreras · {pilotConfig.count} Pilotos</p>}
          </div>

          {section === 1 ? (
            <button onClick={handleNext} className="bg-[#135bec] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#135bec]/20 transition-all flex items-center gap-2">
              Siguiente <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button onClick={() => setModalOpen(true)} className="bg-[#135bec] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#135bec]/20 transition-all flex items-center gap-2">
              {isSaving ? 'Guardando...' : (editMode ? 'Guardar Cambios' : 'Crear Torneo')} <span className="material-symbols-outlined">check_circle</span>
            </button>
          )}
        </div>
      </div>

      {expandedPreview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setExpandedPreview(null)}
        >
          <div className="relative max-w-4xl w-full bg-[#192233] rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b] flex flex-col transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 md:h-96 w-full bg-cover bg-center" style={{ backgroundImage: `url("${expandedPreview.image}")` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#192233] via-transparent to-transparent"></div>
              <button
                onClick={() => setExpandedPreview(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{expandedPreview.title}</h3>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        title={editMode ? "¿Guardar Cambios?" : "¿Crear Torneo?"}
        message={editMode ? `¿Confirmas que deseas guardar los cambios en "${eventDetails.name}"?` : `Estás a punto de crear "${eventDetails.name}" con ${raceCount} carreras planificadas.`}
        confirmLabel={editMode ? "Guardar" : "Confirmar y Crear"}
        onConfirm={handleSave}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default CompetitionSetup;
