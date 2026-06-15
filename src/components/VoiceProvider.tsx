import React, { createContext, useContext, useState } from 'react';

interface VoiceContextType {
  isPlaying: boolean;
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  speakText: (text: string, voiceId?: string) => Promise<void>;
  stopSpeech: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

// Language to ElevenLabs voice mapping
const languageVoices = {
  "English": "9BWtsMINqrJLrRacOk9x", // Aria
  "हिंदी (Hindi)": "EXAVITQu4vr4xnSDxMaL", // Sarah
  "বাংলা (Bengali)": "FGY2WhTYpPnrIDTdsKH5", // Laura
  "తెలుగు (Telugu)": "IKne3meq5aSn9XLyUdCD", // Charlie
  "தமிழ் (Tamil)": "SAz9YHcvj6GT2YYXdXww", // River
  "मराठी (Marathi)": "TX3LPaxmHKxFdv7VOQHJ", // Liam
  "ગુજરાતી (Gujarati)": "XB0fDUnXU5powFXDhCwa" // Charlotte
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speakText = async (text: string, voiceId?: string) => {
    try {
      setIsPlaying(true);
      
      // Stop any current speech
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      // For now, use browser's built-in speech synthesis
      // TODO: Replace with ElevenLabs API when backend is available
      fallbackSpeak(text);
      
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsPlaying(false);
      // Fallback to browser's built-in speech synthesis
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === "English" ? "en-US" : 
                     currentLanguage === "हिंदी (Hindi)" ? "hi-IN" : "en-US";
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const value: VoiceContextType = {
    isPlaying,
    currentLanguage,
    setCurrentLanguage,
    speakText,
    stopSpeech
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};