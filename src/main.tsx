import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import App from './App'
import SignInPage from './components/auth/SignInPage'
import SignUpPage from './components/auth/SignUpPage'
import SpotifyCallback from './components/SpotifyCallback'
import './index.css'

// Import Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key. Auth features will not work.')
  console.warn('Add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file')
  console.warn('See CLERK_SETUP.md for instructions')
}

// Check if this is the Spotify callback page
const isSpotifyCallback = window.location.pathname.includes('/callback') || 
                          (window.location.search.includes('code=') && window.location.search.includes('state='));

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth routes - accessible when signed out */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      
      {/* Spotify callback - always accessible */}
      <Route path="/callback" element={<SpotifyCallback />} />
      
      {/* Main app - protected, requires authentication */}
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <App />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {CLERK_PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        {isSpotifyCallback ? <SpotifyCallback /> : <AppRoutes />}
      </ClerkProvider>
    ) : (
      // Fallback: run without auth if Clerk not configured
      <>
        {isSpotifyCallback ? <SpotifyCallback /> : <App />}
      </>
    )}
  </React.StrictMode>
)
