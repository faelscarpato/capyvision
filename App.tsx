
import React, { useState, useEffect, useCallback } from 'react';
import { 
  GenerationType, 
  MediaItem, 
  GenerationConfig, 
} from './types';
import { GeminiService } from './services/geminiService';
import Sidebar from './components/Sidebar';
import MediaComposer from './components/MediaComposer';
import MediaGrid from './components/MediaGrid';
import ApiKeyOverlay from './components/ApiKeyOverlay';
import Onboarding from './components/Onboarding';
import InstallBanner from './components/InstallBanner';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GenerationType>(GenerationType.IMAGE);
  const [gallery, setGallery] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('capy_gallery');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar galeria:", e);
      return [];
    }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeyPicker, setShowKeyPicker] = useState(false);
  const [isApiKeyActive, setIsApiKeyActive] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('user_api_key');
  });

  const [customApiKey, setCustomApiKey] = useState<string | null>(() => {
    return localStorage.getItem('user_api_key');
  });
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    const syncStorage = () => {
      try {
        localStorage.setItem('capy_gallery', JSON.stringify(gallery));
      } catch (e) {
        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          if (gallery.length > 1) {
            setGallery(prev => prev.slice(0, prev.length - 2));
          }
        }
      }
    };
    if (gallery.length > 0) syncStorage();
  }, [gallery]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const getEffectiveKey = () => customApiKey;

  const checkApiKeyStatus = useCallback(async () => {
    if (customApiKey) {
      setIsApiKeyActive(true);
      return true;
    }
    try {
      // @ts-ignore
      const hasSelected = await window.aistudio?.hasSelectedApiKey();
      if (hasSelected) {
        setIsApiKeyActive(true);
        return true;
      }
    } catch (e) {}
    setIsApiKeyActive(false);
    return false;
  }, [customApiKey]);

  useEffect(() => {
    checkApiKeyStatus();
  }, [checkApiKeyStatus]);

  const handleKeySelected = async (manualKey?: string) => {
    if (manualKey) {
      setCustomApiKey(manualKey);
      localStorage.setItem('user_api_key', manualKey);
    }
    setShowKeyPicker(false);
    setShowOnboarding(false);
    setIsApiKeyActive(true);
    showToast("CapyVision Elite Ativado!", "success");
    setTimeout(checkApiKeyStatus, 500);
  };

  const handleDisconnect = () => {
    if (confirm("Desconectar sua Chave API?")) {
        setCustomApiKey(null);
        localStorage.removeItem('user_api_key');
        setIsApiKeyActive(false);
        showToast("Chave API desconectada", "info");
    }
  };

  const handleGenerate = async (prompt: string, file: File | null, config: GenerationConfig, maskBase64?: string | null) => {
    const active = await checkApiKeyStatus();
    const keyToUse = getEffectiveKey();
    
    if (!active && !keyToUse) {
      setShowKeyPicker(true);
      showToast("Por favor, insira sua chave API para continuar", "info");
      return;
    }

    setIsGenerating(true);
    const gemini = new GeminiService(keyToUse || ''); 

    try {
      let resultUrl = '';
      let type: 'image' | 'video' | 'text' = 'image';

      if (activeTab === GenerationType.IMAGE) {
        resultUrl = await gemini.generateImage(prompt, config);
        type = 'image';
      } else if (activeTab === GenerationType.VIDEO) {
        let base64 = '';
        let mime = '';
        if (file) {
          base64 = await fileToBase64(file);
          mime = file.type;
        }
        resultUrl = await gemini.generateVideo(prompt, base64, mime, config.aspectRatio);
        type = 'video';
      } else if (activeTab === GenerationType.EDIT) {
        if (!file) throw new Error("Por favor, envie uma imagem para editar.");
        const base64 = await fileToBase64(file);
        resultUrl = await gemini.editImage(prompt, base64, file.type, maskBase64);
        type = 'image';
      } else if (activeTab === GenerationType.ANALYZE) {
        if (!file) throw new Error("Por favor, envie uma imagem para analisar.");
        const base64 = await fileToBase64(file);
        const analysis = await gemini.analyzeImage(prompt, base64, file.type);
        resultUrl = analysis;
        type = 'text';
      }

      const newItem: MediaItem = {
        id: Math.random().toString(36).substring(7),
        type,
        url: resultUrl,
        prompt: prompt || (activeTab === GenerationType.ANALYZE ? "Análise de Imagem" : "Sem título"),
        timestamp: Date.now(),
        metadata: { config, activeTab }
      };

      setGallery(prev => [newItem, ...prev]);
      showToast("Criação finalizada!", "success");
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Ocorreu um erro inesperado", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {showOnboarding && <Onboarding onComplete={handleKeySelected} />}
      
      {!showOnboarding && <InstallBanner />}
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isApiKeyActive={isApiKeyActive}
        onConnectKey={() => {
            if(customApiKey) handleDisconnect();
            else setShowKeyPicker(true);
        }} 
      />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8 pb-28 md:px-12 md:py-12 md:ml-20 md:pb-12">
        <header className="w-full max-w-5xl mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left animate-reveal">
            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-white tracking-tight">
              CapyVision <span className="text-amber-400">Elite</span>
            </h1>
            <p className="mt-2 text-zinc-400 text-base md:text-xl font-medium">
              Síntese Visual Profissional & Inteligência
            </p>
          </div>
          
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border backdrop-blur-md transition-all ${
            isApiKeyActive 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isApiKeyActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
              {isApiKeyActive ? 'Sistema Ativado' : 'Aguardando Chave API'}
            </span>
          </div>
        </header>

        <MediaComposer 
          activeTab={activeTab}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <div className="w-full max-w-6xl mt-16">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256" className="text-amber-400"><path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V136a8,8,0,0,1,16,0v52.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm115.31,16.66l-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L184,180.05l.31,44a8,8,0,0,0,16,0L200,180.05l18.34,18.35a8,8,0,0,0,11.32-11.4Zm-91-88.34a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32L156,73.37V20.31a8,8,0,0,0-16,0l-.31,53.06L121.34,55.03a8,8,0,0,0-11.32,11.32ZM208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"></path></svg>
              Arquivos Gerados
            </h2>
            <button 
              onClick={() => { if(confirm('Limpar todo o histórico?')) setGallery([]); }}
              className="text-zinc-500 hover:text-red-400 transition-colors text-sm font-medium"
            >
              Limpar Tudo
            </button>
          </div>
          <MediaGrid items={gallery} />
        </div>
      </main>

      {showKeyPicker && !showOnboarding && (
        <ApiKeyOverlay onKeySelected={handleKeySelected} />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
