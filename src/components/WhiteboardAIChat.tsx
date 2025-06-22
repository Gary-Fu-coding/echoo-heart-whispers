
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, Bot, MicOff } from 'lucide-react';
import { useAIWhiteboard } from '@/hooks/useAIWhiteboard';
import { fabric } from 'fabric';

interface WhiteboardAIChatProps {
  canvas: fabric.Canvas | null;
}

const WhiteboardAIChat: React.FC<WhiteboardAIChatProps> = ({ canvas }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { isAIActive, isProcessing, processAIRequest } = useAIWhiteboard(canvas);
  
  const handleSendMessage = async () => {
    if (message.trim() && !isProcessing) {
      await processAIRequest(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        setIsListening(true);
        recognition.start();
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
      }
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Bot size={16} className={`${isAIActive ? 'text-blue-500 animate-pulse' : 'text-gray-500'}`} />
        <span className="text-sm font-medium text-gray-700">
          {isProcessing ? 'AI is teaching...' : 'Ask AI to teach on whiteboard'}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSpeechRecognition}
          className={`${isListening ? 'text-blue-500' : 'text-gray-500'}`}
          disabled={isProcessing}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isProcessing ? "AI is working..." : "Ask me to explain something..."}
          className="flex-1"
          disabled={isProcessing}
        />
        
        <Button
          onClick={handleSendMessage}
          size="icon"
          disabled={!message.trim() || isProcessing}
        >
          <Send size={18} />
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        Try: "Explain the Pythagorean theorem" or "Show me how to solve 2x + 5 = 15"
      </div>
    </div>
  );
};

export default WhiteboardAIChat;
