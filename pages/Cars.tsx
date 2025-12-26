import React, { useState } from 'react';
import { useUserProfile, useCollection } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Cars: React.FC = () => {
  const { data: cars, loading } = useCollection('cars');
  const { data: simulatorsData } = useCollection('simulators');
  const { profile: user } = useUserProfile();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination & Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    year: '',
    simulatorId: ''
  });

  const [formData, setFormData] = useState({
    brand: '',
    model: '', // Added model as it is essential even if not listed explicitly
    simulatorId: '',
    power: '',      // Potencia
    weight: '',     // Peso
    topSpeed: '',   // Velocidad maxima
    pwr_ratio: '',  // Relación peso-potencia
    year: '',       // Año
    category: 'GT3',
    status: 'Listo',
    imageUrl: '',
    specsUrl: ''    // Url de caracteristicas
  });

  const [confirmModal, setConfirmModal] = useState<{ open: boolean, type: 'delete' | 'save' | null }>({ open: false, type: null });

  // Mock metadata for dropdowns (kept for status/legacy, but filters use dynamic data)
  const metadata = {
    categories: ['GT3', 'GT4', 'LMP2', 'LMP3', 'GTE', 'Formula'],
    statuses: ['Listo', 'En Mantenimiento', 'Dañado'],
  };

  const handleEdit = (car: any) => {
    setSelectedCar(car);
    setFormData({
      brand: car.brand || '',
      model: car.model || '',
      simulatorId: car.simulatorId || '',
      power: car.power || '',
      weight: car.weight || '',
      topSpeed: car.topSpeed || '',
      pwr_ratio: car.pwr_ratio || '',
      year: car.year || '',
      category: car.class || 'GT3',
      status: car.status || 'Listo',
      imageUrl: car.image || '',
      specsUrl: car.specsUrl || ''
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedCar(null);
    setFormData({
      brand: '',
      model: '',
      simulatorId: '',
      power: '',
      weight: '',
      topSpeed: '',
      pwr_ratio: '',
      year: new Date().getFullYear().toString(),
      category: 'GT3',
      status: 'Listo',
      imageUrl: '',
      specsUrl: ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate essential fields
      if (!formData.brand || !formData.model) {
        alert("La marca y el modelo son obligatorios");
        setIsSaving(false);
        return;
      }
      if (!formData.simulatorId) {
        alert("Selecciona un simulador");
        setIsSaving(false);
        return;
      }

      const carData = {
        brand: formData.brand,
        model: formData.model,
        simulatorId: formData.simulatorId,
        power: formData.power,
        weight: formData.weight,
        topSpeed: formData.topSpeed,
        pwr_ratio: formData.pwr_ratio,
        year: formData.year,
        class: formData.category,
        status: formData.status,
        image: formData.imageUrl,
        specsUrl: formData.specsUrl,
        updatedAt: new Date(),
        userId: user?.id || null
      };

      if (selectedCar) {
        // Update existing
        const carRef = doc(db, 'cars', selectedCar.id);
        await updateDoc(carRef, carData);
      } else {
        // Create new
        const collectionRef = collection(db, 'cars');
        await addDoc(collectionRef, {
          ...carData,
          createdAt: new Date()
        });
      }

      setIsEditing(false);
      setConfirmModal({ open: false, type: null });
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Hubo un error al guardar el vehículo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'cars', selectedCar.id));
      setIsEditing(false);
      setConfirmModal({ open: false, type: null });
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Hubo un error al eliminar el vehículo.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Filtering & Pagination Logic ---

  // 1. Extract unique values for filters from loaded cars
  const uniqueBrands = Array.from(new Set((cars || []).map((c: any) => c.brand).filter(Boolean))).sort();
  const uniqueClasses = Array.from(new Set((cars || []).map((c: any) => c.class).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set((cars || []).map((c: any) => c.year).filter(Boolean))).sort().reverse();

  // 2. Filter cars based on Search Term AND Dropdown Filters
  const filteredCars = (cars || []).filter((car: any) => {
    const matchSearch = (car.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchBrand = filters.brand ? car.brand === filters.brand : true;
    const matchClass = filters.category ? car.class === filters.category : true;
    const matchYear = filters.year ? car.year === filters.year : true;
    const matchSimulator = filters.simulatorId ? car.simulatorId === filters.simulatorId : true;

    return matchSearch && matchBrand && matchClass && matchYear && matchSimulator;
  });

  // 3. Pagination Slicing
  const totalItems = filteredCars.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, itemsPerPage]);

  const currentCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div className="p-8 text-white">Cargando autos...</div>;

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black italic tracking-tighter text-white">Garaje</h1>
          <p className="text-text-paragraph">Gestiona tu flota de competición.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleCreate}
            className="bg-button-primary hover:bg-brand-hover text-button-primary-text p-2.5 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-brand/20 ml-auto md:ml-0"
          >
            <span className="material-symbols-outlined">add</span> <span className="ml-2 font-bold hidden md:inline">Nuevo Auto</span>
          </button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-background-surface border border-border-default p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="flex-1 w-full md:w-auto relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">search</span>
          <input
            type="text"
            placeholder="Buscar por modelo o marca..."
            className="w-full bg-background-input border border-border-default text-white pl-10 pr-4 py-2.5 rounded-lg focus:border-brand focus:outline-none placeholder-text-muted transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="relative">
          <select
            value={filters.simulatorId}
            onChange={(e) => setFilters({ ...filters, simulatorId: e.target.value })}
            className="bg-[#0b0f15] border border-[#1e293b] text-[#94a3b8] text-xs font-bold uppercase rounded-lg pl-3 pr-10 py-2.5 focus:border-[#135bec] focus:outline-none appearance-none cursor-pointer hover:bg-[#1f2a3f] transition-colors min-w-[160px]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em`, backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Todos los Sim</option>
            {simulatorsData.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="bg-[#0b0f15] border border-[#1e293b] text-[#94a3b8] text-xs font-bold uppercase rounded-lg pl-3 pr-10 py-2.5 focus:border-[#135bec] focus:outline-none appearance-none cursor-pointer hover:bg-[#1f2a3f] transition-colors min-w-[160px]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em`, backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Todas las Marcas</option>
            {uniqueBrands.map((b: any) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="bg-[#0b0f15] border border-[#1e293b] text-[#94a3b8] text-xs font-bold uppercase rounded-lg pl-3 pr-10 py-2.5 focus:border-[#135bec] focus:outline-none appearance-none cursor-pointer hover:bg-[#1f2a3f] transition-colors min-w-[160px]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em`, backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Todas las Clases</option>
            {uniqueClasses.map((c: any) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="bg-[#0b0f15] border border-[#1e293b] text-[#94a3b8] text-xs font-bold uppercase rounded-lg pl-3 pr-10 py-2.5 focus:border-[#135bec] focus:outline-none appearance-none cursor-pointer hover:bg-[#1f2a3f] transition-colors min-w-[120px]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em`, backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Todos los Años</option>
            {uniqueYears.map((y: any) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {(filters.brand || filters.category || filters.year || filters.simulatorId) && (
          <button
            onClick={() => setFilters({ brand: '', category: '', year: '', simulatorId: '' })}
            className="text-[#135bec] hover:text-white text-xs font-bold px-3 py-2 transition-colors whitespace-nowrap border border-transparent hover:border-[#135bec] rounded-lg ml-auto md:ml-0"
          >
            LIMPIAR FILTROS
          </button>
        )}
      </div>

      {/* Grid of Cars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
        {currentCars.length > 0 ? (
          currentCars.map((car: any) => (
            <div key={car.id} className="group bg-background-surface rounded-xl overflow-hidden border border-border-default hover:border-brand/50 transition-all shadow-sm hover:shadow-lg hover:shadow-brand/5 relative flex flex-col">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider">{car.class}</span>
                {car.simulatorId && (
                  <span className="bg-brand/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider ml-1">
                    {simulatorsData.find((s: any) => s.id === car.simulatorId)?.name || 'Sim'}
                  </span>
                )}
              </div>

              <div className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${car.image || 'https://placehold.co/400x200?text=No+Image'}")` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-background-surface to-transparent opacity-90"></div>
              </div>

              <div className="p-5 relative -mt-12 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-text-title text-xl font-bold italic tracking-tight truncate" title={car.model}>{car.model}</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-brand text-sm font-bold uppercase">{car.brand}</p>
                  <span className="text-text-muted text-xs">•</span>
                  <p className="text-text-muted text-sm">{car.year}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-background-secondary p-2 rounded border border-border-default flex flex-col items-center">
                    <span className="text-text-muted text-[10px] uppercase font-bold">Potencia</span>
                    <span className="text-white font-bold text-sm block truncate w-full text-center" title={car.power || '-'}>{car.power || '-'} <span className="text-[10px] text-text-muted">CV</span></span>
                  </div>
                  <div className="bg-background-secondary p-2 rounded border border-border-default flex flex-col items-center">
                    <span className="text-text-muted text-[10px] uppercase font-bold">Velocidad</span>
                    <span className="text-white font-bold text-sm">{car.topSpeed || '-'} <span className="text-[10px] text-text-muted">KM/H</span></span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  {car.specsUrl && (
                    <a href={car.specsUrl} target="_blank" rel="noreferrer" className="text-xs text-center text-brand hover:underline mb-1">
                      Ver Ficha Técnica
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(car)}
                    className="w-full py-2 bg-button-secondary hover:bg-background-highlight text-text-paragraph hover:text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 group-hover:bg-brand group-hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span> Configurar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-text-muted py-20 bg-background-surface/50 rounded-xl border border-dashed border-border-highlight">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">no_crash</span>
            <p className="text-xl font-bold text-white">No se encontraron vehículos</p>
            <p className="text-sm">Prueba ajustando los filtros o tu búsqueda.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {
        totalItems > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center bg-background-surface border border-border-default p-4 rounded-xl gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-text-paragraph">
              <span className="text-text-muted">Filas por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-background-input border border-border-default rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-brand cursor-pointer text-xs font-bold"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span className="text-text-muted border-l border-border-highlight pl-3 ml-1">
                Mostrando <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de <span className="text-white font-bold">{totalItems}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-background-highlight disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                .map((p, i, arr) => {
                  // Add ellipsis if gap
                  const prev = arr[i - 1];
                  return (
                    <React.Fragment key={p}>
                      {prev && p > prev + 1 && <span className="text-text-muted px-1">...</span>}
                      <button
                        onClick={() => goToPage(p)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${currentPage === p
                          ? 'bg-brand text-white shadow-lg shadow-brand/20 scale-105'
                          : 'text-text-paragraph hover:bg-background-highlight hover:text-white'
                          }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-background-highlight disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        )
      }

      {/* EDIT/CREATE MODAL */}
      {
        isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#192233] border border-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in-up">
              <div className="p-6 border-b border-[#1e293b] flex justify-between items-center bg-[#0d1219] sticky top-0 z-10">
                <h3 className="text-white text-xl font-black italic">{selectedCar ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h3>
                <button onClick={() => setIsEditing(false)} className="text-[#64748b] hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* BLOQUE 1: Información General */}
                <div>
                  <h4 className="text-[#135bec] text-xs font-black uppercase tracking-widest mb-4 border-b border-[#1e293b] pb-2">Información Principal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Marca</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="Ej. Ferrari"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Modelo</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="Ej. 296 GT3"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Simulador</label>
                      <div className="relative">
                        <select
                          value={formData.simulatorId}
                          onChange={(e) => setFormData({ ...formData, simulatorId: e.target.value })}
                          className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg pl-4 pr-10 py-3 focus:border-[#135bec] focus:outline-none appearance-none"
                        >
                          <option value="">Selecciona un Simulador</option>
                          {simulatorsData.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Año</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Clase</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="Ej. GT3, LMP2..."
                      />
                    </div>
                  </div>
                </div>

                {/* BLOQUE 2: Ficha Técnica */}
                <div>
                  <h4 className="text-[#135bec] text-xs font-black uppercase tracking-widest mb-4 border-b border-[#1e293b] pb-2">Especificaciones Técnicas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Potencia (CV)</label>
                      <input
                        type="text"
                        value={formData.power}
                        onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="Ej. 600 HP @ 8000 RPM"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Peso (KG)</label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="1250"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Vel. Max (KM/H)</label>
                      <input
                        type="text"
                        value={formData.topSpeed}
                        onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="300"
                      />
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Peso/Potencia</label>
                      <input
                        type="text"
                        value={formData.pwr_ratio}
                        onChange={(e) => setFormData({ ...formData, pwr_ratio: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="2.1"
                      />
                    </div>
                  </div>
                </div>

                {/* BLOQUE 3: Multimedia y Enlaces */}
                <div>
                  <h4 className="text-[#135bec] text-xs font-black uppercase tracking-widest mb-4 border-b border-[#1e293b] pb-2">Multimedia</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Imagen URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="flex-1 bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                          placeholder="https://..."
                        />
                        {formData.imageUrl && (
                          <div className="h-12 w-20 bg-cover bg-center rounded border border-[#1e293b]" style={{ backgroundImage: `url('${formData.imageUrl}')` }}></div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94a3b8] text-xs font-bold uppercase tracking-wider mb-2">Ficha Técnica URL (PDF/Web)</label>
                      <input
                        type="text"
                        value={formData.specsUrl}
                        onChange={(e) => setFormData({ ...formData, specsUrl: e.target.value })}
                        className="w-full bg-[#0b0f15] border border-[#1e293b] text-white rounded-lg px-4 py-3 focus:border-[#135bec] focus:outline-none placeholder-[#64748b]"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-[#1e293b] bg-[#0d1219] flex justify-between sticky bottom-0 z-10">
                {selectedCar ? (
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
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.type === 'delete' ? '¿Eliminar Vehículo?' : '¿Guardar Cambios?'}
        message={confirmModal.type === 'delete' ? 'Esta acción no se puede deshacer.' : 'Se actualizará la información del vehículo en tu garaje.'}
        confirmLabel={confirmModal.type === 'delete' ? 'Eliminar' : 'Guardar'}
        type={confirmModal.type === 'delete' ? 'danger' : 'info'}
        onConfirm={confirmModal.type === 'delete' ? handleDelete : handleSave}
        onCancel={() => setConfirmModal({ open: false, type: null })}
      />
    </div >
  );
};

export default Cars;
