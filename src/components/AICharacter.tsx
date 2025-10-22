import React, { useState, useEffect } from 'react';

interface AICharacterProps {
  isTyping?: boolean;
  mood?: 'neutral' | 'excited' | 'listening' | 'thinking' | 'encouraging';
  message?: string;
  className?: string;
  isSpeaking?: boolean;
}

export default function AICharacter({ 
  isTyping = false, 
  mood = 'neutral', 
  message,
  className = '',
  isSpeaking = false
}: AICharacterProps) {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [isPerforming, setIsPerforming] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Performance animation for excited/encouraging moods or when speaking
  useEffect(() => {
    if (mood === 'excited' || mood === 'encouraging' || isSpeaking) {
      setIsPerforming(true);
      const timer = setTimeout(() => setIsPerforming(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [mood, isSpeaking]);

  // Sparkle effects for excited mood
  useEffect(() => {
    if (mood === 'excited' || mood === 'encouraging') {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3000
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [mood]);

  // Background music management
  useEffect(() => {
    // Create a simple ambient loop using Web Audio API
    const createAmbientMusic = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playAmbientTone = (frequency: number, duration: number, delay: number = 0) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
          }, delay);
        };

        // Different ambient patterns based on mood
        const ambientPatterns = {
          neutral: () => {
            playAmbientTone(220, 2, 0);
            playAmbientTone(330, 1.5, 1000);
          },
          excited: () => {
            playAmbientTone(440, 1, 0);
            playAmbientTone(554, 1, 500);
            playAmbientTone(659, 1, 1000);
          },
          listening: () => {
            playAmbientTone(174, 3, 0);
            playAmbientTone(196, 2, 1500);
          },
          thinking: () => {
            playAmbientTone(147, 2.5, 0);
            playAmbientTone(165, 2, 2000);
          },
          encouraging: () => {
            playAmbientTone(523, 1.5, 0);
            playAmbientTone(659, 1.5, 800);
            playAmbientTone(784, 1.5, 1600);
          }
        };

        // Play ambient pattern based on mood with reduced frequency
        const interval = setInterval(() => {
          if (Math.random() > 0.7) { // Only play 30% of the time to avoid overwhelming
            ambientPatterns[mood]?.();
          }
        }, 8000);

        return () => clearInterval(interval);
      } catch (error) {
        console.log('Web Audio API not supported');
        return () => {};
      }
    };

    const cleanup = createAmbientMusic();
    return cleanup;
  }, [mood]);

  // Character expressions and colors based on mood
  const getMoodStyles = () => {
    switch (mood) {
      case 'excited':
        return {
          faceColor: '#FFE4E1',
          eyeColor: '#FF1493',
          mouthColor: '#FF6B6B',
          borderGlow: '#FFD700',
          outfitColor: '#FF69B4',
          accentColor: '#8A2BE2'
        };
      case 'listening':
        return {
          faceColor: '#FFF8DC',
          eyeColor: '#4169E1',
          mouthColor: '#87CEEB',
          borderGlow: '#00CED1',
          outfitColor: '#20B2AA',
          accentColor: '#FF6347'
        };
      case 'thinking':
        return {
          faceColor: '#F0E68C',
          eyeColor: '#8A2BE2',
          mouthColor: '#DDA0DD',
          borderGlow: '#BA55D3',
          outfitColor: '#9370DB',
          accentColor: '#FF7F50'
        };
      case 'encouraging':
        return {
          faceColor: '#FFE4B5',
          eyeColor: '#FF1493',
          mouthColor: '#FF69B4',
          borderGlow: '#FF1493',
          outfitColor: '#DC143C',
          accentColor: '#FFD700'
        };
      default:
        return {
          faceColor: '#FFFAF0',
          eyeColor: '#4A90E2',
          mouthColor: '#98D8E8',
          borderGlow: '#87CEEB',
          outfitColor: '#4682B4',
          accentColor: '#FF6347'
        };
    }
  };

  const styles = getMoodStyles();

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Stage lighting effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${styles.borderGlow}60 0%, transparent 70%)`,
          width: '200px',
          height: '200px',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />

      {/* Main Character Container */}
      <div 
        className={`relative w-40 h-40 transition-all duration-500 ease-in-out ${
          isPerforming ? 'animate-bounce' : ''
        }`}
        style={{
          filter: `drop-shadow(0 0 25px ${styles.borderGlow}60) drop-shadow(0 0 50px ${styles.accentColor}30)`
        }}
      >
        {/* Enhanced sparkle effects */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute rounded-full animate-ping"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}ms`,
              animationDuration: '2000ms',
              width: Math.random() > 0.5 ? '4px' : '6px',
              height: Math.random() > 0.5 ? '4px' : '6px',
              background: Math.random() > 0.5 ? styles.borderGlow : styles.accentColor
            }}
          />
        ))}

        {/* Character SVG */}
        <svg
          viewBox="0 0 140 140"
          className={`w-full h-full transition-transform duration-300 hover:scale-105 ${
            isPerforming ? 'animate-pulse' : ''
          }`}
        >
          {/* Stage/Platform */}
          <ellipse
            cx="70"
            cy="120"
            rx="50"
            ry="8"
            fill={styles.borderGlow}
            opacity="0.3"
            className={isPerforming ? 'animate-pulse' : ''}
          />

          {/* Body/Outfit */}
          <path
            d="M50 75 Q45 85 48 95 Q52 105 70 105 Q88 105 92 95 Q95 85 90 75 Z"
            fill={styles.outfitColor}
            stroke={styles.accentColor}
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Sparkly outfit details */}
          <circle cx="60" cy="85" r="2" fill={styles.accentColor} className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="80" cy="90" r="1.5" fill={styles.borderGlow} className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
          <circle cx="65" cy="95" r="1" fill="white" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

          {/* Head/Face */}
          <circle
            cx="70"
            cy="55"
            r="25"
            fill={styles.faceColor}
            stroke={styles.borderGlow}
            strokeWidth="3"
            className="transition-all duration-500"
          />

          {/* Glamorous Hair with flow animation */}
          <g className={mood === 'excited' || mood === 'encouraging' ? 'animate-pulse' : ''}>
            <path
              d="M45 40 Q35 25 45 20 Q55 15 70 20 Q85 15 95 20 Q105 25 95 40 Q100 45 95 50 Q90 45 85 48 Q80 43 70 45 Q60 43 55 48 Q50 45 45 50 Q40 45 45 40"
              fill="#8B008B"
              stroke={styles.accentColor}
              strokeWidth="2"
              style={{ transformOrigin: '70px 35px' }}
            />
            {/* Hair highlights */}
            <path
              d="M50 35 Q60 30 70 35 Q80 30 90 35"
              stroke="#FFD700"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
          </g>

          {/* Rockstar Sunglasses */}
          <g>
            <ellipse cx="60" cy="50" rx="8" ry="6" fill="#1a1a1a" stroke={styles.accentColor} strokeWidth="2" />
            <ellipse cx="80" cy="50" rx="8" ry="6" fill="#1a1a1a" stroke={styles.accentColor} strokeWidth="2" />
            <path d="M68 50 Q70 48 72 50" stroke={styles.accentColor} strokeWidth="2" fill="none" />
            {/* Lens reflections */}
            <ellipse cx="62" cy="48" rx="2" ry="3" fill="white" opacity="0.6" />
            <ellipse cx="82" cy="48" rx="2" ry="3" fill="white" opacity="0.6" />
          </g>

          {/* Nose */}
          <path
            d="M68 58 Q70 61 72 58"
            stroke={styles.borderGlow}
            strokeWidth="1"
            fill="none"
          />

          {/* Mouth - varies by mood with more dramatic expressions */}
          <path
            d={(() => {
              if (isSpeaking) {
                // Animated mouth for speaking
                return "M55 70 Q70 82 85 70 Q80 77 70 77 Q60 77 55 70";
              }
              switch (mood) {
                case 'excited':
                  return "M55 70 Q70 85 85 70 Q80 75 70 75 Q60 75 55 70";
                case 'listening':
                  return "M60 70 Q70 75 80 70";
                case 'thinking':
                  return "M62 70 Q70 72 78 70";
                case 'encouraging':
                  return "M50 70 Q70 90 90 70 Q85 78 70 78 Q55 78 50 70";
                default:
                  return "M58 70 Q70 75 82 70";
              }
            })()}
            stroke={styles.mouthColor}
            strokeWidth="4"
            fill={mood === 'excited' || mood === 'encouraging' || isSpeaking ? styles.mouthColor : 'none'}
            fillOpacity="0.3"
            strokeLinecap="round"
            className={`transition-all duration-300 ${isSpeaking ? 'animate-pulse' : ''}`}
          />

          {/* Lipstick shine */}
          {(mood === 'excited' || mood === 'encouraging') && (
            <ellipse cx="70" cy="72" rx="8" ry="2" fill="white" opacity="0.4" />
          )}

          {/* Microphone */}
          {(mood === 'encouraging' || mood === 'excited' || isSpeaking) && (
            <g transform="translate(100, 65)">
              <rect x="0" y="0" width="5" height="20" fill="#C0C0C0" />
              <circle cx="2.5" cy="-4" r="5" fill="#4A4A4A" />
              <circle cx="2.5" cy="-4" r="3" fill="#8A8A8A" />
              <circle cx="2.5" cy="-4" r="1" fill="white" className={isSpeaking ? "animate-ping" : "animate-ping"} />
              {/* Mic cord */}
              <path d="M2.5 20 Q8 25 6 30" stroke="#333" strokeWidth="2" fill="none" />
              
              {/* Sound waves when speaking */}
              {isSpeaking && (
                <g className="animate-pulse">
                  <path d="M12 -4 Q16 -8 20 -4 Q16 0 12 -4" stroke={styles.borderGlow} strokeWidth="1" fill="none" opacity="0.8" />
                  <path d="M12 -4 Q18 -10 24 -4 Q18 2 12 -4" stroke={styles.borderGlow} strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M12 -4 Q20 -12 28 -4 Q20 4 12 -4" stroke={styles.borderGlow} strokeWidth="1" fill="none" opacity="0.4" />
                </g>
              )}
            </g>
          )}

          {/* Musical notes with animation */}
          {(mood === 'excited' || mood === 'encouraging') && (
            <g className="animate-bounce">
              <text x="25" y="35" fontSize="12" fill={styles.accentColor} className="animate-pulse">♪</text>
              <text x="110" y="45" fontSize="10" fill={styles.borderGlow} className="animate-pulse" style={{ animationDelay: '0.5s' }}>♫</text>
              <text x="20" y="80" fontSize="8" fill={styles.mouthColor} className="animate-pulse" style={{ animationDelay: '1s' }}>♪</text>
              <text x="115" y="85" fontSize="11" fill={styles.accentColor} className="animate-pulse" style={{ animationDelay: '1.5s' }}>♬</text>
            </g>
          )}

          {/* Thought bubble for thinking mood */}
          {mood === 'thinking' && (
            <g>
              <ellipse cx="95" cy="30" rx="8" ry="6" fill="white" stroke={styles.borderGlow} strokeWidth="2" />
              <circle cx="90" cy="35" r="3" fill="white" stroke={styles.borderGlow} strokeWidth="1" />
              <circle cx="85" cy="40" r="2" fill="white" stroke={styles.borderGlow} strokeWidth="1" />
              <text x="90" y="33" fontSize="8" fill={styles.accentColor}>💭</text>
            </g>
          )}

          {/* Sound waves for listening mood */}
          {mood === 'listening' && (
            <g className="animate-pulse">
              <path d="M15 55 Q20 50 25 55 Q20 60 15 55" stroke={styles.borderGlow} strokeWidth="2" fill="none" />
              <path d="M10 55 Q18 45 26 55 Q18 65 10 55" stroke={styles.borderGlow} strokeWidth="1" fill="none" opacity="0.7" />
              <path d="M115 55 Q120 50 125 55 Q120 60 115 55" stroke={styles.borderGlow} strokeWidth="2" fill="none" />
              <path d="M114 55 Q122 45 130 55 Q122 65 114 55" stroke={styles.borderGlow} strokeWidth="1" fill="none" opacity="0.7" />
            </g>
          )}

          {/* Confidence aura for encouraging mood */}
          {mood === 'encouraging' && (
            <g className="animate-pulse" opacity="0.6">
              <circle cx="70" cy="55" r="35" fill="none" stroke={styles.borderGlow} strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="70" cy="55" r="45" fill="none" stroke={styles.accentColor} strokeWidth="1" strokeDasharray="3,3" />
            </g>
          )}
        </svg>

        {/* Typing indicator */}
        {isTyping && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1 bg-gray-800 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Character message with diva flair */}
      {message && (
        <div className="mt-6 max-w-sm">
          <div 
            className="text-white px-6 py-4 rounded-2xl text-sm relative shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${styles.outfitColor}90, ${styles.accentColor}90)`,
              border: `2px solid ${styles.borderGlow}`,
              boxShadow: `0 0 20px ${styles.borderGlow}40`
            }}
          >
            <div className="font-medium">{message}</div>
            <div 
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rotate-45"
              style={{ background: `linear-gradient(135deg, ${styles.outfitColor}, ${styles.accentColor})` }}
            ></div>
          </div>
        </div>
      )}

      {/* Mood indicator */}
      <div className="mt-2 text-xs text-center text-gray-400 capitalize">
        {mood === 'encouraging' ? '🎤 Motivating' : 
         mood === 'excited' ? '✨ Vibing' :
         mood === 'listening' ? '👂 Listening' :
         mood === 'thinking' ? '💭 Reflecting' : '😎 Chillin\''}
      </div>
    </div>
  );
}