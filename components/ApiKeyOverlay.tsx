
import React, { useState } from 'react';

interface ApiKeyOverlayProps {
  onKeySelected: (key?: string) => void;
}

const ApiKeyOverlay: React.FC<ApiKeyOverlayProps> = ({ onKeySelected }) => {
  const [manualKey, setManualKey] = useState('');

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio?.openSelectKey();
      onKeySelected();
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleManualSave = () => {
    if (manualKey.trim().length > 10) {
      onKeySelected(manualKey.trim());
    } else {
      alert("Por favor insira uma chave API válida");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500"></div>
        
        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-inner rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-80a16,16,0,1,1,16,16A16,16,0,0,1,112,136Z"></path><path d="M176,80H80a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V96h80v16a8,8,0,0,0,16,0V88A8,8,0,0,0,176,80Z" opacity="0.2"></path><path d="M168,168a40,40,0,0,1-80,0,8,8,0,0,1,16,0,24,24,0,0,0,48,0,8,8,0,0,1,16,0Z"></path></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Controle de Acesso</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Conecte sua chave API do Google AI Studio para liberar o motor criativo.
        </p>
        
        <div className="space-y-4 text-left">
            <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Entrada Manual (Modo Básico)</label>
                <div className="flex gap-2 mt-1">
                    <input 
                        type="password" 
                        value={manualKey}
                        onChange={(e) => setManualKey(e.target.value)}
                        placeholder="Cole sua API Key aqui..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:outline-none transition-colors text-sm"
                    />
                    <button 
                        onClick={handleManualSave}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                    >
                        Salvar
                    </button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-2 ml-1">
                    Obtenha uma chave gratuita em <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-amber-400 hover:underline">Google AI Studio</a>.
                </p>
            </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-600 text-xs font-bold uppercase">OU</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button 
            onClick={handleSelectKey}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M208,80H171.64A84,84,0,1,0,80,171.64V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V176h16a16,16,0,0,0,16-16V144h32a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM128,144a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z"></path></svg>
            Conectar via Project IDX / GCP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyOverlay;
