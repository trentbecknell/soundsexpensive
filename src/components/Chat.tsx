import React, { useState, useEffect } from 'react';
import AICharacter from './AICharacter';

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

export default function Chat({ messages, onSendMessage, suggestions = [], className = '' }: Props) {
  const [input, setInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiMood, setAiMood] = useState<'neutral' | 'excited' | 'listening' | 'thinking' | 'encouraging'>('neutral');

  // Determine AI mood based on conversation state
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const userMessages = messages.filter(m => m.type === 'user');
    
    if (isAITyping) {
      setAiMood('thinking');
    } else if (lastMessage?.type === 'user') {
      setAiMood('listening');
    } else if (userMessages.length >= 2) {
      setAiMood('excited');
    } else if (userMessages.length >= 1) {
      setAiMood('encouraging');
    } else {
      setAiMood('neutral');
    }
  }, [messages, isAITyping]);

  // Monitor for AI typing (when a system message is being added)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'user') {
      setIsAITyping(true);
      // Reset typing after AI responds
      const timeout = setTimeout(() => {
        setIsAITyping(false);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setIsAITyping(false);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const getCharacterMessage = () => {
    const userMessages = messages.filter(m => m.type === 'user');
    if (isAITyping) return "Let me think about that...";
    if (userMessages.length === 0) return "Tell me about your sound!";
    if (userMessages.length === 1) return "Great start! Keep sharing...";
    if (userMessages.length >= 3) return "I'm getting a great sense of your style!";
    return "This is really helpful!";
  };

  return (
    <div className={`flex flex-col h-full ${className} bg-surface-800/30 rounded-xl border border-surface-700`}>
      {/* AI Character - positioned at top */}
      <div className="flex justify-center p-4 border-b border-surface-700/50">
        <AICharacter 
          isTyping={isAITyping}
          mood={aiMood}
          message={getCharacterMessage()}
        />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-2xl p-4 ${
              msg.type === 'user'
                ? 'bg-primary-600/60 ml-auto text-primary-50'
                : msg.type === 'suggestion'
                ? 'bg-surface-700/50 text-surface-200'
                : 'bg-surface-700/80 text-surface-100'
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-surface-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Share your sound, style, or artistic vision..."
            className="flex-1 bg-surface-700/50 rounded-xl px-4 py-3 text-sm text-surface-100 placeholder-surface-400 border border-surface-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-primary-50 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}