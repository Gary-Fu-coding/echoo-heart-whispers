
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { Book, BarChart, Smile } from 'lucide-react';

const Roles = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  
  const aiRoles = [
    { 
      id: 'tutor', 
      icon: <Book className="h-8 w-8" />, 
      title: 'Tutor', 
      description: 'Learn and grow with educational guidance' 
    },
    { 
      id: 'financial', 
      icon: <BarChart className="h-8 w-8" />, 
      title: 'Financial Advisor', 
      description: 'Get advice on financial matters' 
    },
    { 
      id: 'friend', 
      icon: <Smile className="h-8 w-8" />, 
      title: 'AI Friend', 
      description: 'Chat and connect with a friendly companion' 
    }
  ];
  
  const handleSelectRole = (roleId: 'friend' | 'tutor' | 'financial') => {
    setRole(roleId);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-echoo-dark dark:text-white mb-6">
          Choose Your AI's Role
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {aiRoles.map((role) => (
            <Button
              key={role.id}
              variant="outline"
              className="bg-white/70 dark:bg-gray-800/50 hover:bg-echoo-light dark:hover:bg-gray-700 text-echoo-text dark:text-gray-200 border-echoo/20 dark:border-gray-700 h-auto py-4 justify-start"
              onClick={() => handleSelectRole(role.id as any)}
            >
              <div className="flex items-center gap-4">
                <div className="text-echoo dark:text-echoo-light">
                  {role.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-lg">{role.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{role.description}</div>
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
