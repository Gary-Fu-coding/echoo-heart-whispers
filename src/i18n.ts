
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
      voiceRecognitionError: "Could not recognize speech. Please try again.",
      // Auth page translations
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Name",
      enterYourEmail: "Enter your email",
      enterYourPassword: "Enter your password",
      enterYourName: "Enter your name",
      confirmYourPassword: "Confirm your password",
      continueAsGuest: "Continue as Guest",
      loginSuccessful: "Login Successful",
      welcomeBack: "Welcome back to Echoo!",
      registrationSuccessful: "Registration Successful",
      welcomeToEchoo: "Welcome to Echoo!",
      welcomeGuest: "Welcome Guest",
      joinedAsGuest: "You've joined as a guest user.",
      logout: "Logout"
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
      voiceRecognitionError: "No se pudo reconocer el habla. Por favor, inténtelo de nuevo.",
      // Auth page translations
      login: "Iniciar sesión",
      signup: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      name: "Nombre",
      enterYourEmail: "Ingrese su correo electrónico",
      enterYourPassword: "Ingrese su contraseña",
      enterYourName: "Ingrese su nombre",
      confirmYourPassword: "Confirme su contraseña",
      continueAsGuest: "Continuar como invitado",
      loginSuccessful: "Inicio de sesión exitoso",
      welcomeBack: "¡Bienvenido de nuevo a Echoo!",
      registrationSuccessful: "Registro exitoso",
      welcomeToEchoo: "¡Bienvenido a Echoo!",
      welcomeGuest: "Bienvenido invitado",
      joinedAsGuest: "Te has unido como usuario invitado.",
      logout: "Cerrar sesión"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur Echoo",
      changeRole: "Changer le rôle de l'IA",
      howAreYouFeeling: "Comment vous sentez-vous aujourd'hui?",
      yourHeartsCompanion: "Le compagnon de votre cœur",
      sendMessage: "Envoyer",
      typeMessage: "Tapez un message...",
      poweredBy: "Propulsé par l'IA centrée sur le cœur",
      voiceNotSupported: "La reconnaissance vocale n'est pas prise en charge dans votre navigateur.",
      voiceRecognitionError: "Impossible de reconnaître la parole. Veuillez réessayer.",
      // Auth page translations
      login: "Connexion",
      signup: "S'inscrire",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      name: "Nom",
      enterYourEmail: "Entrez votre email",
      enterYourPassword: "Entrez votre mot de passe",
      enterYourName: "Entrez votre nom",
      confirmYourPassword: "Confirmez votre mot de passe",
      continueAsGuest: "Continuer en tant qu'invité",
      loginSuccessful: "Connexion réussie",
      welcomeBack: "Bienvenue à nouveau sur Echoo!",
      registrationSuccessful: "Inscription réussie",
      welcomeToEchoo: "Bienvenue sur Echoo!",
      welcomeGuest: "Bienvenue, invité",
      joinedAsGuest: "Vous vous êtes connecté en tant qu'invité.",
      logout: "Déconnexion"
    }
  },
  zh: {
    translation: {
      welcome: "欢迎使用Echoo",
      changeRole: "更改AI角色",
      howAreYouFeeling: "今天感觉如何？",
      yourHeartsCompanion: "您心灵的伴侣",
      sendMessage: "发送",
      typeMessage: "输入消息...",
      poweredBy: "由以心为中心的AI提供支持",
      voiceNotSupported: "您的浏览器不支持语音识别。",
      voiceRecognitionError: "无法识别语音。请再试一次。",
      // Auth page translations
      login: "登录",
      signup: "注册",
      email: "电子邮件",
      password: "密码",
      confirmPassword: "确认密码",
      name: "姓名",
      enterYourEmail: "输入您的电子邮件",
      enterYourPassword: "输入您的密码",
      enterYourName: "输入您的姓名",
      confirmYourPassword: "确认您的密码",
      continueAsGuest: "以访客身份继续",
      loginSuccessful: "登录成功",
      welcomeBack: "欢迎回到Echoo！",
      registrationSuccessful: "注册成功",
      welcomeToEchoo: "欢迎使用Echoo！",
      welcomeGuest: "欢迎，访客",
      joinedAsGuest: "您已以访客身份加入。",
      logout: "登出"
    }
  },
  hi: {
    translation: {
      welcome: "Echoo में आपका स्वागत है",
      changeRole: "AI भूमिका बदलें",
      howAreYouFeeling: "आज आप कैसा महसूस कर रहे हैं?",
      yourHeartsCompanion: "आपके दिल का साथी",
      sendMessage: "भेजें",
      typeMessage: "संदेश लिखें...",
      poweredBy: "हृदय-केंद्रित AI द्वारा संचालित",
      voiceNotSupported: "आपके ब्राउज़र में वॉइस पहचान समर्थित नहीं है।",
      voiceRecognitionError: "भाषण को पहचान नहीं सका। कृपया पुन: प्रयास करें।",
      // Auth page translations
      login: "लॉग इन",
      signup: "साइन अप",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      name: "नाम",
      enterYourEmail: "अपना ईमेल दर्ज करें",
      enterYourPassword: "अपना पासवर्ड दर्ज करें",
      enterYourName: "अपना नाम दर्ज करें",
      confirmYourPassword: "अपने पासवर्ड की पुष्टि करें",
      continueAsGuest: "अतिथि के रूप में जारी रखें",
      loginSuccessful: "लॉगिन सफल",
      welcomeBack: "Echoo में आपका फिर से स्वागत है!",
      registrationSuccessful: "पंजीकरण सफल",
      welcomeToEchoo: "Echoo में आपका स्वागत है!",
      welcomeGuest: "स्वागत है, अतिथि",
      joinedAsGuest: "आप अतिथि उपयोगकर्ता के रूप में शामिल हुए हैं।",
      logout: "लॉग आउट"
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
