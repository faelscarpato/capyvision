
import React, { useState, useRef, useEffect } from 'react';
import { GenerationType, GenerationConfig, AspectRatio, ImageSize, VideoResolution } from '../types';
import CanvasEditor from './CanvasEditor';

interface MediaComposerProps {
  activeTab: GenerationType;
  onGenerate: (prompt: string, file: File | null, config: GenerationConfig, maskBase64?: string | null) => void;
  isGenerating: boolean;
}

const MediaComposer: React.FC<MediaComposerProps> = ({ activeTab, onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maskBase64, setMaskBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<GenerationConfig>({
    aspectRatio: '1:1',
    imageSize: '1K',
    videoResolution: '720p',
    style: 'None'
  });

  // Reset state when tab changes
  useEffect(() => {
    setMaskBase64(null);
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMaskBase64(null);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setMaskBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const aspectRatios: AspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];
  const sizes: ImageSize[] = ["1K", "2K", "4K"];
  // Mapeamento de estilos para PT-BR
  const stylesMap = [
    { label: "Nenhum", value: "None" },
    { label: "Fotorealista", value: "Photorealistic" },
    { label: "Anime", value: "Anime" },
    { label: "Aquarela", value: "Watercolor" },
    { label: "Cyberpunk", value: "Cyberpunk" },
    { label: "Pintura a Óleo", value: "Oil Painting" },
    { label: "Render 3D", value: "3D Render" },
    { label: "Rascunho", value: "Sketch" },
    { label: "Pixel Art", value: "Pixel Art" },
    { label: "Noir", value: "Noir" },
    { label: "Cinemático", value: "Cinematic" },
    { label: "Studio Ghibli", value: "Studio Ghibli" }
  ];

  const showCanvasEditor = activeTab === GenerationType.EDIT && previewUrl;

  const getPlaceholder = () => {
      switch (activeTab) {
          case GenerationType.IMAGE: return "O que você quer criar? (ex: Uma cidade futurista em uma bolha de sabão)";
          case GenerationType.VIDEO: return "Como deve ser o movimento? (ex: câmera dá zoom no personagem)";
          case GenerationType.EDIT: return "Descreva as alterações para a área destacada...";
          case GenerationType.ANALYZE: return "Pergunte qualquer coisa sobre a imagem...";
          default: return "Digite seu prompt aqui...";
      }
  };

  return (
    <div className="w-full max-w-4xl bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col gap-6">
        {/* Upload Zone / Canvas Editor */}
        {(activeTab !== GenerationType.IMAGE) && (
          <div 
            className={`relative group overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${previewUrl ? 'border-amber-400/20' : 'border-zinc-800 h-32 hover:border-amber-400/50 cursor-pointer'}`}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="p-4">
                {showCanvasEditor ? (
                  <CanvasEditor 
                    imageUrl={previewUrl} 
                    onMaskChange={setMaskBase64}
                    isGenerating={isGenerating}
                  />
                ) : (
                  <div className="relative h-64">
                    <img src={previewUrl} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <span className="text-white font-semibold">Alterar Origem</span>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleClearFile}
                  className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors z-10"
                  title="Remover Imagem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500 group-hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,40Zm0,168H48V48H208V208ZM152,104a12,12,0,1,1-12-12A12,12,0,0,1,152,104ZM216,40V216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Z"></path></svg>
                <p className="text-sm font-medium">Envie uma imagem para começar</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Input Box */}
        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-zinc-950 text-white rounded-2xl p-5 md:p-6 text-lg border border-zinc-800 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all resize-none min-h-[140px]"
          />
          <button 
            disabled={isGenerating || (!prompt && !selectedFile)}
            onClick={() => onGenerate(prompt, selectedFile, config, maskBase64)}
            className="absolute bottom-4 right-4 px-8 py-3 bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processando...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,122.34l-96-96a8,8,0,0,0-11.32,11.32L196.69,128,106.34,218.34a8,8,0,0,0,11.32,11.32l96-96A8,8,0,0,0,213.66,122.34ZM69.66,122.34l-96-96a8,8,0,0,0-11.32,11.32L52.69,128-37.66,218.34a8,8,0,0,0,11.32,11.32l96-96A8,8,0,0,0,69.66,122.34Z"></path></svg>
                <span>Gerar</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
          {(activeTab === GenerationType.IMAGE || activeTab === GenerationType.VIDEO) && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Proporção (Aspect Ratio)</label>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map(ratio => (
                  <button 
                    key={ratio}
                    onClick={() => setConfig(prev => ({ ...prev, aspectRatio: ratio }))}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${config.aspectRatio === ratio ? 'bg-amber-400 text-black border-amber-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === GenerationType.IMAGE && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Qualidade / Tamanho</label>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setConfig(prev => ({ ...prev, imageSize: size }))}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold border transition-all ${config.imageSize === size ? 'bg-amber-400 text-black border-amber-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === GenerationType.IMAGE && (
            <div className="space-y-4 col-span-full">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Estilo Artístico</label>
              <div className="flex flex-wrap gap-2">
                {stylesMap.map(style => (
                  <button 
                    key={style.value}
                    onClick={() => setConfig(prev => ({ ...prev, style: style.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${config.style === style.value ? 'bg-amber-400 text-black border-amber-400' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === GenerationType.EDIT && (
             <div className="space-y-2 col-span-full">
                <div className="flex items-center gap-2 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.32,96A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"></path></svg>
                  <span className="text-xs font-bold uppercase tracking-widest">Modo de Inpainting Avançado Ativo</span>
                </div>
                <p className="text-zinc-500 text-xs">Desenhe na imagem para especificar a região exata que você deseja que a IA modifique.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaComposer;
