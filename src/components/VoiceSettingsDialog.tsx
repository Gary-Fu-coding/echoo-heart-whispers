
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
import { Mic, MicOff } from 'lucide-react';
import { useVoice, VoiceSettings } from '@/contexts/VoiceContext';

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
