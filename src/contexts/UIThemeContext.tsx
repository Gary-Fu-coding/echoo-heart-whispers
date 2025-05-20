import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// Define the available UI theme options
export type UIThemeType = 'default' | 'kids' | 'elderly' | 'feminine' | 'masculine' | 'cyber';

interface UIThemeContextType {
  uiTheme: UIThemeType;
  setUITheme: (theme: UIThemeType) => void;
}

const UIThemeContext = createContext<UIThemeContextType>({
  uiTheme: 'default',
  setUITheme: () => {},
});

export const useUITheme = () => useContext(UIThemeContext);

export const UIThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the saved UI theme from localStorage or default to 'default'
  const [uiTheme, setUITheme] = useState<UIThemeType>('default');
  const { setTheme } = useTheme();
  
  // Load the saved UI theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('echoo-ui-theme') as UIThemeType | null;
    if (savedTheme) {
      setUITheme(savedTheme);
    }
  }, []);
  
  // Apply theme classes to the document body when UI theme changes
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove(
      'theme-kids',
      'theme-elderly',
      'theme-feminine',
      'theme-masculine',
      'theme-cyber'
    );
    
    // Apply the appropriate theme class
    if (uiTheme !== 'default') {
      document.documentElement.classList.add(`theme-${uiTheme}`);
    }
    
    // Save the theme to localStorage
    localStorage.setItem('echoo-ui-theme', uiTheme);
    
  }, [uiTheme]);
  
  // Function to update the UI theme
  const handleSetUITheme = (theme: UIThemeType) => {
    setUITheme(theme);
    
    // Some themes work better with specific light/dark modes
    if (theme === 'cyber') {
      setTheme('dark');
    } else if (theme === 'kids' || theme === 'elderly') {
      setTheme('light');
    }
    // For others, we keep the user's choice of light/dark
  };
  
  return (
    <UIThemeContext.Provider value={{ uiTheme, setUITheme: handleSetUITheme }}>
      {children}
    </UIThemeContext.Provider>
  );
};
