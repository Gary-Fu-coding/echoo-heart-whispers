
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';
import WhiteboardTools from './WhiteboardTools';
import { useUITheme } from '@/contexts/UIThemeContext';

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState('pencil');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const { uiTheme } = useUITheme();
  const isDrawing = useRef(false);
  const textEditing = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 120, // Subtract header height
      backgroundColor: '#ffffff',
      isDrawingMode: true
    });
    
    setCanvas(fabricCanvas);
    
    // Set brush settings
    fabricCanvas.freeDrawingBrush.color = brushColor;
    fabricCanvas.freeDrawingBrush.width = brushSize;
    
    // Resize handler
    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth);
      fabricCanvas.setHeight(window.innerHeight - 120);
      fabricCanvas.renderAll();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update brush settings when they change
  useEffect(() => {
    if (!canvas) return;
    
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushSize;
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = activeTool === 'pencil' || activeTool === 'eraser';
    
    // Set eraser mode
    if (activeTool === 'eraser') {
      canvas.freeDrawingBrush.color = '#ffffff';
      canvas.freeDrawingBrush.width = brushSize * 2;
    }
    
    // Set up click handlers for shapes and text
    if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'text') {
      // Remove previous listeners if any
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
      
      // Add new listeners based on active tool
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    } else {
      // Remove listeners when not needed
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    }
  }, [activeTool, brushColor, brushSize, canvas]);

  // Apply theme styling
  useEffect(() => {
    // Adjust canvas background based on theme
    if (canvas && uiTheme) {
      let bgColor = '#ffffff';
      
      // Set theme-specific canvas styling
      switch(uiTheme) {
        case 'kids':
          bgColor = '#FFFFED'; // Light yellow for kids theme
          break;
        case 'elderly':
          bgColor = '#F7FAFC'; // Extra light background for elderly
          break;
        case 'cyber':
          bgColor = '#0F0F1A'; // Dark background for cyber theme
          break;
        default:
          bgColor = '#ffffff';
      }
      
      canvas.setBackgroundColor(bgColor, canvas.renderAll.bind(canvas));
    }
  }, [uiTheme, canvas]);

  // Mouse handlers for shape drawing
  const handleMouseDown = (options: fabric.IEvent<MouseEvent>) => {
    if (!canvas || textEditing.current) return;
    const pointer = canvas.getPointer(options.e);
    isDrawing.current = true;
    
    if (activeTool === 'rectangle') {
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: brushSize / 2,
        selectable: true
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    } 
    else if (activeTool === 'circle') {
      const circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: brushSize / 2,
        selectable: true
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
    }
    else if (activeTool === 'text') {
      textEditing.current = true;
      const text = new fabric.IText('Type here', {
        left: pointer.x,
        top: pointer.y,
        fontFamily: 'Arial',
        fill: brushColor,
        fontSize: brushSize * 3,
        selectable: true,
        editable: true
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
    }
  };

  const handleMouseMove = (options: fabric.IEvent<MouseEvent>) => {
    if (!isDrawing.current || !canvas || textEditing.current) return;
    
    const pointer = canvas.getPointer(options.e);
    const activeObj = canvas.getActiveObject();
    
    if (activeTool === 'rectangle' && activeObj instanceof fabric.Rect) {
      const width = Math.abs(pointer.x - activeObj.left!);
      const height = Math.abs(pointer.y - activeObj.top!);
      activeObj.set({ width, height });
      canvas.renderAll();
    } 
    else if (activeTool === 'circle' && activeObj instanceof fabric.Circle) {
      const radius = Math.sqrt(
        Math.pow(pointer.x - activeObj.left!, 2) + 
        Math.pow(pointer.y - activeObj.top!, 2)
      ) / 2;
      activeObj.set({ radius });
      canvas.renderAll();
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (activeTool === 'text') {
      textEditing.current = false;
    }
  };

  // Canvas actions
  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
      toast({
        title: "Canvas cleared",
        description: "Your whiteboard has been cleared."
      });
    }
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    
    // Create download link
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = `echoo-whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Whiteboard downloaded",
      description: "Your drawing has been saved as a PNG file."
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <WhiteboardTools
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        clearCanvas={clearCanvas}
        downloadCanvas={downloadCanvas}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
      />
      <div className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} id="whiteboard-canvas" />
      </div>
    </div>
  );
};

export default Whiteboard;
