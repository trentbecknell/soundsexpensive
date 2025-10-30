// Cloud Portfolio Storage Manager
// Handles cloud sync with Supabase + localStorage fallback

import { Portfolio, DEFAULT_PORTFOLIO, ArtistRecord, createArtistRecord } from '../types/portfolio';
import { 
  loadPortfolioFromCloud, 
  savePortfolioToCloud, 
  getOrCreatePortfolio,
  logActivity 
} from './dataSync';
import { 
  loadPortfolio as loadFromLocalStorage, 
  savePortfolio as saveToLocalStorage 
} from './portfolioStorage';

const PORTFOLIO_KEY = 'artist-roadmap-portfolio';
const LEGACY_KEY = 'artist-roadmap-vite-v1';
const CLOUD_PORTFOLIO_ID_KEY = 'cloud-portfolio-id';

// Track if cloud is available
let cloudPortfolioId: string | null = null;

/**
 * Initialize cloud storage with user auth
 */
export async function initializeCloudStorage(userId: string, orgId: string | null = null): Promise<void> {
  try {
    console.log('🌐 Initializing cloud storage...');
    
    // Load or create portfolio in cloud
    const { portfolio, portfolio_id } = await loadPortfolioFromCloud(userId, orgId);
    
    if (portfolio_id) {
      cloudPortfolioId = portfolio_id;
      localStorage.setItem(CLOUD_PORTFOLIO_ID_KEY, portfolio_id);
      console.log('✅ Cloud storage initialized:', portfolio_id);
      
      // Check if we need to migrate localStorage data
      const localData = localStorage.getItem(PORTFOLIO_KEY) || localStorage.getItem(LEGACY_KEY);
      if (localData && portfolio && portfolio.artists.length === 0) {
        console.log('📦 Migrating localStorage to cloud...');
        const localPortfolio = loadFromLocalStorage();
        if (localPortfolio.artists.length > 0) {
          await savePortfolioToCloud(portfolio_id, localPortfolio, userId);
          await logActivity(portfolio_id, {
            user_id: userId,
            user_name: 'System',
            action: 'created',
            entity_type: 'portfolio',
            entity_id: portfolio_id,
            entity_name: 'Portfolio',
            details: { migrated: true, artistCount: localPortfolio.artists.length },
          });
          console.log('✅ Migration complete!');
        }
      }
    }
  } catch (error) {
    console.warn('⚠️  Cloud storage unavailable, using localStorage:', error);
    cloudPortfolioId = null;
  }
}

/**
 * Load portfolio from cloud (with localStorage fallback)
 */
export async function loadPortfolio(userId?: string, orgId?: string | null): Promise<Portfolio> {
  try {
    // Try cloud first if user is authenticated
    if (userId && cloudPortfolioId) {
      const { portfolio } = await loadPortfolioFromCloud(userId, orgId || null);
      if (portfolio) {
        // Also save to localStorage as cache
        saveToLocalStorage(portfolio);
        return portfolio;
      }
    }
  } catch (error) {
    console.warn('Failed to load from cloud, using localStorage:', error);
  }
  
  // Fallback to localStorage
  return loadFromLocalStorage();
}

/**
 * Save portfolio to cloud + localStorage
 */
export async function savePortfolio(
  portfolio: Portfolio, 
  userId?: string,
  userName?: string
): Promise<void> {
  // Always save to localStorage first (immediate)
  saveToLocalStorage(portfolio);
  
  // Then sync to cloud if available
  if (userId && cloudPortfolioId) {
    try {
      await savePortfolioToCloud(cloudPortfolioId, portfolio, userId);
      console.log('☁️  Synced to cloud');
    } catch (error) {
      console.warn('Failed to sync to cloud:', error);
    }
  }
}

/**
 * Add new artist (cloud-aware)
 */
export async function addArtist(
  portfolio: Portfolio, 
  artistState: any,
  userId?: string,
  userName?: string
): Promise<Portfolio> {
  const newArtist = createArtistRecord(artistState);
  const updatedPortfolio: Portfolio = {
    ...portfolio,
    artists: [...portfolio.artists, newArtist],
    activeArtistId: newArtist.id,
    lastSync: new Date().toISOString(),
  };
  
  await savePortfolio(updatedPortfolio, userId, userName);
  
  // Log activity
  if (userId && userName && cloudPortfolioId) {
    try {
      await logActivity(cloudPortfolioId, {
        user_id: userId,
        user_name: userName,
        action: 'created',
        entity_type: 'artist',
        entity_id: newArtist.id,
        entity_name: newArtist.profile.artistName,
        details: { genres: newArtist.profile.genres, city: newArtist.profile.city },
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  }
  
  return updatedPortfolio;
}

/**
 * Update existing artist (cloud-aware)
 */
export async function updateArtist(
  portfolio: Portfolio, 
  artistId: string, 
  updatedState: any,
  userId?: string,
  userName?: string
): Promise<Portfolio> {
  const artist = portfolio.artists.find(a => a.id === artistId);
  const updatedPortfolio: Portfolio = {
    ...portfolio,
    artists: portfolio.artists.map(a => {
      if (a.id === artistId) {
        return {
          ...a,
          profile: {
            artistName: updatedState.profile.artistName || a.profile.artistName,
            genres: updatedState.profile.genres,
            city: updatedState.profile.city,
          },
          state: updatedState,
          lastModified: new Date().toISOString(),
        };
      }
      return a;
    }),
    lastSync: new Date().toISOString(),
  };
  
  await savePortfolio(updatedPortfolio, userId, userName);
  
  // Log activity
  if (userId && userName && cloudPortfolioId && artist) {
    try {
      await logActivity(cloudPortfolioId, {
        user_id: userId,
        user_name: userName,
        action: 'updated',
        entity_type: 'artist',
        entity_id: artistId,
        entity_name: artist.profile.artistName,
        details: {},
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  }
  
  return updatedPortfolio;
}

/**
 * Delete artist (cloud-aware)
 */
export async function deleteArtist(
  portfolio: Portfolio, 
  artistId: string,
  userId?: string,
  userName?: string
): Promise<Portfolio> {
  const artist = portfolio.artists.find(a => a.id === artistId);
  const updatedArtists = portfolio.artists.filter(a => a.id !== artistId);
  
  let newActiveId = portfolio.activeArtistId;
  if (artistId === portfolio.activeArtistId) {
    newActiveId = updatedArtists.length > 0 ? updatedArtists[0].id : null;
  }
  
  const updatedPortfolio: Portfolio = {
    ...portfolio,
    artists: updatedArtists,
    activeArtistId: newActiveId,
    lastSync: new Date().toISOString(),
  };
  
  await savePortfolio(updatedPortfolio, userId, userName);
  
  // Log activity
  if (userId && userName && cloudPortfolioId && artist) {
    try {
      await logActivity(cloudPortfolioId, {
        user_id: userId,
        user_name: userName,
        action: 'deleted',
        entity_type: 'artist',
        entity_id: artistId,
        entity_name: artist.profile.artistName,
        details: {},
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  }
  
  return updatedPortfolio;
}

/**
 * Switch active artist (cloud-aware)
 */
export async function switchActiveArtist(
  portfolio: Portfolio, 
  artistId: string,
  userId?: string,
  userName?: string
): Promise<Portfolio> {
  const artist = portfolio.artists.find(a => a.id === artistId);
  if (!artist) {
    console.warn(`Artist ${artistId} not found in portfolio`);
    return portfolio;
  }
  
  const updatedPortfolio: Portfolio = {
    ...portfolio,
    activeArtistId: artistId,
    lastSync: new Date().toISOString(),
  };
  
  await savePortfolio(updatedPortfolio, userId, userName);
  
  return updatedPortfolio;
}

/**
 * Get cloud portfolio ID
 */
export function getCloudPortfolioId(): string | null {
  return cloudPortfolioId || localStorage.getItem(CLOUD_PORTFOLIO_ID_KEY);
}

/**
 * Check if cloud storage is available
 */
export function isCloudStorageAvailable(): boolean {
  return cloudPortfolioId !== null;
}
