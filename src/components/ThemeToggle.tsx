
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // On component mount, check for stored theme or system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('system');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark' || 
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <Toggle 
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      className="rounded-full w-9 h-9 p-0 bg-transparent text-foreground hover:text-primary hover:bg-muted"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
    </Toggle>
  );
};

export default ThemeToggle;
