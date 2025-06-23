
import React from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SubjectQuestions from '@/components/SubjectQuestions';
import { Message } from '@/components/ChatMessage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVoice } from '@/contexts/VoiceContext';

interface ChatInterfaceProps {
  messages: Message[];
  showWelcome: boolean;
  isTutorMode: boolean;
  tutorSubject?: string;
  tutorGrade?: string;
  isGenerating: boolean;
  onSendMessage: (message: string, useAI?: boolean) => void;
  onSelectPrompt: (prompt: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  showWelcome, 
  isTutorMode,
  tutorSubject = '',
  tutorGrade = '',
  isGenerating,
  onSendMessage,
  onSelectPrompt
}) => {
  const isMobile = useIsMobile();
  const { voiceSettings, apiKey } = useVoice();
  
  const handleSendMessage = (message: string, useAI?: boolean) => {
    // Pass voice settings to the message handler if voice is enabled
    onSendMessage(message, useAI);
  };
  
  return (
    <div className={`w-full ${isMobile ? 'max-w-full h-[calc(100vh-180px)]' : 'max-w-4xl h-[calc(100vh-200px)]'} flex flex-col`}>
      {/* Modern Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-800/60 overflow-hidden backdrop-blur-sm flex flex-col h-full">
        <ChatHeader />
        
        <div className="relative flex-1 overflow-hidden">
          <ChatContainer messages={messages} />
          
          {showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-sm overflow-y-auto">
              {isTutorMode ? (
                <div className={`w-full ${isMobile ? 'p-4' : 'max-w-lg p-6'}`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{tutorSubject.charAt(0)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {tutorSubject} Tutor
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {tutorGrade} • Ready to help you learn
                    </p>
                  </div>
                  <SubjectQuestions 
                    subject={tutorSubject} 
                    grade={tutorGrade} 
                    onSelectPrompt={onSelectPrompt} 
                  />
                </div>
              ) : (
                <div className="w-full max-w-lg p-6">
                  <WelcomeMessage onSelectPrompt={onSelectPrompt} />
                </div>
              )}
            </div>
          )}
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isAIGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
