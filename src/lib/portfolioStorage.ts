// Portfolio Storage Manager
// Handles localStorage operations for multi-artist portfolio

import { Portfolio, DEFAULT_PORTFOLIO, ArtistRecord, createArtistRecord } from '../types/portfolio';

/**
 * Get user-scoped localStorage key
 * If no userId provided, uses 'anonymous' for backward compatibility
 */
export function getPortfolioKey(userId?: string): string {
  const id = userId || 'anonymous';
  return `artist-roadmap-portfolio-${id}`;
}

export function getLegacyKey(userId?: string): string {
  const id = userId || 'anonymous';
  // Legacy key didn't have user scoping, so only anonymous users have it
  return id === 'anonymous' ? 'artist-roadmap-vite-v1' : `artist-roadmap-vite-v1-${id}`;
}

// Backward compatibility: Check for old non-scoped keys
const PORTFOLIO_KEY_OLD = 'artist-roadmap-portfolio';
const LEGACY_KEY_OLD = 'artist-roadmap-vite-v1';

/**
 * Load portfolio from localStorage
 * Handles migration from legacy single-artist format
 * @param userId - Optional Clerk user ID for scoping data
 */
export function loadPortfolio(userId?: string): Portfolio {
  const PORTFOLIO_KEY = getPortfolioKey(userId);
  const LEGACY_KEY = getLegacyKey(userId);
  
  try {
    // First, check for existing portfolio
    const portfolioData = localStorage.getItem(PORTFOLIO_KEY);
    if (portfolioData) {
      const portfolio: Portfolio = JSON.parse(portfolioData);
      
      // Migrate old artist states - fix lastActiveTab and onboardingComplete
      let needsSave = false;
      portfolio.artists = portfolio.artists.map(artist => {
        let migrated = false;
        
        // Fix old catalog-analyzer default
        if (artist.state.lastActiveTab === 'catalog-analyzer') {
          artist.state.lastActiveTab = 'roadmap';
          migrated = true;
        }
        
        // Ensure onboardingComplete is true (assessment is optional)
        if (artist.state.onboardingComplete === false || artist.state.onboardingComplete === undefined) {
          artist.state.onboardingComplete = true;
          migrated = true;
        }
        
        // Ensure chatPlanningComplete has a value (used for badge display)
        if (artist.state.chatPlanningComplete === undefined) {
          artist.state.chatPlanningComplete = false;
          migrated = true;
        }
        
        if (migrated) {
          needsSave = true;
          artist.lastModified = new Date().toISOString();
        }
        
        return artist;
      });
      
      // Save migrated portfolio
      if (needsSave) {
        console.log('🔄 Migrated portfolio: assessment optional, chat planning skipped by default');
        savePortfolio(portfolio, userId);
      }
      
      return portfolio;
    }

    // Check for legacy single-artist data and migrate
    const legacyData = localStorage.getItem(LEGACY_KEY);
    if (legacyData) {
      const legacyState = JSON.parse(legacyData);
      console.log('📦 Migrating legacy single-artist data to portfolio format...');
      
      const migratedArtist = createArtistRecord(legacyState);
      const newPortfolio: Portfolio = {
        ...DEFAULT_PORTFOLIO,
        artists: [migratedArtist],
        activeArtistId: migratedArtist.id,
        lastSync: new Date().toISOString(),
      };
      
      // Save migrated portfolio
      savePortfolio(newPortfolio, userId);
      
      // Keep legacy data for safety (user can clear it manually)
      console.log('✅ Migration complete! Legacy data preserved as backup.');
      
      return newPortfolio;
    }

    // No existing data, return empty portfolio
    return DEFAULT_PORTFOLIO;
  } catch (error) {
    console.error('Failed to load portfolio:', error);
    return DEFAULT_PORTFOLIO;
  }
}

/**
 * Save portfolio to localStorage
 * @param portfolio - Portfolio to save
 * @param userId - Optional Clerk user ID for scoping data
 */
export function savePortfolio(portfolio: Portfolio, userId?: string): void {
  const PORTFOLIO_KEY = getPortfolioKey(userId);
  
  try {
    portfolio.lastSync = new Date().toISOString();
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  } catch (error) {
    console.error('Failed to save portfolio:', error);
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please export and archive some artist projects.');
    }
  }
}

/**
 * Get active artist from portfolio
 */
export function getActiveArtist(portfolio: Portfolio): ArtistRecord | null {
  if (!portfolio.activeArtistId) return null;
  return portfolio.artists.find(a => a.id === portfolio.activeArtistId) || null;
}

/**
 * Add new artist to portfolio
 */
export function addArtist(portfolio: Portfolio, artistState: any): Portfolio {
  const newArtist = createArtistRecord(artistState);
  return {
    ...portfolio,
    artists: [...portfolio.artists, newArtist],
    activeArtistId: newArtist.id, // Automatically switch to new artist
    lastSync: new Date().toISOString(),
  };
}

/**
 * Update existing artist in portfolio
 */
export function updateArtist(portfolio: Portfolio, artistId: string, updatedState: any): Portfolio {
  return {
    ...portfolio,
    artists: portfolio.artists.map(artist => {
      if (artist.id === artistId) {
        return {
          ...artist,
          profile: {
            artistName: updatedState.profile.artistName || artist.profile.artistName,
            genres: updatedState.profile.genres,
            city: updatedState.profile.city,
          },
          state: updatedState,
          lastModified: new Date().toISOString(),
        };
      }
      return artist;
    }),
    lastSync: new Date().toISOString(),
  };
}

/**
 * Delete artist from portfolio
 */
export function deleteArtist(portfolio: Portfolio, artistId: string): Portfolio {
  const updatedArtists = portfolio.artists.filter(a => a.id !== artistId);
  
  // If we deleted the active artist, switch to another or null
  let newActiveId = portfolio.activeArtistId;
  if (artistId === portfolio.activeArtistId) {
    newActiveId = updatedArtists.length > 0 ? updatedArtists[0].id : null;
  }
  
  return {
    ...portfolio,
    artists: updatedArtists,
    activeArtistId: newActiveId,
    lastSync: new Date().toISOString(),
  };
}

/**
 * Switch active artist
 */
export function switchActiveArtist(portfolio: Portfolio, artistId: string): Portfolio {
  const artist = portfolio.artists.find(a => a.id === artistId);
  if (!artist) {
    console.warn(`Artist ${artistId} not found in portfolio`);
    return portfolio;
  }
  
  return {
    ...portfolio,
    activeArtistId: artistId,
    lastSync: new Date().toISOString(),
  };
}

/**
 * Search artists by name
 */
export function searchArtists(portfolio: Portfolio, query: string): ArtistRecord[] {
  const lowerQuery = query.toLowerCase();
  return portfolio.artists.filter(artist =>
    artist.profile.artistName.toLowerCase().includes(lowerQuery) ||
    artist.profile.genres.toLowerCase().includes(lowerQuery) ||
    artist.profile.city.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort artists
 */
export function sortArtists(artists: ArtistRecord[], sortBy: string, sortOrder: 'asc' | 'desc'): ArtistRecord[] {
  const sorted = [...artists].sort((a, b) => {
    let aVal: any;
    let bVal: any;
    
    switch (sortBy) {
      case 'name':
        aVal = a.profile.artistName.toLowerCase();
        bVal = b.profile.artistName.toLowerCase();
        break;
      case 'lastModified':
        aVal = new Date(a.lastModified).getTime();
        bVal = new Date(b.lastModified).getTime();
        break;
      case 'stage':
        aVal = a.state?.profile?.stage || 'Unknown';
        bVal = b.state?.profile?.stage || 'Unknown';
        break;
      case 'genre':
        aVal = a.profile.genres.toLowerCase();
        bVal = b.profile.genres.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

/**
 * Export portfolio as JSON
 */
export function exportPortfolio(portfolio: Portfolio): string {
  return JSON.stringify(portfolio, null, 2);
}

/**
 * Import portfolio from JSON
 */
export function importPortfolio(jsonString: string): Portfolio {
  try {
    const imported = JSON.parse(jsonString);
    // Validate basic structure
    if (!imported.artists || !Array.isArray(imported.artists)) {
      throw new Error('Invalid portfolio format: missing artists array');
    }
    return imported as Portfolio;
  } catch (error) {
    console.error('Failed to import portfolio:', error);
    throw new Error('Invalid portfolio JSON file');
  }
}

/**
 * Clear all portfolio data (dangerous!)
 * @param userId - Optional Clerk user ID for scoping data
 */
export function clearAllData(userId?: string): void {
  const PORTFOLIO_KEY = getPortfolioKey(userId);
  const LEGACY_KEY = getLegacyKey(userId);
  
  localStorage.removeItem(PORTFOLIO_KEY);
  localStorage.removeItem(LEGACY_KEY);
  
  // Also clear old non-scoped keys if this is anonymous user
  if (!userId || userId === 'anonymous') {
    localStorage.removeItem(PORTFOLIO_KEY_OLD);
    localStorage.removeItem(LEGACY_KEY_OLD);
  }
}
