
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AIRole = 'friend' | 'tutor' | 'financial' | 'default';

interface RoleData {
  category: string;
  name: string;
}

interface RoleContextType {
  role: AIRole;
  setRole: (role: AIRole) => void;
  selectedRole: RoleData | null;
  setSelectedRole: (role: RoleData | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AIRole>('default');
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  return (
    <RoleContext.Provider value={{ role, setRole, selectedRole, setSelectedRole }}>
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
