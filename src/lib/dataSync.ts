import { supabase } from './supabase';
import { Portfolio, ArtistRecord } from '../types/portfolio';

/**
 * Data Sync Service
 * Handles syncing portfolio data between localStorage and Supabase
 */

export interface SyncResult {
  success: boolean;
  error?: string;
}

export interface ActivityLogEntry {
  user_id: string;
  user_name: string;
  action: 'created' | 'updated' | 'deleted';
  entity_type: 'artist' | 'budget' | 'task' | 'portfolio';
  entity_id: string;
  entity_name: string;
  details?: any;
}

/**
 * Get or create portfolio for current user/org
 */
export async function getOrCreatePortfolio(
  userId: string,
  orgId: string | null = null
): Promise<{ portfolio_id: string; data: Portfolio | null }> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Try to find existing portfolio
  const { data: existing, error: fetchError } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single();

  if (existing) {
    // Load artists for this portfolio
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('*')
      .eq('portfolio_id', existing.id)
      .order('created_at', { ascending: true });

    if (artistsError) {
      console.error('Error loading artists:', artistsError);
      return { portfolio_id: existing.id, data: null };
    }

    // Reconstruct portfolio from database
    const portfolio: Portfolio = {
      version: '1.0.0',
      artists: artists.map((a: any) => ({
        ...a.data,
        id: a.id,
      })),
      activeArtistId: existing.active_artist_id || (artists.length > 0 ? artists[0].id : null),
      settings: {
        defaultView: 'grid',
        sortBy: 'lastModified',
        sortOrder: 'desc',
      },
      lastSync: new Date().toISOString(),
    };

    return { portfolio_id: existing.id, data: portfolio };
  }

  // Create new portfolio
  const { data: newPortfolio, error: createError } = await supabase
    .from('portfolios')
    .insert({
      user_id: userId,
      org_id: orgId,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create portfolio: ${createError.message}`);
  }

  return { 
    portfolio_id: newPortfolio.id, 
    data: { 
      version: '1.0.0',
      artists: [], 
      activeArtistId: null,
      settings: {
        defaultView: 'grid',
        sortBy: 'lastModified',
        sortOrder: 'desc',
      },
      lastSync: new Date().toISOString(),
    } 
  };
}

/**
 * Save portfolio to cloud
 */
export async function savePortfolioToCloud(
  portfolioId: string,
  portfolio: Portfolio,
  userId: string
): Promise<SyncResult> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Update active artist ID
    const { error: updateError } = await supabase
      .from('portfolios')
      .update({ active_artist_id: portfolio.activeArtistId })
      .eq('id', portfolioId);

    if (updateError) throw updateError;

    // Get existing artists from DB
    const { data: existingArtists, error: fetchError } = await supabase
      .from('artists')
      .select('id')
      .eq('portfolio_id', portfolioId);

    if (fetchError) throw fetchError;

    const existingIds = new Set((existingArtists || []).map((a: any) => a.id));
    const currentIds = new Set(portfolio.artists.map(a => a.id));

    // Delete artists that are no longer in portfolio
    const toDelete = [...existingIds].filter(id => !currentIds.has(id));
    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('artists')
        .delete()
        .in('id', toDelete);

      if (deleteError) throw deleteError;
    }

    // Upsert all current artists
    for (const artist of portfolio.artists) {
      const artistData = {
        id: artist.id,
        portfolio_id: portfolioId,
        name: artist.profile.artistName,
        data: artist,
        created_by: userId,
        updated_by: userId,
      };

      const { error: upsertError } = await supabase
        .from('artists')
        .upsert(artistData);

      if (upsertError) throw upsertError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving to cloud:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load portfolio from cloud
 */
export async function loadPortfolioFromCloud(
  userId: string,
  orgId: string | null = null
): Promise<{ portfolio: Portfolio | null; portfolio_id: string | null }> {
  if (!supabase) {
    return { portfolio: null, portfolio_id: null };
  }

  try {
    const result = await getOrCreatePortfolio(userId, orgId);
    return { portfolio: result.data, portfolio_id: result.portfolio_id };
  } catch (error: any) {
    console.error('Error loading from cloud:', error);
    return { portfolio: null, portfolio_id: null };
  }
}

/**
 * Log activity for team collaboration
 */
export async function logActivity(
  portfolioId: string,
  entry: ActivityLogEntry
): Promise<void> {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('activity_log')
      .insert({
        portfolio_id: portfolioId,
        ...entry,
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Get recent activity for a portfolio
 */
export async function getRecentActivity(
  portfolioId: string,
  limit: number = 50
): Promise<any[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}

/**
 * Migrate localStorage data to cloud
 */
export async function migrateLocalStorageToCloud(
  userId: string,
  orgId: string | null = null
): Promise<SyncResult> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Get data from localStorage
    const localData = localStorage.getItem('artist-roadmap-vite-v1');
    if (!localData) {
      return { success: true }; // Nothing to migrate
    }

    const portfolio: Portfolio = JSON.parse(localData);

    // Create portfolio in cloud
    const { portfolio_id } = await getOrCreatePortfolio(userId, orgId);

    // Save to cloud
    const result = await savePortfolioToCloud(portfolio_id, portfolio, userId);

    if (result.success) {
      // Log migration
      await logActivity(portfolio_id, {
        user_id: userId,
        user_name: 'System',
        action: 'created',
        entity_type: 'portfolio',
        entity_id: portfolio_id,
        entity_name: 'Portfolio',
        details: { migrated: true, artistCount: portfolio.artists.length },
      });
    }

    return result;
  } catch (error: any) {
    console.error('Error migrating data:', error);
    return { success: false, error: error.message };
  }
}
