
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AIRole = 'friend' | 'tutor' | 'financial' | 'default';

interface RoleContextType {
  role: AIRole;
  setRole: (role: AIRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AIRole>('default');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
