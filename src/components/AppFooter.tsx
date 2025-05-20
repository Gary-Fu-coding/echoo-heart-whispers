
import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/contexts/VoiceContext';
import VoiceSettingsDialog from './VoiceSettingsDialog';

interface AppFooterProps {
  isChatGPTEnabled: boolean;
  isSpeaking?: boolean;
}

const AppFooter: React.FC<AppFooterProps> = ({ isChatGPTEnabled, isSpeaking = false }) => {
  const { t } = useLanguage();
  const { voiceSettings } = useVoice();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  return (
    <footer className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
      <Sparkles size={12} className="text-echoo" />
      <span>{t('poweredBy')}</span>
      {isChatGPTEnabled && (
        <span className="ml-1 text-green-500">• ChatGPT Enabled</span>
      )}
      
      {voiceSettings.enabled && (
        <Button 
          variant="link" 
          size="sm" 
          className={`p-0 h-auto ml-1 ${isSpeaking ? 'text-echoo-accent' : 'text-gray-500'}`} 
          onClick={() => setShowVoiceSettings(true)}
        >
          {isSpeaking ? (
            <Volume2 size={14} className="animate-pulse" />
          ) : (
            <Volume2 size={14} />
          )}
        </Button>
      )}
      {!voiceSettings.enabled && (
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 h-auto ml-1 text-gray-500"
          onClick={() => setShowVoiceSettings(true)}
        >
          <VolumeX size={14} />
        </Button>
      )}
      
      <VoiceSettingsDialog 
        open={showVoiceSettings} 
        onOpenChange={setShowVoiceSettings} 
      />
    </footer>
  );
};

export default AppFooter;
