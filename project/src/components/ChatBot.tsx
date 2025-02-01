import React, { useState } from 'react';
import { Send, DollarSign, PiggyBank, CreditCard, TrendingUp, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { Message, ChatBotState } from '../types';
import { ChatMessage } from './ChatMessage';
import { getChatResponse } from '../utils/ai';
import { SpeechManager } from '../utils/speech';

const FinancialTip: React.FC<{ tip: string }> = ({ tip }) => (
  <div className="financial-tip rounded-lg p-4 shadow-sm hover-scale">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb className="w-5 h-5 text-yellow-500" />
      <span className="font-semibold text-gray-700">Quick Tip</span>
    </div>
    <p className="text-sm text-gray-600">{tip}</p>
  </div>
);

const financialTips = [
  "Set aside 20% of your income for savings and investments.",
  "Review your budget monthly to track spending patterns.",
  "Consider automating your bill payments to avoid late fees.",
];

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I\'m MoneyMentor, your AI financial advisor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [botState, setBotState] = useState<ChatBotState>({ 
    mood: 'neutral',
    isSpeaking: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechManager] = useState(() => {
    const manager = new SpeechManager();
    // Make speech manager globally available for EmoBot
    window.speechManager = manager;
    return manager;
  });
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % financialTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const speakMessage = (text: string) => {
    if (!isMuted) {
      speechManager.speak(
        text,
        () => setBotState(prev => ({ ...prev, isSpeaking: true })),
        () => setBotState(prev => ({ ...prev, isSpeaking: false }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setBotState(prev => ({ ...prev, mood: 'thinking' }));

    try {
      const response = await getChatResponse(userMessage);
      setBotState(prev => ({ ...prev, mood: 'happy' }));
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      speakMessage(response);
    } catch (error) {
      setBotState(prev => ({ ...prev, mood: 'neutral' }));
      const errorMessage = 'I apologize, but I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'bot', content: errorMessage }]);
      speakMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (!isMuted) {
      speechManager.stop();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Floating Finance Icons with Tooltips */}
      <div className="fixed top-10 right-10 animate-bounce group">
        <DollarSign className="w-6 h-6 text-green-400" />
        <span className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded -left-20">
          Track Expenses
        </span>
      </div>
      <div className="fixed top-20 right-16 animate-bounce delay-100 group">
        <PiggyBank className="w-6 h-6 text-blue-400" />
        <span className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded -left-20">
          Save Money
        </span>
      </div>
      <div className="fixed top-30 right-24 animate-bounce delay-200 group">
        <CreditCard className="w-6 h-6 text-purple-400" />
        <span className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded -left-20">
          Manage Credit
        </span>
      </div>
      <div className="fixed top-40 right-12 animate-bounce delay-300 group">
        <TrendingUp className="w-6 h-6 text-red-400" />
        <span className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded -left-20">
          Investment Growth
        </span>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 gradient-bg">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-2xl font-bold">MoneyMentor</h1>
              <p className="text-blue-200">Your AI Financial Advisor</p>
            </div>
            <button
              onClick={toggleMute}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Financial Tip Section */}
        <div className="px-6 py-3 border-b border-gray-100">
          <FinancialTip tip={financialTips[currentTipIndex]} />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 chat-gradient space-y-6">
          {messages.map((message, index) => (
            <div key={index} className="message-animate-in">
              <ChatMessage message={message} />
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center justify-center p-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white rounded-xl px-6 py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};