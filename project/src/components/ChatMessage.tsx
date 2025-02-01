import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const formatBotMessage = (content: string): string[] => {
  // Split by periods, question marks, or exclamation marks followed by a space
  const sentences = content.split(/(?<=[.!?])\s+/);
  // Filter out empty strings and trim each sentence
  return sentences.filter(sentence => sentence.trim().length > 0);
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  const formattedContent = isBot ? formatBotMessage(message.content) : [message.content];
  
  return (
    <div className={`flex gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
      }`}>
        {isBot ? (
          <Bot className="w-6 h-6 text-white" />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </div>
      <div className={`flex-1 ${isBot ? 'pr-12' : 'pl-12'}`}>
        <div className={`rounded-2xl p-4 shadow-sm ${
          isBot
            ? 'bg-white text-gray-800'
            : 'bg-blue-600 text-white'
        }`}>
          <p className="text-sm font-medium mb-1">
            {isBot ? 'MoneyMentor' : 'You'}
          </p>
          {isBot ? (
            <ul className="bullet-list">
              {formattedContent.map((sentence, index) => (
                <li key={index} className="message-animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {sentence}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${isBot ? 'text-gray-700' : 'text-blue-50'}`}>
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};