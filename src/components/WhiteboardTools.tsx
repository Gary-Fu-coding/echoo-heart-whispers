
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  Text, 
  Eraser, 
  Trash2, 
  Download,
  ArrowLeft
} from 'lucide-react';
import { useUITheme } from '@/contexts/UIThemeContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface WhiteboardToolsProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  clearCanvas: () => void;
  downloadCanvas: () => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

const WhiteboardTools: React.FC<WhiteboardToolsProps> = ({
  activeTool,
  setActiveTool,
  brushColor,
  setBrushColor,
  clearCanvas,
  downloadCanvas,
  brushSize,
  setBrushSize
}) => {
  const { uiTheme } = useUITheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const colorOptions = [
    '#000000', '#FF0000', '#0000FF', '#00FF00', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
  ];
  
  const isButtonActive = (tool: string) => activeTool === tool;
  
  const getButtonClass = (tool: string) => {
    if (isButtonActive(tool)) {
      return `bg-primary text-white`;
    }
    return 'bg-background hover:bg-muted';
  };

  return (
    <div className="p-2 border-b border-border flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> {!isMobile && "Back to Chat"}
        </Button>
        <h1 className="text-xl font-semibold">Whiteboard</h1>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center flex-wrap'} gap-2 justify-between`}>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            size="icon" 
            className={getButtonClass('pencil')} 
            onClick={() => setActiveTool('pencil')}
            title="Pencil"
          >
            <Pencil size={18} />
          </Button>
          <Button 
            size="icon" 
            className={getButtonClass('rectangle')} 
            onClick={() => setActiveTool('rectangle')}
            title="Rectangle"
          >
            <Square size={18} />
          </Button>
          <Button 
            size="icon" 
            className={getButtonClass('circle')} 
            onClick={() => setActiveTool('circle')}
            title="Circle"
          >
            <CircleIcon size={18} />
          </Button>
          <Button 
            size="icon" 
            className={getButtonClass('text')} 
            onClick={() => setActiveTool('text')}
            title="Text"
          >
            <Text size={18} />
          </Button>
          <Button 
            size="icon" 
            className={getButtonClass('eraser')} 
            onClick={() => setActiveTool('eraser')}
            title="Eraser"
          >
            <Eraser size={18} />
          </Button>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
          <div className="flex items-center gap-2">
            <label htmlFor="brush-size" className="text-sm">Size:</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {colorOptions.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full ${
                  brushColor === color ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setBrushColor(color)}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="destructive"
            onClick={clearCanvas}
            title="Clear canvas"
          >
            <Trash2 size={18} />
          </Button>
          <Button 
            size="icon" 
            variant="outline"
            onClick={downloadCanvas}
            title="Download"
          >
            <Download size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardTools;
