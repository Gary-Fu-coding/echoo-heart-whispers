
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { PersonalityProvider } from '@/contexts/PersonalityContext';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { ThemeProvider } from "@/components/theme-provider";
import { UIThemeProvider } from '@/contexts/UIThemeContext';
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Import pages
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Messages from '@/pages/Messages';
import Roles from '@/pages/Roles';
import TutorPage from '@/pages/TutorPage';
import WhiteboardPage from '@/pages/WhiteboardPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="echoo-theme">
      <UIThemeProvider>
        <LanguageProvider>
          <RoleProvider>
            <PersonalityProvider>
              <VoiceProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/chat" element={<Index />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/tutor" element={<TutorPage />} />
                    <Route path="/whiteboard" element={<WhiteboardPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
                <Toaster />
              </VoiceProvider>
            </PersonalityProvider>
          </RoleProvider>
        </LanguageProvider>
      </UIThemeProvider>
    </ThemeProvider>
  );
}

export default App;
