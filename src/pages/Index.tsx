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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Artistic Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] dark:bg-[linear-gradient(rgba(96,165,250,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.05)_1px,transparent_1px)]"></div>
      </div>

      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section - Logo and branding */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
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
      <main className="container mx-auto px-6 py-8 relative z-10">
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
