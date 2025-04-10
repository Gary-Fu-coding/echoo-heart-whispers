
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border/30 bg-card/50 backdrop-blur-sm rounded-t-2xl transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-echoo">
          <AvatarImage src="/echoo-avatar.png" alt="Echoo" />
          <AvatarFallback className="bg-echoo text-white">EC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-echoo-dark dark:text-primary">Echoo</h2>
          <p className="text-xs text-echoo-text/70 dark:text-foreground/70">Your heart's companion</p>
        </div>
      </div>
      <div className="flex gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-echoo-dark dark:text-foreground hover:text-primary hover:bg-muted">
          <Info size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-echoo-dark dark:text-foreground hover:text-primary hover:bg-muted">
          <Settings size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
