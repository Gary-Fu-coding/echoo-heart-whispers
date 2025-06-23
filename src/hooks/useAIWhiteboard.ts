
import { useState } from 'react';
import { fabric } from 'fabric';
import { openaiService } from '@/services/openaiService';
import { elevenLabsService } from '@/services/elevenLabsService';
import { useVoice } from '@/contexts/VoiceContext';
import { useToast } from '@/hooks/use-toast';

export const useAIWhiteboard = (canvas: fabric.Canvas | null) => {
  const [isAIActive, setIsAIActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { voiceSettings, apiKey: voiceApiKey } = useVoice();
  const { toast } = useToast();

  const drawText = (text: string, x: number, y: number, options?: any) => {
    if (!canvas) return;
    
    const textObj = new fabric.IText(text, {
      left: x,
      top: y,
      fontFamily: 'Arial',
      fontSize: options?.fontSize || 16,
      fill: options?.color || '#000000',
      selectable: false,
      ...options
    });
    
    canvas.add(textObj);
    canvas.renderAll();
  };

  const drawShape = (type: 'rectangle' | 'circle' | 'line', coords: any, options?: any) => {
    if (!canvas) return;
    
    let shape;
    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: coords.x,
          top: coords.y,
          width: coords.width,
          height: coords.height,
          fill: 'transparent',
          stroke: options?.color || '#000000',
          strokeWidth: options?.strokeWidth || 2,
          selectable: false
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: coords.x,
          top: coords.y,
          radius: coords.radius,
          fill: 'transparent',
          stroke: options?.color || '#000000',
          strokeWidth: options?.strokeWidth || 2,
          selectable: false
        });
        break;
      case 'line':
        shape = new fabric.Line([coords.x1, coords.y1, coords.x2, coords.y2], {
          stroke: options?.color || '#000000',
          strokeWidth: options?.strokeWidth || 2,
          selectable: false
        });
        break;
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.renderAll();
    }
  };

  const processAIRequest = async (userMessage: string) => {
    console.log('Processing AI request:', userMessage);
    
    if (!openaiService.hasApiKey()) {
      toast({
        title: "Setup Required",
        description: "Please set your OpenAI API key to use AI whiteboard features.",
        variant: "destructive",
      });
      return;
    }
    
    if (!canvas) {
      toast({
        title: "Error",
        description: "Canvas not available.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setIsAIActive(true);

    try {
      // Create a specialized prompt for whiteboard teaching
      const messages = [
        {
          role: 'system' as const,
          content: `You are an AI tutor that can draw and write on a whiteboard to teach concepts. 
          When explaining something, you should provide both spoken explanation and drawing instructions.
          
          For drawing instructions, use this format:
          DRAW_TEXT: "text content" AT x,y SIZE fontSize COLOR color
          DRAW_RECTANGLE: x,y,width,height COLOR color
          DRAW_CIRCLE: x,y,radius COLOR color
          DRAW_LINE: x1,y1,x2,y2 COLOR color
          
          Always provide clear, educational explanations while drawing visual aids.
          Keep coordinates within 0-800 for x and 0-600 for y.`
        },
        {
          role: 'user' as const,
          content: userMessage
        }
      ];

      console.log('Sending request to OpenAI...');
      const response = await openaiService.generateCompletion({
        messages,
        temperature: 0.7
      });

      console.log('OpenAI response received:', response);

      // Process drawing commands
      const lines = response.split('\n');
      let spokenText = '';
      
      for (const line of lines) {
        if (line.startsWith('DRAW_TEXT:')) {
          const match = line.match(/DRAW_TEXT: "([^"]+)" AT (\d+),(\d+) SIZE (\d+) COLOR (\w+)/);
          if (match) {
            const [, text, x, y, size, color] = match;
            drawText(text, parseInt(x), parseInt(y), { fontSize: parseInt(size), fill: color });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for visual effect
          }
        } else if (line.startsWith('DRAW_RECTANGLE:')) {
          const match = line.match(/DRAW_RECTANGLE: (\d+),(\d+),(\d+),(\d+) COLOR (\w+)/);
          if (match) {
            const [, x, y, width, height, color] = match;
            drawShape('rectangle', { x: parseInt(x), y: parseInt(y), width: parseInt(width), height: parseInt(height) }, { color });
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        } else if (line.startsWith('DRAW_CIRCLE:')) {
          const match = line.match(/DRAW_CIRCLE: (\d+),(\d+),(\d+) COLOR (\w+)/);
          if (match) {
            const [, x, y, radius, color] = match;
            drawShape('circle', { x: parseInt(x), y: parseInt(y), radius: parseInt(radius) }, { color });
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        } else if (line.startsWith('DRAW_LINE:')) {
          const match = line.match(/DRAW_LINE: (\d+),(\d+),(\d+),(\d+) COLOR (\w+)/);
          if (match) {
            const [, x1, y1, x2, y2, color] = match;
            drawShape('line', { x1: parseInt(x1), y1: parseInt(y1), x2: parseInt(x2), y2: parseInt(y2) }, { color });
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        } else if (line.trim() && !line.startsWith('DRAW_')) {
          spokenText += line + ' ';
        }
      }

      // Convert to speech if voice is enabled
      if (voiceSettings.enabled && voiceApiKey && spokenText.trim()) {
        const audioBuffer = await elevenLabsService.textToSpeech({
          text: spokenText.trim(),
          voiceId: voiceSettings.voiceId,
          modelId: voiceSettings.model,
          apiKey: voiceApiKey
        });
        
        if (audioBuffer) {
          elevenLabsService.playAudio(audioBuffer);
        }
      }

      toast({
        title: "Success",
        description: "AI response completed successfully!",
      });

    } catch (error) {
      console.error('Error processing AI request:', error);
      
      let errorMessage = "Failed to process AI request. Please try again.";
      let errorTitle = "Error";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific guidance based on error
        if (error.message.includes('insufficient_quota')) {
          errorTitle = "OpenAI Quota Exceeded";
          errorMessage = "Your OpenAI account has no available credits. Please check your usage at https://platform.openai.com/usage and add billing if needed.";
        } else if (error.message.includes('invalid_api_key')) {
          errorTitle = "Invalid API Key";
          errorMessage = "Your OpenAI API key is invalid. Please generate a new one at https://platform.openai.com/api-keys";
        } else if (error.message.includes('model_not_found')) {
          errorTitle = "Model Not Available";
          errorMessage = "The AI model is not available for your account. This might be due to account limitations.";
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsAIActive(false);
    }
  };

  return {
    isAIActive,
    isProcessing,
    processAIRequest,
    drawText,
    drawShape
  };
};
