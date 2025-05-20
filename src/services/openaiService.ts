
interface OpenAIRequestOptions {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private apiKey: string | null = null;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private defaultModel = 'gpt-4o-mini';
  
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai-api-key', apiKey);
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai-api-key');
    }
    return this.apiKey;
  }
  
  hasApiKey(): boolean {
    return !!this.getApiKey();
  }
  
  async generateCompletion(options: OpenAIRequestOptions): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not set');
    }
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          messages: options.messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Error connecting to OpenAI');
      }
      
      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
