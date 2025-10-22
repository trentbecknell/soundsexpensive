import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat, { ChatMessage } from '../components/Chat';

describe('Chat Component', () => {
  const mockMessages: ChatMessage[] = [
    { id: '1', type: 'system', content: 'Welcome to the assessment' },
    { id: '2', type: 'user', content: 'I need help with my project' }
  ];
  const mockSuggestions = [
    'I write my own songs',
    'I collaborate with others',
    'I need production help'
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
        suggestions={mockSuggestions}
      />
    );

    // Check if messages are displayed
    expect(screen.getByText('Welcome to the assessment')).toBeInTheDocument();
    expect(screen.getByText('I need help with my project')).toBeInTheDocument();
  });

  it('displays suggestion buttons', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
        suggestions={mockSuggestions}
      />
    );

    mockSuggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  it('handles sending a message', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
        suggestions={[]}
      />
    );

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'My test message' } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('My test message');
  });

  it('handles clicking suggestion buttons', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
        suggestions={mockSuggestions}
      />
    );

    fireEvent.click(screen.getByText(mockSuggestions[0]));
    expect(mockOnSendMessage).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('prevents sending empty messages', () => {
    render(
      <Chat 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage}
        suggestions={[]}
      />
    );

    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});