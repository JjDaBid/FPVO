import React, { useState } from 'react';
import { useUserProfile, useCollection } from '../hooks/useFirestore';
import ConfirmModal from '../components/ConfirmModal';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Simulators: React.FC = () => {
    const { data: simulators, loading } = useCollection('simulators');
    const { profile: user } = useUserProfile();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSim, setSelectedSim] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean, type: 'delete' | 'save' | null }>({ open: false, type: null });

    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    const handleEdit = (sim: any) => {
        setSelectedSim(sim);
        setFormData({
            name: sim.name || '',
            image: sim.image || ''
        });
        setIsEditing(true);
    };

    const handleCreate = () => {
        setSelectedSim(null);
        setFormData({
            name: '',
            image: ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!formData.name) {
                alert("El nombre del simulador es obligatorio");
                setIsSaving(false);
                return;
            }

            const simData = {
                name: formData.name,
                image: formData.image,
                updatedAt: new Date()
            };

            if (selectedSim) {
                await updateDoc(doc(db, 'simulators', selectedSim.id), simData);
            } else {
                await addDoc(collection(db, 'simulators'), {
                    ...simData,
                    createdAt: new Date()
                });
            }

            setIsEditing(false);
            setConfirmModal({ open: false, type: null });
        } catch (error) {
            console.error("Error saving simulator:", error);
            alert("Hubo un error al guardar el simulador.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSim) return;
        setIsSaving(true);
        try {
            await deleteDoc(doc(db, 'simulators', selectedSim.id));
            setIsEditing(false);
            setConfirmModal({ open: false, type: null });
        } catch (error) {
            console.error("Error deleting simulator:", error);
            alert("Hubo un error al eliminar el simulador.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredSimulators = (simulators || []).filter((sim: any) =>
        sim.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#135bec] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tight text-white">SIMULADORES</h1>
                    <p className="text-[#94a3b8] mt-1">Plataformas soportadas para competencias</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar simulador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-[#1e293b] bg-[#0b0f15] py-2 pl-10 pr-4 text-white placeholder-[#64748b] focus:border-[#135bec] focus:outline-none focus:ring-1 focus:ring-[#135bec] md:w-64"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-[#135bec] hover:bg-[#1d4ed8] text-white p-2.5 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-[#135bec]/20"
                    >
                        <span className="material-symbols-outlined">add</span> <span className="ml-2 font-bold hidden md:inline">Nuevo</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSimulators.map((sim: any) => (
                    <div key={sim.id} className="group relative overflow-hidden rounded-xl border border-[#1e293b] bg-[#192233] transition-all hover:border-[#135bec]/50 hover:shadow-lg shadow-[#135bec]/10">
                        <div className="aspect-video w-full overflow-hidden bg-[#0d1219] relative">
                            {sim.image ? (
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${sim.image}")` }}></div>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#64748b]">
                                    <span className="material-symbols-outlined text-4xl">sports_esports</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#192233] to-transparent opacity-80"></div>

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <h3 className="text-xl font-black italic text-white">{sim.name}</h3>
                                <button
                                    onClick={() => handleEdit(sim)}
                                    className="p-2 bg-[#1e293b] hover:bg-[#135bec] rounded-lg text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredSimulators.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                        <span className="material-symbols-outlined mb-2 text-4xl text-[#64748b]">sports_esports</span>
                        <p className="text-[#94a3b8]">No se encontraron simuladores.</p>
                    </div>
                )}
            </div>

            {/* EDIT/CREATE MODAL */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#192233] border border-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-[#1e293b] flex justify-between items-center bg-[#0d1219]">
                            <h3 className="text-white text-xl font-black italic">{selectedSim ? 'Editar Simulador' : 'Nuevo Simulador'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-[#64748b] hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                                    placeholder="Ej. Assetto Corsa Competizione"
                                />
                            </div>
                            <div>
                                <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Imagen URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                                        placeholder="https://..."
                                    />
                                    {formData.image && (
                                        <div className="h-12 w-20 bg-cover bg-center rounded border border-[#1e293b]" style={{ backgroundImage: `url('${formData.image}')` }}></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#1e293b] bg-[#0d1219] flex justify-between">
                            {selectedSim ? (
                                <button
                                    onClick={() => setConfirmModal({ open: true, type: 'delete' })}
                                    className="text-[#ef4444] hover:text-white font-bold text-sm px-4 py-2 hover:bg-[#ef4444] rounded-lg transition-colors"
                                    disabled={isSaving}
                                >
                                    Eliminar
                                </button>
                            ) : <div></div>}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 text-[#94a3b8] hover:text-white font-bold transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setConfirmModal({ open: true, type: 'save' })}
                                    className="px-6 py-2 bg-[#135bec] hover:bg-[#1d4ed8] text-white font-bold rounded-lg shadow-lg shadow-[#135bec]/20 transition-all flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.open}
                title={confirmModal.type === 'delete' ? '¿Eliminar Simulador?' : '¿Guardar Cambios?'}
                message={confirmModal.type === 'delete' ? 'Esta acción no se puede deshacer.' : 'Se actualizará la información del simulador.'}
                confirmLabel={confirmModal.type === 'delete' ? 'Eliminar' : 'Guardar'}
                type={confirmModal.type === 'delete' ? 'danger' : 'info'}
                onConfirm={confirmModal.type === 'delete' ? handleDelete : handleSave}
                onCancel={() => setConfirmModal({ open: false, type: null })}
            />
        </div>
    );
};

export default Simulators;
