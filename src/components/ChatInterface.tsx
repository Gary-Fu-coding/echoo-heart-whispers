
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
    <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-md'} flex flex-col glass-panel h-[85vh] overflow-hidden shadow-lg`}>
      <ChatHeader />
      
      <div className="relative flex-1 overflow-hidden">
        <ChatContainer messages={messages} />
        
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            {isTutorMode ? (
              <div className={`w-full ${isMobile ? 'p-2' : 'max-w-xs p-4'}`}>
                <h3 className="text-lg font-semibold text-center mb-2 text-blue-700 dark:text-blue-400">
                  {tutorSubject} - {tutorGrade}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                  Ask me anything about {tutorSubject}!
                </p>
                <SubjectQuestions 
                  subject={tutorSubject} 
                  grade={tutorGrade} 
                  onSelectPrompt={onSelectPrompt} 
                />
              </div>
            ) : (
              <WelcomeMessage onSelectPrompt={onSelectPrompt} />
            )}
          </div>
        )}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isAIGenerating={isGenerating}
      />
    </div>
  );
};

export default ChatInterface;
