
import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
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
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
    }
    
    return () => {
      if (recognitionRef.current) {
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
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
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
        variant="ghost" 
        size="icon" 
        onClick={toggleSpeechRecognition}
        className={`${isListening ? 'text-echoo-accent' : 'text-echoo-dark dark:text-gray-300'} hover:text-echoo-accent hover:bg-echoo-light dark:hover:bg-gray-700`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-white/70 dark:bg-gray-700/50 border-echoo/30 dark:border-gray-600 focus-visible:ring-echoo-accent"
      />
      <Button 
        onClick={handleSendMessage}
        size="icon"
        className="bg-echoo hover:bg-echoo-dark text-white"
        disabled={!message.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
