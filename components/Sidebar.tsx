
import React from 'react';
import { GenerationType } from '../types';

interface SidebarProps {
  activeTab: GenerationType;
  onTabChange: (tab: GenerationType) => void;
  isApiKeyActive?: boolean;
  onConnectKey?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isApiKeyActive, onConnectKey }) => {
  const tabs = [
    { id: GenerationType.IMAGE, icon: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z", label: "Imagens" },
    { id: GenerationType.VIDEO, icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z", label: "Vídeos" },
    { id: GenerationType.EDIT, icon: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z", label: "Edição" },
    { id: GenerationType.ANALYZE, icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", label: "Análise" }
  ];

  return (
    <nav className="fixed z-50 bg-zinc-950/90 backdrop-blur-xl border-zinc-800 transition-all
      bottom-0 w-full h-auto flex flex-row items-center justify-around py-3 border-t
      md:left-0 md:top-0 md:bottom-0 md:w-20 md:flex-col md:justify-start md:py-8 md:gap-6 md:border-r md:border-t-0">
      
      <div className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center text-black mb-8 transition-all duration-500 ${isApiKeyActive ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,1,1-48-48A48,48,0,0,1,176,88Z"></path></svg>
      </div>
      
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`group relative p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 md:block
            ${activeTab === tab.id ? 'bg-amber-400/10 md:bg-amber-400 text-amber-400 md:text-black md:shadow-lg md:shadow-amber-400/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          title={tab.label}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d={tab.icon} />
          </svg>
          <span className="text-[10px] font-medium md:hidden">{tab.label}</span>
          <span className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-800 shadow-xl">
            {tab.label}
          </span>
        </button>
      ))}

      <div className="md:mt-auto flex flex-col items-center gap-6">
        <button 
          onClick={onConnectKey}
          className={`relative p-3 rounded-xl transition-all group ${isApiKeyActive ? 'text-green-500 hover:text-green-400 hover:bg-green-500/10' : 'text-zinc-500 hover:text-amber-400 hover:bg-zinc-900'}`}
          title={isApiKeyActive ? "Chave API Ativa" : "Conectar Chave API"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,80H171.64A84,84,0,1,0,80,171.64V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V176h16a16,16,0,0,0,16-16V144h32a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM128,144a16,16,0,1,1,16-16A16,16,0,0,1,128,144Z"></path></svg>
          
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isApiKeyActive ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
          
          <span className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-zinc-800 shadow-xl">
            {isApiKeyActive ? 'Gerenciar Chave' : 'Conectar Chave'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
