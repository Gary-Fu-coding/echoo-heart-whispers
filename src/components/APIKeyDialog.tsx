
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { openaiService } from '@/services/openaiService';
import { Key, Eye, EyeOff, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APIKeyDialog: React.FC<APIKeyDialogProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Load API key if exists
  useEffect(() => {
    const savedKey = openaiService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [open]);

  const handleSave = () => {
    try {
      if (apiKey.trim()) {
        openaiService.setApiKey(apiKey.trim());
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been saved.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: "Please enter a valid API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Temporarily set the API key for testing
      openaiService.setApiKey(apiKey.trim());
      const result = await openaiService.testConnection();

      if (result.success) {
        setConnectionStatus('success');
        toast({
          title: "Connection Successful! 🎉",
          description: "Your OpenAI API key is working correctly.",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key size={18} className="text-echoo" /> 
            OpenAI API Key
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable ChatGPT integration. Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-... or sk-proj-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>

          <Button
            onClick={handleTestConnection}
            disabled={isTestingConnection || !apiKey.trim()}
            className="w-full"
            variant="outline"
          >
            {isTestingConnection ? (
              <>
                <TestTube size={16} className="mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <TestTube size={16} className="mr-2" />
                Test Connection
                {connectionStatus === 'success' && <CheckCircle size={16} className="ml-2 text-green-500" />}
                {connectionStatus === 'error' && <XCircle size={16} className="ml-2 text-red-500" />}
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Don't have an API key? Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-echoo underline">OpenAI's website</a>.
        </p>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyDialog;
