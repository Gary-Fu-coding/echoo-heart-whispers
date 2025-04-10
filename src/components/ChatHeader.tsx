
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white/50 backdrop-blur-sm rounded-t-2xl">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-echoo">
          <AvatarImage src="/echoo-avatar.png" alt="Echoo" />
          <AvatarFallback className="bg-echoo text-white">EC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-echoo-dark">Echoo</h2>
          <p className="text-xs text-echoo-text/70">Your heart's companion</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="text-echoo-dark hover:text-echoo hover:bg-echoo-light">
          <Info size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="text-echoo-dark hover:text-echoo hover:bg-echoo-light">
          <Settings size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
