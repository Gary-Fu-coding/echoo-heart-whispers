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
import { LogOut, Sparkles, Users, GraduationCap, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ProfilePicture from '@/components/ProfilePicture';
import { useChatGPT } from '@/hooks/useChatGPT';
import { openaiService } from '@/services/openaiService';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { generateResponse: generateEchooResponse, isTyping } = useEchooResponses();
  const { generateResponse: generateChatGPTResponse, isGenerating } = useChatGPT();
  const { t, language } = useLanguage();
  const { role } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get tutor info from localStorage if available
  const tutorGrade = localStorage.getItem('echoo-tutor-grade') || '';
  const tutorSubject = localStorage.getItem('echoo-tutor-subject') || '';
  const isTutorMode = role === 'tutor' && tutorGrade && tutorSubject;
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('echoo-user-logged-in') === 'true';
  const userEmail = localStorage.getItem('echoo-user-email');
  
  // Check if ChatGPT is enabled
  const isChatGPTEnabled = openaiService.hasApiKey();

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

  const handleSendMessage = async (content: string, useAI = false) => {
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
    if (isTyping || isGenerating) {
      const typingIndicator: Message = {
        id: 'typing',
        content: '...',
        sender: 'echoo',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, typingIndicator]);
    }
    
    // Generate response - either from ChatGPT or fallback to default
    let responseContent: string;
    let aiResponse: Message | null = null;
    
    if (useAI && isChatGPTEnabled) {
      // Use ChatGPT for response
      aiResponse = await generateChatGPTResponse(content, messages);
    } 
    
    if (!aiResponse) {
      // Use default Echoo response as fallback
      responseContent = await generateEchooResponse(content);
      
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
    } else {
      // Remove typing indicator if it exists
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Add ChatGPT response
      setMessages(prev => [...prev, aiResponse!]);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt, isChatGPTEnabled);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('echoo-user-logged-in');
    localStorage.removeItem('echoo-user-email');
    localStorage.removeItem('echoo-user-name');
    
    // Show toast notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Navigate to auth page
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {isLoggedIn && (
        <div className="w-full max-w-md flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {userEmail && `Logged in as: ${userEmail}`}
          </div>
          <div className="flex items-center gap-2">
            <ProfilePicture size="sm" editable />
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/messages')}
              className="gap-1 text-gray-600 hover:text-echoo"
            >
              <MessageSquare size={14} />
              Messages
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1 text-gray-600 hover:text-red-600"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      )}
      
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
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isAIGenerating={isGenerating}
        />
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
        {isChatGPTEnabled && (
          <span className="ml-1 text-green-500">• ChatGPT Enabled</span>
        )}
      </footer>
    </div>
  );
};

export default Index;
