import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import SpotifyCallback from './components/SpotifyCallback'
import './index.css'

// Check if this is the Spotify callback page
const isSpotifyCallback = window.location.pathname.includes('/callback') || 
                          (window.location.search.includes('code=') && window.location.search.includes('state='));

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSpotifyCallback ? <SpotifyCallback /> : <App />}
  </React.StrictMode>
)
