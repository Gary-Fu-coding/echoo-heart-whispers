
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
    console.log('✅ OpenAI API key saved successfully');
    console.log('🔑 Key format:', this.apiKey.substring(0, 10) + '...');
    console.log('📏 Key length:', this.apiKey.length);
    
    // Test the key format
    if (this.apiKey.startsWith('sk-proj-')) {
      console.log('✅ Key format is correct (project-based key)');
    } else if (this.apiKey.startsWith('sk-')) {
      console.log('⚠️  Using legacy key format (should still work)');
    } else {
      console.log('❌ Invalid key format - should start with sk-');
    }
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai-api-key');
      if (this.apiKey) {
        console.log('🔄 Retrieved API key from localStorage');
      }
    }
    return this.apiKey;
  }
  
  hasApiKey(): boolean {
    const key = this.getApiKey();
    console.log('🔍 Checking API key availability:', !!key);
    if (key) {
      console.log('📏 Retrieved key length:', key.length);
      console.log('🔑 Key starts with:', key.substring(0, 10) + '...');
    }
    return !!key;
  }
  
  async generateCompletion(options: OpenAIRequestOptions): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      console.error('❌ No API key available');
      throw new Error('API key not set');
    }
    
    console.log('🚀 Starting OpenAI request...');
    console.log('🤖 Model:', options.model || this.defaultModel);
    console.log('🔑 Using key (first 15 chars):', apiKey.substring(0, 15) + '...');
    console.log('📊 Request details:', {
      model: options.model || this.defaultModel,
      messageCount: options.messages.length,
      temperature: options.temperature || 0.7,
      maxTokens: options.max_tokens || 1000
    });
    
    try {
      const requestBody = {
        model: options.model || this.defaultModel,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      };
      
      console.log('📤 Sending request to OpenAI API...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      const responseText = await response.text();
      console.log('📄 Raw response length:', responseText.length);
      
      if (!response.ok) {
        console.error('❌ OpenAI API Error Response:');
        console.error('Status:', response.status, response.statusText);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('Error details:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
            
            // Provide specific guidance based on error type
            if (errorData.error.code === 'insufficient_quota') {
              console.error('💳 Quota issue detected');
              errorMessage += '\n\n🚨 Your OpenAI account has insufficient quota. Since you showed $0/$5 usage, this might be a temporary issue. Try again in a few minutes, or check if your account needs to be activated for API access.';
            } else if (errorData.error.code === 'invalid_api_key') {
              console.error('🔑 Invalid API key detected');
              errorMessage += '\n\n🔑 Your API key appears to be invalid. Please double-check you copied the entire key correctly from https://platform.openai.com/api-keys';
            } else if (errorData.error.code === 'model_not_found') {
              console.error('🤖 Model not found');
              errorMessage += '\n\n🤖 The model specified is not available for your account.';
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          console.error('Raw error response:', responseText);
        }
        
        throw new Error(errorMessage);
      }
      
      const data: OpenAIResponse = JSON.parse(responseText);
      console.log('✅ Successful OpenAI response received');
      console.log('📊 Usage:', data.usage);
      console.log('💬 Response length:', data.choices[0].message.content.length);
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('💥 Critical error in generateCompletion:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network error - check your internet connection');
      }
      
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
