
import React, { useEffect, useRef } from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-1 p-4 overflow-y-auto chat-scrollbar bg-background/30 transition-colors duration-300">
      <div className="flex flex-col space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
