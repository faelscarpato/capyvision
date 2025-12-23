
import React, { useRef, useEffect, useState } from 'react';

interface CanvasEditorProps {
  imageUrl: string;
  onMaskChange: (maskBase64: string | null) => void;
  isGenerating: boolean;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ imageUrl, onMaskChange, isGenerating }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!container || !canvas || !maskCanvas) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const rect = container.getBoundingClientRect();
      const scale = Math.min(rect.width / img.width, 400 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;

      canvas.width = w;
      canvas.height = h;
      maskCanvas.width = w;
      maskCanvas.height = h;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0, w, h);
      
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
        maskCtx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; // Amber mask color
        maskCtx.lineWidth = brushSize;
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx) maskCtx.lineWidth = brushSize;
  }, [brushSize]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGenerating) return;
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isGenerating) return;
    const pos = getPos(e);
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    updateMask();
  };

  const updateMask = () => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    onMaskChange(canvas.toDataURL('image/png'));
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onMaskChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-zinc-500 uppercase">Tamanho do Pincel</label>
          <input 
            type="range" min="10" max="100" value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
        <button 
          onClick={clearMask}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest"
        >
          Limpar Seleção
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative bg-zinc-950 rounded-xl overflow-hidden cursor-crosshair mx-auto shadow-inner border border-zinc-800"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      >
        <canvas ref={canvasRef} className="block" />
        <canvas 
          ref={maskCanvasRef} 
          className="absolute top-0 left-0 pointer-events-none" 
        />
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-amber-400 text-sm font-bold animate-pulse">Processando...</div>
          </div>
        )}
      </div>
      <p className="text-[10px] text-zinc-500 text-center font-medium">Destaque a área que deseja modificar com o pincel</p>
    </div>
  );
};

export default CanvasEditor;
