
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompetitionCreate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-background-dark min-h-screen">
      <div className="w-full max-w-[960px] flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-white text-base font-medium leading-normal">Paso 1 de 4</p>
            <span className="text-[#92a4c9] text-xs font-semibold uppercase tracking-wider">Tipo de Competencia</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#324467]">
            <div className="h-2 rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '25%' }}></div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Crear Nueva Competencia</h1>
          <p className="text-[#92a4c9] text-base font-normal leading-normal">Selecciona el tipo de evento que deseas organizar para comenzar.</p>
        </div>

        <form className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="cursor-pointer group relative">
              <input className="peer sr-only" name="competition_type" type="radio" value="single" />
              <div className="h-full flex flex-col items-start gap-5 p-8 rounded-xl border-2 border-[#324467] bg-[#192233] transition-all hover:border-primary/50 hover:shadow-lg peer-checked:border-primary peer-checked:bg-[#1b253b] peer-checked:ring-1 peer-checked:ring-primary">
                <div className="shrink-0 size-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 transition-colors group-hover:bg-purple-500/20">
                  <span className="material-symbols-outlined text-4xl">flag</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-xl md:text-2xl">Carrera Individual</h3>
                  <p className="text-[#92a4c9] text-base leading-relaxed">Organiza un evento único, una carrera rápida o una sesión de práctica sin tabla de puntos acumulada.</p>
                </div>
                <div className="mt-auto w-full pt-4 flex items-center text-primary font-bold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 peer-checked:opacity-100 peer-checked:translate-x-0">
                  <span>Seleccionar</span>
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </div>
                <div className="absolute top-6 right-6 text-primary opacity-0 transform scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
              </div>
            </label>

            <label className="cursor-pointer group relative">
              <input className="peer sr-only" name="competition_type" type="radio" value="tournament" defaultChecked />
              <div className="h-full flex flex-col items-start gap-5 p-8 rounded-xl border-2 border-[#324467] bg-[#192233] transition-all hover:border-primary/50 hover:shadow-lg peer-checked:border-primary peer-checked:bg-[#1b253b] peer-checked:ring-1 peer-checked:ring-primary">
                <div className="shrink-0 size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/20">
                  <span className="material-symbols-outlined text-4xl">emoji_events</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-xl md:text-2xl">Torneo</h3>
                  <p className="text-[#92a4c9] text-base leading-relaxed">Crea una liga completa con múltiples carreras, gestión de pilotos, sistema de puntos y clasificación de temporada.</p>
                </div>
                <div className="mt-auto w-full pt-4 flex items-center text-primary font-bold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 peer-checked:opacity-100 peer-checked:translate-x-0">
                  <span>Seleccionar</span>
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </div>
                <div className="absolute top-6 right-6 text-primary opacity-0 transform scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
              </div>
            </label>
          </div>

          <div className="sticky bottom-0 bg-background-dark/95 backdrop-blur-md border-t border-[#232f48] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 mt-4 flex items-center justify-between z-40">
            <button 
              className="text-[#92a4c9] font-bold text-base px-6 py-3 rounded-lg hover:text-white hover:bg-[#1e2a40] transition-colors" 
              type="button"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button 
              className="bg-primary hover:bg-blue-600 text-white font-bold text-base px-8 py-3 rounded-lg shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95" 
              type="button"
              onClick={() => navigate('/competition-setup')}
            >
              Siguiente
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CompetitionCreate;
