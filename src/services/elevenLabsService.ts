
interface TTSOptions {
  text: string;
  voiceId: string;
  modelId: string;
  apiKey: string;
}

export class ElevenLabsService {
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  async testConnection(apiKey: string): Promise<{ success: boolean; error?: string }> {
    if (!apiKey) {
      return { success: false, error: 'No API key provided' };
    }
    
    try {
      console.log('🧪 Testing ElevenLabs connection...');
      
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ ElevenLabs connection successful:', userData);
        return { success: true };
      } else {
        const errorText = await response.text();
        console.log('❌ ElevenLabs connection failed:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.log('❌ ElevenLabs connection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  async textToSpeech({ text, voiceId, modelId, apiKey }: TTSOptions): Promise<ArrayBuffer | null> {
    if (!apiKey) {
      console.error('❌ ElevenLabs API key not set');
      return null;
    }
    
    console.log('🎤 ElevenLabs TTS Request:');
    console.log('  - Text length:', text.length);
    console.log('  - Voice ID:', voiceId);
    console.log('  - Model ID:', modelId);
    console.log('  - API Key length:', apiKey.length);
    
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
      
      console.log('📥 ElevenLabs TTS Response:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ElevenLabs TTS Error:', errorText);
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ ElevenLabs TTS successful, audio size:', arrayBuffer.byteLength, 'bytes');
      return arrayBuffer;
    } catch (error) {
      console.error('💥 Error generating speech:', error);
      return null;
    }
  }
  
  playAudio(arrayBuffer: ArrayBuffer): HTMLAudioElement {
    console.log('🔊 Playing audio, size:', arrayBuffer.byteLength, 'bytes');
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      console.log('🔚 Audio playback ended');
      URL.revokeObjectURL(url);
    };
    
    audio.onerror = (error) => {
      console.error('🔊 Audio playback error:', error);
    };
    
    audio.play().then(() => {
      console.log('▶️ Audio playback started successfully');
    }).catch((error) => {
      console.error('▶️ Audio playback failed:', error);
    });
    
    return audio;
  }
}

export const elevenLabsService = new ElevenLabsService();
