
import React, { useState } from 'react';
import data from '@/data';
import ConfirmModal from '@/components/ConfirmModal';

const Tracks: React.FC = () => {
  const [trackList, setTrackList] = useState(data.tracks);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean, type: 'save' | 'delete' | null, trackId?: string }>({ open: false, type: null });
  const { metadata } = data;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    country: 'es',
    distance: '',
    layout: 'GP Layout',
    imageUrl: ''
  });

  const openDrawer = (track: any = null) => {
    if (track) {
      setEditingTrack(track);
      setFormData({
        name: track.name,
        country: track.countryCode || 'es',
        distance: track.distance.split(' ')[0],
        layout: track.layout,
        imageUrl: track.image || ''
      });
    } else {
      setEditingTrack(null);
      setFormData({ name: '', country: 'es', distance: '', layout: 'GP Layout', imageUrl: '' });
    }
    setDrawerOpen(true);
  };

  const handleAction = () => {
    if (confirmModal.type === 'delete' && confirmModal.trackId) {
      setTrackList(trackList.filter(t => t.id !== confirmModal.trackId));
      console.log(`Deleted track ${confirmModal.trackId}`);
    } else if (confirmModal.type === 'save') {
      if (editingTrack) {
        setTrackList(trackList.map(t => 
          t.id === editingTrack.id 
            ? { 
                ...t, 
                name: formData.name, 
                distance: `${formData.distance} km`, 
                layout: formData.layout, 
                image: formData.imageUrl || t.image,
                country: metadata.countries.find(c => c.code === formData.country)?.name || formData.country,
                countryCode: formData.country
              } 
            : t
        ));
      } else {
        const newTrack = {
          id: `t${Date.now()}`,
          name: formData.name,
          layout: formData.layout,
          country: metadata.countries.find(c => c.code === formData.country)?.name || 'Desconocido',
          countryCode: formData.country,
          flag: metadata.countries.find(c => c.code === formData.country)?.flag || '🏁',
          distance: `${formData.distance} km`,
          image: formData.imageUrl || "https://picsum.photos/400/250?random=" + Math.random()
        };
        setTrackList([newTrack, ...trackList]);
      }
      setDrawerOpen(false);
    }
    setConfirmModal({ open: false, type: null });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <header className="p-6 md:p-10 pb-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">PISTAS FPVO</h1>
            <p className="text-text-secondary text-base max-w-2xl">
              Catálogo oficial de circuitos disponibles para las competiciones internacionales.
            </p>
          </div>
          <button 
            onClick={() => openDrawer()}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Añadir Pista</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-lg text-sm placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white" 
              placeholder="Buscar pista por nombre, país o código..." 
              type="text"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 pt-0">
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-[#1f293a] border-b border-gray-200 dark:border-border-dark">
                <tr>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider w-16 text-center">Icono</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Circuito</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Ubicación</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Longitud</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                {trackList.map((track) => (
                  <tr key={track.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 mx-auto rounded-lg bg-cover bg-center border border-gray-200 dark:border-border-dark" style={{ backgroundImage: `url("${track.image}")` }}></div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{track.name}</span>
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">{track.layout}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{track.flag} {track.country}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                        {track.distance}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openDrawer(track)}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ open: true, type: 'delete', trackId: track.id })}
                          className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-surface-dark shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 dark:border-border-dark flex flex-col ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-[#1f293a]/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{editingTrack ? 'Editar Pista' : 'Añadir Nueva Pista'}</h2>
          </div>
          <button className="text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => setDrawerOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background-dark">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5 uppercase tracking-widest text-[10px]">URL de la Imagen (Opcional)</label>
              <input 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="block w-full rounded-lg border-[#232f48] bg-[#111722] text-white py-2.5 px-3 focus:ring-primary focus:border-primary outline-none text-sm" 
                placeholder="https://ejemplo.com/pista.png"
                type="text" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Nombre del Circuito</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="block w-full rounded-lg border-[#232f48] bg-[#111722] text-white py-2.5 px-3 focus:ring-primary focus:border-primary outline-none" 
                type="text" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">País</label>
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="block w-full rounded-lg border-[#232f48] bg-[#111722] text-white py-2.5 px-3 focus:ring-primary outline-none appearance-none"
                >
                  {metadata.countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">KM (Longitud)</label>
                <input 
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  className="block w-full rounded-lg border-[#232f48] bg-[#111722] text-white py-2.5 px-3 focus:ring-primary outline-none" 
                  type="number" 
                  step="0.001"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Variante (Layout)</label>
              <input 
                value={formData.layout}
                onChange={(e) => setFormData({...formData, layout: e.target.value})}
                className="block w-full rounded-lg border-[#232f48] bg-[#111722] text-white py-2.5 px-3 focus:ring-primary outline-none" 
                type="text" 
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[#232f48] flex justify-end gap-3 bg-[#192233]">
          <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white" onClick={() => setDrawerOpen(false)}>Cancelar</button>
          <button 
            onClick={() => setConfirmModal({ open: true, type: 'save' })}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {editingTrack ? 'Actualizar Pista' : 'Guardar Pista'}
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.type === 'delete' ? "¿Eliminar pista?" : "¿Guardar cambios?"}
        message={confirmModal.type === 'delete' ? "Esta acción es permanente y no se podrá recuperar la información de este circuito." : "¿Deseas guardar la nueva información de este circuito en el catálogo de FPVO?"}
        confirmLabel={confirmModal.type === 'delete' ? "Eliminar" : "Confirmar"}
        type={confirmModal.type === 'delete' ? 'danger' : 'primary'}
        onConfirm={handleAction}
        onCancel={() => setConfirmModal({ open: false, type: null })}
      />
    </div>
  );
};

export default Tracks;
