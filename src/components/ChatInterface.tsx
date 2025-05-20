
import React, { useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SubjectQuestions from '@/components/SubjectQuestions';
import { Message } from '@/components/ChatMessage';

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
  return (
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
        onSendMessage={onSendMessage} 
        isAIGenerating={isGenerating}
      />
    </div>
  );
};

export default ChatInterface;
