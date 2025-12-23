
import React, { useState, useEffect } from 'react';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt) return null;

  return (
    <button 
      onClick={handleInstall}
      className="group relative p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 text-amber-400 hover:bg-amber-400/10"
      title="Instalar App"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M216,144v56a16,16,0,0,1-16,16H56a16,16,0,0,1-16X56a16,16,0,0,1,16V144a8,8,0,0,1,16,0v56H200V144a8,8,0,0,1,16,0Zm-93.66-90.34a8,8,0,0,1,11.32,0l40,40a8,8,0,0,1-11.32,11.32L136,75.31V152a8,8,0,0,1-16,0V75.31l-26.34,26.35a8,8,0,0,1-11.32-11.32Z"></path>
      </svg>
      <span className="text-[10px] font-bold uppercase md:hidden">Instalar</span>
      <span className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-800 shadow-xl">
        Instalar CapyVision
      </span>
    </button>
  );
};

export default InstallButton;
