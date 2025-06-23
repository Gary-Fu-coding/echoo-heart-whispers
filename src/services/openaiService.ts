
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
    this.apiKey = apiKey.trim();
    localStorage.setItem('openai-api-key', this.apiKey);
    console.log('OpenAI API key set, length:', this.apiKey.length);
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai-api-key');
    }
    return this.apiKey;
  }
  
  hasApiKey(): boolean {
    const key = this.getApiKey();
    console.log('Checking API key availability:', !!key, key ? `Length: ${key.length}` : 'No key');
    return !!key;
  }
  
  async generateCompletion(options: OpenAIRequestOptions): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not set');
    }
    
    console.log('Making OpenAI request with model:', options.model || this.defaultModel);
    console.log('API key starts with:', apiKey.substring(0, 7) + '...');
    
    try {
      const requestBody = {
        model: options.model || this.defaultModel,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          console.log('Error data:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
            
            // Provide specific guidance based on error type
            if (errorData.error.code === 'insufficient_quota') {
              errorMessage += '\n\nThis suggests your OpenAI account has no available credits. Please check your OpenAI dashboard at https://platform.openai.com/usage';
            } else if (errorData.error.code === 'invalid_api_key') {
              errorMessage += '\n\nYour API key appears to be invalid. Please generate a new one at https://platform.openai.com/api-keys';
            } else if (errorData.error.code === 'model_not_found') {
              errorMessage += '\n\nThe model specified is not available for your account.';
            }
          }
        } catch (parseErr) {
          console.log('Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }
      
      const data: OpenAIResponse = JSON.parse(responseText);
      console.log('Successful response:', data);
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Detailed error in generateCompletion:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
