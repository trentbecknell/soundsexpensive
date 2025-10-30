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

// TEMPORARY: Disable Clerk auth until flow is fixed
const ENABLE_CLERK = false;

if (!CLERK_PUBLISHABLE_KEY && ENABLE_CLERK) {
  console.warn('Missing Clerk Publishable Key. Auth features will not work.')
  console.warn('Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file')
  console.warn('See CLERK_SETUP.md for instructions')
}

// Check if this is the Spotify callback page
const isSpotifyCallback = window.location.pathname.includes('/callback') || 
                          (window.location.search.includes('code=') && window.location.search.includes('state='));

const AppRoutes = () => (
  <HashRouter>
    <Routes>
      {/* Spotify callback - always accessible */}
      <Route path="/callback" element={<SpotifyCallback />} />
      
      {/* Main app - uses AuthenticatedApp wrapper for future auth support */}
      <Route path="/*" element={<AuthenticatedApp />} />
    </Routes>
  </HashRouter>
);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {CLERK_PUBLISHABLE_KEY && ENABLE_CLERK ? (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkLoader>
          {isSpotifyCallback ? <SpotifyCallback /> : <AppRoutes />}
        </ClerkLoader>
      </ClerkProvider>
    ) : (
      // Run without auth
      <>
        {isSpotifyCallback ? <SpotifyCallback /> : <AppRoutes />}
      </>
    )}
  </React.StrictMode>
)
