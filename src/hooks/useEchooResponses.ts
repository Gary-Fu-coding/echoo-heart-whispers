
import { useState } from 'react';

// Sample response templates for different conversation contexts
const GREETING_RESPONSES = [
  "Hello! It's so nice to connect with you today. How are you feeling?",
  "Hi there! I'm Echoo, your friendly companion. How's your day going so far?",
  "Welcome! I'm here and ready to listen. How are you feeling today?",
  "Hello, friend! It's wonderful to chat with you. How's your heart today?"
];

const FEELING_RESPONSES = {
  positive: [
    "That's wonderful to hear! I'm so glad you're feeling good today. What's contributed to that positive feeling?",
    "I'm happy you're doing well! Those positive moments are worth celebrating. Would you like to share more about what's going well?"
  ],
  neutral: [
    "Thanks for sharing how you're feeling. Some days are just... days, and that's perfectly okay. Is there anything on your mind you'd like to talk about?",
    "I appreciate you checking in. Is there anything specific you'd like to discuss or explore today?"
  ],
  negative: [
    "I'm sorry to hear you're not feeling your best. That's really tough. Would it help to talk about what's troubling you?",
    "I'm here for you during this difficult time. Remember that it's okay to not be okay sometimes. Would you like to share more about what's happening?"
  ]
};

const SUPPORT_RESPONSES = [
  "That sounds challenging. Remember that difficult feelings are part of being human, and you're not alone in this journey.",
  "I hear you, and what you're feeling is completely valid. Sometimes just acknowledging our emotions can help us process them better.",
  "Thank you for trusting me with this. It takes courage to be open about difficult experiences."
];

const ADVICE_RESPONSES = [
  "While I'm not a professional advisor, I can share that many find it helpful to take small steps when facing challenges. What's one tiny action that might feel manageable right now?",
  "Sometimes, giving yourself grace and permission to rest can be the wisest choice. What would genuine self-care look like for you today?",
  "Many find that writing down their thoughts helps create clarity. Have you tried journaling about this situation?"
];

const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What did the ocean say to the beach? Nothing, it just waved!",
  "How do you organize a space party? You planet!",
  "What's a computer's favorite snack? Microchips!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!"
];

export const useEchooResponses = () => {
  const [isTyping, setIsTyping] = useState(false);

  const getRandomResponse = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const analyzeMessage = (message: string) => {
    const lowercaseMsg = message.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/.test(lowercaseMsg)) {
      return 'greeting';
    }
    
    // Check for feeling expressions
    if (/how (are|do) you/.test(lowercaseMsg) || /feeling/.test(lowercaseMsg)) {
      return 'asking_feeling';
    }
    
    // Check for positive emotions
    if (/happy|good|great|wonderful|excellent|amazing|joy|excited|fantastic/.test(lowercaseMsg)) {
      return 'positive_emotion';
    }
    
    // Check for negative emotions
    if (/sad|bad|terrible|awful|depressed|anxious|worried|stressed|angry|upset|hurt/.test(lowercaseMsg)) {
      return 'negative_emotion';
    }
    
    // Check for advice requests
    if (/advice|suggest|help|guide|should i|what.+(do|should)/.test(lowercaseMsg)) {
      return 'advice_request';
    }
    
    // Check for joke requests
    if (/joke|funny|make me laugh|cheer me up/.test(lowercaseMsg)) {
      return 'joke_request';
    }
    
    // Default category
    return 'general';
  };

  const generateResponse = (message: string): Promise<string> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      
      // Analyze the message to determine the appropriate response
      const messageType = analyzeMessage(message);
      let response = '';
      
      switch(messageType) {
        case 'greeting':
          response = getRandomResponse(GREETING_RESPONSES);
          break;
        case 'asking_feeling':
          response = "I'm designed to be here for you, so I'm doing well! More importantly, how are YOU feeling?";
          break;
        case 'positive_emotion':
          response = getRandomResponse(FEELING_RESPONSES.positive);
          break;
        case 'negative_emotion':
          response = getRandomResponse(FEELING_RESPONSES.negative);
          break;
        case 'advice_request':
          response = getRandomResponse(ADVICE_RESPONSES);
          break;
        case 'joke_request':
          response = "Here's a little something to brighten your day: " + getRandomResponse(JOKES);
          break;
        default:
          // For first-time messages or general conversation
          if (message === 'How are you feeling today?') {
            response = "Thank you for asking! I'm here to focus on you. I'd love to know how you're feeling today?";
          } else if (message === "I'm having a difficult day") {
            response = "I'm sorry to hear you're having a tough day. Would you like to talk about what's happening? Sometimes sharing can help lighten the burden.";
          } else if (message === "Share something positive") {
            response = "A beautiful thought for you: Every day may not be good, but there's something good in every day. What's one small positive thing you've noticed recently?";
          } else if (message === "I need some advice") {
            response = "I'm happy to offer some perspective. What's on your mind that you'd like advice about?";
          } else if (message === "Tell me a joke") {
            response = "Here's a little something to brighten your day: " + getRandomResponse(JOKES);
          } else {
            response = "Thank you for sharing that with me. How does talking about this make you feel?";
          }
          break;
      }
      
      // Simulate typing delay for a more natural conversation feel
      const typingDelay = Math.min(1000 + response.length * 20, 3000);
      
      setTimeout(() => {
        setIsTyping(false);
        resolve(response);
      }, typingDelay);
    });
  };

  return {
    generateResponse,
    isTyping
  };
};
