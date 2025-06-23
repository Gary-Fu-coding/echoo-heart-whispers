
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import AppFooter from '@/components/AppFooter';
import APIKeyDialog from '@/components/APIKeyDialog';
import VoiceSettingsDialog from '@/components/VoiceSettingsDialog';
import UserAuthStatus from '@/components/UserAuthStatus';
import ThemeSelector from '@/components/ThemeSelector';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Settings, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { useChatGPT } from '@/hooks/useChatGPT';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/components/ChatMessage';
import { openaiService } from '@/services/openaiService';
import { useVoice } from '@/contexts/VoiceContext';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedRole } = useRole();
  const { voiceSettings } = useVoice();
  const { generateResponse, isGenerating, isSpeaking } = useChatGPT();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Check authentication status from localStorage
    const loggedIn = localStorage.getItem('echoo-user-logged-in') === 'true';
    const email = localStorage.getItem('echoo-user-email');
    setIsLoggedIn(loggedIn);
    setUserEmail(email);
  }, []);
  
  // Check if this is tutor mode
  const isTutorMode = selectedRole?.category === 'tutor';
  const tutorSubject = selectedRole?.name?.split(' ')[0] || '';
  const tutorGrade = selectedRole?.name?.split(' - ')[1] || '';
  
  const handleSendMessage = async (message: string, useAI = false) => {
    console.log('Sending message:', message, 'useAI:', useAI);
    
    if (!useAI) {
      // Handle non-AI messages (if any)
      const newMessage: Message = {
        id: uuidv4(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setShowWelcome(false);
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    
    // Generate AI response with voice support
    const aiResponse = await generateResponse(message, messages);
    
    if (aiResponse) {
      setMessages(prev => [...prev, aiResponse]);
    }
  };
  
  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt, openaiService.hasApiKey());
  };
  
  return (
    <div className="min-h-screen gradient-bg p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <UserAuthStatus isLoggedIn={isLoggedIn} userEmail={userEmail} />
          <h1 className="text-2xl font-bold text-echoo-primary">{t('title')}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeSelector />
          
          {/* Voice Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVoiceSettings(true)}
            className={voiceSettings.enabled ? 'text-echoo-accent' : 'text-gray-500'}
          >
            {voiceSettings.enabled ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAPIKeyDialog(true)}
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center">
        <ChatInterface
          messages={messages}
          showWelcome={showWelcome}
          isTutorMode={isTutorMode}
          tutorSubject={tutorSubject}
          tutorGrade={tutorGrade}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
          onSelectPrompt={handleSelectPrompt}
        />
      </div>
      
      <AppFooter 
        isChatGPTEnabled={openaiService.hasApiKey()} 
        isSpeaking={isSpeaking}
      />
      
      {/* Dialogs */}
      <APIKeyDialog 
        open={showAPIKeyDialog} 
        onOpenChange={setShowAPIKeyDialog} 
      />
      
      <VoiceSettingsDialog 
        open={showVoiceSettings} 
        onOpenChange={setShowVoiceSettings} 
      />
    </div>
  );
};

export default Index;
