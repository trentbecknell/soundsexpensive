import { useState, useEffect } from 'react';

interface OnboardingOverlayProps {
  onDismiss?: () => void;
}

const ONBOARDING_STORAGE_KEY = 'artist-roadmap-onboarding-dismissed';
const MAX_ONBOARDING_VIEWS = 2;

/**
 * OnboardingOverlay - First-time user guidance
 * 
 * Shows interactive instructions for new users:
 * - Brief app purpose explanation (< 2 sentences)
 * - Interactive prompts ("Tap to add layers", "Swipe for mix")
 * - Dismissible with tap
 * - Shows max 2 times, then permanently hidden
 */
export default function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed onboarding
    const dismissedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    
    if (!dismissedData) {
      // First time - show onboarding
      setIsVisible(true);
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ count: 1, lastSeen: Date.now() }));
    } else {
      try {
        const { count } = JSON.parse(dismissedData);
        if (count < MAX_ONBOARDING_VIEWS) {
          // Show again (2nd time)
          setIsVisible(true);
          localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ count: count + 1, lastSeen: Date.now() }));
        }
        // count >= 2: permanently hidden
      } catch {
        // Invalid data, reset
        setIsVisible(true);
        localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ count: 1, lastSeen: Date.now() }));
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleDismiss}
      role="dialog"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <div className="max-w-lg mx-4 p-8 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl shadow-2xl border border-purple-500/30">
        {/* App Purpose */}
        <div className="text-center mb-8">
          <h2 id="onboarding-title" className="text-3xl font-bold text-white mb-4">
            Welcome to Artist Roadmap
          </h2>
          <p id="onboarding-description" className="text-lg text-purple-100">
            Plan your music project from idea to release with AI-powered budgeting, timeline planning, and industry insights.
          </p>
        </div>

        {/* Interactive Prompts */}
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Start with Assessment</h3>
              <p className="text-sm text-purple-200">
                Answer questions about your music and goals to get personalized recommendations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Build Your Budget</h3>
              <p className="text-sm text-purple-200">
                Add budget items, explore grants, and analyze your catalog for revenue potential
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Create Your Timeline</h3>
              <p className="text-sm text-purple-200">
                Visualize your roadmap with phase-by-phase tasks and milestones
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss Instructions */}
        <div className="text-center">
          <button
            onClick={handleDismiss}
            className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            Get Started
          </button>
          <p className="mt-4 text-xs text-purple-300">
            Tap anywhere to dismiss • This will show once more on your next visit
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Utility function to check if onboarding should be shown
 */
export function shouldShowOnboarding(): boolean {
  const dismissedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!dismissedData) return true;
  
  try {
    const { count } = JSON.parse(dismissedData);
    return count < MAX_ONBOARDING_VIEWS;
  } catch {
    return true;
  }
}

/**
 * Utility function to reset onboarding (for testing)
 */
export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
