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
import { CreateOrganization } from './components/org/CreateOrganization'
import { OrganizationList } from './components/org/OrganizationList'
import { OrganizationProfile } from './components/org/OrganizationProfile'
import SpotifyCallback from './components/SpotifyCallback'
import './index.css'

// Import Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Enable Clerk only in development mode for testing
const ENABLE_CLERK = import.meta.env.DEV && CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY && import.meta.env.DEV) {
  console.warn('Missing Clerk Publishable Key. Auth features will not work.')
  console.warn('Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file')
  console.warn('See CLERK_SETUP.md for instructions')
}

// Check if this is the Spotify callback page
const isSpotifyCallback = window.location.pathname.includes('/callback') || 
                          (window.location.search.includes('code=') && window.location.search.includes('state='));

const AppRoutesWithAuth = () => (
  <HashRouter>
    <Routes>
      {/* Auth routes */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      
      {/* Organization routes */}
      <Route path="/create-organization" element={<CreateOrganization />} />
      <Route path="/organizations" element={<OrganizationList />} />
      <Route path="/organization-profile" element={<OrganizationProfile />} />
      
      {/* Spotify callback - always accessible */}
      <Route path="/callback" element={<SpotifyCallback />} />
      
      {/* Main app - requires authentication */}
      <Route 
        path="/*" 
        element={
          <SignedIn>
            <AuthenticatedApp />
          </SignedIn>
        } 
      />
      
      {/* Redirect unauthenticated users to sign-in */}
      <Route 
        path="/" 
        element={
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
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
