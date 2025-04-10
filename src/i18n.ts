
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Create translations for our app
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Echoo",
      changeRole: "Change AI Role",
      howAreYouFeeling: "How are you feeling today?",
      yourHeartsCompanion: "Your heart's companion",
      sendMessage: "Send",
      typeMessage: "Type a message...",
      poweredBy: "Powered by heart-centered AI",
      voiceNotSupported: "Voice recognition is not supported in your browser.",
      voiceRecognitionError: "Could not recognize speech. Please try again."
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido a Echoo",
      changeRole: "Cambiar rol de IA",
      howAreYouFeeling: "¿Cómo te sientes hoy?",
      yourHeartsCompanion: "El compañero de tu corazón",
      sendMessage: "Enviar",
      typeMessage: "Escribe un mensaje...",
      poweredBy: "Impulsado por IA centrada en el corazón",
      voiceNotSupported: "El reconocimiento de voz no es compatible con su navegador.",
      voiceRecognitionError: "No se pudo reconocer el habla. Por favor, inténtelo de nuevo."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
