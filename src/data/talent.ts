import { TalentProfile } from '../types/talent';

export const TALENT_DIRECTORY: TalentProfile[] = [
  {
    id: 'tp1',
    name: 'Ava Kim',
    roles: ['Producer', 'Vocal Producer'],
    genres: ['Pop', 'R&B', 'Indie'],
    location: 'Los Angeles, CA',
    remote: true,
    perSongRate: 1200,
    rating: 4.8,
    responseTimeHours: 12,
    blurb: 'Billboard Top 40 credits, vocal production and radio-ready mixes for modern pop/R&B.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/ava' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/example' },
      { platform: 'SoundBetter', url: 'https://www.soundbetter.com/profiles/example-ava' }
    ],
    contact: { email: 'ava@example.com', preferredPlatform: 'SoundBetter' }
  },
  {
    id: 'tp2',
    name: 'Diego Martínez',
    roles: ['Mixer', 'Mastering Engineer'],
    genres: ['Hip-Hop', 'Trap', 'Pop'],
    location: 'Miami, FL',
    remote: true,
    perSongRate: 300,
    rating: 4.7,
    responseTimeHours: 24,
    blurb: 'Punchy, wide, and loud. 500+ mixes delivered with fast turnarounds. Stem and analog options.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/diego' },
      { platform: 'YouTube', url: 'https://youtube.com/@diego-mix' },
      { platform: 'AirGigs', url: 'https://www.airgigs.com/user/diego-mix' }
    ]
  },
  {
    id: 'tp3',
    name: 'Maya Chen',
    roles: ['Recording Engineer'],
    genres: ['Rock', 'Indie', 'Alt'],
    location: 'Austin, TX',
    remote: false,
    dayRate: 400,
    rating: 4.6,
    blurb: 'Live band tracking specialist. Great drum rooms and vintage mic locker.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/maya' },
      { platform: 'Instagram', url: 'https://instagram.com/maya.engineers' }
    ]
  },
  {
    id: 'tp4',
    name: 'Noah Silva',
    roles: ['Session Musician', 'Guitarist'],
    genres: ['Pop', 'Country', 'Singer-Songwriter'],
    location: 'Nashville, TN',
    remote: true,
    hourlyRate: 75,
    rating: 4.9,
    blurb: 'Tasteful Nashville guitars (electric/acoustic), hooks and layers. 48h delivery remote.',
    portfolio: [
      { platform: 'SoundCloud', url: 'https://soundcloud.com/noah-gtr' },
      { platform: 'Upwork', url: 'https://www.upwork.com/freelancers/noah-guitar' }
    ]
  },
  {
    id: 'tp5',
    name: 'Selene Park',
    roles: ['String Arranger'],
    genres: ['Cinematic', 'Pop', 'Indie'],
    location: 'New York, NY',
    remote: true,
    perSongRate: 500,
    rating: 4.8,
    blurb: 'Orchestral textures and emotional strings. MIDI mockups + real players available.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/selene' },
      { platform: 'YouTube', url: 'https://youtube.com/@selene-strings' }
    ]
  },
  {
    id: 'tp6',
    name: 'Marcus Lee',
    roles: ['Drummer', 'Live Musician'],
    genres: ['Rock', 'Funk', 'Gospel'],
    location: 'Chicago, IL',
    remote: false,
    dayRate: 350,
    rating: 4.7,
    blurb: 'Touring drummer, click-tight, pocket for days. Available for sessions and live MD work.',
    portfolio: [
      { platform: 'Instagram', url: 'https://instagram.com/marcusdrums' }
    ]
  },
  {
    id: 'tp7',
    name: 'Ivy Laurent',
    roles: ['Mastering Engineer'],
    genres: ['Electronic', 'Pop', 'House'],
    location: 'Paris, FR',
    remote: true,
    perSongRate: 90,
    rating: 4.6,
    blurb: 'Transparent or character masters. Loudness-compliant for streaming. Quick revisions.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/ivymaster' }
    ]
  },
  {
    id: 'tp8',
    name: 'RJ Carter',
    roles: ['Live MD', 'Live Musician'],
    genres: ['Hip-Hop', 'R&B', 'Pop'],
    location: 'Atlanta, GA',
    remote: false,
    dayRate: 600,
    rating: 4.9,
    blurb: 'Show design, stems, playback rigs, band contracting. Arena-ready MD services.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/rjmd' }
    ]
  },
  {
    id: 'tp9',
    name: 'Lina Duarte',
    roles: ['Songwriter'],
    genres: ['Latin Pop', 'Reggaeton', 'Pop'],
    location: 'Miami, FL',
    remote: true,
    perSongRate: 400,
    rating: 4.7,
    blurb: 'Topline melodies and Spanish/English bilingual lyrics with chart sensibilities.',
    portfolio: [
      { platform: 'SoundBetter', url: 'https://www.soundbetter.com/profiles/example-lina' }
    ]
  },
  {
    id: 'tp10',
    name: 'Blue Room Studios',
    roles: ['Recording Engineer'],
    genres: ['Pop', 'Rock', 'Indie'],
    location: 'Seattle, WA',
    remote: false,
    dayRate: 550,
    rating: 4.5,
    blurb: 'Mid-size studio with great rooms, vocal chain, and backline. Engineer included.',
    portfolio: [
      { platform: 'Website', url: 'https://example.com/blueroom' }
    ]
  }
];
