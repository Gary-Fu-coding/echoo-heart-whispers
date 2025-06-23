
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePersonality } from '@/contexts/PersonalityContext';
import { Volume2 } from 'lucide-react';

interface WelcomeMessageProps {
  onSelectPrompt: (prompt: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSelectPrompt }) => {
  const { setMode } = usePersonality();
  
  const personalityModes = [
    { 
      id: 'comfort', 
      icon: '🧸', 
      title: 'Comfort Mode', 
      description: 'Gentle, supportive, understanding' 
    },
    { 
      id: 'wisdom', 
      icon: '📚', 
      title: 'Wisdom Mode', 
      description: 'Calm, insightful, knowledgeable' 
    },
    { 
      id: 'fun', 
      icon: '🎉', 
      title: 'Fun Mode', 
      description: 'Upbeat, funny, lighthearted' 
    },
    { 
      id: 'motivation', 
      icon: '💪', 
      title: 'Motivation Mode', 
      description: 'Energetic, inspiring, encouraging' 
    }
  ];
  
  const handleSelectMode = (modeId: 'comfort' | 'wisdom' | 'fun' | 'motivation') => {
    setMode(modeId);
    // Send initial greeting based on selected mode
    const greetingMap = {
      comfort: "I'm here for you. How are you feeling today?",
      wisdom: "I'm ready to explore thoughtful conversations with you. What's on your mind?",
      fun: "Hey there! Ready for some awesome chat time? What's happening?",
      motivation: "Let's make today amazing! What are you working towards?"
    };
    onSelectPrompt(greetingMap[modeId]);
  };

  return (
    <div className="glass-panel p-8 mx-auto my-6 w-full animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center shadow-lg mb-4">
          <Volume2 size={40} className="text-white animate-pulse-soft" />
        </div>
        <h2 className="text-3xl font-semibold text-center text-echoo-dark dark:text-white">Welcome to Echoo</h2>
        <p className="text-base text-center text-echoo-text dark:text-gray-300 mt-3 max-w-lg">
          Your AI friend that listens and responds 💛<br />
          How would you like me to speak with you today?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {personalityModes.map((mode) => (
          <Button
            key={mode.id}
            variant="outline"
            className="bg-white/70 dark:bg-gray-800/50 hover:bg-echoo-light dark:hover:bg-gray-700 text-echoo-text dark:text-gray-200 border-echoo/20 dark:border-gray-700 h-auto py-4 justify-start transition-all duration-200 hover:scale-105"
            onClick={() => handleSelectMode(mode.id as any)}
          >
            <div className="flex items-center gap-4 w-full">
              <span className="text-3xl">{mode.icon}</span>
              <div className="text-left flex-1">
                <div className="font-medium text-lg">{mode.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{mode.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;
