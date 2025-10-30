import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

export default function SignOutPage() {
  const navigate = useNavigate();
  let signOutFn: (() => Promise<void>) | null = null;

  // Safely access Clerk's signOut; if ClerkProvider isn't available, this component
  // will only be rendered in auth-enabled routes guarded by <SignedIn/>, so it's safe.
  try {
    const { signOut } = useClerk();
    signOutFn = async () => { await signOut(); };
  } catch {
    signOutFn = null;
  }

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (signOutFn) {
          await signOutFn();
        }
      } finally {
        // Clear app-specific localStorage keys
        try {
          localStorage.removeItem('artist-roadmap-vite-v1');
          // Remove user-scoped portfolio keys
          const keys = Object.keys(localStorage);
          for (const k of keys) {
            if (k.startsWith('artist-roadmap-portfolio-')) {
              localStorage.removeItem(k);
            }
          }
        } catch {}

        if (isMounted) {
          navigate('/sign-in', { replace: true });
        }
      }
    })();
    return () => { isMounted = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-studio p-6">
      <div className="w-full max-w-md text-center">
        <div className="text-2xl font-semibold text-surface-50 mb-2">Signing out…</div>
        <div className="text-surface-300">Please wait while we securely end your session.</div>
        <div className="mt-6 inline-block animate-spin rounded-full h-8 w-8 border-2 border-surface-600 border-t-primary-500" />
      </div>
    </div>
  );
}
