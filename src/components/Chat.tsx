import React, { useState, useEffect } from 'react';

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
  placeholder?: string;
};

export default function Chat({ messages, onSendMessage, suggestions = [], className = '', placeholder = 'Type your response or question...' }: Props) {
  const [input, setInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Monitor for AI typing (when a system message is being added)
  const didMountRef = React.useRef(false);
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    // Skip initial mount to avoid disabling input in tests and on first render
    if (!didMountRef.current) {
      didMountRef.current = true;
      setIsAITyping(false);
      return;
    }
    if (lastMessage?.type === 'user') {
      setIsAITyping(true);
      const timeout = setTimeout(() => {
        setIsAITyping(false);
      }, 800);
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

  return (
    <div className={`flex flex-col h-full ${className} bg-surface-800/50 rounded-xl border border-surface-700`}>
      {/* Professional header */}
      <div className="border-b border-surface-700/50 px-6 py-4 bg-surface-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-surface-50">Strategic Planning Assistant</h3>
            <p className="text-sm text-surface-400 mt-0.5">
              {messages.filter(m => m.type === 'user').length === 0 
                ? 'Let\'s create a data-driven roadmap for your next release'
                : `${messages.filter(m => m.type === 'user').length} response${messages.filter(m => m.type === 'user').length === 1 ? '' : 's'} • Building your strategic plan`}
            </p>
          </div>
          {isAITyping && (
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages area - clean and professional */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-lg p-4 ${
              msg.type === 'user'
                ? 'bg-primary-600/20 ml-auto text-surface-50 border border-primary-500/30'
                : msg.type === 'suggestion'
                ? 'bg-surface-700/30 text-surface-200 border border-surface-600/30'
                : 'bg-surface-700/50 text-surface-100 border border-surface-600/40'
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        ))}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2" aria-label="suggestions">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="max-w-[85%] text-left w-full rounded-lg p-3 bg-surface-700/30 text-surface-200 border border-surface-600/30 hover:bg-surface-700/50 transition"
                onClick={() => onSendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Clean typing indicator */}
        {isAITyping && (
          <div className="max-w-[85%]">
            <div className="bg-surface-700/50 border border-surface-600/40 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-xs text-surface-400">Analyzing your response...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional input area */}
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-surface-700/50 bg-surface-800/40">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-surface-700/50 rounded-lg px-4 py-3 text-sm text-surface-100 placeholder-surface-400 border border-surface-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            disabled={isAITyping}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || isAITyping}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
          >
            {isAITyping ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Help text */}
        <div className="mt-2 text-xs text-surface-500">
          Press Enter to send • Be specific about your goals and constraints
        </div>
      </form>
    </div>
  );
}