
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import data from '@/data';

const InvitationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Try to find the specific event, fallback to first invitation or first event
  const invitation = data.events.find(e => e.id === id) || data.events.find(e => e.isInvite) || data.events[0];

  return (
    <main className="flex-1 flex justify-center py-10 px-4 md:px-10 lg:px-40 relative">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 z-10 gap-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#92a4c9] text-sm font-medium mb-2 hover:text-primary">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver a Invitaciones</span>
        </button>

        <div className="flex flex-col md:flex-row rounded-xl shadow-lg bg-[#192233] border border-[#324467] overflow-hidden">
          <div className="w-full md:w-2/5 relative min-h-[240px]">
            <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url("${invitation.image}")` }}></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-yellow-500 animate-pulse"></span> {invitation.status}
              </span>
            </div>
          </div>
          <div className="flex w-full grow flex-col justify-between p-6 gap-6">
            <div>
              <p className="text-[#92a4c9] text-sm font-bold tracking-wide uppercase mb-1">{invitation.category}</p>
              <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight mb-2">{invitation.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2 bg-[#232f48] px-3 py-1.5 rounded-lg border border-[#324467]">
                  <span className="material-symbols-outlined text-primary text-[20px]">sports_esports</span>
                  <span className="text-sm font-semibold text-white">Assetto Corsa Comp.</span>
                </div>
                <p className="text-[#92a4c9] text-sm font-medium">Invita: <span className="text-white font-bold">Liga Pro Racing</span></p>
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-[#324467] mt-auto">
              <button className="flex-1 flex items-center justify-center h-12 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all shadow-[0_0_15px_rgba(19,91,236,0.3)]">
                <span className="material-symbols-outlined">check_circle</span> Aceptar
              </button>
              <button className="flex-1 flex items-center justify-center h-12 gap-2 rounded-xl border-2 border-red-500/20 text-red-400 font-bold text-base hover:bg-red-500/10 transition-all">
                <span className="material-symbols-outlined">cancel</span> Rechazar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#192233] rounded-xl border border-[#324467] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#324467] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                <h2 className="text-white text-lg font-bold">Detalles del Evento</h2>
              </div>
              <div className="p-0">
                <DetailRow icon="calendar_month" label="Fecha" val={invitation.date} />
                <DetailRow icon="dns" label="Servidor" val="FPVO Official Server #1" status="online" />
                <DetailRow icon="map" label="Circuito" val={invitation.track} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-[#192233] rounded-xl border border-[#324467] p-5">
              <h3 className="text-white text-sm font-bold uppercase mb-4">Requisitos</h3>
              <ul className="flex flex-col gap-3">
                <ReqItem label="Licencia SA > 70" checked={true} sub={`Actual: ${data.user.stats.safetyRating}`} />
                <ReqItem label="3 Medallas Pista" checked={true} />
                <ReqItem label="Inscripción Gratuita" checked={false} isInfo={true} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const DetailRow: React.FC<any> = ({ icon, label, val, status }) => (
  <div className="grid grid-cols-[40%_1fr] gap-x-4 px-6 py-4 border-b border-[#324467] last:border-0 hover:bg-[#232f48]/50 transition-colors">
    <div className="flex items-center gap-2 text-[#92a4c9] text-sm font-medium">
      <span className="material-symbols-outlined text-[18px]">{icon}</span> {label}
    </div>
    <div className="text-white text-sm font-semibold flex items-center gap-2">
      {status === 'online' && <span className="size-2 rounded-full bg-green-500"></span>}
      {val}
    </div>
  </div>
);

const ReqItem: React.FC<any> = ({ label, checked, sub, isInfo }) => (
  <li className="flex items-start gap-3">
    <span className={`material-symbols-outlined text-[20px] mt-0.5 ${checked ? 'text-green-500' : isInfo ? 'text-primary' : 'text-[#637588]'}`}>
      {checked ? 'check_circle' : isInfo ? 'paid' : 'error'}
    </span>
    <div className="flex flex-col">
      <span className="text-white text-sm font-medium">{label}</span>
      {sub && <span className="text-[#92a4c9] text-xs">{sub}</span>}
    </div>
  </li>
);

export default InvitationDetail;
