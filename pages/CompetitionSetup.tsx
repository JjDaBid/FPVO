
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '@/data';
import ConfirmModal from '@/components/ConfirmModal';

const CompetitionSetup: React.FC = () => {
  const navigate = useNavigate();
  const { metadata } = data;
  
  const [slots, setSlots] = useState(24);
  const [preset, setPreset] = useState('F1 Moderno');
  const [scoring, setScoring] = useState<number[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const f1Scoring = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  useEffect(() => {
    const newScoring = Array(slots).fill(0);
    if (preset === 'F1 Moderno') {
      f1Scoring.forEach((val, i) => {
        if (i < slots) newScoring[i] = val;
      });
    } else {
      scoring.forEach((val, i) => {
        if (i < slots) newScoring[i] = val;
      });
    }
    setScoring(newScoring);
  }, [slots, preset]);

  const handleScoreChange = (index: number, value: string) => {
    if (preset !== 'Custom') return;
    const newScoring = [...scoring];
    newScoring[index] = parseInt(value) || 0;
    setScoring(newScoring);
  };

  const handlePublish = () => {
    console.log("Competition published!");
    setIsPublishModalOpen(false);
    navigate('/my-events');
  };

  return (
    <main className="flex-1 w-full max-w-[1024px] mx-auto px-4 py-8 md:px-8 bg-background-dark min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-[#232f48] pb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-lg">settings_suggest</span>
            Motor de Competición FPVO
          </div>
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight uppercase">CONFIGURAR TORNEO</h1>
          <p className="text-[#92a4c9] text-base">Define las reglas, parrilla y sistema de puntos para tu evento oficial.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-[#192233] border border-[#232f48] hover:bg-[#232f48] transition-colors text-white text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Borrador
          </button>
          <button 
            type="button"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/20"
            onClick={() => setIsPublishModalOpen(true)}
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Publicar
          </button>
        </div>
      </div>

      <form className="space-y-12 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">01</div>
            <h2 className="text-white text-xl font-black uppercase tracking-wider">Identidad del Evento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">Nombre de Competición</span>
              <input className="w-full rounded-lg bg-[#192233] border border-[#232f48] text-white h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ej: FPVO Winter Cup 2024" type="text" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">Formato</span>
              <select className="w-full rounded-lg bg-[#192233] border border-[#232f48] text-white h-12 px-4 outline-none focus:ring-2 focus:ring-primary appearance-none">
                <option>Campeonato de Puntos</option>
                <option>Multi-Clase (GT3 + GT4)</option>
                <option>Copa de Eliminación</option>
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">URL de la Imagen del Evento (Opcional)</label>
            <input className="w-full rounded-lg bg-[#192233] border border-[#232f48] text-white h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="https://ejemplo.com/banner-torneo.jpg" type="url" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">Plataforma Simulador</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {metadata.simulators.map((sim, i) => (
                <label key={sim.name} className="cursor-pointer group relative">
                  <input defaultChecked={i === 0} className="peer sr-only" name="sim" type="radio" />
                  <div className="relative overflow-hidden rounded-xl border-2 border-[#232f48] bg-[#192233] transition-all peer-checked:border-primary peer-checked:shadow-[0_0_15px_rgba(19,91,236,0.3)]">
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={sim.url} alt={sim.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-30 peer-checked:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity peer-checked:opacity-100"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{sim.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-[#232f48]" />

        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">02</div>
              <h2 className="text-white text-xl font-black uppercase tracking-wider">GESTIÓN DE PARRILLA</h2>
            </div>
            <div className="flex items-center gap-3 bg-[#111722] px-2 py-1.5 rounded-lg border border-primary/30">
              <button type="button" onClick={() => setSlots(Math.max(1, slots - 1))} className="w-8 h-8 flex items-center justify-center rounded bg-[#192233] text-white hover:bg-primary transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
              <div className="w-10 text-center text-white font-black text-lg">{slots}</div>
              <button type="button" onClick={() => setSlots(Math.min(100, slots + 1))} className="w-8 h-8 flex items-center justify-center rounded bg-[#192233] text-white hover:bg-primary transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
            </div>
          </div>
          <div className="bg-[#192233] border border-[#232f48] rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">Sugerencias de Red</span>
                <div className="flex flex-col gap-2">
                  <PilotInviteCard name="DriftKing" status="En línea" online={true} />
                  <PilotInviteCard name="SimRacerX" status="Desconectado" online={false} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Parrilla Confirmada (2/{slots})</span>
                <div className="bg-[#111722] border border-[#232f48] rounded-lg p-4 min-h-[180px] flex flex-wrap gap-2 content-start">
                  <ConfirmedChip name="AlexR_99" />
                  <ConfirmedChip name="TurboS" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[#232f48]" />

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">03</div>
            <h2 className="text-white text-xl font-black uppercase tracking-wider">REGLAMENTO Y PUNTUACIÓN</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-[#92a4c9] text-xs font-bold uppercase tracking-widest">Preset de Puntos</span>
                <select 
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full rounded-lg bg-[#192233] border border-[#232f48] text-white h-12 px-4 outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="F1 Moderno">F1 Oficial (25-1)</option>
                  <option value="Custom">Configuración Manual</option>
                </select>
              </label>
              <ScoringInput label="Vuelta Rápida" val={1} />
              <ScoringInput label="Pole Position" val={3} />
            </div>
            <div className="md:col-span-2 bg-[#192233] border border-[#232f48] rounded-xl overflow-hidden flex flex-col">
               <div className="p-4 border-b border-[#232f48] bg-[#1c2636] flex justify-between items-center">
                 <span className="text-xs font-black text-white uppercase tracking-widest">Tabla de Distribución ({slots} Puestos)</span>
                 {preset === 'Custom' && <span className="text-[10px] text-primary animate-pulse font-black">EDICIÓN EN VIVO</span>}
               </div>
               <div className="max-h-[350px] overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 text-center">
                  {scoring.map((p, i) => (
                    <div key={i} className={`flex flex-col gap-1 bg-[#111722] p-2 rounded-lg border transition-all ${preset === 'Custom' ? 'border-primary/50 bg-primary/5' : 'border-[#232f48]/50'}`}>
                      <span className="text-[9px] text-[#92a4c9] font-bold uppercase">{i+1}º</span>
                      {preset === 'Custom' ? (
                        <input 
                          type="number"
                          value={p}
                          onChange={(e) => handleScoreChange(i, e.target.value)}
                          className="w-full bg-transparent border-none text-center text-primary font-black text-xl focus:ring-0 p-0"
                        />
                      ) : (
                        <span className={`text-lg font-black ${p > 0 ? 'text-white' : 'text-[#232f48]'}`}>{p}</span>
                      )}
                    </div>
                  ))}
                </div>
               </div>
            </div>
          </div>
        </section>
      </form>

      <ConfirmModal 
        isOpen={isPublishModalOpen}
        title="¿Publicar Torneo?"
        message="¿Confirmas que toda la configuración, reglamentos y sistema de puntos son correctos? El torneo será visible para los pilotos invitados y el público."
        confirmLabel="Publicar Ahora"
        onConfirm={handlePublish}
        onCancel={() => setIsPublishModalOpen(false)}
      />
    </main>
  );
};

const PilotInviteCard: React.FC<{ name: string, status: string, online: boolean }> = ({ name, status, online }) => (
  <div className="flex items-center justify-between p-3 bg-[#111722] border border-[#232f48] rounded-lg hover:border-primary/50 transition-all">
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="size-10 rounded-full bg-cover ring-1 ring-[#232f48]" style={{ backgroundImage: `url("https://picsum.photos/40/40?random=${name}")` }}></div>
        {online && <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-[#111722] rounded-full"></div>}
      </div>
      <div className="flex flex-col">
        <span className="text-white text-sm font-bold">{name}</span>
        <span className={`${online ? 'text-emerald-500' : 'text-[#92a4c9]'} text-xs font-medium`}>{status}</span>
      </div>
    </div>
    <button className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all">Invitar</button>
  </div>
);

const ConfirmedChip: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center gap-2 bg-[#192233] border border-primary/30 rounded-full pl-1 pr-3 py-1 hover:border-red-500/50 group h-fit">
    <div className="size-8 rounded-full bg-center bg-cover" style={{ backgroundImage: `url("https://picsum.photos/32/32?random=${name}")` }}></div>
    <span className="text-white text-xs font-bold">{name}</span>
    <button className="text-[#92a4c9] group-hover:text-red-400 ml-1 transition-colors leading-none"><span className="material-symbols-outlined text-[16px]">close</span></button>
  </div>
);

const ScoringInput: React.FC<{ label: string, val: number }> = ({ label, val }) => (
  <div className="flex items-center justify-between p-4 bg-[#192233] border border-[#232f48] rounded-xl">
    <span className="text-xs font-bold text-[#92a4c9] uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      <input className="w-16 bg-[#111722] border border-[#232f48] rounded-lg text-center text-white h-9 text-sm font-black focus:border-primary focus:ring-0" type="number" defaultValue={val} />
      <span className="text-[10px] text-primary font-black uppercase tracking-tighter">pts</span>
    </div>
  </div>
);

export default CompetitionSetup;
