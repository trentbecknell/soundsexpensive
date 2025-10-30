import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react'
// Prevent rendering until Clerk is fully loaded
function ClerkLoader({ children }: { children: React.ReactNode }) {
  const { loaded } = useClerk();
  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#18181b' }}>
        <div style={{ color: '#a1a1aa', fontSize: 20 }}>Loading authentication...</div>
      </div>
    );
  }
  return <>{children}</>;
}
import App from './App'
import AuthenticatedApp from './components/AuthenticatedApp'
import SignInPage from './components/auth/SignInPage'
import SignUpPage from './components/auth/SignUpPage'
import SignOutPage from './components/auth/SignOutPage'
import { CreateOrganization } from './components/org/CreateOrganization'
import { OrganizationList } from './components/org/OrganizationList'
import { OrganizationProfile } from './components/org/OrganizationProfile'
import SpotifyCallback from './components/SpotifyCallback'
import './index.css'

// Import Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Read runtime auth-bypass flag from URL or localStorage
function getRuntimeAnonFlag(): boolean {
  try {
    const search = window.location.search || '';
    const hash = window.location.hash || '';

    // Support both ?anon=1 before the hash and inside the hash (e.g. #/route?anon=1)
    const hasAnonInSearch = /[?&]anon=1(?!\d)/.test(search);
    const hashQuery = hash.includes('?') ? hash.substring(hash.indexOf('?')) : '';
    const hasAnonInHash = /[?&]anon=1(?!\d)/.test(hashQuery);

    if (hasAnonInSearch || hasAnonInHash) {
      // Persist for this session so reloads stay anonymous until cleared
      localStorage.setItem('artist-roadmap-force-anon', '1');
      return true;
    }

    return localStorage.getItem('artist-roadmap-force-anon') === '1';
  } catch {
    return false;
  }
}

// Enable Clerk authentication (both dev and production) unless bypassed at runtime
const ENABLE_CLERK = !!CLERK_PUBLISHABLE_KEY && !getRuntimeAnonFlag();

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key. Running in anonymous mode.')
  console.warn('Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file')
  console.warn('See CLERK_SETUP.md for instructions')
}

// Check if this is the Spotify callback page
const isSpotifyCallback = window.location.pathname.includes('/callback') || 
                          (window.location.search.includes('code=') && window.location.search.includes('state='));

const AppRoutesWithAuth = () => (
  <HashRouter>
    <Routes>
      {/* Auth routes - accessible when signed out */}
      <Route 
        path="/sign-in/*" 
        element={
          <SignedOut>
            <SignInPage />
          </SignedOut>
        } 
      />
      <Route 
        path="/sign-up/*" 
        element={
          <SignedOut>
            <SignUpPage />
          </SignedOut>
        } 
      />

      {/* Sign out route - requires auth to execute signOut */}
      <Route 
        path="/sign-out" 
        element={
          <>
            <SignedIn>
              <SignOutPage />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        } 
      />
      
      {/* Organization routes - require auth */}
      <Route 
        path="/create-organization" 
        element={
          <SignedIn>
            <CreateOrganization />
          </SignedIn>
        } 
      />
      <Route 
        path="/organizations" 
        element={
          <SignedIn>
            <OrganizationList />
          </SignedIn>
        } 
      />
      <Route 
        path="/organization-profile" 
        element={
          <SignedIn>
            <OrganizationProfile />
          </SignedIn>
        } 
      />
      
      {/* Spotify callback - always accessible */}
      <Route path="/callback" element={<SpotifyCallback />} />
      
      {/* Main app - requires authentication */}
      <Route 
        path="/*" 
        element={
          <>
            <SignedIn>
              <AuthenticatedApp />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        } 
      />
    </Routes>
  </HashRouter>
);

const AppRoutesWithoutAuth = () => (
  <HashRouter>
    <Routes>
      {/* Spotify callback - always accessible */}
      <Route path="/callback" element={<SpotifyCallback />} />
      
      {/* Main app - no auth required (anonymous mode) */}
      <Route path="/*" element={<AuthenticatedApp />} />
    </Routes>
  </HashRouter>
);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {ENABLE_CLERK ? (
      // Clerk authentication enabled (dev mode only)
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!}>
        <ClerkLoader>
          {isSpotifyCallback ? <SpotifyCallback /> : <AppRoutesWithAuth />}
        </ClerkLoader>
      </ClerkProvider>
    ) : (
      // Anonymous mode (production and dev without Clerk key)
      <>
        {isSpotifyCallback ? <SpotifyCallback /> : <AppRoutesWithoutAuth />}
      </>
    )}
  </React.StrictMode>
)
