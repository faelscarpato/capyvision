
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
    error: 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
  };

  return (
    <div className={`fixed top-6 right-6 z-[110] px-6 py-4 rounded-xl border backdrop-blur-xl flex items-center gap-3 animate-fade-in-down transition-all ${styles[type]}`}>
      {type === 'success' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
      )}
      {type === 'error' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
      )}
      {type === 'info' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-sm">{type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Info'}</span>
        <span className="text-sm opacity-90">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
