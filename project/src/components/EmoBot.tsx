import React, { useEffect, useRef, useState } from 'react';
import { ChatBotState } from '../types';

interface EmoBotProps {
  mood: ChatBotState['mood'];
  isSpeaking: boolean;
}

export const EmoBot: React.FC<EmoBotProps> = ({ mood, isSpeaking }) => {
  const mouthRef = useRef<SVGPathElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const [lipSyncIntensity, setLipSyncIntensity] = useState(1);

  useEffect(() => {
    if (mouthRef.current && eyesRef.current) {
      // Reset animations
      mouthRef.current.style.animation = 'none';
      eyesRef.current.style.animation = 'none';
      
      void mouthRef.current.offsetWidth;
      void eyesRef.current.offsetWidth;
      
      if (isSpeaking) {
        mouthRef.current.style.animation = `lipSync ${0.6 / lipSyncIntensity}s infinite`;
      } else {
        switch (mood) {
          case 'happy':
            mouthRef.current.style.animation = 'smile 0.5s forwards';
            eyesRef.current.style.animation = 'wideEyes 0.5s forwards';
            break;
          case 'thinking':
            mouthRef.current.style.animation = 'thoughtful 0.5s forwards';
            eyesRef.current.style.animation = 'lookUp 0.5s forwards';
            break;
          case 'neutral':
          default:
            mouthRef.current.style.animation = 'neutral 0.5s forwards';
            eyesRef.current.style.animation = 'normalEyes 0.5s forwards';
        }
      }
    }
  }, [mood, isSpeaking, lipSyncIntensity]);

  // Adjust lip sync intensity based on word length
  const handleWordSpoken = (word: string) => {
    const intensity = Math.max(0.5, Math.min(2, word.length / 5));
    setLipSyncIntensity(intensity);
  };

  useEffect(() => {
    // Expose the handleWordSpoken method to the speech manager
    if (window.speechManager) {
      window.speechManager.setWordCallback(handleWordSpoken);
    }
  }, []);

  return (
    <div className="w-full max-w-[400px] aspect-[3/4]">
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full filter drop-shadow-lg"
      >
        {/* Robot Head - Rectangular shape */}
        <rect
          x="50"
          y="50"
          width="200"
          height="250"
          rx="20"
          className="transition-colors duration-300"
          style={{
            fill: 'url(#metalGradient)',
            stroke: '#2B3945',
            strokeWidth: '4'
          }}
        />

        {/* Neck */}
        <rect
          x="120"
          y="300"
          width="60"
          height="50"
          style={{
            fill: 'url(#metalGradient)',
            stroke: '#2B3945',
            strokeWidth: '4'
          }}
        />

        {/* Define gradients */}
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#718096' }} />
            <stop offset="50%" style={{ stopColor: '#4A5568' }} />
            <stop offset="100%" style={{ stopColor: '#2D3748' }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <rect
          x="140"
          y="20"
          width="20"
          height="30"
          style={{
            fill: '#2B3945',
            stroke: '#2B3945',
            strokeWidth: '2'
          }}
        />
        
        {/* Eyes Group */}
        <g ref={eyesRef}>
          {/* Left Eye Socket */}
          <rect
            x="85"
            y="120"
            width="50"
            height="30"
            rx="5"
            fill="#1A202C"
          />
          {/* Right Eye Socket */}
          <rect
            x="165"
            y="120"
            width="50"
            height="30"
            rx="5"
            fill="#1A202C"
          />
          {/* Cyan Eyes with Glow Effect */}
          <rect
            x="95"
            y="125"
            width="30"
            height="20"
            rx="3"
            fill="#00FFFF"
            className="eye-glow"
            style={{ filter: 'url(#glow)' }}
          />
          <rect
            x="175"
            y="125"
            width="30"
            height="20"
            rx="3"
            fill="#00FFFF"
            className="eye-glow"
            style={{ filter: 'url(#glow)' }}
          />
        </g>
        
        {/* Mouth Panel */}
        <rect
          x="100"
          y="180"
          width="100"
          height="60"
          rx="10"
          fill="#1A202C"
        />
        
        {/* Mouth */}
        <path
          ref={mouthRef}
          d="M 110 210 L 190 210"
          fill="none"
          stroke="#00FFFF"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            filter: 'url(#glow)',
            transformOrigin: 'center',
            animation: isSpeaking ? `lipSync ${0.6 / lipSyncIntensity}s infinite` : undefined
          }}
        />

        {/* Decorative Panels */}
        <rect x="70" y="250" width="40" height="20" rx="5" fill="#2B3945" />
        <rect x="190" y="250" width="40" height="20" rx="5" fill="#2B3945" />

        {/* Circuit Pattern Background */}
        <path
          d="M60 60 h180 M60 100 h180 M60 140 h180 M60 180 h180 M60 220 h180 M60 260 h180"
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};