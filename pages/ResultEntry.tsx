
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultEntry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-content-container flex flex-col max-w-[1024px] mx-auto flex-1 px-4 py-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between gap-6 px-6 py-6 mb-8 bg-[#1a2332] rounded-xl border border-[#232f48] shadow-sm">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Ingreso de Resultados</h1>
          <div className="flex items-center gap-2 text-[#92a4c9]">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <p className="text-sm md:text-base font-normal">Domingo, 28 de Mayo - 20:00 GMT</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Estado: Abierto</span>
          </div>
          <p className="text-xs text-[#64748b]">Cierre de formulario: 24h restantes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 px-4">
        <div className="flex border-b border-[#324467] gap-8">
          <a className="group flex items-center gap-2 border-b-[3px] border-b-transparent hover:border-b-[#324467] pb-3 pt-2 px-2 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[#92a4c9] text-[20px]">timer</span>
            <span className="text-[#92a4c9] group-hover:text-white text-sm font-bold">Práctica</span>
          </a>
          <a className="flex items-center gap-2 border-b-[3px] border-b-primary pb-3 pt-2 px-2 cursor-pointer">
            <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
            <span className="text-white text-sm font-bold">Clasificación</span>
          </a>
          <a className="group flex items-center gap-2 border-b-[3px] border-b-transparent hover:border-b-[#324467] pb-3 pt-2 px-2 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[#92a4c9] text-[20px]">sports_score</span>
            <span className="text-[#92a4c9] group-hover:text-white text-sm font-bold">Carrera</span>
          </a>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-20">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#232f48] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined">speed</span></div>
              <h2 className="text-white text-xl font-bold">Datos de Clasificación</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Mejor Tiempo de Vuelta</label>
                <div className="relative">
                  <input className="w-full bg-[#111722] border border-[#324467] rounded-lg px-4 py-3 text-white font-mono" placeholder="00:00.000" type="text" />
                  <span className="absolute right-3 top-3 text-[#64748b] text-xs">MM:SS.ms</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Posición de Salida</label>
                <select className="w-full bg-[#111722] border border-[#324467] rounded-lg px-4 py-3 text-white appearance-none">
                  <option value="1">1º (Pole Position)</option>
                  <option value="2">2º</option>
                  <option value="3">3º</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-white text-sm font-medium">Neumático usado</label>
                <div className="flex gap-3">
                  <TyreLabel color="bg-red-500" label="Soft" />
                  <TyreLabel color="bg-yellow-400" label="Medium" />
                  <TyreLabel color="bg-white" label="Hard" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#232f48] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><span className="material-symbols-outlined">warning</span></div>
                <h2 className="text-white text-xl font-bold">Reporte de Incidencias</h2>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" />
                <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <textarea className="block p-4 w-full text-sm text-white bg-[#111722] rounded-lg border border-[#324467] focus:ring-primary resize-none" placeholder="Describe el incidente..." rows={4}></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#1a2332] rounded-xl p-6 border border-[#232f48] shadow-sm h-full flex flex-col">
            <h3 className="text-white text-lg font-bold mb-4">Evidencia Obligatoria</h3>
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-[#324467] rounded-lg bg-[#111722] hover:bg-[#151d2b] transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-4xl text-[#64748b] mb-3 group-hover:text-primary">cloud_upload</span>
              <p className="mb-2 text-sm text-[#92a4c9]"><span className="font-semibold text-primary">Subir archivo</span> o arrastra</p>
              <input className="hidden" type="file" />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">send</span> Enviar Resultados
          </button>
        </div>
      </div>
    </div>
  );
};

const TyreLabel: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <label className="cursor-pointer flex items-center gap-2 p-3 rounded-lg border border-[#324467] bg-[#111722] flex-1">
    <input name="tyre" type="radio" className="text-primary bg-transparent" />
    <span className={`size-3 rounded-full ${color}`}></span>
    <span className="text-sm font-medium text-white">{label}</span>
  </label>
);

export default ResultEntry;
