
import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Radio } from 'lucide-react';
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
  const [autoListenMode, setAutoListenMode] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
        
        // Auto-send the message if we have content
        if (transcript.trim()) {
          const useAI = openaiService.hasApiKey();
          onSendMessage(transcript, useAI);
          setMessage('');
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        setRecognitionReady(true);
        
        // Auto-restart listening if in auto mode and not generating AI response
        if (autoListenMode && !isAIGenerating) {
          autoRestartTimeoutRef.current = setTimeout(() => {
            if (autoListenMode && recognitionRef.current && !isAIGenerating) {
              startListening();
            }
          }, 1000); // Wait 1 second before restarting
        }
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
        
        // Auto-restart listening if in auto mode and it was a no-speech error
        if (autoListenMode && event.error === 'no-speech' && !isAIGenerating) {
          autoRestartTimeoutRef.current = setTimeout(() => {
            if (autoListenMode && recognitionRef.current && !isAIGenerating) {
              startListening();
            }
          }, 2000); // Wait 2 seconds before restarting after no-speech
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
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }
    };
  }, [language, autoListenMode, isAIGenerating, onSendMessage]);

  // Stop auto-listening when AI is generating
  useEffect(() => {
    if (isAIGenerating && isListening) {
      stopListening();
    } else if (!isAIGenerating && autoListenMode && !isListening) {
      // Restart listening after AI finishes generating
      autoRestartTimeoutRef.current = setTimeout(() => {
        if (autoListenMode && recognitionRef.current && !isAIGenerating) {
          startListening();
        }
      }, 1000);
    }
  }, [isAIGenerating, autoListenMode, isListening]);

  const startListening = () => {
    if (!recognitionRef.current || isListening || !recognitionReady) return;
    
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

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('🛑 Stopping speech recognition');
      recognitionRef.current.stop();
    }
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
      autoRestartTimeoutRef.current = null;
    }
  };

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
      stopListening();
      setAutoListenMode(false);
      return;
    }
    
    if (!recognitionReady) {
      console.log('⏳ Speech recognition not ready');
      return;
    }
    
    startListening();
  };

  const toggleAutoListenMode = () => {
    const newAutoMode = !autoListenMode;
    setAutoListenMode(newAutoMode);
    
    if (newAutoMode && !isListening && !isAIGenerating) {
      startListening();
      toast({
        title: "Auto-listening enabled",
        description: "I'll automatically listen for your voice after each response.",
      });
    } else if (!newAutoMode) {
      stopListening();
      toast({
        title: "Auto-listening disabled",
        description: "You'll need to press the microphone button to speak.",
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
    <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        {/* Auto-listening toggle */}
        <Button 
          variant="ghost"
          size="icon"
          onClick={toggleAutoListenMode}
          className={`rounded-xl transition-all duration-200 ${
            autoListenMode 
              ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          disabled={isAIGenerating}
          title={autoListenMode ? "Auto-listening enabled" : "Enable auto-listening"}
        >
          <Radio size={18} className={autoListenMode ? 'animate-pulse' : ''} />
        </Button>
        
        {/* Manual microphone toggle */}
        <Button 
          variant="ghost"
          size="icon"
          onClick={toggleSpeechRecognition}
          className={`rounded-xl transition-all duration-200 ${
            isListening 
              ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shadow-sm animate-pulse' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          disabled={isAIGenerating || !recognitionReady}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        
        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAIGenerating 
                ? "AI is thinking..." 
                : autoListenMode && isListening 
                  ? "🎤 Listening..." 
                  : isListening 
                    ? "🎤 Speak now..." 
                    : "Type your message..."
            }
            className="h-12 pr-12 rounded-xl border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200"
            disabled={isAIGenerating}
          />
          
          {/* Send button */}
          <Button 
            onClick={handleSendMessage}
            size="icon"
            className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all duration-200 disabled:opacity-50"
            disabled={!message.trim() || isAIGenerating}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
      
      {/* Status indicator */}
      {(isListening || autoListenMode || isAIGenerating) && (
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {isAIGenerating && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>AI is generating response...</span>
              </>
            )}
            {autoListenMode && !isAIGenerating && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-listening active</span>
              </>
            )}
            {isListening && !autoListenMode && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening for voice input...</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
