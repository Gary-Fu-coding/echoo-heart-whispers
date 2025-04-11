
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Volume2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

const ChatHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { role } = useRole();

  return (
    <div className="flex items-center justify-between p-4 border-b border-echoo/10 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white">
          <Volume2 size={16} className="animate-pulse-soft" />
        </div>
        <h1 className="text-xl font-semibold text-echoo-dark dark:text-white">Echoo</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/roles')}
          title={t('changeRole')}
          className="text-echoo-dark dark:text-gray-300 hover:text-echoo"
        >
          <Users size={20} />
        </Button>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ChatHeader;
