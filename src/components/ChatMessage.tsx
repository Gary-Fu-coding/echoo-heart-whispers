
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'echoo';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, sender, timestamp } = message;
  const isUser = sender === 'user';
  
  return (
    <div className={cn("flex items-end gap-2 mb-4", isUser ? "flex-row-reverse" : "")}>
      {!isUser && (
        <Avatar className="w-8 h-8 bg-echoo animate-pulse-soft">
          <AvatarImage src="/echoo-avatar.png" alt="Echoo" />
          <AvatarFallback className="bg-echoo text-white text-xs">EC</AvatarFallback>
        </Avatar>
      )}
      
      <div className={isUser ? "user-message" : "echoo-message"}>
        <p className="text-sm">{content}</p>
        <div className={cn("text-[10px] mt-1 opacity-70", isUser ? "text-right" : "text-left")}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 bg-echoo-light border border-echoo/30">
          <AvatarFallback className="bg-echoo-light text-echoo-dark text-xs">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
