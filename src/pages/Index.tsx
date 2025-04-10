
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SubjectQuestions from '@/components/SubjectQuestions';
import { useEchooResponses } from '@/hooks/useEchooResponses';
import { Message } from '@/components/ChatMessage';
import { Sparkles, Users, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { generateResponse, isTyping } = useEchooResponses();
  const { t, language } = useLanguage();
  const { role } = useRole();
  const navigate = useNavigate();
  
  // Get tutor info from localStorage if available
  const tutorGrade = localStorage.getItem('echoo-tutor-grade') || '';
  const tutorSubject = localStorage.getItem('echoo-tutor-subject') || '';
  const isTutorMode = role === 'tutor' && tutorGrade && tutorSubject;

  // Initial greeting message when component mounts or language changes
  useEffect(() => {
    // If in tutor mode, add an initial greeting
    if (isTutorMode && messages.length === 0) {
      const initialGreeting: Message = {
        id: uuidv4(),
        content: `Welcome to your ${tutorSubject} tutoring session! I'm your AI tutor for ${tutorGrade} level. What would you like to learn about today?`,
        sender: 'echoo',
        timestamp: new Date()
      };
      setMessages([initialGreeting]);
    } else if (!isTutorMode) {
      // Reset messages if not in tutor mode
      setMessages([]);
    }
  }, [language, t, role, isTutorMode]);

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
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              {isTutorMode ? (
                <div className="w-full max-w-xs p-4">
                  <h3 className="text-lg font-semibold text-center mb-2 text-blue-700 dark:text-blue-400">
                    {tutorSubject} - {tutorGrade}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Ask me anything about {tutorSubject}!
                  </p>
                  <SubjectQuestions 
                    subject={tutorSubject} 
                    grade={tutorGrade} 
                    onSelectPrompt={handleSelectPrompt} 
                  />
                </div>
              ) : (
                <WelcomeMessage onSelectPrompt={handleSelectPrompt} />
              )}
            </div>
          )}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      
      {role === 'default' && messages.length === 0 && (
        <div className="mt-4 mb-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 max-w-md text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Want to customize how Echoo helps you?
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/roles')}
            className="gap-2 text-echoo"
          >
            <Users size={16} />
            Choose AI Role
          </Button>
        </div>
      )}
      
      {role === 'tutor' && (
        <div className="mt-4 mb-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 max-w-md text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Learning {tutorSubject} at {tutorGrade} level
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/tutor')}
            className="gap-2 text-echoo"
          >
            <GraduationCap size={16} />
            Change Subject or Level
          </Button>
        </div>
      )}
      
      <footer className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
        <Sparkles size={12} className="text-echoo" />
        <span>{t('poweredBy')}</span>
      </footer>
    </div>
  );
};

export default Index;
