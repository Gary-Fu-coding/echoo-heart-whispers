
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import UserAuthStatus from '@/components/UserAuthStatus';
import ChatInterface from '@/components/ChatInterface';
import RoleNavigation from '@/components/RoleNavigation';
import AppFooter from '@/components/AppFooter';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const { 
    messages, 
    showWelcome, 
    handleSendMessage, 
    handleSelectPrompt,
    isGenerating,
    isSpeaking,
    isChatGPTEnabled,
    addInitialTutorMessage,
    resetMessages
  } = useChat();
  
  const { language } = useLanguage();
  const { role } = useRole();
  
  // Get tutor info from localStorage if available
  const tutorGrade = localStorage.getItem('echoo-tutor-grade') || '';
  const tutorSubject = localStorage.getItem('echoo-tutor-subject') || '';
  const isTutorMode = role === 'tutor' && Boolean(tutorGrade) && Boolean(tutorSubject);
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('echoo-user-logged-in') === 'true';
  const userEmail = localStorage.getItem('echoo-user-email');

  // Initial greeting message when component mounts or language changes
  useEffect(() => {
    // If in tutor mode, add an initial greeting
    if (isTutorMode && messages.length === 0) {
      addInitialTutorMessage(tutorSubject, tutorGrade);
    } else if (!isTutorMode) {
      // Reset messages if not in tutor mode
      resetMessages();
    }
  }, [language, role, isTutorMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <UserAuthStatus isLoggedIn={isLoggedIn} userEmail={userEmail} />
      
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
      
      <RoleNavigation 
        role={role} 
        messages={messages} 
        tutorSubject={tutorSubject}
        tutorGrade={tutorGrade}
      />
      
      <AppFooter 
        isChatGPTEnabled={isChatGPTEnabled} 
        isSpeaking={isSpeaking}
      />
    </div>
  );
};

export default Index;
