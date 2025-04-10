
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PersonalityMode = 'comfort' | 'wisdom' | 'fun' | 'motivation' | 'default';

interface PersonalityContextType {
  mode: PersonalityMode;
  setMode: (mode: PersonalityMode) => void;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

export const PersonalityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PersonalityMode>('default');

  return (
    <PersonalityContext.Provider value={{ mode, setMode }}>
      {children}
    </PersonalityContext.Provider>
  );
};

export const usePersonality = (): PersonalityContextType => {
  const context = useContext(PersonalityContext);
  if (context === undefined) {
    throw new Error('usePersonality must be used within a PersonalityProvider');
  }
  return context;
};
