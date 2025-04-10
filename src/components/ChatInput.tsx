
import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm rounded-b-2xl">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-echoo-dark hover:text-echoo-accent hover:bg-echoo-light"
      >
        <Mic size={20} />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-white/70 border-echoo/30 focus-visible:ring-echoo-accent"
      />
      <Button 
        onClick={handleSendMessage}
        size="icon"
        className="bg-echoo hover:bg-echoo-dark text-white"
        disabled={!message.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
