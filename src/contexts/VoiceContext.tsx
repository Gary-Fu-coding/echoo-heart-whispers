
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type VoiceSettings = {
  enabled: boolean;
  voiceId: string;
  model: string;
}

interface VoiceContextType {
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const defaultVoiceSettings: VoiceSettings = {
  enabled: false,
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice
  model: 'eleven_multilingual_v2'
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('echoo-voice-settings');
    return saved ? JSON.parse(saved) : defaultVoiceSettings;
  });
  
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    return localStorage.getItem('elevenlabs-api-key');
  });
  
  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    const updated = { ...voiceSettings, ...settings };
    setVoiceSettings(updated);
    localStorage.setItem('echoo-voice-settings', JSON.stringify(updated));
  };
  
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('elevenlabs-api-key', key);
  };

  return (
    <VoiceContext.Provider value={{ voiceSettings, updateVoiceSettings, apiKey, setApiKey }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
