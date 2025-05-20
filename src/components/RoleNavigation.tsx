
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap } from 'lucide-react';

interface RoleNavigationProps {
  role: string;
  messages: Array<any>;
  tutorSubject?: string;
  tutorGrade?: string;
}

const RoleNavigation: React.FC<RoleNavigationProps> = ({ 
  role, 
  messages, 
  tutorSubject, 
  tutorGrade 
}) => {
  const navigate = useNavigate();
  
  if (role === 'default' && messages.length === 0) {
    return (
      <div className="mt-4 mb-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 max-w-md text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Want to customize how Echoo helps you?
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/roles')}
          className="gap-2 text-echoo"
        >
          <Users size={16} />
          Choose AI Role
        </Button>
      </div>
    );
  }
  
  if (role === 'tutor' && tutorSubject && tutorGrade) {
    return (
      <div className="mt-4 mb-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 max-w-md text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Learning {tutorSubject} at {tutorGrade} level
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/tutor')}
          className="gap-2 text-echoo"
        >
          <GraduationCap size={16} />
          Change Subject or Level
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RoleNavigation;
