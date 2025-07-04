
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/contexts/RoleContext';
import { 
  Book, BarChart, Smile, Heart, Brain, Calculator, Music, Palette, Globe, Code, 
  Camera, Gamepad2, Briefcase, PenTool, ChefHat, Plane, Dumbbell, Leaf,
  Clock, Presentation, Target, Wrench, Megaphone, Lightbulb, GraduationCap,
  Stethoscope, Trophy, Users, FileText, Zap
} from 'lucide-react';

const TabbedRoles = () => {
  const navigate = useNavigate();
  const { setRole, setSelectedRole } = useRole();
  
  const roleCategories = {
    education: {
      title: 'Education & Learning',
      roles: [
        { 
          id: 'tutor', 
          icon: <GraduationCap className="h-8 w-8" />, 
          title: 'Academic Tutor', 
          description: 'Subject-specific learning and homework help',
          category: 'tutor',
          navigateTo: '/tutor'
        },
        { 
          id: 'study', 
          icon: <Book className="h-8 w-8" />, 
          title: 'Study Buddy', 
          description: 'Exam prep and learning strategies',
          category: 'study',
          navigateTo: '/chat'
        },
        { 
          id: 'math', 
          icon: <Calculator className="h-8 w-8" />, 
          title: 'Math Helper', 
          description: 'Problem solving and math concepts',
          category: 'math',
          navigateTo: '/chat'
        },
        { 
          id: 'language', 
          icon: <Globe className="h-8 w-8" />, 
          title: 'Language Partner', 
          description: 'Practice and learn new languages',
          category: 'language',
          navigateTo: '/chat'
        },
        { 
          id: 'research', 
          icon: <Brain className="h-8 w-8" />, 
          title: 'Research Assistant', 
          description: 'Information gathering and analysis',
          category: 'research',
          navigateTo: '/chat'
        }
      ]
    },
    professional: {
      title: 'Professional & Career',
      roles: [
        { 
          id: 'career', 
          icon: <Briefcase className="h-8 w-8" />, 
          title: 'Career Coach', 
          description: 'Job search and career development guidance',
          category: 'career',
          navigateTo: '/career'
        },
        { 
          id: 'interview', 
          icon: <Presentation className="h-8 w-8" />, 
          title: 'Interview Coach', 
          description: 'Practice interviews and presentation skills',
          category: 'interview',
          navigateTo: '/chat'
        },
        { 
          id: 'business', 
          icon: <Target className="h-8 w-8" />, 
          title: 'Business Mentor', 
          description: 'Startup advice and business strategy',
          category: 'business',
          navigateTo: '/chat'
        },
        { 
          id: 'writer', 
          icon: <PenTool className="h-8 w-8" />, 
          title: 'Writing Assistant', 
          description: 'Creative writing and editing support',
          category: 'writer',
          navigateTo: '/writing'
        },
        { 
          id: 'financial', 
          icon: <BarChart className="h-8 w-8" />, 
          title: 'Financial Advisor', 
          description: 'Money management and investment advice',
          category: 'financial',
          navigateTo: '/chat'
        },
        { 
          id: 'productivity', 
          icon: <Clock className="h-8 w-8" />, 
          title: 'Productivity Coach', 
          description: 'Time management and organization',
          category: 'productivity',
          navigateTo: '/chat'
        }
      ]
    },
    health: {
      title: 'Health & Wellness',
      roles: [
        { 
          id: 'fitness', 
          icon: <Dumbbell className="h-8 w-8" />, 
          title: 'Fitness Trainer', 
          description: 'Workout plans and health guidance',
          category: 'fitness',
          navigateTo: '/fitness'
        },
        { 
          id: 'wellness', 
          icon: <Leaf className="h-8 w-8" />, 
          title: 'Wellness Coach', 
          description: 'Mental health and stress management',
          category: 'wellness',
          navigateTo: '/chat'
        },
        { 
          id: 'nutrition', 
          icon: <ChefHat className="h-8 w-8" />, 
          title: 'Nutrition Coach', 
          description: 'Diet planning and healthy eating tips',
          category: 'nutrition',
          navigateTo: '/chat'
        },
        { 
          id: 'meditation', 
          icon: <Heart className="h-8 w-8" />, 
          title: 'Meditation Guide', 
          description: 'Mindfulness and relaxation techniques',
          category: 'meditation',
          navigateTo: '/chat'
        }
      ]
    },
    creative: {
      title: 'Creative & Arts',
      roles: [
        { 
          id: 'art', 
          icon: <Palette className="h-8 w-8" />, 
          title: 'Art Mentor', 
          description: 'Creative techniques and artistic guidance',
          category: 'art',
          navigateTo: '/chat'
        },
        { 
          id: 'music', 
          icon: <Music className="h-8 w-8" />, 
          title: 'Music Teacher', 
          description: 'Instruments, theory, and composition',
          category: 'music',
          navigateTo: '/chat'
        },
        { 
          id: 'photography', 
          icon: <Camera className="h-8 w-8" />, 
          title: 'Photo Coach', 
          description: 'Photography techniques and editing',
          category: 'photography',
          navigateTo: '/chat'
        },
        { 
          id: 'creative', 
          icon: <Lightbulb className="h-8 w-8" />, 
          title: 'Idea Generator', 
          description: 'Brainstorming and creative problem solving',
          category: 'creative',
          navigateTo: '/chat'
        }
      ]
    },
    technology: {
      title: 'Technology & Skills',
      roles: [
        { 
          id: 'coding', 
          icon: <Code className="h-8 w-8" />, 
          title: 'Coding Mentor', 
          description: 'Programming help and best practices',
          category: 'coding',
          navigateTo: '/chat'
        },
        { 
          id: 'tech', 
          icon: <Wrench className="h-8 w-8" />, 
          title: 'Tech Support', 
          description: 'Computer troubleshooting and guidance',
          category: 'tech',
          navigateTo: '/chat'
        },
        { 
          id: 'gaming', 
          icon: <Gamepad2 className="h-8 w-8" />, 
          title: 'Gaming Buddy', 
          description: 'Game strategies and discussions',
          category: 'gaming',
          navigateTo: '/chat'
        }
      ]
    },
    personal: {
      title: 'Personal & Social',
      roles: [
        { 
          id: 'friend', 
          icon: <Smile className="h-8 w-8" />, 
          title: 'Chat Partner', 
          description: 'Friendly conversations and companionship',
          category: 'friend',
          navigateTo: '/chat'
        },
        { 
          id: 'social', 
          icon: <Users className="h-8 w-8" />, 
          title: 'Social Coach', 
          description: 'Communication and social skills',
          category: 'social',
          navigateTo: '/chat'
        },
        { 
          id: 'motivator', 
          icon: <Trophy className="h-8 w-8" />, 
          title: 'Life Coach', 
          description: 'Goal setting and personal development',
          category: 'motivator',
          navigateTo: '/chat'
        },
        { 
          id: 'travel', 
          icon: <Plane className="h-8 w-8" />, 
          title: 'Travel Planner', 
          description: 'Trip planning and destination guides',
          category: 'travel',
          navigateTo: '/chat'
        }
      ]
    }
  };
  
  const handleSelectRole = (role: any) => {
    setRole(role.category as any);
    setSelectedRole({
      category: role.category,
      name: role.title
    });
    navigate(role.navigateTo);
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
        
        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>
          
          {Object.entries(roleCategories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="mb-4">
                <h3 className="text-xl font-medium text-echoo-dark dark:text-white">
                  {category.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.roles.map((role) => (
                  <Button
                    key={role.id}
                    variant="outline"
                    className="bg-white/70 dark:bg-gray-800/50 hover:bg-echoo-light dark:hover:bg-gray-700 text-echoo-text dark:text-gray-200 border-echoo/20 dark:border-gray-700 h-auto py-6 justify-start transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    onClick={() => handleSelectRole(role)}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TabbedRoles;
