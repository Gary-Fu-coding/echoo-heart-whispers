
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useRole } from '@/contexts/RoleContext';

const FitnessPage = () => {
  const navigate = useNavigate();
  const { setRole, setSelectedRole } = useRole();
  const {
    messages,
    showWelcome,
    handleSendMessage,
    handleSelectPrompt,
    isGenerating,
    isChatGPTEnabled
  } = useChat();

  useEffect(() => {
    setRole('fitness');
    setSelectedRole({
      category: 'fitness',
      name: 'Fitness Trainer'
    });
  }, [setRole, setSelectedRole]);

  const fitnessPrompts = [
    "Create a beginner workout plan for me",
    "How can I improve my running endurance?",
    "What exercises help with back pain?",
    "Design a home workout with no equipment",
    "How do I stay motivated to exercise?",
    "What's the best way to warm up before exercise?"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/roles')}
              className="text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Dumbbell size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Fitness Trainer
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Personalized workouts & health guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-center">
          {showWelcome ? (
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Let's Get You Fit & Healthy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  I'm your personal fitness coach, ready to create customized workout plans, provide exercise guidance, and help you achieve your health goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {fitnessPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start bg-white/70 dark:bg-slate-800/50 hover:bg-green-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                    onClick={() => handleSelectPrompt(prompt)}
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {prompt}
                    </div>
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Or tell me about your fitness goals and current activity level
                </p>
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={messages}
              showWelcome={showWelcome}
              isTutorMode={false}
              isGenerating={isGenerating}
              onSendMessage={handleSendMessage}
              onSelectPrompt={handleSelectPrompt}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default FitnessPage;
