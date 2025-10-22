import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssessmentWizard from '../components/AssessmentWizard';
import { QUESTIONS } from '../data/assessment-questions';

describe('AssessmentWizard Component', () => {
  const mockInitialAnswers = {
    craft: 1,
    catalog: 1,
    brand: 1,
    team: 1,
    audience: 1,
    ops: 1
  };
  const mockOnFinish = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnFinish.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders the first question initially', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
    expect(screen.getByText(QUESTIONS[0].help)).toBeInTheDocument();
  });

  it('allows navigation between questions', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText(QUESTIONS[1].title)).toBeInTheDocument();

    const prevButton = screen.getByText('Prev');
    fireEvent.click(prevButton);

    expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
  });

  it('handles chat toggle', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    const showChatButton = screen.getByText('Show chat');
    fireEvent.click(showChatButton);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();

    const hideChatButton = screen.getByText('Hide chat');
    fireEvent.click(hideChatButton);

    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
  });

  it('saves changes on finish', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    // Navigate to the end
    const nextButton = screen.getByText('Next');
    QUESTIONS.forEach(() => {
      fireEvent.click(nextButton);
    });

    // Verify we're on the review screen
    expect(screen.getByText('Review your answers')).toBeInTheDocument();

    // Save changes
    const saveButton = screen.getByText('Save & Finish');
    fireEvent.click(saveButton);

    expect(mockOnFinish).toHaveBeenCalled();
  });

  it('handles cancellation', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows chat suggestions based on current question', () => {
    render(
      <AssessmentWizard
        initialAnswers={mockInitialAnswers}
        onFinish={mockOnFinish}
        onCancel={mockOnCancel}
      />
    );

    // Show chat
    const showChatButton = screen.getByText('Show chat');
    fireEvent.click(showChatButton);

    // First question suggestions should be visible
    expect(screen.getByText('I write and produce my own music')).toBeInTheDocument();

    // Navigate to next question
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should show new suggestions
    expect(screen.getByText('I have several demos')).toBeInTheDocument();
  });
});