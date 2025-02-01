import React from 'react';
import { ChatBot } from './components/ChatBot';
import { EmoBot } from './components/EmoBot';

function App() {
  return (
    <div className="flex min-h-screen">
      {/* EmoBot Section - 40% width */}
      <div className="w-[40%] tech-pattern">
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <EmoBot mood="neutral" isSpeaking={false} />
          </div>
        </div>
      </div>
      
      {/* ChatBot Section - 60% width */}
      <div className="w-[60%] p-6 bg-gradient-to-br from-gray-900 to-blue-900">
        <ChatBot />
      </div>
    </div>
  );
}

export default App