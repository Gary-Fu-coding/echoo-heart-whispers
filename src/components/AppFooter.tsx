
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppFooterProps {
  isChatGPTEnabled: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ isChatGPTEnabled }) => {
  const { t } = useLanguage();
  
  return (
    <footer className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
      <Sparkles size={12} className="text-echoo" />
      <span>{t('poweredBy')}</span>
      {isChatGPTEnabled && (
        <span className="ml-1 text-green-500">• ChatGPT Enabled</span>
      )}
    </footer>
  );
};

export default AppFooter;
