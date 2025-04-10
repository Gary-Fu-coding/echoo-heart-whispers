
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeartPulse, Sun, Moon, Brain, Smile } from 'lucide-react';

interface WelcomeMessageProps {
  onSelectPrompt: (prompt: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSelectPrompt }) => {
  const prompts = [
    { text: "How are you feeling today?", icon: <HeartPulse size={16} /> },
    { text: "I'm having a difficult day", icon: <Moon size={16} /> },
    { text: "Share something positive", icon: <Sun size={16} /> },
    { text: "I need some advice", icon: <Brain size={16} /> },
    { text: "Tell me a joke", icon: <Smile size={16} /> }
  ];

  return (
    <div className="glass-panel p-6 mx-auto my-6 max-w-md animate-fade-in">
      <h2 className="text-xl font-semibold text-center text-echoo-dark mb-3">Welcome to Echoo</h2>
      <p className="text-sm text-center text-echoo-text mb-6">
        I'm your warm AI companion, here to listen, support, and chat about whatever's on your mind.
      </p>
      
      <div className="space-y-2">
        <p className="text-xs text-echoo-text/70 mb-2">Try starting with:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {prompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="bg-white/70 hover:bg-echoo-light text-echoo-text border-echoo/20 flex items-center gap-1.5"
              onClick={() => onSelectPrompt(prompt.text)}
            >
              {prompt.icon}
              {prompt.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
