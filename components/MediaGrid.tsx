
import React from 'react';
import { MediaItem } from '../types';

interface MediaGridProps {
  items: MediaItem[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-900 rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256" className="text-zinc-800 mb-4"><path d="M232,104a8,8,0,0,1-16,0,16,16,0,0,0-16-16,8,8,0,0,1,0-16A16,16,0,0,0,216,56a8,8,0,0,1,16,0,32,32,0,0,1,32,32A32,32,0,0,1,232,104Zm-32,32H136V48a16,16,0,0,0-16-16H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm8,72H48V48H120v96a8,8,0,0,0,8,8h80ZM80,104a12,12,0,1,1-12-12A12,12,0,0,1,80,104ZM184,180a8,8,0,0,1-8,8H120a8,8,0,0,1-5.66-13.66l24-24a8,8,0,0,1,11.32,0L160,161.37l18.34-18.34a8,8,0,0,1,11.32,11.31Z"></path></svg>
        <p className="text-zinc-600 font-medium">Seu espaço criativo está vazio. Comece a criar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div 
          key={item.id} 
          className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-400/50 transition-all duration-300 shadow-xl"
        >
          <div className="aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden">
            {item.type === 'image' && (
              <img 
                src={item.url} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={item.prompt} 
              />
            )}
            {item.type === 'video' && (
              <video 
                src={item.url} 
                className="w-full h-full object-cover" 
                controls 
                loop 
                muted 
                preload="metadata"
              />
            )}
            {item.type === 'text' && (
              <div className="p-6 h-full w-full overflow-y-auto bg-zinc-950 text-zinc-300 text-sm leading-relaxed scrollbar-thin">
                <p className="whitespace-pre-wrap">{item.url}</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-zinc-900/90 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                item.type === 'image' ? 'bg-blue-500/20 text-blue-400' : 
                item.type === 'video' ? 'bg-purple-500/20 text-purple-400' : 
                'bg-green-500/20 text-green-400'
              }`}>
                {item.type === 'image' ? 'IMAGEM' : item.type === 'video' ? 'VÍDEO' : 'TEXTO'}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
              </span>
            </div>
            <p className="text-zinc-300 text-sm line-clamp-2 font-medium">{item.prompt}</p>
            
            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={item.url} 
                download={`capyvision-${item.id}`}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold text-center transition-colors"
              >
                Baixar
              </a>
              <button 
                onClick={() => {
                  if (item.type === 'text') {
                    navigator.clipboard.writeText(item.url);
                  } else {
                    navigator.clipboard.writeText(item.url);
                  }
                  alert('Copiado com sucesso!');
                }}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                title="Copiar Link/Texto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M200,32H88A16,16,0,0,0,72,48V64H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16V192h24a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-40,176H48V80H160V208Zm40-32H176V80a16,16,0,0,0-16-16H88V48H200V176Z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
