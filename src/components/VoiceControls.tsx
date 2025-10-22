import React, { useState, useEffect } from 'react';
import { voiceManager, SpeechRecognitionResult } from '../lib/voiceManager';
import VoiceSettingsModal from './VoiceSettingsModal';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  onSpeakMessage: (message: string) => void;
  isCharacterSpeaking?: boolean;
  className?: string;
}

export default function VoiceControls({ 
  onTranscript, 
  onSpeakMessage, 
  isCharacterSpeaking = false,
  className = '' 
}: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize voice manager and check support
    setIsSupported(voiceManager.getIsSupported() && voiceManager.getIsSpeechSynthesisSupported());

    // Set up event listeners
    voiceManager.onTranscript((result: SpeechRecognitionResult) => {
      setCurrentTranscript(result.transcript);
      
      if (result.isFinal && result.transcript.trim()) {
        onTranscript(result.transcript);
        setCurrentTranscript('');
      }
    });

    voiceManager.onListeningChange((listening: boolean) => {
      setIsListening(listening);
      if (!listening) {
        setCurrentTranscript('');
        setAudioLevel(0);
      }
    });

    voiceManager.onError((errorMessage: string) => {
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    });

    // Cleanup on unmount
    return () => {
      voiceManager.destroy();
    };
  }, [onTranscript]);

  // Audio level animation effect
  useEffect(() => {
    let animationFrame: number;
    
    if (isListening) {
      const animateAudioLevel = () => {
        // Simulate audio level with random values when listening
        setAudioLevel(Math.random() * 0.8 + 0.2);
        animationFrame = requestAnimationFrame(animateAudioLevel);
      };
      animateAudioLevel();
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isCharacterSpeaking) {
      voiceManager.stopSpeaking();
    }
    
    voiceManager.toggleListening();
  };

  const speakLastMessage = () => {
    // This would typically speak the last AI message
    onSpeakMessage('Let me speak that for you, darling!');
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-3 bg-surface-700/50 rounded-lg border border-surface-600 ${className}`}>
        <div className="text-sm text-surface-400 mb-2">🎤 Voice features not supported</div>
        <div className="text-xs text-surface-500">
          Please use a modern browser with microphone access for voice interaction
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Microphone Button */}
      <div className="relative">
        <button
          onClick={toggleListening}
          disabled={isCharacterSpeaking}
          className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-400 shadow-lg animate-pulse'
              : isCharacterSpeaking
              ? 'bg-surface-600 border-surface-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg'
          }`}
          style={{
            boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.5)' : undefined
          }}
        >
          {/* Microphone Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform duration-200 ${isListening ? 'scale-110' : ''}`}
          >
            <path
              d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2Z"
              fill="currentColor"
              className="text-white"
            />
            <path
              d="M19 10V12C19 15.86 15.86 19 12 19C8.14 19 5 15.86 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z"
              fill="currentColor"
              className="text-white"
            />
            <path
              d="M12 19V22H16V24H8V22H12V19Z"
              fill="currentColor"
              className="text-white"
            />
          </svg>

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-75" />
          )}
        </button>

        {/* Audio Level Bars */}
        {isListening && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(2, audioLevel * 20 * (i + 1) / 5)}px`,
                  opacity: audioLevel > (i / 5) ? 1 : 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status Display */}
      <div className="flex-1 min-w-0">
        {error ? (
          <div className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30">
            ⚠️ {error}
          </div>
        ) : isListening ? (
          <div className="text-xs bg-gradient-to-r from-red-500/20 to-pink-500/20 px-3 py-2 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-red-300 font-medium">Listening...</span>
            </div>
            {currentTranscript && (
              <div className="text-surface-200 italic">"{currentTranscript}"</div>
            )}
          </div>
        ) : isCharacterSpeaking ? (
          <div className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              <span className="text-purple-300 font-medium">Diva is speaking...</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-surface-400 px-3 py-2">
            <div className="flex items-center gap-2">
              <span>🎤</span>
              <span>Tap to speak with your diva mentor</span>
            </div>
          </div>
        )}
      </div>

      {/* Speech Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSpeechEnabled
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-surface-600 text-surface-400 border border-surface-500'
          }`}
          title={isSpeechEnabled ? 'Disable character voice' : 'Enable character voice'}
        >
          {isSpeechEnabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </button>

        {/* Speaker Button for Re-speaking */}
        <button
          onClick={speakLastMessage}
          disabled={isCharacterSpeaking || isListening}
          className="w-8 h-8 rounded-full bg-surface-600 hover:bg-surface-500 disabled:opacity-50 disabled:cursor-not-allowed text-surface-300 hover:text-surface-200 flex items-center justify-center transition-all"
          title="Repeat last message"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </button>

        {/* Voice Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 rounded-full bg-surface-600 hover:bg-surface-500 text-surface-300 hover:text-surface-200 flex items-center justify-center transition-all"
          title="Voice settings"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
          </svg>
        </button>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}