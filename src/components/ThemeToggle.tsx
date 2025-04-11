
import React, { useEffect, useState } from 'react';
import { Moon, Sun, Computer } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ToggleGroup 
      type="single" 
      value={theme} 
      onValueChange={(value) => value && changeTheme(value as Theme)}
      variant="glass"
      size="sm"
      className="luma-glass"
    >
      <ToggleGroupItem value="light" aria-label="Light mode" className="px-2">
        <Sun size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System theme" className="px-2">
        <Computer size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode" className="px-2">
        <Moon size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeToggle;
