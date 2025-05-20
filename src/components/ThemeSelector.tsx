
import React from 'react';
import { useUITheme, UIThemeType } from '@/contexts/UIThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Palette, Smile, Accessibility, Zap, FlowerIcon, Heart } from 'lucide-react';

interface ThemeOptionProps {
  theme: UIThemeType;
  label: string;
  icon: React.ReactNode;
  description: string;
  currentTheme: UIThemeType;
  onSelect: (theme: UIThemeType) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  theme, 
  label, 
  icon, 
  description,
  currentTheme,
  onSelect
}) => {
  const isActive = currentTheme === theme;
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:scale-105 ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(theme)}
    >
      <CardContent className="p-6 flex flex-col items-center gap-3">
        <div className={`p-3 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          {icon}
        </div>
        <h3 className="font-medium text-lg">{label}</h3>
        <p className="text-sm text-center text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const ThemeSelector = () => {
  const { uiTheme, setUITheme } = useUITheme();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  
  const handleSelectTheme = (theme: UIThemeType) => {
    setUITheme(theme);
    toast({
      title: "Theme Updated",
      description: `UI has been updated to the ${theme} theme.`,
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-echoo-dark dark:text-gray-300 hover:text-echoo"
          title="Change Interface Theme"
        >
          <Palette size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Choose your interface style
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          <ThemeOption
            theme="default"
            label="Default"
            icon={<Palette size={24} />}
            description="Standard interface with balanced design for all users"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
          
          <ThemeOption
            theme="elderly"
            label="Accessible"
            icon={<Accessibility size={24} />}
            description="Larger text, higher contrast, and simpler layout for better readability"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
          
          <ThemeOption
            theme="kids"
            label="Kids"
            icon={<Smile size={24} />}
            description="Colorful, playful interface with fun animations and rounded corners"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
          
          <ThemeOption
            theme="feminine"
            label="Soft"
            icon={<Heart size={24} />}
            description="Elegant interface with soft colors and smooth curves"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
          
          <ThemeOption
            theme="masculine"
            label="Professional"
            icon={<Zap size={24} />}
            description="Clean, straightforward interface with bold colors"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
          
          <ThemeOption
            theme="cyber"
            label="Cyber"
            icon={<Zap size={24} />}
            description="High contrast futuristic interface with neon colors"
            currentTheme={uiTheme}
            onSelect={handleSelectTheme}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSelector;
