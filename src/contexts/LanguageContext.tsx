
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'zh' | 'hi';

type Translations = {
  [key in Language]: {
    welcome: string;
    howAreYouFeeling: string;
    yourHeartsCompanion: string;
    sendMessage: string;
    typeMessage: string;
    poweredBy: string;
  };
};

const translations: Translations = {
  en: {
    welcome: "Welcome to Echoo",
    howAreYouFeeling: "How are you feeling today?",
    yourHeartsCompanion: "Your heart's companion",
    sendMessage: "Send",
    typeMessage: "Type a message...",
    poweredBy: "Powered by heart-centered AI"
  },
  es: {
    welcome: "Bienvenido a Echoo",
    howAreYouFeeling: "¿Cómo te sientes hoy?",
    yourHeartsCompanion: "El compañero de tu corazón",
    sendMessage: "Enviar",
    typeMessage: "Escribe un mensaje...",
    poweredBy: "Impulsado por IA centrada en el corazón"
  },
  fr: {
    welcome: "Bienvenue à Echoo",
    howAreYouFeeling: "Comment vous sentez-vous aujourd'hui?",
    yourHeartsCompanion: "Le compagnon de votre cœur",
    sendMessage: "Envoyer",
    typeMessage: "Tapez un message...",
    poweredBy: "Propulsé par l'IA centrée sur le cœur"
  },
  zh: {
    welcome: "欢迎使用 Echoo",
    howAreYouFeeling: "今天感觉如何？",
    yourHeartsCompanion: "您心灵的伙伴",
    sendMessage: "发送",
    typeMessage: "输入消息...",
    poweredBy: "由以心为中心的人工智能提供支持"
  },
  hi: {
    welcome: "Echoo में आपका स्वागत है",
    howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
    yourHeartsCompanion: "आपके दिल का साथी",
    sendMessage: "भेजें",
    typeMessage: "संदेश टाइप करें...",
    poweredBy: "हृदय-केंद्रित AI द्वारा संचालित"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('echoo-language');
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('echoo-language', language);
  }, [language]);

  const t = (key: keyof Translations['en']): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
