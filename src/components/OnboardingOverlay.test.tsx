import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingOverlay, { shouldShowOnboarding, resetOnboarding } from './OnboardingOverlay';

const ONBOARDING_STORAGE_KEY = 'artist-roadmap-onboarding-dismissed';

describe('OnboardingOverlay', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show onboarding on first visit', () => {
    render(<OnboardingOverlay />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Artist Roadmap')).toBeInTheDocument();
    expect(screen.getByText(/Plan your music project from idea to release/)).toBeInTheDocument();
  });

  it('should display interactive prompts', () => {
    render(<OnboardingOverlay />);
    
    expect(screen.getByText('Start with Assessment')).toBeInTheDocument();
    expect(screen.getByText('Build Your Budget')).toBeInTheDocument();
    expect(screen.getByText('Create Your Timeline')).toBeInTheDocument();
  });

  it('should dismiss when clicked anywhere', () => {
    const onDismiss = vi.fn();
    render(<OnboardingOverlay onDismiss={onDismiss} />);
    
    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should dismiss when "Get Started" button is clicked', () => {
    const onDismiss = vi.fn();
    render(<OnboardingOverlay onDismiss={onDismiss} />);
    
    const button = screen.getByText('Get Started');
    fireEvent.click(button);
    
      // Button click bubbles to overlay, so onDismiss called twice
      expect(onDismiss).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should set localStorage on first view', () => {
    render(<OnboardingOverlay />);
    
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    expect(data).toBeTruthy();
    
    const parsed = JSON.parse(data!);
    expect(parsed.count).toBe(1);
    expect(parsed.lastSeen).toBeDefined();
  });

  it('should show again on second visit', () => {
    // First visit
    const { unmount } = render(<OnboardingOverlay />);
    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);
    unmount();
    
    // Second visit
    render(<OnboardingOverlay />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const parsed = JSON.parse(data!);
    expect(parsed.count).toBe(2);
  });

  it('should not show after 2 views', () => {
    // Set count to 2
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ count: 2, lastSeen: Date.now() })
    );
    
    render(<OnboardingOverlay />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shouldShowOnboarding should return true for first visit', () => {
    expect(shouldShowOnboarding()).toBe(true);
  });

  it('shouldShowOnboarding should return false after 2 views', () => {
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ count: 2, lastSeen: Date.now() })
    );
    
    expect(shouldShowOnboarding()).toBe(false);
  });

  it('resetOnboarding should clear localStorage', () => {
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ count: 2, lastSeen: Date.now() })
    );
    
    resetOnboarding();
    
    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBeNull();
    expect(shouldShowOnboarding()).toBe(true);
  });

  it('should handle corrupted localStorage data', () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'invalid-json');
    
    render(<OnboardingOverlay />);
    
    // Should show onboarding and reset to valid data
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const parsed = JSON.parse(data!);
    expect(parsed.count).toBe(1);
  });

  it('should display accessibility attributes', () => {
    render(<OnboardingOverlay />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'onboarding-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'onboarding-description');
  });

  it('should show message about showing once more', () => {
    render(<OnboardingOverlay />);
    
    expect(screen.getByText(/This will show once more on your next visit/)).toBeInTheDocument();
  });
});
