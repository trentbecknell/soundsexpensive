// Portfolio Management Types
// Multi-artist support for industry professionals

// Note: AppState is defined in App.tsx and will be used via generic any
// This avoids circular dependencies while maintaining type safety in App.tsx

export interface ArtistRecord {
  id: string; // Unique identifier for the artist
  profile: {
    artistName: string;
    genres: string;
    city: string;
  };
  state: any; // Complete app state for this artist (AppState from App.tsx)
  lastModified: string; // ISO date string
  createdAt: string; // ISO date string
  thumbnail?: string; // Optional: for visual identification
  tags?: string[]; // Optional: custom tags for organization
}

export interface PortfolioSettings {
  defaultView: 'grid' | 'list';
  sortBy: 'name' | 'lastModified' | 'stage' | 'genre';
  sortOrder: 'asc' | 'desc';
  genreFilter?: string;
  stageFilter?: string;
}

export interface Portfolio {
  version: string; // Schema version for migrations
  artists: ArtistRecord[];
  activeArtistId: string | null; // Currently selected artist
  settings: PortfolioSettings;
  lastSync: string; // ISO date string
}

export const DEFAULT_PORTFOLIO: Portfolio = {
  version: '1.0.0',
  artists: [],
  activeArtistId: null,
  settings: {
    defaultView: 'grid',
    sortBy: 'lastModified',
    sortOrder: 'desc',
  },
  lastSync: new Date().toISOString(),
};

// Helper functions
export function createArtistId(): string {
  return `artist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createArtistRecord(state: any): ArtistRecord {
  return {
    id: createArtistId(),
    profile: {
      artistName: state.profile.artistName || 'Unnamed Artist',
      genres: state.profile.genres,
      city: state.profile.city,
    },
    state,
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

export function updateArtistRecord(record: ArtistRecord, state: any): ArtistRecord {
  return {
    ...record,
    profile: {
      artistName: state.profile.artistName || record.profile.artistName,
      genres: state.profile.genres,
      city: state.profile.city,
    },
    state,
    lastModified: new Date().toISOString(),
  };
}
