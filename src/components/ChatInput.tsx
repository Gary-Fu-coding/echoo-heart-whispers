
import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { openaiService } from '@/services/openaiService';

interface ChatInputProps {
  onSendMessage: (message: string, useAI?: boolean) => void;
  isAIGenerating?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isAIGenerating = false }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionReady, setRecognitionReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { language } = useLanguage();

  // Setup speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Map language context to speech recognition language
      const languageMap: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        zh: 'zh-CN',
        hi: 'hi-IN'
      };
      
      recognitionRef.current.lang = languageMap[language] || 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setRecognitionReady(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🗣️ Speech recognized:', transcript);
        setMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        setRecognitionReady(true);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('🚨 Speech recognition error:', event.error);
        setIsListening(false);
        setRecognitionReady(true);
        
        // Only show error toast for serious errors, not for no-speech
        if (event.error !== 'no-speech') {
          toast({
            title: "Voice recognition error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          });
        }
      };
      
      setRecognitionReady(true);
    } else {
      console.warn('Speech recognition not supported');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [language]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if already listening
    if (isListening) {
      console.log('🛑 Stopping speech recognition');
      recognitionRef.current.stop();
      return;
    }
    
    // Check if recognition is ready to start
    if (!recognitionReady) {
      console.log('⏳ Speech recognition not ready');
      return;
    }
    
    try {
      console.log('▶️ Starting speech recognition');
      setRecognitionReady(false);
      recognitionRef.current.start();
    } catch (error) {
      console.error('❌ Failed to start recognition:', error);
      setIsListening(false);
      setRecognitionReady(true);
      toast({
        title: "Voice Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const useAI = openaiService.hasApiKey();
      onSendMessage(message, useAI);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-100 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-2xl">
      <Button 
        variant={isListening ? "glass-active" : "glass"}
        size="icon-pill"
        onClick={toggleSpeechRecognition}
        className={`${isListening ? 'text-echoo-accent animate-pulse' : 'text-echoo-dark dark:text-gray-300'}`}
        disabled={isAIGenerating || !recognitionReady}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isAIGenerating ? "AI is generating a response..." : isListening ? "Listening..." : "Type a message..."}
        className="flex-1 bg-white/70 dark:bg-gray-700/50 border-echoo/30 dark:border-gray-600 focus-visible:ring-echoo-accent rounded-full"
        disabled={isAIGenerating}
      />
      <Button 
        onClick={handleSendMessage}
        size="icon-pill"
        variant="blue-glass"
        disabled={!message.trim() || isAIGenerating}
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
