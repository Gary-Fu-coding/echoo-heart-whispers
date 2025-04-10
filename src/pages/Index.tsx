
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import { useEchooResponses } from '@/hooks/useEchooResponses';
import { Message } from '@/components/ChatMessage';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PersonalityProvider } from '@/contexts/PersonalityContext';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { generateResponse, isTyping } = useEchooResponses();
  const { t, language } = useLanguage();

  // Initial greeting message when component mounts or language changes
  useEffect(() => {
    // We now don't add an initial message because we want the user to select a personality mode first
    setMessages([]);
  }, [language, t]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    
    // Show typing indicator
    if (isTyping) {
      const typingIndicator: Message = {
        id: 'typing',
        content: '...',
        sender: 'echoo',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, typingIndicator]);
    }
    
    // Generate Echoo's response
    const responseContent = await generateResponse(content);
    
    // Remove typing indicator if it exists
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
    
    // Add Echoo's response
    const echooResponse: Message = {
      id: uuidv4(),
      content: responseContent,
      sender: 'echoo',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, echooResponse]);
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <PersonalityProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col glass-panel h-[85vh] overflow-hidden shadow-lg">
          <ChatHeader />
          
          <div className="relative flex-1 overflow-hidden">
            <ChatContainer messages={messages} />
            
            {showWelcome && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <WelcomeMessage onSelectPrompt={handleSelectPrompt} />
              </div>
            )}
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
        
        <footer className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-echoo" />
          <span>{t('poweredBy')}</span>
        </footer>
      </div>
    </PersonalityProvider>
  );
};

export default Index;
