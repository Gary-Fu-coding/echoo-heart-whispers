
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useVoice, VoiceSettings } from '@/contexts/VoiceContext';
import { elevenLabsService } from '@/services/elevenLabsService';
import { useToast } from '@/hooks/use-toast';

interface VoiceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VoiceSettingsDialog: React.FC<VoiceSettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { voiceSettings, updateVoiceSettings, apiKey, setApiKey } = useVoice();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  
  const voices = [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female)' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Male)' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Female)' },
    { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris (Male)' },
    { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Female)' }
  ];
  
  const models = [
    { id: 'eleven_multilingual_v2', name: 'Multilingual v2 (High Quality)' },
    { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5 (Fast)' }
  ];
  
  const handleSave = () => {
    if (localApiKey !== apiKey) {
      setApiKey(localApiKey);
    }
    onOpenChange(false);
  };

  const handleTestConnection = async () => {
    if (!localApiKey.trim()) {
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
      const result = await elevenLabsService.testConnection(localApiKey.trim());

      if (result.success) {
        setConnectionStatus('success');
        toast({
          title: "Connection Successful! 🎉",
          description: "Your ElevenLabs API key is working correctly.",
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

  const handleTestVoice = async () => {
    if (!localApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingVoice(true);

    try {
      const audioBuffer = await elevenLabsService.textToSpeech({
        text: "Hello! This is a test of the ElevenLabs voice synthesis. Your voice settings are working correctly!",
        voiceId: voiceSettings.voiceId,
        modelId: voiceSettings.model,
        apiKey: localApiKey.trim()
      });

      if (audioBuffer) {
        elevenLabsService.playAudio(arrayBuffer);
        toast({
          title: "Voice Test Successful! 🎤",
          description: "You should hear the test message playing now.",
        });
      } else {
        toast({
          title: "Voice Test Failed",
          description: "Could not generate test audio. Check your API key and settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Voice Test Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsTestingVoice(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Settings</DialogTitle>
          <DialogDescription>
            Configure the AI voice assistant. You'll need an ElevenLabs API key.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="voice-enabled">Enable Voice</Label>
            <Switch 
              id="voice-enabled"
              checked={voiceSettings.enabled}
              onCheckedChange={(checked) => updateVoiceSettings({ enabled: checked })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-key">ElevenLabs API Key</Label>
            <Input 
              id="api-key"
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your ElevenLabs API key"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !localApiKey.trim()}
              variant="outline"
              size="sm"
            >
              {isTestingConnection ? (
                <>
                  <TestTube size={14} className="mr-1 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube size={14} className="mr-1" />
                  Test Key
                  {connectionStatus === 'success' && <CheckCircle size={14} className="ml-1 text-green-500" />}
                  {connectionStatus === 'error' && <XCircle size={14} className="ml-1 text-red-500" />}
                </>
              )}
            </Button>

            <Button
              onClick={handleTestVoice}
              disabled={isTestingVoice || !localApiKey.trim()}
              variant="outline"
              size="sm"
            >
              {isTestingVoice ? (
                <>
                  <Mic size={14} className="mr-1 animate-pulse" />
                  Testing...
                </>
              ) : (
                <>
                  <Mic size={14} className="mr-1" />
                  Test Voice
                </>
              )}
            </Button>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="voice">Voice</Label>
            <Select 
              value={voiceSettings.voiceId} 
              onValueChange={(value) => updateVoiceSettings({ voiceId: value })}
            >
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map(voice => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="model">Voice Model</Label>
            <Select 
              value={voiceSettings.model} 
              onValueChange={(value) => updateVoiceSettings({ model: value })}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettingsDialog;
