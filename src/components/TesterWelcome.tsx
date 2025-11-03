import React, { useEffect, useState } from 'react';
import { isFirstTimeVisitor, getTesterIdentity } from '../lib/testerIdentity';

export default function TesterWelcome() {
  const [show, setShow] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    // Check on mount if this is a new visitor
    const firstTime = isFirstTimeVisitor();
    setIsNew(firstTime);
    
    // Get identity (creates one if needed)
    const identity = getTesterIdentity();
    
    // Show welcome message briefly
    if (firstTime || identity.sessionCount <= 2) {
      setShow(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const identity = getTesterIdentity();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="rounded-xl border border-primary-500/30 bg-surface-800/95 backdrop-blur p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-primary-100 mb-1">
              {isNew ? 'Welcome to Testing!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs text-surface-300 leading-relaxed mb-2">
              {isNew ? (
                <>Your session data will be saved automatically. Test features over multiple days—we'll remember your progress!</>
              ) : (
                <>Session {identity.sessionCount} • Testing since {new Date(identity.firstVisit).toLocaleDateString()}</>
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span className="inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Anonymous ID: {identity.id.slice(-8)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 text-surface-400 hover:text-surface-200 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
