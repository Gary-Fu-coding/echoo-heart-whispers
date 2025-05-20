
interface TTSOptions {
  text: string;
  voiceId: string;
  modelId: string;
  apiKey: string;
}

export class ElevenLabsService {
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  async textToSpeech({ text, voiceId, modelId, apiKey }: TTSOptions): Promise<ArrayBuffer | null> {
    if (!apiKey) {
      console.error('ElevenLabs API key not set');
      return null;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }
  
  playAudio(arrayBuffer: ArrayBuffer): HTMLAudioElement {
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
    
    audio.play();
    return audio;
  }
}

export const elevenLabsService = new ElevenLabsService();
