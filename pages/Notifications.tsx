
import React from 'react';
import { Link } from 'react-router-dom';
import data from '@/data';

const Notifications: React.FC = () => {
  const { notifications } = data;

  return (
    <div className="flex flex-col max-w-[1024px] mx-auto w-full px-4 md:px-8 py-8 gap-6">
      <div className="flex flex-wrap justify-between items-end gap-4 pb-2 border-b border-[#324467]">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Notificaciones</h1>
          <p className="text-[#92a4c9] text-base font-normal">Gestiona tus alertas de carrera, invitaciones y mensajes.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#232f48] hover:bg-[#2d3b55] text-white text-sm font-bold transition-colors">
          <span className="material-symbols-outlined text-[20px]">done_all</span>
          <span className="whitespace-nowrap">Marcar todas como leídas</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 py-2">
          <h2 className="text-white text-sm font-bold uppercase tracking-wider">Hoy</h2>
          <div className="h-[1px] flex-1 bg-[#324467]/50"></div>
        </div>

        {notifications.map(notif => (
          <NotificationCard 
            key={notif.id}
            icon={notif.icon} 
            color={notif.color}
            title={notif.title}
            desc={notif.desc}
            time={notif.time}
            actions={notif.actions}
            isRead={notif.isRead}
            to={notif.actions ? "/invitation/1" : undefined}
          />
        ))}
      </div>
    </div>
  );
};

const NotificationCard: React.FC<any> = ({ icon, color, title, desc, time, actions, isRead = false, to }) => (
  <div className={`group relative flex flex-col md:flex-row gap-4 p-5 rounded-xl border transition-all ${isRead ? 'bg-[#161e2d]/50 border-transparent' : 'border-primary/40 bg-[#161e2d] shadow-lg'}`}>
    {!isRead && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></div>}
    <div className="flex flex-col items-center gap-2 md:w-16 shrink-0">
      <div className={`flex items-center justify-center h-12 w-12 rounded-full ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-xs text-[#92a4c9] font-medium">{time}</span>
    </div>
    <div className="flex flex-1 flex-col gap-2">
      <h3 className="text-white text-lg font-bold">{title}</h3>
      <p className="text-[#92a4c9] text-sm md:text-base leading-relaxed">{desc}</p>
      {actions && to && (
        <div className="flex gap-3 mt-2">
          <Link to={to} className="h-10 px-6 flex items-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors">Aceptar</Link>
          <button className="h-10 px-6 rounded-lg border border-[#324467] hover:bg-[#232f48] text-[#92a4c9] hover:text-white text-sm font-bold transition-colors">Rechazar</button>
        </div>
      )}
    </div>
  </div>
);

export default Notifications;
