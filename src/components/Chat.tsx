import React, { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-2xl p-3 ${
              msg.type === 'user'
                ? 'bg-primary-600/50 ml-auto'
                : msg.type === 'suggestion'
                ? 'bg-surface-700/50'
                : 'bg-surface-700/80'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="p-2 border-t border-surface-700 flex gap-2 flex-wrap">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-surface-700 hover:bg-surface-600 transition-colors"
              onClick={() => onSendMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-surface-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-surface-700/50 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary-600 text-primary-50 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}