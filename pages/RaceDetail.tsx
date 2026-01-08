import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocument, useCollection } from '../hooks/useFirestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const RaceDetail: React.FC = () => {
    const { tournamentId, raceId } = useParams<{ tournamentId: string, raceId: string }>();
    const navigate = useNavigate();

    // Fetch Tournament
    const { data: tournament, loading: loadingT } = useDocument('tournaments', tournamentId || 'unknown');

    // Fetch Results 
    const { data: results, loading: loadingR } = useDocument(`tournaments/${tournamentId}/results`, `race_${raceId}`);

    // Fetch all Tracks and Cars to resolve names/images
    const { data: tracksData } = useCollection('tracks');
    const { data: allUsers } = useCollection('users');
    const { data: carsData } = useCollection('cars');

    const [activeTab, setActiveTab] = useState<'race' | 'qualy' | 'practice'>('race');
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    if (loadingT || loadingR) return <div className="p-10 text-white text-center">Cargando...</div>;
    if (!tournament) return <div className="p-10 text-white font-bold">Torneo no encontrado</div>;

    const raceConfig = tournament.config.races.find((r: any) => r.id === Number(raceId));
    if (!raceConfig) return <div className="p-10 text-white font-bold">Carrera no encontrada</div>;

    // Resolve Track Name & Image
    const track = tracksData ? tracksData.find((t: any) => t.id === raceConfig.trackId) : null;
    const trackName = track ? track.name : (raceConfig.trackId || 'Carrera');
    const trackImage = track?.imageUrl || tournament.image || 'https://placehold.co/1200x400';

    // Resolve Car & Image
    const car = carsData ? carsData.find((c: any) => c.id === raceConfig.carId) : null;
    const carName = car ? `${car.brand} ${car.model}` : 'Coche Desconocido';
    const carImage = car?.image || 'https://placehold.co/400x200?text=Car';

    const getUserAvatar = (uid: string) => {
        const u = allUsers?.find((user: any) => user.id === uid);
        return u?.avatar || 'https://placehold.co/150?text=User';
    };

    const hasResults = !!results;
    const sessionResults = results?.[activeTab === 'race' ? 'standings' : activeTab] || [];

    return (
        <div className="flex flex-col min-h-screen bg-background-main pb-20">

            {/* HEADER HERO */}
            <div className="relative bg-background-secondary border-b border-border-default shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url("${trackImage}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-background-secondary/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background-secondary via-background-secondary/40 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex flex-col gap-2 z-10 w-full md:w-2/3">
                        <button onClick={() => navigate(`/tournament/${tournamentId}`)} className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-2 font-bold text-sm uppercase tracking-wide w-fit">
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Volver al Torneo
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-brand text-white text-xs font-black px-2 py-1 uppercase rounded tracking-wider">Ronda {raceId}</div>
                            {hasResults ? (
                                <div className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-black px-2 py-1 uppercase rounded tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">flag</span> Finalizada
                                </div>
                            ) : (
                                <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-black px-2 py-1 uppercase rounded tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Pendiente
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tight shadow-black drop-shadow-md">GP de {trackName}</h1>
                        <p className="text-text-muted font-bold flex items-center gap-2 text-lg">
                            <span className="material-symbols-outlined">calendar_today</span> {new Date().toLocaleDateString()}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4">
                            {/* Car Card */}
                            <div
                                onClick={() => setExpandedImage(carImage)}
                                className="group flex items-center gap-4 bg-background-surface/50 backdrop-blur-sm border border-border-default/50 p-3 rounded-xl w-fit cursor-pointer hover:bg-background-surface/80 transition-all hover:scale-105 shadow-lg active:scale-95"
                            >
                                <div className="relative w-20 h-12 rounded-lg overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${carImage}")` }}></div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">directions_car</span> Coche
                                    </p>
                                    <p className="text-white font-bold leading-none">{carName}</p>
                                </div>
                            </div>

                            {/* Track Card */}
                            <div
                                onClick={() => setExpandedImage(trackImage)}
                                className="group flex items-center gap-4 bg-background-surface/50 backdrop-blur-sm border border-border-default/50 p-3 rounded-xl w-fit cursor-pointer hover:bg-background-surface/80 transition-all hover:scale-105 shadow-lg active:scale-95"
                            >
                                <div className="relative w-20 h-12 rounded-lg overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${trackImage}")` }}></div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">map</span> Pista
                                    </p>
                                    <p className="text-white font-bold leading-none">{trackName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 z-10">
                        <button
                            onClick={() => navigate(`/tournament/${tournamentId}/race/${raceId}/results`)}
                            className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">edit_note</span>
                            {hasResults ? 'Editar Resultados' : 'Ingresar Resultados'}
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

                {/* TABS */}
                <div className="flex border-b border-border-default">
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'practice' ? 'border-brand text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                    >
                        Práctica
                    </button>
                    <button
                        onClick={() => setActiveTab('qualy')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'qualy' ? 'border-brand text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                    >
                        Clasificación
                    </button>
                    <button
                        onClick={() => setActiveTab('race')}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'race' ? 'border-brand text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                    >
                        Carrera
                    </button>
                </div>

                {/* RESULTS TABLE */}
                {sessionResults.length > 0 ? (
                    <div className="bg-background-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-background-secondary border-b border-border-default text-text-muted text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4 w-20 text-center">Pos</th>
                                    <th className="px-6 py-4 w-10"></th>
                                    <th className="px-6 py-4">Piloto</th>
                                    {activeTab === 'race' && <th className="px-6 py-4 text-center">Puntos</th>}
                                    {activeTab !== 'race' && <th className="px-6 py-4 text-right">Tiempo</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default">
                                {sessionResults.map((res: any, idx: number) => {
                                    return (
                                        <tr key={idx} className="hover:bg-background-highlight transition-colors group">
                                            <td className="px-6 py-4 text-center">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${res.position === 1 ? 'bg-yellow-400 text-black' : res.position === 2 ? 'bg-gray-300 text-black' : res.position === 3 ? 'bg-amber-600 text-black' : 'text-text-muted bg-background-input'}`}>
                                                    {res.position}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 w-10 text-center">
                                                <div className="w-12 h-12 rounded-full bg-cover bg-center bg-gray-700 mx-auto" style={{ backgroundImage: `url("${getUserAvatar(res.userId)}")` }}></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white text-lg group-hover:text-brand transition-colors">{res.nickname || res.userId}</p>
                                            </td>
                                            {activeTab === 'race' && (
                                                <td className="px-6 py-4 text-center font-black text-white text-xl">
                                                    {res.points}
                                                </td>
                                            )}
                                            {activeTab !== 'race' && (
                                                <td className="px-6 py-4 text-right font-mono text-brand font-bold">
                                                    {res.time || '-'}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border-default rounded-2xl">
                        <span className="material-symbols-outlined text-6xl text-text-muted opacity-50 mb-4">
                            {activeTab === 'race' ? 'flag' : 'timer'}
                        </span>
                        <h2 className="text-xl font-bold text-white mb-2">Sin Resultados de {activeTab === 'race' ? 'Carrera' : activeTab === 'qualy' ? 'Clasificación' : 'Práctica'}</h2>
                        <p className="text-text-muted mb-6">Aún no se han ingresado los datos para esta sesión.</p>
                        <button
                            onClick={() => navigate(`/tournament/${tournamentId}/race/${raceId}/results`)}
                            className="bg-background-secondary hover:bg-background-highlight border border-border-default text-white px-6 py-2 rounded-lg font-bold transition-all"
                        >
                            Ingresar Datos Ahora
                        </button>
                    </div>
                )}

            </div>

            {/* IMAGE MODAL */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
                    onClick={() => setExpandedImage(null)}
                >
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    <img
                        src={expandedImage}
                        alt="Expanded View"
                        className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-border-default"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    );
};

export default RaceDetail;
