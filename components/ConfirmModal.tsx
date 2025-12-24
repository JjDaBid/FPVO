
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, title, message, onConfirm, onCancel, 
  confirmLabel = "Confirmar", cancelLabel = "Cancelar", type = 'primary' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#192233] border border-[#232f48] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
              <span className="material-symbols-outlined text-3xl">
                {type === 'danger' ? 'warning' : 'info'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
          </div>
          <p className="text-[#92a4c9] text-base leading-relaxed">
            {message}
          </p>
        </div>
        <div className="bg-[#111722]/50 p-4 flex gap-3 justify-end border-t border-[#232f48]">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#92a4c9] hover:text-white hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-lg ${
              type === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' : 'bg-primary hover:bg-primary-hover shadow-primary/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
