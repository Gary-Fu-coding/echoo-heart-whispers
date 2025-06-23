
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
import { Settings, Mic, MicOff, MessageSquare, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section - Logo and branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Echoo AI
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Intelligent Assistant
                  </p>
                </div>
              </div>
              <UserAuthStatus isLoggedIn={isLoggedIn} userEmail={userEmail} />
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeSelector />
              
              {/* Voice Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVoiceSettings(true)}
                className={`relative transition-colors ${
                  voiceSettings.enabled 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {voiceSettings.enabled ? <Mic size={18} /> : <MicOff size={18} />}
                {voiceSettings.enabled && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-950"></div>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAPIKeyDialog(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Settings size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
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
      </main>
      
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
