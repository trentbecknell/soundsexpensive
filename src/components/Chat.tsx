import React, { useState, useEffect } from 'react';
import AICharacter from './AICharacter';
import VoiceControls from './VoiceControls';
import { soundEffects } from '../lib/soundEffects';
import { voiceManager } from '../lib/voiceManager';

export type ChatMessage = {
  id: string;
  type: 'system' | 'user' | 'suggestion';
  content: string;
};

type Props = {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  suggestions?: string[];
  className?: string;
};

const DIVA_RESPONSES = [
  "Honey, that's exactly the kind of authenticity that sets stars apart! ✨",
  "Ooh, I'm getting major vibes from that! Tell me more, darling! 💫",
  "Now THAT'S what I'm talking about! You've got that special something! 🎤",
  "Beautiful! I can already hear your unique voice shining through! 🌟",
  "Yasss! That's the kind of vision that creates magic! Keep going! ✨",
  "Love it! You're painting such a vivid picture of your artistry! 🎨",
  "Oh honey, you're speaking my language! That's pure artistry! 💎",
  "Gorgeous! I can feel the passion in your words! 🔥",
  "Perfect! That's the kind of depth that connects with souls! 💖",
  "Stunning! You're creating something truly special here! ⭐"
];

const ENCOURAGEMENT_PROMPTS = [
  "What emotions do you want your listeners to feel when they hear your music?",
  "If your music was a color, what would it be and why?",
  "What's the story behind your artistic journey that shapes your sound?",
  "How do you want people to feel when they leave one of your shows?",
  "What makes your voice unique in a crowded music landscape?",
  "What's the most important message you want to share through your art?",
  "Describe the perfect moment when someone truly connects with your music.",
  "What's your biggest dream for your music career?",
  "How does your personal story influence the music you create?",
  "What would you tell someone who's never heard your music before?"
];

export default function Chat({ messages, onSendMessage, suggestions = [], className = '' }: Props) {
  const [input, setInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiMood, setAiMood] = useState<'neutral' | 'excited' | 'listening' | 'thinking' | 'encouraging'>('neutral');
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [lastSystemMessage, setLastSystemMessage] = useState<string>('');

  // Determine AI mood based on conversation state
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const userMessages = messages.filter(m => m.type === 'user');
    let newMood: typeof aiMood = 'neutral';
    
    if (isAITyping) {
      newMood = 'thinking';
    } else if (lastMessage?.type === 'user') {
      // Analyze user message content for mood
      const content = lastMessage.content.toLowerCase();
      if (content.includes('excited') || content.includes('love') || content.includes('amazing') || content.includes('passionate')) {
        newMood = 'excited';
      } else if (content.includes('help') || content.includes('stuck') || content.includes('difficult') || content.includes('challenge')) {
        newMood = 'encouraging';
      } else {
        newMood = 'listening';
      }
    } else if (userMessages.length >= 3) {
      newMood = 'excited';
    } else if (userMessages.length >= 1) {
      newMood = 'encouraging';
    } else {
      newMood = 'neutral';
    }
    
    // Play sound effect for mood changes
    if (newMood !== aiMood) {
      soundEffects.playMoodTransition(newMood);
    }
    
    setAiMood(newMood);
  }, [messages, isAITyping, aiMood]);

  // Monitor for AI typing (when a system message is being added)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'user') {
      setIsAITyping(true);
      soundEffects.playTypingStart(); // Sound effect for AI starting to type
      
      // Reset typing after AI responds with dramatic timing
      const timeout = setTimeout(() => {
        setIsAITyping(false);
      }, 1200 + Math.random() * 800);
      return () => clearTimeout(timeout);
    } else {
      setIsAITyping(false);
    }
  }, [messages]);

  // Monitor for new system messages to potentially speak
  useEffect(() => {
    const systemMessages = messages.filter(m => m.type === 'system');
    if (systemMessages.length > 0) {
      const latest = systemMessages[systemMessages.length - 1].content;
      if (latest !== lastSystemMessage && !isAITyping) {
        setLastSystemMessage(latest);
        // Auto-speak new system messages if voice is enabled
        speakMessage(latest);
      }
    }
  }, [messages, isAITyping, lastSystemMessage]);

  // Voice interaction handlers
  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      onSendMessage(transcript);
    }
  };

  const speakMessage = async (message: string) => {
    try {
      setIsCharacterSpeaking(true);
      await voiceManager.speak(message);
    } catch (error) {
      console.error('Error speaking message:', error);
    } finally {
      setIsCharacterSpeaking(false);
    }
  };

  const handleSpeakMessage = (message: string) => {
    speakMessage(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Play sound effect for message sent
    soundEffects.playMessageSent();
    
    onSendMessage(input);
    setInput('');
  };

  const getCharacterMessage = () => {
    const userMessages = messages.filter(m => m.type === 'user');
    
    if (isAITyping) {
      const thinkingMessages = [
        "Let me vibe with that, gorgeous...",
        "Ooh, feeling your energy, give me a sec...",
        "That's hitting different, let me process...",
        "I'm getting some serious inspiration from this..."
      ];
      return thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    }
    
    if (userMessages.length === 0) {
      return "Hey superstar! Ready to dive deep into your artistic soul? Tell me what moves you! 🌟";
    } else if (userMessages.length === 1) {
      return "Mmm, I'm loving this energy! Keep painting that picture for me, darling! ✨";
    } else if (userMessages.length === 2) {
      return "Now we're cooking with gas! Your vision is starting to sparkle! 💫";
    } else if (userMessages.length >= 3) {
      return "Baby, you are SERVING artistic authenticity! I'm getting goosebumps! 🔥";
    }
    
    return DIVA_RESPONSES[Math.floor(Math.random() * DIVA_RESPONSES.length)];
  };

  const getRandomPrompt = () => {
    return ENCOURAGEMENT_PROMPTS[Math.floor(Math.random() * ENCOURAGEMENT_PROMPTS.length)];
  };

  const handleQuickResponse = (response: string) => {
    setInput(response);
  };

  return (
    <div className={`flex flex-col h-full ${className} bg-gradient-to-br from-surface-800/40 to-surface-900/60 rounded-xl border border-surface-700 backdrop-blur`}>
      {/* AI Character - positioned at top with stage lighting */}
      <div className="relative">
        {/* Stage lighting background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(circle at center, #FF1493 0%, #8A2BE2 50%, transparent 80%)',
            filter: 'blur(20px)'
          }}
        />
        
        <div className="relative flex justify-center p-6 border-b border-surface-700/50">
          <AICharacter 
            isTyping={isAITyping}
            mood={aiMood}
            message={getCharacterMessage()}
            isSpeaking={isCharacterSpeaking}
          />
        </div>
      </div>

      {/* Messages area with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-2xl p-4 ${
              msg.type === 'user'
                ? 'bg-gradient-to-r from-primary-600/80 to-primary-700/80 ml-auto text-primary-50 shadow-lg border border-primary-500/30'
                : msg.type === 'suggestion'
                ? 'bg-surface-700/50 text-surface-200 border border-surface-600/50'
                : 'bg-gradient-to-r from-surface-700/90 to-surface-600/90 text-surface-100 border border-pink-500/20 shadow-md'
            }`}
            style={{
              boxShadow: msg.type === 'system' 
                ? '0 0 15px rgba(255, 20, 147, 0.15)' 
                : undefined
            }}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        ))}

        {/* Enhanced typing indicator */}
        {isAITyping && (
          <div className="max-w-[85%]">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur border border-pink-500/30 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-purple-300 italic font-medium">Your diva mentor is channeling the vibes...</span>
                <div className="flex space-x-1">
                  <span className="animate-pulse">✨</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>💫</span>
                  <span className="animate-pulse" style={{ animationDelay: '1s' }}>⭐</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick inspiration prompts */}
      {messages.filter(m => m.type === 'user').length > 0 && messages.filter(m => m.type === 'user').length < 4 && !isAITyping && (
        <div className="px-4 py-2 border-t border-surface-700/30">
          <div className="text-xs text-center text-surface-400 mb-3 flex items-center justify-center gap-2">
            <span className="animate-pulse">💡</span>
            <span>Need a creative spark? Try this:</span>
            <span className="animate-pulse">💡</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => handleQuickResponse(getRandomPrompt())}
              className="text-xs px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-purple-200 rounded-full transition-all duration-300 border border-purple-400/30 hover:border-pink-400/40 shadow-sm hover:shadow-md max-w-sm text-center"
            >
              {getRandomPrompt()}
            </button>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <div className="px-4 py-3 border-t border-surface-700/30 bg-surface-800/20">
        <VoiceControls
          onTranscript={handleVoiceTranscript}
          onSpeakMessage={handleSpeakMessage}
          isCharacterSpeaking={isCharacterSpeaking}
        />
      </div>

      {/* Enhanced input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-surface-700/50 bg-surface-800/30 backdrop-blur">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Share your artistic soul with me, darling... ✨"
              className="w-full bg-surface-700/60 backdrop-blur rounded-xl px-4 py-3 pr-12 text-sm text-surface-100 placeholder-surface-400 border border-surface-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
              disabled={isAITyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <span className="text-pink-400 animate-pulse text-lg">💫</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isAITyping}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-surface-600 disabled:to-surface-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none border border-pink-500/30 hover:border-pink-400/50"
            style={{
              boxShadow: !isAITyping && input.trim() ? '0 0 20px rgba(236, 72, 153, 0.25)' : undefined
            }}
          >
            {isAITyping ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Send</span>
                <span className="text-lg">🎤</span>
              </span>
            )}
          </button>
        </div>
        
        {/* Motivational footer */}
        <div className="mt-3 text-center text-xs text-surface-400">
          <div className="flex items-center justify-center space-x-2">
            <span className="animate-pulse">🌟</span>
            <span>Your artistic journey is unique and powerful - let's unlock it together!</span>
            <span className="animate-pulse">🌟</span>
          </div>
        </div>
      </form>
    </div>
  );
}