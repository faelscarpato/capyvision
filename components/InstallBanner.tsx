
import React, { useState, useEffect } from 'react';

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Pequeno delay para não aparecer imediatamente no load
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Se o app já estiver rodando como standalone, não mostramos nada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsVisible(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
      // Mostramos novamente após um tempo se recusado? Melhor não incomodar.
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-24 md:right-8 z-[150] animate-fade-in-down">
      <div className="max-w-4xl mx-auto bg-zinc-900/80 backdrop-blur-2xl border border-amber-400/30 rounded-2xl p-4 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-black flex-shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,1,1-48-48A48,48,0,0,1,176,88Z"></path></svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm md:text-base">Instalar CapyVision Elite</h3>
            <p className="text-zinc-400 text-xs md:text-sm">Tenha uma experiência nativa, sem barras de navegação e com acesso direto pela tela inicial.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDismiss}
            className="flex-1 md:flex-none px-5 py-2.5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Agora não
          </button>
          <button 
            onClick={handleInstall}
            className="flex-1 md:flex-none px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Instalar App
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
