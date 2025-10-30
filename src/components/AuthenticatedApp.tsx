/**
 * AuthenticatedApp Wrapper Component
 * 
 * This component wraps the main App and provides Clerk authentication context.
 * When Clerk is disabled, it passes userId=undefined (anonymous mode).
 * When Clerk is enabled, it waits for authentication and passes the user's Clerk ID.
 * 
 * This enables:
 * - User-scoped data storage (different users see different portfolios)
 * - Multi-user support on same browser
 * - Future cloud sync with Supabase
 */

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import App from '../App';

/**
 * Loading screen shown while Clerk authentication initializes
 */
function LoadingScreen() {
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#18181b',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ color: '#a1a1aa', fontSize: 20 }}>
        Loading authentication...
      </div>
      <div style={{ color: '#71717a', fontSize: 14 }}>
        Please wait while we verify your session
      </div>
    </div>
  );
}

/**
 * Error screen shown if Clerk fails to load
 */
function ErrorScreen({ error }: { error: string }) {
  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#18181b',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}
    >
      <div style={{ color: '#ef4444', fontSize: 20, fontWeight: 600 }}>
        Authentication Error
      </div>
      <div style={{ color: '#a1a1aa', fontSize: 14, maxWidth: '500px', textAlign: 'center' }}>
        {error}
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Reload Page
      </button>
    </div>
  );
}

/**
 * Main wrapper component
 * 
 * Usage when Clerk is ENABLED:
 * ```tsx
 * <ClerkProvider publishableKey={key}>
 *   <AuthenticatedApp />
 * </ClerkProvider>
 * ```
 * 
 * Usage when Clerk is DISABLED:
 * ```tsx
 * <AuthenticatedApp />
 * ```
 */
export default function AuthenticatedApp() {
  // If this component is rendered outside ClerkProvider, useUser will throw.
  // We wrap it in a try-catch to gracefully handle anonymous mode.
  let user: any = null;
  let isLoaded = true;
  let error: string | null = null;

  try {
    const clerkUser = useUser();
    user = clerkUser.user;
    isLoaded = clerkUser.isLoaded;
  } catch (err) {
    // Clerk not available - run in anonymous mode
    console.log('ℹ️ Running in anonymous mode (Clerk disabled)');
  }

  // Show loading screen while Clerk initializes
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Show error screen if authentication failed
  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Pass user ID to App (undefined = anonymous mode)
  const userId = user?.id;
  
  if (userId) {
    console.log('✅ Authenticated as:', user.primaryEmailAddress?.emailAddress || userId);
  } else {
    console.log('ℹ️ Running in anonymous mode');
  }

  return <App userId={userId} />;
}
