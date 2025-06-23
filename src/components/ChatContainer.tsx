
import React, { useEffect, useRef } from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // We re-run scroll to bottom when language changes
  useEffect(() => {
    scrollToBottom();
  }, [language]);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatContainer;
