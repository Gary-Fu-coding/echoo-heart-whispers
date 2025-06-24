
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { 
  Book, BarChart, Smile, Heart, Brain, Calculator, Music, Palette, Globe, Code, 
  Camera, Gamepad2, Briefcase, PenTool, ChefHat, Plane, Dumbbell, Leaf,
  Clock, Presentation, Target, Wrench, Megaphone, Lightbulb, GraduationCap
} from 'lucide-react';

const Roles = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  
  const aiRoles = [
    // Education & Learning
    { 
      id: 'tutor', 
      icon: <GraduationCap className="h-8 w-8" />, 
      title: 'Academic Tutor', 
      description: 'Subject-specific learning and homework help',
      navigateTo: '/tutor'
    },
    { 
      id: 'study', 
      icon: <Book className="h-8 w-8" />, 
      title: 'Study Buddy', 
      description: 'Exam prep and learning strategies',
      navigateTo: '/'
    },
    
    // Professional & Career
    { 
      id: 'career', 
      icon: <Briefcase className="h-8 w-8" />, 
      title: 'Career Coach', 
      description: 'Job search and career development guidance',
      navigateTo: '/'
    },
    { 
      id: 'interview', 
      icon: <Presentation className="h-8 w-8" />, 
      title: 'Interview Coach', 
      description: 'Practice interviews and presentation skills',
      navigateTo: '/'
    },
    { 
      id: 'business', 
      icon: <Target className="h-8 w-8" />, 
      title: 'Business Mentor', 
      description: 'Startup advice and business strategy',
      navigateTo: '/'
    },
    
    // Health & Wellness
    { 
      id: 'fitness', 
      icon: <Dumbbell className="h-8 w-8" />, 
      title: 'Fitness Trainer', 
      description: 'Workout plans and health guidance',
      navigateTo: '/'
    },
    { 
      id: 'wellness', 
      icon: <Leaf className="h-8 w-8" />, 
      title: 'Wellness Coach', 
      description: 'Mental health and stress management',
      navigateTo: '/'
    },
    { 
      id: 'nutrition', 
      icon: <ChefHat className="h-8 w-8" />, 
      title: 'Nutrition Coach', 
      description: 'Diet planning and healthy eating tips',
      navigateTo: '/'
    },
    
    // Creative & Arts
    { 
      id: 'writing', 
      icon: <PenTool className="h-8 w-8" />, 
      title: 'Writing Assistant', 
      description: 'Creative writing and editing support',
      navigateTo: '/'
    },
    { 
      id: 'art', 
      icon: <Palette className="h-8 w-8" />, 
      title: 'Art Mentor', 
      description: 'Creative techniques and artistic guidance',
      navigateTo: '/'
    },
    { 
      id: 'music', 
      icon: <Music className="h-8 w-8" />, 
      title: 'Music Teacher', 
      description: 'Instruments, theory, and composition',
      navigateTo: '/'
    },
    { 
      id: 'photography', 
      icon: <Camera className="h-8 w-8" />, 
      title: 'Photo Coach', 
      description: 'Photography techniques and editing',
      navigateTo: '/'
    },
    
    // Technology & Skills
    { 
      id: 'coding', 
      icon: <Code className="h-8 w-8" />, 
      title: 'Coding Mentor', 
      description: 'Programming help and best practices',
      navigateTo: '/'
    },
    { 
      id: 'tech', 
      icon: <Wrench className="h-8 w-8" />, 
      title: 'Tech Support', 
      description: 'Computer troubleshooting and guidance',
      navigateTo: '/'
    },
    
    // Personal & Social
    { 
      id: 'friend', 
      icon: <Smile className="h-8 w-8" />, 
      title: 'Chat Partner', 
      description: 'Friendly conversations and companionship',
      navigateTo: '/'
    },
    { 
      id: 'social', 
      icon: <Megaphone className="h-8 w-8" />, 
      title: 'Social Coach', 
      description: 'Communication and social skills',
      navigateTo: '/'
    },
    
    // Specialized
    { 
      id: 'financial', 
      icon: <BarChart className="h-8 w-8" />, 
      title: 'Financial Advisor', 
      description: 'Money management and investment advice',
      navigateTo: '/'
    },
    { 
      id: 'travel', 
      icon: <Plane className="h-8 w-8" />, 
      title: 'Travel Planner', 
      description: 'Trip planning and destination guides',
      navigateTo: '/'
    },
    { 
      id: 'productivity', 
      icon: <Clock className="h-8 w-8" />, 
      title: 'Productivity Coach', 
      description: 'Time management and organization',
      navigateTo: '/'
    },
    { 
      id: 'math', 
      icon: <Calculator className="h-8 w-8" />, 
      title: 'Math Helper', 
      description: 'Problem solving and math concepts',
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
      id: 'research', 
      icon: <Brain className="h-8 w-8" />, 
      title: 'Research Assistant', 
      description: 'Information gathering and analysis',
      navigateTo: '/'
    },
    { 
      id: 'gaming', 
      icon: <Gamepad2 className="h-8 w-8" />, 
      title: 'Gaming Buddy', 
      description: 'Game strategies and discussions',
      navigateTo: '/'
    },
    { 
      id: 'creative', 
      icon: <Lightbulb className="h-8 w-8" />, 
      title: 'Idea Generator', 
      description: 'Brainstorming and creative problem solving',
      navigateTo: '/'
    }
  ];
  
  const handleSelectRole = (roleId: 'friend' | 'tutor' | 'financial', navigateTo: string) => {
    setRole(roleId);
    navigate(navigateTo);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl glass-panel p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-echoo-dark dark:text-white mb-2">
            Choose Your AI's Role
          </h2>
          <p className="text-base text-echoo-text dark:text-gray-300">
            Select how you'd like your AI assistant to help you today
          </p>
        </div>
        
        {/* Responsive grid: 1 column on mobile, 2 on small tablet, 3 on tablet, 4 on desktop, 5 on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {aiRoles.map((role) => (
            <Button
              key={role.id}
              variant="outline"
              className="bg-white/70 dark:bg-gray-800/50 hover:bg-echoo-light dark:hover:bg-gray-700 text-echoo-text dark:text-gray-200 border-echoo/20 dark:border-gray-700 h-auto py-6 justify-start transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => handleSelectRole(role.id as any, role.navigateTo)}
            >
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="text-echoo dark:text-echoo-light p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                  {role.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm leading-tight">{role.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{role.description}</div>
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
