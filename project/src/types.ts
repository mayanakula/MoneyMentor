export interface Message {
  role: 'user' | 'bot';
  content: string;
}

export interface ChatBotState {
  mood: 'neutral' | 'thinking' | 'happy';
  isSpeaking: boolean;
}

// Add type declaration for global speechManager
declare global {
  interface Window {
    speechManager: {
      setWordCallback: (callback: (word: string) => void) => void;
    };
  }
}