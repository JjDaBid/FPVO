
import React, { useState } from 'react';
import data from '@/data';
import ConfirmModal from '@/components/ConfirmModal';

const Cars: React.FC = () => {
  const [carList, setCarList] = useState(data.cars);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean, type: 'save' | 'delete' | null, carId?: string }>({ open: false, type: null });
  const { metadata } = data;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'GT3',
    country: 'de',
    status: 'Activo',
    imageUrl: ''
  });

  const handleEditClick = (car: any) => {
    setSelectedCar(car);
    setIsEditing(true);
    setFormData({
      name: car.name,
      category: car.category,
      country: car.countryCode || 'de',
      status: car.status,
      imageUrl: car.image || ''
    });
  };

  const handleCreateNew = () => {
    setSelectedCar(null);
    setIsEditing(true);
    setFormData({
      name: '',
      category: 'GT3',
      country: 'de',
      status: 'Activo',
      imageUrl: ''
    });
  };

  const handleAction = () => {
    if (confirmModal.type === 'delete' && confirmModal.carId) {
      setCarList(carList.filter(c => c.id !== confirmModal.carId));
      if (selectedCar?.id === confirmModal.carId) {
        setIsEditing(false);
        setSelectedCar(null);
      }
      console.log(`Deleted car ${confirmModal.carId}`);
    } else if (confirmModal.type === 'save') {
      if (selectedCar) {
        setCarList(carList.map(c => 
          c.id === selectedCar.id 
            ? { 
                ...c, 
                name: formData.name, 
                category: formData.category, 
                status: formData.status, 
                image: formData.imageUrl || c.image,
                country: metadata.countries.find(co => co.code === formData.country)?.name || formData.country,
                countryCode: formData.country
              } 
            : c
        ));
      } else {
        const newCar = {
          id: `c${Date.now()}`,
          name: formData.name,
          category: formData.category,
          status: formData.status,
          country: metadata.countries.find(co => co.code === formData.country)?.name || 'Desconocido',
          countryCode: formData.country,
          flag: metadata.countries.find(co => co.code === formData.country)?.flag || '🏁',
          image: formData.imageUrl || "https://picsum.photos/400/240?random=" + Math.random()
        };
        setCarList([newCar, ...carList]);
      }
      setIsEditing(false);
    }
    setConfirmModal({ open: false, type: null });
  };

  return (
    <div className="flex flex-col h-full relative">
      <header className="px-8 py-6 border-b border-border-dark/30 bg-background-dark z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">GESTIÓN DE AUTOS FPVO</h2>
            <p className="text-slate-400 mt-1">Administra la flota de vehículos y sus especificaciones para el simulador.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Crear Nuevo Auto</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 p-8 overflow-y-auto">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[300px] max-w-lg">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
              <input className="w-full bg-surface-dark border-none rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="Buscar por nombre, categoría..." type="text" />
            </div>
          </div>

          <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-dark-highlight/50 border-b border-border-dark text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="px-6 py-4 w-20">Imagen</th>
                  <th className="px-6 py-4">Nombre del Auto</th>
                  <th className="px-6 py-4">País</th>
                  <th className="px-6 py-4 w-32">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {carList.map((car) => (
                  <tr key={car.id} className={`group hover:bg-surface-dark-highlight/50 transition-colors ${selectedCar?.id === car.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="h-12 w-20 rounded bg-cover bg-center ring-1 ring-border-dark" style={{ backgroundImage: `url("${car.image}")` }}></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{car.name}</span>
                        <span className="text-xs text-primary font-black uppercase tracking-widest">{car.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="text-sm">{car.flag} {car.country}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${car.status === 'Activo' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(car)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ open: true, type: 'delete', carId: car.id })}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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

        {/* EDIT SIDEBAR */}
        <div className={`w-96 border-l border-border-dark bg-surface-dark flex flex-col shrink-0 shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${isEditing ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-border-dark flex items-center justify-between bg-surface-dark-highlight/20">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">{selectedCar ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h3>
              <p className="text-xs text-slate-400">{selectedCar ? selectedCar.name : 'Configurando modelo'}</p>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors" onClick={() => setIsEditing(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-background-dark/30">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">URL de la Imagen (Opcional)</label>
              <input 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="https://ejemplo.com/coche.jpg"
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Modelo</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                type="text" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2.5 text-white outline-none appearance-none"
                >
                  {metadata.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Origen</label>
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2.5 text-white outline-none appearance-none"
                >
                  {metadata.countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark border border-border-dark hover:border-primary/30 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-tighter">Homologado</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Estado de servicio</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.status === 'Activo'} 
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Activo' : 'Mantenimiento'})}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          <div className="p-6 border-t border-border-dark bg-surface-dark-highlight/30 flex gap-3">
            <button className="flex-1 px-4 py-2.5 border border-border-dark text-[#92a4c9] rounded-lg hover:bg-border-dark hover:text-white transition-all font-bold text-sm" onClick={() => setIsEditing(false)}>Cancelar</button>
            <button 
              onClick={() => setConfirmModal({ open: true, type: 'save' })}
              className="flex-1 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all font-black uppercase text-sm tracking-widest active:scale-95 shadow-primary/20"
            >
              CONFIRMAR AUTO
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.type === 'delete' ? "¿Retirar vehículo?" : "¿Actualizar garaje?"}
        message={confirmModal.type === 'delete' ? "El vehículo seleccionado será retirado del catálogo activo de FPVO." : "¿Confirmas que las especificaciones del modelo son correctas para la competición?"}
        confirmLabel={confirmModal.type === 'delete' ? "Eliminar" : "Guardar"}
        type={confirmModal.type === 'delete' ? 'danger' : 'primary'}
        onConfirm={handleAction}
        onCancel={() => setConfirmModal({ open: false, type: null })}
      />
    </div>
  );
};

export default Cars;
