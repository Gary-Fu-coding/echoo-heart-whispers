
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import { useEchooResponses } from '@/hooks/useEchooResponses';
import { Message } from '@/components/ChatMessage';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { generateResponse, isTyping } = useEchooResponses();

  // Initial greeting message when component mounts
  useEffect(() => {
    const initialMessage: Message = {
      id: uuidv4(),
      content: "Hello! I'm Echoo, your heart's companion. How are you feeling today?",
      sender: 'echoo',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, []);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col glass-panel h-[85vh] overflow-hidden shadow-lg">
        <ChatHeader />
        
        <div className="relative flex-1 overflow-hidden">
          <ChatContainer messages={messages} />
          
          {showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <WelcomeMessage onSelectPrompt={handleSelectPrompt} />
            </div>
          )}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      
      <footer className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
        <Sparkles size={12} className="text-echoo" />
        <span>Powered by heart-centered AI</span>
      </footer>
    </div>
  );
};

export default Index;
