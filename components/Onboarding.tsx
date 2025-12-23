
import React, { useState, useEffect } from 'react';

interface OnboardingProps {
  onComplete: (key?: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'splash' | 'welcome' | 'tutorial' | 'apikey'>('splash');
  const [manualKey, setManualKey] = useState('');

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('welcome'), 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-[200] neural-bg flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400 blur-[100px] opacity-20 animate-pulse"></div>
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center text-black animate-bounce shadow-[0_0_50px_rgba(251,191,36,0.5)]">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,1,1-48-48A48,48,0,0,1,176,88Z"></path></svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-white tracking-tighter animate-reveal overflow-hidden whitespace-nowrap">
              CapyVision <span className="text-amber-400">Elite</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs opacity-0 animate-fade-in [animation-delay:1.5s] [animation-fill-mode:forwards]">
              Iniciando Motores de Síntese...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[190] bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-zinc-900 border-4 border-amber-400 rounded-full flex items-center justify-center animate-float shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#FBBF24" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm-12,24a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V160A8,8,0,0,0,128,152Zm0-88a8,8,0,0,0-8,8V96a8,8,0,0,0,16,0V72A8,8,0,0,0,128,64Z"></path></svg>
        </div>

        {step === 'welcome' && (
          <div className="text-center space-y-6 pt-6">
            <h2 className="text-3xl font-bold text-white">Bem-vindo ao Elite</h2>
            <p className="text-zinc-400 leading-relaxed">
              Você acaba de entrar na suíte criativa mais avançada movida pela inteligência do Gemini 3. Imagens 4K, vídeos cinemáticos e análises profundas esperam por você.
            </p>
            <button 
              onClick={() => setStep('tutorial')}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-2xl transition-all hover:scale-105"
            >
              VAMOS COMEÇAR
            </button>
          </div>
        )}

        {step === 'tutorial' && (
          <div className="space-y-6 pt-6">
            <h2 className="text-3xl font-bold text-white text-center">O Que Você Pode Fazer?</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { t: "Criação 4K", d: "Gere imagens com detalhes ultrarrealistas usando o modo Pro.", i: "🎨" },
                { t: "Vídeo Veo", d: "Transforme prompts em movimentos cinematográficos fluidos.", i: "🎬" },
                { t: "Inpainting", d: "Edite partes específicas de qualquer imagem com precisão.", i: "🖌️" }
              ].map(item => (
                <div key={item.t} className="flex gap-4 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                  <span className="text-2xl">{item.i}</span>
                  <div>
                    <h4 className="font-bold text-white">{item.t}</h4>
                    <p className="text-sm text-zinc-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setStep('apikey')}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-2xl transition-all"
            >
              PRÓXIMO: CONFIGURAÇÃO
            </button>
          </div>
        )}

        {step === 'apikey' && (
          <div className="space-y-6 pt-6 text-center">
            <h2 className="text-3xl font-bold text-white">O Coração da IA</h2>
            <p className="text-zinc-400 text-sm">
              Para processar suas criações, precisamos de uma conexão com o Google. É grátis e leva 30 segundos.
            </p>
            
            <div className="text-left space-y-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest text-center">Passo 1: Gere sua Chave</p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  className="block w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-center rounded-xl text-sm font-bold border border-zinc-700 transition-colors"
                >
                  Ir para o Google AI Studio ↗
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest text-center">Passo 2: Insira a Chave Abaixo</p>
                <input 
                  type="password"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  placeholder="Paste your key here (AIza...)"
                  className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-amber-400 rounded-2xl px-6 py-4 text-white text-center font-mono outline-none transition-all"
                />
              </div>
            </div>

            <button 
              disabled={manualKey.length < 15}
              onClick={() => onComplete(manualKey)}
              className="w-full py-4 bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-amber-300 text-black font-black rounded-2xl transition-all shadow-[0_10px_30px_rgba(251,191,36,0.3)]"
            >
              ATIVAR CAPYVISION ELITE
            </button>
            
            <p className="text-[10px] text-zinc-600">
              Sua chave é armazenada apenas localmente no seu navegador para total privacidade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
