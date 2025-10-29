import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat, { ChatMessage } from '../components/Chat';

describe('Chat Component', () => {
  const mockMessages: ChatMessage[] = [
    { id: '1', type: 'system', content: 'Welcome to the strategic planning session' },
    { id: '2', type: 'user', content: 'I need help planning my next release' }
  ];
  const mockOnSendMessage = vi.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders messages correctly', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
      />
    );

    // Check if messages are displayed
    expect(screen.getByText('Welcome to the strategic planning session')).toBeInTheDocument();
    expect(screen.getByText('I need help planning my next release')).toBeInTheDocument();
  });

  it('handles sending a message', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Type your response or question...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'My test message' } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('My test message');
  });

  it('prevents sending empty messages', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
      />
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});