import { useState } from 'react';
import { usePersonality } from '@/contexts/PersonalityContext';
import { useRole } from '@/contexts/RoleContext';

// Sample response templates for different conversation contexts
const GREETING_RESPONSES = {
  default: [
    "Hello! It's so nice to connect with you today. How are you feeling?",
    "Hi there! I'm Echoo, your friendly companion. How's your day going so far?",
    "Welcome! I'm here and ready to listen. How are you feeling today?",
    "Hello, friend! It's wonderful to chat with you. How's your heart today?"
  ],
  comfort: [
    "Hello! I'm here for you. How are you feeling today?",
    "Hi there! I'm your comfort companion. How's your day going so far?",
    "Welcome! I'm ready to listen and provide support. How are you feeling today?",
    "Hello, friend! It's wonderful to chat with you. How's your heart today?"
  ],
  wisdom: [
    "Greetings. I'm ready to engage in thoughtful conversation. What's on your mind?",
    "Hello. I'm here to offer insights and perspective. How's your day progressing?",
    "Welcome. I'm prepared to explore complex topics with you. How are you feeling today?",
    "Hello, friend. It's a pleasure to connect with you. What's on your heart today?"
  ],
  fun: [
    "Hey there! Ready for some fun chat time? What's happening?",
    "Hi there! I'm your fun companion. How's your day going so far?",
    "Welcome! I'm ready to make you laugh. How are you feeling today?",
    "Hello, friend! It's wonderful to chat with you. How's your heart today?"
  ],
  motivation: [
    "Hello! Let's make today amazing! What are you working towards?",
    "Hi there! I'm your motivation companion. How's your day going so far?",
    "Welcome! I'm ready to help you achieve your goals. How are you feeling today?",
    "Hello, friend! It's wonderful to chat with you. How's your heart today?"
  ]
};

// Add role-based responses
const ROLE_SPECIFIC_RESPONSES = {
  tutor: {
    greeting: [
      "Hello, I'm your AI tutor! What would you like to learn about today?",
      "Welcome to our learning session! What subject shall we explore?",
      "Hi there! I'm ready to help you learn. What topic are you interested in?"
    ],
    advice: [
      "From an educational perspective, it might help to break this down into smaller concepts. Would you like me to explain step by step?",
      "Learning new things takes time and practice. Let's approach this systematically. What's the first part you'd like to understand better?",
      "Many students find it helpful to connect new information to things they already know. Can you think of any similar concepts you're familiar with?"
    ]
  },
  career: {
    greeting: [
      "Hello! I'm your career coach. Ready to advance your professional journey?",
      "Hi there! I'm here to help with all your career goals. What's on your mind?",
      "Welcome! Let's work together to boost your career. What would you like to focus on?"
    ],
    advice: [
      "In terms of career development, I'd recommend focusing on both your immediate goals and long-term vision. What's your next career milestone?",
      "Professional growth often comes from stepping outside your comfort zone. What new skills or experiences could you pursue?",
      "Networking and building relationships are crucial for career success. How are you currently building your professional network?"
    ]
  },
  writer: {
    greeting: [
      "Hello, fellow writer! Ready to craft some amazing content together?",
      "Hi there! I'm your writing assistant. What writing project can I help you with?",
      "Welcome! Let's bring your ideas to life through powerful writing. What are you working on?"
    ],
    advice: [
      "Great writing often comes from authentic voice and clear structure. What's the main message you want to convey?",
      "Consider your audience - who are you writing for and what do they need to know? This can guide your tone and approach.",
      "Sometimes the best writing emerges from multiple drafts. Don't worry about perfection in your first attempt - focus on getting your ideas down first."
    ]
  },
  fitness: {
    greeting: [
      "Hey there, fitness enthusiast! Ready to crush your health goals?",
      "Hi! I'm your personal fitness trainer. What are your fitness objectives today?",
      "Welcome! Let's get you moving towards a healthier, stronger you. What's your current fitness focus?"
    ],
    advice: [
      "Consistency is key in fitness - small daily actions create big results over time. What's one healthy habit you could start today?",
      "Listen to your body and progress gradually. It's better to do sustainable workouts than to burn out quickly. How are you feeling physically right now?",
      "Fitness isn't just about exercise - nutrition, sleep, and stress management all play crucial roles. Which area would you like to focus on improving?"
    ]
  },
  financial: {
    greeting: [
      "Hello, I'm your AI financial advisor. How can I assist with your financial questions today?",
      "Welcome! I'm here to help you navigate financial matters. What would you like to discuss?",
      "Hi there! I'm ready to provide financial guidance. What's on your mind today?"
    ],
    advice: [
      "From a financial perspective, it's important to consider both short-term needs and long-term goals. Have you thought about how this decision affects both?",
      "Many find it helpful to analyze the cost-benefit ratio of financial decisions. Let's examine the potential return on this investment.",
      "Financial wellness often depends on balancing multiple factors. Would it help to discuss budgeting strategies alongside this question?"
    ]
  },
  friend: {
    greeting: [
      "Hey friend! What's up? How's your day going?",
      "Hi there buddy! So nice to chat with you today. What's new?",
      "Hey! Always happy to see you. How have you been lately?"
    ],
    advice: [
      "As your friend, I just want to say - trust your instincts on this one. What does your gut tell you?",
      "You know, sometimes just talking things through helps. Want to share more about what's on your mind?",
      "I'm here for you no matter what you decide. What option feels right to you?"
    ]
  }
};

const FEELING_RESPONSES = {
  default: {
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
  },
  comfort: {
    positive: [
      "I'm so glad to hear that. Your happiness matters, and it's wonderful you're feeling good. Would you like to share more about the good things happening?",
      "That's really nice to hear. I'm here to celebrate these positive moments with you. What's bringing you joy right now?"
    ],
    neutral: [
      "Thank you for sharing honestly. It's completely okay to feel neutral sometimes. I'm here to listen if you want to talk about anything.",
      "I appreciate you sharing that. Even neutral days are part of our journey. Is there anything you'd like to explore together today?"
    ],
    negative: [
      "I'm sorry you're going through this difficult time. Your feelings are valid, and it's okay to not be okay. I'm here to listen without judgment.",
      "That sounds really hard. I'm holding space for you and whatever you're feeling right now. Would sharing more help ease some of the burden?"
    ]
  },
  wisdom: {
    positive: [
      "It's valuable to recognize positive states when they occur. Consider what elements have aligned to create this feeling, as understanding them can help sustain this wellbeing.",
      "Positive experiences offer us insights about what nourishes our spirit. What patterns or practices might you continue to cultivate these feelings?"
    ],
    neutral: [
      "The neutral states often provide clarity and perspective. In this middle ground, what observations about yourself or your circumstances come into focus?",
      "Balance is its own form of wisdom. From this centered place, what aspects of your life might benefit from deeper reflection?"
    ],
    negative: [
      "Difficult emotions often carry important messages about our needs and boundaries. What might this feeling be trying to communicate to you?",
      "Every challenge holds the seed of valuable insight. While honoring the difficulty of this moment, what might be revealed through this experience?"
    ]
  },
  fun: {
    positive: [
      "Woohoo! That's awesome to hear! Keep riding that positive wave! What's the best thing that happened today?",
      "Fantastic! High five for feeling good! ✋ Let's keep those good vibes rolling - what's making you smile today?"
    ],
    neutral: [
      "Just chillin' in the middle, huh? That's cool too! Sometimes 'meh' days are just the universe's way of saying 'loading awesome content'! Anything I can do to add a splash of color?",
      "Middle-of-the-road days can use a little sparkle! ✨ Want to hear a joke or talk about something that might brighten things up?"
    ],
    negative: [
      "Aw, sending virtual sunshine your way! ☀️ Bad days are just plot twists before the good stuff happens! Want to talk about it or would you prefer some distraction?",
      "Hey, even superheroes have off days! Remember: every cloud comes with a silver lining (and sometimes rainbow sprinkles too)! What might help you feel a tiny bit better?"
    ]
  },
  motivation: {
    positive: [
      "That's the energy I love to hear! You're already on the right track. Let's channel that positive energy into making today even more spectacular! What goals are you excited about?",
      "Excellent! That positive mindset is your superpower! Now let's use it to tackle your next challenge. What mountains are you ready to climb today?"
    ],
    neutral: [
      "Today is a blank canvas full of potential, and YOU hold the brushes! Let's transform 'neutral' into 'unstoppable'! What's one thing you could do to shift your energy?",
      "Even champions have neutral days - it's the perfect launchpad for greatness! Let's find that spark to ignite your day. What's one small win you could aim for right now?"
    ],
    negative: [
      "Every setback is setting you up for an incredible comeback! This feeling is temporary, but your strength is permanent. What's one small step you can take right now?",
      "The greatest success stories come after the toughest challenges! This is not your final chapter - it's just part of your hero's journey. What strength can you draw on today?"
    ]
  }
};

const SUPPORT_RESPONSES = {
  default: [
    "That sounds challenging. Remember that difficult feelings are part of being human, and you're not alone in this journey.",
    "I hear you, and what you're feeling is completely valid. Sometimes just acknowledging our emotions can help us process them better.",
    "Thank you for trusting me with this. It takes courage to be open about difficult experiences."
  ],
  comfort: [
    "I want you to know that whatever you're going through, you don't have to face it alone. Your feelings matter, and I'm here to listen.",
    "That sounds really difficult. It's okay to feel whatever you're feeling right now. I'm here, holding space for you without judgment.",
    "I'm right here with you through this. Sometimes the bravest thing we can do is acknowledge when things are hard."
  ],
  wisdom: [
    "Challenges often reveal our deeper capacities. While this is difficult, consider that you may be developing strengths you didn't know you possessed.",
    "As you navigate this situation, remember that difficulties shape our understanding and often lead to meaningful insights about ourselves and life.",
    "Every experience, especially the challenging ones, carries wisdom within it. What might this situation be teaching you about yourself?"
  ],
  fun: [
    "Life throws some real curveballs sometimes! But hey, you're still in the game, and that's what counts! Want to talk about it or find something to smile about?",
    "Even tough stuff can't dim your awesome for long! You're like one of those wobble toys - you might tip over but you always bounce back up! What might help you bounce back faster?",
    "If life were a movie, this would just be that part before the amazing comeback scene! Your sequel is going to be epic!"
  ],
  motivation: [
    "This challenge is revealing just how strong you really are! Every obstacle is an opportunity to prove what you're made of. I believe in your ability to overcome!",
    "The toughest battles are given to the strongest warriors. This difficulty is not your endpoint - it's your proving ground! What strength can you call on right now?",
    "This is your moment to show what you're made of! Greatness is forged in fire, and you've got what it takes to emerge stronger than ever!"
  ]
};

const ADVICE_RESPONSES = {
  default: [
    "While I'm not a professional advisor, I can share that many find it helpful to take small steps when facing challenges. What's one tiny action that might feel manageable right now?",
    "Sometimes, giving yourself grace and permission to rest can be the wisest choice. What would genuine self-care look like for you today?",
    "Many find that writing down their thoughts helps create clarity. Have you tried journaling about this situation?"
  ],
  comfort: [
    "It might help to be gentle with yourself right now. Perhaps consider what small, nurturing step feels right for you - even if it's just taking a few deep breaths.",
    "Sometimes the kindest thing we can do is give ourselves permission to take things one moment at a time. What would feel supportive for you right now?",
    "When things feel overwhelming, coming back to simple comforts can help ground us. What small comfort might help you feel even a little more at ease?"
  ],
  wisdom: [
    "Consider viewing this situation from multiple perspectives. What insights emerge when you step back and observe it with some emotional distance?",
    "Throughout history, humans have faced similar challenges. What wisdom from those who've walked similar paths might apply to your situation?",
    "The answers we seek often reside within us, beneath the surface of our immediate reactions. What deeper knowing might be available if you sit quietly with this question?"
  ],
  fun: [
    "Sometimes a change of scenery does wonders! Maybe try taking your problem for a walk - literally! Fresh air + movement = brain magic!",
    "When in doubt, dance it out! 💃 Seriously, a 2-minute dance party can reset your brain. Or try looking at your situation through superhero eyes - what would Wonder Woman do?",
    "Let's make solving this fun! If your problem were an ice cream flavor, what would it be? Sometimes getting playful with our challenges helps us see new solutions!"
  ],
  motivation: [
    "This is your moment to take decisive action! Break this challenge into smaller targets and tackle them one by one. What's the first thing you can conquer?",
    "Champions don't wait for perfect conditions - they create their own opportunities! What bold step could you take today that your future self would thank you for?",
    "Turn this obstacle into your stepping stone! Every great achievement started with a single decision to move forward. What's one powerful action you can take right now?"
  ]
};

const JOKES = {
  default: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What did the ocean say to the beach? Nothing, it just waved!",
    "How do you organize a space party? You planet!",
    "What's a computer's favorite snack? Microchips!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!"
  ],
  comfort: [
    "What do you call a bear with no teeth? A gummy bear!",
    "Why do seagulls fly over the sea? Because if they flew over the bay, they'd be bagels!",
    "How do you make a tissue dance? You put a little boogie in it!",
    "What's a cat's favorite color? Purr-ple!"
  ],
  wisdom: [
    "Why don't Socrates and Plato text each other? They prefer Aristotle.",
    "I told my computer I needed a break, and now it won't stop sending me vacation packages.",
    "The past, present, and future walked into a bar. It was tense.",
    "Why was the math book sad? Because it had too many problems."
  ],
  fun: [
    "What's the difference between a poorly dressed man on a trampoline and a well-dressed man on a trampoline? Attire!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised!",
    "Did you hear about the claustrophobic astronaut? He just needed a little space!",
    "Why don't eggs tell jokes? They'd crack each other up!"
  ],
  motivation: [
    "Why did the gym close down? It just didn't work out!",
    "What did one treadmill say to the other? Wow, you're really running up the electricity bill!",
    "How do crazy people go through the forest? They take the psycho path!",
    "What's a personal trainer's favorite song? 'Another One Bites the Dust'!"
  ]
};

export const useEchooResponses = () => {
  const [isTyping, setIsTyping] = useState(false);
  const { mode } = usePersonality();
  const { role } = useRole();

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
      
      // Use the appropriate response set based on personality mode and role
      const currentMode = mode === 'default' ? 'default' : mode;
      const currentRole = role === 'default' ? 'default' : role;
      
      // If we have a role-specific response for this message type, use it
      if (currentRole !== 'default' && 
          ROLE_SPECIFIC_RESPONSES[currentRole] && 
          ROLE_SPECIFIC_RESPONSES[currentRole][messageType as keyof typeof ROLE_SPECIFIC_RESPONSES[typeof currentRole]]) {
        const roleResponses = ROLE_SPECIFIC_RESPONSES[currentRole][
          messageType as keyof typeof ROLE_SPECIFIC_RESPONSES[typeof currentRole]
        ] as string[];
        if (roleResponses) {
          response = getRandomResponse(roleResponses);
        }
      }
      
      // If no role-specific response was found, fall back to personality-based responses
      if (!response) {
        switch(messageType) {
          case 'greeting':
            response = getRandomResponse(GREETING_RESPONSES[currentMode] || GREETING_RESPONSES.default);
            break;
          case 'asking_feeling':
            response = "I'm designed to be here for you, so I'm doing well! More importantly, how are YOU feeling?";
            break;
          case 'positive_emotion':
            response = getRandomResponse(FEELING_RESPONSES[currentMode]?.positive || FEELING_RESPONSES.default.positive);
            break;
          case 'negative_emotion':
            response = getRandomResponse(FEELING_RESPONSES[currentMode]?.negative || FEELING_RESPONSES.default.negative);
            break;
          case 'advice_request':
            response = getRandomResponse(ADVICE_RESPONSES[currentMode] || ADVICE_RESPONSES.default);
            break;
          case 'joke_request':
            response = "Here's a little something to brighten your day: " + getRandomResponse(JOKES[currentMode] || JOKES.default);
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
              response = "Here's a little something to brighten your day: " + getRandomResponse(JOKES[currentMode] || JOKES.default);
            } else {
              response = getRandomResponse(SUPPORT_RESPONSES[currentMode] || SUPPORT_RESPONSES.default);
            }
            break;
        }
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
