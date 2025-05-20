
import { useState } from 'react';
import { openaiService } from '@/services/openaiService';
import { elevenLabsService } from '@/services/elevenLabsService';
import { useToast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/ChatMessage';

// Define a type for ChatGPT message roles
type ChatGPTRole = 'user' | 'assistant' | 'system';

export const useChatGPT = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  
  const generateResponse = async (
    userMessage: string, 
    chatHistory: Message[] = [],
    voiceOptions?: {
      enabled: boolean;
      voiceId: string;
      model: string;
      apiKey: string | null;
    }
  ): Promise<Message | null> => {
    if (!openaiService.hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Format messages for OpenAI API
      const messages = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant' as ChatGPTRole,
        content: msg.content
      }));
      
      // Add the current user message
      messages.push({
        role: 'user' as ChatGPTRole,
        content: userMessage
      });
      
      // Add system message if this is the beginning of the conversation
      if (chatHistory.length === 0) {
        messages.unshift({
          role: 'system' as ChatGPTRole,
          content: 'You are a helpful, friendly assistant named Echoo. Provide thoughtful, accurate responses.'
        });
      }
      
      // Get response from OpenAI
      const responseContent = await openaiService.generateCompletion({
        messages,
        temperature: 0.7
      });
      
      // Create message object
      const message: Message = {
        id: uuidv4(),
        content: responseContent,
        sender: 'echoo',
        timestamp: new Date()
      };
      
      // Convert text to speech if voice is enabled
      if (voiceOptions?.enabled && voiceOptions.apiKey) {
        setIsSpeaking(true);
        const audioBuffer = await elevenLabsService.textToSpeech({
          text: responseContent,
          voiceId: voiceOptions.voiceId,
          modelId: voiceOptions.model,
          apiKey: voiceOptions.apiKey
        });
        
        if (audioBuffer) {
          elevenLabsService.playAudio(audioBuffer);
        }
        setIsSpeaking(false);
      }
      
      return message;
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateResponse,
    isGenerating,
    isSpeaking
  };
};
