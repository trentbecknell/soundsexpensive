export type TalentRole = 
  | 'Producer'
  | 'Mixer'
  | 'Mastering Engineer'
  | 'Recording Engineer'
  | 'Vocal Producer'
  | 'Songwriter'
  | 'Session Musician'
  | 'Drummer'
  | 'Guitarist'
  | 'Bassist'
  | 'Keyboardist'
  | 'String Arranger'
  | 'Brass/Winds'
  | 'Live MD'
  | 'Live Musician';

export interface TalentPlatformLink {
  platform: 'Website' | 'SoundCloud' | 'YouTube' | 'Spotify' | 'Instagram' | 'LinkedIn' | 'SoundBetter' | 'AirGigs' | 'Upwork' | 'Vampr' | 'Other';
  url: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  roles: TalentRole[];
  genres: string[];
  location?: string;
  remote: boolean;
  hourlyRate?: number; // USD
  perSongRate?: number; // USD
  dayRate?: number; // USD
  rating?: number; // 1-5
  responseTimeHours?: number;
  blurb: string;
  portfolio: TalentPlatformLink[];
  contact?: {
    email?: string;
    website?: string;
    preferredPlatform?: TalentPlatformLink['platform'];
  };
}

export interface TalentFilter {
  role?: TalentRole;
  genre?: string;
  maxRate?: number;
  remoteOnly?: boolean;
  locationContains?: string;
}
