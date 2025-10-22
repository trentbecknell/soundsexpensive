import React, { useState, useEffect } from 'react';

interface AICharacterProps {
  isTyping?: boolean;
  mood?: 'neutral' | 'excited' | 'listening' | 'thinking' | 'encouraging';
  message?: string;
  className?: string;
}

export default function AICharacter({ 
  isTyping = false, 
  mood = 'neutral', 
  message,
  className = '' 
}: AICharacterProps) {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [mouthAnimation, setMouthAnimation] = useState(0);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth animation when typing
  useEffect(() => {
    if (isTyping) {
      const mouthInterval = setInterval(() => {
        setMouthAnimation(prev => (prev + 1) % 4);
      }, 200);

      return () => clearInterval(mouthInterval);
    } else {
      setMouthAnimation(0);
    }
  }, [isTyping]);

  // Character colors and expressions based on mood
  const getMoodStyles = () => {
    switch (mood) {
      case 'excited':
        return {
          bgColor: 'from-yellow-400/20 to-orange-400/20',
          eyeColor: 'text-yellow-400',
          cheekColor: 'fill-pink-300/50'
        };
      case 'listening':
        return {
          bgColor: 'from-blue-400/20 to-purple-400/20',
          eyeColor: 'text-blue-400',
          cheekColor: 'fill-blue-300/30'
        };
      case 'thinking':
        return {
          bgColor: 'from-purple-400/20 to-indigo-400/20',
          eyeColor: 'text-purple-400',
          cheekColor: 'fill-purple-300/30'
        };
      case 'encouraging':
        return {
          bgColor: 'from-green-400/20 to-emerald-400/20',
          eyeColor: 'text-green-400',
          cheekColor: 'fill-green-300/30'
        };
      default:
        return {
          bgColor: 'from-primary-400/20 to-primary-600/20',
          eyeColor: 'text-primary-400',
          cheekColor: 'fill-primary-300/30'
        };
    }
  };

  const styles = getMoodStyles();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Character Avatar */}
      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${styles.bgColor} border-2 border-surface-600 shadow-lg overflow-hidden mb-3 transition-all duration-500`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Face base */}
          <circle cx="50" cy="50" r="45" fill="url(#faceGradient)" />
          
          {/* Cheeks */}
          <circle cx="35" cy="55" r="8" className={styles.cheekColor} opacity="0.6" />
          <circle cx="65" cy="55" r="8" className={styles.cheekColor} opacity="0.6" />
          
          {/* Eyes */}
          <g className={styles.eyeColor}>
            {/* Left eye */}
            <circle 
              cx="38" 
              cy="45" 
              r={eyeBlink ? "2" : "4"} 
              fill="currentColor"
              className="transition-all duration-150"
            />
            {/* Right eye */}
            <circle 
              cx="62" 
              cy="45" 
              r={eyeBlink ? "2" : "4"} 
              fill="currentColor"
              className="transition-all duration-150"
            />
            
            {/* Eye highlights */}
            {!eyeBlink && (
              <>
                <circle cx="40" cy="43" r="1.5" fill="white" opacity="0.8" />
                <circle cx="64" cy="43" r="1.5" fill="white" opacity="0.8" />
              </>
            )}
          </g>
          
          {/* Mouth */}
          <g fill="currentColor" className={styles.eyeColor}>
            {isTyping ? (
              // Animated mouth for talking
              <ellipse 
                cx="50" 
                cy="65" 
                rx={mouthAnimation % 2 === 0 ? "3" : "5"} 
                ry={mouthAnimation % 2 === 0 ? "2" : "4"}
                className="transition-all duration-200"
              />
            ) : mood === 'excited' ? (
              // Happy smile
              <path d="M 42 63 Q 50 70 58 63" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : mood === 'encouraging' ? (
              // Warm smile
              <path d="M 43 64 Q 50 68 57 64" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : mood === 'thinking' ? (
              // Contemplative expression
              <ellipse cx="50" cy="65" rx="2" ry="1" />
            ) : (
              // Default gentle smile
              <path d="M 45 64 Q 50 67 55 64" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </g>
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="faceGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Thinking animation */}
        {mood === 'thinking' && (
          <div className="absolute -top-2 -right-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Listening animation */}
        {mood === 'listening' && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-0.5 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-0.5 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
              <div className="w-0.5 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Character message bubble */}
      {message && (
        <div className="relative max-w-xs">
          <div className="bg-surface-700/90 backdrop-blur rounded-2xl px-4 py-3 text-sm text-surface-100 shadow-lg border border-surface-600">
            <p className="text-center">{message}</p>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-surface-700/90"></div>
          </div>
        </div>
      )}
      
      {/* Typing indicator */}
      {isTyping && !message && (
        <div className="bg-surface-700/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-surface-600">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}