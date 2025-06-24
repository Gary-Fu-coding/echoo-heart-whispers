
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useRole } from '@/contexts/RoleContext';

const CareerPage = () => {
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
    setRole('career');
    setSelectedRole({
      category: 'career',
      name: 'Career Coach'
    });
  }, [setRole, setSelectedRole]);

  const careerPrompts = [
    "Help me write a compelling resume",
    "How do I negotiate salary in a job offer?",
    "What are the best ways to network professionally?",
    "How can I transition to a new career field?",
    "What questions should I ask in a job interview?",
    "How do I build my professional brand on LinkedIn?"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"></div>
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Career Coach
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional development & job search guidance
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
                  Let's Advance Your Career Together
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  I'm here to help you navigate your professional journey, from crafting the perfect resume to acing interviews and advancing in your career.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {careerPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start bg-white/70 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
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
                  Or ask me anything about your career goals and professional development
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

export default CareerPage;
