
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { Book, BarChart, Smile, Heart, Brain, Calculator, Music, Palette, Globe, Code, Camera, Gamepad2 } from 'lucide-react';

const Roles = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  
  const aiRoles = [
    { 
      id: 'tutor', 
      icon: <Book className="h-8 w-8" />, 
      title: 'Tutor', 
      description: 'Learn and grow with educational guidance',
      navigateTo: '/tutor'
    },
    { 
      id: 'financial', 
      icon: <BarChart className="h-8 w-8" />, 
      title: 'Financial Advisor', 
      description: 'Get advice on financial matters',
      navigateTo: '/'
    },
    { 
      id: 'friend', 
      icon: <Smile className="h-8 w-8" />, 
      title: 'AI Friend', 
      description: 'Chat and connect with a friendly companion',
      navigateTo: '/'
    },
    { 
      id: 'therapist', 
      icon: <Heart className="h-8 w-8" />, 
      title: 'Life Coach', 
      description: 'Personal development and wellness support',
      navigateTo: '/'
    },
    { 
      id: 'scientist', 
      icon: <Brain className="h-8 w-8" />, 
      title: 'Research Assistant', 
      description: 'Help with research and analysis',
      navigateTo: '/'
    },
    { 
      id: 'math', 
      icon: <Calculator className="h-8 w-8" />, 
      title: 'Math Helper', 
      description: 'Solve equations and explain concepts',
      navigateTo: '/'
    },
    { 
      id: 'music', 
      icon: <Music className="h-8 w-8" />, 
      title: 'Music Teacher', 
      description: 'Learn instruments and music theory',
      navigateTo: '/'
    },
    { 
      id: 'art', 
      icon: <Palette className="h-8 w-8" />, 
      title: 'Art Mentor', 
      description: 'Creative guidance and techniques',
      navigateTo: '/'
    },
    { 
      id: 'language', 
      icon: <Globe className="h-8 w-8" />, 
      title: 'Language Partner', 
      description: 'Practice and learn new languages',
      navigateTo: '/'
    },
    { 
      id: 'coding', 
      icon: <Code className="h-8 w-8" />, 
      title: 'Coding Mentor', 
      description: 'Programming help and guidance',
      navigateTo: '/'
    },
    { 
      id: 'photography', 
      icon: <Camera className="h-8 w-8" />, 
      title: 'Photo Coach', 
      description: 'Photography tips and techniques',
      navigateTo: '/'
    },
    { 
      id: 'gaming', 
      icon: <Gamepad2 className="h-8 w-8" />, 
      title: 'Gaming Buddy', 
      description: 'Game strategies and discussions',
      navigateTo: '/'
    }
  ];
  
  const handleSelectRole = (roleId: 'friend' | 'tutor' | 'financial', navigateTo: string) => {
    setRole(roleId);
    navigate(navigateTo);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl glass-panel p-8 shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-echoo-dark dark:text-white mb-8">
          Choose Your AI's Role
        </h2>
        
        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3-4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {aiRoles.map((role) => (
            <Button
              key={role.id}
              variant="outline"
              className="bg-white/70 dark:bg-gray-800/50 hover:bg-echoo-light dark:hover:bg-gray-700 text-echoo-text dark:text-gray-200 border-echoo/20 dark:border-gray-700 h-auto py-6 justify-start transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => handleSelectRole(role.id as any, role.navigateTo)}
            >
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="text-echoo dark:text-echoo-light p-2 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  {role.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-lg">{role.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roles;
