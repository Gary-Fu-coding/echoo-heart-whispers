
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
    // Clean the API key of any potential whitespace or hidden characters
    this.apiKey = apiKey.trim().replace(/\s/g, '');
    localStorage.setItem('openai-api-key', this.apiKey);
    
    console.log('🔧 API Key Processing Details:');
    console.log('📏 Original length:', apiKey.length);
    console.log('📏 Cleaned length:', this.apiKey.length);
    console.log('🔍 First 20 chars:', this.apiKey.substring(0, 20) + '...');
    console.log('🔍 Last 10 chars:', '...' + this.apiKey.substring(this.apiKey.length - 10));
    console.log('✅ Has whitespace removed:', apiKey !== this.apiKey);
    
    // Enhanced format validation
    if (this.apiKey.startsWith('sk-proj-')) {
      console.log('✅ Correct project-based key format detected');
    } else if (this.apiKey.startsWith('sk-')) {
      console.log('⚠️  Legacy key format detected (should still work)');
    } else {
      console.log('❌ Invalid key format - should start with "sk-" or "sk-proj-"');
    }
    
    // Check for common issues
    if (this.apiKey.includes(' ')) {
      console.log('⚠️  Warning: API key contains spaces');
    }
    if (this.apiKey.includes('\n') || this.apiKey.includes('\r')) {
      console.log('⚠️  Warning: API key contains line breaks');
    }
    
    console.log('💾 API key saved to localStorage');
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai-api-key');
      if (this.apiKey) {
        console.log('🔄 Retrieved API key from localStorage');
        console.log('📏 Retrieved key length:', this.apiKey.length);
      }
    }
    return this.apiKey;
  }
  
  hasApiKey(): boolean {
    const key = this.getApiKey();
    console.log('🔍 API key availability check:', !!key);
    return !!key;
  }
  
  // Method to clear and reset API key
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('openai-api-key');
    console.log('🗑️  API key cleared from storage');
  }
  
  // Test connection method
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return { success: false, error: 'No API key available' };
    }
    
    try {
      console.log('🧪 Testing OpenAI connection...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5
        })
      });
      
      if (response.ok) {
        console.log('✅ OpenAI connection test successful');
        return { success: true };
      } else {
        const errorText = await response.text();
        console.log('❌ OpenAI connection test failed:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.log('❌ OpenAI connection test error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  async generateCompletion(options: OpenAIRequestOptions): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      console.error('❌ No API key available');
      throw new Error('API key not set');
    }
    
    console.log('🚀 OpenAI API Request Starting');
    console.log('🔑 Key validation:');
    console.log('  - Length:', apiKey.length);
    console.log('  - Starts with sk-:', apiKey.startsWith('sk-'));
    console.log('  - Format check:', apiKey.startsWith('sk-proj-') ? 'Project key' : 'Legacy key');
    console.log('  - Contains spaces:', apiKey.includes(' '));
    console.log('  - First 15 chars:', apiKey.substring(0, 15) + '...');
    
    const requestBody = {
      model: options.model || this.defaultModel,
      messages: options.messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
    };
    
    console.log('📤 Request payload:');
    console.log('  - Model:', requestBody.model);
    console.log('  - Messages count:', requestBody.messages.length);
    console.log('  - Temperature:', requestBody.temperature);
    console.log('  - Max tokens:', requestBody.max_tokens);
    
    try {
      console.log('🌐 Making fetch request to:', this.apiUrl);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response received:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📄 Raw response length:', responseText.length);
      
      if (!response.ok) {
        console.error('❌ OpenAI API Error Details:');
        console.error('Status:', response.status, response.statusText);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('📋 Full error response:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
            console.error('🔍 Error analysis:');
            console.error('  - Type:', errorData.error.type);
            console.error('  - Code:', errorData.error.code);
            console.error('  - Message:', errorData.error.message);
            
            // Enhanced error handling with specific guidance
            if (errorData.error.code === 'invalid_api_key') {
              console.error('🔑 INVALID API KEY DETECTED');
              console.error('📋 Troubleshooting steps:');
              console.error('  1. Verify key was copied completely from OpenAI dashboard');
              console.error('  2. Check for extra spaces or characters');
              console.error('  3. Ensure key starts with sk- or sk-proj-');
              console.error('  4. Try generating a new key');
              errorMessage += '\n\n🔧 Try these steps:\n1. Go to https://platform.openai.com/api-keys\n2. Generate a completely new API key\n3. Copy it carefully without extra spaces\n4. Paste it in the API key dialog';
            } else if (errorData.error.code === 'insufficient_quota') {
              console.error('💳 QUOTA EXCEEDED');
              errorMessage += '\n\n💳 Your OpenAI account has insufficient quota. Please add billing at https://platform.openai.com/account/billing';
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          console.error('Raw error text:', responseText);
        }
        
        throw new Error(errorMessage);
      }
      
      const data: OpenAIResponse = JSON.parse(responseText);
      console.log('✅ Successful OpenAI response');
      console.log('📊 Usage stats:', data.usage);
      console.log('💬 Response preview:', data.choices[0].message.content.substring(0, 100) + '...');
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('💥 Critical error in generateCompletion:');
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Full error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network connectivity issue detected');
      }
      
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
